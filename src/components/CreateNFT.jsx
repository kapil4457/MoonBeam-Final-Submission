import React, { useState } from "react";
import styled from "styled-components";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { marketplaceAddress, nftaddress } from "../config";
import NFTMarketplace from "../artifacts/contracts/NFTMarket.sol/NFTMarketplace.json";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateNFT = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const router = useNavigate();
  const [ipfsURL, setipfsURL] = useState("");
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });

  async function onChange(e) {
    const form = new FormData();

    form.append("file", e.target.files[0]);

    const options = {
      method: "POST",
      url: "https://api.nftport.xyz/v0/files",
      headers: {
        "Content-Type":
          "multipart/form-data; boundary=---011000010111000001101001",
        Authorization: "66f2769e-9739-4dfd-8eba-fbb287eb37a6",
      },
      data: form,
    };

    axios
      .request(options)
      .then(function (response) {
        setFileUrl(response.data.ipfs_url);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  async function uploadToIPFS() {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;

    //IPFS Method

    const options = {
      method: "POST",
      url: "https://api.nftport.xyz/v0/metadata",
      headers: {
        "Content-Type": "application/json",
        Authorization: "66f2769e-9739-4dfd-8eba-fbb287eb37a6",
      },
      data: {
        name: `${name}`,
        description: `${description}`,
        file_url: `${fileUrl}`,
      },
    };

    await axios
      .request(options)
      .then(function (response) {
        setipfsURL(response.data.metadata_uri);

        return response.data.metadata_uri;
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  async function listNFTForSale() {
    try {
      const url = await uploadToIPFS();
      console.log("ipfs : ", ipfsURL);
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      /* next, create the item */
      const price = ethers.utils.parseUnits(formInput.price, "ether");
      let contract = new ethers.Contract(
        marketplaceAddress,
        NFTMarketplace.abi,
        signer
      );
      let listingPrice = await contract.getListingPrice();
      listingPrice = listingPrice.toString();
      console.log("ipfsUrl : ", ipfsURL);

      let transaction = await contract.createToken(ipfsURL, price);
      await transaction.wait();

      router("/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Container>
      <Heading>Create Your NFT</Heading>
      <Main>
        <Image>
          {fileUrl && (
            <img className="rounded mt-4" width="350" src={fileUrl} />
          )}
          <div>
            <input type="file" onChange={onChange} />
          </div>
        </Image>
        <Info>
          <input
            type="text"
            placeholder="Name of NFT"
            onChange={(e) =>
              updateFormInput({ ...formInput, name: e.target.value })
            }
          />
          <textarea
            type="text"
            placeholder="Description"
            onChange={(e) =>
              updateFormInput({ ...formInput, description: e.target.value })
            }
          />
          <div>
            <input
              type="number"
              placeholder="Price"
              className="option"
              onChange={(e) =>
                updateFormInput({ ...formInput, price: e.target.value })
              }
            />
          </div>

          <button onClick={listNFTForSale}>Create</button>
        </Info>
      </Main>
    </Container>
  );
};

export default CreateNFT;
const Container = styled.div`
  display: flex;
  height: 80vh;
  width: 100%;
  flex-direction: column;
`;
const Heading = styled.div`
  padding-top: 2rem;
  width: 100%;
  height: 20%;
  align-items: center;
  justify-content: center;
  display: flex;
  font-size: 3rem;
  font-weight: 550;
  text-decoration: underline;
  text-shadow: 2px 5px 6px gray;
`;
const Main = styled.div`
  display: flex;
  height: 80%;
  display: flex;
  // justify-content: center;
  align-items: center;
  padding: 0 20rem;
  gap: 8rem;
`;
const Image = styled.div`
  width: 35%;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: white;
  align-items: center;
  border-radius: 2rem;
  box-shadow: 2px 2px 9px 2px gray;

  div {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 5rem;
    border-radius: 2rem;
  }
  button {
    height: 15%;
    margin: 1.5rem;
    width: 40%;
    cursor: pointer;
    border-radius: 0.5rem;
    background-color: white;
    border: 1px solid gray;
    font-size: 1.1rem;
    box-shadow: 1px 1px 8px 1px gray;
  }
  img {
    width: 100%;
    height: 80%;
    border-bottom: 1px solid gray;
    border-radius: 2rem 2rem 0 0;
  }

  input::-webkit-file-upload-button {
    background-color: rgb(173, 216, 230);
    // background-color: rgba(0, 0, 0, 0.8);
    // color: white;
    display: block;
    font-size: 1.5rem;
    cursor: pointer;
    border: none;
    border-radius: 0.3rem;
    border: 1px solid gray;
    outline: none;
    width: 15rem;
    height: 3rem;
  }
`;
const Info = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-top: 4rem;
  width: 45%;
  gap: 1.4rem;
  align-items: center;
  justify-content: center;
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input,
  textarea {
    font-size: 1.5rem;
    width: 100%;
    height: 5rem;
    border: none;
    outline: none;
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 0.7rem;
    padding: 0 0.8rem;
  }

  div {
    input {
      font-size: 1.5rem;
      width: 100%;
      height: 100%;
      border: none;
      outline: none;
      border: 1px solid rgba(0, 0, 0, 0.3);
      border-radius: 0.7rem;
    }
    height: 3rem;
    width: 100%;
  }
  .option {
    width: 50%;
  }
  select {
    width: 30%;
    // text-align: center;
    height: 2.4rem;
    border: none;
    color: gray;
    outline: none;
    font-size: 1.4rem;
  }

  textarea {
    height: 8rem;
    padding-top: 0.5rem;
  }
  button {
    width: 60%;
    height: 4rem;
    border: none;
    outline: none;
    background-color: rgba(155, 255, 138);
    border-radius: 1rem;
    font-size: 1.5rem;
    cursor: pointer;
    box-shadow: 2px 2px 10px 1px gray;
  }
`;
