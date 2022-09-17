const ethers = require("ethers");
const {DefenderRelayProvider, DefenderRelaySigner} = require("defender-relay-client/lib/ethers");

//TO DO: import clearingHouse ABI

exports.main = async function(signer) {
    // TO DO: add clearing house and amm addresses
    const clearingHouseAddress = CLEARING_HOUSE_ADDRESS;
    const ammAddress = BTC_AMM_ADDRESS;
    const clearingHouse = new ethers.Contract(clearingHouseAddress, clearingHouseABI, signer);

    clearingHouse.payFunding(ammAddress);
}

// entry point for Autotask
exports.handler = async function(credentials) {
    const provider = new DefenderRelayProvider(credentials);
    const signer = new DefenderRelaySigner(credentials, provider, {speed: fast});
    return exports.main(signer);
}

// To run locally
if (require.main === module) {
    require('dotenv').config();
    const {API_KEY :apiKey, API_SECRET: apiSecret} = process.env;
    exports.handler({apiKey, apiSecret})
    .then(() => process.exit(0))
    .catch(error => {console.error(); process.exit(1);});
}
