/**
 * Created by LZH on 6/25/2017.
 */

// console.log([1,2,3].indexOf([1,2]))
var util = require('../server/AI/util')

// util.getBiggest([ { type: 4, point: 3 },
//     { type: 1, point: 9 },
//     { type: 3, point: 8 },
//     { type: 2, point: 4 },
//     { type: 4, point: 1 },
//     { type: 2, point: 6 },
//     { type: 2, point: 11 } ])

console.log(util.listenCard([ { type: 4, point: 3 },
    { type: 1, point: 9 },
    { type: 3, point: 8 },
    { type: 2, point: 4 },
    { type: 4, point: 14 },
    { type: 2, point: 6 },
    ]))