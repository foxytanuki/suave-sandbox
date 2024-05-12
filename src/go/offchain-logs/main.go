package main

import (
	"fmt"
	"log"

	"github.com/foxytanuki/suave-sandbox/framework"
	"github.com/holiman/uint256"
)

func main() {
	var log0 uint256.Int
	var log1 uint256.Int
	var log0NoLogs uint256.Int

	// Deploy the contract
	fr := framework.New()
	contract := fr.Suave.DeployContract("offchain-logs.sol/OffchainLogs.json")
	fmt.Println("")

	// emit the CCR and leak the logs
	receipt := contract.SendConfidentialRequest("example", nil, nil)
	log.Printf("Logs length: %d\n", len(receipt.Logs))
	if len(receipt.Logs) != 2 {
		log.Fatal("two logs expected")
	}
	log0.SetBytes(receipt.Logs[0].Data)
	log1.SetBytes(receipt.Logs[1].Data)
	log.Printf("Log 1: %s, Log 2: %s\n\n", log0.String(), log1.String())

	// emit the CCR but DO NOT leak the logs
	receipt = contract.SendConfidentialRequest("exampleNoLogs", nil, nil)
	log.Printf("Logs length: %d\n", len(receipt.Logs))
	if len(receipt.Logs) != 1 {
		log.Fatal("only one log expected")
	}
	log0NoLogs.SetBytes(receipt.Logs[0].Data)
	log.Printf("Log 1: %s\n", log0NoLogs.String())
}
