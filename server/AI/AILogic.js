/**
 * Created by LZH on 6/24/2017.
 */
'use strict'

let seatInfoMessage = require('../message/seatInfoMessage'),
    blindMessage = require('../message/blindMessage'),
    holdCardsMessage = require('../message/holdCardsMessage'),
    flopMessage = require('../message/flopMessage'),
    turnMessage = require('../message/turnMessage'),
    riverMessage = require('../message/riverMessage'),
    showdownMessage = require('../message/showdownMessage'),
    gameOverMessage = require('../message/gameOverMessage'),
    inquireMessage = require('../message/inquireMessage'),
    constant = require('../constant/constant'),
    playerLink = require('../AI/playerLink'),
    playerStatistic = require('../AI/playerStatistic');

function AI(player){

    this.player = player;
    this.state_ff1 = constant.state.PreFlop;
    this.playNum = 0;   //游戏局数
    this.playerStatisticTable = new Map();  //对手的阈值表，记录了对手的每一个阶段的加注，跟注的最大值

    this.leastRaiseBet = 100;

    this.opponentGoodHandsNum = 0;
    this.opponentGoodFlopLvl1Num = 0;
    this.opponentGoodFlopLvl2Num = 0;
    this.opponentGoodTurnLvl1Num = 0;
    this.opponentGoodTurnLvl2Num = 0;
    this.opponentGoodRiverLvl1Num = 0;
    this.opponentGoodRiverLvl2Num = 0;

    this.flopInqNum=0;
    this.curCallBet=100;
    this.lastCallBet=0;
    this.detaCallBet=100;

    pthis.preflopRaiseCnt=0;
    this.flopRaiseCnt=0;
    this.turnRaiseCnt=0;
    this.riverRaiseCnt=0;

    this.totalPot=0;
    this.playerMinJetton=32000;
    this.playerMaxJetton=0;
    this.totalMoney=32000;
    this.totalMoneyPerPlayer=4000;
    this.initJetton=2000;
    this.smallBlindBet=20;
    this.bigBlindBet=40;

    //记录当前剩余筹码最多前三
    this.money_1st=0;
    this.money_2nd=0;
    this.money_3rd=0;

    //每个阶段输掉概率
    this.preflopLoseProba=0;
    this.flopLoseProba=0;
    this.turnLoseProba=0;
    this.riverLoseProba=0;

    //两张手牌的概率
    this.handProbaTable=[
        [
            [0.410695,0.410695,0.410695,0.251532,0.256569,0.261734,0.256071,0.252141,0.263164,0.277190,0.296240,0.321995,0.350896,0.381930,0.423914],
            [0.410695,0.410695,0.410695,0.251532,0.256569,0.261734,0.256071,0.252141,0.263164,0.277190,0.296240,0.321995,0.350896,0.381930,0.423914],
            [0.410695,0.410695,0.410695,0.251532,0.256569,0.261734,0.256071,0.252141,0.263164,0.277190,0.296240,0.321995,0.350896,0.381930,0.423914],
            [0.251506,0.251506,0.251506,0.430785,0.269674,0.275629,0.269751,0.265305,0.265299,0.281364,0.301818,0.327588,0.356467,0.387542,0.429313],
            [0.256347,0.256347,0.256347,0.269424,0.452695,0.288810,0.283571,0.279032,0.279291,0.285214,0.308064,0.333855,0.362457,0.393689,0.435196],
            [0.261758,0.261758,0.261758,0.275541,0.288614,0.474763,0.296938,0.293157,0.294458,0.300939,0.313427,0.341406,0.370301,0.401380,0.442670],
            [0.256516,0.256516,0.256516,0.269818,0.283599,0.296932,0.498163,0.308413,0.310809,0.318111,0.330705,0.348371,0.379127,0.410841,0.444607],
            [0.252154,0.252154,0.252154,0.265557,0.279117,0.292740,0.308147,0.518567,0.325218,0.333320,0.347234,0.365065,0.386150,0.419355,0.454989],
            [0.263118,0.263118,0.263118,0.265257,0.279224,0.294445,0.310553,0.325664,0.541047,0.349036,0.363304,0.381865,0.403265,0.427980,0.464858],
            [0.276879,0.276879,0.276879,0.281764,0.285269,0.301235,0.318057,0.333179,0.348998,0.563352,0.379951,0.398466,0.420143,0.444675,0.473953],
            [0.296173,0.296173,0.296173,0.301980,0.308088,0.313452,0.330856,0.346847,0.363066,0.379970,0.588608,0.416796,0.438024,0.463093,0.492676],
            [0.322511,0.322511,0.322511,0.327793,0.333570,0.341686,0.348821,0.365396,0.381959,0.398385,0.416445,0.612520,0.447406,0.472871,0.502493],
            [0.350659,0.350659,0.350659,0.356321,0.362750,0.370284,0.379566,0.386205,0.403466,0.419601,0.437920,0.447434,0.636720,0.481777,0.512376],
            [0.382055,0.382055,0.382055,0.387672,0.393669,0.401621,0.410399,0.419320,0.427686,0.444785,0.462947,0.472696,0.482071,0.661313,0.521236],
            [0.423471,0.423471,0.423471,0.429269,0.434899,0.442468,0.444488,0.454869,0.464725,0.474283,0.492961,0.502480,0.512147,0.521594,0.687177]
        ],
        [
            [0.000000,0.000000,0.000000,0.283031,0.287705,0.292789,0.287567,0.283423,0.294322,0.307324,0.325396,0.350127,0.376800,0.406593,0.445859],
            [0.000000,0.000000,0.000000,0.283031,0.287705,0.292789,0.287567,0.283423,0.294322,0.307324,0.325396,0.350127,0.376800,0.406593,0.445859],
            [0.000000,0.000000,0.000000,0.283031,0.287705,0.292789,0.287567,0.283423,0.294322,0.307324,0.325396,0.350127,0.376800,0.406593,0.445859],
            [0.283031,0.283031,0.283031,0.000000,0.299962,0.305326,0.300136,0.295950,0.296040,0.311399,0.330383,0.355019,0.382125,0.412009,0.450631],
            [0.287705,0.287705,0.287705,0.299962,0.000000,0.317513,0.312830,0.308907,0.308645,0.314853,0.335780,0.360254,0.387385,0.416986,0.456002],
            [0.292789,0.292789,0.292789,0.305326,0.317513,0.000000,0.324801,0.321547,0.322949,0.328990,0.340747,0.367045,0.394406,0.423758,0.463176],
            [0.287567,0.287567,0.287567,0.300136,0.312830,0.324801,0.000000,0.336198,0.338166,0.344622,0.356823,0.374058,0.402939,0.432808,0.464419],
            [0.283423,0.283423,0.283423,0.295950,0.308907,0.321547,0.336198,0.000000,0.351672,0.358984,0.371748,0.388983,0.409006,0.440308,0.474039],
            [0.294322,0.294322,0.294322,0.296040,0.308645,0.322949,0.338166,0.351672,0.000000,0.373991,0.387040,0.404698,0.425427,0.448035,0.482866],
            [0.307324,0.307324,0.307324,0.311399,0.314853,0.328990,0.344622,0.358984,0.373991,0.000000,0.402322,0.419618,0.440255,0.463743,0.491300],
            [0.325396,0.325396,0.325396,0.330383,0.335780,0.340747,0.356823,0.371748,0.387040,0.402322,0.000000,0.436867,0.456952,0.480741,0.508762],
            [0.350127,0.350127,0.350127,0.355019,0.360254,0.367045,0.374058,0.388983,0.404698,0.419618,0.436867,0.000000,0.465679,0.489491,0.518164],
            [0.376800,0.376800,0.376800,0.382125,0.387385,0.394406,0.402939,0.409006,0.425427,0.440255,0.456952,0.465679,0.000000,0.498861,0.527235],
            [0.406593,0.406593,0.406593,0.412009,0.416986,0.423758,0.432808,0.440308,0.448035,0.463743,0.480741,0.489491,0.498861,0.000000,0.535915],
            [0.445859,0.445859,0.445859,0.450631,0.456002,0.463176,0.464419,0.474039,0.482866,0.491300,0.508762,0.518164,0.527235,0.535915,0.000000]
        ],
    ];
    //两张手牌的中位数
    this.handLvlTable = [
        [
            [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10],
            [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10],
            [10,10,7,10,10,10,10,10,10,10,10,10,10,10,10],
            [10,10,10,7,10,10,10,10,10,10,10,10,10,10,10],
            [10,10,10,10,7,8,10,10,10,10,10,10,10,10,10],
            [10,10,10,10,8,7,8,10,10,10,10,10,10,10,10],
            [10,10,10,10,10,8,7,8,10,10,10,10,10,10,10],
            [10,10,10,10,10,10,8,6,8,10,10,10,10,10,10],
            [10,10,10,10,10,10,10,8,5,7,8,8,10,10,10],
            [10,10,10,10,10,10,10,10,7,4,7,7,8,8,8],
            [10,10,10,10,10,10,10,10,8,7,3,10,6,6,5],
            [10,10,10,10,10,10,10,10,8,7,10,3,6,6,5],
            [10,10,10,10,10,10,10,10,10,8,6,6,1,5,3],
            [10,10,10,10,10,10,10,10,10,8,6,6,5,1,3],
            [10,10,10,10,10,10,10,10,10,8,5,5,3,3,1]
        ],
        [
            [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10],
            [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10],
            [10,10,10,8,8,10,10,10,10,10,10,10,10,7,6],
            [10,10,8,10,7,8,10,10,10,10,10,10,10,7,6],
            [10,10,8,7,10,8,7,8,10,10,10,10,10,7,6],
            [10,10,10,8,8,10,8,7,8,10,10,10,10,7,6],
            [10,10,10,10,7,8,10,10,8,8,10,10,10,7,6],
            [10,10,10,10,8,7,10,10,7,7,10,8,10,7,6],
            [10,10,10,10,10,8,8,7,10,7,7,7,7,7,5],
            [10,10,10,10,10,10,8,7,7,10,6,6,6,6,5],
            [10,10,10,10,10,10,10,10,7,6,10,6,5,4,3],
            [10,10,10,10,10,10,10,8,7,6,6,10,4,4,3],
            [10,10,10,10,10,10,10,10,7,6,5,4,10,3,2],
            [10,10,7,7,7,7,7,7,7,6,4,4,3,10,2],
            [10,10,6,6,6,6,6,6,5,5,3,3,2,2,10]
        ],
    ];
}

//收到座次消息
AI.prototype.OnSeatInfoMessageReceived = function(message){
    console.log('in OnSeatInfoMessageReceived', message)
    this.playNum++;
    //这一局的对手各阶段整体概况
    this.opponentGoodHandsNum=0;
    this.opponentGoodFlopLvl1Num=0;
    this.opponentGoodFlopLvl2Num=0;
    this.opponentGoodTurnLvl1Num=0;
    this.opponentGoodTurnLvl2Num=0;
    this.opponentGoodRiverLvl1Num=0;
    this.opponentGoodRiverLvl2Num=0;

    this.flopInqNum=0;
    this.playerLink = playerLink.setPlayerOfMe(this);
    playerLink.add(message.smallBlindSeat)
    playerLink.add(message.bigBlindSeat)
    if(!_.isEmpty(message.otherSeats))
        message.otherSeats.forEach(function(o){
            playerLink.add(o)
        })
    // playerLink.add(message.buttonSeat);

    let positionIndex=0;
    playerLink.seek(playerLink.GetSmallBlind());
    if(!this.playerStatisticTable.has(playerLink.CurrentSeat().user)){
        this.playerStatisticTable.set(playerLink.CurrentSeat().user, new playerStatistic());
    }
    this.money_1st = playerLink.CurrentSeat().getJetton() + playerLink.CurrentSeat().getMoney();

    playerLink.CurrentSeat().positionIndex = positionIndex;
    this.positionIndex++;

    //下注量
    let avgPreflopBet = this.playerStatisticTable.get(playerLink.CurrentSeat().user).getAvgPreflopBet(this.playNum-1, Constant.PREFLOP_THRESHOLD_CALC_NUM),
        avgFlopBet = this.playerStatisticTable.get(playerLink.CurrentSeat().user).getAvgFlopBet(this.playNum-1, constant.FLOP_THRESHOLD_CALC_NUM),
        avgTurnBet = this.playerStatisticTable.get(playerLink.CurrentSeat().user).getAvgTurnBet(this.playNum-1, this.playNum-1),
        avgRiverBet = this.playerStatisticTable.get(playerLink.CurrentSeat().user).getAvgRiverBet(this.playNum-1, this.playNum-1),
        maxAvgBet=0,

        medianPreflopBet = this.playerStatisticTable.get(playerLink.CurrentSeat().user).getMedianPreflopBet(this.playNum-1, constant.PREFLOP_THRESHOLD_CALC_NUM),
        medianFlopBet = this.playerStatisticTable.get(playerLink.CurrentSeat().user).getMedianFlopBet(this.playNum-1, constant.FLOP_THRESHOLD_CALC_NUM),
        medianTurnBet = this.playerStatisticTable.get(playerLink.CurrentSeat().user).getMedianTurnBet(this.playNum-1, this.playNum-1),
        medianRiverBet = this.playerStatisticTable.get(playerLink.CurrentSeat().user).getMedianRiverBet(this.playNum-1, this.playNum-1),
        maxMedianBet = 0;

    if(avgFlopBet > maxAvgBet)
        maxAvgBet = avgFlopBet;
    if(avgTurnBet > maxAvgBet)
        maxAvgBet = avgTurnBet;
    if(avgRiverBet > maxAvgBet)
        maxAvgBet = avgRiverBet;

    if(medianFlopBet>maxMedianBet)
        maxMedianBet=medianFlopBet;
    if(medianTurnBet>maxMedianBet)
        maxMedianBet=medianTurnBet;
    if(medianRiverBet>maxMedianBet)
        maxMedianBet=medianRiverBet;

    playerLink.CurrentSeat().UpdatePreflopThreshold(avgPreflopBet,medianPreflopBet,bigBlindBet);
    playerLink.CurrentSeat().UpdateFlopThreshold(avgFlopBet,medianFlopBet,bigBlindBet);
    playerLink.CurrentSeat().UpdateTurnThreshold(avgTurnBet,medianTurnBet,bigBlindBet);
    playerLink.CurrentSeat().UpdateRiverThreshold(avgRiverBet,medianRiverBet,bigBlindBet);

    //加注量
    let avgPreflopRaiseBet= this.playerStatisticTable.get(playerLink.CurrentSeat().user).getAvgPreflopRaiseBet(this.playNum-1, constant.PREFLOP_THRESHOLD_CALC_NUM),
    avgFlopRaiseBet= this.playerStatisticTable.get(playerLink.CurrentSeat().user).getAvgFlopRaiseBet(this.playNum-1, constant.FLOP_THRESHOLD_CALC_NUM),
    avgTurnRaiseBet= this.playerStatisticTable.get(playerLink.CurrentSeat().user).getAvgTurnRaiseBet(this.playNum-1, this.playNum-1),
    avgRiverRaiseBet= this.playerStatisticTable.get(playerLink.CurrentSeat().user).getAvgRiverRaiseBet(this.playNum-1, this.playNum-1),
    maxAvgRaiseBet=0,
        medianPreflopRaiseBet=this.playerStatisticTable.get(playerLink.CurrentSeat().user).getMedianPreflopRaiseBet(this.playNum-1, constant.PREFLOP_THRESHOLD_CALC_NUM),
    medianFlopRaiseBet=this.playerStatisticTable.get(playerLink.CurrentSeat().user).getMedianFlopRaiseBet(this.playNum-1, constant.FLOP_THRESHOLD_CALC_NUM),
    medianTurnRaiseBet=this.playerStatisticTable.get(playerLink.CurrentSeat().user).getMedianTurnRaiseBet(this.playNum-1, this.playNum-1),
    medianRiverRaiseBet=this.playerStatisticTable.get(playerLink.CurrentSeat().user).getMedianRiverRaiseBet(this.playNum-1, this.playNum-1),
    maxMedianRaiseBet=0;

    if(avgFlopRaiseBet>maxAvgRaiseBet)
        maxAvgRaiseBet=avgFlopRaiseBet;
    if(avgTurnRaiseBet>maxAvgRaiseBet)
        maxAvgRaiseBet=avgTurnRaiseBet;
    if(avgRiverRaiseBet>maxAvgRaiseBet)
        maxAvgRaiseBet=avgRiverRaiseBet;

    if(medianFlopRaiseBet>maxMedianRaiseBet)
        maxMedianRaiseBet=medianFlopRaiseBet;
    if(medianTurnRaiseBet>maxMedianRaiseBet)
        maxMedianRaiseBet=medianTurnRaiseBet;
    if(medianRiverRaiseBet>maxMedianRaiseBet)
        maxMedianRaiseBet=medianRiverRaiseBet;
    playerLink.CurrentSeat().UpdatePreflopRaiseThreshold(avgPreflopRaiseBet,medianPreflopRaiseBet,bigBlindBet);
    playerLink.CurrentSeat().UpdateFlopRaiseThreshold(avgFlopRaiseBet,medianFlopRaiseBet,bigBlindBet);
    playerLink.CurrentSeat().UpdateTurnRaiseThreshold(avgTurnRaiseBet,medianTurnRaiseBet,bigBlindBet);
    playerLink.CurrentSeat().UpdateRiverRaiseThreshold(avgRiverRaiseBet,medianRiverRaiseBet,bigBlindBet);

    //入局率
    playerLink.CurrentSeat().incomingRate = this.playerStatisticTable.get(playerLink.CurrentSeat().user).getIncomingRate(this.playNum-1, this.playNum-1);
    while(playerLink.NextSeat().user != playerLink.GetSmallBlindSeat().user) {
        if (!this.playerStatisticTable.has(playerLink.CurrentSeat().user)) {
            this.playerStatisticTable.set(playerLink.CurrentSeat().user, new playerStatistic());
        }
        //记录当前的前3名的财富值
        if (playerLink.CurrentSeat().jetton + playerLink.CurrentSeat().money > this.money_1st) {
            this.money_3rd = money_2nd;
            this.money_2nd = money_1st;
            this.money_1st = playerLink.CurrentSeat().jetton + playerLink.CurrentSeat().money;
        }
        else if (playerLink.CurrentSeat().jetton + playerLink.CurrentSeat().money > this.money_2nd) {
            this.money_3rd = money_2nd;
            this.money_2nd = playerLink.CurrentSeat().jetton + playerLink.CurrentSeat().money;
        }
        else if (playerLink.CurrentSeat().jetton + playerLink.CurrentSeat().money > this.money_3rd) {
            this.money_3rd = playerLink.CurrentSeat().jetton + playerLink.CurrentSeat().money;
        }

        //将每个玩家的说话顺序记录下来
        playerLink.CurrentSeat().positionIndex = positionIndex;
        positionIndex++;

        //下注量
        avgPreflopBet = this.playerStatisticTable.get(playerLink.CurrentSeat().user).getAvgPreflopBet(this.playNum - 1, this.playNum - 1);
        avgFlopBet = this.playerStatisticTable.get(playerLink.CurrentSeat().user).getAvgFlopBet(this.playNum - 1, this.playNum - 1);
        avgTurnBet = this.playerStatisticTable.get(playerLink.CurrentSeat().user).getAvgTurnBet(this.playNum - 1, this.playNum - 1);
        avgRiverBet = this.playerStatisticTable.get(playerLink.CurrentSeat().user).getAvgRiverBet(this.playNum - 1, this.playNum - 1);
        maxAvgBet = 0;

        medianPreflopBet = this.playerStatisticTable.get(playerLink.CurrentSeat().user).getMedianPreflopBet(this.playNum - 1, this.playNum - 1);
        medianFlopBet = this.playerStatisticTable.get(playerLink.CurrentSeat().user).getMedianFlopBet(this.playNum - 1, this.playNum - 1);
        medianTurnBet = this.playerStatisticTable.get(playerLink.CurrentSeat().user).getMedianTurnBet(this.playNum - 1, this.playNum - 1);
        medianRiverBet = this.playerStatisticTable.get(playerLink.CurrentSeat().user).getMedianRiverBet(this.playNum - 1, this.playNum - 1);
        maxMedianBet = 0;

        if (avgFlopBet > maxAvgBet)
            maxAvgBet = avgFlopBet;
        if (avgTurnBet > maxAvgBet)
            maxAvgBet = avgTurnBet;
        if (avgRiverBet > maxAvgBet)
            maxAvgBet = avgRiverBet;

        if (medianFlopBet > maxMedianBet)
            maxMedianBet = medianFlopBet;
        if (medianTurnBet > maxMedianBet)
            maxMedianBet = medianTurnBet;
        if (medianRiverBet > maxMedianBet)
            maxMedianBet = medianRiverBet;

        playerLink.CurrentSeat().UpdatePreflopThreshold(avgPreflopBet, medianPreflopBet, bigBlindBet);
        playerLink.CurrentSeat().UpdateFlopThreshold(avgFlopBet, medianFlopBet, bigBlindBet);
        playerLink.CurrentSeat().UpdateTurnThreshold(avgTurnBet, medianTurnBet, bigBlindBet);
        playerLink.CurrentSeat().UpdateRiverThreshold(avgRiverBet, medianRiverBet, bigBlindBet);

        //加注量
        avgPreflopRaiseBet = this.playerStatisticTable.get(playerLink.CurrentSeat().user).getAvgPreflopRaiseBet(this.playNum - 1, this.playNum - 1);
        avgFlopRaiseBet = this.playerStatisticTable.get(playerLink.CurrentSeat().user).getAvgFlopRaiseBet(this.playNum - 1, this.playNum - 1);
        avgTurnRaiseBet = this.playerStatisticTable.get(playerLink.CurrentSeat().user).getAvgTurnRaiseBet(this.playNum - 1, this.playNum - 1);
        avgRiverRaiseBet = this.playerStatisticTable.get(playerLink.CurrentSeat().user).getAvgRiverRaiseBet(this.playNum - 1, this.playNum - 1);
        maxAvgRaiseBet = 0;

        medianPreflopRaiseBet = this.playerStatisticTable.get(playerLink.CurrentSeat().user).getMedianPreflopRaiseBet(this.playNum - 1, this.playNum - 1);
        medianFlopRaiseBet = this.playerStatisticTable.get(playerLink.CurrentSeat().user).getMedianFlopRaiseBet(this.playNum - 1, this.playNum - 1);
        medianTurnRaiseBet = this.playerStatisticTable.get(playerLink.CurrentSeat().user).getMedianTurnRaiseBet(this.playNum - 1, this.playNum - 1);
        medianRiverRaiseBet = this.playerStatisticTable.get(playerLink.CurrentSeat().user).getMedianRiverRaiseBet(this.playNum - 1, this.playNum - 1);
        maxMedianRaiseBet = 0;

        if (avgFlopRaiseBet > maxAvgRaiseBet)
            maxAvgRaiseBet = avgFlopRaiseBet;
        if (avgTurnRaiseBet > maxAvgRaiseBet)
            maxAvgRaiseBet = avgTurnRaiseBet;
        if (avgRiverRaiseBet > maxAvgRaiseBet)
            maxAvgRaiseBet = avgRiverRaiseBet;

        if (medianFlopRaiseBet > maxMedianRaiseBet)
            maxMedianRaiseBet = medianFlopRaiseBet;
        if (medianTurnRaiseBet > maxMedianRaiseBet)
            maxMedianRaiseBet = medianTurnRaiseBet;
        if (medianRiverRaiseBet > maxMedianRaiseBet)
            maxMedianRaiseBet = medianRiverRaiseBet;

        playerLink.CurrentSeat().UpdatePreflopRaiseThreshold(avgPreflopRaiseBet, medianPreflopRaiseBet, bigBlindBet);
        playerLink.CurrentSeat().UpdateFlopRaiseThreshold(avgFlopRaiseBet, medianFlopRaiseBet, bigBlindBet);
        playerLink.CurrentSeat().UpdateTurnRaiseThreshold(avgTurnRaiseBet, medianTurnRaiseBet, bigBlindBet);
        playerLink.CurrentSeat().UpdateRiverRaiseThreshold(avgRiverRaiseBet, medianRiverRaiseBet, bigBlindBet);

        //入局率
        playerLink.CurrentSeat().incomingRate = this.playerStatisticTable.get(playerLink.CurrentSeat().user).getIncomingRate(this.playNum - 1, this.playNum - 1);

        this.playerStatisticTable.forEach(function(value, key){
            console.log('in playerStatisticTable forEach',value)
            value.preflopRaiseNumFlag = false;
            value.flopRaiseNumFlag = false;
            value.turnRaiseNumFlag = false;
            value.riverRaiseNumFlag = false;
            value.isWatchedMap.set(0, false).set(1, false).set(2, false);

            value.preflopBet.push(-1);
            value.flopBet.push(-1);
            value.turnBet.push(-1);
            value.preflopBet.push(-1);

            value.preflopRaiseBet.push(-1);
            value.flopRaiseBet.push(-1);
            value.turnRaiseBet.push(-1);
            value.riverRaiseBet.push(-1);
        })

        this.state = constant.state.PreFlop;
        this.state_ff1 = constant.state.PreFlop;
        playerLink.Seek(playerLink.Me());	//定位到自己的位置
        playerLink.CurrentSeat().preflopBet = -1;
        playerLink.CurrentSeat().flopBet = -1;
        playerLink.CurrentSeat().turnBet = -1;
        playerLink.CurrentSeat().riverBet = -1;
        while(playerLink.NextSeat().user!=playerLink.MySeat().user){
            playerLink.CurrentSeat().preflopBet = -1;
            playerLink.CurrentSeat().flopBet = -1;
            playerLink.CurrentSeat().turnBet = -1;
            playerLink.CurrentSeat().riverBet = -1;

            playerLink.CurrentSeat().preflopRaiseBet = -1;
            playerLink.CurrentSeat().flopRaiseBet = -1;
            playerLink.CurrentSeat().turnRaiseBet = -1;
            playerLink.CurrentSeat().riverRaiseBet = -1;
        }

        //如果游戏刚刚开始，那么计算所有玩家的总钱数
        if(this.playNum === 1){
            this.totalMoneyPerPlayer=playerLink.MySeat().jetton+playerLink.MySeat().money;
            this.initJetton=playerLink.MySeat().jetton;
            this.totalMoney=this.totalMoneyPerPlayer*playerLink.GetPlayerNum();
        }
        this.preflopRaiseCnt=0;this.flopRaiseCnt=0;this.turnRaiseCnt=0;this.riverRaiseCnt=0;
        this.preflopLoseProba=1;this.flopLoseProba=1;this.turnLoseProba=1;this.riverLoseProba=1;
    }
}


module.exports = AI;