const qr = require('../utils/queries');
const xpertVald = require('./xpert_logic');
const mailUtils = require('../utils/mail/email');
const HTMLTemplate = require("../utils/mail/HTML_template");
//unique session ID module
var uuid = require('uuid');
const { validationResult } = require('express-validator');


let datetime = new Date();
datetime = datetime.toISOString().slice(0, 10);
const createRoom = async (req, res, next) => {
    try {
        //validate optional params and number of participants
        const validate_data = await xpertVald.checkCreateRoomParam(req.body);
        //validate email adress return false if invalid
        // retrieve user by token
        let user = await qr.getUserById(req.userID);
        const participants = await xpertVald.validateEmail(req.body.participants, user.email);
        if (!participants.length) {
            throw new Error('invalid email adress', 403);
        }
        // generate unique session ID 
        let sessionID = uuid.v4().slice(0, 8);
        //diffrent links : 1) if only two participants host + participants 2) second link if more than two 

        let meeting_link;
        if (validate_data.emailLength == 1) {
            meeting_link = 'https://xpertesy.hitprojectscenter.com/dashboard/session-wb-1on1-mix.php?sessionid=' + sessionID + '&publicRoomIdentifier='
                + validate_data.roomName.replace(/ /g, '+') + '&userFullName=';
        }
        else {
            meeting_link = 'https://xpertesy.hitprojectscenter.com/dashboard/session-wb-multiusers-mix.php?sessionid=' + sessionID + '&publicRoomIdentifier='
                + validate_data.roomName.replace(/ /g, '+') + '&userFullName=';
        }

        // participants is an array of emails without the host email
        const users = await qr.getUsersByEmail(participants);

        await qr.addRoom(meeting_link, user.user_id, participants, validate_data.date, validate_data.roomName);

        setEmails(users, meeting_link);
        res.json({
            link: meeting_link + validate_data.hostName.replace(/ /g, '+') // maybe replace with user.first_name and user.last_name with +
        });
    }
    catch (err) {
        next(err);
    }
};

//can get future/past rooms or between two dates
const showRooms = async (req, res, next) => {
    try {
        let isFromDate = req.body.hasOwnProperty('fromDate');
        let isToDate = req.body.hasOwnProperty('toDate');
        if (!isFromDate && !isToDate) {
            throw new Error('must provide atleast one kind of room date paramaters', 405);
        }
        let hostName = await req.body.hasOwnProperty('hostName') ? req.body.hostName : false;
        let meetingTitle = await req.body.hasOwnProperty('meetingTitle') ? req.body.meetingTitle : false;
        let tables;
        if (req.body.fromDate >= datetime && !isToDate) {
            tables = await qr.showFutureRooms(req.userID, hostName, meetingTitle, req.body.fromDate);
        }
        else if (req.body.toDate <= datetime && !isFromDate) {
            tables = await qr.showPastRooms(req.userID, hostName, meetingTitle, req.body.toDate);
        }
        else if (isToDate && isFromDate) {
            tables = await qr.showBetweenRooms(req.userID, hostName, meetingTitle, req.body.fromDate, req.body.toDate);
        }
        else {
            throw new Error('invalid dates', 405);
        }
        
        // calibrate??
        fixDates(tables);
        
        res.json({ Data: tables });
    }
    catch (err) {
        next(err)
    }
};

const fixDates = (meetings) => {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    meetings.forEach(meeting => {
        const localISOTime = (new Date(meeting.value_date - tzoffset)).toISOString().slice(0, -5).replace('T', ' ');
        meeting.value_date = localISOTime;
    });
};

const setEmails = (usersArray, meetingLink) => {
    let html;
    usersArray.forEach(user => {
        html = buildHTMLBodyForEmail(user, meetingLink);
        mailUtils.sendMail(user, 'Xpertesy Meeting', html);
    });
};
const buildHTMLBodyForEmail = (user, meetingLink) => {
    let html = HTMLTemplate.HTML_template;
    
    const monthDictionary = {
        'January': 'ינואר',
        'February': 'פברואר',
        'March': 'מרץ',
        'April': 'אפריל',
        'May': 'מאי',
        'June': 'יוני',
        'July': 'יולי',
        'August': 'אוגוסט',
        'September': 'ספטמבר',
        'October': 'אוקטובר',
        'November': 'נובמבר',
        'December': 'דצמבר'
    } 

    // html = html.replace("$1", `Xpertesy Invitation to: ${user.first_name} ${user.last_name}`);
    html = html.replace("$1", `לכבוד:
    ${user.first_name} ${user.last_name}
    -
    הוזמנת לפגישת אקספרטיזי`);
    const monthInEnglish = (new Date()).toLocaleString('en-US', { month: 'long' });
    html = html.replace("$2", monthDictionary[monthInEnglish]);
    html = html.replace("$3", (new Date()).getDate());
    //html = html.replace("$4", "We are Waiting For You!");
    html = html.replace("$4", "אנו ממתינים לך!");
    //html = html.replace("$5", "Click Here to Join Your Meeting");
    html = html.replace("$5", "נא לחץ כאן בשביל להצטרף לפגישה");
    html = html.replace("$6", meetingLink);

    return html;
};

module.exports = {
    createRoom: createRoom,
    showRooms: showRooms
};
