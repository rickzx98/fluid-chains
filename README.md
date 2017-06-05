# [Fluid-chains](https://rickzx98.github.io/fluid-chains/)

Just a simple way to run asynchronous functions with functional programming in mind.

c## Getting Started

Installing fluid-chains is easy. It is not a framework and we want to make it light and simple.

### Installing

```
npm install --save fluid-chains
```

n- Javascript (ES6)

```
import {Chain} from 'fluid-chains';
```

- Javascript 
```
var FluidChains = require('fluid-chains');
var Chain  = FluidChains.Chain;
```

### Creating your first chain

```
new Chain('FindPeople', function(context, param, next) {
    var people = ['john','jane','sam'];
    context.set('people', people.filter(
      function(person) { 
         person === param.filterBy() 
        }));
u      next();
});

```
### Starting the chain

```
import {ExecuteChain} from 'fluid-chains';

ExecuteChain('FindPeople', {filterBy: 'jane'}, 
    function(result) {
       var people = result.people();;
     console.log('people', people);
});
```

### Creating chain sequence

```
import {Chain, ExecuteChain} from 'fluid-chains';

new Chain('firstChain', function(context, param, next) {
    /* 
        context.set(key, value) will set 
        param value of the next chain. 
    */ 
    if (param.name) {
        context.set('remarksTo', param.name());
    } else {
        context.set('remarksTo','everyone');
    }

    next(); 
    /* call to proceed to the next chain. 
    Good for asynchronous callbacks */

}, 'secondChain' /* name of the next chain */); 

new Chain('secondChain', function(context, param, next) { 

    /* 
        the context value of the previous chain can
        be accessed with param.{field}() and it's always
        a Function.
    */
    
    context.set('remarks','Hello, '+param.remarksTo()+'!');

    next(); 
    /* not calling next() will break the chain 
    and will not trigger the callback below.*/
});

ExecuteChain('firstChain', function(result) {
    /* 
        This will run because you call next()
        from the last chain.
    */
    console.log(result.remarks());
});
```
Note: You cannot put Function as a value in context.set(key, value). 
    You can put value and object.

### Can I reuse Chain?
ExecuteChains(Array, Parameter, Done);

```
new Chain('first', function(context,param, next){
   next()},'second');
new Chain('second', function(context,param,next) {
   next()},'third');
new Chain('third', function(context,param,next { 
   next()},'fourth');
new Chain('fourth', function(context,param,next) {
   next()});

ExecuteChain(['first','third'],{}, function(result) {
    // last chain processed was "third"
});

```
Note: Executing chains like the sample above will ignore the chain's predefined 
  sequence and it will follow the chain sequence in the array. The sample 
  above will run the "first" chain then "third" as long as you satify their 
  parameter and it will complete the sequence even if there is a sequence 
  defined in the "third" chain (which is the "fourth") thus make the chains reuseable. 


### Error handling

You can also use a chain as an error handler. Basically you're just 
creating another chain.
```

new Chain('firstChain', function(context, param, next) {

    /* 
        context.set(key, value) will set param value of the 
        next chain. 
    */ 

    if (param.name) {
        context.set('remarksTo', param.name());
    } else {
      throw new Error('Name is required.');
    }
    next();

}, 'secondChain', 'firstErrorHandler' 
n  /*error handler is on the fourth argument*/); 

new Chain('firstErrorHandler', function(context, param, next) { 
    /*
        param.$error and param.$errorMessage functions
        are created.
    */
    console.log('error', param.$error());  
        // Error('Name is required.');
    console.log('errorMessage), param.$errorMessage()); 
u        // 'Name is required.'
    next(); 
    /* 
        You can call next() to finish the chain or 
        just ignore it and break the chain. 
        You can even start a new chain of actions. 
    */
});
```
Note: You can place an error handler for each chain otherwise it will be thrown 
    to the nearest error handler of its previous chain.

```
new Chain('firstChain', function(context, param, next) {
    if (param.name){
        context.set('remarksTo', param.name());
    } else {
        context.set('remarksTo','everyone');
    }
    next();

}, 'secondChain', 'firstErrorHandler'); 

new Chain('secondChain', function(context, param, next) {
    context.set('remarks','Hello, '+param.remarksTo()+'!');
    next();

}, 'thirdChain', 'anotherErrorHandler'); 

new Chain('thirdChain', function(context, param, next) {
   if (param.name){
        context.set('remarksTo', param.name());
    } else {
      throw new Error('Name is required.');
    }
    next();
}); 

new Chain('firstErrorHandler', function(context, param, next) { 
    console.log('error', param.$error());  
        // Error('Name is required.');
    console.log('errorMessage), param.$errorMessage()); 
        // 'Name is required.'
    next();
});

new Chain('anotherErrorHandler', function(context, param, next) { 
    //thirdChain error will also be handled here.
    next();
});
```

Note: For asynchronous callback errors you may do "next(Error)".

```
new Chain('firstChain', function(context, param, next) {
    setTimeout(function() {
        next(new Error('sample'));
    });
}, 'secondChain', 'firstErrorHandler'); 
```

### Adding specifications and validation

For each chain we can specify required fields and custom validations

```
const FindPeopleChain = new Chain('FindPeople', function(context, param, next) { 
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
FindPeopleChain.addSpec('type',true, function(done) {
    done(type ==='quick', 'Type should be "quick"');
});

```

### Strict mode

You can turn on strict mode by putting boolean "true" to the fourth argument of the constructor.

```
const strictChain = new Chain('StrictModeChain02', (context, param, next) => {
            }, null, null, true);
```


With strict mode "on", chains can will only accept parameter that is specified in addSpec. 

```
 new Chain('StrictModeChain01', (context, param, next) => {
    context.set('name', 'John');
    context.set('surname', 'Wick');
    context.set('age', 'unknown');
    next();
 }, 'StrictModeChain02');


const strictChain = new Chain('StrictModeChain02', (context, param, next) => {
    param.name() // is available
    param.surname() // is available
    param.age() // is not available 
    next();
}, null, null, true);

strictChain.addSpec('name', true);
strictChain.addSpec('surname', true)

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

### Examples

* [Examples](https://github.com/rickzx98/fluid-chains/tree/master/examples) 

## Built With

* [Babel](https://babeljs.io/) - A javascript compiler.

## Authors

* **Jerico de Guzman** - [LinkedIn](https://www.linkedin.com/in/jerico-de-guzman-35126657)

See also the list of [contributors](https://github.com/rickzx98/fluid-chains/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
