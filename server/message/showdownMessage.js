/**
 * Created by LZH on 6/24/2017.
 */
'use strict'

/**
 * 摊牌消息，含5张公共牌、被摊牌选手的2张手牌及其最佳手牌牌型
 *
 */

let card = require('../card/card'),
    constant = require('../constant/constant');

let showdownMessage = {

    commonCards: [],

    //第一张手牌
    rankHoldCards1: new card(),

    //第二张手牌
    rankHoldCards2: new card(),

    //最大手牌牌型
    rankHoldCardsType: '',

    //摊牌的人数
    playerNum: 0,

}
function tryDecode(messages){

}
