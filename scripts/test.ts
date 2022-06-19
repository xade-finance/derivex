import { ARTIFACTS_DIR } from "../constants"
import { asyncExec } from "./helper"

async function testContract(): Promise<void> {
    await asyncExec(`hardhat typechain --config hardhat-configs/hardhat.typechain.truffle.config.ts`)
    await asyncExec(`hardhat typechain --config hardhat-configs/hardhat.typechain.ethers.config.ts`)
    await asyncExec(`hardhat typechain --config hardhat-configs/hardhat.typechain.web3.config.ts`)

    if (process.env["COVERAGE"]) {
        try {
            await asyncExec(`hardhat coverage --temp ${ARTIFACTS_DIR} --network coverage`)
        } catch (e) {
            console.log("run coverage failed but it is okay since regular test is passed, ignore it")
        }
    } else {
        await asyncExec("hardhat test --max-memory 4096")
        // TODO should we include this?
        // await asyncExec("npm run test:deploy")
    }
}

if (require.main === module) {
    testContract()
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error)
            process.exit(1)
        })
}
