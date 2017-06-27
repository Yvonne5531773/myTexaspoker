
let playerLink = require('../server/AI/playerLink'),
    seatInfo = require('../server/seatinfo/services/seatInfo.service');

// let a = new seatInfo()
// playerLink.add(seatInfo)
// console.log(seatInfo)

var count = 0;
function a(){

    setInterval(function(){

        b(count)
        console.log(count)
    }, 100)

}

function b(i){
    count = i + 1;
}

a()