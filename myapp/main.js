// const express = require('express');
// const passport = require('passport');
// const xsenv = require('@sap/xsenv');
// const JWTStrategy = require('@sap/xssec').JWTStrategy;

// const app = express();

// const services = xsenv.getServices({ uaa:'nodeuaa' });

// passport.use(new JWTStrategy(services.uaa));

// app.use(passport.initialize());
// app.use(passport.authenticate('JWT', { session: false }));

// app.get('/', function (req, res, next) {
//   res.send('Application user: ' + req.user.id);
// });

// const port = process.env.PORT || 3000;
// app.listen(port, function () {
//   console.log('myapp listening on port ' + port);
// });
// Instead of create-service in the command, you can use update-service



// const express = require('express');

// const users = require('./users.json');
// const app = express();

// app.use(express.json());

// app.get('/users', function (req, res) {
//     res.status(200).json(users);
// });

// app.post('/users', function (req, res) {
//   var newUser = req.body;
//   newUser.id = users.length;
//   users.push(newUser);
//   res.status(201).json(users);
// });

// const port = process.env.PORT || 3000;
// app.listen(port, function () {
//   console.log('myapp listening on port ' + port);
// });


const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const xsenv = require('@sap/xsenv');
const JWTStrategy = require('@sap/xssec').JWTStrategy;
const fs = require('fs');
const users = require('./users.json');
const app = express();

const services = xsenv.getServices({ uaa: 'nodeuaa' });

passport.use(new JWTStrategy(services.uaa));

app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.authenticate('JWT', { session: false }));

app.get('/users', function (req, res) {
  var isAuthorized = req.authInfo.checkScope('$XSAPPNAME.Display');
  if (isAuthorized) {
    res.status(200).json(users);
  } else {
    res.status(403).send('Forbidden');
  }
});

app.post('/users', function (req, res) {
  const isAuthorized = req.authInfo.checkScope('$XSAPPNAME.Update');
  if (!isAuthorized) {
    res.status(403).json('Forbidden');
    return;
  }

  var newUser = req.body;
  newUser.id = users.length;
  users.push(newUser);
  //let hi=[...users,newUser]//spread operator creates an array on top of existing array
  // Write the updated users data back to the file
  // fs.writeFile("./users.json", JSON.stringify(hi, null, 2), (err) => {
  //   if (err) {
  //     console.error('Error writing file:', err);
  //     return res.status(500).json('Error updating users data');
  //   }
  //   res.status(201).json(newUser);
  // });



  res.status(201).json(newUser);


});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('myapp listening on port ' + port);
});
