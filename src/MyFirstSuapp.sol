// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.8;

contract MyFirstSuapp {
    event OffchainEvent(uint256 num);

    function onchain() public {}

    function offchain() public returns (bytes memory) {
        emit OffchainEvent(1);
        emit OffchainEvent(2);

        return abi.encodeWithSelector(this.onchain.selector);
    }
}
