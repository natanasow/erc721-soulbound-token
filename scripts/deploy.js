const hre = require("hardhat");

async function main() {
  const ERC721SoulboundTokenFactory = await hre.ethers.getContractFactory('ERC721SoulboundToken');
  const contract = await ERC721SoulboundTokenFactory.deploy(process.env.TOKEN_NAME, process.env.TOKEN_SYMBOL);

  console.log(`deployed contract's address: ${contract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
