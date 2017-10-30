const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var pageAccessToken = 'EAAXkcs07pZB4BAFqdaqFjAsUZBPC3dIBVw4tDTzNZB4R0PoNsZAR2biVQQ9rtGLz5b5KnZB1Syw2WtXrj8cX5s0qvAbX7gkf2pIjs872O0WUpZBtZAUZA0YuZAmRNt1xPOePZCMLcYSO65PUFqKvyyYDl0bW9yPon5EZAY6ZCbSw2w7RPAZDZD';

const server = app.listen(process.env.PORT || 6001, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'pwc_bot') {
    res.status(200).send(req.query['hub.challenge']);
  } else {
    res.status(403).end();
  }
});

/* Handling all messenges */
app.post('/webhook', (req, res) => {
  console.log(req.body);
  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        if (event.message && event.message.text) {
          sendMessage(event);
        }
      });
    });
    res.status(200).end();
  }
});

const request = require('request');
const apiaiApp = require('apiai')("2a1b259d1e254187af88eb9ec2d5ce84");

function sendMessage(event) {
  let sender = event.sender.id;
  let text = event.message.text;
console.log("sender = " + sender);
console.log("text = " + text);
  let apiai = apiaiApp.textRequest(text, {
    sessionId: '1234' // use any arbitrary id
  });

  apiai.on('response', (response) => {
  
   	console.log("response = " + response);
  let aiText = response.result.fulfillment.speech;

    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token: pageAccessToken},
      method: 'POST',
      json: {
        recipient: {id: sender},
        message: {text: aiText}
      }
    }, (error, response) => {
      if (error) {
          console.log('Error sending message: ', error);
      } else if (response.body.error) {
          console.log('Error: ', response.body.error);
      }
    });

  });

  apiai.on('error', (error) => {
    console.log(error);
  });

  apiai.end();
}
