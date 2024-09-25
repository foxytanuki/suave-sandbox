// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.8;

import "suave-std/Suapp.sol";
import "suave-std/protocols/EthJsonRPC.sol";
import "solady/src/utils/JSONParserLib.sol";
import "solady/src/utils/LibString.sol";

contract GetBalance is Suapp {
    using JSONParserLib for *;

    string public constant RPC_URL = "holesky";

    event OffchainEvent(uint256 balance);

    function callback(uint256 _balance) external emitOffchainLogs {
        emit OffchainEvent(_balance);
    }

    function example(address _address) external returns (bytes memory) {
        bytes memory body = abi.encodePacked(
            '{"jsonrpc":"2.0","method":"eth_getBalance","params":["',
            LibString.toHexStringChecksummed(_address),
            '","latest"],"id":1}'
        );
        JSONParserLib.Item memory item = doRequest(string(body));
        uint256 val = JSONParserLib.parseUintFromHex(trimQuotes(item.value()));
        return abi.encodeWithSelector(this.callback.selector, val);
    }

    function example2(address _address) external returns (bytes memory) {
        EthJsonRPC jsonrpc = new EthJsonRPC(RPC_URL);
        uint256 balance = jsonrpc.balance(_address);
        return abi.encodeWithSelector(this.callback.selector, balance);
    }

    function doRequest(string memory body) public returns (JSONParserLib.Item memory) {
        Suave.HttpRequest memory request;
        request.method = "POST";
        request.url = RPC_URL;
        request.headers = new string[](1);
        request.headers[0] = "Content-Type: application/json";
        request.body = bytes(body);

        bytes memory output = Suave.doHTTPRequest(request);

        JSONParserLib.Item memory item = string(output).parse();
        return item.at('"result"');
    }

    function trimQuotes(string memory input) private pure returns (string memory) {
        bytes memory inputBytes = bytes(input);
        require(
            inputBytes.length >= 2 && inputBytes[0] == '"' && inputBytes[inputBytes.length - 1] == '"', "Invalid input"
        );

        bytes memory result = new bytes(inputBytes.length - 2);

        for (uint256 i = 1; i < inputBytes.length - 1; i++) {
            result[i - 1] = inputBytes[i];
        }

        return string(result);
    }
}
