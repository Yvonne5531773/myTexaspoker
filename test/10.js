/**
 * Created by LZH on 6/29/2017.
 */

let sortCardList = function(a, b){
    var va = parseInt(a.point);
    var vb = parseInt(b.point);
    if(va === vb){
        return a.point > b.point ? 1 : -1;
    } else if(va > vb){
        return -1;
    } else {
        return 1;
    }
}

sortCardList([ { type: 4, point: 14 },
    { type: 2, point: 13 },
    { type: 2, point: 12 },
    { type: 2, point: 4 },
    { type: 1, point: 2 } ])
