/**
 * Created by LZH on 6/24/2017.
 */
'use strict'

let card = require('../card/card')

let flopMessage = {

    //第一张公共牌
    card1: new card(),

    //第二张公共牌
    card2: new card(),

    //第三张公共牌
    card3: new card(),

}
// (A-K 1-13)花色[1~13:方块，14~26梅花, 						   27~39:红桃，40~52黑桃]，下同
//type  : 1:方块   2：梅花   3：红桃   4：黑桃
function tryDecode(messages){
   flopMessage.card1.type = parseInt((messages.cards[0] - 1)/13) + 1 ;
   flopMessage.card1.point = parseInt(messages.cards[0] %13) == 0 ? 13 : parseInt(messages.cards[0] %13);

   flopMessage.card2.type = parseInt((messages.cards[1] - 1)/13) + 1 ;
   flopMessage.card2.point = parseInt(messages.cards[1] %13) == 0 ? 13 : parseInt(messages.cards[0] %13);

   flopMessage.card3.type = parseInt((messages.cards[2] - 1)/13) + 1 ;
   flopMessage.card3.point = parseInt(messages.cards[2] %13) == 0 ? 13 : parseInt(messages.cards[0] %13);
}
