# Github tracker

A dashboard that makes is easy to track the github activity of a selection of developers.

To run the project create a mysql database using the `db.sql` file in the root of the project.

To run start the server run `nodemon server.js` from the project folder in a terminal window.

Open the application in a browser `http://localhost:3000`

## Github key

Set your github token as an environment variable:

`export GITHUB_TOKEN = <your GITHUB KEY>`

To not hit github's [RateLimit](https://developer.github.com/v3/#rate-limiting)

## Auto generate React JavaScript

To auto generate the React source code run gulp script in a terminal window. Open a seperate terminal in the root of the project and run `gulp`, this will regenerate the `app.react.js` in the public folder. You need to edit the `react/app.react.jsx` file.
