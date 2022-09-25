import React from "react";
import styled from "styled-components";
const Footer = () => {
  return (
    <Container>
      <Contact>
        <h3>Contact us</h3>

        <p>
          <b>Email</b> : kapilsoni54768161@gmail.com
        </p>
      </Contact>
      <Socials>
        <h3>Socials</h3>
        <div>
          <a href="https://www.instagram.com" target="blank">
            <img src="instagram.png" alt="" />
          </a>
          <a href="https://www.discord.com" target="blank">
            <img src="discord.png" alt="" />
          </a>
        </div>
      </Socials>
    </Container>
  );
};

export default Footer;
const Container = styled.div`
  margin-top: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rem;
  height: 10rem;
  box-shadow: -1px -1px 8px 1px gray;
`;

const Contact = styled.div`
  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;
  gap: 2rem;
  h3 {
    font-size: 1.7rem;
    text-decoration: underline;
    font-weight: 500;
    text-shadow: 1px 1px 1px gray;
  }
`;
const Socials = styled.div`
  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;
  gap: 1rem;
  div {
    display: flex;
    gap: 1rem;
  }

  h3 {
    font-size: 1.7rem;
    text-decoration: underline;
    font-weight: 500;
    text-shadow: 1px 1px 1px gray;
  }
  img {
    width: 2rem;
    height: 2rem;
  }
`;
