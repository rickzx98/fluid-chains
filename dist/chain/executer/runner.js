"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Runner = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require("../context/index");

var _index2 = _interopRequireDefault(_index);

var _Util = require("../Util");

var _index3 = require("../storage/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Runner = exports.Runner = function () {
    function Runner(getChain, generateUUID, Context) {
        _classCallCheck(this, Runner);

        this.getChain = getChain;
        this.generateUUID = generateUUID;
        this.Context = Context;
    }

    _createClass(Runner, [{
        key: "start",
        value: function start(param, chains) {
            if (chains instanceof Array) {
                return executeArrayChains(param, this.getChain, this.generateUUID, this.Context, chains);
            } else {
                return executeSingleChain(param, chains, this.getChain, this.generateUUID, this.Context);
            }
        }
    }]);

    return Runner;
}();

var executeSingleChain = function executeSingleChain(param, chains, getChain, generateUUID, Context) {
    return new Promise(function (resolve, reject) {
        try {
            var chain = getChain(chains);
            var chainId = generateUUID();
            var action = chain.action(param);
            if (action) {
                var context = new Context(chainId);
                if (action instanceof Promise) {
                    action.then(function (props) {
                        propertyToContext(context, props);
                        resolve(context.getData());
                    }).catch(function (err) {
                        return reject;
                    });
                } else {
                    propertyToContext(context, action);
                    resolve(context.getData());
                }
            }
        } catch (err) {
            reject(err);
        }
    });
};

var executeArrayChains = function executeArrayChains(param, getChain, generateUUID, Context, array) {
    return new Promise(function (resolve, reject) {
        executeArrayChain(param, getChain, generateUUID, Context, array, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        }, param);
    });
};

var executeArrayChain = function executeArrayChain(param, getChain, generateUUID, Context) {
    var array = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
    var done = arguments[5];
    var defaultParam = arguments[6];

    var chain = array.shift();
    executeSingleChain(param, chain, getChain, generateUUID, Context).then(function (result) {
        if (array.length) {
            executeArrayChain(Object.assign(defaultParam, result), getChain, generateUUID, Context, array, done, defaultParam);
        } else {
            done(undefined, result);
        }
    }).catch(function (err) {
        return done;
    });
};
var propertyToContext = function propertyToContext(context, chainReturn) {
    if (chainReturn) {
        if (chainReturn instanceof Object) {
            for (var name in chainReturn) {
                if (chainReturn.hasOwnProperty(name)) {
                    context.set(name, chainReturn[name]);
                }
            }
        } else {
            context.set('value', chainReturn);
        }
    }
};