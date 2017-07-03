/**
 * Created by LZH on 6/24/2017.
 */
'use strict'
let _ = require('lodash'),
    constant = require('../constant/constant')

let util = {

    listenCard: function(cards){
        let cardList = _.cloneDeep(cards);
        let handCards = cardList.splice(0, 2);
        cardList.sort(util.sortCardList);
        let sizeOfCards = cards.length;
        let ret = new Map(),
            temp = [],
            maxType = constant.holdCard.HIGH_CARD,
            maxCardList = [];
        if (sizeOfCards===5){
            for (let i = 0; i < 3; i++) {
                temp = _.cloneDeep(cardList);
                temp.splice(i, 1);
                let result = util.calclistenCardIn4(handCards.concat(temp).sort(util.sortCardList));
                if (!_.isEmpty(result)){
                    let type = result.get("type");
                    if (type >= maxType){
                        maxType = type;
                        maxCardList = _.cloneDeep(result.get("cardList"))
                    }
                }
            }
        }else if (sizeOfCards === 6){
            for (let i = 0; i <4 ; i++) {
                for (let j = i; j < 4; j++) {
                    temp = _.cloneDeep(cardList);
                    temp.splice(i, 1);
                    temp.splice(j, 1);
                    let result = util.calclistenCardIn4(handCards.concat(temp).sort(util.sortCardList));
                    if (!_.isEmpty(result)){
                        let type = result.get("type");
                        if (type > maxType){
                            maxType = type;
                            maxCardList = _.cloneDeep(result.get("cardList"))
                        }
                    }
                }
            }
        }else{
            return null;
        }
        if (_.isEmpty(maxCardList)){
            return null;
        }else{
            ret.set("type", maxType);
            let handCard = [],
                publicCard  = [],
                firstHandCard = cards[0],
                secondHandCard = cards[1],
                tempCard = null;
            for (let i = 0; i <4 ; i++) {
                tempCard = maxCardList[i];
                if ((tempCard.point == firstHandCard.point && tempCard.type == firstHandCard.type)
                    || (tempCard.point == secondHandCard.point && tempCard.type == secondHandCard.type)){
                    handCard.push(tempCard);
                }else {
                    publicCard.push(tempCard);
                }
            }
            ret.set("handCard", handCard);
            ret.set("publicCard", publicCard);
            return ret;
        }
    },

    getBiggestIn5: function(sortedCardListParam) {
        let sortedCardList = _.cloneDeep(sortedCardListParam)
        if (util.isStraightFlush(sortedCardList)){
            return constant.holdCard.STRAIGHT_FLUSH;
        }
        if (util.isFourOfAKind(sortedCardList)){
            return constant.holdCard.FOUR_OF_A_KIND;
        }
        if (util.isFullHouse(sortedCardList)){
            return constant.holdCard.FULL_HOUSE;
        }
        if (util.isFlush(sortedCardList)){
            return constant.holdCard.FLUSH;
        }
        if (util.isStraight(sortedCardList)){
            return constant.holdCard.STRAIGHT;
        }
        if (util.isThreeOfAKind(sortedCardList)){
            return constant.holdCard.THREE_OF_A_KIND;
        }
        if (util.isTwoPairs(sortedCardList)){
            return constant.holdCard.TWO_PAIR;
        }
        if (util.isOnePair(sortedCardList)){
            return constant.holdCard.ONE_PAIR;
        }
        if (util.isHighCard(sortedCardList)){
            return constant.holdCard.HIGH_CARD;
        }
        return null;
    },

    getBiggest: (cards) => {
        let cardList = _.cloneDeep(cards);
        let handCards = cardList.splice(0, 2);
        cardList.sort(util.sortCardList);
        let temp = [],
            numOfCard = cards.length;
        if (numOfCard === 5){
            let maxType = util.getBiggestIn5(handCards.concat(cardList).sort(util.sortCardList)),
                ret = new Map();
            ret.set("type", maxType);
            ret.set("maxCardList", handCards.concat(cardList));
            return ret;
        }else {
            if (numOfCard === 6) {
                let maxType = constant.holdCard.HIGH_CARD,
                    maxCardList = [];
                for (let i = 0; i < 4; i++) {
                    temp = _.cloneDeep(cardList);
                    temp.splice(i, 1);
                    if (_.isEmpty(maxCardList)){
                        maxCardList = _.cloneDeep(handCards.concat(temp).sort(util.sortCardList));
                    }
                    let tempType = util.getBiggestIn5(_.cloneDeep(handCards.concat(temp).sort(util.sortCardList)));
                    if (tempType > maxType) {
                        maxType = tempType;
                        maxCardList = _.cloneDeep(handCards.concat(temp).sort(util.sortCardList));
                    } else if (tempType == maxType) {
                        let result = util.compareTwoArrayWithType(_.cloneDeep(maxCardList), _.cloneDeep(handCards.concat(temp).sort(util.sortCardList)), maxType);
                        if (result < 0){
                            maxCardList = _.cloneDeep(handCards.concat(temp).sort(util.sortCardList))
                        }
                    }
                }
                let ret = new Map();
                ret.set("type",maxType);
                ret.set("maxCardList",maxCardList);
                return ret;
            } else if (numOfCard === 7) {
                let maxType = constant.holdCard.HIGH_CARD,
                    maxCardList = [];
                for (let i = 0; i <4 ; i++) {
                    for (let j = i+1; j <5 ; j++) {
                        temp = _.cloneDeep(cardList)
                        temp.splice(i, 1);
                        temp.splice(j-1, 1);
                        if (_.isEmpty(maxCardList)){
                            maxCardList = _.cloneDeep(handCards.concat(temp).sort(util.sortCardList))
                        }
                        let tempType = util.getBiggestIn5(handCards.concat(temp).sort(util.sortCardList));
                        if (tempType > maxType) {
                            maxType = tempType;
                            maxCardList = _.cloneDeep(handCards.concat(temp).sort(util.sortCardList))
                        } else if (tempType === maxType) {
                            let result = util.compareTwoArrayWithType(_.cloneDeep(maxCardList),_.cloneDeep(handCards.concat(temp).sort(util.sortCardList)),maxType);
                            if (result<0){
                                maxCardList = _.cloneDeep(handCards.concat(temp).sort(util.sortCardList))
                            }
                        }
                    }
                }
                let ret = new Map();
                ret.set("type", maxType);
                ret.set("maxCardList", maxCardList);
                return ret;
            } else {
                return null;
            }
        }
    },

    compareTwoArrayWithType: (cardList1, cardList2, type) => {
        switch(type){
            case 1:
                return util.compareTwoGaopai(cardList1,cardList2);
            case 2:
                return util.compareTwoYidui(cardList1,cardList2);
            case 3:
                return util.compareTwoLiangdui(cardList1,cardList2);
            case 4:
                return util.compareTwoSantiao(cardList1,cardList2);
            case 5:
                return util.compareTwoShunzi(cardList1,cardList2);
            case 6:
                return util.compareTwoTonghua(cardList1,cardList2);
            case 7:
                return util.compareTwoHulu(cardList1,cardList2);
            case 8:
                return util.compareTwoSitiao(cardList1, cardList2);
            case 9:
                return util.compareTwoTonghuashun(cardList1, cardList2);
            default:
                break;
        }
        return 1;
    },

    compareTwoGaopai: (cardList1, cardList2)=>{
        let point1, point2;
        for (let i=0;i<5;i++){
            point1 = cardList1[i].point;
            point2 = cardList2[i].point;
            if (point1 > point2){
                return 1;
            }else if(point1 < point2){
                return -1;
            }
        }
        return 0;
    },

    compareTwoYidui: (cardList1Param, cardList2Param)=>{
        let cardList1 = _.cloneDeep(cardList1Param),
            cardList2 = _.cloneDeep(cardList2Param),
            duiziCard1 = {},
            found = false;
        for (let i = 0; i < 4; i++) {
            if (cardList1[i].point === cardList1[i+1].point){
                duiziCard1 = cardList1[i];
                cardList1.splice(i, 1);
                cardList1.splice(i, 1);
                found = true;
                break;
            }
        }
        if (!found){
            console.log("Error occur compareTwoYidui ");
        }
        let duiziCard2 = {};
        found = false;
        for (let i = 0; i < 4; i++) {
            if (cardList2[i].point === cardList2[i+1].point){
                duiziCard2 = cardList2[i];
                cardList2.splice(i, 1);
                cardList2.splice(i, 1);
                found = true;
                break;
            }
        }
        if (!found){
            console.log("Error occur compareTwoYidui");
        }
        if(duiziCard1.point === duiziCard2.point && duiziCard1.type === duiziCard2.type){
            return util.compareTwoArrayList(cardList1, cardList2);
        } else{
            return util.compareTo(duiziCard1, duiziCard2);
        }
    },

    compareTo: (obj1, obj2)=>{
        if(obj1 != null && obj2 != null){
            let card1 = obj1;
            let card2 = obj2;
            if (card1.point>card2.point){
                return 1;
            }else if(card1.point<card2.point){
                return -1;
            }else{
                if (card1.type>card2.type){
                    return 1;
                }else if(card1.type<card2.type){
                    return -1;
                }else{
                    return 0;
                }
            }
        }
    },
    compareTwoArrayList: (cardList1, cardList2)=>{
        let size = cardList1.length,
            point1, point2;
        for (let i = size-1; i >=0 ; i--) {
            point1 = cardList1[i].point;
            point2 = cardList2[i].point;
            if (point1 > point2){
                return 1;
            }else if(point1 < point2){
                return -1;
            }
        }
        return 0;
    },

    compareTwoLiangdui: (cardList1Param, cardList2Param) => {
        let cardList1 = _.cloneDeep(cardList1Param),
            cardList2 = _.cloneDeep(cardList2Param),
            newCardList1 = [],
            newCardList2 = [];
        for (let i = 4; i > 0; i--) {
            if (cardList1[i].point==cardList1[i-1].point){
                newCardList1.push(cardList1[i]);
                cardList1.splice(i, 1);
                cardList1.splice(i-1, 1);
                i--;
            }
        }
        newCardList1.push(cardList1[0]);
        for (let i = 4; i > 0; i--) {
            if (cardList2[i].point==cardList2[i-1].point){
                newCardList2.push(cardList2[i]);
                cardList2.splice(i, 1);
                cardList2.splice(i-1, 1);
                i--;
            }
        }
        newCardList2.push(cardList2[0]);
        return util.compareTwoArrayListDESC(newCardList1, newCardList2);
    },

    compareTwoSantiao: ( cardList1Param, cardList2Param )=>{
        let cardList1 = _.cloneDeep(cardList1Param),
            cardList2 = _.cloneDeep(cardList2Param),
            santiao1 = {}, santiao2 = {},
        point1 = cardList1[0].point,
        point2 = cardList1[1].point,
        point3 = cardList1[2].point,
        point4 = cardList1[3].point,
        point5 = cardList1[4].point;

        if (point1==point2&&point2==point3){
            santiao1 = cardList1[0]
            cardList1.splice(0, 1);
            cardList1.splice(0, 1);
            cardList1.splice(0, 1);
        }else if (point2==point3&&point3==point4){
            santiao1 = cardList1[1]
            cardList1.splice(1, 1);
            cardList1.splice(1, 1);
            cardList1.splice(1, 1);
        }else if(point3==point4&&point4==point5){
            santiao1 = cardList1[2]
            cardList1.splice(2, 1);
            cardList1.splice(2, 1);
            cardList1.splice(2, 1);
        }else{
            return -2;
        }
        cardList1.push(santiao1);
        point1 = cardList2[0].point;
        point2 = cardList2[1].point;
        point3 = cardList2[2].point;
        point4 = cardList2[3].point;
        point5 = cardList2[4].point;

        if (point1==point2&&point2==point3){
            santiao2 = cardList2[0]
            cardList2.splice(0, 1);
            cardList2.splice(0, 1);
            cardList2.splice(0, 1);
        }else if (point2==point3&&point3==point4){
            santiao2 = cardList2[1]
            cardList2.splice(1 , 1);
            cardList2.splice(1, 1);
            cardList2.splice(1, 1);
        }else if(point3==point4&&point4==point5){
            santiao2 = cardList2[2]
            cardList2.splice(2, 1);
            cardList2.splice(2, 1);
            cardList2.splice(2, 1);
        }else{
            return -2;
        }

        cardList2.push(santiao2);
        return util.compareTwoArrayList(cardList1, cardList2);
    },

    compareTwoShunzi: ( cardList1, cardList2 )=>{
        let isA2345_1 = util.isA2345(cardList1),
            isA2345_2 = util.isA2345(cardList2);

        if (isA2345_1&&isA2345_2){
            return 0;
        }else if(isA2345_1){
            return -1;
        }else if (isA2345_2){
            return 1;
        }
        let point1, point2;
        point1 = cardList1[4].point
        point2 = cardList2[4].point
        if (point1>point2){
            return 1;
        }else if(point1<point2){
            return -1;
        }else{
            return 0;
        }
    },

    compareTwoTonghua: (cardList1, cardList2 ) => {
        return util.compareTwoArrayList(cardList1,cardList2);
    },

    compareTwoHulu: (cardList1, cardList2 ) => {
        let point1,point2,point3,point4,point5;
        let santiao1,yidui1;
        let santiao2,yidui2;

        point1 = cardList1[0].point;
        point2 = cardList1[1].point;
        point3 = cardList1[2].point;
        point4 = cardList1[3].point;
        point5 = cardList1[4].point;

        if (point1==point2&&point2==point3&&point4==point5){
            santiao1 = point1;
            yidui1 = point4;
        }else{
            santiao1 = point4;
            yidui1 = point1;
        }
        point1 = cardList2[0].point;
        point2 = cardList2[1].point;
        point3 = cardList2[2].point;
        point4 = cardList2[3].point;
        point5 = cardList2[4].point;
        if (point1==point2&&point2==point3&&point4==point5){
            santiao2 = point1;
            yidui2 = point4;
        }else{
            santiao2 = point4;
            yidui2 = point1;
        }
        if (santiao1>santiao2){
            return 1;
        }else if (santiao1<santiao2){
            return -1;
        }else{
            if (yidui1>yidui2){
                return 1;
            }else if (yidui1<yidui2){
                return -1;
            }else{
                return 0;
            }
        }
    },

    compareTwoSitiao: ( cardList1, cardList2 )=>{
        let point1 = cardList1[2].point,
            point2 = cardList2[2].point,
            point3 = cardList1[0].point,
            point4 = cardList2[0].point,
            point5 = cardList1[4].point,
            point6 = cardList2[4].point,
            alone1,alone2;
        if (point1>point2){
            return 1;
        }else if(point1<point2){
            return -1;
        }else{
            alone1 = point1==point3?point5:point3;
            alone2 = point2==point4?point6:point4;
            if (alone1>alone2){
                return 1;
            }else if (alone1<alone2){
                return -1;
            }else {
                return 0;
            }
        }
    },

    compareTwoTonghuashun: ( cardList1, cardList2 ) => {
        return util.compareTwoArrayList(cardList1,cardList2);
    },

    isA2345: (sortedList)=>{
        let point1 = sortedList[0].point,
            point2 = sortedList[1].point,
            point3 = sortedList[2].point,
            point4 = sortedList[3].point,
            point5 = sortedList[4].point;
        if (point1==2&&point2==3&&point3==4&&point4==5&&point5==14){
            return true;
        }
        return false;
    },

    compareTwoArrayListDESC: (cardList1, cardList2)=>{
        let size = cardList1.length,
            point1, point2;
        for (let i = 0; i <size ; i++) {
            point1 = cardList1[i].point;
            point2 = cardList2[i].point;
            if (point1>point2){
                return 1;
            }else if(point1<point2){
                return -1;
            }
        }
        return 0;
    },

    sortCardList: function(a, b){
        var va = parseInt(a.point);
        var vb = parseInt(b.point);
        if(va === vb){
            return a.point < b.point ? 1 : -1;
        } else if(va < vb){
            return -1;
        } else {
            return 1;
        }
    },

    calclistenCardIn4: (cards) => {
        let cardList = _.cloneDeep(cards),
            sizeOfCards = cardList.length,
            isStraight = false,
            isFlush = false,
            ret = new Map();
        if (sizeOfCards === 4){
            isStraight = util.isListenStraight(cardList);
            isFlush = util.isListenFlush(cardList);
            if (isStraight && isFlush){
                ret.set("type", constant.holdCard.STRAIGHT_FLUSH);
                ret.set("cardList", cardList);
                return  ret;
            }else if (isStraight){
                ret.set("type", constant.holdCard.STRAIGHT);
                ret.set("cardList", cardList);
                return  ret;
            }else if (isFlush){
                ret.set("type", constant.holdCard.FLUSH);
                ret.set("cardList", cardList);
                return ret;
            }else{
                return null;
            }
        }else{
            return null;
        }
    },
    isStraightFlush: (cards) => {
        if (util.isFlush(cards) && util.isStraight(cards)){
            return true;
        }
        return false;
    },

    isFourOfAKind: (cards) => {
        let counter = 1,
            lastpoint = cards[0].point,
            temppoint;
        for (let i = 1; i<5; i++){
            temppoint = cards[i].point;
            if (temppoint === lastpoint){
                counter++;
                if (counter==4){
                    return true;
                }
            }else{
                counter = 1;
                lastpoint = temppoint;
            }
        }
        if (counter==4){
            return true;
        }else{
            return false;
        }
    },

    isFullHouse: (cards)=>{
        let point1 = cards[0].point,
            point2 = cards[1].point,
            point3 = cards[2].point,
            point4 = cards[3].point,
            point5 = cards[4].point;
        if ((point1 === point2 && point2 === point3 && point4 === point5) || (point1 === point2 && point3 === point4 && point4 === point5)){
            return true;
        }else{
            return false;
        }
    },

    isListenStraight: (cardListParam) => {
        let point1 = cardListParam[0].point,
         point2 = cardListParam[1].point,
         point3 = cardListParam[2].point,
         point4 = cardListParam[3].point;
        if ((point4-point1)!=3){
            return false;
        }else{
            if ((point1+1)==point2&&((point3+1)==point4)){
                return true;
            }else {
                return false;
            }
        }
    },
    isListenFlush: (cardListParam) => {
        let type = cardListParam[0].type,
            colortemp;
        for (let i = 1;i<4;i++){
            colortemp = cardListParam[i].type;
            if(type != colortemp){
                return false;
            }
        }
        return true;
    },

    isStraight: (cards) => {
        let maxPoint = cards[4].point;
        let minPoint = cards[0].point;
        if ((maxPoint - minPoint) !== 4){
            if (util.isA2345(cards)){
                return true;
            }
            return false;
        }else{
            let tempPoint,lastPoint;
            lastPoint = cards[0].point;
            for (let i=1;i<5;i++){
                tempPoint = cards[i].point;
                if (tempPoint==lastPoint){
                    if (util.isA2345(cards)){
                        return true;
                    }
                    return false;
                }else{
                    lastPoint = tempPoint;
                }
            }
            return true;
        }
    },

    isFlush: (cards) => {
        if(cards && cards.length > 0){
            let type = cards[0].type,
                styletemp;
            for (let i = 1; i < 5; i++){
                styletemp = cards[i].type;
                if(type !== styletemp){
                    return false;
                }
            }
            return true;
        }
    },

    isThreeOfAKind: (cards) => {
        let point1 = cards[0].point,
            point2 = cards[1].point,
            point3 = cards[2].point,
            point4 = cards[3].point,
            point5 = cards[4].point;
        if ((point1 === point2 && point2 === point3 && point3 !== point4 && point4 !== point5)
            ||(point1 !== point2 && point2 === point3 && point3 === point4 && point4 !== point5)
            ||(point1 !== point2 && point2 !== point3 && point3 === point4 && point4 === point5)){
            return true;
        }
        return false;
    },

    isTwoPairs: (cards) => {
        let point1 = cards[0].point,
            point2 = cards[1].point,
            point3 = cards[2].point,
            point4 = cards[3].point,
            point5 = cards[4].point;
        if ((point1==point2&&point2!=point3&&point3==point4&&point4!=point5)
            ||(point1!=point2&&point2==point3&&point3!=point4&&point4==point5)
            ||(point1==point2&&point2!=point3&&point3!=point4&&point4==point5)){
            return true;
        }
        return false;
    },

    isOnePair: (cards) => {
        let counter = 1,
            lastpoint = cards[0].point,
            temppoint = 0;
        for (let i = 1; i < 5 ; i++) {
            temppoint = cards[i].point;
            if (temppoint != lastpoint){
                counter++;
                lastpoint = temppoint;
            }
        }
        if (counter == 4 && !util.isFlush(cards)){
            return true;
        }
        return false;
    },

    isHighCard: (cards) => {
        let counter = 1,
            lastpoint = cards[0].point,
            temppoint = 0;
        for (let i = 1; i <5 ; i++) {
            temppoint = cards[i].point;
            if (temppoint !== lastpoint){
                counter++;
                lastpoint = temppoint;
            }
        }
        if (counter === 5 && !util.isFlush(cards)&&!util.isStraight(cards)){
            return true;
        }
        return false;
    },

}

module.exports = util;