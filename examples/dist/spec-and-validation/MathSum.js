'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fluidChains = require('fluid-chains');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MathSum = function (_Chain) {
    _inherits(MathSum, _Chain);

    function MathSum() {
        _classCallCheck(this, MathSum);

        var _this = _possibleConstructorReturn(this, (MathSum.__proto__ || Object.getPrototypeOf(MathSum)).call(this, 'MathSum', function (context, param, done) {
            context.set('sum', param.firstNumber() + param.secondNumber());
            done();
        }));

        _this.addSpec('firstNumber', true, undefined, true);
        _this.addSpec('secondNumber', true, undefined, true);
        return _this;
    }

    return MathSum;
}(_fluidChains.Chain);

exports.default = MathSum;