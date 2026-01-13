// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AgentWallet {
    IERC20 public weth;
    string public name;
    string public bio;
    string public character;
    address public factory;       // AgentFactory contract
    uint256 public agentId;       // The NFT agent ID associated
    uint256 public wethBalance;
    bool public withdrawalsAllowed;

    constructor(
        address _weth, 
        address _factory, 
        uint256 _agentId, 
        string memory _name,
        string memory _bio,
        string memory _character
    ) {
        weth = IERC20(_weth);
        factory = _factory;
        agentId = _agentId;
        name = _name;
        bio = _bio;
        character = _character;
    }

    modifier onlyFactory() {
        require(msg.sender == factory, "Not factory");
        _;
    }

    function setWithdrawalsAllowed(bool allowed) external onlyFactory {
        withdrawalsAllowed = allowed;
    }

    function setBio(string memory _bio) external onlyFactory {
        bio = _bio;
    }

    // Deposit WETH into this agent wallet
    function depositWETH(uint256 amount) external onlyFactory {
        wethBalance += amount;
    }

    // Withdraw WETH from this agent
    function withdrawWETH(address to, uint256 amount) external onlyFactory {
        require(withdrawalsAllowed, "Withdrawals not allowed");
        require(wethBalance >= amount, "Insufficient balance");
        wethBalance -= amount;
        require(weth.transfer(to, amount), "WETH transfer failed");
    }

    function transferToAgent(address otherAgent, uint256 amount) external onlyFactory {
        require(wethBalance >= amount, "Insufficient balance");
        wethBalance -= amount;
        AgentWallet(otherAgent).receiveFromAgent(amount);
    }

    function receiveFromAgent(uint256 amount) external {
        require(msg.sender != address(0), "Invalid sender");
        require(msg.sender != address(this), "Self call");
        wethBalance += amount;
    }
}
