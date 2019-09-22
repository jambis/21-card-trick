import React from "react";

const Pile = ({ images, setRepNumber, pile, setPilePicked }) => {
  const handleClick = () => {
    setRepNumber(num => num - 1);
    setPilePicked(pile.toString());
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
