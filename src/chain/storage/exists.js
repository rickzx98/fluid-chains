/**
 * Checks the name if  already exists in the storage
 * @param {*} storage 
 * @param {*} chainName 
 */
export const exists = (storage, chainName) => {
    return !!storage[chainName];
}