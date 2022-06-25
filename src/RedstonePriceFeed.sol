// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "redstone-finance/redstone-evm-connector/blob/master/contracts/message-based/PriceAware.sol";
import "./PriceFeed.sol";

contract RedstonePriceFeed is PriceFeed, PriceAware {
    
    address public authorizedSigner;

    function isSignerAuthorized(address _signer) public virtual view override returns(bool) {
        return _signer == authorizedSigner;
    }

    function updatePrice(bytes32 _priceFeedKey) external onlyBridge {
        require(IAMB(ambBridge).messageSender() == rootBridge, "sender not RootBridge");
        requireKeyExisted(_priceFeedKey, true);
        require(_timestamp > getLatestTimestamp(_priceFeedKey), "incorrect timestamp");
        require(isSignerAuthorized(msg.sender), "unauthorized signer");
        
        uint256 price = getPriceFromMsg(_priceFeedKey);
        setLatestData(_priceFeedKey, price, block.timestamp);
    }
}