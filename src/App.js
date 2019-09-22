import React, { useState, useEffect } from "react";
import axios from "axios";
import InitialDeck from "./Components/InitialDeck";
import ThreePiles from "./Components/ThreePiles";

function App() {
  const [newDeck, setNewDeck] = useState(null); //Initial Deck containing 52 shuffled cards
  const [cardsArr, setCardsArr] = useState([]); //Array Containing 21 Card codes
  const [imagesArr, setImagesArr] = useState([]); //Array Containing 21 Card images
  const [shortDeck, setShortDeck] = useState(null); //New shuffled deck containing only 21 cards
  const [cardPicked, setCardPicked] = useState(false); //Has user picked a card?

  const corsURL = "https://cors-anywhere.herokuapp.com/";
  const baseURL = `${corsURL}https://deckofcardsapi.com/api/deck`;

  //Get initial shuffled deck (get initial deck id) of 52 cards
  useEffect(() => {
    axios
      .get(`${baseURL}/new/shuffle/`)
      .then(res => {
        setNewDeck(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  //Draw 21 cards from the initial deck
  useEffect(() => {
    if (newDeck) {
      axios
        .get(`${baseURL}/${newDeck.deck_id}/draw/?count=21`)
        .then(res => {
          res.data.cards.forEach(element => {
            setCardsArr(codes => [...codes, element.code]);
            setImagesArr(images => [...images, element.image]);
          });
        })
        .catch(err => console.error(err));
    }
  }, [newDeck]);

  //Create a new deck (new deck id) with only 21 cards
  useEffect(() => {
    if (cardsArr.length === 21) {
      axios
        .get(`${baseURL}/new/shuffle/?cards=${cardsArr.join(",")}`)
        .then(res => setShortDeck(res.data))
        .catch(err => console.error(err));
    }
  }, [cardsArr]);

  //Draw all 21 cards from new deck and put them in a pile called total
  useEffect(() => {
    if (shortDeck) {
      axios
        .get(`${baseURL}/${shortDeck.deck_id}/draw/?count=21`)
        .then(res =>
          axios
            .get(
              `${baseURL}/${
                shortDeck.deck_id
              }/pile/total/add/?cards=${res.data.cards
                .map(el => el.code)
                .join(",")}`
            )
            .then()
            .catch(err => console.error(err))
        )
        .catch(err => console.error(err));
    }
  }, [shortDeck]);

  return (
    <div className="App">
      {!cardPicked ? (
        <InitialDeck imagesArr={imagesArr} setCardPicked={setCardPicked} />
      ) : (
        <ThreePiles deckID={shortDeck.deck_id} />
      )}
    </div>
  );
}

export default App;
