// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./NFTContractV3Final.sol";  // Import the NFTContract

contract NFTFactory {
    struct SellOffer {
        string name;
        string description;
        string symbol;
        string uri;
        uint256 price;
        address seller;
    }

    // Keep track of created NFT contracts
    address[] public deployedNFTContracts;

    SellOffer[] public sellOffers;

    // Event for NFT contract creation
    event NFTContractCreated(address indexed nftContract, string name, string symbol);

    // Event for NFT sale creation
    event NFTSellCreated(address indexed seller, uint256 sellId, address nftContract, uint256 count, uint256 price);

// Function to create an NFT contract
    function createNFTContract(
        string memory name,
        string memory symbol,
        uint256 quantity,
        string memory uri,
        string memory description
    ) public returns (address) {
        require(quantity > 0, "Quantity must be greater than 0");
        require(quantity <= 100, "Would exceed maximum supply");

        // Deploy a new instance of NFTContract
        NFTContract newNFTContract = new NFTContract(name, symbol, quantity, uri, description, msg.sender);

        // Store the address of the newly deployed contract
        deployedNFTContracts.push(address(newNFTContract));

        // Emit an event for the new contract
        emit NFTContractCreated(address(newNFTContract), name, symbol);

        // Return the address of the newly deployed contract
        return address(newNFTContract);
    }

    // Function to create an NFT contract and put it on sale
    function sellNFT(
        string memory name,
        string memory symbol,
        string memory description,
        string memory uri,
        uint256 price
    ) public{


        // Collect token IDs
        // Store the sell offer
        SellOffer memory newOffer = SellOffer({
            name: name,
            description: description,
            symbol: symbol,
            uri: uri,
            price: price,
            seller: msg.sender
        });
        sellOffers.push(newOffer);
    }

    // Function to buy an NFT from the sell offers using nftContract address
    function buyNFT(string memory uri, string memory name, string memory description) public payable {
        uint256 sellId = findSellOfferIndex(uri, name, description);
        SellOffer storage offer = sellOffers[sellId];

        require(msg.value == offer.price, "Incorrect value sent");

        // Create the new NFT contract
        createNFTContract(offer.name, offer.symbol, 1, offer.uri, offer.description);

     // Transfer the payment to the seller using call
        (bool success, ) = payable(offer.seller).call{value: msg.value}("");
        require(success, "Transfer failed");

        // Remove the sell offer from the array
        removeSellOffer(sellId);
    }

    // Function to get all sell offers
    function getSellOffers() public view returns (SellOffer[] memory) {
        return sellOffers;
    }

    // Function to find sell offer index by NFT contract address
    function findSellOfferIndex(string memory uri, string memory name, string memory description) private view returns (uint256) {
        for (uint256 i = 0; i < sellOffers.length; i++) {
           if (keccak256(abi.encodePacked(sellOffers[i].uri)) == keccak256(abi.encodePacked(uri)) &&
                keccak256(abi.encodePacked(sellOffers[i].name)) == keccak256(abi.encodePacked(name)) &&
                keccak256(abi.encodePacked(sellOffers[i].description)) == keccak256(abi.encodePacked(description))) {
                return i;
            }
        }
        revert("Sell offer not found");
    }

        // Function to remove a sell offer from the array
    function removeSellOffer(uint256 index) private {
        require(index < sellOffers.length, "Index out of bounds");

        for (uint256 i = index; i < sellOffers.length - 1; i++) {
            sellOffers[i] = sellOffers[i + 1];
        }
        sellOffers.pop();
    }
}
