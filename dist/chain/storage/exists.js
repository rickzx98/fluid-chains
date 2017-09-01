"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Checks the name if  already exists in the storage
 * @param {*} storage 
 * @param {*} chainName 
 */
var exists = exports.exists = function exists(storage, chainName) {
  return !!storage[chainName];
};