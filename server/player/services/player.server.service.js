'use strict';

let _ = require('lodash'),
    mongoose = require('mongoose'),
    async = require('async'),
    request = require('request'),
    util = require('util');
const config = require('../../../config/config'),
    constant = require('../../constant/constant');

exports.connect = connect;
exports.requstUserInfo = requstUserInfo;
exports.doAction = doAction;
exports.requstMessage = requstMessage;
exports.showdown = showdown; //摊牌

function connect(criteria, callback){
    let url = config.ServerHost + '/login?deskid=' + criteria.deskid + '&user=' + criteria.user + '&pass=' + criteria.pass
    request.get({
        uri: url,
        json: true,
        // dataType: '',
    }, function (error, response, result) {
        // console.log('in connect response', response)
        console.log('in connect result', result)
        if (!error && (response.statusCode === 200)) {
            if (!_.isEmpty(result)) {
                callback(null, result);
            } else {
                callback(null, null);
            }
        } else {
            callback(error, null);
        }
    });
}

function requstUserInfo(criteria, callback){
    let url = config.ServerHost + '/getuinfo?deskid=' + criteria.deskid + '&type=' + criteria.type
    request.get({
        uri: url,
        json: true,
    }, function (error, response, result) {
        // console.log('in requstUserInfo response', response)
        if (!error && (response.statusCode === 200)) {
            if (!_.isEmpty(result)) {
                callback(null, result);
            } else {
                callback(null, null);
            }
        } else {
            callback(error, null);
        }
    });
}

function doAction(criteria, callback){
    console.log('in doAction')
    let url = config.ServerHost + '/action?deskid=' + criteria.deskid + '&token=' + criteria.token + '&type=' + criteria.type + '&money=' + criteria.money
    request.get({
        uri: url,
        json: true,
    }, function (error, response, result) {
        if (!error && (response.statusCode === 200)) {
            if (!_.isEmpty(result)) {
                callback(null, result);
            } else {
                callback(null, null);
            }
        } else {
            callback(error, null);
        }
    });
}

function requstMessage(criteria, callback){
    let url = config.ServerHost + '/getmsg?deskid=' + criteria.deskid + '&token=' + criteria.token + '&msgid=' + criteria.msgid + '&count=' + criteria.count
    request.get({
        uri: url,
        json: true,
    }, function (error, response, result) {
        if (!error && (response.statusCode === 200)) {
            if (!_.isEmpty(result)) {
                callback(null, result);
            } else {
                callback(null, null);
            }
        } else {
            callback(error, null);
        }
    });
}

function showdown(criteria, callback){
    let url = config.ServerHost + '/cards?deskid=' + criteria.deskid + '&token=' + criteria.token + '&card1=' + criteria.card1 + '&card2=' + criteria.card2 + '&card3=' + criteria.card3;
    console.log('showdown url', url)
    request.get({
        uri: url,
        json: true,
    }, function (error, response, result) {
        console.log('in showdown result', result)
        if (!error && (response.statusCode === 200)) {
            if (!_.isEmpty(result)) {
                callback(null, result);
            } else {
                callback(null, null);
            }
        } else {
            callback(error, null);
        }
    });
}




