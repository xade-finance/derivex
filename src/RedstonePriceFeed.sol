// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity 0.6.9;

import { PriceAware } from "./PriceAware.sol";
import { BlockContext } from "./utils/BlockContext.sol";
import { PriceFeedL2 } from "./PriceFeedL2.sol";
import { XadeOwnableUpgrade } from "./utils/XadeOwnableUpgrade.sol";

contract RedstonePriceFeed is PriceAware, BlockContext, XadeOwnableUpgrade, PriceFeedL2 {
    //address of provider
    address public signer;

    function isSignerAuthorized(address _signer) public view virtual override returns (bool) {
        return _signer == signer;
    }

    function updatePrice(bytes32 _priceFeedKey) external {
        requireKeyExisted(_priceFeedKey, true);

        uint256 price = getPriceFromMsg(_priceFeedKey);
        setLatestData(_priceFeedKey, price, _blockTimestamp());
    }

    function setSigner(address _signer) external onlyOwner {
        require(_signer != address(0));
        signer = _signer;
    }
}
