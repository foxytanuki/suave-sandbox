package main

import (
	"github.com/foxytanuki/suave-sandbox/framework"
)

func main() {
	fr := framework.New()
	fr.Suave.DeployContract("offchain-logs.sol/OffchainLogs.json")
	// log.Default().Println(contract)

	// receipt := contract.SendConfidentialRequest("example", nil, nil)
	// if len(receipt.Logs) != 2 {
	// 	log.Fatal("two logs expected")
	// }

	// // emit the CCR but DO NOT leak the logs
	// receipt = contract.SendConfidentialRequest("exampleNoLogs", nil, nil)
	// if len(receipt.Logs) != 1 {
	// 	log.Fatal("only one log expected")
	// }
}
