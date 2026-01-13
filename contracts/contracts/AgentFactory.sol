// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./AgentWallet.sol";

contract AgentFactory is ERC721, Ownable {
    IERC20 public weth;
    address public gameMaster;
    uint256 private _tokenIdCounter;
    mapping(uint256 => address) public agentWallets;
    mapping(address => uint256[]) private _ownerAgents;

    event AgentCreated(
        uint256 indexed agentId,
        address indexed owner,
        address agentWallet,
        string name,
        string bio,
        string character
    );
    event DepositedWETH(uint256 indexed agentId, uint256 amount);
    event WithdrewWETH(uint256 indexed agentId, uint256 amount, address to);
    event TransferBetweenAgents(
        uint256 indexed fromAgentId,
        uint256 indexed toAgentId,
        uint256 amount
    );
    event WithdrawalsStatusChanged(uint256 indexed agentId, bool allowed);
    event BioUpdated(uint256 indexed agentId, string newBio);

    modifier onlyAgentOwner(uint256 agentId) {
        require(ownerOf(agentId) == msg.sender, "Not agent owner");
        _;
    }

    modifier onlyGameMaster() {
        require(msg.sender == gameMaster, "Not game master");
        _;
    }

    constructor(
        address wethAddress,
        address _gameMaster
    ) ERC721("AI Agent", "AIA") Ownable(msg.sender) {
        weth = IERC20(wethAddress);
        gameMaster = _gameMaster;
    }

    function setGameMaster(address _gameMaster) external onlyOwner {
        gameMaster = _gameMaster;
    }

    function createAgent(
        string memory name,
        string memory bio,
        string memory character
    ) external payable returns (uint256, address) {
        _tokenIdCounter++;
        uint256 newAgentId = _tokenIdCounter;
        _safeMint(msg.sender, newAgentId);

        AgentWallet wallet = new AgentWallet(
            address(weth),
            address(this),
            newAgentId,
            name,
            bio,
            character
        );
        agentWallets[newAgentId] = address(wallet);
        _ownerAgents[msg.sender].push(newAgentId);

        emit AgentCreated(
            newAgentId,
            msg.sender,
            address(wallet),
            name,
            bio,
            character
        );
        return (newAgentId, address(wallet));
    }

    function updateBio(
        uint256 agentId,
        string memory newBio
    ) external onlyAgentOwner(agentId) {
        AgentWallet wallet = AgentWallet(agentWallets[agentId]);
        wallet.setBio(newBio);
        emit BioUpdated(agentId, newBio);
    }

    function depositWETHForAgent(
        uint256 agentId,
        uint256 amount
    ) external onlyAgentOwner(agentId) {
        require(
            weth.transferFrom(msg.sender, address(this), amount),
            "WETH transfer failed"
        );
        AgentWallet wallet = AgentWallet(agentWallets[agentId]);
        wallet.depositWETH(amount);
        emit DepositedWETH(agentId, amount);
    }

    function withdrawWETHFromAgent(
        uint256 agentId,
        uint256 amount
    ) external onlyAgentOwner(agentId) {
        AgentWallet wallet = AgentWallet(agentWallets[agentId]);
        wallet.withdrawWETH(msg.sender, amount);
        emit WithdrewWETH(agentId, amount, msg.sender);
    }

    function setWithdrawalsAllowed(
        uint256 agentId,
        bool allowed
    ) external onlyGameMaster {
        AgentWallet wallet = AgentWallet(agentWallets[agentId]);
        wallet.setWithdrawalsAllowed(allowed);
        emit WithdrawalsStatusChanged(agentId, allowed);
    }

    function transferWETHBetweenAgents(
        uint256 fromAgentId,
        uint256 toAgentId,
        uint256 amount
    ) external onlyGameMaster {
        AgentWallet fromWallet = AgentWallet(agentWallets[fromAgentId]);
        AgentWallet toWallet = AgentWallet(agentWallets[toAgentId]);
        fromWallet.transferToAgent(address(toWallet), amount);
        emit TransferBetweenAgents(fromAgentId, toAgentId, amount);
    }

    function getAgentWETHBalance(
        uint256 agentId
    ) external view returns (uint256) {
        AgentWallet wallet = AgentWallet(agentWallets[agentId]);
        return wallet.wethBalance();
    }

    function canWithdraw(uint256 agentId) external view returns (bool) {
        AgentWallet wallet = AgentWallet(agentWallets[agentId]);
        return wallet.withdrawalsAllowed();
    }

    function getAgentsByOwner(
        address owner
    ) external view returns (uint256[] memory) {
        return _ownerAgents[owner];
    }
}
