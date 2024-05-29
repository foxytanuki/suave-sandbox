import { http } from "@flashbots/suave-viem";
import {
  getSuaveProvider,
  getSuaveWallet,
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
const bytecode = json.bytecode.object;

const hash = await wallet.deployContract({
  abi,
  bytecode,
  args: [],
});

console.log(`deploy tx hash: ${hash}`);
console.log(`https://explorer.rigil.suave.flashbots.net/tx/${hash}`);
