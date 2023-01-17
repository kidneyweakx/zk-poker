import { config as dotEnvConfig } from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-circom";
import * as dotenv from 'dotenv'
dotenv.config()

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY
const MUMBAI_PRIVATE_KEY = process.env.MUMBAI_PRIVATE_KEY
const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.6.11"
      },
      {
        version: "0.8.17"
      }],
  },
  networks: {
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [`${MUMBAI_PRIVATE_KEY}`],
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  circom: {
    // (optional) Base path for input files, defaults to `./circuits/`
    inputBasePath: "./circuits",
    ptau: "https://hermezptau.blob.core.windows.net/ptau/powersOfTau28_hez_final_18.ptau",
    circuits: [
      { name: "key_aggregate" },
      { name: "encrypt_hash" },
      { name: "decrypt" }
    ],
  },
};

export default config;
