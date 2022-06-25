import path from "path"
import { Network, ozNetworkFile, Stage } from "./common"

export function getRootDir(): string {
    return path.join(__dirname, "..")
}

export function getOpenZeppelinDir() {
    return `${getRootDir()}/.openzeppelin`
}

export function getOpenZeppelinConfigFile(network: Network) {
    return `${getOpenZeppelinDir()}/${ozNetworkFile[network]}.json`
}

export function getSettingsFile(stage: Stage) {
    return `${getRootDir()}/publish/settings/${stage}.json`
}

export function getContractMetadataFile(stage: Stage) {
    return `${getRootDir()}/metadata/${stage}.json`
}
