const mailchimp = require('@mailchimp/mailchimp_marketing');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
})

mailchimp.setConfig({
  apiKey: "ac434dc06b55dc93e1b337e2195306d1-us8",
  server: "us8",
});

app.post("/", function(req, res) {
  const listId = "2a6f54e15d";

  const name = req.body.userName;
  const surname = req.body.userSurname;
  const email = req.body.userEmail;

  const subscribingUser = {
    firstName: name,
    lastName: surname,
    email: email
  };

  async function run() {
    try {
      const response = await mailchimp.lists.addListMember(listId, {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName
        }
      });

      console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}.`);
      res.sendFile(__dirname + "/success.html");

    } catch (e) {
      console.log(e.status);
      console.log("Something went wrong...");
      res.sendFile(__dirname + "/failure.html");
    }
  }

  run();
});

app.post("/failure", function(req, res) {
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() {
  console.log("Server running on port 3000...");
})

// API KEYS
// ac434dc06b55dc93e1b337e2195306d1-us8

// LIST ID
// 2a6f54e15d
