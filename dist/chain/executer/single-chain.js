"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SingleChain = exports.SingleChain = function () {
    function SingleChain(getChain, generateUUID, Context, propertyToContext) {
        _classCallCheck(this, SingleChain);

        this.getChain = getChain;
        this.generateUUID = generateUUID;
        this.Context = Context;
        this.propertyToContext = propertyToContext;
    }

    _createClass(SingleChain, [{
        key: "start",
        value: function start(param, chains) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                try {
                    var chain = _this.getChain(chains);
                    var chainId = _this.generateUUID();
                    var action = chain.action(param);
                    if (action) {
                        var context = new _this.Context(chainId);
                        if (action instanceof Promise) {
                            action.then(function (props) {
                                _this.propertyToContext(context, props);
                                resolve(context.getData());
                            }).catch(function (err) {
                                return reject;
                            });
                        } else {
                            _this.propertyToContext(context, action);
                            resolve(context.getData());
                        }
                    }
                } catch (err) {
                    reject(err);
                }
            });
        }
    }]);

    return SingleChain;
}();