"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SingleChain = exports.SingleChain = function () {
    function SingleChain(getChain, Context, propertyToContext, Reducer, addChainToStack, stackId) {
        _classCallCheck(this, SingleChain);

        this.getChain = getChain;
        this.Context = Context;
        this.propertyToContext = propertyToContext;
        this.Reducer = Reducer;
        this.addChainToStack = addChainToStack;
        this.stackId = stackId;
    }

    _createClass(SingleChain, [{
        key: "start",
        value: function start(initialParam, chains) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    var chain = _this.getChain(chains);
                    try {
                        _this.addChainToStack(_this.stackId, chain.$chainId);
                        var paramAsContext = new _this.Context(initialParam.$chainId());
                        addSpecToContext(chain.specs, paramAsContext);
                        paramAsContext.runSpecs().then(function () {
                            var param = convertParamFromSpec(paramAsContext.getData(), chain);
                            onBeforeChain(chain, param, resolve, function (err) {
                                onFailChain(chain, err, resolve.bind(_this), reject.bind(_this), _this, initialParam, chains);
                            }, _this.Context, function () {
                                if (chain.reducer && param[chain.reducer]) {
                                    var array = param[chain.reducer]();
                                    new _this.Reducer(array, param, chain, _this.Context, _this.propertyToContext).reduce(function (err, result) {
                                        if (err) {
                                            onFailChain(chain, err, resolve.bind(_this), reject.bind(_this), _this, initialParam, chains);
                                        } else {
                                            resolve(result);
                                        }
                                    });
                                } else {
                                    var action = chain.action(param);
                                    var context = _this.Context.createContext(chain.$chainId);
                                    if (action !== undefined) {
                                        if (action instanceof Promise) {
                                            action.then(function (props) {
                                                _this.propertyToContext(context, props);
                                                resolve(context.getData());
                                            }).catch(function (err) {
                                                onFailChain(chain, err, resolve.bind(_this), reject.bind(_this), _this, initialParam, chains);
                                            });
                                        } else {
                                            _this.propertyToContext(context, action);
                                            resolve(context.getData());
                                        }
                                    } else {
                                        resolve(context.getData());
                                    }
                                }
                            });
                        }).catch(function (err) {
                            onFailChain(chain, err, resolve.bind(_this), reject.bind(_this), _this, initialParam, chains);
                        });
                    } catch (err) {
                        onFailChain(chain, err, resolve.bind(_this), reject.bind(_this), _this, initialParam, chains);
                    }
                });
            });
        }
    }]);

    return SingleChain;
}();

var onBeforeChain = function onBeforeChain(chain, param, resolve, reject, Context, next) {
    try {
        var onbefore = chain.onbefore(param);
        if (onbefore instanceof Promise) {
            onbefore.then(function (con) {
                if (con) {
                    next();
                } else {
                    resolve(Context.createContext(chain.$chainId).getData());
                }
            }).catch(function (err) {
                reject(err);
            });
        } else if (onbefore) {
            next();
        } else {
            resolve(Context.createContext(chain.$chainId).getData());
        }
    } catch (err) {
        reject(err);
    }
};

var onFailChain = function onFailChain(chain, error, resolve, reject, singleChain, initialParam, chains) {
    if (chain.onfail) {
        chain.onfail(error, function () {
            singleChain.start(initialParam, chains).then(function (result) {
                resolve(result);
            }).catch(function (err) {
                reject(err);
            });
        }, function () {
            reject(error);
        });
    } else {
        reject(error);
    }
};
var convertParamFromSpec = function convertParamFromSpec(param, chainInstance) {
    var newParam = param;
    if (chainInstance.isStrict) {
        newParam = {};
        if (chainInstance.specs) {
            chainInstance.specs.forEach(function (spec) {
                newParam[spec.field] = param[spec.field];
            });
        }
    }
    return newParam;
};

var addSpecToContext = function addSpecToContext(specs, context) {
    if (specs) {
        specs.forEach(function (spec) {
            context.addSpec(spec);
        });
    }
};