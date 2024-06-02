import { http, encodeFunctionData } from "@flashbots/suave-viem";
import {
  getSuaveWallet,
  SuaveTxRequestTypes,
  TransactionRequestSuave,
} from "@flashbots/suave-viem/chains/utils";
import Suave from "../suave";

// Change this to the address of the deployed contract
const CONTRACT_ADDRESS = "0x28dB243FBffF37748Da01729d57Eb55D6fcb2F56";

// Change this to a private key with rETH you get from https://faucet.rigil.suave.flashbots.net/
const PRIVATE_KEY =
  (`0x${process.env.PRIVATE_KEY}` as `0x${string}`) || undefined;

const suave = new Suave(true, PRIVATE_KEY);
const wallet = suave.getWallet();
const provider = suave.getProvider();
const { abi } = suave.getContractArtifacts(
  "offchain-logs.sol/OffchainLogs.json"
);

let nonce = await provider.getTransactionCount({
  address: wallet.account.address,
});

const trial = ["example", "exampleNoLogs"];

trial.forEach(async (functionName: string) => {
  const data = encodeFunctionData({
    abi,
    functionName,
    args: [],
  });
  const ccr: TransactionRequestSuave = {
    confidentialInputs: "0x000",
    kettleAddress: "0x03493869959C866713C33669cA118E774A30A0E5",
    to: CONTRACT_ADDRESS,
    gasPrice: 10000000000n,
    gas: 420000n,
    type: SuaveTxRequestTypes.ConfidentialRequest,
    chainId: 16813125,
    data,
    nonce,
  };
  nonce++;
  const res = await wallet.sendTransaction(ccr);
  console.log(`${functionName}() exec tx hash: ${res}`);
  console.log(`https://explorer.rigil.suave.flashbots.net/tx/${res}`);
});
