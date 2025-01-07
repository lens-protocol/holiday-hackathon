// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BookIt is ERC721URIStorage, Ownable{
    
    mapping(address => uint256) public Stakers;
    Event[] internal allEvents;
    uint256 public tokenId;
    uint256 public eventId = 0;
    mapping(address => BoughtEvent[]) public eventsOfUser;
    mapping(uint256 => Review[]) public allReviewsofEvent;
    mapping(address => Event[]) public ticketsOfUser;
    address private burning_address = 0x000000000000000000000000000000000000dEaD; // Burning address
    mapping(address => uint256) public reputationScore;
    address[] public allUsers;
    event Stake(address from, uint256 amount);
    event Mint(address to, uint256 ticket_counts, uint256 total_price);
    event EventAdded(address from, uint256 capacity, uint256 price, string Date, string Venue, string Category);
    event Reviewed(address from, uint8 stars, string data, string timestamp);


    struct Review{
        address reviewer;
        uint8 stars;
        string comment;
        string timestamp;
    }

    struct Event{
        uint256 id;
        address owner;
        string Name;
        string Description;
        string Date;
        string Time; 
        string Venue;
        uint256 Capacity;
        uint256 Price;
        string IPFS_Logo;
        string Category;
    }

    struct BoughtEvent{
        uint256 id;
        address owner;
        string Name;    
        string Description;
        string Date;
        string Time;
        string Venue;
        uint256 TicketsBought;
        uint256 Price;
        uint256 TotalPrice;
        string IPFS_Logo;
        string Category;
    }

    constructor() ERC721("BookIT", "BKT") Ownable(msg.sender) {
    }

    modifier _checkStake(address staker) {
        require(Stakers[staker]>0, "User has not yet staked ETH.");
        _;
    }

    function checkExists(address _addr) private view returns(bool) {
        for(uint256 i=0; i<allUsers.length; i++){
            if(allUsers[i] == _addr){
                return true;
            }
        }
        return false;
    }

    receive() external payable {
        Stakers[msg.sender] = msg.value;
        reputationScore[msg.sender] += 1;
        if(!checkExists(msg.sender)){
            allUsers.push(msg.sender);
        }
        emit Stake(msg.sender, msg.value);
    }

    function buyTickets(uint256 event_id, address to, uint256 ticket_count) public payable {
        Event storage curr_event = allEvents[event_id];
        
        if(curr_event.Capacity < ticket_count) {
            revert("Not enough tickets available");
        }

        curr_event.Capacity -= ticket_count;
        uint256 price = curr_event.Price;  // in Wei
        string memory uri = curr_event.IPFS_Logo;
        
        // Remove the extra multiplication by 10**18
        require(msg.value == ticket_count * price, "Please enter the correct amount");
        
        address payable owner = payable(curr_event.owner);
        tokenId++;
        _safeMint(to, tokenId);

        
        
        // Transfer the exact payment to the owner
        (bool success, ) = owner.call{value: msg.value}("");
        require(success, "Transfer failed");
        
        _setTokenURI(tokenId, uri);
        ticketsOfUser[to].push(curr_event);

        // Add to list of events of that particular user
        bool flg = false;
        for(uint256 i=0; i<eventsOfUser[to].length; i++){
            if(eventsOfUser[to][i].id == event_id){
                flg = true;
                break;
            }   
        }
        if(!flg){
            BoughtEvent memory newBoughtEvent = BoughtEvent(event_id, to, curr_event.Name, curr_event.Description, curr_event.Date, curr_event.Time, curr_event.Venue, ticket_count, price, msg.value, uri, curr_event.Category);
            eventsOfUser[to].push(newBoughtEvent);
        }
        reputationScore[curr_event.owner] += ticket_count;
        reputationScore[to] += ticket_count;
        if(!checkExists(to)){
            allUsers.push(to);
        }
        emit Mint(to, ticket_count, msg.value);
    }

    
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal {
        require(from == address(0) || to == burning_address, "Err: token transfer is BLOCKED");   
        _beforeTokenTransfer(from, to, firstTokenId, batchSize);  
    }

    function addEvent(address to, string memory Name, string memory Description, string memory Date, string memory Time, string memory Venue, uint256 capacity, uint256 price, string memory uri, string memory Category) public _checkStake(to) {
        Event memory newEvent = Event(eventId, to, Name, Description, Date, Time, Venue, capacity, price, uri, Category);
        allEvents.push(newEvent);
        eventId++;
        reputationScore[to] += 1;
        if(!checkExists(to)){
            allUsers.push(to);
        }
        emit EventAdded(to, capacity, price, Date, Venue, Category);
    }

    function giveReview(uint256 event_id, address from, string memory comment, string memory timestamp, uint8 stars) public {
        Review memory newReview = Review(from, stars, comment, timestamp);
        allReviewsofEvent[event_id].push(newReview);
        reputationScore[from] += 1;
        emit Reviewed(from, stars, comment, timestamp);
    }

    function getAllEvents() public view returns(Event[] memory) {
        return allEvents;
    }

    function getEventById(uint256 id) public view returns(Event memory){
        return allEvents[id];
    }

    function getAllReview(uint256 event_id) public view returns(Review[] memory, uint8){
        Review[] memory oldReview = allReviewsofEvent[event_id];
        uint256 avg = 0;
        for(uint256 i=0; i<oldReview.length; i++){
            avg += oldReview[i].stars;
        }
        avg = avg/oldReview.length;
        return (oldReview, uint8(avg));
    }

    function getUserTickets(address user) public view returns(Event[] memory){
        return ticketsOfUser[user];
    }

    function getAllBoughtEvents(address user) public view returns(BoughtEvent[] memory){
        return eventsOfUser[user];
    }

    function getStake(address staker) public view returns(uint256){
        return Stakers[staker];
    }

    function getReputationScore(address user) public view returns(uint256){
        return reputationScore[user];
    }

    function getAllUsers() public view returns(address[] memory){
        return allUsers;
    }
    // function getResellTicketPrice(uint256 event_id) public view returns(uint256) {
    //     Event memory curr_event = allEvents[event_id];
    //     if(curr_event.Capacity == 0) {
    //         // Calculate 25% increase using integer arithmetic
    //         uint256 priceIncrease = (curr_event.Price * 25) / 100;
    //         return curr_event.Price + priceIncrease;
    //     }
    //     return curr_event.Price;
    // } 

}