const qr = require('../utils/queries');
const xpertVald = require('./xpert_logic');
const mailUtils = require('../utils/email');
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
        let user = await qr.getUserById(req.userID);
        const participants = await xpertVald.validateEmail(req.body.participants, user.email);
        if (!participants.length){
            throw new Error('invalid email adress', 403);
        }
        // generate unique session ID 
        let sessionID = uuid.v4().slice(0,8);
        //diffrent links : 1) if only two participants host + participants 2) second link if more than two 

        let meeting_link;
        if (validate_data.emailLength == 1){
            meeting_link = 'https://xpertesy.hitprojectscenter.com/dashboard/session-wb-1on1-mix.php?sessionid=' + sessionID + '&publicRoomIdentifier='
                        + validate_data.roomName.replace(/ /g,'%20') + '&userFullName=';
        }
        else {
            meeting_link = 'https://xpertesy.hitprojectscenter.com/dashboard/session-wb-multiusers-mix.php?sessionid=' + sessionID + '&publicRoomIdentifier='
                        + validate_data.roomName.replace(/ /g,'%20') + '&userFullName=';
        }

        // participants is an array of emails without the host email
        const users = await qr.getUsersByEmail(participants);

        users.forEach(participant => {
            mailUtils.mailOptions.to = participant.email;
            mailUtils.mailOptions.subject = 'xpertesy mail test';
            mailUtils.mailOptions.html = `
            <h1>Welcome</h1>
            <p>Click the <a href=${meeting_link}${participant.first_name}%20${participant.last_name}>link</a> to enter the xpertesy chat.</p>`;

            mailUtils.transporter.sendMail(mailUtils.mailOptions, function (err, info) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('sent mail to ' + participant.first_name + ' ' + participant.last_name);
                }
            });
        });

        await qr.addRoom(meeting_link, user.user_id, participants, validate_data.date, validate_data.roomName);
        res.json({
            link: meeting_link + validate_data.hostName.replace(/ /g,'%20') // maybe replace with user.first_name and user.last_name with %20
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
            throw new Error('must provide atleast one kind of room date paramaters', 405);
        }
        let hostName = await req.body.hasOwnProperty('hostName') ? req.body.hostName : false;
        let meetingTitle = await req.body.hasOwnProperty('meetingTitle') ? req.body.meetingTitle : false;
        if (req.body.fromDate >= datetime && !isToDate){
            let tables = await qr.showFutureRooms(req.userID, hostName, meetingTitle, req.body.fromDate);
            res.json({Data: tables});
        }
        else if(req.body.toDate <= datetime && !isFromDate){
            let tables = await qr.showPastRooms(req.userID, hostName, meetingTitle, req.body.toDate);
            res.json({Data: tables});
        }
        else if (isToDate && isFromDate) {
            let tables = await qr.showBetweenRooms(req.userID, hostName, meetingTitle,req.body.fromDate, req.body.toDate);
            res.json({Data: tables});           
        }
        else{
            throw new Error('invalid dates', 405);
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
