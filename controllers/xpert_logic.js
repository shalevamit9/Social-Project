var validator = require("email-validator");
let datetime = new Date();
    datetime = datetime.toISOString().slice(0,10)


// use of email_validator module to check if the mails are corrects
const validateEmail = async(participants, hostEmail)=> {
        try{
            let emailArray = await participants.replace('{', '').replace('}','').replace(' ', '').split(',');
            let emailSet = new Set(emailArray)
            if (emailSet.size !== emailArray.length){
                console.log(emailArray.length)
                console.log(emailSet.length)
                throw new Error('Duplicate emails', 405);
            }
            let emails = []
            for (let email of participants.replace('{', '').replace('}','').replace(' ', '').split(',')) { 
                if (validator.validate(email.trim()) == false) {
                    throw new Error('invalid email', 405);
                }
                else if(hostEmail == email) {
                    throw new Error('host cant add himself as participant', 405);
                }
                else{
                    emails.push(email);
                }
            }
            return emails;
        }
        catch(err){
            throw err;
        }
        
}

// check which params we got from UI and return to the function them + number of participants
const checkCreateRoomParam = async(data)=> {
    try{
        if (!data.hasOwnProperty('participants')){
            throw new Error('Must provide participants')
        }
        let roomName = data.hasOwnProperty('roomName') ? data.roomName: 'MeetingTitle';
        let hostName = data.hasOwnProperty('hostName') ? data.hostName: 'MyName';
        let date = data.hasOwnProperty('date') ? data.date: datetime;
        let emails = []
        for (let email of data.participants.split(',')) { 
                emails.push(email)
            }
        const validData = {
            roomName: roomName,
            hostName: hostName,
            date: date,
            emailLength: emails.length
        };
        return validData;
    }
    catch(err){
        throw err
    }
}

module.exports = { 
    validateEmail: validateEmail,
    checkCreateRoomParam: checkCreateRoomParam
};
