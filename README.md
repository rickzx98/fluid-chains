# [Fluid-chains](https://rickzx98.github.io/fluid-chains/)

Just a simple way to run asynchronous functions with functional programming in mind.

[![NPM Download Stats](https://nodei.co/npm/fluid-chains.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/fluid-chains)

### Getting Started

Installing fluid-chains is easy. It is not a framework and we want to make it light and simple.

### Installing

```
npm install --save fluid-chains
```

- Javascript (ES6)

```javascript
import {Chain} from 'fluid-chains';
```

- Javascript 
```javascript
var FluidChains = require('fluid-chains');
var Chain  = FluidChains.Chain;
```

### Creating your first chain

```javascript
new Chain('FindPeople', function(context, param, next) {
    var people = ['john','jane','sam'];
    context.set('people', people.filter(
      function(person) { 
         person === param.filterBy() 
        }));
      next();
});

```
### Starting the chain
- ES6
```javascript
import {ExecuteChain} from 'fluid-chains';
```
- Javascript
```javascript
var FluidChains = require('fluid-chains');
var ExecuteChain = FluidChains.ExecuteChain;
```

```javascript
ExecuteChain('FindPeople', {filterBy: 'jane'}, 
    function(result) {
       var people = result.people();;
     console.log('people', people);
});
```

### Creating chain sequence

```javascript
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

```javascript
new Chain('first', function(context,param, next){
   // param.host() can be accessed here
   next()},'second');
new Chain('second', function(context,param,next) {
   next()},'third');
new Chain('third', function(context,param,next {
   // param.host() can be accessed here
   next()},'fourth');
new Chain('fourth', function(context,param,next) {
   next()});

ExecuteChain(['first','third'],{host: 'http://localhost'}, function(result) {
    // last chain processed was "third"
});

```
Note: Executing chains like the sample above will ignore the chain's predefined 
  sequence and it will follow the chain sequence in the array. The sample 
  above will run the "first" chain then "third" as long as you satify their 
  parameter and it will complete the sequence even if there is a sequence 
  defined in the "third" chain (which is the "fourth") thus make the chains reuseable. 

Updates: Parameters can now be used throughout the chains.

### Error handling

You can also use a chain as an error handler. Basically you're just 
creating another chain.

```javascript

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
  /*error handler is on the fourth argument*/); 

new Chain('firstErrorHandler', function(context, param, next) { 
    /*
        param.$error and param.$errorMessage functions
        are created.
    */
    console.log('error', param.$error());  
        // Error('Name is required.');
    console.log('errorMessage', param.$errorMessage()); 
        // 'Name is required.'
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

```javascript
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
    console.log('errorMessage', param.$errorMessage()); 
        // 'Name is required.'
    next();
});

new Chain('anotherErrorHandler', function(context, param, next) { 
    //thirdChain error will also be handled here.
    next();
});
```

Note: For asynchronous callback errors you may do "next(Error)".

```javascript
new Chain('firstChain', function(context, param, next) {
    setTimeout(function() {
        next(new Error('sample'));
    });
}, 'secondChain', 'firstErrorHandler'); 
```
### Using decorator with @ChainAction (ES6 only)

You can create a chain by using decorator @ChainAction. 

```javascript
import {ChainAction, ExecuteChain} from 'fluid-chains';

class Student {

    @ChainAction
    createStudent(context, param, next) {
        //param.name();
        //context.set('studentId',####);
    }

    @ChainAction
    findAll(context, param, next) {

    }

}

const student = new Student();

ExecuteChain(student.CHAIN_CREATESTUDENT, {
        name:'John Doe'
    }, result =>{
        //result.studentId
    })
// student.CHAIN_FINDALL
// student.CHAIN_CREATESTUDENT
```

ChainAction can only be used in a function inside a class. It will initialize a chain based on the function name and
will set a string constant CHAIN_{Name of the function in upper case} in the current class.

### Adding specifications and validation

For each chain we can specify required fields and custom validations

```javascript
var FindPeopleChain = new Chain('FindPeople', function(context, param, next) { 
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
    done(type ==='quick', 'Type should be "quick"'); });

// or

FindPeopleChain.addSpec('email').require('custom message').validator((currentValue, valid)=>{
    valid(currentValue.match('email regex here'));
});

```

### Strict mode

You can turn on strict mode by invoking "ChainStrictModeEnabled" function.

- ES6
```javascript
import {ChainStrictModeEnabled} from 'fluid-chains';
ChainStrictModeEnabled();
```

- Javascript

```javascript
var FluidChains = require('fluid-chains');
var ChainStrictModeEnabled = FluidChains.ChainStrictModeEnabled;
ChainStrictModeEnabled();
```

With strict mode "on", chains can will only accept parameter that is specified in addSpec. 

```javascript
 new Chain('StrictModeChain01', function(context, param, next) {
    context.set('name', 'John');
    context.set('surname', 'Wick');
    context.set('age', 'unknown');
    next();
 }, 'StrictModeChain02');


var strictChain = new Chain('StrictModeChain02', function(context, param, next) {
    param.name() // is available
    param.surname() // is available
    param.age() // is not available 
    next();
}, null, null);

strictChain.addSpec('name', true);
strictChain.addSpec('surname', true)

```

### Caching

Since the chain output can be based on the value of its parameter making it possible 
to cache the output of a chain. 

To enable caching you must have strict mode enabled. 

- ES6
```javascript
import {ChainStrictModeEnabled, ChainCacheEnabled} from 'fluid-chains';
ChainStrictModeEnabled();
ChainCacheEnabled();
```

- Javascript

```javascript
var FluidChains = require('fluid-chains');
var ChainStrictModeEnabled = FluidChains.ChainStrictModeEnabled;
var ChainCacheEnabled = FluidChains.ChainCacheEnabled;
ChainStrictModeEnabled();
ChainCacheEnabled();
```

Note: Only the fields specified in Chain.addSpec() will be used
as identifier of the chain cache. If Chain.addSpec() are not used it will
cache the chain using its name.

### Running with Middlewares

- ES6
```javascript
import { ChainMiddleware } from 'fluid-chains';
```
- Javascript
```javascript
var FluidChains = require('fluid-chains');
var ChainMiddleware = FluidChains.ChainMiddleware;
```

```javascript

/*
    @param param: object = parameters for the next chain
    @param nextChain: string = name of the next chain
    @param next: Function = proceeds to the next chain
*/

new ChainMiddleware('ChainInfoLogger', function(param, nextChain, next) { 
    console.log('from chain', param.$owner());
    console.log('to chain', nextChain);
    next();
});

new ChainMiddleware('ChainAuthentication', function(param, nextChain, next) { 
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
