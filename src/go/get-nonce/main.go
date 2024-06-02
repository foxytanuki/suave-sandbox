package main

import (
	"log"
	"os"

	"github.com/ethereum/go-ethereum/common"
	"github.com/foxytanuki/suave-sandbox/framework"
	"github.com/holiman/uint256"
	"github.com/joho/godotenv"
)

func main() {
	var logs uint256.Int
	// Init godotenv
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Init framework
	fr := framework.New(framework.WithCustomConfig(os.Getenv("PRIVATE_KEY"), os.Getenv("RPC_URL")))
	contract := fr.Suave.DeployContract("getNonce.sol/GetNonce.json")
	address := "0x39338FD37f41BabC04e119332198346C0EB31022"

	receipt := contract.SendConfidentialRequest("example", []interface{}{common.HexToAddress(address)}, nil)
	if len(receipt.Logs) != 1 {
		panic("one log expected")
	}
	logs.SetBytes(receipt.Logs[0].Data)
	log.Println(logs.String())

	var log2 uint256.Int
	receipt2 := contract.SendConfidentialRequest("example2", []interface{}{common.HexToAddress(address)}, nil)
	if len(receipt2.Logs) != 1 {
		panic("one log expected")
	}
	log2.SetBytes(receipt2.Logs[0].Data)
	log.Println(log2.String())
}
