## ERC721 based implementation of Soulbound token #SBT
Soulbound Tokens (SBTs) are digital identity tokens that represent the traits, features, and achievements that make up a person or entity. SBTs are issued by "Souls", which represent blockchain accounts or wallets, and cannot be transferred. They were proposed by [Vitalik Buterin](https://podcasts.apple.com/lu/podcast/vitalik-buterin-on-building-a-base-layer-for-the/id1512654905?i=1000551086929&amp;l=fr) and could be used for scholarship diploma/certificate, medical records, work history, and any type of information that makes up a person or entity.

##### Specs of the implementation:
- Only the *Contract Owner* **can** mint an SBT to an address
- *Contract Owner* **can** burn everyone's SBT
- *Contract Owner* **can not** transfer an SBT
- *SBT Owner* **can** burn only his own SBT
- *SBT Owner* **can not** transfer an SBT

#### Exposed interfaces:
```typescript
// IERC721Soulbound
function mintSoulboundToken(address receipt, string memory tokenURI) external returns (uint256 newTokenId);
function burnSoulboundToken(uint256 tokenId) external;

// IERC721Metadata
function name() external view returns (string memory);
function symbol() external view returns (string memory);
function tokenURI(uint256 tokenId) external view returns (string memory);

// IERC721
function balanceOf(address owner) external view returns (uint256 balance);
function ownerOf(uint256 tokenId) external view returns (address owner);
```

#### Unsupported methods:
```typescript
// IERC165
function supportsInterface(bytes4 interfaceId) external view returns (bool);

// IERC721
function approve(address to, uint256 tokenId) external;
function setApprovalForAll(address operator, bool _approved) external;
function getApproved(uint256 tokenId) external view returns (address operator);
function isApprovedForAll(address owner, address operator) external view returns (bool);
function transferFrom(address from,address to,uint256 tokenId) external;
function safeTransferFrom(address from,address to,uint256 tokenId, bytes calldata data) external;
function safeTransferFrom(address from,address to,uint256 tokenId) external;
```

## Action steps

```shell
# change the token's name or symbol by editing the .env
cp .env.example .env

# local set-up
npx hardhat node # run the local node
npx hardhat test # run some tests

# or deploy the contract to the network specified in the hardhat.config.js
npx hardhat run scripts/deploy.js
```