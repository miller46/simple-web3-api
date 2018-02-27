var express = require('express');
var router = express.Router();
var Web3 = require('web3');

var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:30303'));

router.get('/', function(req, res, next) {
    getStats(req, res, next, false);
});

router.get('/api', function(req, res, next) {
    getStats(req, res, next, true);
});

router.get('/ping', function(req, res, next) {
    res.json({"status": 200});
});

router.get('/status', function(req, res, next) {
    res.json({"status": web3.eth.net.isListening() ? 200 : 400});
});

router.get('/peerCount', function(req, res, next) {
    var blockNumber;
    getBlockNumber(function (error, response) {
        if (error) {
            blockNumber = -1;
        } else {
            blockNumber = response;
        }

        res.json({"blockNumber": blockNumber});
    });
});

function getStats(req, res, next, returnAsJson) {
    var blockNumber;
    var peerCount;
    getBlockNumber(function (error, response) {
        if (error) {
            blockNumber = -1;
        } else {
            blockNumber = response;
        }

        getPeerCount(function (error, response) {
            if (error) {
                peerCount = -1;
            } else {
                peerCount = response;
            }

            if (returnAsJson) {
                res.json({"blockNumber": blockNumber, "peerCount": peerCount});
            } else {
                res.render('stats', { title: 'Stats', 'peerCount': peerCount, 'blockNumber': blockNumber});
            }
        })
    });
}

function getBlockNumber(callback) {
    web3.eth.getBlockNumber(function (error, response) {
        defaultCallback(error, response, callback)
    });
}

function getPeerCount(callback) {
    web3.eth.net.getPeerCount(function (error, response) {
        defaultCallback(error, response, callback);
    });
}

function defaultCallback(error, response, callback) {
    if (error) {
        console.log(error);
        return callback(error, undefined);
    } else {
        console.log(response);
        return callback(undefined, response);
    }
}

module.exports = router;
