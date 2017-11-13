export class Transformer {
    constructor(field, specData, context) {
        this.field = field;
        this.specData = specData;
        this.context = context;
    }

    runTransform() {
        return new Promise((resolve, reject) => {
            const { transformer } = this.specData;
            if (transformer) {
                const contextData = this.context.getData();
                if (contextData[this.field]) {
                    transformer(contextData[this.field]())
                        .then(newValue => {
                            this.context.set(this.field, newValue);
                            resolve();
                        }).catch(error => { reject(error); });
                } else {
                    resolve();
                }
            } else {
                resolve();
            }
        });
    }
}