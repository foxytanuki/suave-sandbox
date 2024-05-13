package main

import (
	"fmt"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/rpc"
)

func main() {
	kettleRPC, err := rpc.Dial("https://rpc.rigil.suave.flashbots.net")
	if err != nil {
		panic(err)
	}

	var accounts []common.Address
	if err := kettleRPC.Call(&accounts, "eth_kettleAddress"); err != nil {
		panic(fmt.Sprintf("failed to get kettle address: %v", err))
	}

	fmt.Println(accounts)
}
