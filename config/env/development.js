'use strict';

module.exports = {
    db: {
        //uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/welfare',
        uri: 'mongodb://localhost:27017/TexasPoker',
        options: {
            user: '',
            pass: ''
        },
        // Enable mongoose debug mode
        debug: process.env.MONGODB_DEBUG || false
    },
    log: {
        // logging with Morgan - https://github.com/expressjs/morgan
        // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
        format: 'dev',
        fileLogger: {
            directoryPath: process.cwd(),
            fileName: 'app.log',
            maxsize: 10485760,
            maxFiles: 2,
            json: false
        }
    },
    player: {
        deskid: 100010,
        user: 'TGroup',
        pass: 'wvagab',
        // user: 'TGroup1',
        // pass: '111111',
    },
    ServerHost: 'http://10.20.221.136',
};
