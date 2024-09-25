package main

import (
	"fmt"
	"log"
	"os"

	"github.com/ethereum/go-ethereum/common"
	"github.com/foxytanuki/suave-sandbox/framework"
	"github.com/holiman/uint256"
)

const CONTRACT_PATH = "getBalance.sol/GetBalance.json"

// const WALLET_ADDRESS = "0x39338FD37f41BabC04e119332198346C0EB31022"
const WALLET_ADDRESS = "0xBE69d72ca5f88aCba033a063dF5DBe43a4148De0"
const RPC_URL = "https://rpc.toliman.suave.flashbots.net"

// const RPC_URL = os.Getenv("RPC_URL")

func main() {
	log.Println("starting get-balance")
	var balance1 uint256.Int
	var balance2 uint256.Int
	fr := framework.New(framework.WithCustomConfig(os.Getenv("PRIVATE_KEY"), RPC_URL))
	log.Println("deploying contract")
	contract := fr.Suave.DeployContract(CONTRACT_PATH)

	log.Println("sending confidential request")
	receipt := contract.SendConfidentialRequest("example", []interface{}{common.HexToAddress(WALLET_ADDRESS)}, nil)
	if len(receipt.Logs) != 1 {
		panic("one log expected")
	}
	balance1.SetBytes(receipt.Logs[0].Data)
	fmt.Println(balance1.String())

	receipt = contract.SendConfidentialRequest("example2", []interface{}{common.HexToAddress(WALLET_ADDRESS)}, nil)
	if len(receipt.Logs) != 1 {
		panic("one log expected")
	}
	balance2.SetBytes(receipt.Logs[0].Data)
	fmt.Println(balance2.String())
}
