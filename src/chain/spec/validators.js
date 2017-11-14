export class Validators {
    constructor(field, contextData, specData) {
        this.field = field;
        this.contextData = contextData;
        this.specData = specData;
    }

    runValidation() {
        const { require, requireMessage, validator } = this.specData;
        return new Promise((resolve, reject) => {
            if (require && (!this.contextData[this.field] || this.contextData[this.field]() === '')) {
                reject(new Error(requireMessage || `Field ${this.field} is required.`));
            }
            else if (validator) {
                validator(this.contextData[this.field] ? this.contextData[this.field]() : undefined).then(() => {
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