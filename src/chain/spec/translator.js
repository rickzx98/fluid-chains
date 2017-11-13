export class Translator {
    constructor(field, specData, context) {
        this.field = field;
        this.specData = specData;
        this.context = context;
    }

    runTranslate() {
        return new Promise((resolve, reject) => {
            const { translator } = this.specData;
            if (translator) {
                const contextData = this.context.getData();
                if (contextData[this.field]) {
                    translator(contextData[this.field](), this.context)
                        .then(() => {
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