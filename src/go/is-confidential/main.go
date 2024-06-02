package main

import (
	"fmt"
	"log"
	"os"

	"github.com/foxytanuki/suave-sandbox/framework"
	"github.com/joho/godotenv"
)

func WithCustomConfig() framework.ConfigOption {
	// init godotenv
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	privateKeyString := os.Getenv("PRIVATE_KEY")
	rpcUrl := os.Getenv("RPC_URL")
	if rpcUrl == "" {
		rpcUrl = "http://localhost:8545"
	}
	fundedAccount := framework.NewPrivKeyFromHex(privateKeyString)
	return func(c *framework.Config) {
		c.FundedAccount = fundedAccount
		c.KettleRPC = rpcUrl
	}
}

func main() {
	fr := framework.New(WithCustomConfig())
	contract := fr.Suave.DeployContract("is-confidential.sol/IsConfidential.json")

	receipt := contract.SendConfidentialRequest("example", nil, nil)
	fmt.Printf("Sent Transaction: https://explorer.rigil.suave.flashbots.net/tx/%s\n", receipt.TxHash)
}
