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

### Error handling

You can also use a chain as an error handler. Basically you're just creating another chain.
```

new Chain('firstChain', (context, param, next) => {

    /* 
        context.set(key, value) will set param value of the 
        next chain. 
    */ 

    if (param.name){
        context.set('remarksTo', param.name());
    } else {
      throw new Error('Name is required.');
    }
    next();

}, 'secondChain', 'firstErrorHandler' /*error handler is on the fourth argument*/); 

new Chain('firstErrorHandler', (context, param, next) => { 
    /*
        param.$error and param.$errorMessage functions
        are created.
    */
    console.log('error', param.$error());  // Error('Name is required.');
    console.log('errorMessage), param.$errorMessage()); // 'Name is required.'
    next(); 
    /* 
        You can call next() to finish the chain or 
        just ignore it and break the chain. 
        You can even start a new chain of actions. 
    */
});
```
Note: You can place an error handler for each chain otherwise it will be thrown to the nearest error handler of its previous chain.

```
new Chain('firstChain', (context, param, next) => {
    if (param.name){
        context.set('remarksTo', param.name());
    } else {
        context.set('remarksTo','everyone');
    }
    next();

}, 'secondChain', 'firstErrorHandler'); 

new Chain('secondChain', (context, param, next) => {
    context.set('remarks','Hello, '+param.remarksTo()+'!');
    next();

}, 'thirdChain', 'anotherErrorHandler'); 

new Chain('thirdChain', (context, param, next) => {
   if (param.name){
        context.set('remarksTo', param.name());
    } else {
      throw new Error('Name is required.');
    }
    next();
}); 

new Chain('firstErrorHandler', (context, param, next) => { 
    console.log('error', param.$error());  // Error('Name is required.');
    console.log('errorMessage), param.$errorMessage()); // 'Name is required.'
    next();
});

new Chain('anotherErrorHandler', (context, param, next) => { 
    //thirdChain error will also be handled here.
    next();
});
```

Note: For asynchronous callback errors you may do "next(Error)".

```
new Chain('firstChain', (context, param, next) => {
    setTimeout(()=>{
        next(new Error('sample'));
    });
}, 'secondChain', 'firstErrorHandler'); 
```

### Adding specifications and validation

For each chain we can specify required fields and custom validations

```
const FindPeopleChain = new Chain('FindPeople', (context, param, next)=> { 
    param.name() // should not be null or empty
    param.type() // should not be null or empty and must be "quick"
    next();
});

/*
    @param field: string,
    @param required: boolean
    @param customerValidation (Optional) : Function(callback) => callback(valid, message) 
*/
FindPeopleChain.addSpec('name', true);
FindPeopleChain.addSpec('type',true, (done)=> {
    done(type ==='quick', 'Type should be "quick"');
});

```

### Running with Middlewares

Creating middlewares are never been as easy as the following
```
import { ChainMiddleware } from 'fluid-chains';

/*
    @param param: object = parameters for the next chain
    @param nextChain: string = name of the next chain
    @param next: Function = proceeds to the next chain
*/
new ChainMiddleware('ChainInfoLogger', (param, nextChain, next) => { 
    console.log('from chain', param.$owner());
    console.log('to chain', nextChain);
    next();
});

new ChainMiddleware('ChainAuthentication', (param, nextChain, next) => { 
    if(nextChain === 'CreatePeopleChain' && param.sessionKey){
        //validates 
    } else {
        throw new Error('Chain authentication failed.');
    }
    next();
});

```

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
