### Simple NodeJS + ExpressJS + TypeScript Boilerplate 

A boilerplate for starting a new project using the following technologies:


⭐ NodeJS

⭐ TypeScript

⭐ ExpressJS

⭐ JWT

⭐ DotENV

⭐ Nodemon

To get started, create .ENV file in your root project.

    ACCESS_TOKEN_SECRET='xxxxxxx'
    PASSWORD='admin'

Next, run the project. Make sure you have already installed the packages (doing npm install)

> npm run dev

To generate token, goto:

    http://localhost:5000/api/v1/login
  
To test token, pass 'Authorization' header with your token:

    Authorization: Bearer TOKEN_GENERATED
    http://localhost:5000/api/v1/user