/**
 * Creates a clone for context
 * @param {*} context 
 */
export function clone(context, validators) {
    const fields = Object.keys(context);
    fields.forEach(field => {
        if (field !== 'addValidator' &&
            field !== 'validate' &&
            field !== 'set') {
            const fieldValue = context[field];
            if (fieldValue instanceof Function) {
                const value = fieldValue();
                copy.set(key, value);
            }
        }
    });
}