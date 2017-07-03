/**
 * Created by LZH on 6/30/2017.
 */

let preflopBet = [-1, 200]
let getAvgPreflopBet = function(playNum, avgNum){
    if(playNum<1 || avgNum<1){
        return -1;
    }
    else{
        let i=playNum, sum=0, actualNum=0;
        while(playNum-i<avgNum && i>0){
            if(preflopBet[i]>0){
                sum=sum + preflopBet[i];
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

console.log(getAvgPreflopBet(1, 10))