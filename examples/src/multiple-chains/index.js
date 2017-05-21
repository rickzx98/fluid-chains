import { ExecuteChain } from 'fluid-chains';
import FindPeople from './FindPeople';
import FindSoftwareEngineers from './FindSoftwareEngineers';
import LoggerMiddleware from '../middlewares/LoggerMiddleware';

new FindPeople();
new FindSoftwareEngineers();
new LoggerMiddleware();

ExecuteChain('FindPeople', {}, (result) => {
    const softwareEngineers = result.softwareEngineers();
    console.log('softwareEngineers', softwareEngineers);
});