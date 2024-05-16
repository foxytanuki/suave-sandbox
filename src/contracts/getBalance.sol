// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.8;

import "suave-std/Suapp.sol";
import "suave-std/protocols/EthJsonRPC.sol";
import "solady/src/utils/JSONParserLib.sol";

contract GetBalance is Suapp {
    event OffchainEvent(uint256 balance);

    function callback(uint256 _balance) external emitOffchainLogs {
        emit OffchainEvent(_balance);
    }

    function example(address _address) external returns (bytes memory) {
        EthJsonRPC jsonrpc = new EthJsonRPC(
            "https://rpc-sepolia.flashbots.net"
        );
        bytes memory body = abi.encodePacked(
            '{"jsonrpc":"2.0","method":"eth_getBalance","params":["',
            LibString.toHexStringChecksummed(_address),
            '","latest"],"id":1}'
        );
        JSONParserLib.Item memory item = jsonrpc.doRequest(string(body));
        uint256 val = JSONParserLib.parseUintFromHex(trimQuotes(item.value()));
        return abi.encodeWithSelector(this.callback.selector, val);
    }

    function trimQuotes(
        string memory input
    ) private pure returns (string memory) {
        bytes memory inputBytes = bytes(input);
        require(
            inputBytes.length >= 2 &&
                inputBytes[0] == '"' &&
                inputBytes[inputBytes.length - 1] == '"',
            "Invalid input"
        );

        bytes memory result = new bytes(inputBytes.length - 2);

        for (uint256 i = 1; i < inputBytes.length - 1; i++) {
            result[i - 1] = inputBytes[i];
        }

        return string(result);
    }
}
