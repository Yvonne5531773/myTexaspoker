/**
 * Created by LZH on 6/24/2017.
 */
'use strict'

let constant = require('../constant/constant')

let inquireMessage = {

    //玩家id
    user: '',
    //手中筹码
    jetton: 0,
    //剩余金币数
    money: 0,
    //本手牌累计投注额
    bet: 0,
    //最近的一次有效action
    lastValidAction: '',

    // inquires: [],

    //当前底池总金额
    potNum: 0,

}