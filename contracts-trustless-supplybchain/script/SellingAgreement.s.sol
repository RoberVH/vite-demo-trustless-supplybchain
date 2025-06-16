// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {SellingAgreement} from "../src/SellingAgreement.sol";

contract SellingAgreementScript is Script {
    SellingAgreement public sellingAgreement;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        sellingAgreement = new SellingAgreement();
        vm.stopBroadcast();
    }
}