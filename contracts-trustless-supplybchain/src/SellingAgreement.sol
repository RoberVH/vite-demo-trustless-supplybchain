// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SellingAgreement
 * @notice This contract allows the buyer to create and manage multiple purchase-sale agreements with different buyers.
 * It tracks contract details and lifecycle events, enabling integration with a Treasury contract for payment processing.
 */
contract SellingAgreement {
    /// @dev Internal counter to assign unique contract IDs, starts at 1
    uint16 private _contractCounter = 1;

    /// @notice Represents a purchase-sale contract
    struct ContractInput  {
        uint256 contractId;         // Unique contract ID
        uint256 creationDate;       // Creation timestamp (unix epoch)
        string description;         // Product description
        uint32 units;               // Units to be delivered
        string lote;                // Batch or lot identifier
        uint256 unitPrice;           // Unit price in USD stablecoin, no decimals
        uint256 maxDeliveryDate;    // Max delivery date (unix epoch)
        uint256 realDeliveryDate;   // Actual delivery date (unix epoch)
        uint8 minDaysValidity;      // For perishable products, minimum days product must be valid after delivery, 0 otherwise
        uint8 locationDelivery;     // Warehouse location code (catalog)
        uint8[] requiredDocuments;  // Array of document codes required for delivery
        address warehouseReceiver ; // Address of warehouse products receptionist
        address seller;              // Address of buyer
        bool isActive;              // Contract status active/inactive
    }

    /// @dev Mapping from contract ID to ContractInput
    mapping(uint16 => ContractInput) private contracts;

    /// @notice Address of the seller (owner) who deploys this contract
    address public immutable buyer;

    /// @dev Modifier to restrict access only to the buyer
    modifier onlyBuyer() {
        require(msg.sender == buyer, "Only Buyer allowed");
        _;
    }

/// @dev Modifier to restrict access only to the Warehouse receiving delivery
    // we got the seller address from the agreement record as it could vary
    modifier onlyWarehouse(address warehouse) {
        require(msg.sender == warehouse, "Only Warehouse receptionist  allowed");
        _;
    }

    /// @dev Modifier to restrict access only to the seller
    // we got the seller address from the agreement record as it could vary
    modifier onlySeller(address seller) {
        require(msg.sender == seller, "Only Seller allowed");
        _;
    }

    /// @dev Modifier to check contract existence and active state
    modifier contractExists(uint16 contractId) {
        require(contracts[contractId].contractId != 0, "Contract does not exist");
        require(contracts[contractId].isActive, "Contract is inactive");
        _;
    }

    /// @notice Event emitted when a new selling contract is created
    event ContractCreated(
        uint256 indexed contractId,
        address indexed seller,
        address indexed warehouse,
        uint256 creationDate
    );

    /// @notice Event emitted when contract delivery details are updated
    event DeliveryUpdated(
        uint256 indexed contractId,
        uint256 realDeliveryDate
    );

    /// @notice Event emitted when contract is marked inactive (closed/cancelled)
    event ContractClosed(
        uint256 indexed contractId
    );

    /**
     * @notice Constructor sets the seller address (deployer)
     */
    constructor() {
        buyer = msg.sender;
    }

    /**
 * @notice Create a new purchase-sale contract
     * @param input Struct containing all the contract creation parameters:
     *  - seller Address of the seller
     *  - warehouse Address of the warehouse responsible for delivery
     *  - description Description of the contract
     *  - units Number of units to deliver
     *  - lote Batch or lot identifier string
     *  - unitPrice Price per unit in USD stablecoin, no decimals
     *  - maxDeliveryDate Maximum delivery date as unix timestamp
     *  - minDaysValidity Minimum days product must remain valid after delivery
     *  - locationDelivery Warehouse location code (catalog)
     *  - requiredDocuments Array of required document codes for delivery
     * @return contractId The newly created contract's unique ID
     */
function createContract(ContractInput calldata input) external onlyBuyer returns (uint16 contractId) {
    contractId = _contractCounter++;
    ContractInput storage c = contracts[contractId];
    c.contractId = contractId;
    c.creationDate = block.timestamp;
    c.description = input.description;
    c.units = input.units;
    c.lote = input.lote;
    c.unitPrice = input.unitPrice;
    c.maxDeliveryDate = input.maxDeliveryDate;
    c.minDaysValidity = input.minDaysValidity;
    c.locationDelivery = input.locationDelivery;
    c.requiredDocuments = input.requiredDocuments;
    c.warehouseReceiver = input.warehouseReceiver;
    c.seller = input.seller;
    c.isActive = true;

    emit ContractCreated(contractId, input.seller, input.warehouseReceiver, c.creationDate);
    }

    /**
     * @notice Update the real delivery date once delivery is completed
     * @param contractId The contract ID to update
     * @param _realDeliveryDate The actual delivery date (unix timestamp)
     */
    function updateDeliveryDate(uint16 contractId, uint256 _realDeliveryDate)
        external
        onlyWarehouse(contracts[contractId].warehouseReceiver)
        contractExists(contractId)
    {
        ContractInput storage c = contracts[contractId];
        require(_realDeliveryDate <= block.timestamp, "Delivery date cannot be in the future");
        c.realDeliveryDate = _realDeliveryDate;
        emit DeliveryUpdated(contractId, _realDeliveryDate);
    }

    /**
     * @notice Close or cancel a contract, marking it inactive
     * @param contractId The contract ID to close
     */
    function closeContract(uint16 contractId) external onlyBuyer contractExists(contractId) {
        contracts[contractId].isActive = false;
        emit ContractClosed(contractId);
    }

    /**
     * @notice Get the details of a contract by ID
     * @param contractId The contract ID to query
     * @return ContractInput struct containing all contract information
     */
    function getContract(uint16 contractId)
        external
        view
        returns (ContractInput memory)
    {
        require(contracts[contractId].contractId != 0, "Contract does not exist");
        return contracts[contractId];
    }

    function Ping() public pure returns (string memory) {
        return('pong');
    }
}
