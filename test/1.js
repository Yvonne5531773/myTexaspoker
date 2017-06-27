/**
 * Created by LZH on 6/24/2017.
 */

// var m = new Map().set(0, false).set(1, false);
// m.set('1', 1)
// m.set('2', 2)
//
// m.forEach(function(v, k){
//     console.log(v)
//     console.log(k)
// })
// var m = []
//
// m[1] = 2
// console.log(m)
let holdCards = []
let cards = [ 13, 18, 38,30,25 ];
cards.forEach(function(card){
    let c = {};
    c.type = parseInt((card - 1)/13) + 1 ;
    c.point = parseInt(card %13) == 0 ? 13 : parseInt(card %13);
    holdCards.push(c)
});
console.log('holdCards', holdCards)

let a = [ { type: 1, point: 13 },
    { type: 2, point: 5 },
    { type: 3, point: 12 },
    { type: 3, point: 4 },
    { type: 2, point: 12 } ]

let count = []
a.forEach(function(card){
    let n = 0;
    n += (card.type - 1)*13;
    if(card.point == 14){
        card.point = 1
    }
    n += card.point;
    count.push(n)
});
console.log('count', count)