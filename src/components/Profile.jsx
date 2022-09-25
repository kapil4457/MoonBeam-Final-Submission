import React, { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import OwnedNFT from "./OwnedNFT";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { marketplaceAddress } from "../config";
import NFTMarketplace from "../artifacts/contracts/NFTMarket.sol/NFTMarketplace.json";
import jazzicon from "@metamask/jazzicon";

const Profile = () => {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [address, setAddress] = useState("");
  async function loadNFTs() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const marketplaceContract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    );
    const data = await marketplaceContract.fetchMyNFTs();
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenURI = await marketplaceContract.tokenURI(
          i.tokenId.toString()
        );

        // const meta = await axios.get(tokenURI);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          // image: meta.data.image,
          // tokenURI,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }

  async function fetchAccount() {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const account = accounts[0];
    setAddress(account);
  }

  const avatarRef = useRef();
  useEffect(() => {
    loadNFTs();
    fetchAccount();
    const element = avatarRef.current;
    if (element && address) {
      const addr = address.slice(2, 10);
      const seed = parseInt(addr, 16);
      const icon = jazzicon(400, seed);
      if (element.firstChild) {
        element.removeChild(element.firstChild);
      }
      element.appendChild(icon);
    }
  }, [address]);

  return (
    <>
      <Container>
        <Data>
          <Image ref={avatarRef} />
          <Info>
            <Name>
              <b>Account : </b>
              <p>{address}</p>
            </Name>

            <NFTOwned>
              <b>NFT's Owned : </b>
              <p>{nfts.length}</p>
            </NFTOwned>
          </Info>
        </Data>
      </Container>
      <OwnedNft>
        <Heading>Owned NFT's</Heading>
        {loadingState === "loaded" && !nfts.length ? (
          <div className="no-nft">You Don't Own Any NFT </div>
        ) : (
          <NFTS>
            {nfts.map((eachNFT, i) => {
              return (
                <OwnedNFT
                  name={eachNFT.name}
                  price={eachNFT.price}
                  image={eachNFT.image}
                  key={i}
                  tokenId={eachNFT.tokenId}
                />
              );
            })}
          </NFTS>
        )}
      </OwnedNft>
    </>
  );
};

export default Profile;
const Container = styled.div`
  height: 80vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 3.3rem;
`;

const Data = styled.div`
  width: 80%;
  height: 80%;
  display: flex;
  gap: 5rem;
`;
const Image = styled.div`
  width: 50%;
  border-radius: 5rem 0 0 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  div {
    border-radius: 100%;
  }
`;
const Info = styled.div`
  width: 60%;
  display: flex;
  justify-content: center;
  gap: 1.3rem;
  flex-direction: column;
  div {
    font-size: 2rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    color: gray;
    font-size: 2.5rem;
    b {
      color: black;
    }
  }
`;

const Name = styled.div`
  p {
    font-size: 1.6rem;
  }
`;
const NFTOwned = styled.div``;

const OwnedNft = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 5rem;
  .no-nft {
    width: 100%;
    height: 40vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    color: red;
  }
`;
const Heading = styled.div`
  width: 100%;
  padding-left: 5rem;
  font-size: 3rem;
  font-weight: bold;
  text-decoration: underline;
`;
const NFTS = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 50% 50%;
  grid-row-gap: 4rem;
  justify-items: center;
  align-items: center;
`;
