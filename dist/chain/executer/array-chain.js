"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ArrayChain = exports.ArrayChain = function () {
    function ArrayChain(getChain, generateUUID, Context, singleChain) {
        _classCallCheck(this, ArrayChain);

        this.getChain = getChain;
        this.generateUUID = generateUUID;
        this.Context = Context;
        this.singleChain = singleChain;
    }

    _createClass(ArrayChain, [{
        key: "start",
        value: function start(param, chains) {
            return executeArrayChains(param, this.getChain, this.generateUUID, this.Context, chains, this.singleChain);
        }
    }]);

    return ArrayChain;
}();

var executeArrayChains = function executeArrayChains(param, getChain, generateUUID, Context, array, singleChain) {
    return new Promise(function (resolve, reject) {
        executeArrayChain(param, getChain, generateUUID, Context, array, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        }, param, singleChain);
    });
};

var executeArrayChain = function executeArrayChain(param, getChain, generateUUID, Context) {
    var array = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
    var done = arguments[5];
    var defaultParam = arguments[6];
    var singleChain = arguments[7];

    var chain = array.shift();
    singleChain.start(param, chain).then(function (result) {
        if (array.length) {
            executeArrayChain(Object.assign(defaultParam, result), getChain, generateUUID, Context, array, done, defaultParam, singleChain);
        } else {
            done(undefined, result);
        }
    }).catch(function (err) {
        return done;
    });
};