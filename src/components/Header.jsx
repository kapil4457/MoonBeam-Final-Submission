import React from "react";
import styled from "styled-components";
import { NavLink, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const redirect = () => {
    navigate("/");
  };
  return (
    <Container>
      <Logo onClick={redirect}>
        <img src="logo.png" alt="" />
        <p>NFT Exchange</p>
      </Logo>

      <Menu>
        <NavLink to="/">Explore</NavLink>
        <NavLink to="/create">Create</NavLink>
        <NavLink to="/support">Support</NavLink>
      </Menu>
    </Container>
  );
};

export default Header;

const Container = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  height: 6rem;
  gap: 2rem;
  box-shadow: 2px 2px 20px 4px rgba(0, 0, 0, 0.5);
  overflow-y: hidden;
  margin-bottom: 2rem;
  justify-content: space-between;
  // border-bottom: 1px solid rgba(0, 0, 0, 0.5);
`;
const Logo = styled.div`
  padding-left: 2rem;
  cursor: pointer;
  width: 20%;
  align-items: center;
  display: flex;
  img {
    width: 6rem;
    height: 6rem;
  }
  p {
    font-size: 1.4rem;
    font-family: "Qwitcher Grypen", cursive;
  }
`;
const Menu = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 33%;
  height: 100%;
  a {
    height: 100%;
    text-decoration: none;
    color: black;
    font-size: 1.5rem;
  }
`;
