package main

import (
	"fmt"
	"log"
	"os"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/rpc"
	"github.com/ethereum/go-ethereum/suave/sdk"
	"github.com/foxytanuki/suave-sandbox/framework"
	"github.com/joho/godotenv"
)

func main() {
	// init godotenv
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	kettleRPC, err := rpc.Dial("https://rpc.rigil.suave.flashbots.net")
	if err != nil {
		panic(err)
	}
	privateKeyString := os.Getenv("PRIVATE_KEY")
	fundedAccount := framework.NewPrivKeyFromHex(privateKeyString)
	kettleAddress := common.HexToAddress("03493869959c866713c33669ca118e774a30a0e5")
	client := sdk.NewClient(kettleRPC, fundedAccount.Priv, kettleAddress)

	path := "confidential-store.sol/ConfidentialStore.json"
	artifact, err := framework.ReadArtifact(path)
	if err != nil {
		panic(err)
	}
	txResult, err := sdk.DeployContract(artifact.Code, client)
	if err != nil {
		panic(err)
	}
	fmt.Printf("Sent Deploy Contract Tx: https://explorer.rigil.suave.flashbots.net/tx/%s\n", txResult.Hash())
	receipt, err := txResult.Wait()
	if err != nil {
		panic(err)
	}
	fmt.Printf("Deployed Contract: https://explorer.rigil.suave.flashbots.net/address/%s\n", receipt.ContractAddress)

	contract := sdk.GetContract(receipt.ContractAddress, artifact.Abi, client)
	txResult, err = contract.SendTransaction("example", nil, nil)
	if err != nil {
		panic(err)
	}
	receipt, err = txResult.Wait()
	if err != nil {
		panic(err)
	}
	fmt.Printf("Sent Transaction: https://explorer.rigil.suave.flashbots.net/tx/%s\n", receipt.TxHash)
}
