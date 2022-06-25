import { Fragment, JsonFragment } from "@ethersproject/abi"
import { Contract, ethers, utils } from "ethers"
import { artifacts } from "hardhat"
import fetch from "node-fetch"
import { ContractFullyQualifiedName } from "../publish/ContractName"
import { Amm, ClearingHouse, ERC20, InsuranceFund } from "../types/ethers"

// TODO move to another standalone repo with SystemTest

const USDC_DECIMALS = 6
const provider = new ethers.providers.JsonRpcProvider("https://rpc.xdaichain.com/")

// string | Array<Fragment | JsonFragment | string> | Interface;
function instance(address: string, abi: Array<string | Fragment | JsonFragment>): Contract {
    return new ethers.Contract(address, abi, provider) as Contract
}

async function healthCheck(): Promise<void> {
    const results = await fetch(`https://metadata.perp.exchange/production.json`)
    const json = await results.json()
    const layer2 = json["layers"]["layer2"]
    const chainlinkPriceFeedAddr = layer2.contracts.ChainlinkPriceFeed.address
    const layer2PriceFeedAddr = layer2.contracts.L2PriceFeed.address

    const AmmArtifact = await artifacts.readArtifact(ContractFullyQualifiedName.Amm)
    const ClearingHouseArtifact = await artifacts.readArtifact(ContractFullyQualifiedName.ClearingHouse)
    const ERC20Artifact = await artifacts.readArtifact(ContractFullyQualifiedName.IERC20)
    const InsuranceFundArtifact = await artifacts.readArtifact(ContractFullyQualifiedName.InsuranceFund)

    const usdc = instance(layer2["externalContracts"]["usdc"], ERC20Artifact.abi) as ERC20
    const arbitrageur = layer2["externalContracts"]["arbitrageur"]
    const insuranceFund = instance(
        layer2["contracts"]["InsuranceFund"]["address"],
        InsuranceFundArtifact.abi,
    ) as InsuranceFund
    const clearingHouse = instance(
        layer2["contracts"]["ClearingHouse"]["address"],
        ClearingHouseArtifact.abi,
    ) as ClearingHouse

    const insuranceFundBalance = await usdc.functions.balanceOf(insuranceFund.address)
    console.log("=========")
    console.log("# InsuranceFund")
    console.log("## Proxy Address: ", insuranceFund.address)
    console.log(`## Balance: ${utils.formatUnits(insuranceFundBalance.toString(), USDC_DECIMALS)}`)

    const clearingHouseBalance = await usdc.functions.balanceOf(clearingHouse.address)
    console.log("=========")
    console.log("# ClearingHouse")
    console.log("## Proxy Address: ", clearingHouse.address)
    console.log(`## Balance: ${utils.formatUnits(clearingHouseBalance.toString(), USDC_DECIMALS)}`)

    const arbBalance = await usdc.functions.balanceOf(arbitrageur)
    console.log("=========")
    console.log("# Arbitrager")
    console.log("## EOA Address: ", arbitrageur)
    console.log(`## Balance: ${utils.formatUnits(arbBalance.toString(), USDC_DECIMALS)}`)

    console.log("=========")
    console.log("# Amm")
    const ammAddressList = await insuranceFund.getAllAmms()
    for (const it of ammAddressList) {
        const amm = instance(it, AmmArtifact.abi) as Amm
        const priceFeedKey = ethers.utils.parseBytes32String(await amm.priceFeedKey())
        const openInterestNotionalCap = await amm.getOpenInterestNotionalCap()
        const openInterestNotional = await clearingHouse.openInterestNotionalMap(it)
        const maxHoldingBaseAsset = await amm.getMaxHoldingBaseAsset()
        const reserve = await amm.getReserve()
        const quoteAssetReserve = reserve[0]
        const baseAssetReserve = reserve[1]
        const priceFeed = await amm.priceFeed()
        let priceFeedName = ""

        if (priceFeed === layer2PriceFeedAddr) {
            priceFeedName = "L2PriceFeed"
        } else if (priceFeed === chainlinkPriceFeedAddr) {
            priceFeedName = "ChainlinkPriceFeed"
        } else {
            throw new Error(
                "PriceFeed is not L2PriceFeed or ChainlinkPriceFeed, check it immediately!! address: " + priceFeed,
            )
        }

        console.log("--------")
        console.log(`## Market: ${priceFeedKey}`)
        console.log(`### Proxy Address: ${it}`)
        console.log(`### OpenInterestNotionalCap: ${utils.formatEther(openInterestNotionalCap.toString())} USDC`)
        console.log(`### OpenInterestNotional: ${utils.formatEther(openInterestNotional.toString())} USDC`)
        console.log(`### MaxHoldingBaseAsset: ${utils.formatEther(maxHoldingBaseAsset.toString())} ${priceFeedKey}`)
        console.log(`### QuoteAssetReserve: ${utils.formatEther(quoteAssetReserve.toString())} USDC`)
        console.log(`### BaseAssetReserve: ${utils.formatEther(baseAssetReserve.toString())} ${priceFeedKey}USDC`)
        console.log(`### PriceFeed: ${priceFeedName}`)
    }
}

if (require.main === module) {
    healthCheck()
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error)
            process.exit(1)
        })
}
