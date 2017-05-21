'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fluidChains = require('fluid-chains');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FindPeople = function (_Chain) {
    _inherits(FindPeople, _Chain);

    function FindPeople() {
        _classCallCheck(this, FindPeople);

        return _possibleConstructorReturn(this, (FindPeople.__proto__ || Object.getPrototypeOf(FindPeople)).call(this, 'FindPeople', function (context, param, next) {
            var people = [{
                name: 'Jerico de Guzman',
                job: 'Software Engineer',
                hobbies: ['songwriting', 'programming']
            }, {
                name: 'Jane Doe',
                job: 'Software Engineer',
                hobbies: ['programming']
            }, {
                name: 'Veronia Dalusong',
                job: 'Account Manager',
                hobbies: ['movies', 'listing notes']
            }];
            context.set('people', people);
            next();
        }, 'FindSoftwareEngineers'));
    }

    return FindPeople;
}(_fluidChains.Chain);

exports.default = FindPeople;