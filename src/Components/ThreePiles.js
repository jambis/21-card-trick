import React, { useState, useEffect } from "react";
import axios from "axios";
import Pile from "./Pile";
import Loader from "./Loader";
import davidblaine from "../images/parodydavidblaine.gif";

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

  //Draw 21 cards at a time from total pile and split into
  //different pile (pile0, pile1, pile2), alternatively
  useEffect(() => {
    if (cardsRemaining > 0 && repNumber > 0) {
      console.log("ran 21 card draw");
      axios
        .get(`${baseURL}/${deckID}/pile/total/draw/?count=21`)
        .then(res => {
          setCardsRemaining(res.data.piles.total.remaining);

          for (let i = 0; i < 3; i++) {
            let cardsToAdd = res.data.cards
              .filter((el, index) => index % 3 === i)
              .map(el => el.code)
              .join(",");
            let imagesToAdd = res.data.cards
              .filter((el, index) => index % 3 === i)
              .map(el => el.image);

            axios
              .get(
                `${baseURL}/${deckID}/pile/pile${i}/add/?cards=${cardsToAdd}`
              )
              .then(res => {
                setImages(obj => ({
                  ...obj,
                  [i]: imagesToAdd
                }));
              })
              .catch(err => console.error(err));
          }
        })
        .catch(err => console.error(err));
    }
  }, [deckID, cardsRemaining, repNumber, baseURL]);

  //Once a pile is picked we draw all the cards from the piles 0-2
  //and put them back into the total pile, while making sure that
  //the pile that was picked gets place in the middle
  useEffect(() => {
    const piles = Object.keys(images);

    if (pilePicked !== null) {
      console.log("ran 6 promise callback hell card draw");
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

      return setPilePicked(null);
    }
  }, [pilePicked, baseURL, deckID]);

  //User has picked a pile 3 times, now we draw 11 cards from
  //the total pile and reveal to the user the card
  useEffect(() => {
    if (repNumber === 0 && cardsRemaining === 21) {
      axios
        .get(`${baseURL}/${deckID}/pile/total/draw/?count=11`)
        .then(res => {
          setFinalCard(res.data.cards[0].image);
        })
        .catch(err => console.error(err));
    }
  }, [repNumber, cardsRemaining, baseURL, deckID]);

  const renderPiles = () => {
    return (
      <>
        {renderText()}
        {images[2].length > 0 ? (
          <>
            <Pile
              pile={0}
              images={images[0]}
              setRepNumber={setRepNumber}
              setPilePicked={setPilePicked}
              setImages={setImages}
            />
            <Pile
              pile={1}
              images={images[1]}
              setRepNumber={setRepNumber}
              setPilePicked={setPilePicked}
              setImages={setImages}
            />
            <Pile
              pile={2}
              images={images[2]}
              setRepNumber={setRepNumber}
              setPilePicked={setPilePicked}
              setImages={setImages}
            />
          </>
        ) : (
          <Loader />
        )}
      </>
    );
  };

  const renderText = () => {
    return (
      <>
        {repNumber === 3 ? (
          <p>
            Let's start building a connection to your card...
            <br />
            which pile is your card in?{" "}
          </p>
        ) : repNumber === 2 ? (
          <p>
            I'm starting to build a better connection to your card...
            <br />
            which pile is your card in?
          </p>
        ) : (
          <p>OK one last time tell me which pile is your card in?</p>
        )}
      </>
    );
  };

  const renderFinalCard = () => {
    return (
      <>
        <p>Is this your card?</p>
        <img src={finalCard} alt="" />
        <br />
        <img src={davidblaine} alt="parody of david blaine" />
        <p>
          <a href="/">Try Again?</a>
        </p>
      </>
    );
  };

  //If finalCard is set then reveal otherwise show the 3 piles
  return (
    <div style={{ textAlign: "center" }}>
      {finalCard ? renderFinalCard() : renderPiles()}
    </div>
  );
};

export default ThreePiles;
