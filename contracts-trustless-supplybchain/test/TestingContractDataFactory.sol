// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../src/SellingAgreement.sol";

// SellingAgreement.ContractInput mockInput;


library TestDataFactory {
    uint256 public constant DEFAULT_PRICE = 205 * 1e6;
    uint32 public constant DEFAULT_UNITS = 100;
    string public constant DEFAULT_DESCRIPTION = "Sarten carbonizado mod. A34 Brass";
    string public constant DEFAULT_LOTE = "LOTE 523";


    /// Create a base mockupInput var holding a selling agreement contract
    function createDefaultContractInput() internal view returns (SellingAgreement.ContractInput memory) {
        uint8[] memory docs = new uint8[](2);
        docs[0] = 10;  // document code 10;
        docs[1] = 20;  // document code 20;
        return SellingAgreement.ContractInput({
       // Prepare a default ContractInput for tests
        contractId: 1,  // contracts start on 1
        creationDate: uint256(block.timestamp),
        description: DEFAULT_DESCRIPTION,
        units: DEFAULT_UNITS,
        lote: DEFAULT_LOTE,
        unitPrice: DEFAULT_PRICE,
        maxDeliveryDate : block.timestamp + 15 days,
        minDaysValidity : 0,  // non perishable
        locationDelivery : 1, // Wahrewhose  location code
        requiredDocuments : docs,
        realDeliveryDate: uint256(0),
        warehouseReceiver : address(0),
        seller : address(0x2),
        isActive : true
        });
    }
    

    // Create the first selling contract 
    function createLargeOrderInput() internal view returns (SellingAgreement.ContractInput memory) {
        SellingAgreement.ContractInput memory input = createDefaultContractInput();
           return input;
    }

}