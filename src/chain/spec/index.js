import { Validators } from './validators';

export default class Spec {
    constructor(field) {
        this.field = field;
        this.actions = [];
        this.data = {};
        classValidation(this);
    }

    default(defaultValue) {
        addAction(this, 'default');
        this.data = { ...this.data, defaultValue };
    }
    require(requireMessage) {
        addAction(this, 'require');
        this.data = { ...this.data, require: true, requireMessage };
    }
    validate(validator = (currentValue) => new Promise()) {
        addAction(this, 'validate');
        this.data = { ...this.data, validator };
    }
    transform(transformer = (currentValue) => new Promise()) {
        addAction(this, 'transform');
        this.data = { ...this.data, transformer };
    }
    translate(translator = (currentValue, context) => new Promise()) {
        addAction(this, 'translate');
        this.data = { ...this.data, translator };
    }
    runValidation(contextData) {
        new Validators(this.field, contextData, this.data);
    }
}

function addAction(spec, actionName) {
    spec.actions.push(actionName);
}
function classValidation(spec) {
    if (!spec.field) {
        throw new Error('Field name is required.');
    }
}