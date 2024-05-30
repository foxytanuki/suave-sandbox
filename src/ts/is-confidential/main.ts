import { encodeFunctionData, HttpTransport, Abi } from "@flashbots/suave-viem";
import {
  SuaveTxRequestTypes,
  SuaveWallet,
  SuaveProvider,
  TransactionRequestSuave,
} from "@flashbots/suave-viem/chains/utils";
import Suave from "../suave.ts";

async function deploy(
  abi: Abi,
  bytecode: `0x${string}`,
  wallet: SuaveWallet<HttpTransport>,
  provider: SuaveProvider<HttpTransport>
): Promise<`0x${string}`> {
  const hash = await wallet.deployContract({
    abi,
    bytecode,
    args: [],
  });
  const deployedReceipt = await provider.getTransactionReceipt({
    hash: hash,
  });
  const { contractAddress } = deployedReceipt;
  if (!contractAddress) {
    throw new Error("Deploy failed");
  }
  return contractAddress;
}

async function execute(
  abi: Abi,
  kettleAddress: `0x${string}`,
  contractAddress: `0x${string}`,
  wallet: SuaveWallet<HttpTransport>
) {
  const data = encodeFunctionData({
    abi,
    functionName: "example",
    args: [],
  });

  const ccr: TransactionRequestSuave = {
    confidentialInputs: "0x000",
    kettleAddress,
    to: contractAddress,
    gasPrice: 10000000000n,
    gas: 420000n,
    type: SuaveTxRequestTypes.ConfidentialRequest,
    chainId: 16813125,
    data,
  };

  const hash = await wallet.sendTransaction(ccr);
  return hash;
}

async function main() {
  const isTestnet = process.env.SUAVE_ENV === "rigil" || false;
  const suave = new Suave(isTestnet);
  const kettleAddress = suave.getKettleAddress();
  const wallet = suave.getWallet();
  const provider = suave.getProvider();
  const { abi, bytecode } = suave.getContractArtifacts(
    "is-confidential.sol/IsConfidential.json"
  );
  const contractAddress = await deploy(abi, bytecode, wallet, provider);
  console.log(`Deployed to ${contractAddress}`);

  const hash = await execute(abi, kettleAddress, contractAddress, wallet);
  console.log(`example() exec tx hash: ${hash}`);
  if (isTestnet) {
    console.log(`https://explorer.rigil.suave.flashbots.net/tx/${hash}`);
  }
}

main()
  .then(() => {
    console.log("Done");
  })
  .catch((e: any) => {
    console.error(e);
  });
