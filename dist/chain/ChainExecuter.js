'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Execute = undefined;

var _ChainStorage = require('./ChainStorage');

var _ContextFactory = require('./ContextFactory');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Execute = exports.Execute = function Execute(name, param, done) {
    var context = (0, _ContextFactory.ConvertToContext)(param);
    context.set('$owner', name + '_starter');
    if (name instanceof Array) {
        ExecuteChains(name, done, 0, param);
    } else if (_ChainStorage.ChainStorage[name]) {
        var chain = _lodash2.default.clone(_lodash2.default.get(_ChainStorage.ChainStorage, name)());
        chain.execute(done, context, name);
    } else {
        throw new Error('Chain ' + name + ' does not exist.');
    }
};

function ExecuteChains(chains, done, index, param) {
    if (!index) {
        index = 0;
    }
    if (index < chains.length) {
        var chain = _lodash2.default.clone(_lodash2.default.get(_ChainStorage.ChainStorage, chains[index])());
        chain.execute(function (result) {
            index++;
            ExecuteChains(chains, done, index, result);
        }, param, nextChain(chains, index), true);
    } else {
        done(param);
    }
}

function nextChain(chains, index) {
    var nextIndex = index + 1;
    if (chains.length > nextIndex) {
        return chains[nextIndex];
    }
}