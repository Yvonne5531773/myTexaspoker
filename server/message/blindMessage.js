/**
 * Created by LZH on 6/24/2017.
 */
'use strict'

exports.tryDecode = tryDecode;

let blindMessage = {

    smallBlindUser: '',

    smallBlindBet: 0,

    bigBlindUser: '',

    bigBlindBet: 0,

    hasBigBlind: false,

}

function tryDecode(messages){
    console.log('in blindMessage tryDecode messages', messages)
    if(messages.length > 0){
        messages.forEach((message)=> {
            if (message.isSmallBlind) {
                blindMessage.smallBlindUser = message.user;
                blindMessage.smallBlindBet = message.jetton;
            } else if (message.isBigBlind) {
                blindMessage.bigBlindUser = message.user;
                blindMessage.bigBlindBet = message.jetton;
                blindMessage.hasBigBlind = true;
            }
        })
    }
    return blindMessage;
}