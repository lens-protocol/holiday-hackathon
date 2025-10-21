pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./TechBites.sol";

contract TipManager is Ownable {
    TechBites public immutable token;
    
    event Tip(
        address indexed tipper,
        address indexed creator,
        uint256 amount,
        string postId,
        uint256 timestamp
    );
    
    constructor(address tokenAddress, address initialOwner) 
        Ownable(initialOwner) 
    {
        token = TechBites(tokenAddress);
    }
    
    function tip(
        address creator,
        uint256 amount,
        string calldata postId
    ) external {
        require(creator != address(0), "Invalid creator address");
        require(amount > 0, "Amount must be greater than 0");
        
        require(
            token.transferFrom(msg.sender, creator, amount),
            "Transfer failed"
        );
        
        emit Tip(
            msg.sender,
            creator,
            amount,
            postId,
            block.timestamp
        );
    }
}