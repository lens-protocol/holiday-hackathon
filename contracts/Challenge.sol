// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/*
  Upgradeable contract using OpenZeppelin libraries
  to allow on-chain creation of challenges with a bounty.
  Users can join, submit their Lens Protocol post link,
  and the challenge creator declares the winner who receives the bounty.
*/

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

contract ChallengeFactory is Initializable, OwnableUpgradeable {

    uint256 public challengeCount;

    struct ParticipantInfo {
        bool hasJoined;
        bool hasSubmitted;
        string lensPostLink;
    }

    struct Challenge {
        address creator;
        address rewardToken;
        uint256 bountyAmount;
        bool active;
        address winner;
        mapping(address => ParticipantInfo) participants;
        address[] participantList;
    }

    // challengeId => Challenge
    mapping(uint256 => Challenge) private challenges;

    event ChallengeCreated(
        uint256 indexed challengeId,
        address indexed creator,
        address indexed rewardToken,
        uint256 bountyAmount
    );

    event ChallengeJoined(
        uint256 indexed challengeId,
        address indexed participant
    );

    event SubmissionMade(
        uint256 indexed challengeId,
        address indexed participant,
        string lensPostLink
    );

    event WinnerDeclared(
        uint256 indexed challengeId,
        address indexed winner,
        uint256 bountyAmount
    );

    function initialize() external initializer {
        __Ownable_init();
        challengeCount = 0;
    }

    // Creator sets up a challenge, deposits the bounty in a chosen ERC20 token
    function createChallenge(
        address _rewardToken,
        uint256 _bountyAmount
    ) external {
        require(_rewardToken != address(0), "Invalid token address");
        require(_bountyAmount > 0, "Bounty must be > 0");

        // Transfer the bounty from creator to this contract
        IERC20Upgradeable(_rewardToken).transferFrom(msg.sender, address(this), _bountyAmount);

        challengeCount++;
        Challenge storage c = challenges[challengeCount];
        c.creator = msg.sender;
        c.rewardToken = _rewardToken;
        c.bountyAmount = _bountyAmount;
        c.active = true;

        emit ChallengeCreated(challengeCount, msg.sender, _rewardToken, _bountyAmount);
    }

    // Participant joins a challenge
    function joinChallenge(uint256 _challengeId) external {
        Challenge storage c = challenges[_challengeId];
        require(c.active, "Challenge not active");
        require(c.creator != address(0), "Challenge does not exist");

        ParticipantInfo storage p = c.participants[msg.sender];
        require(!p.hasJoined, "Already joined");
        p.hasJoined = true;
        c.participantList.push(msg.sender);

        emit ChallengeJoined(_challengeId, msg.sender);
    }

    // Participant submits their Lens Protocol post link as proof
    function submitLensPost(uint256 _challengeId, string calldata _lensPostLink) external {
        Challenge storage c = challenges[_challengeId];
        require(c.active, "Challenge not active");
        require(c.creator != address(0), "Challenge does not exist");

        ParticipantInfo storage p = c.participants[msg.sender];
        require(p.hasJoined, "Not joined");
        require(!p.hasSubmitted, "Already submitted");

        p.hasSubmitted = true;
        p.lensPostLink = _lensPostLink;

        emit SubmissionMade(_challengeId, msg.sender, _lensPostLink);
    }

    // Creator declares the winner and transfers the bounty to them
    function declareWinner(uint256 _challengeId, address _winner) external {
        Challenge storage c = challenges[_challengeId];
        require(c.creator == msg.sender, "Only creator can declare winner");
        require(c.active, "Challenge already ended");
        require(c.participants[_winner].hasJoined, "Winner not a participant");
        require(c.participants[_winner].hasSubmitted, "Winner has no submission");

        c.active = false;
        c.winner = _winner;

        IERC20Upgradeable(c.rewardToken).transfer(_winner, c.bountyAmount);

        emit WinnerDeclared(_challengeId, _winner, c.bountyAmount);
    }

    // View function to get challenge data
    function getChallengeData(uint256 _challengeId) external view returns (
        address creator,
        address rewardToken,
        uint256 bountyAmount,
        bool active,
        address winner,
        address[] memory participantList
    ) {
        Challenge storage c = challenges[_challengeId];
        creator = c.creator;
        rewardToken = c.rewardToken;
        bountyAmount = c.bountyAmount;
        active = c.active;
        winner = c.winner;
        participantList = c.participantList;
    }

    // View function to get participant info
    function getParticipantInfo(uint256 _challengeId, address _participant)
        external
        view
        returns (
            bool hasJoined,
            bool hasSubmitted,
            string memory lensPostLink
        )
    {
        ParticipantInfo storage p = challenges[_challengeId].participants[_participant];
        hasJoined = p.hasJoined;
        hasSubmitted = p.hasSubmitted;
        lensPostLink = p.lensPostLink;
    }
}
