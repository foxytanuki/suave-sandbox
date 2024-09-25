// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.8;

import "suave-std/Suapp.sol";
import "suave-std/protocols/EthJsonRPC.sol";
import "solady/src/utils/JSONParserLib.sol";
import "solady/src/utils/LibString.sol";

contract GetBalanceApp is Suapp {
    using JSONParserLib for *;

    string public constant RPC_URL = "holesky"; // equivalent to http://holesky.toliman.suave-testnets.aws.internal:8545
    // string public constant RPC_URL = "http://localhost:8545"; // succeeds

    event OffchainEvent(uint256 balance);

    function callback(uint256 _balance) external emitOffchainLogs {
        emit OffchainEvent(_balance);
    }

    function getBalance(address _address) external returns (bytes memory) {
        EthJsonRPC jsonrpc = new EthJsonRPC(RPC_URL);
        uint256 balance = jsonrpc.balance(_address);
        return abi.encodeWithSelector(this.callback.selector, balance);
    }

    // for testing purposes
    function getNonce(address _address) external returns (bytes memory) {
        EthJsonRPC jsonrpc = new EthJsonRPC(RPC_URL);
        uint256 nonce = jsonrpc.nonce(_address);
        return abi.encodeWithSelector(this.callback.selector, nonce);
    }
}
