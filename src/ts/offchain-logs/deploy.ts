import { http } from "@flashbots/suave-viem";
import { getSuaveWallet } from "@flashbots/suave-viem/chains/utils";
import { readFileSync } from "fs";
import path from "path";

const SUAVE_RPC_URL = "https://rpc.rigil.suave.flashbots.net";
// Change this to a private key with rETH you get from https://faucet.rigil.suave.flashbots.net/
const PRIVATE_KEY = (process.env.PRIVATE_KEY as `0x${string}`) || undefined;

const wallet = getSuaveWallet({
  transport: http(SUAVE_RPC_URL),
  privateKey: PRIVATE_KEY,
});

const json = JSON.parse(
  readFileSync(
    path.resolve(__dirname, "../../../out/offchain-logs.sol/OffchainLogs.json")
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
