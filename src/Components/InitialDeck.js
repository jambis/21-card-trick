import React from "react";

const InitialDeck = ({ imagesArr, setCardPicked }) => {
  const handleClick = () => {
    setCardPicked(true);
  };
  return (
    <>
      {imagesArr.length === 21 ? (
        imagesArr.map(image => <img src={`${image}`} alt="" />)
      ) : (
        <h1>Loading....</h1>
      )}
      <button onClick={handleClick}>Done</button>
    </>
  );
};

export default InitialDeck;
