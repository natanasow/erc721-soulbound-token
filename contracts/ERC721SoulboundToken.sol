// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./ERC721Soulbound.sol";

contract ERC721SoulboundToken is ERC721Soulbound {
    constructor(string memory _name, string memory _symbol) ERC721Soulbound(_name, _symbol) {}
}
