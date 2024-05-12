import { http, getContract } from "@flashbots/suave-viem";
import { getSuaveWallet } from "@flashbots/suave-viem/chains/utils";
import { readFileSync } from "fs";
import path from "path";

const SUAVE_RPC_URL = "https://rpc.rigil.suave.flashbots.net";
// Change this to a private key with rETH you get from https://faucet.rigil.suave.flashbots.net/
const PRIVATE_KEY = (process.env.PRIVATE_KEY as `0x${string}`) || undefined;
// Change this to the address of the deployed contract
const CONTRACT_ADDRESS = "0x98271843298F7f2d545c9aA2140342B49A451c23";

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

const contract = getContract({
  address: CONTRACT_ADDRESS,
  abi,
  publicClient: undefined,
  walletClient: wallet,
});

const hash = await contract.write.example([]);

console.log(`example() exec tx hash: ${hash}`);
console.log(`https://explorer.rigil.suave.flashbots.net/tx/${hash}`);

const hashNoLogs = await contract.write.exampleNoLogs([]);

console.log(`exampleNoLogs() exec tx hash: ${hashNoLogs}`);
console.log(`https://explorer.rigil.suave.flashbots.net/tx/${hashNoLogs}`);
