// SPDX-License-Identifier: BSD-3-CLAUSE
pragma solidity 0.6.9;
pragma experimental ABIEncoderV2;

import { IERC20 } from "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol";
import { KeeperRewardBase } from "./KeeperRewardBase.sol";
import { RedstonePriceFeed } from "../RedstonePriceFeed.sol";

contract KeeperRewardL1 is KeeperRewardBase {
    function initialize(IERC20 _cUSD) external initializer {
        __BaseKeeperReward_init(_cUSD);
    }

    /**
     * @notice call this function to update price feed and get token reward
     */
    function updatePriceFeed(bytes32 _priceFeedKey) external {
        bytes4 selector = RedstonePriceFeed.updatePrice.selector;
        TaskInfo memory task = getTaskInfo(selector);

        RedstonePriceFeed(task.contractAddr).updatePrice(_priceFeedKey);
        postTaskAction(selector);
    }
}
