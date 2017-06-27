/**
 * Created by LZH on 6/24/2017.
 */
'use strict'


let constant = require('../constant/constant');

let playerStatistic = ()=>{

    //统计下注量
    this.preflopBet = [];
    this.flopBet = [];
    this.turnBet = [];
    this.riverBet = [];

    //统计加注量
    this.preflopRaiseBet = [];
    this.flopRaiseBet = [];
    this.turnRaiseBet = [];
    this.riverRaiseBet = [];

    //统计加注次数
    this.watchGoodNum = [];
    this.preflopRaiseNum = 0;
    this.preflopRaiseNumFlag = false;
    this.flopRaiseNum = 0;
    this.flopRaiseNumFlag = false;
    this.turnRaiseNum = 0;
    this.turnRaiseNumFlag = false;
    this.riverRaiseNum = 0;
    this.riverRaiseNumFlag = false;
    this.isWatchedMap = new Map();
    this.raiseMax = [];
    this.followMax = [];

}

playerStatistic.prototype.getAvgPreflopBet = (playNum, avgNum)=>{
    if(playNum<1 || avgNum<1){
        return -1;
    }
    else{
        let i=playNum, sum=0, actualNum=0;
        while(playNum-i<avgNum && i>0){
            if(this.preflopBet[i]>0){
                sum=sum + this.preflopBet[i];
                actualNum++;
            }
            i--;
        }
        if(actualNum<1){
            return -1;
        }
        else{
            return sum/(actualNum);
        }
    }
}

playerStatistic.prototype.getAvgFlopBet = (playNum, avgNum)=>{
    if(playNum<1 || avgNum<1){
        return -1;
    }
    else{
        let i=playNum, sum=0, actualNum=0;
        while(playNum-i<avgNum && i>0){
            if(this.flopBet[i]>0){
                sum=sum+this.flopBet[i];
                actualNum++;
            }
            i--;
        }
        if(actualNum<1){
            return -1;
        }
        else{
            return sum/(actualNum);
        }
    }
}

playerStatistic.prototype.getAvgTurnBet = (playNum, avgNum)=>{
    if(playNum<1 || avgNum<1){
        return -1;
    }
    else{
        let i=playNum, sum=0, actualNum=0;
        while(playNum-i<avgNum && i>0){
            if(this.turnBet[i]>0){
                sum=sum+this.turnBet[i];
                actualNum++;
            }
            i--;
        }
        if(actualNum<1){
            return -1;
        }
        else{
            return sum/(actualNum);
        }
    }
}

playerStatistic.prototype.getAvgRiverBet = (playNum, avgNum)=>{
    if(playNum<1 || avgNum<1){
        return -1;
    }
    else{
        let i=playNum, sum=0, actualNum=0;
        while(playNum-i<avgNum && i>0){
            if(this.riverBet[i]>0){
                sum=sum+this.riverBet[i];
                actualNum++;
            }
            i--;
        }
        if(actualNum<1){
            return -1;
        }
        else{
            return sum/(actualNum);
        }
    }
}

//中位数
playerStatistic.prototype.getMedianPreflopBet = (playNum, avgNum)=>{
    if(playNum<1 || avgNum<1){
        return -1;
    }
    else{
        if(avgNum>playNum){
            avgNum=playNum;
        }
        let arr = this.preflopBet.slice(playNum-avgNum+1, playNum+1)
        arr.sort();
        let i=0;
        while(i<avgNum && arr[i]<0){
            i++;
        }
        return arr[(avgNum+i-1)/2];
    }
}

playerStatistic.prototype.getMedianFlopBet = (playNum, avgNum)=>{
    if(playNum<1 || avgNum<1){
        return -1;
    }
    else{
        if(avgNum>playNum){
            avgNum=playNum;
        }
        let arr = this.flopBet.slice(playNum-avgNum+1, playNum+1)
        arr.sort();
        let i=0;
        while(i<avgNum && arr[i]<0){
            i++;
        }
        return arr[(avgNum+i-1)/2];
    }
}

playerStatistic.prototype.getMedianTurnBet = (playNum, avgNum)=>{
    if(playNum<1 || avgNum<1){
        return -1;
    }
    else{
        if(avgNum>playNum){
            avgNum=playNum;
        }
        let arr = this.turnBet.slice(playNum-avgNum+1, playNum+1)
        arr.sort();
        let i=0;
        while(i<avgNum && arr[i]<0){
            i++;
        }
        return arr[(avgNum+i-1)/2];
    }
}

playerStatistic.prototype.getMedianRiverBet = (playNum, avgNum)=>{
    if(playNum<1 || avgNum<1){
        return -1;
    }
    else{
        if(avgNum>playNum){
            avgNum=playNum;
        }
        let arr = this.riverBet.slice(playNum-avgNum+1, playNum+1)
        arr.sort();
        let i=0;
        while(i<avgNum && arr[i]<0){
            i++;
        }
        return arr[(avgNum+i-1)/2];
    }
}

//平均值
playerStatistic.prototype.getAvgPreflopRaiseBet = (playNum, avgNum)=>{
    if(playNum<1 || avgNum<1){
        return -1;
    }
    else{
        let i=playNum, sum=0, actualNum=0;
        while(playNum-i<avgNum && i>0){
            if(this.preflopRaiseBet[i]>0){
                sum=sum+this.preflopRaiseBet[i];
                actualNum++;
            }
            i--;
        }
        if(actualNum<1){
            return -1;
        }
        else{
            return sum/(actualNum);
        }
    }
}

playerStatistic.prototype.getAvgFlopRaiseBet = (playNum, avgNum)=>{
    if(playNum<1 || avgNum<1){
        return -1;
    }
    else{
        let i=playNum, sum=0, actualNum=0;
        while(playNum-i<avgNum && i>0){
            if(this.flopRaiseBet[i]>0){
                sum=sum+this.flopRaiseBet[i];
                actualNum++;
            }
            i--;
        }
        if(actualNum<1){
            return -1;
        }
        else{
            return sum/(actualNum);
        }
    }
}

playerStatistic.prototype.getAvgTurnRaiseBet = (playNum, avgNum)=>{
    if(playNum<1 || avgNum<1){
        return -1;
    }
    else{
        let i=playNum, sum=0, actualNum=0;
        while(playNum-i<avgNum && i>0){
            if(this.turnRaiseBet[i]>0){
                sum=sum+this.turnRaiseBet[i];
                actualNum++;
            }
            i--;
        }
        if(actualNum<1){
            return -1;
        }
        else{
            return sum/(actualNum);
        }
    }
}

playerStatistic.prototype.getAvgRiverRaiseBet = (playNum, avgNum)=>{
    if(playNum<1 || avgNum<1){
        return -1;
    }
    else{
        let i=playNum, sum=0, actualNum=0;
        while(playNum-i<avgNum && i>0){
            if(this.riverRaiseBet[i]>0){
                sum=sum+this.riverRaiseBet[i];
                actualNum++;
            }
            i--;
        }
        if(actualNum<1){
            return -1;
        }
        else{
            return sum/(actualNum);
        }
    }
}

//中位数
playerStatistic.prototype.getMedianPreflopRaiseBet = (playNum, avgNum)=>{
    if(playNum<1 || avgNum<1){
        return -1;
    }
    else{
        if(avgNum>playNum){
            avgNum=playNum;
        }
        let arr = this.preflopRaiseBet.slice(playNum-avgNum+1, playNum+1)
        arr.sort();
        let i=0;
        while(i<avgNum && arr[i]<0){
            i++;
        }
        return arr[(avgNum+i-1)/2];
    }
}

playerStatistic.prototype.getMedianFlopRaiseBet = (playNum, avgNum)=>{
    if(playNum<1 || avgNum<1){
        return -1;
    }
    else{
        if(avgNum>playNum){
            avgNum=playNum;
        }
        let arr = this.flopRaiseBet.slice(playNum-avgNum+1, playNum+1)
        arr.sort();
        let i=0;
        while(i<avgNum && arr[i]<0){
            i++;
        }
        return arr[(avgNum+i-1)/2];
    }
}

playerStatistic.prototype.getMedianTurnRaiseBet = (playNum, avgNum)=>{
    if(playNum<1 || avgNum<1){
        return -1;
    }
    else{
        if(avgNum>playNum){
            avgNum=playNum;
        }
        let arr = this.turnRaiseBet.slice(playNum-avgNum+1, playNum+1)
        arr.sort();
        let i=0;
        while(i<avgNum && arr[i]<0){
            i++;
        }
        return arr[(avgNum+i-1)/2];
    }
}

playerStatistic.prototype.getMedianRiverRaiseBet = (playNum, avgNum)=>{
    if(playNum<1 || avgNum<1){
        return -1;
    }
    else{
        if(avgNum>playNum){
            avgNum=playNum;
        }
        let arr = this.riverRaiseBet.slice(playNum-avgNum+1, playNum+1)
        arr.sort();
        let i=0;
        while(i<avgNum && arr[i]<0){
            i++;
        }
        return arr[(avgNum+i-1)/2];
    }
}

//用于统计入局率
playerStatistic.prototype.getIncomingRate = (playNum, avgNum)=>{
    if(playNum<1 || avgNum<1){
        return -1;
    }
    else{
        let i=playNum, actualNum=0;
        while(playNum-i<avgNum && i>0){
            if(this.preflopBet[i]>0){
                actualNum++;
            }
            i--;
        }
        if(actualNum<1){
            return -1;
        }
        else{
            return actualNum/AvgNum;
        }
    }
}

module.exports = playerStatistic;











