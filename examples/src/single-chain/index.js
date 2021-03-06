import { ExecuteChain } from 'fluid-chains';
import SayHelloWorld from './SayHelloWorld';
import SayHelloWorldErrorHandling from './SayHelloWorldErrorHandler';

new SayHelloWorld();
new SayHelloWorldErrorHandling();

ExecuteChain('SayHelloWorld', {}, () => {
    console.log('executed without a name.');
});

ExecuteChain('SayHelloWorld', { name: 'Jerico' }, () => {
    console.log('executed with a name.');
});

ExecuteChain('SayHelloWorld', { name: 'fail' }, () => {
    console.log('executed with a name.');
});