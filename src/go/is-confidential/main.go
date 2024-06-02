package main

import (
	"log"
	"os"

	"github.com/foxytanuki/suave-sandbox/framework"
	"github.com/joho/godotenv"
)

func main() {
	// Init godotenv
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Init framework
	fr := framework.New(framework.WithCustomConfig(os.Getenv("PRIVATE_KEY"), os.Getenv("RPC_URL")))

	// Deploy contract
	contract := fr.Suave.DeployContract("is-confidential.sol/IsConfidential.json")

	// Send confidential compute request (CCR)
	contract.SendConfidentialRequest("example", nil, nil)
}
