import { http, encodeFunctionData } from "@flashbots/suave-viem";
import {
  getSuaveWallet,
  SuaveTxRequestTypes,
  TransactionRequestSuave,
} from "@flashbots/suave-viem/chains/utils";
import { readFileSync } from "fs";
import path from "path";

const isTestnet = process.env.SUAVE_ENV === "rigil" || false;

const SUAVE_RPC_URL = isTestnet
  ? "https://rpc.rigil.suave.flashbots.net"
  : "http://localhost:8545";
// Change this to a private key with rETH you get from https://faucet.rigil.suave.flashbots.net/
const PRIVATE_KEY = isTestnet
  ? (`0x${process.env.PRIVATE_KEY}` as `0x${string}`) || undefined
  : "0x91ab9a7e53c220e6210460b65a7a3bb2ca181412a8a7b43ff336b3df1737ce12";

// Change this to the address of the deployed contract
const CONTRACT_ADDRESS = "0x9c2FD9E8BFA721e8691Bb727b53a891a5d96f923";

const wallet = getSuaveWallet({
  transport: http(SUAVE_RPC_URL),
  privateKey: PRIVATE_KEY,
});

const json = JSON.parse(
  readFileSync(
    path.resolve(
      __dirname,
      "../../../out/is-confidential.sol/IsConfidential.json"
    )
  ).toString()
);
const abi = json.abi;
const data = encodeFunctionData({
  abi,
  functionName: "example",
  args: [],
});

const kettleAddress = isTestnet
  ? "0x03493869959C866713C33669cA118E774A30A0E5"
  : "0xB5fEAfbDD752ad52Afb7e1bD2E40432A485bBB7F";

const ccr: TransactionRequestSuave = {
  confidentialInputs: "0x000",
  kettleAddress,
  to: CONTRACT_ADDRESS,
  gasPrice: 10000000000n,
  gas: 420000n,
  type: SuaveTxRequestTypes.ConfidentialRequest,
  chainId: 16813125,
  data,
};

const res = await wallet.sendTransaction(ccr);

console.log(`example() exec tx hash: ${res}`);
console.log(`https://explorer.rigil.suave.flashbots.net/tx/${res}`);
