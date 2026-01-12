// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ImageNFT is ERC721, Ownable {

    mapping(uint256 => string) private _tokenImageURLs;

    mapping(uint256 => bool) private _mintedTokens;

    uint256 private _nextTokenId;

    constructor() ERC721("ImageNFT", "IMG") {
        _nextTokenId = 1; 
    }

    function mintNFT(string memory imageUrl) public {
        uint256 tokenId = _nextTokenId; 
        _nextTokenId++; 


        require(!_mintedTokens[tokenId], "Token ID already minted");

     
        _mintedTokens[tokenId] = true;

    
        _safeMint(msg.sender, tokenId);

      
        _tokenImageURLs[tokenId] = imageUrl;
    }

 
    function tokenImageURL(uint256 tokenId) public view returns (string memory) {
     
        require(_mintedTokens[tokenId], "Token ID does not exist");
        return _tokenImageURLs[tokenId];
    }

    function getCurrentTokenId() public view returns (uint256) {
        return _nextTokenId;
    }
}
