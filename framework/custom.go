package framework

import "log"

func WithCustomConfig(privateKey string, rpcUrl string) ConfigOption {
	if privateKey == "" && rpcUrl == "" {
		log.Fatal("PRIVATE_KEY or RPC_URL must be set")
	} else {
		if privateKey == "" {
			log.Println("PRIVATE_KEY is not set, using default funded account in devnet")
			// This account is funded in your local SUAVE devnet
			// address: 0xBE69d72ca5f88aCba033a063dF5DBe43a4148De0
			privateKey = "91ab9a7e53c220e6210460b65a7a3bb2ca181412a8a7b43ff336b3df1737ce12"
		} else if rpcUrl == "" {
			log.Println("RPC_URL is not set, using default: http://localhost:8545")
			rpcUrl = "http://localhost:8545"
		}
	}
	fundedAccount := NewPrivKeyFromHex(privateKey)
	return func(c *Config) {
		c.FundedAccount = fundedAccount
		c.KettleRPC = rpcUrl
	}
}
