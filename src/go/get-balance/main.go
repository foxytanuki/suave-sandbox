package main

import (
	"fmt"

	"github.com/ethereum/go-ethereum/common"
	"github.com/foxytanuki/suave-sandbox/framework"
	"github.com/holiman/uint256"
)

func main() {
	var log uint256.Int
	fr := framework.New()
	contract := fr.Suave.DeployContract("getBalance.sol/GetBalance.json")
	address := "0x39338FD37f41BabC04e119332198346C0EB31022"

	receipt := contract.SendConfidentialRequest("example", []interface{}{common.HexToAddress(address)}, nil)
	if len(receipt.Logs) != 1 {
		panic("one log expected")
	}
	log.SetBytes(receipt.Logs[0].Data)
	fmt.Println(log.String())
}
