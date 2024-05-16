// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.8;

import "suave-std/Suapp.sol";
import "suave-std/protocols/EthJsonRPC.sol";

contract GetNonce is Suapp {
    event OffchainEvent(uint256 num);

    function callback(uint256 _nonce) external emitOffchainLogs {
        emit OffchainEvent(_nonce);
    }

    function example(address _address) external returns (bytes memory) {
        EthJsonRPC jsonrpc = new EthJsonRPC(
            "https://rpc-sepolia.flashbots.net"
        );
        uint256 nonce = jsonrpc.nonce(_address);
        return abi.encodeWithSelector(this.callback.selector, nonce);
    }
}
