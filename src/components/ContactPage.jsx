import React, { useEffect } from "react";
import { useState } from "react";
import "../style.css";

const ContactPage = () => {
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");
  const [Description, setDescription] = useState("");
  const [Message, setMessage] = useState("");
  const subject = "NFT MarketPlace Help";
  useEffect(() => {
    setMessage(`Name : ${Name} 
                Phone : ${Phone}
                Description : ${Description}`);
  }, [Name, Email, Phone, Description]);
  return (
    <>
      <div className="container">
        <span className="big-circle"></span>
        <img src="img/shape.png" className="square" alt="" />
        <div className="form">
          <div className="contact-info">
            <h3 className="title">Let's get in touch</h3>
            <p className="text"></p>

            <div className="info">
              <div className="information">
                <img src="img/location.png" className="icon" alt="" />
                <p>Ganeshnagar ,Bopkhel, PUNE 411031</p>
              </div>
              <div className="information">
                <img src="img/email.png" className="icon" alt="" />
                <p>kapilsoni54768161@gmail.com</p>
              </div>
              <div className="information">
                <img src="img/phone.png" className="icon" alt="" />
                <p>123-456-789</p>
              </div>
            </div>

            <div className="social-media">
              <p>Connect with us :</p>
              <div className="social-icons">
                <a
                  href="https://www.facebook.com/profile.php?id=100018147513505"
                  target="blank"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://twitter.com/kapil54768161" target="blank">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="https://instagram.com/kapilsoni4457/" target="blank">
                  <i className="fab fa-instagram"></i>
                </a>
                <a
                  href="https://www.linkedin.com/in/kapil-soni-2b25981ab/"
                  target="blank"
                >
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="contact-form">
            <span className="circle one"></span>
            <span className="circle two"></span>

            <form action="index.html" autoComplete="off">
              <h3 className="title">Contact us</h3>
              <div className="input-container">
                <input
                  type="text"
                  name="name"
                  className="input"
                  placeholder="Username"
                  value={Name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="input-container">
                <input
                  type="email"
                  name="email"
                  className="input"
                  placeholder="Email"
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-container">
                <input
                  type="tel"
                  name="phone"
                  className="input"
                  placeholder="Phone"
                  value={Phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="input-container textarea">
                <textarea
                  name="message"
                  className="input"
                  placeholder="Message"
                  value={Description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <a
                className="btn"
                href={`mailto:"kapilsoni54768161@gmail.com"?subject=${subject}&body=${Message}`}
              >
                Send
              </a>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
