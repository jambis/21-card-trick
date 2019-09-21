import React, { useState, useEffect } from "react";
import axios from "axios";
import InitialDeck from "./Components/InitialDeck";
import ThreePiles from "./Components/ThreePiles";

function App() {
  const [newDeck, setNewDeck] = useState(null); //Initial Deck containing 52 shuffled cards
  const [cardsArr, setCardsArr] = useState([]); //Array Containing 21 Card codes
  const [imagesArr, setImagesArr] = useState([]); //Array Containing 21 Card images
  const [shortDeck, setShortDeck] = useState(null); //New shuffled deck containing only 21 cards
  const [cardPicked, setCardPicked] = useState(false); //Has user picked a card

  useEffect(() => {
    axios
      .get("https://deckofcardsapi.com/api/deck/new/shuffle/")
      .then(res => {
        setNewDeck(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (newDeck) {
      axios
        .get(
          `https://deckofcardsapi.com/api/deck/${newDeck.deck_id}/draw/?count=21`
        )
        .then(res => {
          res.data.cards.forEach(element => {
            setCardsArr(codes => [...codes, element.code]);
            setImagesArr(images => [...images, element.image]);
          });
        })
        .catch(err => console.error(err));
    }
  }, [newDeck]);

  useEffect(() => {
    if (cardsArr.length === 21) {
      axios
        .get(
          `https://deckofcardsapi.com/api/deck/new/shuffle/?cards=${cardsArr.join(
            ","
          )}`
        )
        .then(res => setShortDeck(res.data))
        .catch(err => console.error(err));
    }
  }, [cardsArr]);

  if (shortDeck) {
    axios
      .get(
        `https://deckofcardsapi.com/api/deck/${shortDeck.deck_id}/draw/?count=1`
      )
      .then(res => {
        //console.log(res.data);
        axios
          .get(
            `https://deckofcardsapi.com/api/deck/${shortDeck.deck_id}/pile/pile1/add/?cards=${res.data.cards[0].code}`
          )
          .then(res => console.log(res.data));
      })
      .catch(err => console.error(err));
  }

  return (
    <div className="App">
      {!cardPicked ? (
        <InitialDeck imagesArr={imagesArr} setCardPicked={setCardPicked} />
      ) : (
        <ThreePiles />
      )}
    </div>
  );
}

export default App;
