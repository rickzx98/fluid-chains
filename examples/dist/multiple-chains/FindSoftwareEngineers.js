'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fluidChains = require('fluid-chains');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FindSoftwareEngineers = function (_Chain) {
    _inherits(FindSoftwareEngineers, _Chain);

    function FindSoftwareEngineers() {
        _classCallCheck(this, FindSoftwareEngineers);

        return _possibleConstructorReturn(this, (FindSoftwareEngineers.__proto__ || Object.getPrototypeOf(FindSoftwareEngineers)).call(this, 'FindSoftwareEngineers', function (context, param, next) {
            var softwareEngineers = _lodash2.default.filter(param.people(), function (person) {
                return person.job === 'Software Engineer';
            });
            context.set('softwareEngineers', softwareEngineers);
            next();
        }, undefined));
    }

    return FindSoftwareEngineers;
}(_fluidChains.Chain);

exports.default = FindSoftwareEngineers;