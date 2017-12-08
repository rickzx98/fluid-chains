
export class Util {
    static convertToContextStructure(param, Context, generateUUID) {
        if (!(param instanceof Context)) {
            const newParam = Context.createContext(generateUUID());
            for (let name in param) {
                if (param.hasOwnProperty(name)) {
                    newParam.set(name, param[name]);
                }
            }
            return newParam.getData();
        }
        return param.getData();
    }
}