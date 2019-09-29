import React from "react";

const Header = () => {
  return (
    <div className="Header">
      <div className="HeaderText">
        <p className="pHeader">
          Made by: <a href="https://github.com/jambis/">James Bishop</a>
        </p>
        <a className="aTitle" href="/">
          <h1>
            <span role="img" aria-label="joker card">
              🃏
            </span>
            21 Card Trick
            <span role="img" aria-label="joker card">
              🃏
            </span>
          </h1>
        </a>
        <p className="pHeader">
          Source at:{" "}
          <a href="https://github.com/jambis/21-card-trick">github</a>
        </p>
      </div>
    </div>
  );
};

export default Header;
