// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * Minimal ERC20 interface to interact with existing tokens.
 * Adjust as needed (e.g., using OpenZeppelin's IERC20).
 */
interface IERC20 {
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function mint(address to, uint256 amount) external; // For STR, INT, VIT if they have a mint() function
    function burn(address from, uint256 amount) external; // For burning tokens
    function deposit() external payable; // For WETH wrapping
}

/**
 * Example contract that allows users to stake WETH or ETH in exchange for STR, INT, and VIT.
 */
contract AttributeMinter {
    // References to your tokens
    IERC20 public wethToken; // WETH
    IERC20 public strToken; // STR
    IERC20 public intToken; // INT
    IERC20 public vitToken; // VIT

    // Conversion: 1 WETH = X attribute tokens
    // e.g., 1 WETH = 100000 "attribute units"
    uint256 public constant CONVERSION_RATE = 100000;

    // This address (the contract) will hold the WETH users stake.
    // You could forward it to a treasury address if you prefer.

    constructor(
        address _wethToken,
        address _strToken,
        address _intToken,
        address _vitToken
    ) {
        wethToken = IERC20(_wethToken);
        strToken = IERC20(_strToken);
        intToken = IERC20(_intToken);
        vitToken = IERC20(_vitToken);
    }

    /**
     * @notice User stakes WETH and chooses how many STR, INT, VIT to mint.
     * @param desiredSTR Amount of STR tokens the user wants.
     * @param desiredINT Amount of INT tokens the user wants.
     * @param desiredVIT Amount of VIT tokens the user wants.
     */
    function stakeAndMint(
        uint256 desiredSTR,
        uint256 desiredINT,
        uint256 desiredVIT
    ) external payable {
        // 1) Calculate the total attribute tokens the user is requesting.
        uint256 totalAttributes = desiredSTR + desiredINT + desiredVIT;
        require(totalAttributes > 0, "No tokens requested");

        // 2) Calculate how much WETH is required
        //    costInWETH = totalAttributes / CONVERSION_RATE
        //    We'll do integer math carefully. For example, if totalAttributes=1000, cost=1 WETH
        //    If you want more precision, consider using a 1e18-based rate.
        uint256 costInWETH = totalAttributes / CONVERSION_RATE;
        if (totalAttributes % CONVERSION_RATE != 0) {
            // If there's a remainder, we add 1 to cover partial amounts
            costInWETH += 1;
        }
        require(costInWETH > 0, "Not enough WETH required");

        // 3) Handle ETH or WETH transfer
        if (msg.value > 0) {
            // User sent ETH, wrap it to WETH
            require(msg.value == costInWETH, "Incorrect ETH amount");
            wethToken.deposit{value: msg.value}();
        } else {
            // User wants to use WETH directly
            bool success = wethToken.transferFrom(
                msg.sender,
                address(this),
                costInWETH
            );
            require(success, "WETH transfer failed");
        }

        // 4) Mint the requested attribute tokens to the user.
        //    We assume your STR, INT, and VIT tokens each implement a mint() function.
        //    If they don't, you'll need a different approach (e.g., existing supply distribution).
        if (desiredSTR > 0) {
            strToken.mint(msg.sender, desiredSTR);
        }
        if (desiredINT > 0) {
            intToken.mint(msg.sender, desiredINT);
        }
        if (desiredVIT > 0) {
            vitToken.mint(msg.sender, desiredVIT);
        }

        // At this point:
        // - The user has the new STR/INT/VIT in their wallet.
        // - The WETH is in this contract (could be forwarded to a treasury).
    }

    /**
     * @notice Allows users to withdraw their WETH by burning attribute tokens
     * @param strAmount Amount of STR tokens to burn
     * @param intAmount Amount of INT tokens to burn
     * @param vitAmount Amount of VIT tokens to burn
     */
    function withdrawAndBurn(
        uint256 strAmount,
        uint256 intAmount,
        uint256 vitAmount
    ) external {
        // Calculate total attributes being returned
        uint256 totalAttributes = strAmount + intAmount + vitAmount;
        require(totalAttributes > 0, "No tokens to burn");

        // Calculate WETH to return
        uint256 wethToReturn = totalAttributes / CONVERSION_RATE;
        require(wethToReturn > 0, "Not enough tokens to get WETH back");
        require(
            wethToken.balanceOf(address(this)) >= wethToReturn,
            "Not enough WETH in contract"
        );

        // Burn the attribute tokens first
        if (strAmount > 0) {
            strToken.burn(msg.sender, strAmount);
        }
        if (intAmount > 0) {
            intToken.burn(msg.sender, intAmount);
        }
        if (vitAmount > 0) {
            vitToken.burn(msg.sender, vitAmount);
        }

        // Return the WETH
        bool success = wethToken.transfer(msg.sender, wethToReturn);
        require(success, "WETH transfer failed");
    }

    // /**
    //  * @notice (Optional) Owner or DAO can move WETH out of this contract
    //  *         to a treasury, reward pool, or wherever it's needed.
    //  */
    // function withdrawWETH(
    //     address to,
    //     uint256 amount
    // ) external /* onlyOwner or DAO */ {
    //     // Add your own access control
    //     bool success = wethToken.transfer(to, amount);
    //     require(success, "WETH withdrawal failed");
    // }
}
