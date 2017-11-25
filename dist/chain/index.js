'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.execute = exports.Chain = undefined;

var _storage = require('./storage/');

var _context = require('./context/');

var _context2 = _interopRequireDefault(_context);

var _Util = require('./Util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Chain = exports.Chain = function Chain(name) {
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (parameter) {};

    _classCallCheck(this, Chain);

    this.action = action;
    (0, _storage.putChain)(name, this);
};

var execute = exports.execute = function execute(param, chains) {
    return new Promise(function (resolve, reject) {
        if (chains instanceof Array) {} else {
            try {
                var chain = (0, _storage.getChain)(chains);
                var chainId = (0, _Util.generateUUID)();
                var action = chain.action(param);
                if (action) {
                    var context = new _context2.default(chainId);
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
        }
    });
};

var propertyToContext = function propertyToContext(context, chainReturn) {
    if (chainReturn) {
        for (var name in chainReturn) {
            if (chainReturn.hasOwnProperty(name)) {
                context.set(name, chainReturn[name]);
            }
        }
    }
};