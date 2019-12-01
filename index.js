const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const request = require("request");

const secrets = require('./secrets.js');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function (req, res) {
  res.sendFile(__dirname+"/index.html");
});

app.post("/", function(req, res) {
  console.log(req.body);
  let fname = req.body.firstName;
  let lname = req.body.lastName;
  let email = req.body.inputEmail;
  console.log(` fname is ${fname} lname is ${lname} and email is ${email}`);
  console.log(`API_KEY is ${secrets.API_KEY} and LIST_ID is ${secrets.LIST_ID}`);

  const baseURL = 'https://us4.api.mailchimp.com/3.0';
  const data = {
    members: [
      {
          email_address: email,
          status: 'subscribed'
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const options = {
    url: `${baseURL}/lists/${secrets.LIST_ID}`,
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'Authorization': `ankur ${secrets.API_KEY}`
    },
    body: jsonData
  };

  console.log(`Input Data : ${JSON.stringify(options, null, 2)}`);

  request(options, function(err, response, body) {
    if(err) {
      res.send('There was an error.');
    } else {
      if(response.status === 200) {
        res.sendFile(__dirname+"/success.html");
      } else {
        res.sendFile(__dirname+"/error.html");
      }
    }
  });

});

app.listen(port, function () {
  console.log("Server Started");
});
