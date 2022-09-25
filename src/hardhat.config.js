require("@nomicfoundation/hardhat-toolbox");
const fs = require('fs');
const privateKey = fs.readFileSync(".secret").toString()
/** @type import('hardhat/config').HardhatUserConfig */
const project_id = "d40712e5757c34405bf241750e89d3831be2b7ae2136eaeb86d647247d7f727f";
module.exports = {
  networks:{
    hardhat : {
      chainId :1337,
    },
    goerli:{
      url:`https://goerli.infura.io/v3/${project_id}`,
      accounts:[privateKey]
    },
    moonbase:{
      url:"wss://wss.api.moonbase.moonbeam.network",
      accounts:[privateKey]
    },
    matic:{
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [privateKey]
    }
  },
  solidity: "0.8.17",
};
