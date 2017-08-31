import { isValidJson } from '../Util';

/**
 * Sets context value
 * @param {*} context 
 * @param {*} name 
 * @param {*} value 
 */
export function setContextValue(context, name, value) {
    if (value instanceof Function) {
        throw new FunctionAsValueException();
    }
    else if (!isValidJson(value)) {
        throw new InvalidJSONValueException(value);
    }
    const newValue = {};
    newValue[name] = () => {

    }
}

class FunctionAsValueException extends Error {
    constructor() {
        super('Function cannot be set as value.');
    }
}

class InvalidJSONValueException extends Error {
    constructor(value) {
        super(`{value}  is not a valid json value.`);
    }
}
