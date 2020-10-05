var validator = require("email-validator");
let datetime = new Date();
    datetime = datetime.toISOString().slice(0,10)


// use of email_validator module to check if the mails are corrects
const validateEmail = async(emailArray, hostEmail)=> {
        try{
            let emailSet = new Set(emailArray)
            if (emailSet.size !== emailArray.length){
                throw new Error('Duplicate emails', 405);
            }
            let emails = "{" 
            let first = emailArray.shift();
            if (validator.validate(first.trim()) == false) {
                throw new Error('invalid email', 405);
            }
            else if(hostEmail == first) {
                throw new Error('host cant add himself as participant', 405);
            }
            else{
                emails += first
            }
            
            for (email of emailArray){
                if (validator.validate(email.trim()) == false) {
                    throw new Error('invalid email', 405);
                }
                else if(hostEmail == email) {
                    throw new Error('host cant add himself as participant', 405);
                }
                else{
                    emails += `, ${email}`
                }
            }
            return (emails + '}')
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

        const validData = {
            roomName: roomName,
            hostName: hostName,
            date: date,
            emailLength: data.participants.length
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
