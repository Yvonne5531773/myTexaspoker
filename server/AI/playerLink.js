/**
 * Created by LZH on 6/24/2017.
 */
'use strict'

// let seatInfo = require('../seatinfo/services/seatInfo.service.js')

var linkNode = function(seatInfo){
    this.next = null;
    this.previous = null;
    this.data = null;
    this.init = function(seatInfo, previous, next){
        this.data = seatInfo;
        this.previous = previous;
        this.next = next;
    }
    return (function(seatInfo){
        this.data = seatInfo;
        this.previous = null;
        this.next = null;
    })();
}

var playerLink = function(){
    // 链表数目
    this.currentIndex = 0;
    // 当前结点
    this.cur = null;
    // 指示玩家自己的结点
    this.me = null;
    // 头结点
    this.head = null;
    // 尾结点
    this.tail = null;
    // 玩家存储的数组
    this.dataList = [];
    // 玩家自己
    this.playerOfMe = {};
    this.map = new Map();

    this.setPlayerOfMe = function(player){
        playerLink.playerOfMe = player;
    }

    this.add = function(seatInfo){
        if (seatInfo === null) {
            return;
        }
        let node = new linkNode(seatInfo);
        // 只有一个元素
        if (playerLink.dataList.length === 0) {
            playerLink.head = node;
            playerLink.tail = node;
            node.next = node;
            node.previous = node;
            playerLink.cur = node;
        } else {
            playerLink.tail.next = node;
            node.previous = playerLink.tail;
            playerLink.tail = node;
            playerLink.tail.next = playerLink.head;
            playerLink.head.previous = tail;
        }
        playerLink.dataList.push(node);

        // 玩家自己
        if(node.data.user === playerLink.playerOfMe.user) {
            playerLink.me = node;
        }
        playerLink.map.set(seatInfo.user, playerLink.dataList.length-1);
    }

    /**
     * 获取链表中庄家的索引
     *
     * @return
     */
    this.GetButton = () => {
        let index = 0,
            node = playerLink.head;
        while (node != playerLink.tail) {
            if (node.data.isButton()) {
                return index;
            }
            node = node.next;
            index++;
        }
        return -1;
    }

    this.GetButtonSeat = () => {
        let node = playerLink.head;
        while (node != tail) {
            if (node.data.isButton()) {
                return node.data;
            }
            node = node.next;
        }
        return {};
    }

    /**
     * 获取小盲注索引
     *
     * @return
     */
    this.GetSmallBlind = () => {
        let index = 0,
            node = playerLink.head;
        while (node != playerLink.tail) {
            if (node.data.isSmallBlind()) {
                return index;
            }
            node = node.next;
            index++;
        }
        return -1;
    }

    /**
     * 获取小盲注
     *
     * @return
     */
    this.GetSmallBlindSeat = () => {
        let node = playerLink.head;
        while (node != tail) {
            if (node.data.isSmallBlind()) {
                return node.data;
            }
            node = node.next;
        }
        return {};
    }

    /**
     * 获取大盲注索引
     *
     * @return
     */
    this.GetBigBlind = () => {
        let index = 0,
            node = playerLink.head;
        while (node != playerLink.tail) {
            if (node.data.isBigBlind()) {
                return index;
            }
            node = node.next;
            index++;
        }
        return -1;
    }

    /**
     * 获取大盲注
     *
     * @return
     */
    this.GetBigBlindSeat = () => {
        let node = playerLink.head;
        while (node != tail) {
            if (node.data.isBigBlind()) {
                return node.data;
            }
            node = node.next;
        }
        return {};
    }

    /**
     * 获取自己的索引
     *
     * @return
     */
    this.Me = () => {
        // 获取自己的索引
        return playerLink.dataList.indexOf(playerLink.me);
    }

    /**
     * 获取自己座次
     *
     * @return
     */
    this.MySeat = () => {
        return playerLink.dataList[Me()].data;
    }

    /**
     * 获取前一个座次的索引
     *
     * @return
     */
    this.GetCurPrevious = () => {
        return playerLink.dataList.indexOf(playerLink.cur);
    }

    this.GetPrevious = (p) => {
        playerLink.cur = playerLink.cur.previous;
        return playerLink.dataList.indexOf(playerLink.dataList[p].previous);
    }

    /**
     * 获取前一个座次
     *
     * @param seat
     * @return
     */
    // let GetPreviousSeat = () => {
    //     return dataList.get(GetPrevious()).data;
    // }
    this.GetPreviousSeat = (p) => {
        return playerLink.dataList[GetPrevious(p)].data;
    }

    this.CurrentSeat = () => {
        return playerLink.cur.data;
    }

    /**
     * 获取当前玩家的下一个玩家节点
     *
     * @return
     */
    this.curNextSeat = () => {
        playerLink.cur = playerLink.cur.next;
        return playerLink.cur.data;
    }

    this.NextSeat = (p) => {
        return playerLink.dataList[p].next.data;
    }

    /**
     * 获取当前玩家的下一个活动玩家节点（就是还没弃牌的玩家）
     *
     * @return
     */
    this.GetNextActive = () => {
        let node = playerLink.cur.next;
        while (node != playerLink.cur) {
            if (!node.data.isFold()) {
                playerLink.cur = node;
                return node.data;
            }
            node = node.next;
        }
        return {};
    }

    /**
     * 根据索引p设置链表中的当前玩家， 比如Seek(GetButton())将把当前玩家定为庄家， Seek(GetMe
     * ())则是将当前玩家定位为自己
     *
     * @param p
     * @return
     */
    this.seek = (p) => {
        if (p < 0 || p > playerLink.dataList.length - 1) {
            console.log('超出范围')
        }
        playerLink.cur = playerLink.dataList[p];
    }

    /**
     * 获取链表中玩家的个数
     *
     * @return
     */
    this.GetPlayerNum = () => {
        return playerLink.dataList.length;
    }

    /**
     * 获取链表中没有弃牌的玩家的个数
     *
     * @return
     */
    this.GetActivePlayerNum = () => {
        let node = playerLink.head, cnt = 0;
        while (node != playerLink.tail) {
            if (!node.data.isFold()) {
                cnt++;
            }
            node = node.next;
        }
        if(!playerLink.tail.data.isFold()) cnt++;
        return cnt;
    }

    /**
     * 获取p位置的玩家
     *
     * @param p
     * @return
     */
    this.GetPlayer = (p) => {
        if(p>=0 && p<playerLink.dataList.length)
            return playerLink.dataList[p].data;
        else
            return {};
    }

    this.GetPlayerByUser = (user) => {
        if(playerLink.map.containsKey(user))
            return GetPlayer(playerLink.map.get(user));
        else
            return {};
    }
    this.GetPlayerLink = () => {
        return playerLink;
    }
}

module.exports = playerLink;
//
// exports.setPlayerOfMe = setPlayerOfMe;
// exports.add = add;
// exports.seek = seek;
// exports.GetPreviousSeat = GetPreviousSeat;
// exports.CurrentSeat = CurrentSeat;
// exports.curNextSeat = curNextSeat;
// exports.NextSeat = NextSeat;
// exports.GetNextActive = GetNextActive;
// exports.GetPlayerNum = GetPlayerNum;
// exports.GetActivePlayerNum = GetActivePlayerNum;
// exports.GetPlayer = GetPlayer;
// exports.GetPlayerByUser = GetPlayerByUser;
// exports.GetPrevious = GetPrevious;
// exports.GetCurPrevious = GetCurPrevious;
// exports.MySeat = MySeat;
// exports.Me = Me;
// exports.GetBigBlindSeat = GetBigBlindSeat;
// exports.GetBigBlind = GetBigBlind;
// exports.GetSmallBlindSeat = GetSmallBlindSeat;
// exports.GetSmallBlind = GetSmallBlind;
// exports.GetButtonSeat = GetButtonSeat;
// exports.GetButton = GetButton;
// exports.GetPlayerLink = GetPlayerLink;

