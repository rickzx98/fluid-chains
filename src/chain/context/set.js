/**
 * Sets context value
 * @param isValidJson
 * @param setChainContext
 * @param getChainContext
 * @param context
 * @param chainId
 * @param name
 * @param value
 */
export function setContextValue(isValidJson, setChainContext, getChainContext, context, chainId, name, value) {
    if (value instanceof Function) {
        throw new FunctionAsValueException();
    }
    /* TODO: Why?? 
    else if (!isValidJson(value)) {
         throw new InvalidJSONValueException(value);
     } */
    setChainContext(chainId, name, value);
    context[name] = () => {
        return Object.freeze(getChainContext(chainId, name));
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
