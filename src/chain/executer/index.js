import Context from '../context/';
import { Runner } from './runner';
import { generateUUID } from '../Util';
import { getChain } from '../storage/';

export class Executer {
    start(param, chains) {
        return new Runner(getChain, generateUUID, Context).start(param, chains);
    }
}