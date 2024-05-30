import { Abi, http } from "@flashbots/suave-viem";
import {
  getSuaveProvider,
  getSuaveWallet,
} from "@flashbots/suave-viem/chains/utils";
import { readFileSync } from "fs";
import path from "path";

class Suave {
  public isTestnet: boolean;
  public privateKey: string;
  public rpcUrl: string;

  constructor(isTestnet: boolean, privateKey?: string, rpcUrl?: string) {
    this.isTestnet = isTestnet;
    this.privateKey =
      privateKey ??
      "0x91ab9a7e53c220e6210460b65a7a3bb2ca181412a8a7b43ff336b3df1737ce12"; // founded account on devnet
    this.rpcUrl =
      rpcUrl ??
      (isTestnet
        ? "https://rpc.rigil.suave.flashbots.net"
        : "http://localhost:8545");
  }

  getProvider() {
    return getSuaveProvider(http(this.rpcUrl));
  }

  getWallet() {
    return getSuaveWallet({
      transport: http(this.rpcUrl),
      privateKey: this.privateKey as `0x${string}`,
    });
  }

  getContractArtifacts(filename: string): {
    abi: Abi;
    bytecode: string;
  } {
    const filepath = `../../out/${filename}`;
    const json = JSON.parse(
      readFileSync(path.resolve(__dirname, filepath)).toString()
    );
    const abi = json.abi as Abi;
    const bytecode = json.bytecode.object;
    return { abi, bytecode };
  }

  // TODO: This is a temporary solution. We should get the kettle address by eth_kettleAddress
  getKettleAddress() {
    const kettleAddress = this.isTestnet
      ? "0x03493869959C866713C33669cA118E774A30A0E5"
      : "0xB5fEAfbDD752ad52Afb7e1bD2E40432A485bBB7F";
    return kettleAddress;
  }
}

export default Suave;
