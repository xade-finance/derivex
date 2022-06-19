/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { artifacts, ethers } from "hardhat"
import { PerpRewardVesting } from "../../types/ethers"
import { getImplementation } from "../contract/DeployUtil"
import { ContractFullyQualifiedName, ContractInstanceName } from "../ContractName"
import { MigrationContext, MigrationDefinition } from "../Migration"

const migration: MigrationDefinition = {
    // batch 2
    // deploy PerpRewardVesting - 0 vesting & 12 weeks vesting
    getTasks: (context: MigrationContext) => [
        async (): Promise<void> => {
            console.log("deploy PerpRewardVesting with 0 vesting...")
            const perpAddr = context.settingsDao.getExternalContracts(context.layer).perp!
            await context.factory
                .create<PerpRewardVesting>(
                    ContractFullyQualifiedName.PerpRewardVesting,
                    ContractInstanceName.PerpRewardNoVesting,
                )
                .deployUpgradableContract(perpAddr, 0)
        },
        async (): Promise<void> => {
            const gov = context.externalContract.rewardGovernance!
            console.log(
                `transferring PerpRewardNoVesting's owner to governance=${gov}...please remember to claim the ownership`,
            )
            const reward = await context.factory
                .create<PerpRewardVesting>(
                    ContractFullyQualifiedName.PerpRewardVesting,
                    ContractInstanceName.PerpRewardNoVesting,
                )
                .instance()
            await (await reward.setOwner(gov)).wait(context.deployConfig.confirmations)
        },
        async (): Promise<void> => {
            console.log("deploy PerpRewardVesting with 24w vesting...")
            const perpAddr = context.settingsDao.getExternalContracts(context.layer).perp!
            await context.factory
                .create<PerpRewardVesting>(
                    ContractFullyQualifiedName.PerpRewardVesting,
                    ContractInstanceName.PerpRewardTwentySixWeeksVesting,
                )
                .deployUpgradableContract(perpAddr, context.deployConfig.defaultPerpRewardVestingPeriod)
        },
        async (): Promise<void> => {
            const gov = context.externalContract.rewardGovernance!
            console.log(
                `transferring PerpRewardTwentySixWeeksVesting's owner to governance=${gov}...please remember to claim the ownership`,
            )
            const reward = await context.factory
                .create<PerpRewardVesting>(
                    ContractFullyQualifiedName.PerpRewardVesting,
                    ContractInstanceName.PerpRewardTwentySixWeeksVesting,
                )
                .instance()
            await (await reward.setOwner(gov)).wait(context.deployConfig.confirmations)
        },
        async (): Promise<void> => {
            console.log("call PerpRewardTwentySixWeeksVesting.initialize() on implementation to avoid security issue")
            const reward = await context.factory
                .create<PerpRewardVesting>(
                    ContractFullyQualifiedName.PerpRewardVesting,
                    ContractInstanceName.PerpRewardTwentySixWeeksVesting,
                )
                .instance()
            const perpAddr = context.settingsDao.getExternalContracts(context.layer).perp!
            const impAddr = await getImplementation(reward.address)
            console.log("implementation address: ", impAddr)

            const PerpRewardVestingArtifact = await artifacts.readArtifact(ContractFullyQualifiedName.PerpRewardVesting)
            const imp = await ethers.getContractAt(PerpRewardVestingArtifact.abi, impAddr)
            const tx = await imp.initialize(perpAddr, context.deployConfig.defaultPerpRewardVestingPeriod)
            await tx.wait(context.deployConfig.confirmations)
        },
    ],
}

export default migration
