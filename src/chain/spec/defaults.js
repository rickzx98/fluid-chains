export class Defaults {
    constructor(field, specData, context) {
        this.field = field;
        this.specData = specData;
        this.context = context;
    }

    runDefault() {
        const { defaultValue } = this.specData;
        return new Promise((resolve, reject) => {
            try {
                this.context.set(this.field, defaultValue);
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }
}