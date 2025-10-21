// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./TechBites.sol";

contract TokenManager is ReentrancyGuard, Ownable {
    IERC20 public rewardToken;
    uint256 public rewardAmount; 

    mapping(address => bool) public hasReceived;
    mapping(address => bool) public authorizedCallers;
    
    event RewardClaimed(address indexed user, uint256 amount);
    event RewardAmountUpdated(uint256 newAmount);
    
    constructor(address _tokenAddress, uint256 _rewardAmount) Ownable(msg.sender) {
        rewardToken = IERC20(_tokenAddress);
        rewardAmount =  _rewardAmount;
    }
    
    modifier onlyAuthorized() {
        require(authorizedCallers[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }
    
    function setAuthorizedCaller(address caller, bool status) external onlyOwner {
        authorizedCallers[caller] = status;
    }
    
    function setRewardAmount(uint256 _newAmount) external onlyOwner {
        rewardAmount = _newAmount;
        emit RewardAmountUpdated(_newAmount);
    }
    
    function distributeReward(address user) external nonReentrant onlyAuthorized {
        require(!hasReceived[user], "Reward already claimed");
        require(rewardToken.balanceOf(address(this)) >= rewardAmount, "Insufficient rewards balance");
        
        hasReceived[user] = true;
        bool success = rewardToken.transfer(user, rewardAmount);
        require(success, "Transfer failed");
        
        emit RewardClaimed(user, rewardAmount);
    }
    
    function withdrawTokens(uint256 amount) external onlyOwner {
        require(rewardToken.transfer(owner(), amount), "Withdrawal failed");
    }
}