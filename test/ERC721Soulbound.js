const {expect} = require("chai");

const hre = require('hardhat');

describe("ERC721SoulboundToken tests", function () {

  const contractName = process.env.TOKEN_NAME;
  const contractSymbol = process.env.TOKEN_SYMBOL;
  const tokenURI = 'tokenuri'

  let contractOwner;
  let student;
  let signerWithoutToken;
  let contract;
  let soulboundTokenId;

  before(async () => {
    const signers = await hre.ethers.getSigners();
    contractOwner = signers[0];
    student = signers[1];
    signerWithoutToken = signers[2];

    const ERC721SoulboundTokenFactory = await hre.ethers.getContractFactory('ERC721SoulboundToken');
    contract = await ERC721SoulboundTokenFactory.deploy(contractName, contractSymbol);
    console.log(`\n  address: ${contract.address}\n`);
  });

  it("Should not be able to send ether to the contract", async function () {
    await expect(contractOwner.sendTransaction({
      to: contract.address,
      value: ethers.utils.parseUnits('1', 'ether')
    })).to.be.reverted;
  });

  it("Should be able to execute IERC721 name()", async function () {
    expect(await contract.name()).to.equal(contractName);
  });

  it("Should be able to execute IERC721 symbol()", async function () {
    expect(await contract.symbol()).to.equal(contractSymbol);
  });

  it("Should be able to execute IERC721 balanceOf()", async function () {
    expect(await contract.balanceOf(student.address)).to.equal(0);
  });

  it("Should be able to execute IERC721 ownerOf()", async function () {
    const mintTx = await contract.mintSoulboundToken(student.address, tokenURI);
    const {tokenId} = (await mintTx.wait()).events.filter(e => e.event === 'Transfer')[0].args;

    expect(await contract.ownerOf(tokenId)).to.equal(student.address);

    await contract.burnSoulboundToken(tokenId);
  });

  it("Should be able to execute IERC721 tokenURI()", async function () {
    const mintTx = await contract.mintSoulboundToken(student.address, tokenURI);
    const {tokenId} = (await mintTx.wait()).events.filter(e => e.event === 'Transfer')[0].args;

    expect(await contract.tokenURI(tokenId)).to.equal(tokenURI);

    await contract.burnSoulboundToken(tokenId);
  });

  it("Should be able to deploy the contract", async function () {
    const ERC721SoulboundTokenFactory = await hre.ethers.getContractFactory('ERC721SoulboundToken');
    const deployedContract = await ERC721SoulboundTokenFactory.deploy(contractName, contractSymbol);

    expect(deployedContract).to.exist;
    expect(deployedContract.address).to.not.be.null;
  });

  it("Should be able to mint a soulbound token to a student", async function () {
    const mintTx = await contract.mintSoulboundToken(student.address, tokenURI);
    const {tokenId} = (await mintTx.wait()).events.filter(e => e.event === 'Transfer')[0].args;

    expect(tokenId).to.exist;
    expect(tokenId).to.be.greaterThan(0);

    soulboundTokenId = tokenId;
  });

  it("Should not be able to mint a second soulbound token to a student", async function () {
    await expect(contract.mintSoulboundToken(student.address, tokenURI)).to.be.revertedWith("The recipient already has minted soulbound token.");
  });

  it("Should be able to get owner of the minted soulbound token", async function () {
    const owner = await contract.ownerOf(soulboundTokenId);
    expect(owner).to.equal(student.address);
  });

  it("Should not be able to burn token with account different than owner", async function () {
    const signerWithoutTokenContract = contract.connect(signerWithoutToken);

    await expect(signerWithoutTokenContract.burnSoulboundToken(soulboundTokenId)).to.be.revertedWith("Only the token or contract owner can burn the token.");
  });

  it("Should be able to burn a token with contract account", async function () {
    const mintTx = await contract.mintSoulboundToken(signerWithoutToken.address, tokenURI);
    const {tokenId} = (await mintTx.wait()).events.filter(e => e.event === 'Transfer')[0].args;

    await contract.burnSoulboundToken(tokenId);

    await expect(contract.ownerOf(tokenId)).to.be.revertedWith("ERC721: invalid token ID");
  });

  it("Should be able to burn a token with owner account", async function () {
    const mintTx = await contract.mintSoulboundToken(signerWithoutToken.address, tokenURI);
    const {tokenId} = (await mintTx.wait()).events.filter(e => e.event === 'Transfer')[0].args;

    const signerWithoutTokenContract = contract.connect(signerWithoutToken);
    await signerWithoutTokenContract.burnSoulboundToken(tokenId);

    await expect(contract.ownerOf(tokenId)).to.be.revertedWith("ERC721: invalid token ID");
  });

  it("Should not be able to transfer the token", async function () {
    const mintTx = await contract.mintSoulboundToken(signerWithoutToken.address, tokenURI);
    const {tokenId} = (await mintTx.wait()).events.filter(e => e.event === 'Transfer')[0].args;

    const signerWithoutTokenContract = contract.connect(student);
    await expect(signerWithoutTokenContract.transferFrom(signerWithoutToken.address, student.address, tokenId)).to.be.revertedWith("Unsupported method for soulbound tokens.");
  });

  it("Should not be able to call unsupported methods", async function () {
    const msg = 'Unsupported method for soulbound tokens.';

    await expect(contract.approve(signerWithoutToken.address, soulboundTokenId)).to.be.revertedWith(msg);
    await expect(contract.setApprovalForAll(contractOwner.address, signerWithoutToken.address)).to.be.revertedWith(msg);
    await expect(contract.getApproved(soulboundTokenId)).to.be.revertedWith(msg);
    await expect(contract.isApprovedForAll(contractOwner.address, signerWithoutToken.address)).to.be.revertedWith(msg);
    await expect(contract.supportsInterface('0x00000000')).to.be.revertedWith(msg);
    await expect(contract.transferFrom(signerWithoutToken.address, student.address, soulboundTokenId)).to.be.revertedWith(msg);
  });
});
