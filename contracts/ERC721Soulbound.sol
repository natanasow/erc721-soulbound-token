// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./IERC721Soulbound.sol";

abstract contract ERC721Soulbound is ERC721URIStorage, IERC721Soulbound {
    uint256 newTokenId = 0;
    address payable owner;

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        owner = payable(msg.sender);
    }

    function mintSoulboundToken(address recipient, string memory tokenURI) external returns (uint256) {
        require(msg.sender == owner, "Only contract owner can mint.");
        require(balanceOf(recipient) == 0, "The recipient already has minted soulbound token.");

        newTokenId++;
        _mint(recipient, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        return newTokenId;
    }

    function burnSoulboundToken(uint256 tokenId) external {
        require(msg.sender == _ownerOf(tokenId) || msg.sender == owner, "Only the token or contract owner can burn the token.");

        _burn(tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint256, uint256) pure override internal {
        require(from == address(0) || to == address(0), "The soulbound tokens cannot be transferred.");
    }

    // Override unsupported methods
    function approve(address, uint256) public pure override (ERC721, IERC721) {
        revert("Unsupported method for soulbound tokens.");
    }

    function setApprovalForAll(address, bool) public pure override (ERC721, IERC721) {
        revert("Unsupported method for soulbound tokens.");
    }

    function getApproved(uint256) public pure override (ERC721, IERC721) returns (address) {
        revert("Unsupported method for soulbound tokens.");
    }

    function isApprovedForAll(address, address) public pure override (ERC721, IERC721) returns (bool) {
        revert("Unsupported method for soulbound tokens.");
    }

    function supportsInterface(bytes4) public pure override (IERC165, ERC721) returns (bool) {
        revert("Unsupported method for soulbound tokens.");
    }

    function transferFrom(address, address, uint256) public pure override (ERC721, IERC721) {
        revert("Unsupported method for soulbound tokens.");
    }

    function safeTransferFrom(address, address, uint256) public pure override (ERC721, IERC721) {
        revert("Unsupported method for soulbound tokens.");
    }

    function safeTransferFrom(address, address, uint256, bytes memory) public pure override (ERC721, IERC721) {
        revert("Unsupported method for soulbound tokens.");
    }
}
