import { ExecuteChain } from 'fluid-chains';
import FindPeople from './FindPeople';
import FindSoftwareEngineers from './FindSoftwareEngineers';

new FindPeople();
new FindSoftwareEngineers();

ExecuteChain('FindPeople', {}, (result) => {
    const softwareEngineers = result.softwareEngineers();
    console.log('softwareEngineers', softwareEngineers);
});