// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "suave-std/Suapp.sol";

contract MyFirstSuapp is Suapp {
    event OffchainEvent(uint256 num);

    function onchain() public emitOffchainLogs {}

    function offchain() public returns (bytes memory) {
        emit OffchainEvent(1);
        emit OffchainEvent(2);

        return abi.encodeWithSelector(this.onchain.selector);
    }
}
