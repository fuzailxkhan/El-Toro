// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
import "./IERC20.sol";

contract StakingContract {
    uint256 public totalStaked;
    address public owner;
    bool public isPaused = false;

    mapping(address => uint256) public approvedAmounts;
    mapping(address => uint256) public stakedAmounts;
    mapping(address => uint256) public stakeTimestamps;

    uint256 public rewardRatePerMinute = 1;

    event tokensStaked(address from, uint256 amount);
    IERC20 public erc20Contract;

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Message sender must be the contract's owner."
        );
        _;
    }

    modifier whenNotPaused() {
        require(!isPaused, "Contract is paused");
        _;
    }

    function pause() public onlyOwner {
        isPaused = true;
    }

    function unpause() public onlyOwner {
        isPaused = false;
    }

    constructor(IERC20 _erc20ContractAddress) {
        require(
            address(_erc20ContractAddress) != address(0),
            "ERC20 contract address can not be the zero address"
        );
        erc20Contract = _erc20ContractAddress;
        owner = msg.sender;
    }

    function approveTokens(uint256 _amount) public {
        IERC20 token = IERC20(erc20Contract);
        require(token.approve(address(this), _amount), "Approval failed");
        approvedAmounts[msg.sender] += _amount;
    }

    function emergencyWithdraw() public onlyOwner {
        IERC20 token = IERC20(erc20Contract);
        require(
            token.transfer(owner, token.balanceOf(address(this))),
            "Transfer failed"
        );
        isPaused = true;
    }

    function setRewardRate(uint256 newRewardRate) public onlyOwner {
        rewardRatePerMinute = newRewardRate;
    }

    function stake(uint256 _amount) public whenNotPaused {
   
        IERC20 token = IERC20(erc20Contract);
        uint256 allowance = token.allowance(msg.sender, address(this));

        require(
            allowance >= _amount,
            "Check the token allowance"
        );

        require(
            token.transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );
        stakedAmounts[msg.sender] += _amount;
        totalStaked += _amount;
        stakeTimestamps[msg.sender] = block.timestamp;
        emit tokensStaked(msg.sender, _amount);
    }

    function unstake(uint256 _amount) public {
        require(
            stakedAmounts[msg.sender] >= _amount,
            "Insufficient staked balance"
        );

        IERC20 token = IERC20(erc20Contract);
        require(token.transfer(msg.sender, _amount), "Transfer failed");
        stakedAmounts[msg.sender] -= _amount;
        totalStaked -= _amount;
    }

    

    function claimReward() public {

        uint256 stakedDurationInMinutes = (block.timestamp -
            stakeTimestamps[msg.sender]) / 60;

        uint256 stakedAmount = stakedAmounts[msg.sender];

        uint256 reward = (stakedAmount *
            rewardRatePerMinute *
            stakedDurationInMinutes) / 100;

        require(stakedAmount > 0, "No tokens staked");

        require(reward > 0, "No rewards available");

        stakeTimestamps[msg.sender] = block.timestamp;

        IERC20 token = IERC20(erc20Contract);

        require(
            token.transfer(msg.sender, reward),
            "Reward transfer failed"
        );
    }
}



// contract address = 0xDD242cF1693571266837D86e956445734e81d94E
// token address = 0xceC1613c976C81A997175004CA20D0ED698C0979