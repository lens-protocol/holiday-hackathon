// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TechBites is ERC20, Ownable {
    uint256 public constant MAXIMUM_SUPPLY = 10_000_000 * 10**18; // 10M tokens
    
    mapping(address => uint256) private _lastTransfer;
    mapping(address => bool) private _authorizedContracts;

    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);

    constructor(address initialOwner) 
        ERC20("Tech Bites", "TBIT") 
        Ownable(initialOwner) 
    {
        uint256 totalSupply = 10_100_000 * 10**decimals(); // 100k tokens initial supply
        _mint(msg.sender, totalSupply);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= MAXIMUM_SUPPLY, "Exceeds maximum supply");
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    function burn(uint256 amount) public onlyOwner {
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }

    function burnFrom(address account, uint256 amount) public onlyOwner {
        _burn(account, amount);
        emit TokensBurned(account, amount);
    }

}