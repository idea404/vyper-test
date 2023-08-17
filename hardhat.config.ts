import "@nomiclabs/hardhat-vyper";
import { HardhatUserConfig } from "hardhat/config";

import "@matterlabs/hardhat-zksync-vyper";
import "@matterlabs/hardhat-zksync-deploy";

import "@matterlabs/hardhat-zksync-vyper-verify";

const INFURA_API_KEY = process.env.INFURA_API_KEY;

const config: HardhatUserConfig = {
  zkvyper: {
    version: "latest",
    settings: {},
  },
  defaultNetwork: "zkSyncTestnet",
  networks: {
    hardhat: {
      zksync: false,
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA_API_KEY}` // The Ethereum Web3 RPC URL (optional).
    },
    zkSyncTestnet: {
      url: "https://testnet.era.zksync.dev",
      ethNetwork: "goerli",
      zksync: true,
      // Verification endpoint for Goerli
      verifyURL: "https://zksync2-testnet-explorer.zksync.dev/contract_verification",
    },
  },
  // Currently, only Vyper 0.3.3 or 0.3.9 are supported.
  vyper: {
    version: "0.3.3",
  },
  solidity: {
    version: "0.8.17",
  },
};

export default config;
