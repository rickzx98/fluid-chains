# Fluid-chains

Just a simple way to process actions in sequence.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installing

```
npm install --save fluid-chains
```

```
import {Chain} from 'fluid-chains';
```

### Creating your first chain

```
new Chain('FindPeople', (context, param, next) => {
    const people = ['john','jane','sam'];
    context.set('people', people.filter((person) => person === param.filterBy()));
    next();
});
```

### Starting the chain

```
import {ExecuteChain} from 'fluid-chains';

ExecuteChain('FindPeople', {filterBy: 'jane'}, (result) => {
   const people = result.people();;
   console.log('people', people);
});
```

### Creating chain sequence

```
import {Chain, ExecuteChain} from 'fluid-chains';

new Chain('firstChain', (context, param, next) => {
    /* 
        context.set(key, value) will set param value of the 
        next chain. 
    */ 

    if (param.name){
        context.set('remarksTo', param.name());
    } else {
        context.set('remarksTo','everyone');
    }

    next(); /* call to proceed to the next chain. Good for asynchronous callbacks */

}, 'secondChain' /* name of the next chain */); 

new Chain('secondChain', (context, param, next) => { 

    /* 
        the context value of the previous chain can
        be accessed with param.{field}() and it's always
        a Function.
    */

    context.set('remarks','Hello, '+param.remarksTo()+'!');

    next(); /* not calling next() will break the chain and will not trigger the callback below.*/
});

ExecuteChain('firstChain', (result) => {
    /* 
        This will run because you call next()
        from the last chain.
    */
    console.log(result.remarks());
});
```
Note: You cannot put Function as a value in context.set(key, value). You can put value and object.

## Running the tests

To run the test just clone the project and install everything with 
```
npm install
```
then run 
```
npm test
```
### Examples

* [Examples](https://github.com/rickzx98/fluid-chains/tree/master/examples) 

## Built With

* [Babel](https://babeljs.io/) - A javascript compiler.

## Authors

* **Jerico de Guzman** - [LinkedIn](https://www.linkedin.com/in/jerico-de-guzman-35126657)

See also the list of [contributors](https://github.com/rickzx98/fluid-chains/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
