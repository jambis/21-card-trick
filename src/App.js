import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [newDeck, setNewDeck] = useState(null);
  useEffect(() => {
    axios
      .get("https://deckofcardsapi.com/api/deck/new/shuffle/")
      .then(res => {
        setNewDeck(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  const [cardsArr, setCardsArr] = useState([]);
  const [imagesArr, setImagesArr] = useState([]);
  useEffect(() => {
    if (newDeck) {
      axios
        .get(
          `https://deckofcardsapi.com/api/deck/${newDeck.deck_id}/draw/?count=21`
        )
        .then(res => {
          res.data.cards.forEach(element => {
            setCardsArr(codes => [...codes, element.code]);
          });
          res.data.cards.forEach(element => {
            setImagesArr(images => [...images, element.image]);
          });
        })
        .catch(err => console.error(err));
    }
  }, [newDeck]);

  const [shortDeck, setShortDeck] = useState(null);
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
      {imagesArr.length === 21 ? (
        imagesArr.map(image => <img src={`${image}`} />)
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
