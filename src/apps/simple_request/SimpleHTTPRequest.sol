// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.8;

import "suave-std/Suapp.sol";
import "suave-std/suavelib/Suave.sol";
import "solady/src/utils/JSONParserLib.sol";
import "solady/src/utils/LibString.sol";

contract SimpleHTTPRequest is Suapp {
    using JSONParserLib for *;

    event OffchainEvent(bytes response);

    function callback(bytes memory response) external emitOffchainLogs {
        emit OffchainEvent(response);
    }

    function get(string memory url) external returns (bytes memory) {
        Suave.HttpRequest memory request;
        request.method = "GET";
        request.url = url;

        bytes memory response = Suave.doHTTPRequest(request);
        return abi.encodeWithSelector(this.callback.selector, response);
    }
}
