/**
 * Created by LZH on 6/30/2017.
 */

var _ = require('lodash')

function changeCards(cards){
    let count = []
    cards.forEach(function(card){
        let n = 0;
        n += (card.type - 1)*13;
        if(card.point === 14){
            card.point = 1
        }
        n += card.point;
        count.push(n)
    });
    return count;
}
//
// var out = _.difference(changeCards([ { type: 1, point: 6 },
//     { type: 4, point: 8 },
//     { type: 3, point: 9 },
//     { type: 1, point: 13 },
//     { type: 3, point: 14 } ]), changeCards([ { type: 1, point: 13 }, { type: 1, point: 6 } ]))
//
//     // console.log(out)
//     console.log(changeCards([
//         { type: 4, point: 8 },
//         { type: 3, point: 9 },
//         { type: 3, point: 14 } ]))

// console.log(changeCards([ { type: 4, point: 8 },
//     { type: 4, point: 2 },
//     { type: 1, point: 7 },
//     { type: 3, point: 9 } ]))

        //  26, 11, 40 10 27

let cc = [];
    [ 26, 11, 40 ].forEach(function(card){
    let c = {};
    c.type = parseInt((card - 1)/13) + 1 ;
    c.point = parseInt(card %13) == 0 ? 13 : parseInt(card %13);
    c.point = c.point===1? 14: c.point;
    cc.push(c)
});
console.log(cc)