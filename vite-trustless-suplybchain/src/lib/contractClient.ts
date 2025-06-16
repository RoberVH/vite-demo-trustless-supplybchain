// src/lib/contractClient.ts

import {
  createPublicClient,
  createWalletClient,
  http,
  decodeEventLog,
  type Abi,
  type Address,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import contractAbiJson from "../web3/SellingAgreement.json";

//
// Cast the imported JSON ABI into viem’s Abi type
//
const contractAbi = contractAbiJson.abi as Abi;

//
// Struct matching the Solidity ContractInput calldata for its CreateContract method
//
export interface ContractInput {
  description: string;
  units: number;
  lote: string;
  unitPrice: bigint;
  maxDeliveryDate: bigint;
  minDaysValidity: number;
  locationDelivery: number;
  requiredDocuments: number[];
  warehouseReceiver: Address;
  seller: Address;
}

// defitionition of type for event COntractCreated
interface ContractCreatedEventArgs {
  contractId: bigint;
}

let RPCUrl
let contractAddress:Address
let privateKey

// load env vars  contingent to type of running env
if (process.env.NODE_ENV==='development')
{  RPCUrl = import.meta.env.VITE_ANVIL_URL as string;
   contractAddress = import.meta.env.VITE_ANVIL_CONTRACT_ADDRESS as `0x${string}`;
   privateKey = import.meta.env.VITE_ANVIL_PRIVATE_KEY as `0x${string}`;
} else { 
   RPCUrl = import.meta.env.VITE_ANVIL_URL as string;
   contractAddress = import.meta.env.VITE_ANVIL_CONTRACT_ADDRESS as `0x${string}`;
   privateKey = import.meta.env.VITE_ANVIL_PRIVATE_KEY as `0x${string}`;
}

//
// Create viem clients:
// 1) publicClient for simulateContract & waitForTransactionReceipt
// 2) walletClient for writeContract (signed tx)
//
const account = privateKeyToAccount(privateKey);

export const publicClient = createPublicClient({
  transport: http(RPCUrl),
});

export const walletClient = createWalletClient({
  account,
  transport: http(RPCUrl),
});

//
// Calls the `createContract` function on-chain and returns
// the new `contractId` emitted in the `ContractCreated` event.
//
export async function createContractOnChain(
  input: ContractInput
): Promise<number> {
  // 1) Simulate to prepare calldata + estimate gas
  const { request } = await publicClient.simulateContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "createContract",
    args: [input],
    account: account.address as Address,
  });

  // 2) Send signed transaction
  const hash = await walletClient.writeContract(request);

  // 3) Wait for it to be mined
  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  // 4) Scan logs for `ContractCreated` and decode it
  for (const log of receipt.logs) {
    try {
      const event = decodeEventLog({
        abi: contractAbi,
        data: log.data,
        topics: log.topics,
      }) 
       if (event.eventName === "ContractCreated" && event.args && "contractId" in event.args) {
        // 5) Return the emitted contractId
        return Number((event.args as ContractCreatedEventArgs).contractId)
      }
    } catch {
      // not the event we want → skip
    }
  }

  throw new Error("ContractCreated event not found");
}
