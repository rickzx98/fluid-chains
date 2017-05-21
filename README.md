# Fluid-chains

Just a simple way to process actions in sequence.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installing

```
npm install --save fluid-chains
```
then import it to your (ES6) javascript file

```
import {Chain, ExecuteChain} from 'fluid-chains';

new Chain('FindPeople', (context, param, next) => {
    const people = ['john','jane','sam'];
    context.set('people', people.filter((person) => person === param.filterBy()));
    next();
});

ExecuteChain('FindPeople', {filterBy: 'jane'}, (result) => {
   const people = result.people();;
   console.log('people', people);
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

* **Jerico de Guzman** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/rickzx98/fluid-chains/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
