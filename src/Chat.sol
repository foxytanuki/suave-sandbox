// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.8;

import "suave-std/Suapp.sol";
import "suave-std/Context.sol";
import "suave-std/protocols/ChatGPT.sol";

contract Chat is Suapp {
    Suave.DataId apiKeyRecord;
    string public API_KEY = "API_KEY";

    function updateKeyOnchain(Suave.DataId _apiKeyRecord) public {
        apiKeyRecord = _apiKeyRecord;
    }

    function registerKeyOffchain() public returns (bytes memory) {
        bytes memory keyData = Context.confidentialInputs();

        address[] memory peekers = new address[](1);
        peekers[0] = address(this);

        Suave.DataRecord memory record = Suave.newDataRecord(
            0,
            peekers,
            peekers,
            "api_key"
        );
        Suave.confidentialStore(record.id, API_KEY, keyData);

        return
            abi.encodeWithSelector(this.updateKeyOnchain.selector, record.id);
    }

    event Response(string messages);

    function onchain() public emitOffchainLogs {}

    function offchain() external returns (bytes memory) {
        bytes memory keyData = Suave.confidentialRetrieve(
            apiKeyRecord,
            API_KEY
        );
        string memory apiKey = bytesToString(keyData);
        ChatGPT chatgpt = new ChatGPT(apiKey);

        ChatGPT.Message[] memory messages = new ChatGPT.Message[](1);
        messages[0] = ChatGPT.Message(
            ChatGPT.Role.User,
            "Say something funny in Japanese."
        );

        string memory data = chatgpt.complete(messages);

        emit Response(data);

        return abi.encodeWithSelector(this.onchain.selector);
    }

    function bytesToString(
        bytes memory data
    ) internal pure returns (string memory) {
        uint256 length = data.length;
        bytes memory chars = new bytes(length);

        for (uint i = 0; i < length; i++) {
            chars[i] = data[i];
        }

        return string(chars);
    }
}
