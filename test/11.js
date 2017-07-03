/**
 * Created by LZH on 6/29/2017.
 */

var util = require('../server/AI/util')
var constant = require('../server/constant/constant')
var _ = require('lodash')

let myself = {};
    myself.holdCards = [{ type: 4, point: 7 },
        { type: 1, point: 8 }];
    myself.commonCards = [{ type: 3, point: 9 },
        { type: 4, point: 10 },
        { type: 4, point: 8 },
        { type: 2, point: 10 }];
let myHandType = util.getBiggest(_.cloneDeep(myself.holdCards.concat(myself.commonCards).sort(util.sortCardList))),
    cardUsedMap = [];
for(let i=0;i<myself.holdCards.concat(myself.commonCards).length;i++){
    var tmp = myself.holdCards.concat(myself.commonCards)
    console.log('1111 tmp[i]', tmp[i])
    cardUsedMap[tmp[i].point-2]=true;
}
console.log('cardUsedMap', cardUsedMap)
console.log('GetRiverProba--------myHandType', myHandType)
let opponentCard1 = {},
    opponentCard2 = {},
    opponentCards = [];
myself.holdCards.concat(myself.commonCards).forEach(function(card){
    opponentCards.push(card);
})
let opponentHandType = new Map(),
    opponentListenType = new Map(),
    //正常手牌
    testNum=0,
    winNum=0,
    drawNum=0,
    loseNum=0,
    listenStraightNum=0,
    listenFlushNum=0,
    //一对以上，但又在我牌力之下的
    onePairNum=0,
    //非常紧的手牌
    isSuite,
    isTight=false,
    testNum_tight=0,
    winNum_tight=0,
    drawNum_tight=0,
    loseNum_tight=0,
    listenStraightNum_tight=0,
    listenFlushNum_tight=0,
    //一对以上，但又在我牌力之下的
    onePairNum_tight=0;
for(let i=0;i<52;i++){
    if(cardUsedMap[i]) {
        // console.log('22222 cardUsedMap[i]', cardUsedMap[i])
        continue;
    }
    for(let j=i+1;j<52;j++){
        if(cardUsedMap[j]) {
            // console.log('333333 cardUsedMap[j]', cardUsedMap[j])
            continue;
        }
        //如果是小牌，那就跳过。现在假设对手的牌不会出现不是对子而且又是点数小的牌而且不同花色
        if(i%13 + j%13<8 && i%13 !== j%13 && i/4!==j/4) {
            // console.log('如果是小牌 i', i)
            // console.log('如果是小牌 j', j)
            continue;
        }
        testNum++;
        opponentCard1 = {type: Math.floor(i/13+1), point: i%13+2};
        opponentCard2 = {type: Math.floor(j/13+1), point: j%13+2}
        opponentCards[0] = {type: Math.floor(i/13+1), point: i%13+2}
        opponentCards[1] = {type: Math.floor(j/13+1), point: j%13+2}
        //判断是否紧的手牌
        isTight=false;
        if(opponentCard1.type===opponentCard2.type){
            isSuite=1;
        }
        else{
            isSuite=0;
        }
        //综合概率大于0.5
        if(constant.handProbaTable[isSuite][opponentCard1.point][opponentCard2.point] > 0.5){
            console.log('222222222222222')
            isTight=true;
        }
        //中对子
        else if(i%13 == j%13 && i%13>7){
            isTight=true;
        }
        //同花连张
        else if((i%13+1==j%13) ||  (i%13==0 && j%13==12) && isSuite==1){
            isTight=true;
        }
        if(isTight){
            testNum_tight++;
        }
        console.log('GetRiverProba--------opponentCards', opponentCards)
        opponentHandType = util.getBiggest(opponentCards);
        console.log('GetRiverProba--------opponentHandType', opponentHandType)
        if(myHandType.get("type") > opponentHandType.get("type")){
            winNum++;
            if(isTight){
                winNum_tight++;
            }
            if(opponentHandType.get("type") >= constant.holdCard.ONE_PAIR){
                onePairNum++;
                if(isTight){
                    onePairNum_tight++;
                }
            }
        }
        else if(myHandType.get("type") === opponentHandType.get("type")){
            // console.log('myHandType.get("type") === opponentHandType.get("type") myHandType', myHandType.get("maxCardList"))
            // console.log('myHandType.get("type") === opponentHandType.get("type") opponentHandType', opponentHandType.get("maxCardList"))
            switch(util.compareTwoArrayWithType(myHandType.get("maxCardList").sort(util.sortCardList), opponentHandType.get("maxCardList").sort(util.sortCardList),myHandType.get("type"))){
                case 0:{
                    drawNum++;
                    if(isTight){
                        drawNum_tight++;
                    }
                    break;
                }
                case -1:{
                    loseNum++;
                    if(isTight){
                        loseNum_tight++;
                    }
                    break;
                }
                case 1:{
                    winNum++;
                    if(isTight){
                        winNum_tight++;
                    }
                    if(opponentHandType.get("type") >= constant.holdCard.ONE_PAIR){
                        onePairNum++;
                        if(isTight){
                            onePairNum_tight++;
                        }
                    }
                    break;
                }
            }
        } else{
            loseNum++;
            if(isTight){
                loseNum_tight++;
            }
        }
        //听牌概率
        opponentListenType = util.listenCard(opponentCards);
        // console.log('听牌概率 opponentListenType', opponentListenType)
        if(opponentListenType !== null){
            if(opponentListenType.get("type") === constant.holdCard.STRAIGHT){
                if(opponentHandType.get("type") !== constant.holdCard.STRAIGHT){
                    listenStraightNum++;
                    if(isTight){
                        listenStraightNum_tight++;
                    }
                }
            }
            if(opponentListenType.get("type") === constant.holdCard.FLUSH){
                if(opponentHandType.get("type") !== constant.holdCard.FLUSH){
                    listenFlushNum++;
                    listenStraightNum++;
                    if(isTight){
                        listenStraightNum_tight++;
                        listenFlushNum_tight++;
                    }
                }
            }
        }
    }
}
let retCardProba = [];
if(testNum <= 0){
    retCardProba[0] = {winProba:0, loseProba:1, drawProba:0};
    retCardProba[1] = {winProba:0, loseProba:1, drawProba:0};
} else{
    retCardProba[0]= {winProba:winNum/testNum, loseProba:loseNum/testNum, drawProba: drawNum/testNum, listenStraightProba:listenStraightNum/testNum,listenFlushProba: listenFlushNum/testNum};
    retCardProba[1]= {winProba: winNum_tight/testNum_tight, loseProba:loseNum_tight/testNum_tight, drawProba:drawNum_tight/testNum_tight,listenStraightProba: listenStraightNum_tight/testNum_tight, listenFlushProba: listenFlushNum_tight/testNum_tight};
}
console.log(retCardProba)