import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { marketplaceAddress } from "../config";

import NFTMarketplace from "../artifacts/contracts/NFTMarket.sol/NFTMarketplace.json";
const OwnedNFT = (props) => {
  const navigate = useNavigate();
  const [price, setprice] = useState(0);

  async function listNFTForSale() {
    if (!price) {
      window.alert("Please Enter a listing Price");
      return;
    }
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const priceFormatted = ethers.utils.parseUnits(price, "ether");
    let contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    );
    let listingPrice = await contract.getListingPrice();

    listingPrice = listingPrice.toString();
    let transaction = await contract.resellToken(
      props.tokenId,
      priceFormatted,
      {
        value: listingPrice,
      }
    );
    await transaction.wait();

    navigate("/");
  }
  return (
    <Container>
      <Image>
        <img src="temp.jpg" alt="" />
      </Image>
      <Info>
        <div>
          <b>Name : </b> {props.name}
        </div>

        <div>
          <b>Bought For : </b> {props.price} Eth
        </div>
        <div>
          <label htmlFor="">
            <b>List For : </b>
          </label>
          <input type="number" onChange={(e) => setprice(e.target.value)} />
          <button onClick={listNFTForSale}>Resell</button>
        </div>
      </Info>
    </Container>
  );
};

export default OwnedNFT;

const Container = styled.div`
  width: 85%;
  height: 18rem;
  border: 1px solid black;
  border-radius: 1.5rem;
  display: flex;
  position: relative;
  box-shadow: 0.1pc 0.1pc 0.6pc 0.1px;
`;
const Image = styled.div`
  height: 100%;
  width: auto;
  border-right: 1px solid black;
  img {
    width: 100%;
    height: 100%;
    border-radius: 1.5rem 0 0 1.5rem;
  }
`;
const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding-left: 2rem;
  font-size: 1.6rem;
  input {
    width: 10rem;
    border: 0;
    outline: none;
    border-bottom: 1px solid gray;
    font-size: 1.2rem;
    margin-right: 1rem;
  }

  button {
    width: 5rem;
    height: 3rem;
    border: none;
    outline: none;
    background-color: rgba(155, 255, 138);
    border-radius: 5px;
    font-size: 1.3rem;
    font-weight: bold;
    box-shadow: 0.1pc 0.1pc 0.4pc 0.1pc gray;
    cursor: pointer;
  }
`;
