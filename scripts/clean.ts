import { rm } from "shelljs"
import { asyncExec } from "./helper"

async function cleanContract() {
    await asyncExec("hardhat clean")
    rm("-rf", "./types")
    rm("-rf", "./flattened")
    rm("./build/*")
}

cleanContract()
