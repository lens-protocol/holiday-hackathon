// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ScoreManager is Ownable {
    struct CreatorStats {
        uint256 postsCount;
        uint256 tipsReceived;
        uint256 totalAmountTipped;
        uint256 likesReceived;
    }

    mapping(address => CreatorStats) private creatorStats;
    mapping(string => bool) private registeredPosts;

    event PostRegistered(address indexed creator, uint256 timestamp);
    event TipRegistered(address indexed creator, uint256 amount, string postId);
    event LikeRegistered(address indexed creator, string postId);

    constructor(address initialOwner) 
        Ownable(initialOwner) 
    {}

    function registerWrittenPost(address creatorAddress) external {
        require(creatorAddress != address(0), "Invalid creator address");
        
        creatorStats[creatorAddress].postsCount += 1;
        
        emit PostRegistered(creatorAddress, block.timestamp);
    }

    function registerTip(
        address creator,
        uint256 amount,
        string calldata postId
    ) external {
        require(creator != address(0), "Invalid creator address");
        require(amount > 0, "Amount must be greater than 0");
        
        creatorStats[creator].tipsReceived += 1;
        creatorStats[creator].totalAmountTipped += amount;
        
        emit TipRegistered(creator, amount, postId);
    }

    function registerLike(
        address creator,
        string calldata postId
    ) external {
        require(creator != address(0), "Invalid creator address");
        
        creatorStats[creator].likesReceived += 1;
        
        emit LikeRegistered(creator, postId);
    }


    function getScore(address creator) external view returns (uint256) {
        CreatorStats memory stats = creatorStats[creator];
        
        // Calculate scores with proper Wei conversion
        uint256 postsScore = stats.postsCount;
        uint256 tipsScore = stats.tipsReceived * 10;
        
        // Handle Wei to ETH conversion for amount
        uint256 ethValue = stats.totalAmountTipped / 1e18;
        uint256 amountScore = ethValue / 10;
        
        uint256 likesScore = stats.likesReceived * 5;
        
        // Sum all components after conversion
        return (
            postsScore +
            tipsScore +
            amountScore +
            likesScore
        );
    }

    function getCreatorStats(address creator) external view returns (
        uint256 posts,
        uint256 tips,
        uint256 amountTipped,
        uint256 likes
    ) {
        CreatorStats memory stats = creatorStats[creator];
        return (
            stats.postsCount,
            stats.tipsReceived,
            stats.totalAmountTipped,
            stats.likesReceived
        );
    }
}