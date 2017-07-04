"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var MiddlewareStorage = exports.MiddlewareStorage = [];

var addMiddleware = exports.addMiddleware = function addMiddleware(middleware) {
    MiddlewareStorage.push(middleware);
};

var clearMiddleware = exports.clearMiddleware = function clearMiddleware() {
    for (var i = MiddlewareStorage.length; i > 0; i--) {
        MiddlewareStorage.pop();
    }
};

var getMiddlewares = exports.getMiddlewares = function getMiddlewares() {
    return MiddlewareStorage;
};