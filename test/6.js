/**
 * Created by LZH on 6/28/2017.
 */

var path = require('path');
var _ = require('lodash');
var mongoose = require('mongoose');
var playerService = require('../server/player/services/player.server.service.js');
var util = require('../server/AI/util');
var qs = require('querystring');
var config = require('../config/config'),
    BASE64 = require('../server/AI/base64'),
    constant = require('../server/constant/constant'),
    playerLink = require('../server/AI/playerLink'),
    seatInfoService = require('../server/seatinfo/services/seatInfo.service'),
    playerStatisticService = require('../server/AI/playerStatistic')

var player = function() {
    this.user = config.player.user, this.msg_id = 1, this.playNum = 0,//游戏局数
        this.seatinfos = [],
        this.holdCards = [], this.commonCards = [], this.playNum = 0,
        this.blind = 0,
        this.allUserInfor = [],//记录所有玩家信息
        this.newMoney = 100000,
        this.totalUser = 0,
        this.gameStatus = 0,
        this.statusFlag = 1,
        this.imSmallBlind = false, this.imBigBlind = false, this.checkInFlop = false, this.checkInTurn = false,
        this.checkInRiver = false, this.checkPreFlop = false, this.cardType=null, this.listenOuts=null, this.oneHasAllIn = false,
        this.listenType=null, this.iamListeningCard = false, this.winrate = 0, this.wager = 0, this.myMoney = 0, this.allUserSeatInfo = [],
        this.me = {}, this.bigBlindBet = 200, this.preflopThreshold = {}, this.avtivePlayers = 0, this.myListenWinProba = 0,
        this.smallBlindSeat = {}, this.bigBlindSeat = {}, this.otherSeats = {},
        this.jetton = 0,//现有的筹码
        this.money= 0, //现有的金币
        this.totalPot = 0, //奖池所有筹码
        this.currentNutHand = constant.holdCard.HIGH_CARD; //当前最大手牌
    this.playerStatisticTable = new Map(), //历史表
        this.money_1st=0,
        this.money_2nd=0,
        this.money_3rd=0,
        this.state = constant.state.PreFlop,
        this.state_ff1 = constant.state.PreFlop,
        this.leastRaiseBet=200, this.opponentGoodHandsNum=0, this.opponentGoodFlopLvl1Num=0, this.opponentGoodFlopLvl2Num=0, this.opponentGoodTurnLvl1Num=0, this.opponentGoodTurnLvl2Num=0, this.opponentGoodRiverLvl1Num=0, this.opponentGoodRiverLvl2Num=0,
        this.flopInqNum=0, this.curCallBet=100, this.lastCallBet=0, this.detaCallBet=100,
        this.preflopRaiseCnt=0, this.flopRaiseCnt=0, this.turnRaiseCnt=0, this.riverRaiseCnt=0, this.totalPot=0, this.playerMinJetton=32000, this.playerMaxJetton=0, this.totalMoney=100000, this.totalMoneyPerPlayer=100000, this.initJetton=2000, this.smallBlindBet=100, this.bigBlindBet=200,
        this.money_1st=0, this.money_2nd=0, this.money_3rd=0, this.preflopLoseProba=0, this.flopLoseProba=0, this.turnLoseProba=0, this.riverLoseProba=0;
}
var myself = new player();


let seatInfo1 = new seatInfoService()
seatInfo.user = '111';
seatInfo.jetton = 1000;
seatInfo.money = 1000;
seatInfo.isSmallBlind = true;
let seatInfo2 = new seatInfoService()
seatInfo.user = '222';
seatInfo.jetton = 1000;
seatInfo.money = 1000;
seatInfo.isBigBlind = true;
let seatInfo3 = new seatInfoService()
seatInfo.user = '333';
seatInfo.jetton = 1000;
seatInfo.money = 1000;

let seatInfo4 = new seatInfoService()
seatInfo.user = '444';
seatInfo.jetton = 1000;
seatInfo.money = 1000;

myself.allUserSeatInfo.push(seatInfo1)
myself.allUserSeatInfo.push(seatInfo2)
myself.allUserSeatInfo.push(seatInfo3)
myself.allUserSeatInfo.push(seatInfo4)


function onSeatInfo(player) {
    console.log('in onSeatInfo=====================')
    opponentGoodHandsNum = 0;
    opponentGoodFlopLvl1Num = 0;
    opponentGoodTurnLvl1Num = 0;
    opponentGoodRiverLvl1Num = 0;
    flopInqNum = 0;
    let link = new playerLink();
    link.setPlayerOfMe(myself);
    link.add(_.find(myself.allUserSeatInfo, {isSmallBlind: true}));
    link.add(_.find(myself.allUserSeatInfo, {isBigBlind: true}));
    // let tmp = []
    // myself.allUserSeatInfo.forEach(function(seat){
    //     if(!seat.isSmallBlind  seat.isBigBlind)
    // })
    myself.allUserInfor.forEach(function (user) {
        console.log('user', user)
        if (!user.isSmallBlind && !user.isBigBlind) {
            let seatInfo = new seatInfoService();
            seatInfo.user = user.user;
            seatInfo.jetton = user.money;
            seatInfo.money = user.money;
            myself.allUserSeatInfo.push(seatInfo)
            console.log('seatInfo user', seatInfo.user)
            link.add(seatInfo)
        }
    })
    // console.log('in onSeatInfo link GetSmallBlindSeat', link.GetSmallBlindSeat())
    let position = 0;
    console.log(' linklinklinklink', link)
    console.log('定位到小盲注的位置 link.GetSmallBlind()', link.GetSmallBlind())
    link.seek(link.GetSmallBlind());	//定位到小盲注的位置
    if (!myself.playerStatisticTable.has(link.CurrentSeat().user)) {
        myself.playerStatisticTable.set(link.CurrentSeat().user, new playerStatisticService());
    }
    // myself.money_1st=link.CurrentSeat().jetton + link.CurrentSeat().money;
    myself.money_1st = link.CurrentSeat().jetton;
    link.CurrentSeat().position = position++;

    //下注量
    console.log('下注量----11111-------- myself.playNum', myself.playNum)
    let avgPreflopBet = myself.playerStatisticTable.get(link.CurrentSeat().user).getAvgPreflopBet(myself.playNum - 1, constant.PREFLOP_THRESHOLD_CALC_NUM),
        avgFlopBet = myself.playerStatisticTable.get(link.CurrentSeat().user).getAvgFlopBet(myself.playNum - 1, constant.FLOP_THRESHOLD_CALC_NUM),
        avgTurnBet = myself.playerStatisticTable.get(link.CurrentSeat().user).getAvgTurnBet(myself.playNum - 1, myself.playNum - 1),
        avgRiverBet = myself.playerStatisticTable.get(link.CurrentSeat().user).getAvgRiverBet(myself.playNum - 1, myself.playNum - 1),
        maxAvgBet = 0,

        medianPreflopBet = myself.playerStatisticTable.get(link.CurrentSeat().user).getMedianPreflopBet(myself.playNum - 1, constant.PREFLOP_THRESHOLD_CALC_NUM),
        medianFlopBet = myself.playerStatisticTable.get(link.CurrentSeat().user).getMedianFlopBet(myself.playNum - 1, constant.FLOP_THRESHOLD_CALC_NUM),
        medianTurnBet = myself.playerStatisticTable.get(link.CurrentSeat().user).getMedianTurnBet(myself.playNum - 1, myself.playNum - 1),
        medianRiverBet = myself.playerStatisticTable.get(link.CurrentSeat().user).getMedianRiverBet(myself.playNum - 1, myself.playNum - 1),
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

    link.CurrentSeat().UpdatePreflopThreshold(avgPreflopBet, medianPreflopBet, bigBlindBet);
    link.CurrentSeat().UpdateFlopThreshold(avgFlopBet, medianFlopBet, bigBlindBet);
    link.CurrentSeat().UpdateTurnThreshold(avgTurnBet, medianTurnBet, bigBlindBet);
    link.CurrentSeat().UpdateRiverThreshold(avgRiverBet, medianRiverBet, bigBlindBet);

    //加注量
    console.log('加注量----11111--------')
    let avgPreflopRaiseBet = myself.playerStatisticTable.get(link.CurrentSeat().user).getAvgPreflopRaiseBet(myself.playNum - 1, constant.PREFLOP_THRESHOLD_CALC_NUM),
        avgFlopRaiseBet = myself.playerStatisticTable.get(link.CurrentSeat().user).getAvgFlopRaiseBet(myself.playNum - 1, constant.FLOP_THRESHOLD_CALC_NUM),
        avgTurnRaiseBet = myself.playerStatisticTable.get(link.CurrentSeat().user).getAvgTurnRaiseBet(myself.playNum - 1, myself.playNum - 1),
        avgRiverRaiseBet = myself.playerStatisticTable.get(link.CurrentSeat().user).getAvgRiverRaiseBet(myself.playNum - 1, myself.playNum - 1),
        maxAvgRaiseBet = 0,
        medianPreflopRaiseBet = myself.playerStatisticTable.get(link.CurrentSeat().user).getMedianPreflopRaiseBet(myself.playNum - 1, constant.PREFLOP_THRESHOLD_CALC_NUM),
        medianFlopRaiseBet = myself.playerStatisticTable.get(link.CurrentSeat().user).getMedianFlopRaiseBet(myself.playNum - 1, constant.FLOP_THRESHOLD_CALC_NUM),
        medianTurnRaiseBet = myself.playerStatisticTable.get(link.CurrentSeat().user).getMedianTurnRaiseBet(myself.playNum - 1, myself.playNum - 1),
        medianRiverRaiseBet = myself.playerStatisticTable.get(link.CurrentSeat().user).getMedianRiverRaiseBet(myself.playNum - 1, myself.playNum - 1),
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
    console.log('加注量----22222222222--------')
    link.CurrentSeat().UpdatePreflopRaiseThreshold(avgPreflopRaiseBet, medianPreflopRaiseBet, bigBlindBet);
    link.CurrentSeat().UpdateFlopRaiseThreshold(avgFlopRaiseBet, medianFlopRaiseBet, bigBlindBet);
    link.CurrentSeat().UpdateTurnRaiseThreshold(avgTurnRaiseBet, medianTurnRaiseBet, bigBlindBet);
    link.CurrentSeat().UpdateRiverRaiseThreshold(avgRiverRaiseBet, medianRiverRaiseBet, bigBlindBet);

    //入局率
    // console.log('入局率----111111111111-------- link', link)
    console.log('入局率----111111111111-------- link', link)
    link.CurrentSeat().incomingRate = myself.playerStatisticTable.get(link.CurrentSeat().user).getIncomingRate(myself.playNum - 1, myself.playNum - 1);

    while (link.curNextSeat().user != link.GetSmallBlindSeat().user) {

        console.log('入局率----111111111111 curNextSeat',link.curNextSeat().user)
        console.log('入局率----111111111111 curNextSeat',link.curNextSeat().position)
        console.log('入局率----111111111111 GetSmallBlindSeat',link.GetSmallBlindSeat().user)

        if (!myself.playerStatisticTable.has(link.CurrentSeat().user)) {
            myself.playerStatisticTable.set(link.CurrentSeat().user, new playerStatisticService());
        }
        //记录当前的前3名的财富值
        if (link.CurrentSeat().jetton > myself.money_1st) {
            myself.money_3rd = myself.money_2nd;
            myself.money_2nd = myself.money_1st;
            myself.money_1st = link.CurrentSeat().jetton;
        }
        else if (link.CurrentSeat().jetton > myself.money_2nd) {
            myself.money_3rd = myself.money_2nd;
            myself.money_2nd = link.CurrentSeat().jetton;
        }
        else if (link.CurrentSeat().jetton > myself.money_3rd) {
            myself.money_3rd = link.CurrentSeat().jetton;
        }
        //将每个玩家的说话顺序记录下来
        console.log('将每个玩家的说话顺序记录下来')
        link.CurrentSeat().position = position++;
        //下注量
        // avgPreflopBet = myself.playerStatisticTable.get(link.CurrentSeat().user).getAvgPreflopBet(myself.playNum - 1, myself.playNum - 1);
        // avgFlopBet = myself.playerStatisticTable.get(link.CurrentSeat().user).getAvgFlopBet(myself.playNum - 1, myself.playNum - 1);
        // avgTurnBet = myself.playerStatisticTable.get(link.CurrentSeat().user).getAvgTurnBet(myself.playNum - 1, myself.playNum - 1);
        // avgRiverBet = myself.playerStatisticTable.get(link.CurrentSeat().user).getAvgRiverBet(myself.playNum - 1, myself.playNum - 1);
        // maxAvgBet = 0;
        // medianPreflopBet = myself.playerStatisticTable.get(link.CurrentSeat().user).getMedianPreflopBet(myself.playNum - 1, myself.playNum - 1);
        // medianFlopBet = myself.playerStatisticTable.get(link.CurrentSeat().user).getMedianFlopBet(myself.playNum - 1, myself.playNum - 1);
        // medianTurnBet = myself.playerStatisticTable.get(link.CurrentSeat().user).getMedianTurnBet(myself.playNum - 1, myself.playNum - 1);
        // medianRiverBet = myself.playerStatisticTable.get(link.CurrentSeat().user).getMedianRiverBet(myself.playNum - 1, myself.playNum - 1);
        // maxMedianBet = 0;
        // if (avgFlopBet > maxAvgBet)
        //     maxAvgBet = avgFlopBet;
        // if (avgTurnBet > maxAvgBet)
        //     maxAvgBet = avgTurnBet;
        // if (avgRiverBet > maxAvgBet)
        //     maxAvgBet = avgRiverBet;
        // if (medianFlopBet > maxMedianBet)
        //     maxMedianBet = medianFlopBet;
        // if (medianTurnBet > maxMedianBet)
        //     maxMedianBet = medianTurnBet;
        // if (medianRiverBet > maxMedianBet)
        //     maxMedianBet = medianRiverBet;
        //
        // link.CurrentSeat().UpdatePreflopThreshold(avgPreflopBet, medianPreflopBet, bigBlindBet);
        // link.CurrentSeat().UpdateFlopThreshold(avgFlopBet, medianFlopBet, bigBlindBet);
        // link.CurrentSeat().UpdateTurnThreshold(avgTurnBet, medianTurnBet, bigBlindBet);
        // link.CurrentSeat().UpdateRiverThreshold(avgRiverBet, medianRiverBet, bigBlindBet);

        // //加注量
        // avgPreflopRaiseBet = myself.playerStatisticTable.get(link.CurrentSeat().user).getAvgPreflopRaiseBet(myself.playNum - 1, myself.playNum - 1);
        // avgFlopRaiseBet = myself.playerStatisticTable.get(link.CurrentSeat().user).getAvgFlopRaiseBet(myself.playNum - 1, myself.playNum - 1);
        // avgTurnRaiseBet = myself.playerStatisticTable.get(link.CurrentSeat().user).getAvgTurnRaiseBet(myself.playNum - 1, myself.playNum - 1);
        // avgRiverRaiseBet = myself.playerStatisticTable.get(link.CurrentSeat().user).getAvgRiverRaiseBet(myself.playNum - 1, myself.playNum - 1);
        // maxAvgRaiseBet = 0;
        // medianPreflopRaiseBet = myself.playerStatisticTable.get(link.CurrentSeat().user).getMedianPreflopRaiseBet(myself.playNum - 1, myself.playNum - 1);
        // medianFlopRaiseBet = myself.playerStatisticTable.get(link.CurrentSeat().user).getMedianFlopRaiseBet(myself.playNum - 1, myself.playNum - 1);
        // medianTurnRaiseBet = myself.playerStatisticTable.get(link.CurrentSeat().user).getMedianTurnRaiseBet(myself.playNum - 1, myself.playNum - 1);
        // medianRiverRaiseBet = myself.playerStatisticTable.get(link.CurrentSeat().user).getMedianRiverRaiseBet(myself.playNum - 1, myself.playNum - 1);
        // maxMedianRaiseBet = 0;
        // if (avgFlopRaiseBet > maxAvgRaiseBet)
        //     maxAvgRaiseBet = avgFlopRaiseBet;
        // if (avgTurnRaiseBet > maxAvgRaiseBet)
        //     maxAvgRaiseBet = avgTurnRaiseBet;
        // if (avgRiverRaiseBet > maxAvgRaiseBet)
        //     maxAvgRaiseBet = avgRiverRaiseBet;
        // if (medianFlopRaiseBet > maxMedianRaiseBet)
        //     maxMedianRaiseBet = medianFlopRaiseBet;
        // if (medianTurnRaiseBet > maxMedianRaiseBet)
        //     maxMedianRaiseBet = medianTurnRaiseBet;
        // if (medianRiverRaiseBet > maxMedianRaiseBet)
        //     maxMedianRaiseBet = medianRiverRaiseBet;
        //
        // link.CurrentSeat().UpdatePreflopRaiseThreshold(avgPreflopRaiseBet, medianPreflopRaiseBet, bigBlindBet);
        // link.CurrentSeat().UpdateFlopRaiseThreshold(avgFlopRaiseBet, medianFlopRaiseBet, bigBlindBet);
        // link.CurrentSeat().UpdateTurnRaiseThreshold(avgTurnRaiseBet, medianTurnRaiseBet, bigBlindBet);
        // link.CurrentSeat().UpdateRiverRaiseThreshold(avgRiverRaiseBet, medianRiverRaiseBet, bigBlindBet);
        //
        // //入局率
        // link.CurrentSeat().incomingRate = myself.playerStatisticTable.get(link.CurrentSeat().user).getIncomingRate(myself.playNum - 1, myself.playNum - 1);
        // myself.playerStatisticTable.forEach(function (value, key) {
        //     value.preflopRaiseNumFlag = false;
        //     value.flopRaiseNumFlag = false;
        //     value.turnRaiseNumFlag = false;
        //     value.riverRaiseNumFlag = false;
        //     value.isWatchedMap.set(0, false).set(1, false).set(2, false);
        //     value.preflopBet.push(-1);
        //     value.flopBet.push(-1);
        //     value.turnBet.push(-1);
        //     value.preflopBet.push(-1);
        //     value.preflopRaiseBet.push(-1);
        //     value.flopRaiseBet.push(-1);
        //     value.turnRaiseBet.push(-1);
        //     value.riverRaiseBet.push(-1);
        // })
        // myself.state = constant.state.PreFlop;
        // myself.state_ff1 = constant.state.PreFlop;
        // console.log('定位到自己的位置 link.Me()', link.Me())
        // link.seek(link.Me());	//定位到自己的位置
        // link.CurrentSeat().preflopBet = -1;
        // link.CurrentSeat().flopBet = -1;
        // link.CurrentSeat().turnBet = -1;
        // link.CurrentSeat().riverBet = -1;
        // console.log('5555555',link.curNextSeat().user)
        // console.log('5555555',link.MySeat().user)
        // while (link.curNextSeat().user !== link.MySeat().user) {
        //     link.CurrentSeat().preflopBet = -1;
        //     link.CurrentSeat().flopBet = -1;
        //     link.CurrentSeat().turnBet = -1;
        //     link.CurrentSeat().riverBet = -1;
        //
        //     link.CurrentSeat().preflopRaiseBet = -1;
        //     link.CurrentSeat().flopRaiseBet = -1;
        //     link.CurrentSeat().turnRaiseBet = -1;
        //     link.CurrentSeat().riverRaiseBet = -1;
        // }
        //
        // //如果游戏刚刚开始，那么计算所有玩家的总钱数
        // console.log('如果游戏刚刚开始')
        // if (myself.playNum === 1) {
        //     myself.totalMoneyPerPlayer = link.MySeat().jetton;
        //     myself.initJetton = link.MySeat().jetton;
        //     myself.totalMoney = myself.totalMoneyPerPlayer * link.GetPlayerNum();
        // }
        // myself.preflopRaiseCnt = 0;
        // myself.flopRaiseCnt = 0;
        // myself.turnRaiseCnt = 0;
        // myself.riverRaiseCnt = 0;
        // myself.preflopLoseProba = 1;
        // myself.flopLoseProba = 1;
        // myself.turnLoseProba = 1;
        // myself.riverLoseProba = 1;
        console.log('end =====================', myself.totalMoney)
    }
}