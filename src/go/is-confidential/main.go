package main

import (
	"fmt"
	"log"
	"os"

	"github.com/foxytanuki/suave-sandbox/framework"
	"github.com/joho/godotenv"
)

func WithRigil() framework.ConfigOption {
	// init godotenv
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	privateKeyString := os.Getenv("PRIVATE_KEY")
	fundedAccount := framework.NewPrivKeyFromHex(privateKeyString)
	return func(c *framework.Config) {
		c.FundedAccount = fundedAccount
		c.KettleRPC = "https://rpc.rigil.suave.flashbots.net"
	}
}

func main() {
	fr := framework.New(WithRigil())
	contract := fr.Suave.DeployContract("is-confidential.sol/IsConfidential.json")

	receipt := contract.SendConfidentialRequest("example", nil, nil)
	fmt.Printf("Sent Transaction: https://explorer.rigil.suave.flashbots.net/tx/%s\n", receipt.TxHash)
}
