import { ethers, network } from "hardhat";
import { config as dotEnvConfig } from "dotenv";
import fs from "fs";

async function main() {
  console.log(network.name);
  // mirror root .env into generated frontend .env
  const { parsed: rootEnv} = dotEnvConfig();
  let envContents = "";
  for (const key in rootEnv) {
    envContents = `${envContents}${key}=${rootEnv[key]}\n`;
  }

  // deploy the encrypt verifier
  const EncryptVerifier = await ethers.getContractFactory("contracts/EncryptVerifier.sol:Verifier");
  const encryptVerifier = await EncryptVerifier.deploy();
  await encryptVerifier.deployed();
  console.log(
    `EncryptHashVerifier.sol deployed to ${encryptVerifier.address}. Time: ${Date.now()}`
  );
  envContents = `${envContents}ENCRYPT_VERIFIER_ADDRESS=${encryptVerifier.address}\n`;

  // deploy the decrypt verifier
  const DecryptVerifier = await ethers.getContractFactory("contracts/DecryptVerifier.sol:Verifier");
  const decryptVerifier = await DecryptVerifier.deploy();
  await decryptVerifier.deployed();
  console.log(
    `DecryptVerifier.sol deployed to ${decryptVerifier.address}. Time: ${Date.now()}`
  );
  envContents = `${envContents}DECRYPT_VERIFIER_ADDRESS=${decryptVerifier.address}\n`;

  // deploy the key aggregate verifier
  const KeyAggregateVerifier = await ethers.getContractFactory("contracts/KeyAggregateVerifier.sol:Verifier");
  const keyAggregateVerifier = await KeyAggregateVerifier.deploy();
  await keyAggregateVerifier.deployed();
  console.log(
    `KeyAggregateVerifier.sol deployed to ${keyAggregateVerifier.address}. Time: ${Date.now()}`
  );
  envContents = `${envContents}KEY_AGGREGATE_VERIFIER_ADDRESS=${keyAggregateVerifier.address}\n`;

  // deploy the main contract
  const MentalPoker = await ethers.getContractFactory("MentalPoker");
  const mentalPoker = await MentalPoker.deploy(
    keyAggregateVerifier.address,
    encryptVerifier.address,
    decryptVerifier.address,
  );
  await mentalPoker.deployed();
  console.log(
    `MentalPoker.sol deployed to ${mentalPoker.address}. Time: ${Date.now()}`
  );
  envContents = `${envContents}MENTAL_POKER_ADDRESS=${mentalPoker.address}\n`;
  console.log(`run npx hardhat verify --network ${network.name} ${mentalPoker.address} ${keyAggregateVerifier.address} ${encryptVerifier.address} ${decryptVerifier.address}`)
  fs.writeFileSync('.env', envContents);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
