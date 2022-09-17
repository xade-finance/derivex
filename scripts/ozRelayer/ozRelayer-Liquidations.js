const ethers = require("ethers");
const {DefenderRelayProvider, DefenderRelaySigner} = require("defender-relay-client/lib/ethers");

//TO DO: import clearing house ABI
exports.main = async function(signer) {
    const clearingHouseAddress = CLEARING_HOUSE_ADDRESS;
    const clearingHouse = new ethers.Contract(clearingHouseAddress, clearingHouseABI, signer);

    await clearingHouse.retrieveUndercollateralizedPositions()
    .then(async function(result) {
        for (i=0; i < result.length; i++) {
            let amm = result[i].amm;
            let trader = result[i].trader;
            await clearingHouse.liquidate(amm, trader);
        }
    })
}

//entry point for autotask
exports.handler = async function(credentials) {
    const provider = new DefenderRelayProvider(credentials);
    const signer = new DefenderRelaySigner(credentials, provider, {speed: fast});
    return exports.main(signer)
}

//To run script locally
if (require.main === module) {
    require("dotenv").config();
    const {API_KEY: apiKey, API_SECRET: apiSecret} = process.env;
    exports.handler({apiKey, apiSecret})
    .then(() => process.exit(0))
    .catch(error => {console.error(error); process.exit(1);})
}
