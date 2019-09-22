import React from "react";

const Pile = ({ images, setRepNumber, pile, setPilePicked }) => {
  const handleClick = () => {
    setRepNumber(num => num - 1); //Decrease number of repetitions left by 1
    setPilePicked(pile.toString()); //Set which pile was picked
  };

  return (
    <div onClick={handleClick}>
      {images
        ? images.map((image, index) => <img key={index} alt="" src={image} />)
        : null}
    </div>
  );
};

export default Pile;
