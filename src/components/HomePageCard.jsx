import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import jazzicon from "@metamask/jazzicon";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { marketplaceAddress } from "../config";
import NFTMarketplace from "../artifacts/contracts/NFTMarket.sol/NFTMarketplace.json";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";

const HomePageCard = (props) => {
  const navigate = useNavigate();
  async function buyNft() {
    const web3 = new Web3(window.ethereum);
    const balance = await web3.eth.getBalance(account);
    const walletBalanceInEth =
      Math.round(web3.utils.fromWei(balance) * 1000) / 1000;

    if (walletBalanceInEth <= props.price) {
      alert("InSufficient Balance");
      return;
    }
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    );

    const price = ethers.utils.parseUnits(props.price, "ether");
    const transaction = await contract.createMarketSale(props.tokenId, {
      value: price,
    });
    await transaction.wait();
    navigate("/account");
  }

  //Used to fetch the profile picture of the nft seller
  let account = props.seller;
  const avatarRef = useRef();
  useEffect(() => {
    const element = avatarRef.current;
    if (element && account) {
      const addr = account.slice(2, 10);
      const seed = parseInt(addr, 16);
      const icon = jazzicon(65, seed);
      if (element.firstChild) {
        element.removeChild(element.firstChild);
      }
      element.appendChild(icon);
    }
  }, [account, avatarRef]);
  return (
    <Container>
      <Image>
        <img src="temp.jpg" />
        {/* <img src={props.image} /> */}
      </Image>
      <div ref={avatarRef} className="owner"></div>
      <Heading>
        <div>
          <h3>
            <b>Name : </b>
            {props.name ? props.name : "Name"}
          </h3>
          <h3>
            <b>Price : </b>
            {props.price} DEV
          </h3>
        </div>
        <button onClick={buyNft}>Buy</button>
      </Heading>
    </Container>
  );
};

export default HomePageCard;

const Container = styled.div`
  height: 100%;
  width: 100%;
  border-radius: 1rem;
  box-shadow: 2px 4px 4px 6px gray;
  transition: transform 0.5s;
  position relative;
  


  &:hover {
    transform: scale(1.08);
    box-shadow: 2px 4px 20px 8px gray;
  }
  .owner{
    position absolute;

    bottom:3rem;
    left:0.5rem;
    border-radius:100%;
    border:5px solid white  ;
    box-shadow:1px 1px 5px 1px black;
    display:flex;
    justify-content:center;
    align-items:center;
  }
`;
const Image = styled.div`
  width: 100%;
  height: 80%;
  border-radius: 1rem 1rem 0 0;

  img {
    border-radius: 1rem 1rem 0 0;
    width: 100%;
    height: 100%;
  }
  border-bottom: 1px solid gray;
`;
const Heading = styled.div`
  border-radius: 1rem;
  height: 20%;
  width: 100%;
  display: flex;
  justify-content: right;
  gap: 2.5rem;
  padding-top: 2.5rem;
  padding-right: 1.5rem;
  div {
    display: flex;
    flex-direction: column;
  }
  button {
    height: 50%;
    width: 5rem;
    border-radius: 0.5rem;
    outline: none;
    border: 1px solid gray;
    &:hover {
      cursor: pointer;
    }
  }

  h3 {
    font-size: 1rem;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.7);
  }
`;
