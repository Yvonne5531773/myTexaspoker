/**
 * Created by LZH on 6/28/2017.
 */

var _ = require('lodash')
// console.log(_.find([{name:'1'},{name:'2'}], {'name': '1'}))
//
// var a = []
// a['p'] = 1
// console.log(a)

var a = [ { user_status: 1,
    position: 1,
    user: 'TGroup',
    money: 92100,
    wager: 0,
    isSmallBlind: true },
    { user_status: 1,
        position: 2,
        user: 'ddd',
        money: 102550,
        wager: 0,
        isBigBlind: true },
    { user_status: 1,
        position: 3,
        user: 'ccc',
        money: 177100,
        wager: 0,
        lastValidAction: 8 },
    { user_status: 1,
        position: 4,
        user: 'eee',
        money: 23850,
        wager: 0,
        lastValidAction: 8 } ]

        console.log(_.find(a, {'user': 'ddd'}).lastValidAction)