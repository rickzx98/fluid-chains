export class GetContext {
    constructor(chainId, getChainDataById) {
        const currentChain = getChainDataById(chainId);
        this.context = Object.assign({}, { ...currentChain });
    }
    getContext() {
        return this.context;
    }
}