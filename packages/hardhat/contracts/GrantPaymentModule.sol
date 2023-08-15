// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./Enum.sol";
import "./SignatureDecoder.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface GnosisSafe {
    /// @dev Allows a Module to execute a Safe transaction without any further confirmations.
    /// @param to Destination address of module transaction.
    /// @param value Ether value of module transaction.
    /// @param data Data payload of module transaction.
    /// @param operation Operation type of module transaction.
    function execTransactionFromModule(
        address to,
        uint256 value,
        bytes calldata data,
        Enum.Operation operation
    ) external returns (bool success);
}

contract GrantPaymentModule {
    // ----------------------------------------
    //      Constants
    // ----------------------------------------

    IERC20 public token; // Declare the USDC token contract

    string public constant NAME = "GRANTS Module";
    string public constant VERSION = "0.1.0";
    bytes32 public constant GRANT_TRANSFER_TYPEHASH =
        keccak256("Grant Transfer");
    bytes32 public constant DOMAIN_SEPARATOR_TYPEHASH =
        keccak256("Domain Separator");

    address public owner; // contract owner/admin
    address tokenAddress;

    // do we need Safe -> RefUID -> Grants ??
    // RefUID -> Grants ??
    mapping(string => Grant) public grants;
    mapping(address => bool) public approvedDelegates;

    struct Grant {
        address delegate;
        address grantee;
        uint96 amount;
        uint96 distributedAmount;
        uint96 milestoneAmount;
        uint96 reachedMilestoneAmount;
        string grantRefID;
        Enum.GrantStatus status;
        uint16 nonce; // You mentioned you're unsure about the nonce. For now, I've added it.
    }

    // ----------------------------------------
    //      Events
    // ----------------------------------------

    event GrantCreated(
        string grantRefID,
        address delegate,
        uint96 amount,
        uint96 milestoneAmount
    );
    event GrantUpdated(
        string grantRefID,
        uint96 distributedAmount,
        uint96 reachedMilestoneAmount
    );
    event GrantPayed(string grantRefID, Enum.GrantStatus status);
    event GrantCanceled(string grantRefID, Enum.GrantStatus status);

    // ----------------------------------------
    //      Modifiers
    // ----------------------------------------

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized: must be owner");
        _;
    }

    modifier onlyApprovedDelegate(address _delegate) {
        require(approvedDelegates[_delegate], "Not an approved delegate");
        _;
    }

    modifier onlyDelegateOrOwner(address _delegate, string memory _grantRefID) {
        require(
            msg.sender == grants[_grantRefID].delegate || msg.sender == owner,
            "Not authorized: must be current delegate or owner"
        );
        _;
    }

    constructor(address _tokenAddress) {
        owner = msg.sender; // Set the contract deployer as the initial owner.
        tokenAddress = _tokenAddress;
        token = IERC20(tokenAddress); // Initialize the USDC token contract
    }

    // do we need this????
    function addDelegates(address[] memory _delegates) public onlyOwner {
        for (uint i = 0; i < _delegates.length; i++) {
            approvedDelegates[_delegates[i]] = true;
        }
    }

    function setGrant(
        address _granteeAddress,
        address _delegate,
        uint96 _amount,
        uint96 _milestoneAmount,
        string memory _grantRefID
    ) public {
        grants[_grantRefID] = Grant({
            delegate: _delegate,
            grantee: _granteeAddress,
            amount: _amount,
            distributedAmount: 0,
            milestoneAmount: _milestoneAmount,
            reachedMilestoneAmount: 0,
            grantRefID: _grantRefID,
            status: Enum.GrantStatus.Created,
            nonce: 0
        });

        emit GrantCreated(_grantRefID, _delegate, _amount, _milestoneAmount);
    }

    function getGrant(
        string memory _grantRefID
    ) public view returns (Grant memory) {
        return grants[_grantRefID];
    }

    function updateGrantDelegate(
        string memory _grantRefID,
        address _newDelegate
    ) public onlyDelegateOrOwner(msg.sender, _grantRefID) {
        require(
            approvedDelegates[_newDelegate],
            "New delegate is not approved"
        );

        grants[_grantRefID].delegate = _newDelegate;
    }

    function updateGrant(
        string memory _grantRefID,
        uint96 _currentMilestone,
        address _delegate
    ) public {
        Grant storage grant = grants[_grantRefID];
        // if a new milestone is approved, a matching amount will be payed to the grantee
        if (grant.reachedMilestoneAmount != _currentMilestone) {
            grant.reachedMilestoneAmount = _currentMilestone;

            executeMilestoneTransfer(_grantRefID);
            if (grant.milestoneAmount == _currentMilestone) {
                grant.status = Enum.GrantStatus.Payed;
                emit GrantPayed(_grantRefID, grant.status);
            }
            if (grant.milestoneAmount != _currentMilestone) {
                grant.status = Enum.GrantStatus.Ongoing;
            }
        }
        if (grant.delegate != _delegate) {
            grant.delegate = _delegate;
        }
    }

    function executeMilestoneTransfer(string memory _grantRefID) internal {
        Grant storage grant = grants[_grantRefID];

        // Calculate the amount to transfer for the reached milestone.
        uint96 transferAmount = grant.amount / grant.milestoneAmount;

        // Ensure the contract has enough funds and the grant has not exceeded its limit.
        require(
            address(this).balance >= transferAmount,
            "Not enough funds in the contract"
        );
        require(
            grant.distributedAmount + transferAmount <= grant.amount,
            "Transfer exceeds grant limit"
        );

        // Transfer the funds.
        token.approve(msg.sender, transferAmount);
        token.transferFrom(msg.sender, grant.grantee, transferAmount);
        // payable(_granteeAddress).transfer(transferAmount);

        // Update the distributed amount for the grant.
        grant.distributedAmount += transferAmount;
    }

    function cancelGrant(string memory _grantRefID) public onlyOwner {
        Grant storage grant = grants[_grantRefID];

        grant.status = Enum.GrantStatus.Canceled;
        emit GrantCanceled(_grantRefID, grant.status);
    }
}
