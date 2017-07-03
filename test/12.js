/**
 * Created by LZH on 6/29/2017.
 */

var _ = require('lodash')
// console.log(2%13)

// console.log(_.union([14, 51, 19, 26, 42]
// , [ 51, 26, 14 ]))

console.log(_.filter([14, 51, 19, 26, 42]
    , function(a){
        return _.indexOf([ 51, 26, 14 ], a) !== -1
    }))