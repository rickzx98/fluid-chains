import { Chain } from 'fluid-chains';
import lodash from 'lodash';

export default class FindSoftwareEngineers extends Chain {
    constructor() {
        super('FindSoftwareEngineers', (context, param, next) => {
            const softwareEngineers = lodash.filter(param.people(), (person) => person.job === 'Software Engineer');
            context.set('softwareEngineers', softwareEngineers);
            next();
        }, undefined);
    }
}