import React, { useState, useEffect } from "react";
import axios from "axios";
import Pile from "./Pile";

const ThreePiles = ({ deckID }) => {
  const [cardsRemaining, setCardsRemaining] = useState(21);
  const [pilePicked, setPilePicked] = useState(null);
  const [repNumber, setRepNumber] = useState(3);
  const [finalCard, setFinalCard] = useState(null);
  const [images, setImages] = useState({
    0: [],
    1: [],
    2: []
  });

  const corsURL = "https://cors-anywhere.herokuapp.com/";
  const baseURL = `${corsURL}https://deckofcardsapi.com/api/deck`;

  //Draw 3 cards at a time from total pile and each into a
  //different pile (pile0, pile1, pile2)
  //Do that until remaining cards in the total pile is 0
  useEffect(() => {
    if (cardsRemaining > 0 && repNumber > 0) {
      console.log("Drawing 21 cards splitting into 3 piles");
      axios
        .get(`${baseURL}/${deckID}/pile/total/draw/?count=3`)
        .then(res => {
          setCardsRemaining(res.data.piles.total.remaining);
          res.data.cards.map((el, index) =>
            axios
              .get(
                `${baseURL}/${deckID}/pile/pile${index}/add/?cards=${el.code}`
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
  }, [deckID, cardsRemaining, repNumber]);

  //Once a pile is picked we draw all the cards from the piles 0-2
  //and put them back into the total pile, while making sure that
  //the pile that was picked gets place in the middle
  useEffect(() => {
    const piles = Object.keys(images);

    if (pilePicked !== null) {
      axios
        .get(
          `${baseURL}/${deckID}/pile/pile${
            piles.filter(n => n !== pilePicked)[0]
          }/draw/?count=7`
        )
        .then(res =>
          axios
            .get(
              `${baseURL}/${deckID}/pile/total/add/?cards=${res.data.cards
                .map(el => el.code)
                .join(",")}`
            )
            .then(res =>
              axios
                .get(
                  `${baseURL}/${deckID}/pile/pile${
                    piles.filter(n => n === pilePicked)[0]
                  }/draw/bottom/?count=7`
                )
                .then(res =>
                  axios
                    .get(
                      `${baseURL}/${deckID}/pile/total/add/?cards=${res.data.cards
                        .map(el => el.code)
                        .join(",")}`
                    )
                    .then(res =>
                      axios
                        .get(
                          `${baseURL}/${deckID}/pile/pile${
                            piles.filter(n => n !== pilePicked).reverse()[0]
                          }/draw/?count=7`
                        )
                        .then(res =>
                          axios
                            .get(
                              `${baseURL}/${deckID}/pile/total/add/?cards=${res.data.cards
                                .map(el => el.code)
                                .join(",")}`
                            )
                            .then(res => {
                              setCardsRemaining(res.data.piles.total.remaining);
                              setImages({
                                0: [],
                                1: [],
                                2: []
                              });
                            })
                            .catch(err => console.error(err))
                        )
                        .catch(err => console.error(err))
                    )
                    .catch(err => console.err(err))
                )
                .catch(err => console.error(err))
            )
            .catch(err => console.error(err))
        )
        .catch(err => console.error(err));
    }
  }, [pilePicked]);

  //User has picked a pile 3 times, now we draw 11 cards from
  //the total pile and reveal to the user the card
  useEffect(() => {
    if (repNumber === 0 && cardsRemaining === 21) {
      axios
        .get(`${baseURL}/${deckID}/pile/total/draw/?count=11`)
        .then(res => setFinalCard(res.data.cards[0].image))
        .catch(err => console.error(err));
    }
  }, [repNumber, cardsRemaining]);

  return (
    <div>
      {finalCard ? (
        <img src={finalCard} alt="" />
      ) : (
        <>
          <Pile
            pile={0}
            images={images[0]}
            setRepNumber={setRepNumber}
            setPilePicked={setPilePicked}
          />
          <Pile
            pile={1}
            images={images[1]}
            setRepNumber={setRepNumber}
            setPilePicked={setPilePicked}
          />
          <Pile
            pile={2}
            images={images[2]}
            setRepNumber={setRepNumber}
            setPilePicked={setPilePicked}
          />
        </>
      )}
    </div>
  );
};

export default ThreePiles;
