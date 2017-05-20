'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RunMiddleware = exports.CM = undefined;

var _ChainStorage = require('./ChainStorage');

var _ChainContext = require('./ChainContext');

var _ChainContext2 = _interopRequireDefault(_ChainContext);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CM = exports.CM = function CM(name, action) {
    _classCallCheck(this, CM);

    validate(name, action);
    this.type = 'MIDDLEWARE';
    this.execute = function (done, param) {
        _lodash2.default.defer(function () {
            try {
                action(param, done);
            } catch (err) {
                done(err);
            }
        });
    };
    (0, _ChainStorage.putChain)(name, this);
};

var RunMiddleware = exports.RunMiddleware = function RunMiddleware(param, done) {
    var middlewares = (0, _ChainStorage.getMiddlewares)();
    if (middlewares && middlewares.length) {
        runMiddleware(middlewares, param, done);
    } else {
        done();
    }
};
function runMiddleware(middlewares, param, done, index) {
    if (!index) {
        index = 0;
    }
    try {
        if (index < middlewares.length) {
            middlewares[index]().execute(function (err) {
                if (err) {
                    done(err);
                } else {
                    index++;
                    runMiddleware(middlewares, param, done, index);
                }
            }, param);
        } else {
            done();
        }
    } catch (err) {
        done(err);
    }
}
function validate(name, action) {
    if (!name) {
        throw new Error('Name is required.');
    }
    if (!action) {
        throw new Error('Action (Function) is required.');
    }
}