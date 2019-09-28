import React from "react";
import TweenOne from "rc-tween-one";
import BezierPlugin from "rc-tween-one/lib/plugin/BezierPlugin";
TweenOne.plugins.push(BezierPlugin);

const Pile = ({ images, setRepNumber, pile, setPilePicked, setImages }) => {
  const animation = {
    bezier: {
      type: "thru",
      curviness: 1,
      vars: [{ x: 800, y: 0 }]
    },
    duration: 1000,
    ease: "linear"
  };

  const handleClick = () => {
    setRepNumber(num => num - 1); //Decrease number of repetitions left by 1
    setPilePicked(pile.toString()); //Set which pile was picked
    setImages({
      0: [],
      1: [],
      2: []
    });
  };

  return (
    <div onClick={handleClick} className="piles">
      {images.length > 0
        ? images.map((image, index) => (
            <TweenOne
              animation={{
                ...animation,
                bezier: {
                  ...animation.bezier,
                  vars: [{ x: -400 + 300 * pile, y: -500 + 70 * index }]
                },
                duration: (1000 / 7) * index
              }}
            >
              <img
                key={index}
                alt=""
                src={image}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "500px"
                }}
              />
            </TweenOne>
          ))
        : null}
    </div>
  );
};

export default Pile;
