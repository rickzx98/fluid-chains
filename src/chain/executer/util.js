export class Util {
   static convertToContextStructure(param) {
        const newParam = {};
        for (let name in param) {
            if (param.hasOwnProperty(name)) {
                newParam[name] = ()=>
                    Object.freeze(param[name]);
            }
        }
        return newParam;
    }
}