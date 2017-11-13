import { Defaults } from './defaults'
import { Transformer } from './transformer';
import { Translator } from './translator';
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
    runDefault(context) {
        new Defaults(this.field, this.data, context).runDefault();
    }

    runTransform(context) {
        return new Transformer(this.field, this.data, context).runTransform();
    }
    runTranslate(context) {
        return new Translator(this.field, this.data, context).runTranslate();
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