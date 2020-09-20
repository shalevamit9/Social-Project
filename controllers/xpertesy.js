const qr = require('../utils/queries');
const xpertVald = require('./xpert_logic')
//unique session ID module
var uuid = require('uuid');


let datetime = new Date();
    datetime = datetime.toISOString().slice(0,10)
const createRoom = async (req, res, next) => {
    try{
        //validate optional params and number of participants
        const validate_data = await xpertVald.checkCreateRoomParam(req.body);
        //validate email adress return false if invalid
        // retrieve user by token
        let user = await qr.getUserByToken(req.headers.token)
        const participants = await xpertVald.validateEmail(req.body.participants, user.email);
        if (participants == false){
            throw new Error('invalid email adress', 403);
        }
        // generate unique session ID 
        let sessionID = uuid.v4().slice(0,8)
        //diffrent links : 1) if only two participants host + participants 2) second link if more than two 
        if (validate_data.emailLength == 1){
            var meeting_link = 'https://xpertesy.hitprojectscenter.com/dashboard/session-wb-1on1-mix.php?sessionid=' + sessionID + '&publicRoomIdentifier='
                        + validate_data.roomName.replace(/ /g,'%20') + '&userFullName='

        }
        else {
            var meeting_link = 'https://xpertesy.hitprojectscenter.com/dashboard/session-wb-multiusers-mix.php?sessionid=' + sessionID + '&publicRoomIdentifier='
                        + validate_data.roomName.replace(/ /g,'%20') + '&userFullName='


        }

        await qr.addRoom(meeting_link, user.user_id, req.body.participants, validate_data.date, validate_data.roomName)
        res.json({
            link: meeting_link + validate_data.hostName.replace(/ /g,'%20')
        });  
    }       
    catch(err){
        next(err);
    }
}

//can get future/past rooms or between two dates
const showRooms = async(req, res, next) => {
    try{ 
        let isFromDate = req.body.hasOwnProperty('fromDate');
        let isToDate = req.body.hasOwnProperty('toDate');
        if (!isFromDate && !isToDate){
            throw new Error('must provide atleast one kind of room paramaters', 405);
        }
        let hostName = await req.body.hasOwnProperty('hostName') ? req.body.hostName : false;
        let meetingTitle = await req.body.hasOwnProperty('meetingTitle') ? req.body.meetingTitle : false;
        if (req.body.fromDate >= datetime && !isToDate){
            let tables = await qr.showFutureRooms(req.headers.token, hostName, meetingTitle, datetime);
            res.json({Data: tables});
        }
        else if(req.body.toDate <= datetime && !isFromDate){
            let tables = await qr.showPastRooms(req.headers.token, hostName, meetingTitle, datetime);
            res.json({Data: tables});
        }
        else if (isToDate && isFromDate) {
            let tables = await qr.showBetweenRooms(req.headers.token, hostName, meetingTitle,req.body.fromDate, req.body.toDate);
            res.json({Data: tables});           
        }
        else{
            throw new Error('invalid dates', 405)
        }
    }
    catch(err){
        next(err)
    }
}

module.exports = {
    createRoom: createRoom,
    showRooms: showRooms
};
