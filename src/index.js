import { CacheEnabled, StrictModeEnabled } from './chain/ChainSettings';

import { CH } from './chain/Chain';
import { CM } from './chain/ChainMiddleware';
import { Execute } from './chain/ChainExecuter';

export const Chain = CH;
export const ChainMiddleware = CM;
export const ExecuteChain = Execute;
export const ChainCacheEnabled = CacheEnabled;
export const ChainStrictModeEnabled = StrictModeEnabled;