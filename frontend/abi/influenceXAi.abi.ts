export const contractABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "dealId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "influencer",
        type: "address",
      },
    ],
    name: "DealAccepted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "dealId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "dealName",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "brand",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalBudget",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address[]",
        name: "influencers",
        type: "address[]",
      },
    ],
    name: "DealCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "dealId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "influencer",
        type: "address",
      },
    ],
    name: "DealRejected",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "enum lenscape.Role",
        name: "role",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "string",
        name: "description",
        type: "string",
      },
    ],
    name: "IdentityCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "dealId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "influencer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "rewardAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "rating",
        type: "uint256",
      },
    ],
    name: "RewardReleased",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_dealId",
        type: "uint256",
      },
    ],
    name: "acceptDeal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "address[]",
        name: "_influencers",
        type: "address[]",
      },
      {
        internalType: "uint256",
        name: "_totalBudget",
        type: "uint256",
      },
    ],
    name: "createDeal",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "enum lenscape.Role",
        name: "_role",
        type: "uint8",
      },
    ],
    name: "createIdentity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "dealCounter",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "deals",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "address",
        name: "brand",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "totalBudget",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "active",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "identities",
    outputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "enum lenscape.Role",
        name: "role",
        type: "uint8",
      },
      {
        internalType: "bool",
        name: "created",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_dealId",
        type: "uint256",
      },
    ],
    name: "rejectDeal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_dealId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_rating",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_rewardAmount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_toInfluencer",
        type: "address",
      },
    ],
    name: "releaseReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
