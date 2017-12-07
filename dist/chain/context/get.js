'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GetContext = exports.GetContext = function () {
    function GetContext(chainId, getChainDataById) {
        _classCallCheck(this, GetContext);

        var currentChain = getChainDataById(chainId);
        console.log('currentChain', currentChain);
        this.context = Object.assign({}, _extends({}, currentChain));
    }

    _createClass(GetContext, [{
        key: 'getContext',
        value: function getContext() {
            return this.context;
        }
    }]);

    return GetContext;
}();