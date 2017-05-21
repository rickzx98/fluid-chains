import { Chain } from 'fluid-chains';

export default class FindPeople extends Chain {
    constructor() {
        super('FindPeople', (context, param, next) => {
            const people = [
                {
                    name: 'Jerico de Guzman',
                    job: 'Software Engineer',
                    hobbies: ['songwriting', 'programming']
                },
                {
                    name: 'Jane Doe',
                    job: 'Software Engineer',
                    hobbies: ['programming']
                },
                {
                    name: 'Veronia Dalusong',
                    job: 'Account Manager',
                    hobbies: ['movies', 'listing notes']
                }
            ];
            context.set('people', people);
            next();
        }, 'FindSoftwareEngineers');
    }
}