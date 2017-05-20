import { ExecuteChain } from '../../src/';
import SayHelloWorld from './SayHelloWorld';

ExecuteChain('SayHelloWorld', {}, () => {
    console.log('executed without a name.');
});

ExecuteChain('SayHelloWorld', { name: 'Jerico' }, () => {
    console.log('executed with a name.');
})