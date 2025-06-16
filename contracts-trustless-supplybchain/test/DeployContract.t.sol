// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {SellingAgreement} from "../src/SellingAgreement.sol";

contract DeployContract is Test {
    SellingAgreement public sellingAgreement;

 address public owner = address(this); // Or any other address you want to be the owner
    address public buyer = address(0x1); // Example buyer address
    address public seller = address(0x2); // Example seller address
    address public anotherUser = address(0x3); // Another address for testing

    uint256 public price = 1 ether; // Example price

//  testing of contract creation 
    function setUp() public {
         vm.prank(buyer);   
        sellingAgreement = new SellingAgreement();
    }

    function test_ContractDeployment() public view {
        assertNotEq(address(sellingAgreement), address(0), "Contract should be deployed");
        assertEq(sellingAgreement.buyer(), buyer,"Buyer was not assigned on creation of contract");
    }

    function test_CreateContract_Revert_IfNotBuyer() public {
        vm.prank(anotherUser); // Call from an address that is not the buyer
        assertNotEq(sellingAgreement.buyer(), anotherUser,"anotherUser  was assigned on creation of contract");
    }

    function test_Ping() public {
        assertEq(sellingAgreement.Ping(),'pong',"not returning ping");
    }

}

