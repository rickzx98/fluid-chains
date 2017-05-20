'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _src = require('../../src');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SayHelloWorld = function (_Chain) {
    _inherits(SayHelloWorld, _Chain);

    function SayHelloWorld() {
        _classCallCheck(this, SayHelloWorld);

        return _possibleConstructorReturn(this, (SayHelloWorld.__proto__ || Object.getPrototypeOf(SayHelloWorld)).call(this, 'SayHelloWorld', function (context, param, next) {
            if (param.name) {
                console.log('hello ', param.name());
            } else {
                console.log('hello world');
            }
            next();
        }));
    }

    return SayHelloWorld;
}(_src.Chain);

exports.default = SayHelloWorld;