/**
 * Created by LZH on 6/25/2017.
 */

// console.log([1,2,3].indexOf([1,2]))
var util = require('../server/AI/util')

// var a = [1, 2, 3]
// console.log(a.splice(0, 2))
// console.log(a)

// console.log(util.listenCard(
//     [ { type: 2, point: 8 },
//         { type: 1, point: 2 },
//         { type: 4, point: 8 },
//         { type: 1, point: 8 },
//         { type: 3, point: 8 } ]))

// console.log(util.calclistenCardIn4(
//     [ { type: 4, point: 5 },
//         { type: 1, point: 5 },
//         { type: 4, point: 7 },
//         { type: 1, point: 10 } ]))

console.log(util.getBiggest(
    [
        { type: 4, point: 7 },
        { type: 1, point: 8 },
        { type: 3, point: 9 },
        { type: 4, point: 10 },
        { type: 4, point: 8 },
        { type: 2, point: 10 }
  ]))

// console.log(util.isTwoPairs([
//     { type: 4, point: 7 },
//     { type: 1, point: 8 },
//     { type: 4, point: 10 },
//     { type: 4, point: 8 },
//     { type: 2, point: 10 }
// ].sort(util.sortCardList)))

// console.log(util.getBiggestIn5([
//     { type: 4, point: 3 },
//     { type: 1, point: 2 },
//     { type: 3, point: 8 },
//     { type: 3, point: 3 },
//     { type: 2, point: 3 },].sort(util.sortCardList)))

//
// console.log(util.listenCard([ { type: 4, point: 3 },
//     { type: 1, point: 9 },
//     { type: 3, point: 8 },
//     { type: 2, point: 4 },
//     { type: 4, point: 14 },
//     { type: 2, point: 6 },
//     ]))