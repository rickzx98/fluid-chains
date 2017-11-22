export class Validators {
    constructor(field, context, specData) {
        this.field = field;
        this.context = context;
        this.specData = specData;
    }
    
    runRequireValidation() {
        const { require, requireMessage } = this.specData;
        return new Promise((resolve, reject) => {
            const contextData = this.context.getData();
            if (require && (!contextData[this.field] || contextData[this.field]() === '')) {
                reject(new Error(requireMessage || `Field ${this.field} is required.`));
            }
            else {
                resolve();
            }
        });
    }

    runValidation() {
        const { validator } = this.specData;
        return new Promise((resolve, reject) => {
            const contextData = this.context.getData();
            if (validator) {
                validator(contextData[this.field] ? contextData[this.field]() : undefined).then(() => {
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            }
            else {
                resolve();
            }
        });
    }
}