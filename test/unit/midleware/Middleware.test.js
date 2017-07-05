import 'babel-polyfill';

import {
  Middleware as ChainMiddleware,
  RunMiddleware
} from '../../../src/middleware/Middleware';
import {
  clearMiddleware,
  getMiddlewares
} from '../../../src/middleware/MiddlewareStorage';

import ChainContext from '../../../src/chain/ChainContext';
import chai from 'chai';

const expect = chai.expect;
describe('Middleware Unit', () => {
  describe('constructor', () => {
    before(() => {
      clearMiddleware();
    });
    it('should throw an error when name and actions undefined', () => {
      expect(() => {
        new ChainMiddleware();
      }).to.throw();
    });
    it('should return type MIDDLEWARE', () => {
      const middleware = new ChainMiddleware('hello', () => {});
      expect(middleware.type).to.be.equal('MIDDLEWARE');
    });
  });
  describe('RunMiddleware', () => {
    it('should run middlewares', (done) => {
      clearMiddleware();
      let index = 0;
      new ChainMiddleware((param, context, next) => {
        index++;
        next();
      });
      new ChainMiddleware((param, context, next) => {
        index++;
        next();
      });
      RunMiddleware('chainName', {
        sample: () => 'hello'
      }, new ChainContext(), (err) => {
        expect(index).to.be.equal(2);
        done();
      });
    });
    it('should break when one middleware fails', (done) => {
      clearMiddleware();
      let index = 0;
      new ChainMiddleware((param, context, next) => {
        index++;
        next();
      });
      new ChainMiddleware((param, context, next) => {
        index++;
        throw new Error('Hi');
      });
      new ChainMiddleware((param, context, next) => {
        index++;
        next();
      });
      RunMiddleware('hello', {
        sample: () => 'hello'
      }, new ChainContext(), (err) => {
        expect(err).to.be.not.undefined;
        expect(2).to.be.equal(index);
        done();
      });
    });
    it('should share the same parameter', (done) => {
      clearMiddleware();
      let index = 0;
      new ChainMiddleware((param, context, next) => {
        if (param.sample() === 'hello') {
          index++;
        }
        next();
      });
      new ChainMiddleware((param, context, next) => {
        if (param.sample() === 'hello') {
          index++;
        }
        next();
      });
      new ChainMiddleware((param, context, next) => {
        if (param.sample() === 'hello') {
          index++;
        }
        next();
      });
      RunMiddleware('chainSample', {
        sample: () => 'hello'
      }, new ChainContext(), (err) => {
        expect(index).to.be.equal(3);
        done();
      });
    });
    it('should run only the specific chain', (done) => {
      clearMiddleware();
      let index = 0;
      new ChainMiddleware('ChainOneOnly', (param, context, next) => {
        index++;
        next();
      });
      new ChainMiddleware('ChainOneTwo', (param, context, next) => {
        index++;
        next();
      });

      RunMiddleware('ChainOneOnly', {}, new ChainContext(), err => {
        expect(1).to.be.equal(index);
        done();
      })
    });
    it('should run only the specific chain using regex', (done) => {
      clearMiddleware();
      let index = 0;
      new ChainMiddleware(/^Chain/g, (param, context, next) => {
        index++;
        next();
      });

      new ChainMiddleware(/^Chain/g, (param, context, next) => {
        index++;
        next();
      });

      RunMiddleware('ChainOneOnly', {}, new ChainContext(), err => {
        expect(index).to.be.equal(2);
        done();
      })
    });
  })
});