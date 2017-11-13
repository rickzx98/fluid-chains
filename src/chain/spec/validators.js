export class Validators {
    constructor(field, contextData, specData) {
        this.field = field;
        this.contextData = contextData;
        this.specData = specData;
    }

    runValidation() {
        const { required, requireMessage, validator } = this.specData;
        return new Promise((resolve, reject) => {
            if (required && (!this.contextData[this.field] || this.contextData[this.field] === '')) {
                reject(new Error(requireMessage || `Field ${this.field} is required.`));
            }
            else if (validator && this.contextData[this.field]) {
                validator.then(() => {
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