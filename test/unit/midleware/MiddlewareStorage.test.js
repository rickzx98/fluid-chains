import 'babel-polyfill';
import chai from 'chai';
import {
  addMiddleware,
  clearMiddleware,
  getMiddlewares
} from '../../../src/middleware/MiddlewareStorage';
const expect = chai.expect;

describe('MiddlewareStorage unit test', () => {
  it('should add middleware', () => {
    clearMiddleware();
    addMiddleware({
      type: 'Middleware',
      target: 'SampleOnle'
    });
    const middlewares = getMiddlewares();
    expect(middlewares.length).to.be.not.undefined;
    expect(middlewares.length).to.be.equal(1);
  });

  it('should get middlewares', () => {
    const middlewares = getMiddlewares();
    expect(middlewares.length).to.be.not.undefined;
    expect(middlewares.length).to.be.equal(1);
  });

  it('should clear middleware storage', () => {
    const middlewares = getMiddlewares();
    expect(middlewares.length).to.be.not.undefined;
    expect(middlewares.length).to.be.equal(1);
    clearMiddleware();
    expect(middlewares.length).to.be.equal(0);
  });
})