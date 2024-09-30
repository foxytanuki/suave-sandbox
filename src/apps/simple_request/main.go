package main

import (
	"log"

	"github.com/foxytanuki/suave-sandbox/framework"
)

const CONTRACT_PATH = "SimpleHTTPRequest.sol/SimpleHTTPRequest.json"
const RPC_URL = "https://rpc.toliman.suave.flashbots.net"
const WALLET_ADDRESS = "0x39338FD37f41BabC04e119332198346C0EB31022"
const URL = "http://httpbin.org/get"

func main() {
	log.Println("starting simple-http-request")
	var response []byte
	fr := framework.New(framework.WithCustomConfig("", RPC_URL))

	log.Println("deploying contract")
	contract := fr.Suave.DeployContract(CONTRACT_PATH)

	log.Println("sending confidential request")
	receipt := contract.SendConfidentialRequest("get", []interface{}{URL}, nil)
	if len(receipt.Logs) != 1 {
		panic("one log expected")
	}
	response = receipt.Logs[0].Data
	log.Printf("response: %s", string(response))
}
