export const MiddlewareStorage = [];

export const addMiddleware = (middleware) => {
    MiddlewareStorage.push(middleware);
}

export const clearMiddleware = () => {
    for (var i = MiddlewareStorage.length; i > 0; i--) {
        MiddlewareStorage.pop();
    }
}

export const getMiddlewares = () => {
    return MiddlewareStorage;
}