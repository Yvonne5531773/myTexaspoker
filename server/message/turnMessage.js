/**
 * Created by LZH on 6/24/2017.
 */
'use strict'

let card = require('../card/card')

let turnMessage = {

    card: new card(),

}
// (A-K 1-13)花色[1~13:方块，14~26梅花, 						   27~39:红桃，40~52黑桃]，下同
//type  : 1:方块   2：梅花   3：红桃   4：黑桃
function tryDecode(messages){
   turnMessage.card.type = parseInt((messages.cards[0] - 1)/13) + 1 ;
   turnMessage.card.point = parseInt(messages.cards[0] %13) == 0 ? 13 : parseInt(messages.cards[0] %13);
}
