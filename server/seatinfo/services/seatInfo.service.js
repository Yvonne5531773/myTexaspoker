/**
 * Created by LZH on 6/24/2017.
 */

var seatInfo = function() {

    this.user = '';     // 玩家名字
    this.position = -1;
    this.bet = 0;           // 表明当前的下注额
    this.wager = 0;           // 用户当前牌局已经投入的筹码
    this.user_status = 0;   // 用户当前状态
    this.inquireHistory = [];   // 该玩家的状态列表

    this.jetton = 0;    // 表明剩余筹码数
    this.money = 0;     // 表明剩余金币数

    this.isSmallBlind = false;
    this.isBigBlind = false;
    this.isButton = false;
    this.isFold = false;     //表明是否已弃牌
    this.isAllin = false;	//表明是否已allin

    this.positionIndex = 0;
    this.preflopBet = 0;
    this.preflopRaiseBet = 0;
    this.flopBet = 0;
    this.flopRaiseBet = 0;
    this.turnBet = 0;
    this.turnRaiseBet = 0;
    this.riverBet = 0;
    this.riverRaiseBet = 0;

    this.avgPreflopBet = 0;
    this.preflopLvl1Threshold = 0;
    this.avgFlopBet = 0;
    this.flopLvl1Threshold = 0;
    this.flopLvl2Threshold = 0;
    this.avgTurnBet = 0;
    this.turnLvl1Threshold = 0;
    this.turnLvl2Threshold = 0;
    this.avgRiverBet = 0;
    this.riverLvl1Threshold = 0;
    this.riverLvl2Threshold = 0;

    //对手加注阈值
    this.avgPreflopRaiseBet = 0;
    this.preflopRaiseLvl1Threshold = 0;

    this.avgFlopRaiseBet = 0;
    this.flopRaiseLvl1Threshold = 0;
    this.flopRaiseLvl2Threshold = 0;

    this.avgTurnRaiseBet = 0;
    this.turnRaiseLvl1Threshold = 0;
    this.turnRaiseLvl2Threshold = 0;

    this.avgRiverRaiseBet = 0;
    this.riverRaiseLvl1Threshold = 0;
    this.riverRaiseLvl2Threshold = 0;

    this.incomingRate = 0;

    this.hasGoodHand = false;
    this.hasGoodFlopLvl1 = false;
    this.hasGoodFlopLvl2 = false;
    this.hasGoodTurnLvl1 = false;
    this.hasGoodTurnLvl2 = false;
    this.hasGoodRiverLvl1 = false;
    this.hasGoodRiverLvl2 = false;

}

/*
 * 下注量阈值
 */
seatInfo.prototype.UpdatePreflopThreshold = (avgPreflopBet, medianPreflopBet, bigBlindBet)=>{
    this.avgPreflopBet = avgPreflopBet;
    this.preflopLvl1Threshold=avgPreflopBet+medianPreflopBet;	//平均数和中位数平均之后再乘以2
    if(this.preflopLvl1Threshold<4*bigBlindBet){
        this.preflopLvl1Threshold=4*bigBlindBet;
    }
}

seatInfo.prototype.UpdateFlopThreshold = (avgFlopBet, medianFlopBet, bigBlindBet) =>{
    this.avgFlopBet = avgFlopBet;
    this.flopLvl1Threshold=(avgFlopBet+medianFlopBet)/2;
    if(this.flopLvl1Threshold<4*bigBlindBet){
        this.flopLvl1Threshold=4*bigBlindBet;
    }
    this.flopLvl2Threshold=this.flopLvl1Threshold*5/2;
    if(this.flopLvl2Threshold<8*bigBlindBet){
        this.flopLvl2Threshold=8*bigBlindBet;
    }
}

seatInfo.prototype.UpdateTurnThreshold = (avgTurnBet, medianTurnBet, bigBlindBet) => {
    this.avgTurnBet = avgTurnBet;
    this.turnLvl1Threshold=(avgTurnBet+medianTurnBet)/2;
    this.turnLvl2Threshold=this.turnLvl1Threshold*5/2;
    if(this.turnLvl1Threshold<4*bigBlindBet){
        this.turnLvl1Threshold=4*bigBlindBet;
    }
    if(this.turnLvl2Threshold<8*bigBlindBet){
        this.turnLvl2Threshold=8*bigBlindBet;
    }
}

seatInfo.prototype.UpdateRiverThreshold = (avgRiverBet, medianRiverBet, bigBlindBet) => {
    this.avgRiverBet = avgRiverBet;
    this.riverLvl1Threshold=(avgRiverBet+medianRiverBet)/2;
    this.riverLvl2Threshold=avgRiverBet*5/2;
    if(this.riverLvl1Threshold<4*bigBlindBet){
        this.riverLvl1Threshold=4*bigBlindBet;
    }
    if(this.riverLvl2Threshold<8*bigBlindBet){
        this.riverLvl2Threshold=8*bigBlindBet;
    }
}

/*
 * 加注量阈值
 */
seatInfo.prototype.UpdatePreflopRaiseThreshold = (avgPreflopRaiseBet, medianPreflopRaiseBet, bigBlindBet)=> {
    this.avgPreflopRaiseBet = avgPreflopRaiseBet;
    this.preflopRaiseLvl1Threshold=medianPreflopRaiseBet;
    if(this.preflopRaiseLvl1Threshold<4*bigBlindBet){
        this.preflopRaiseLvl1Threshold=4*bigBlindBet;
    }
}

seatInfo.prototype.UpdateFlopRaiseThreshold = (avgFlopRaiseBet, medianFlopRaiseBet, bigBlindBet)=> {
    this.avgFlopRaiseBet = avgFlopRaiseBet;
    this.flopRaiseLvl1Threshold=(medianFlopRaiseBet+avgFlopRaiseBet)/2;
    if(this.flopRaiseLvl1Threshold<4*bigBlindBet){
        this.flopRaiseLvl1Threshold=4*bigBlindBet;
    }
    this.flopRaiseLvl2Threshold=medianFlopRaiseBet*2;
    if(this.flopRaiseLvl2Threshold<8*bigBlindBet){
        this.flopRaiseLvl2Threshold=8*bigBlindBet;
    }
}

seatInfo.prototype.UpdateTurnRaiseThreshold = (avgTurnRaiseBet, medianTurnRaiseBet, bigBlindBet)=> {
    this.avgTurnRaiseBet = avgTurnRaiseBet;
    this.turnRaiseLvl1Threshold=(medianTurnRaiseBet+avgTurnRaiseBet)/2;
    this.turnRaiseLvl2Threshold=medianTurnRaiseBet*2;
    if(this.turnRaiseLvl1Threshold<4*bigBlindBet){
        this.turnRaiseLvl1Threshold=4*bigBlindBet;
    }
    if(this.turnRaiseLvl2Threshold<8*bigBlindBet){
        this.turnRaiseLvl2Threshold=8*bigBlindBet;
    }
}

seatInfo.prototype.UpdateRiverRaiseThreshold = (avgRiverRaiseBet, medianRiverRaiseBet, bigBlindBet)=> {
    this.avgRiverRaiseBet = avgRiverRaiseBet;
    this.riverRaiseLvl1Threshold=(medianRiverRaiseBet+avgRiverRaiseBet)/2;
    this.riverRaiseLvl2Threshold=medianRiverRaiseBet*2;
    if(this.riverRaiseLvl1Threshold<4*bigBlindBet){
        this.riverRaiseLvl1Threshold=4*bigBlindBet;
    }
    if(this.riverRaiseLvl2Threshold<8*bigBlindBet){
        this.riverRaiseLvl2Threshold=8*bigBlindBet;
    }
}

module.exports = seatInfo;