// /**
//  * Created by LZH on 6/24/2017.
//  */
// 'use strict'
//
// let seatInfo = require('../seatinfo/services/seatInfo.service.js')
//
//
// let seatInfoMessage = function(){
//
//     this.buttonSeat= new seatInfo()
//
//     this.smallBlindSeat= new seatInfo()
//
//     this.bigBlindSeat= new seatInfo()
//
//     this.otherSeats= []
//
//     this.totalSeatNum= 0
//
//     this.hasBigBlind= false
// }
//
// seatInfoMessage.prototype.tryDecode = function(messages){
//     console.log('in seatInfoMessage tryDecode messages', messages)
//     seatInfoMessage.totalSeatNum = 4;
//     if(messages.length > 0)
//         messages.forEach((message)=>{
//             // if(message.position == 1){
//             //     seatInfoMessage.buttonSeat.user = message.user;
//             //     seatInfoMessage.buttonSeat.jetton = message.jetton;
//             //     seatInfoMessage.buttonSeat.money = message.money;
//             // }
//             // else
//             if(message.isSmallBlind){
//                 seatInfoMessage.smallBlindSeat.user = message.user;
//                 seatInfoMessage.smallBlindSeat.jetton = message.jetton;
//                 seatInfoMessage.smallBlindSeat.money = message.money;
//             }
//             else if(message.isBigBlind){
//                 seatInfoMessage.hasBigBlind = true;
//                 seatInfoMessage.bigBlindSeat.user = message.user;
//                 seatInfoMessage.bigBlindSeat.jetton = message.jetton;
//                 seatInfoMessage.bigBlindSeat.money = message.money;
//             }else if(messages.length > 2){
//                 let seat = new seatInfo();
//                 seat.user = message.user;
//                 seat.jetton = message.jetton;
//                 seat.money = message.money;
//                 seatInfoMessage.otherSeats.push(seat);
//             }
//         });
//     return seatInfoMessage;
// }
//
//
// exports.seatInfoMessage = seatInfoMessage;
