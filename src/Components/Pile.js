import React from "react";

const Pile = props => {
  const handleClick = () => {};

  return (
    <div onClick={handleClick}>
      {props.images
        ? props.images.map((image, index) => (
            <img key={index} alt="" src={image} />
          ))
        : null}
    </div>
  );
};

export default Pile;
