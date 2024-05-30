import {
  http,
  encodeFunctionData,
  decodeEventLog,
} from "@flashbots/suave-viem";
import {
  getSuaveWallet,
  getSuaveProvider,
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

const suaveProvider = getSuaveProvider(http(SUAVE_RPC_URL));
const wallet = getSuaveWallet({
  transport: http(SUAVE_RPC_URL),
  privateKey: PRIVATE_KEY,
});

const json = JSON.parse(
  readFileSync(
    path.resolve(
      __dirname,
      "../../../out/transaction-signing.sol/TransactionSigning.json"
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

const encoder = new TextEncoder();
const byteArray = encoder.encode(PRIVATE_KEY);
const hexString: `0x${string}` = `0x${Array.from(byteArray)
  .map((byte) => byte.toString(16).padStart(2, "0"))
  .join("")}`;

console.log(hexString);

const ccr: TransactionRequestSuave = {
  confidentialInputs: hexString,
  kettleAddress,
  to: CONTRACT_ADDRESS,
  gasPrice: 10000000000n,
  gas: 420000n,
  type: SuaveTxRequestTypes.ConfidentialRequest,
  chainId: 16813125,
  data: data,
};

const hash = await wallet.sendTransaction(ccr);
console.log(`sent ccr! tx hash: ${hash}`);

const receipt = await suaveProvider.getTransactionReceipt({
  hash,
});

const { data: encodedData } = receipt.logs[0];
const event = decodeEventLog({
  abi,
  data: encodedData,
  topics: receipt.logs[0].topics,
});

console.log("event", event);

try {
  if (
    event.args["r"] !==
    "0xeebcfac0def6db5649d0ae6b52ed3b8ba1f5c6c428588df125461113ba8c6749"
  ) {
    throw new Error("r does not match");
  }
  if (
    event.args["s"] !==
    "0x5d5e1aafa0c964b43c251b6a525d49572968f2cebc5868c58bcc9281b9a07505"
  ) {
    throw new Error("s does not match");
  }
} catch (err: any) {
  console.error(err);
}

console.log("Signature Verified");

const res = await wallet.sendTransaction(ccr);

console.log(`example() exec tx hash: ${res}`);
if (isTestnet) {
  console.log(`https://explorer.rigil.suave.flashbots.net/tx/${res}`);
}
