import { encodeFunctionData } from "@flashbots/suave-viem";
import {
  SuaveTxRequestTypes,
  TransactionRequestSuave,
} from "@flashbots/suave-viem/chains/utils";
import Suave from "../suave.ts";

// Change this to the address of the deployed contract
const CONTRACT_ADDRESS = "0xd594760b2a36467ec7f0267382564772d7b0b73c";

const isTestnet = process.env.SUAVE_ENV === "rigil" || false;
const suave = new Suave(isTestnet);

const kettleAddress = suave.getKettleAddress();
const wallet = suave.getWallet();
const { abi } = suave.getContractArtifacts(
  "is-confidential.sol/IsConfidential.json"
);
const data = encodeFunctionData({
  abi,
  functionName: "example",
  args: [],
});

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
