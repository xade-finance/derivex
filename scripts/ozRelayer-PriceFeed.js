const { ethers } = require("ethers");
const { WrapperBuilder } = require("redstone-evm-connector");
const { DefenderRelaySigner, DefenderRelayProvider } = require('defender-relay-client/lib/ethers');

//TODO: import price feed ABI

// Redstone wrapper
exports.main = async function(signer) {
    //TODO: add RedstonePriceFeed address
    const contractAddress = REDSTONE_PRICE_FEED_ADDRESS;
    
    const PriceFeed = new ethers.Contract(contractAddress, REDSTONE.abi, signer);

    const wrappedContract = WrapperBuilder.wrapLite(PriceFeed).usingPriceFeed("redstone", {asset : 'BTC'});
    wrappedContract.updatePrice("BTC");        
}

// Entrypoint for Autotask
exports.handler = async function(credentials) {
    const provider = new DefenderRelayProvider(credentials);
    const signer = new DefenderRelaySigner(credentials, provider, {speed: fast})
    return exports.main(signer)
}

// To run script locally
if (require.main === module) {
    require('dotenv').config();
    const { API_KEY: apiKey, API_SECRET: apiSecret } = process.env;
    exports.handler({ apiKey, apiSecret })
      .then(() => process.exit(0))
      .catch(error => { console.error(error); process.exit(1); });
}
