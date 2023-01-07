const request = require('request');
const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv').config({ path: process.cwd()+'/config/config.env' });
const bot = new TelegramBot(process.env.token, {polling: true});
const path = require('path');
const axios = require('axios')
bot.onText(/\/start/,(msg,match)=>{
  const opts = {
    reply_to_message_id: msg.message_id,
    
};
  bot.sendMessage(msg.chat.id,"Enter PNR Number to check status",opts)
});
const TELEGRAM_API = 'https://api.telegram.org/bot5781386859:AAFD7kDv6O6LZwPZmciPGIrMPFLCZq92Mcs';
const webhookURL = 'https://three-owls-tell-49-36-180-239.loca.lt/';
const setupWebhook =  axios.get(`${TELEGRAM_API}/setWebhook?url=${webhookURL}&drop_pending_updates=true`)
console.log(setupWebhook.then((data)=>{
  console.log(data)
}));
bot.onText(/([0-9]{10})/,(msg,match)=>{
  const options = {
    method: 'GET',
    url: `https://pnr-status-indian-railway.p.rapidapi.com/pnr-check/${msg.text}`,
    headers: {
      'X-RapidAPI-Key': '87a80b466dmsh924448c924c3311p155a2ajsn7b4c4cef9d7b',
      'X-RapidAPI-Host': 'pnr-status-indian-railway.p.rapidapi.com',
      useQueryString: true
    }
  };
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
  
    const test = JSON.parse(body);
    if (test.code==200){
    let msgTemplate = `
    Train Id : ${test.data.boardingInfo.trainId}
    Train:${test.data.trainInfo.name}
    Date:${test.data.trainInfo.dt}
    Boarding Station: ${test.data.boardingInfo.stationName}
    Departure Time: ${test.data.boardingInfo.departureTime}
    Destination station: ${test.data.destinationInfo.stationName}
    Coach:${test.data.seatInfo.coach}
    Bearth: ${test.data.seatInfo.berth}`
    // bot.sendMessage(msg.chat.id,msgTemplate);
    const photo = path.join(process.cwd()+'/static/train.jpg')
    bot.sendPhoto(msg.chat.id,photo,{
      caption:msgTemplate
    }
    )
  }
  else{
    const errorMsg = `${test.error.split(".")[0]}. The PNR is invalid or may have been expired`;
    const photo = path.join(process.cwd()+'/static/oops.png')
    bot.sendPhoto(msg.chat.id,photo,{
      caption:errorMsg
    }
    )
  }
  });
  
});