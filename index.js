const express = require('express');
const app = express();
const request = require('request');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config({ path: process.cwd()+'/config/config.env' });
const bot = new TelegramBot(process.env.token, {polling: true});
const path = require('path');
bot.onText(/\/start/,(msg,match)=>{
  const opts = {
    reply_to_message_id: msg.message_id,
    
};
  bot.sendMessage(msg.chat.id,"Enter PNR Number to check status",opts)
});
bot.onText(/([0-9]{10})/,(msg,match)=>{
  const options = {
    method: 'GET',
    url: `${process.env.link}${msg.text}`,
    headers: {
      'x-rapidapi-key': process.env.api,
      'x-rapidapi-host': process.env.host,
    }
  };
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
  
    const test = JSON.parse(body);
    if (test.status==true){
    let msgTemplate = `
    Train Id : ${test.data.TrainNo}
    Train:${test.data.TrainName}
    Class"${test.data.Class}
    Date:${test.data.Doj}
    Expected Platform No: ${test.data.ExpectedPlatformNo}
    Boarding Station: ${test.data.BoardingStationName}
    Departure Time: ${test.data.DepartureTime}
    Destination station: ${test.data.ReservationUptoName}
    Booking Status:${test.data.PassengerStatus[0].BookingStatus}
    Reservation Upto : ${test.data.ReservationUptoName}
    Current Status: ${test.data.PassengerStatus[0].CurrentStatus}
    Chart Prepared: ${test.data.ChartPrepared?"Yes":"No"}`
    const photo = path.join(process.cwd()+'/static/train.jpg')
    bot.sendPhoto(msg.chat.id,photo,{
      caption:msgTemplate
    }
    )
  }
  else{
    const errorMsg = ` The PNR is invalid or may have been expired`;
    const photo = path.join(process.cwd()+'/static/oops.png')
    bot.sendPhoto(msg.chat.id,photo,{
      caption:errorMsg
    }
    )
  }
  });
  
});
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})