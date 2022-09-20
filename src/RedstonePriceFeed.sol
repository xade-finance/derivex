// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity 0.6.9;

import "./PriceAware.sol";
import { BlockContext } from "./utils/BlockContext.sol";
import "./PriceFeedL2.sol";

contract RedstonePriceFeed is PriceAware, BlockContext, PriceFeedL2 {
    function isSignerAuthorized(address _signer) public view virtual override returns (bool) {
        return _signer == 0x0C39486f770B26F5527BBBf942726537986Cd7eb;
        //redstone main provider
    }

    function updatePrice(bytes32 _priceFeedKey) external {
        requireKeyExisted(_priceFeedKey, true);

        uint256 price = getPriceFromMsg(_priceFeedKey);
        this.setLatestData(_priceFeedKey, price, _blockTimestamp());
    }
}
