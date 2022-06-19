export enum AmmInstanceName {
    BTCUSDC = "BTCUSDC",
    ETHUSDC = "ETHUSDC",
    YFIUSDC = "YFIUSDC",
    DOTUSDC = "DOTUSDC",
    SNXUSDC = "SNXUSDC",
    LINKUSDC = "LINKUSDC",
    SDEFIUSDC = "SDEFIUSDC",
    TRXUSDC = "TRXUSDC",
    SCEXUSDC = "SCEXUSDC",
    AAVEUSDC = "AAVEUSDC",
    SUSHIUSDC = "SUSHIUSDC",
    COMPUSDC = "COMPUSDC",
    XAGUSDC = "XAGUSDC",
    RENUSDC = "RENUSDC",
    AUDUSDC = "AUDUSDC",
    PERPUSDC = "PERPUSDC",
    UNIUSDC = "UNIUSDC",
    CRVUSDC = "CRVUSDC",
    MKRUSDC = "MKRUSDC",
    CREAMUSDC = "CREAMUSDC",
    GRTUSDC = "GRTUSDC",
    ALPHAUSDC = "ALPHAUSDC",
    FTTUSDC = "FTTUSDC",
}

export enum ContractName {
    MetaTxGateway = "MetaTxGateway",
    TetherToken = "TetherToken",
    InsuranceFund = "InsuranceFund",
    ChainlinkL1 = "ChainlinkL1",
    L2PriceFeed = "L2PriceFeed",
    ClearingHouse = "ClearingHouse",
    ClearingHouseViewer = "ClearingHouseViewer",
    Amm = "Amm",
    AmmV1 = "AmmV1",
    AmmReader = "AmmReader",
    ClientBridge = "ClientBridge",
    RootBridge = "RootBridge",
    RootBridgeV2 = "RootBridgeV2",
    KeeperRewardL1 = "KeeperRewardL1",
    KeeperRewardL2 = "KeeperRewardL2",
    PerpRewardVesting = "PerpRewardVesting",
    StakedPerpToken = "StakedPerpToken",
    TollPool = "TollPool",
    FeeRewardPoolL1 = "FeeRewardPoolL1",
    FeeTokenPoolDispatcherL1 = "FeeTokenPoolDispatcherL1",
    ChainlinkPriceFeed = "ChainlinkPriceFeed",
}

export enum ContractFullyQualifiedName {
    MetaTxGateway = "src/MetaTxGateway.sol:MetaTxGateway",
    TetherToken = "src/mock/TetherToken.sol:TetherToken",
    InsuranceFund = "src/InsuranceFund.sol:InsuranceFund",
    ChainlinkL1 = "src/ChainlinkL1.sol:ChainlinkL1",
    L2PriceFeed = "src/L2PriceFeed.sol:L2PriceFeed",
    ClearingHouse = "src/ClearingHouse.sol:ClearingHouse",
    ClearingHouseViewer = "src/ClearingHouseViewer.sol:ClearingHouseViewer",
    Amm = "src/Amm.sol:Amm",
    AmmV1 = "src/legacy/AmmV1.sol:Amm",
    AmmReader = "src/AmmReader.sol:AmmReader",
    ClientBridge = "src/bridge/xDai/ClientBridge.sol:ClientBridge",
    RootBridge = "src/bridge/ethereum/RootBridge.sol:RootBridge",
    RootBridgeV2 = "src/bridge/ethereum/RootBridgeV2.sol:RootBridgeV2",
    KeeperRewardL1 = "src/keeper/KeeperRewardL1.sol:KeeperRewardL1",
    KeeperRewardL2 = "src/keeper/KeeperRewardL2.sol:KeeperRewardL2",
    PerpRewardVesting = "src/staking/PerpRewardVesting.sol:PerpRewardVesting",
    StakedPerpToken = "src/staking/StakedPerpToken.sol:StakedPerpToken",
    TollPool = "src/TollPool.sol:TollPool",
    FeeRewardPoolL1 = "src/staking/FeeRewardPoolL1.sol:FeeRewardPoolL1",
    FeeTokenPoolDispatcherL1 = "src/staking/FeeTokenPoolDispatcherL1.sol:FeeTokenPoolDispatcherL1",
    ChainlinkPriceFeed = "src/ChainlinkPriceFeed.sol:ChainlinkPriceFeed",

    // flatten
    FlattenClearingHouse = "flattened/ClearingHouse/src/ClearingHouse.sol:ClearingHouse",
    FlattenInsuranceFund = "flattened/ClearingHouse/src/ClearingHouse.sol:InsuranceFund",
    FlattenMetaTxGateway = "flattened/ClearingHouse/src/ClearingHouse.sol:MetaTxGateway",
    FlattenAmm = "flattened/Amm/src/Amm.sol:Amm",
    FlattenIERC20 = "flattened/ClearingHouse/src/ClearingHouse.sol:IERC20",

    // used in scripts and tests
    IERC20 = "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol:IERC20",
    FlattenAmmUnderClearingHouse = "flattened/ClearingHouse/src/Amm.sol:Amm",
}

export enum ContractInstanceName {
    PerpRewardNoVesting = "PerpRewardNoVesting",
    PerpRewardTwentySixWeeksVesting = "PerpRewardTwentySixWeeksVesting",
    PerpStakingRewardVesting = "PerpStakingRewardVesting",
    PerpStakingRewardNoVesting = "PerpStakingRewardNoVesting",
}

export type ContractId = ContractName | AmmInstanceName | ContractInstanceName

export function isContractId(name: unknown): name is ContractId {
    if (typeof name !== "string") {
        return false
    }
    return (
        Object.keys(ContractName).includes(name) ||
        Object.keys(AmmInstanceName).includes(name) ||
        Object.keys(ContractInstanceName).includes(name)
    )
}
