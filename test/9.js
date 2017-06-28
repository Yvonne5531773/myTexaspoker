/**
 * Created by lica4 on 6/29/2017.
 */

var cardUsedMap = [2,3,4,5]
for(let i=0;i<52;i++) {
    if (cardUsedMap[i] === true)
        continue;
    for (let j = i + 1; j < 52; j++) {
        if (cardUsedMap[j] === true)
            continue;
        //如果是小牌，那就跳过。现在假设对手的牌不会出现不是对子而且又是点数小的牌而且不同花色
        if (i % 13 + j % 13 < 8 && i % 13 != j % 13 && i / 4 != j / 4) {
            console.log(i)
            console.log(j)
        }
    }
}
// console.log(1/13)
// console.log(1%13)