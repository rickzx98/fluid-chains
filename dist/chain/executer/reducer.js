'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Reducer = exports.Reducer = function () {
    function Reducer(array, param, chain, Context, propertyToContext) {
        _classCallCheck(this, Reducer);

        this.array = array;
        this.param = param;
        this.chain = chain;
        this.Context = Context;
        this.propertyToContext = propertyToContext;
    }

    _createClass(Reducer, [{
        key: 'reduce',
        value: function reduce(done) {
            var _this = this;

            var accumulated = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            setTimeout(function () {
                try {
                    if (_this.array && _this.array.length > index) {
                        var currentValue = _this.array[index];
                        console.log('param', _this.param.sampleArray());
                        var action = _this.chain.action(Object.assign(_this.param, accumulated), currentValue, index);
                        if (action !== undefined) {
                            var context = new _this.Context(_this.chain.$chainId);
                            if (action instanceof Promise) {
                                action.then(function (props) {
                                    _this.propertyToContext(context, props);
                                    new Reducer(_this.array, _this.param, _this.chain, _this.Context, _this.propertyToContext).reduce(done, context.getData(), ++index);
                                }).catch(function (err) {
                                    return done;
                                });
                            } else {
                                _this.propertyToContext(context, action);
                                new Reducer(_this.array, _this.param, _this.chain, _this.Context, _this.propertyToContext).reduce(done, context.getData(), ++index);
                            }
                        } else {
                            new Reducer(_this.array, _this.param, _this.chain, _this.Context, _this.propertyToContext).reduce(done, accumulated, ++index);
                        }
                    } else {
                        done(undefined, accumulated);
                    }
                } catch (err) {
                    done(err);
                }
            });
        }
    }]);

    return Reducer;
}();