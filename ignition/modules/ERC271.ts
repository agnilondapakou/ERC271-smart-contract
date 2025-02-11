// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

let name = "MyNFT";
let symbol = "MNFT";
let baseURI = "data:image/svg+xml;base64,PHN2ZyB4b";

const MyNFTModule = buildModule("MyNFTModule", (m) => {

  const myNFT = m.contract("MyNFT", [name, symbol, baseURI]);

  return { myNFT };
});

export default MyNFTModule;
