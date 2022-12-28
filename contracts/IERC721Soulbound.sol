// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IERC721Soulbound is IERC721 {
    function mintSoulboundToken(address receipt, string memory tokenURI) external returns (uint256 newTokenId);

    function burnSoulboundToken(uint256 tokenId) external;
}