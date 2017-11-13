export class Defaults {
    constructor(field, specData, context) {
        this.field = field;
        this.specData = specData;
        this.context = context;
    }

    runDefault() {
        const { defaultValue } = this.specData;
        if (defaultValue) {
            this.context.set(this.field, defaultValue);
        }
    }
}