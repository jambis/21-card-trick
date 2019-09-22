import React, { useState, useEffect } from "react";
import axios from "axios";
import Pile from "./Pile";

const ThreePiles = props => {
  const [cardsRemaining, setCardsRemaining] = useState(21);
  const [images, setImages] = useState({
    0: [],
    1: [],
    2: []
  });

  //Draw 3 cards at a time from total pile and each into a
  //different pile (pile0, pile1, pile2)
  //Do that until remaining cards in the total pile is 0
  useEffect(() => {
    if (cardsRemaining > 0) {
      axios
        .get(
          `https://deckofcardsapi.com/api/deck/${props.deckID}/pile/total/draw/?count=3`
        )
        .then(res => {
          console.log(res.data);
          setCardsRemaining(res.data.piles.total.remaining);
          res.data.cards.map((el, index) =>
            axios
              .get(
                `https://deckofcardsapi.com/api/deck/${props.deckID}/pile/pile${index}/add/?cards=${el.code}`
              )
              .then(res =>
                setImages(obj => ({
                  ...obj,
                  [index]: [...obj[index], el.image]
                }))
              )
              .catch(err => console.error(err))
          );
        })
        .catch(err => console.error(err));
    }
  }, [props, cardsRemaining]);

  return (
    <div>
      <Pile pile={0} images={images[0]} />
      <Pile pile={1} images={images[1]} />
      <Pile pile={2} images={images[2]} />
    </div>
  );
};

export default ThreePiles;
