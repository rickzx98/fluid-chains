import { ArrayChain } from './array-chain';
import Context from '../context/';
import { Reducer } from './reducer';
import { Runner } from './runner';
import { SingleChain } from './single-chain';
import { generateUUID } from '../Util';
import { getChain, createExecutionStack, addChainToStack, deleteStack } from '../storage/';
import {Util} from './util';
export class Executer {
    start(param, chains) {
        return new Runner(getChain, generateUUID, Context,
            SingleChain, ArrayChain,
            Reducer, Util,
            createExecutionStack,
            addChainToStack,
            deleteStack).start(param, chains);
    }
}