export class GetContext {
    constructor(chainId, getChain) {
        const currentChain = getChain(chainId);
        this.context = Object.assign({}, { ...currentChain });
    }
    getContext() {
        return this.context;
    }
}