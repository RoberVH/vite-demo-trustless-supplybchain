// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {SellingAgreement} from "../src/SellingAgreement.sol";
//import {TestDataFactory} from "./TestingContractDataFactory.sol";
import "./TestingContractDataFactory.sol";



contract CreateContract_test is Test {
    SellingAgreement public sellingAgreement;
    using TestDataFactory for *;
    SellingAgreement.ContractInput internal mockInput;

    address public buyer = address(0x1); //  buyer address
    address public seller = address(0x2); //  seller address
    address public designatedSeller = address(0x2);
    address public designatedWarehouseAddress = address(0x3);
    address public anotherUser = address(0x4);

//  testing of contract creation 
    function setUp() public {
        // Deploy SellingAgreement contract as buyer
         vm.prank(buyer);   
        sellingAgreement = new SellingAgreement();

        mockInput = TestDataFactory.createDefaultContractInput();
        //customize warehouse and seller addres for this testings
        mockInput.warehouseReceiver = designatedWarehouseAddress;
        mockInput.seller = designatedSeller;
    }

    // test selling contract creation from other address than buyer, it should fail
    function test_CreateContract_Revert_IfNotBuyer() public {
        vm.prank(anotherUser); // Call from an address that is not the buyer
        vm.expectRevert("Only Buyer allowed");
        sellingAgreement.createContract(mockInput);
    }

    // test succesful creation of selling contract
    function test_CreateContract_Success() public {
        vm.prank(buyer); // Ensure 'buyer' is calling

        // Expect the ContractCreated event
        vm.expectEmit(true, true, true, true);
        emit SellingAgreement.ContractCreated(1, mockInput.seller, mockInput.warehouseReceiver, block.timestamp); // block.timestamp will be approximate here

        uint16 contractId = sellingAgreement.createContract(mockInput);
        assertEq(contractId, 1, "First contractId should be 1");

        SellingAgreement.ContractInput memory createdContract = sellingAgreement.getContract(contractId);

        assertEq(createdContract.contractId, contractId, "Stored contractId mismatch");
        assertTrue(createdContract.creationDate > 0, "Creation date should be set");
        assertEq(mockInput.description, TestDataFactory.DEFAULT_DESCRIPTION);
        assertEq(mockInput.units, TestDataFactory.DEFAULT_UNITS);
        assertEq(createdContract.lote, mockInput.lote, "Lote mismatch");
        assertEq(createdContract.unitPrice, mockInput.unitPrice, "Unit price mismatch");
        assertEq(createdContract.maxDeliveryDate, mockInput.maxDeliveryDate, "Max delivery date mismatch");
        assertEq(createdContract.minDaysValidity, mockInput.minDaysValidity, "Min days validity mismatch");
        assertEq(createdContract.locationDelivery, mockInput.locationDelivery, "Location delivery mismatch");
        assertEq(createdContract.requiredDocuments.length, mockInput.requiredDocuments.length, "Required documents length mismatch");
        assertEq(createdContract.requiredDocuments[0], mockInput.requiredDocuments[0], "Required document content mismatch");
        assertEq(createdContract.requiredDocuments[1], mockInput.requiredDocuments[1], "Required document content mismatch");
        assertEq(createdContract.warehouseReceiver, mockInput.warehouseReceiver, "Warehouse address mismatch");
        assertEq(createdContract.seller, mockInput.seller, "Seller address mismatch");
        assertTrue(createdContract.isActive, "Contract should be active upon creation");
    }
 }
