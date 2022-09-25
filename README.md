<h1>PreRequisites</h1>
- Install MetaMask
- Create a new network with the following settings :

```shell
    Network Name       : Moonbase Alpha
    New RPC URL        : https://rpc.api.moonbase.moonbeam.network
    Chain ID           : 1287
    Currency Symbol    : DEV
    Block Explorer URL : https://moonbase.moonscan.io/
```

-Add some test token from moonbase faucet to your metamask wallet
    
    
    

<h1>Steps to run it on your local machine </h1>

<h2>Step 1 :Clone the project</h2>

```shell
git clone https://github.com/kapil4457/MoonBeam-Final-Submission.git
```

<h2>Step 2 : Installing all the dependencies</h2>

```shell
npm install
```

<h2>Step 3 : Deploy the Smart Contract</h2>

```shell
npx hardhat run ./src/scripts/deploy.js --network moonbase
```
- Copy the artifacts folder created and paste it into the src folder
- Go to the config.js in the src folder(if not present,create one) and paste the contract address in there

<h2>Step 4 : Create a file and name it ".secret" </h2>
In this file paste your Metamask Account Private Key.

<h2>Step 5 : Create a file named ".env" </h2>
In this create the following varaibles :- 

```shell
NFT_PORT
```
Create an account on NFT Port and generate an API key and set the value of this variable as that key

<h2>Now you are all set to go</h2>
Run the following command :- 

```shell
npm start
```

<h1 >Note</h1>
If your browser doesnot support IPFS URL then before starting the project do the following changes :- 
(Doing So,the image and name of the NFT which will be shown will not be the one that you uploaded , but will be a temporary immage)
1. Go to Components folder and go to  Home.jsx and comment out the following lines as shown in the picture<br>
(https://user-images.githubusercontent.com/78656206/192129825-67290c93-5dd6-4b8d-ac36-6faa621a16b1.png)<br>
2. Go to Components folder and go to HomePageCard.jsx and comment out the following lines of code as shown in the picture<br>
(https://user-images.githubusercontent.com/78656206/192129930-b3883505-f303-4863-8a5b-f85301735561.png)<br>
3. You will get the MetaData in your console and you can even check your data uploaded to ipfs





