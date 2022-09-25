require("@nomicfoundation/hardhat-toolbox");
const fs = require('fs');
const privateKey = fs.readFileSync(".secret").toString()
/** @type import('hardhat/config').HardhatUserConfig */
const project_id = ""; //Add your Goerli testnet infura key here
module.exports = {
  networks:{
    hardhat : {
      chainId :1337,
    },
    goereli : {
      url:`https://goerli.infura.io/v3/${project_id}`,
      accounts:[privateKey]
    },
    moonbase:{
      url:"https://rpc.testnet.moonbeam.network",
      accounts:[privateKey]

    }
  },
  solidity: "0.8.17",
};
