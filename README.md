# REST API Project

**Prerequisites**
- Node.js
- PostgreSQL
- Redis
- Postman

## Controller folder

This folder contains the following files:

**committee.js** - controlls committee related operations.
- `getAllCommitteeParticipants`
- `createNewParticipant`
- `updateCommitteeParticipantRole`
- `deleteCommitteeParticipant`

**inbox.js** - controlls inbox and communications within the website.
- `getApplication`
- `createNewApplication`

**bews.js** - controlls news related operations.
- `scrapeNews`

**users.js** - controlls user related operations.
- `createNewUser`
- `getAllUsers`
- `updateUser`
- `deleteUser`
- `getDaysSinceLastPasswordChange`

## Middleware folder

This folder contains:

**authorization.js** - authorization related operations, token analyzation and parsing.
- `formatAndSetToken`
- `signJWTandSendToken`
- `verifyToken`
- `invalidateToken`

**validation.js** - validation of end - user credentials.
- `verifyUser`

## Routes Folder

This folder contains: 

**committee.js** - contains committee related routes. 
- `/committeeParticipants:committeeName` - GET
- `/committees` - POST
- `/committees/:committeeName` - PATCH
- `/committees/:committeeName` - DELETE

**inbox.js** - contains inbox and messaging related routes.
- `/inbox/:id` - GET
- `/inbox` - POST

**news.js** - contains news related routes.
- `/news` - GET

**users.js** - contains user related routes.
- `/users` - GET
- `/users` - POST
- `/loginManager/login` - POST
- `/loginManager/passwordExceeded` - POST
- `/logout` - POST
- `/users/:id` - PATCH
- `/users/:id` - DELETE


## Utilities Folder

This folder contains:
- PostgreSQL Database set up
- Redis set up
- Error handler
- SQL queries