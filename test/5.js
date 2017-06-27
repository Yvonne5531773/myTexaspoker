

var playerLink = require('../server/AI/playerLink'),
seat = require('../server/seatinfo/services/seatInfo.service')

var p = new playerLink()
var s = new seat();

var a = function(){
    this.name = 1;
}
var aa = new a()
console.log(p)
// console.log(s)