# foxytanuki's SUAVE SANDBOX

## Requirements

- forge 0.2.0
- suave-geth version 0.1.5-23d7a718-20240404
- go 1.22.3

## Getting Started

```sh
forge build
suave-geth --suave.dev
go run src/go/offchain-logs/main.go
```

### Rigil testnet

Fill .env (Get testnet tokens if needed)

```
pnpm run start ./src/ts/offchain-logs/main.ts
```

## References

https://github.com/foxytanuki/suave-geth
