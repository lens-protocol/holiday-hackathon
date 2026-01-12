// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleNFT is ERC721, Ownable {
    uint256 public currentTokenId;

    mapping(uint256 => string) private _tokenURIs;

    constructor() ERC721("SimpleNFT", "SNFT") {}


    function mintNFT(address to, string memory tokenURI) public onlyOwner {
        uint256 tokenId = ++currentTokenId;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }

  
    function _setTokenURI(uint256 tokenId, string memory tokenURI) internal {
        _tokenURIs[tokenId] = tokenURI;
    }

  
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }
}
