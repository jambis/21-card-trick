import React from "react";

const InitialDeck = ({ imagesArr, setCardPicked }) => {
  const handleClick = () => {
    setCardPicked(true);
  };

  //Loop through the 21 card images and display them for user to mentally pick a card.
  return (
    <>
      {imagesArr.length === 21 ? (
        imagesArr.map((image, index) => (
          <img key={index} src={`${image}`} alt="" />
        ))
      ) : (
        <h1>Loading....</h1>
      )}
      <button onClick={handleClick}>Done</button>
    </>
  );
};

export default InitialDeck;
