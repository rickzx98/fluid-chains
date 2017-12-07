export class GetContext {
    constructor(chainId, getChainDataById) {
        const currentChain = getChainDataById(chainId);
        console.log('currentChain', currentChain);
        this.context = Object.assign({}, { ...currentChain });
    }
    getContext() {
        return this.context;
    }
}