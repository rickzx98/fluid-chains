"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Reducer = exports.Reducer = function () {
    function Reducer(array, param, chainName, getChain, Context, propertyToContext) {
        _classCallCheck(this, Reducer);

        this.array = array;
        this.param = param;
        this.chainName = chainName;
        this.getChain = getChain;
        this.Context = Context;
        this.propertyToContext = propertyToContext;
    }

    _createClass(Reducer, [{
        key: "reduce",
        value: function reduce(done) {
            var _this = this;

            var accumulated = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            try {
                var chain = this.getChain(this.chainName);
                if (this.array && this.array.length > index) {
                    var currentValue = this.array[index];
                    var action = chain.action(Object.assign(this.param, accumulated), currentValue, index);
                    if (action !== undefined) {
                        var context = new this.Context(chain.$chainId);
                        if (action instanceof Promise) {
                            action.then(function (props) {
                                _this.propertyToContext(context, props);
                                new Reducer(_this.array, _this.param, _this.chainName, _this.getChain, _this.generateUUID, _this.Context, _this.propertyToContext).reduce(done, context.getData(), ++index);
                            }).catch(function (err) {
                                return reject;
                            });
                        } else {
                            this.propertyToContext(context, action);
                            new Reducer(this.array, this.param, this.chainName, this.getChain, this.generateUUID, this.Context, this.propertyToContext).reduce(done, context.getData(), ++index);
                        }
                    } else {
                        new Reducer(this.array, this.param, this.chainName, this.getChain, this.generateUUID, this.Context, this.propertyToContext).reduce(done, accumulated, ++index);
                    }
                } else {
                    done(undefined, accumulated);
                }
            } catch (err) {
                done(err);
            }
        }
    }]);

    return Reducer;
}();