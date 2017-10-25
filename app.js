const TelegramBot = require('node-telegram-bot-api');
 
// replace the value below with the Telegram token you receive from @BotFather
const token = '453397017:AAH3ypq1z6OscGuRlQt_RzYE9g9_o9v3aZE';
 
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

const apiaiApp = require('apiai')("7f15354fd8784fefa82137532014d187");
 
// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
	console.log("message : ", msg);
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
 
  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"
 
  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});
 
// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  
	let sender = msg.chat.id;
	let text = msg.text;
	console.log("sender = " + sender);
	console.log("text = " + text);

	var options = {    
		proxyHost: '10.31.8.34',
		proxyPort: 8080,
		sessionId: '1234'
	};

  let apiai = apiaiApp.textRequest(text, options);
  
  //console.log("aitext : ", aiText);

  apiai.on('response', (response) => {
  
   	console.log("response = " + response);
  let aiText = response.result.fulfillment.speech;
	
	// send a message to the chat acknowledging receipt of their message
	bot.sendMessage(chatId, aiText);
    

  });
  
  apiai.on('error', (error) => {
    console.log(error);
  });

  apiai.end();
});