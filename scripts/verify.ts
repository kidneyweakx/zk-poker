import { network } from "hardhat";
import { config as dotEnvConfig } from "dotenv";

async function main() {
  console.log(network.name);
  // verify the etherscan
  await run("verify:verify", {
    address: process.env.MENTAL_POKER_ADDRESS,
    constructorArguments: [
      process.env.KEY_AGGREGATE_VERIFIER_ADDRESS,
      process.env.ENCRYPT_VERIFIER_ADDRESS,
      process.env.DECRYPT_VERIFIER_ADDRESS,
    ],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
