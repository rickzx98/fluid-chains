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

End with an example of getting some data out of the system or using it for a little demo

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Babel](https://babeljs.io/) - A javascript compiler.

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Jerico de Guzman** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/rickzx98/fluid-chains/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone who's code was used
* Inspiration
* etc
