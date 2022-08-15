// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity 0.6.9;

import "./PriceAware.sol";
import { BlockContext } from "./utils/BlockContext.sol";
import "./PriceFeed.sol";

contract RedstonePriceFeed is PriceFeed, PriceAware, BlockContext {
    
    function isSignerAuthorized(address _signer) public virtual view override returns(bool) {
        return _signer == 0xf786a909D559F5Dee2dc6706d8e5A81728a39aE9;
        //redstone-rapid demo provider
    }

    function updatePrice(bytes32 _priceFeedKey) external {
        requireKeyExisted(_priceFeedKey, true);
        
        uint256 price = getPriceFromMsg(bytes32(_priceFeedKey));
        setLatestData(_priceFeedKey, price, _blockTimestamp());
    }
}