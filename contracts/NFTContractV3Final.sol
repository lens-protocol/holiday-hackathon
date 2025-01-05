// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NFTContract
 * @dev Minimal example for an NFT on zkSync (or any EVM-compatible chain) with best practices.
 */
contract NFTContract is ERC721, Ownable {
    uint256 private _currentTokenId;
    uint256 private constant MAX_MINTS = 100;
    uint256 private _mintCount;

    struct NFTMetadata {
        string name;
        string uri;
        string description;
    }

    // Mappings
    mapping(uint256 => NFTMetadata) private _tokenDetails;
    mapping(uint256 => uint256) private _mintNumbers;

    // Events
    event NFTMinted(address indexed recipient, uint256 tokenId);
    event NFTsMinted(address indexed recipient, uint256[] tokenIds, uint256[] mintNumbers);

    /**
     * @dev Constructor sets up collection details and mints initial quantity to 'initialOwner'.
     *      Uses the standard Ownable constructor, then transfers ownership if needed.
     */
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 quantity,
        string memory uri,
        string memory description,
        address initialOwner
    ) ERC721(name_, symbol_) Ownable(initialOwner)  {
        _transferOwnership(initialOwner);

        uint256[] memory newItemIds = new uint256[](quantity);
        uint256[] memory mintNumbers = new uint256[](quantity);

        for (uint256 i = 0; i < quantity; i++) {
            _currentTokenId++;
            uint256 newItemId = _currentTokenId;
            newItemIds[i] = newItemId;
            mintNumbers[i] = _mintCount;

            string memory newName = string(
                abi.encodePacked(name_, " #", _toString(_mintCount))
            );

            _mint(initialOwner, newItemId);
            _tokenDetails[newItemId] = NFTMetadata(newName, uri, description);
            _mintNumbers[newItemId] = _mintCount;

            _mintCount++;
        }

        emit NFTsMinted(initialOwner, newItemIds, mintNumbers);
    }

    /**
     * @dev Checks if a token ID exists by returning whether it has been minted.
     */
    function exists(uint256 tokenId) public view returns (bool) {
        return exists(tokenId);
    }

    /**
     * @dev Returns the metadata URI for a given token ID.
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return _tokenDetails[tokenId].uri;
    }

    /**
     * @dev Returns the custom name for this NFT token ID.
     */
    function tokenName(uint256 tokenId) public view returns (string memory) {
        require(exists(tokenId), "ERC721Metadata: Name query for nonexistent token");
        return _tokenDetails[tokenId].name;
    }

    /**
     * @dev Returns the custom description for this NFT token ID.
     */
    function tokenDescription(uint256 tokenId) public view returns (string memory) {
        require(exists(tokenId), "ERC721Metadata: Description query for nonexistent token");
        return _tokenDetails[tokenId].description;
    }

    /**
     * @dev Returns the mint number (sequence) for a given token ID.
     */
    function getMintNumber(uint256 tokenId) public view returns (uint256) {
        require(exists(tokenId), "ERC721Metadata: Mint number query for nonexistent token");
        return _mintNumbers[tokenId];
    }

    /**
     * @dev Returns the current total mint count minus 1
     *      (reflecting the last minted token's sequence if needed).
     */
    function getCurrentMintCount() public view returns (uint256) {
        // Adjust logic as desired. This returns the last mint index used.
        return _mintCount > 0 ? _mintCount - 1 : 0;
    }

    /**
     * @dev Mints multiple NFTs to a recipient, accepting metadata.
     */
    function mintNFTs(
        address recipient,
        uint256 quantity,
        string memory uri,
        string memory name_,
        string memory description
    ) public onlyOwner returns (uint256[] memory) {
        require(quantity > 0, "Quantity must be greater than 0");
        require(_mintCount + quantity <= MAX_MINTS, "Would exceed maximum supply");

        uint256[] memory newItemIds = new uint256[](quantity);
        uint256[] memory mintNumbers = new uint256[](quantity);

        for (uint256 i = 0; i < quantity; i++) {
            _currentTokenId++;
            uint256 newItemId = _currentTokenId;
            newItemIds[i] = newItemId;
            mintNumbers[i] = _mintCount;

            string memory newName = string(
                abi.encodePacked(name_, " #", _toString(_mintCount))
            );

            _mint(recipient, newItemId);
            _tokenDetails[newItemId] = NFTMetadata(newName, uri, description);
            _mintNumbers[newItemId] = _mintCount;

            _mintCount++;
        }

        emit NFTsMinted(recipient, newItemIds, mintNumbers);
        return newItemIds;
    }

    /**
     * @dev Mints a single NFT.
     */
    function mintNFT(
        address recipient,
        string memory uri,
        string memory name_,
        string memory description
    ) public onlyOwner returns (uint256) {
        uint256[] memory ids = mintNFTs(recipient, 1, uri, name_, description);
        return ids[0];
    }

    /**
     * @dev Internal helper to convert a uint256 to string.
     */
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits--;
            buffer[digits] = bytes1(uint8(48 + (value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}