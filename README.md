# ContactApp

### UNIVERSITY PROJECT
FIM UHK, TNPW2

### Setup Database

Software requirements: `mongoDB comunity server, MongoDB Compass (optional but recomended)`
Aviable at: https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/, https://www.mongodb.com/try/download/compass

1. Connect to your Localhost `Localhost:27017`

### Setup Project

1. Run `npm i` installation of node_modules
2. `OPTIONAL` Run `node seed/script.js` insert test data to DB
3. Run `npm run dev` run premade script using nodemon

### Project Control
1. Genereated logins and passwords: `admin:admin, James:James`

Used technologies: bcrypt, body-parser, ejs, express, express-session, mongoose, nodemon, passport, passport-local, passport-local-mongoose, path
Solved problems: User(Register, Login, Auth, LogOut), CRUD OPERATIONS (with Contacts)

**Any modification are displayed automaticly `CMD + S / CTRL + S` in any `.js` file.**
