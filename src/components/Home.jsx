import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import HomePageCard from "./HomePageCard";
import { ethers } from "ethers";
import { marketplaceAddress } from "../config";
import NFTMarketplace from "../artifacts/contracts/NFTMarket.sol/NFTMarketplace.json";

const Home = () => {
  useEffect(() => {
    loadNFTs();
  }, []);

  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://moonbase-alpha.public.blastapi.io"
    );
    const contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      provider
    );
    const data = await contract.fetchMarketItems();

    const items = await Promise.all(
      data.map(async (i) => {
        let num = Number(i.tokenId._hex);
        const tokenUri = await contract.tokenURI(num);
        console.log("tokenUri :", tokenUri);
        // const meta = await fetch(tokenUri);
        // console.log(meta);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          // image: meta.data.image,
          // name: meta.data.name,
          // description: meta.data.description,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }

  return (
    <>
      {loadingState === "loaded" ? (
        <Container>
          <Heading>
            <p>Explore</p>
          </Heading>

          {loadingState === "loaded" && !nfts.length ? (
            <div className="no-nft">
              <p>No NFT'S Available</p>
            </div>
          ) : (
            <CardHolder>
              {nfts.map((card, i) => {
                return (
                  <HomePageCard
                    name={card?.name}
                    image={card?.image}
                    description={card?.description}
                    price={card.price}
                    key={i}
                    seller={card.seller}
                    tokenId={card.tokenId}
                  />
                );
              })}
            </CardHolder>
          )}
        </Container>
      ) : (
        <div className="loader">
          {" "}
          <p>Loading ...</p>{" "}
        </div>
      )}
    </>
  );
};

export default Home;

const Container = styled.div`
  width: 100%;
  height: 100%;
  margin-bottom: 5rem;
  .no-nft {
    width: 100%;
    display: flex;
    height: 45vh;
    justify-content: center;
    align-items: center;
    p {
      font-size: 2rem;
      text-decoration: underline;
      color: red;
    }
  }
`;
const Heading = styled.div`
  height: 7rem;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    font-size: 4rem;
    font-weight: 550;
  }
`;

const CardHolder = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  padding-top: 6rem;
  padding-left: 13rem;
  align-items: center;
  place-items: center;
  grid-template-columns: repeat(4, 20%);
  overflow-x: hidden;
  gap: 3rem;
  padding-bottom: 5rem;
`;
