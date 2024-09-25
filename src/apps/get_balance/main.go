package main

import (
	"log"

	"github.com/ethereum/go-ethereum/common"
	"github.com/foxytanuki/suave-sandbox/framework"
	"github.com/holiman/uint256"
)

const CONTRACT_PATH = "getBalance.sol/GetBalanceApp.json"
const RPC_URL = "https://rpc.toliman.suave.flashbots.net"
const WALLET_ADDRESS = "0x39338FD37f41BabC04e119332198346C0EB31022"

func main() {
	log.Println("starting get-balance")
	var balance uint256.Int
	fr := framework.New(framework.WithCustomConfig("", RPC_URL))

	log.Println("deploying contract")
	contract := fr.Suave.DeployContract(CONTRACT_PATH)

	log.Println("sending confidential request")
	receipt := contract.SendConfidentialRequest("getBalance", []interface{}{common.HexToAddress(WALLET_ADDRESS)}, nil)
	if len(receipt.Logs) != 1 {
		panic("one log expected")
	}
	balance.SetBytes(receipt.Logs[0].Data)
	log.Printf("balance: %s", balance.String())

	// get nonce for testing purposes
	var nonce uint256.Int
	receipt = contract.SendConfidentialRequest("getNonce", []interface{}{common.HexToAddress(WALLET_ADDRESS)}, nil)
	if len(receipt.Logs) != 1 {
		panic("one log expected")
	}
	nonce.SetBytes(receipt.Logs[0].Data)
	log.Printf("nonce: %s", nonce.String())
}
