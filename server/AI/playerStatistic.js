/**
 * Created by LZH on 6/24/2017.
 */
'use strict'


// let constant = require('../constant/constant');

var playerStatistic = function(){

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

    this.getRaiseMax = function(index) {
        return this.raiseMax[index];
    }
    this.setRaiseMax = function(index, val) {
        this.raiseMax[index] = val;
    }

    this.GetIsWatchedMap = function(index) {
        return this.isWatchedMap[index];
    }
    this.setIsWatchedMap = function(index, val) {
        this.isWatchedMap[index] = val;
    }

    this.getWatchGoodNum = function(index) {
        return this.watchGoodNum[index];
    }
    this.setWatchGoodNum = function(index, val) {
        this.watchGoodNum[index] = val;
    }
    this.addWatchGoodNum = function(index) {
        this.watchGoodNum[index] += 1;
    }

    this.getFollowMax = function(index) {
        return this.followMax[index];
    }
    this.setFollowMax = function(index, val) {
        this.followMax[index] = val;
    }
    this.getPreflopRaiseNum = function() {
        return this.preflopRaiseNum;
    }

    this.setPreflopRaiseNum = function(preflopRaiseNum) {
        this.preflopRaiseNum = preflopRaiseNum;
    }
    this.addPreflopRaiseNum = function() {
        this.preflopRaiseNum += 1;
    }
    this.getFlopRaiseNum = function() {
        return this.flopRaiseNum;
    }
    this.setFlopRaiseNum = function(flopRaiseNum) {
        this.flopRaiseNum = flopRaiseNum;
    }
    this.addFlopRaiseNum = function() {
        this.flopRaiseNum += 1;
    }
    this.getTurnRaiseNum = function() {
        return this.turnRaiseNum;
    }
    this.setTurnRaiseNum = function(turnRaiseNum) {
        this.turnRaiseNum = turnRaiseNum;
    }
    this.addTurnRaiseNum = function() {
        this.turnRaiseNum += 1;
    }
    this.getRiverRaiseNum = function() {
        return this.riverRaiseNum;
    }
    this.setRiverRaiseNum = function(riverRaiseNum) {
        this.riverRaiseNum = riverRaiseNum;
    }
    this.addRiverRaiseNum = function() {
        this.riverRaiseNum += 1;
    }
    this.isPreflopRaiseNumFlag = function() {
        return this.preflopRaiseNumFlag;
    }
    this.setPreflopRaiseNumFlag = function(preflopRaiseNumFlag) {
        this.preflopRaiseNumFlag = preflopRaiseNumFlag;
    }
    this.isFlopRaiseNumFlag = function() {
        return this.flopRaiseNumFlag;
    }
    this.setFlopRaiseNumFlag = function(flopRaiseNumFlag) {
        this.flopRaiseNumFlag = flopRaiseNumFlag;
    }
    this.isTurnRaiseNumFlag = function() {
        return this.turnRaiseNumFlag;
    }
    this.setTurnRaiseNumFlag = function(turnRaiseNumFlag) {
        this.turnRaiseNumFlag = turnRaiseNumFlag;
    }

    this.isRiverRaiseNumFlag = function() {
        return this.riverRaiseNumFlag;
    }

    this.setRiverRaiseNumFlag = function(riverRaiseNumFlag) {
        this.riverRaiseNumFlag = riverRaiseNumFlag;
    }

    this.getPreflopBet = function(index){
        return this.preflopBet[index];
    }

    this.setPreflopBet = function(index, val) {
        this.preflopBet[index] = val;
    }

    this.getFlopBet = function(index) {
        return this.flopBet[index];
    }
    this.setFlopBet = function(index, val) {
        this.flopBet[index] = val;
    }

    this.getTurnBet = function(index) {
        return this.turnBet[index];
    }
    this.setTurnBet = function(index, val) {
        this.turnBet[index] = val;
    }

    this.getRiverBet = function(index) {
        return this.riverBet[index];
    }
    this.setRiverBet = function(index, val) {
        this.riverBet[index] = val;
    }
    this.getPreflopRaiseBet = function(index) {
        return this.preflopRaiseBet[index];
    }
    this.setPreflopRaiseBet = function(index, val) {
        this.preflopRaiseBet[index] = val;
    }

    this.getFlopRaiseBet = function(index) {
        return this.flopRaiseBet[index];
    }
    this.setFlopRaiseBet = function(index, val) {
        this.flopRaiseBet[index] = val;
    }

    this.getTurnRaiseBet = function(index) {
        return this.turnRaiseBet[index];
    }
    this.setTurnRaiseBet = function(index, val) {
        this.turnRaiseBet[index] = val;
    }

    this.getRiverRaiseBet = function(index) {
        return this.riverRaiseBet[index];
    }
    this.setRiverRaiseBet = function(index, val) {
        this.riverRaiseBet[index] = val;
    }
    this.getAvgPreflopBet = function(playNum, avgNum){
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

    this.getAvgFlopBet = (playNum, avgNum)=>{
        if(playNum<1 || avgNum<1){
            return -1;
        }
        else{
            let i=playNum, sum=0, actualNum=0;
            console.log('this.flopBet', this.flopBet)
            console.log('playNum', playNum)
            console.log('avgNum', avgNum)
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

    this.getAvgTurnBet = (playNum, avgNum)=>{
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

    this.getAvgRiverBet = (playNum, avgNum)=>{
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

    this.getMedianPreflopBet = (playNum, avgNum)=>{
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

    this.getMedianFlopBet = (playNum, avgNum)=>{
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

    this.getMedianTurnBet = (playNum, avgNum)=>{
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

    this.getMedianRiverBet = (playNum, avgNum)=>{
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
    this.getAvgPreflopRaiseBet = (playNum, avgNum)=>{
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

    this.getAvgFlopRaiseBet = (playNum, avgNum)=>{
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

    this.getAvgTurnRaiseBet = (playNum, avgNum)=>{
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

    this.getAvgRiverRaiseBet = (playNum, avgNum)=>{
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
    this.getMedianPreflopRaiseBet = (playNum, avgNum)=>{
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

    this.getMedianFlopRaiseBet = (playNum, avgNum)=>{
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

    this.getMedianTurnRaiseBet = (playNum, avgNum)=>{
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

    this.getMedianRiverRaiseBet = (playNum, avgNum)=>{
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
    this.getIncomingRate = (playNum, avgNum)=>{
        console.log('getIncomingRate')
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
}


module.exports = playerStatistic;











