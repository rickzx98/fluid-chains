'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fluidChains = require('fluid-chains');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SayHelloWorldErrorHandler = function (_Chain) {
    _inherits(SayHelloWorldErrorHandler, _Chain);

    function SayHelloWorldErrorHandler() {
        _classCallCheck(this, SayHelloWorldErrorHandler);

        return _possibleConstructorReturn(this, (SayHelloWorldErrorHandler.__proto__ || Object.getPrototypeOf(SayHelloWorldErrorHandler)).call(this, 'SayHelloWorldErrorHandler', function (context, param, next) {
            console.log('param.$errorMessage()', param.$errorMessage());
            console.log('An error has occured in chain ' + param.$name() + '. Error message: ' + param.$errorMessage().message);
            next();
        }));
    }

    return SayHelloWorldErrorHandler;
}(_fluidChains.Chain);

exports.default = SayHelloWorldErrorHandler;