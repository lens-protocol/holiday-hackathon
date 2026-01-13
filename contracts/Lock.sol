// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

abstract contract Ownable {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() {
        _transferOwnership(msg.sender);
    }

    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    function _checkOwner() internal view virtual {
        require(owner() == msg.sender, "Ownable: caller is not the owner");
    }

    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

// Simplified Pausable contract
abstract contract Pausable {
    event Paused(address account);
    event Unpaused(address account);

    bool private _paused;

    constructor() {
        _paused = false;
    }

    modifier whenNotPaused() {
        require(!paused(), "Pausable: paused");
        _;
    }

    modifier whenPaused() {
        require(paused(), "Pausable: not paused");
        _;
    }

    function paused() public view virtual returns (bool) {
        return _paused;
    }

    function _pause() internal virtual whenNotPaused {
        _paused = true;
        emit Paused(msg.sender);
    }

    function _unpause() internal virtual whenPaused {
        _paused = false;
        emit Unpaused(msg.sender);
    }
}

abstract contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}


contract ResolutionChallenge is Pausable, Ownable, ReentrancyGuard {
    struct Challenge {
        address creator;
        string title;
        string category;
        uint256 stakingAmount;
        uint256 startTime;
        uint256 endTime;
        uint256 gracePeriodHours;
        bool isActive;
        mapping(address => bool) participants;
        mapping(address => mapping(uint256 => Post)) dailyPosts;
        mapping(address => uint256) unclaimedRewards;
        uint256 participantCount;
    }

    struct Post {
        string ipfsHash;
        uint256 reportCount;
        bool isValid;
        mapping(address => bool) hasReported;
        uint256 timestamp;
    }

    mapping(uint256 => Challenge) public challenges;
    uint256 public challengeCount;

    // Category management
    string[] public categories;
    mapping(string => bool) public categoryExists;

    event ChallengeCreated(
        uint256 indexed challengeId,
        address creator,
        string title,
        string category,
        uint256 stakingAmount
    );
    event UserEnrolled(uint256 indexed challengeId, address user);
    event PostUploaded(
        uint256 indexed challengeId,
        address user,
        string ipfsHash
    );
    event PostReported(
        uint256 indexed challengeId,
        address reporter,
        address postOwner
    );
    event UserKicked(uint256 indexed challengeId, address user);
    event ChallengeCompleted(uint256 indexed challengeId);
    event ChallengeModified(
        uint256 indexed challengeId,
        uint256 newEndTime,
        uint256 newGracePeriod
    );
    event RewardsClaimed(
        uint256 indexed challengeId,
        address user,
        uint256 amount
    );
    event CategoryAdded(string category);

    modifier onlyParticipant(uint256 _challengeId) {
        require(
            challenges[_challengeId].participants[msg.sender],
            "Not a participant"
        );
        _;
    }

    modifier challengeExists(uint256 _challengeId) {
        require(_challengeId < challengeCount, "Challenge does not exist");
        _;
    }

    modifier challengeActive(uint256 _challengeId) {
        require(challenges[_challengeId].isActive, "Challenge is not active");
        _;
    }

    constructor() {
        addCategory("Fitness");
        addCategory("Education");
        addCategory("Health");
        addCategory("Productivity");
    }

    function addCategory(string memory _category) public onlyOwner {
        require(!categoryExists[_category], "Category already exists");
        categories.push(_category);
        categoryExists[_category] = true;
        emit CategoryAdded(_category);
    }

    function createChallenge(
        string memory _title,
        string memory _category,
        uint256 _stakingAmount,
        uint256 _durationInDays,
        uint256 _gracePeriodHours
    ) external payable whenNotPaused {
        require(msg.value == _stakingAmount, "Incorrect staking amount");
        require(_durationInDays > 0, "Duration must be positive");
        require(_gracePeriodHours <= 24, "Grace period cannot exceed 24 hours");
        require(categoryExists[_category], "Invalid category");

        uint256 challengeId = challengeCount++;
        Challenge storage newChallenge = challenges[challengeId];

        newChallenge.creator = msg.sender;
        newChallenge.title = _title;
        newChallenge.category = _category;
        newChallenge.stakingAmount = _stakingAmount;
        newChallenge.startTime = block.timestamp;
        newChallenge.endTime = block.timestamp + (_durationInDays * 1 days);
        newChallenge.gracePeriodHours = _gracePeriodHours;
        newChallenge.isActive = true;
        newChallenge.participants[msg.sender] = true;
        newChallenge.participantCount = 1;

        emit ChallengeCreated(
            challengeId,
            msg.sender,
            _title,
            _category,
            _stakingAmount
        );
    }

     function enrollInChallenge(uint256 _challengeId) 
        external 
        payable 
        challengeExists(_challengeId)
        challengeActive(_challengeId)
        whenNotPaused
        nonReentrant
    {
        Challenge storage challenge = challenges[_challengeId];
        
        // Check enrollment requirements
        require(!challenge.participants[msg.sender], "Already enrolled");
        require(msg.value == challenge.stakingAmount, "Incorrect staking amount");
        require(block.timestamp <= challenge.endTime, "Challenge has ended");
        
        // Calculate days elapsed since challenge start
        uint256 daysElapsed = (block.timestamp - challenge.startTime) / 1 days;
        require(daysElapsed < 3, "Cannot join after 2 days of challenge start");

        // Enroll the participant
        challenge.participants[msg.sender] = true;
        challenge.participantCount++;

        emit UserEnrolled(_challengeId, msg.sender);
    }

    function isEnrolled(uint256 _challengeId, address _user) 
        external 
        view 
        challengeExists(_challengeId) 
        returns (bool) 
    {
        return challenges[_challengeId].participants[_user];
    }

    function getRemainingEnrollmentTime(uint256 _challengeId) 
        external 
        view 
        challengeExists(_challengeId) 
        returns (uint256) 
    {
        Challenge storage challenge = challenges[_challengeId];
        uint256 daysElapsed = (block.timestamp - challenge.startTime) / 1 days;
        
        if (daysElapsed >= 2) {
            return 0;
        }
        
        return 2 days - ((block.timestamp - challenge.startTime) % 2 days);
    }

    function modifyChallenge(
        uint256 _challengeId,
        uint256 _newDurationInDays,
        uint256 _newGracePeriodHours
    ) external challengeExists(_challengeId) challengeActive(_challengeId) {
        Challenge storage challenge = challenges[_challengeId];
        require(msg.sender == challenge.creator, "Only creator can modify");
        require(
            _newGracePeriodHours <= 24,
            "Grace period cannot exceed 24 hours"
        );

        challenge.endTime = challenge.startTime + (_newDurationInDays * 1 days);
        challenge.gracePeriodHours = _newGracePeriodHours;

        emit ChallengeModified(
            _challengeId,
            challenge.endTime,
            _newGracePeriodHours
        );
    }

    function uploadDailyPost(
        uint256 _challengeId,
        string memory _ipfsHash
    )
        external
        challengeExists(_challengeId)
        challengeActive(_challengeId)
        onlyParticipant(_challengeId)
        whenNotPaused
    {
        Challenge storage challenge = challenges[_challengeId];
        uint256 currentDay = (block.timestamp - challenge.startTime) / 1 days;

        require(block.timestamp <= challenge.endTime, "Challenge has ended");

        // Check if within grace period of the previous day
        bool isWithinGracePeriod = block.timestamp <=
            challenge.startTime +
                (currentDay * 1 days) +
                (challenge.gracePeriodHours * 1 hours);

        require(isWithinGracePeriod, "Outside grace period");
        require(
            bytes(challenge.dailyPosts[msg.sender][currentDay].ipfsHash)
                .length == 0,
            "Already posted today"
        );

        Post storage newPost = challenge.dailyPosts[msg.sender][currentDay];
        newPost.ipfsHash = _ipfsHash;
        newPost.isValid = true;
        newPost.timestamp = block.timestamp;

        emit PostUploaded(_challengeId, msg.sender, _ipfsHash);
    }

    function withdrawUnclaimedRewards(uint256 _challengeId) 
        external 
        challengeExists(_challengeId) 
        onlyParticipant(_challengeId)
        nonReentrant
    {
        Challenge storage challenge = challenges[_challengeId];
        uint256 amount = challenge.unclaimedRewards[msg.sender];
        require(amount > 0, "No unclaimed rewards");

        // Update state before transfer to prevent reentrancy
        challenge.unclaimedRewards[msg.sender] = 0;

        // Use call instead of transfer
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");

        emit RewardsClaimed(_challengeId, msg.sender, amount);
    }

    function kickUser(uint256 _challengeId, address _user) internal nonReentrant {
        Challenge storage challenge = challenges[_challengeId];
        require(challenge.participants[_user], "User not in challenge");

        challenge.participants[_user] = false;
        challenge.participantCount--;

        // Calculate share amount
        uint256 shareAmount = challenge.stakingAmount / challenge.participantCount;
        
        // Store shares as unclaimed rewards instead of immediate transfer
        for (uint256 i = 0; i < challengeCount; i++) {
            if (challenge.participants[msg.sender]) {
                challenge.unclaimedRewards[msg.sender] += shareAmount;
            }
        }

        emit UserKicked(_challengeId, _user);
    }

    function completeChallenge(uint256 _challengeId) 
        external 
        challengeExists(_challengeId)
        challengeActive(_challengeId)
        whenNotPaused
        nonReentrant
    {
        Challenge storage challenge = challenges[_challengeId];
        require(block.timestamp >= challenge.endTime, "Challenge not yet ended");
        require(msg.sender == challenge.creator, "Only creator can complete challenge");

        challenge.isActive = false;

        // Calculate rewards for each successful participant
        uint256 totalPrize = challenge.stakingAmount * challenge.participantCount;
        uint256 shareAmount = totalPrize / challenge.participantCount;

        // Store as unclaimed rewards instead of immediate transfer
        for (uint256 i = 0; i < challengeCount; i++) {
            if (challenge.participants[msg.sender]) {
                challenge.unclaimedRewards[msg.sender] += shareAmount;
            }
        }

        emit ChallengeCompleted(_challengeId);
    }

    // Emergency pause/unpause functions
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // View functions for frontend integration
    function getChallengeDetails(
        uint256 _challengeId
    )
        external
        view
        returns (
            address creator,
            string memory title,
            string memory category,
            uint256 stakingAmount,
            uint256 startTime,
            uint256 endTime,
            uint256 gracePeriodHours,
            bool isActive,
            uint256 participantCount
        )
    {
        Challenge storage challenge = challenges[_challengeId];
        return (
            challenge.creator,
            challenge.title,
            challenge.category,
            challenge.stakingAmount,
            challenge.startTime,
            challenge.endTime,
            challenge.gracePeriodHours,
            challenge.isActive,
            challenge.participantCount
        );
    }

    function getCategories() external view returns (string[] memory) {
        return categories;
    }

    function getUnclaimedRewards(
        uint256 _challengeId,
        address _user
    ) external view returns (uint256) {
        return challenges[_challengeId].unclaimedRewards[_user];
    }
}
