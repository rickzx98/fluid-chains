/**
 * Sets context value
 * @param setChainContext
 * @param chainId
 * @param name
 * @param value
 */
export function setContextValue(setChainContext, chainId, name, value) {
    if (value instanceof Function) {
        throw new FunctionAsValueException();
    }
    setChainContext(chainId, name, value);
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
