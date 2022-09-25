// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract NFTMarketplace is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;

    uint256 listingPrice = 0.025 ether;
    address payable owner;

    mapping(uint256 => MarketItem) private idToMarketItem;

    struct MarketItem {
      uint256 tokenId;
      address payable seller;
      address payable owner;
      uint256 price;
      bool sold;
    }

    event MarketItemCreated (
      uint256 indexed tokenId,
      address seller,
      address owner,
      uint256 price,
      bool sold
    );

    constructor() ERC721("Metaverse Tokens", "METT") {
      owner = payable(msg.sender);
    }

    /* Updates the listing price of the contract */
    function updateListingPrice(uint _listingPrice) public payable {
      require(owner == msg.sender, "Only marketplace owner can update listing price.");
      listingPrice = _listingPrice;
    }

    /* Returns the listing price of the contract */
    function getListingPrice() public view returns (uint256) {
      return listingPrice;
    }

    /* Mints a token and lists it in the marketplace */
    function createToken(string memory tokenURI, uint256 price) public payable returns (uint) {
      _tokenIds.increment();
      uint256 newTokenId = _tokenIds.current();

      _mint(msg.sender, newTokenId);
      _setTokenURI(newTokenId, tokenURI);
      createMarketItem(newTokenId, price);
      return newTokenId;
    }

    function createMarketItem(
      uint256 tokenId,
      uint256 price
    ) private {
      require(price > 0, "Price must be at least 1 wei");
      // require(msg.value == listingPrice, "Price must be equal to listing price");

      idToMarketItem[tokenId] =  MarketItem(
        tokenId,
        payable(msg.sender),
        payable(address(this)),
        price,
        false
      );

      _transfer(msg.sender, address(this), tokenId);
      emit MarketItemCreated(
        tokenId,
        msg.sender,
        address(this),
        price,
        false
      );
    }

    /* allows someone to resell a token they have purchased */
    function resellToken(uint256 tokenId, uint256 price) public payable {
      require(idToMarketItem[tokenId].owner == msg.sender, "Only item owner can perform this operation");
      // require(msg.value == listingPrice, "Price must be equal to listing price");
      idToMarketItem[tokenId].sold = false;
      idToMarketItem[tokenId].price = price;
      idToMarketItem[tokenId].seller = payable(msg.sender);
      idToMarketItem[tokenId].owner = payable(address(this));
      _itemsSold.decrement();

      _transfer(msg.sender, address(this), tokenId);
    }

    /* Creates the sale of a marketplace item */
    /* Transfers ownership of the item, as well as funds between parties */
    function createMarketSale(
      uint256 tokenId
      ) public payable {
      uint price = idToMarketItem[tokenId].price;
      address seller = idToMarketItem[tokenId].seller;
      require(msg.value == price, "Please submit the asking price in order to complete the purchase");
      idToMarketItem[tokenId].owner = payable(msg.sender);
      idToMarketItem[tokenId].sold = true;
      idToMarketItem[tokenId].seller = payable(address(0));
      _itemsSold.increment();
      _transfer(address(this), msg.sender, tokenId);
      payable(owner).transfer(listingPrice);
      payable(seller).transfer(msg.value);
    }

    /* Returns all unsold market items */
    function fetchMarketItems() public view returns (MarketItem[] memory) {
      uint itemCount = _tokenIds.current();
      uint unsoldItemCount = _tokenIds.current() - _itemsSold.current();
      uint currentIndex = 0;

      MarketItem[] memory items = new MarketItem[](unsoldItemCount);
      for (uint i = 0; i < itemCount; i++) {
        if (idToMarketItem[i + 1].owner == address(this)) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    /* Returns only items that a user has purchased */
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
      uint totalItemCount = _tokenIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].owner == msg.sender) {
          itemCount += 1;
        }
      }

      MarketItem[] memory items = new MarketItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].owner == msg.sender) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    /* Returns only items a user has listed */
    function fetchItemsListed() public view returns (MarketItem[] memory) {
      uint totalItemCount = _tokenIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].seller == msg.sender) {
          itemCount += 1;
        }
      }

      MarketItem[] memory items = new MarketItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].seller == msg.sender) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }
}

// contract NFTMarketplace is ReentrancyGuard {
//       using Counters for Counters.Counter;
//     Counters.Counter private _itemsIds;
//     Counters.Counter private _itemsSold;

//     address payable owner;
//     uint listingPrice = 0.025000000 ether;

//     constructor(){
//       owner = payable(msg.sender);
//     }

//     struct MarketItem{
//       uint itemId;
//       address nftContract;
//       uint256 tokenId;
//       address payable seller;
//       address payable owner;
//       uint256 price;
//       bool sold;

//     }

//     mapping(uint256 =>MarketItem)private idToMarketItem;

//     event MarketItemCreated (
//       uint indexed itemId,
//       address indexed nftContract,
//       uint256 indexed tokenId,
//       address seller,
//       address owner,
//       uint256 price,
//       bool sold
//     );
    

//     function getListingPrice() public view returns (uint256) {
//       return listingPrice;
//     }

//       function createMArketItem(address nftContract , uint256 tokenId , uint256 price) public payable nonReentrant{
//          require(price >0 , "price must be greater Than 1 wei");
//          require(msg.value == listingPrice , "price must be equal to ListingPrice");
         
//          _itemsIds.increment();
//          uint256 itemId = _itemsIds.current();
         
//           idToMarketItem[itemId] =  MarketItem(
//         itemId,
//         nftContract,
//         tokenId,
//         payable(msg.sender),
//         payable(address(0)),
//         price,
//         false
//       );
//       IERC721(nftContract).transferFrom(msg.sender , address(this) ,  tokenId );
//       emit MarketItemCreated(
//         itemId ,
//         nftContract,
//           tokenId,
//           msg.sender,
//           address(0),
//           price,
//           false
//       );
//       }


//       function createMarketSale(
//         address nftContract,
//         uint256 itemId
//       )public payable nonReentrant{
//         uint price = idToMarketItem[itemId].price;
//         uint tokenId = idToMarketItem[itemId].tokenId;
//         require(msg.value ==price , "Please submit the asking price in Order to Complete the purchase");
//         idToMarketItem[itemId].seller.transfer(msg.value);
//         IERC721(nftContract).transferFrom(address(this) , msg.sender , tokenId);
//         idToMarketItem[itemId].owner = payable(msg.sender);
//         idToMarketItem[itemId].sold = true;
//         _itemsSold.increment();
//         payable(owner).transfer(listingPrice);
//       }

//       function fetchMarketItems() public view returns(MarketItem[] memory){
//         uint itemCount = _itemsIds.current();

//         uint unsoldItemsCount = _itemsIds.current() - _itemsSold.current();
//         uint currentIndex = 0;

//         MarketItem[] memory items = new MarketItem[](unsoldItemsCount);
//         for(uint i =0 ; i < itemCount ; i++) {
//           if(idToMarketItem[i+1].owner ==address(0)){
//             uint currentId = idToMarketItem[i+1].itemId;
//             MarketItem storage currentItem = idToMarketItem[currentId];
//             items[currentIndex] = currentItem;
//             currentIndex+=1;
//           }
//         }

//         return  items;
//       }


//       function fetchMyNFTs() public view returns(MarketItem[] memory){
//         uint totalItemCount = _itemsIds.current();
//         uint itemCount =0;
//         uint currentIndex =0;

//         for(uint i = 0 ; i < totalItemCount ; i++) {
//           if(idToMarketItem[i+1].owner ==msg.sender){
//             itemCount +=1;
//           }

//         }

//         MarketItem[] memory items = new MarketItem[](itemCount);
//         for(uint i= 0; i < totalItemCount; i++){
//           if(idToMarketItem[i+1].owner ==msg.sender){
//             uint currentId = idToMarketItem[i+1].itemId;
//             MarketItem storage currentItem = idToMarketItem[currentId];
//             items[currentIndex] = currentItem;
//             currentIndex+=1;
//           }
//         }
//         return items;
//       }


//       function fetchItemsCreated() public view returns (MarketItem[] memory){
//         uint  totalItemCount = _itemsIds.current();
//          uint itemCount =0;
//         uint currentIndex =0;

//           for(uint i = 0 ; i < totalItemCount ; i++) {
//           if(idToMarketItem[i+1].owner ==msg.sender){
//             itemCount +=1;
//           }

//         }


//          MarketItem[] memory items = new MarketItem[](itemCount);
//         for(uint i= 0; i < totalItemCount; i++){
//           if(idToMarketItem[i+1].seller ==msg.sender){
//             uint currentId = idToMarketItem[i+1].itemId;
//             MarketItem storage currentItem = idToMarketItem[currentId];
//             items[currentIndex] = currentItem;
//             currentIndex+=1;
//           }
//         }

//       return items;
//       }

// }