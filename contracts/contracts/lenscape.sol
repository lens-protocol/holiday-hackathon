// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract lenscape {

    address public owner;

    enum Role { Brand, Influencer }

        modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    struct Identity {
        address owner;
        string name;
        Role role;
        bool created;
    }

    struct Deal {
        uint id;
        string name;
        address brand;
        address[] influencers;
        uint[] ratingRanges; // Reward ranges based on ratings
        uint totalBudget;
        bool active;
        mapping(address => bool) accepted;
    }

    uint public dealCounter;
    mapping(uint => Deal) public deals;
    mapping(address => Identity) public identities;

    event IdentityCreated(address indexed owner, string name, Role role, string description);
    event DealCreated(uint indexed dealId, string dealName, address indexed brand, uint totalBudget, address[] influencers);
    event DealAccepted(uint indexed dealId, address indexed influencer);
    event RewardReleased(uint indexed dealId, address indexed influencer, uint rewardAmount, uint rating);
    event DealRejected(uint indexed dealId, address indexed influencer);

        constructor() {
        owner = msg.sender;
    }

    // Create an identity for either brand or influencer
    function createIdentity(string memory _name, string memory description ,Role _role) public {
        require(!identities[msg.sender].created, "Identity already exists");

        identities[msg.sender] = Identity({
            owner: msg.sender,
            name: _name,
            role: _role,
            created: true
        });

        emit IdentityCreated(msg.sender, _name, _role, description);
    }

    // Create a new deal by the brand, passing in influencers and rating ranges
    function createDeal(
        string memory _name,
        address[] memory _influencers,
        // uint[] memory _ratingRanges, // Reward tiers based on influencer ratings
        uint _totalBudget
    ) public payable {
        require(identities[msg.sender].role == Role.Brand, "Only brands can create deals");
        require(_totalBudget == msg.value, "Amount sent is not correct");

        dealCounter++;
        Deal storage newDeal = deals[dealCounter];
        newDeal.id = dealCounter;
        newDeal.name = _name;
        newDeal.brand = msg.sender;
        newDeal.totalBudget = _totalBudget;
        // newDeal.ratingRanges = _ratingRanges;
        newDeal.active = true;

        // Add influencers to the deal
        newDeal.influencers = _influencers;

        emit DealCreated(dealCounter, _name, msg.sender, _totalBudget, _influencers );
    }

    // Influencer accepts the deal using the deal ID
    function acceptDeal(uint _dealId) public {
        require(identities[msg.sender].role == Role.Influencer, "Only influencers can accept deals");

        Deal storage deal = deals[_dealId];
        require(deal.active, "Deal is not active");

        // Mark the deal as accepted for this influencer
        deal.accepted[msg.sender] = true;

        emit DealAccepted(_dealId, msg.sender);
    }



    function releaseReward(uint _dealId, uint _rating, uint _rewardAmount, address _toInfluencer) public onlyOwner {
        Deal storage deal = deals[_dealId];
        // require(deal.active, "Deal is not active");

        // Convert rewardAmount to 18 decimal format
        uint rewardAmountInWei = _rewardAmount;

        // Ensure the deal's total budget is enough
        // require(deal.totalBudget >= rewardAmountInWei, "Insufficient budget for this deal");

        // Send reward to influencer
        // payable(_toInfluencer).transfer(rewardAmountInWei);
       (bool success, ) = payable(_toInfluencer).call{value: rewardAmountInWei}("");
        require(success, "Transfer failed");      
          
        deal.totalBudget -= rewardAmountInWei;

        emit RewardReleased(_dealId, _toInfluencer, rewardAmountInWei, _rating);
    }

    function rejectDeal(uint _dealId) public {
    require(identities[msg.sender].role == Role.Influencer, "Only influencers can reject deals");

    Deal storage deal = deals[_dealId];
    require(deal.active, "Deal is not active");
    require(deal.accepted[msg.sender] == false, "Deal has already been accepted");

    // Emit an event to signify the deal was rejected
    emit DealRejected(_dealId, msg.sender);
}
}