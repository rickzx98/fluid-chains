import { ArrayChain } from './array-chain';
import Context from '../context/';
import { Runner } from './runner';
import { SingleChain } from './single-chain';
import { generateUUID } from '../Util';
import { getChain } from '../storage/';

export class Executer {
    start(param, chains) {
        return new Runner(getChain, generateUUID, Context, SingleChain, ArrayChain).start(param, chains);
    }
}