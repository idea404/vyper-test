import { Wallet, utils } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

// load env file
import dotenv from "dotenv";
dotenv.config();

// load wallet private key from env file
const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";
const CONTRACT_FILE_NAME_NO_EXT = "factory";
const CONTRACT_FULLY_QUALIFIED_NAME = `contracts/${CONTRACT_FILE_NAME_NO_EXT}.vy:${CONTRACT_FILE_NAME_NO_EXT}`;

// Contract params
// none for this contract
const EXCHANGE_CODE_HASH = "0xb678137ffff8c2c5619a5c3401cbbb86b7bad1ddc63ae87b151f85b24697ea85";
const CONTRACT_PARAMS: any = [EXCHANGE_CODE_HASH];

if (!PRIVATE_KEY)
  throw "⛔️ Private key not detected! Add it to the .env file!";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for the ${CONTRACT_FILE_NAME_NO_EXT} contract`);

  // Initialize the wallet.
  const wallet = new Wallet(PRIVATE_KEY);

  // Create deployer object and load the artifact of the contract you want to deploy.
  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact(CONTRACT_FILE_NAME_NO_EXT);

  // Estimate contract deployment fee
  const deploymentFee = await deployer.estimateDeployFee(artifact, CONTRACT_PARAMS);

  // ⚠️ OPTIONAL: You can skip this block if your account already has funds in L2
  // Deposit funds to L2
  // const depositHandle = await deployer.zkWallet.deposit({
  //   to: deployer.zkWallet.address,
  //   token: utils.ETH_ADDRESS,
  //   amount: deploymentFee.mul(2),
  // });
  // // Wait until the deposit is processed on zkSync
  // await depositHandle.wait();

  // Deploy this contract. The returned object will be of a `Contract` type, similarly to ones in `ethers`.
  // `greeting` is an argument for contract constructor.
  const parsedFee = ethers.utils.formatEther(deploymentFee.toString());
  console.log(`The deployment is estimated to cost ${parsedFee} ETH`);

  const contract = await deployer.deploy(artifact, CONTRACT_PARAMS);

  //obtain the Constructor Arguments
  console.log("Constructor args:" + contract.interface.encodeDeploy(CONTRACT_PARAMS));

  // Show the contract info.
  const contractAddress = contract.address;
  console.log(`${artifact.contractName} was deployed to ${contractAddress}`);

  // NEW VERIFY BLOCK
  const contractFullyQualifedName = CONTRACT_FULLY_QUALIFIED_NAME;
  const verificationId = await hre.run("verify:verify:vyper", {
    address: contractAddress,
    contract: contractFullyQualifedName,
    constructorArguments: CONTRACT_PARAMS
  });

  // VERIFICATION BLOCK
  // // verify contract for tesnet & mainnet
  // if (process.env.NODE_ENV != "test") {
  //   // Contract MUST be fully qualified name (e.g. path/sourceName:contractName)
  //   const contractFullyQualifedName = "contracts/Greeter.sol:Greeter";

  //   // Verify contract programmatically
  //   const verificationId = await hre.run("verify:verify", {
  //     address: contractAddress,
  //     contract: contractFullyQualifedName,
  //     constructorArguments: [],
  //     bytecode: artifact.bytecode,
  //   });
  // } else {
  //   console.log(`Contract not verified, deployed locally.`);
  // }
}
