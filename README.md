# REST API Project

## Controller folder

This folder contains the following files:

**committee.js** - controlls committee related operations.
- `getAllCommitteeParticipants`

**inbox.js** - controlls inbox and communications within the website.
- `createNewApplication`

**users.js** - controlls user related operations.
- `createNewUser`
- `getAllUsers`
- `updateUser`
- `deleteUser`

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
- `/committeeParticipants`
- `/committees`

**inbox.js** - contains inbox and messaging related routes.
- `/inbox`

**users.js** - contains user related routes.
- `/users` - GET
- `/users` - POST
- `/login`
- `/logout`
- `/users/:id` - PATCH
- `users/:id` - DELETE

## Utilities Folder

This folder contains:
- PostgreSQL Database set up
- Error handler
- SQL queries