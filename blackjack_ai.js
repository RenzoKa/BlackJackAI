//conectando com o html ⬇

const lang = navigator.language || navigator.userLanguage;
const messageDiv = document.getElementById("message");
const availableCardsDiv = document.getElementById("available_cards");
const house = document.getElementById("house");
const house_score = document.getElementById("house_score");
const player = document.getElementById("player");
const player_score = document.getElementById("player_score");
const cards = document.querySelectorAll(".card");
const reset = document.getElementById("reset");
const hitChanceContainer = document.getElementById("hit_chance_container");
const hitChance = document.getElementById("hit_chance");
const dialog = document.getElementById("dialog");

let cardsOBJ = {
    "CA": "A",
    "C2": 2,
    "C3": 3,
    "C4": 4,
    "C5": 5,
    "C6": 6,
    "C7": 7,
    "C8": 8,
    "C9": 9,
    "C10": 10,
    "CJ": 10,
    "CQ": 10,
    "CK": 10,
    "OA": "A",
    "O2": 2,
    "O3": 3,
    "O4": 4,
    "O5": 5,
    "O6": 6,
    "O7": 7,
    "O8": 8,
    "O9": 9,
    "O10": 10,
    "OJ": 10,
    "OQ": 10,
    "OK": 10,
    "EA": "A",
    "E2": 2,
    "E3": 3,
    "E4": 4,
    "E5": 5,
    "E6": 6,
    "E7": 7,
    "E8": 8,
    "E9": 9,
    "E10": 10,
    "EJ": 10,
    "EQ": 10,
    "EK": 10,
    "PA": "A",
    "P2": 2,
    "P3": 3,
    "P4": 4,
    "P5": 5,
    "P6": 6,
    "P7": 7,
    "P8": 8,
    "P9": 9,
    "P10": 10,
    "PJ": 10,
    "PQ": 10,
    "PK": 10,
    }

let dealerHand = {};

let playerHand = {};

//transformar as cartas em botôes adicionaveis
for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", function() {addCard(this);});
};

const cardValueToKey = cardValue => {
    const suitMap = {
        "♠": "C",
        "♥": "E",
        "♣": "P",
        "♦": "O"
    };
    const value = cardValue.slice(0, -1);
    const suit = cardValue.slice(-1);
    return suitMap[suit] + value;
}

//arrow function (função definida por seta ao inves de function...) ⬇

const handValue = hand => {
    let value = 0;
    for (let card in hand) {
        value += hand[card] === "A" && value + 11 <= 21 ? 11 : hand[card] === "A" ? 1 : hand[card];
    }
    console.log(value);
};

const bestMove = (playerHand, dealerCard, deck, cardsDealt) => {};

const getCardNumericValue = card => {
    let value = cardsOBJ[card];
    if (value === "A") return 11;
    return Number(value);
}

const calculateHandValue = hand => {
    let values = Object.keys(hand).map(getCardNumericValue)
    let total = values.reduce((a, b) => a + b, 0);
    let acesCount = values.filter(v => v === 11).length;
    while (total > 21 && acesCount > 0) {
        total -= 10;
        acesCount--;
    }
    return total;
};

const updateScores = () => {
    house_score.textContent = calculateHandValue(dealerHand);
    player_score.textContent = calculateHandValue(playerHand);
};

const getRemainingCards = () => {
    return Object.keys(cardsOBJ).filter(cardKey =>
        !(cardKey in dealerHand) && !(cardKey in playerHand)
    );
}

const calculateHitChance = () => {
    const currentScore = calculateHandValue(playerHand);
    const remainingCards = getRemainingCards();
    let safeCards = 0;

    for (let cardKey of remainingCards) {
        let cardValue = cardsOBJ[cardKey];
        let value = cardValue === "A" ? 11 : Number(cardValue);
        let total = currentScore + value;
        if (cardValue === "A" && total > 21) total = currentScore + 1;
        if (total <= 21) safeCards++;
    }

    const chance = remainingCards.length > 0 ? safeCards / remainingCards.length : 0
    return chance;
}

const updateHitChanceDisplay = () => {
    const currentScore = calculateHandValue(playerHand);
    const remainingCards = getRemainingCards();
    let safeCards = 0;

    for (let cardKey of remainingCards) {
        let cardValue = cardsOBJ[cardKey];
        let value = cardValue === "A" ? 11 : Number(cardValue);
        let total = currentScore + value;
        if (cardValue === "A" && total > 21) total = currentScore + 1;
        if (total <= 21) safeCards++;
    }

    const chance = remainingCards.length > 0 ? safeCards / remainingCards.length : 0;
    hitChance.innerHTML = `${(chance * 100).toFixed(1)}%`;

    dialog.innerHTML = `
        <div style="font-size: 22px; color: black;">
            ${safeCards} / ${remainingCards.length} = ${(chance * 100).toFixed(1)}%
        </div>
    `;
}

const addCard = (card) => {
    const cardValue = card.getAttribute("data-value");
    const cardKey = cardValueToKey(cardValue);

    console.log(cardValue);
    if (Object.keys(dealerHand).length < 2) {
        messageDiv.innerText = "One more";
        dealerHand[cardKey] = cardsOBJ[cardKey];
        house.innerHTML += `<div class="card" data-value="${cardValue}">${cardValue}</div>`;
        availableCardsDiv.removeChild(card);
    } else {
        messageDiv.innerText = "Pick the cards for the player";
        playerHand[cardKey] = cardsOBJ[cardKey];
        player.innerHTML += `<div class="card" data-value="${cardValue}">${cardValue}</div>`;
        availableCardsDiv.removeChild(card);
    }
    updateScores();
    updateHitChanceDisplay();
};

const resetGame = () => {cardsOBJ = {
    "CA": "A",
    "C2": 2,
    "C3": 3,
    "C4": 4,
    "C5": 5,
    "C6": 6,
    "C7": 7,
    "C8": 8,
    "C9": 9,
    "C10": 10,
    "CJ": 10,
    "CQ": 10,
    "CK": 10,
    "OA": "A",
    "O2": 2,
    "O3": 3,
    "O4": 4,
    "O5": 5,
    "O6": 6,
    "O7": 7,
    "O8": 8,
    "O9": 9,
    "O10": 10,
    "OJ": 10,
    "OQ": 10,
    "OK": 10,
    "EA": "A",
    "E2": 2,
    "E3": 3,
    "E4": 4,
    "E5": 5,
    "E6": 6,
    "E7": 7,
    "E8": 8,
    "E9": 9,
    "E10": 10,
    "EJ": 10,
    "EQ": 10,
    "EK": 10,
    "PA": "A",
    "P2": 2,
    "P3": 3,
    "P4": 4,
    "P5": 5,
    "P6": 6,
    "P7": 7,
    "P8": 8,
    "P9": 9,
    "P10": 10,
    "PJ": 10,
    "PQ": 10,
    "PK": 10,
    }
    dealerHand = {};
    playerHand = {};
    house.innerHTML = "";
    player.innerHTML = "";
    updateScores();
    updateHitChanceDisplay();
};

reset.addEventListener("click", () => {resetGame();});

const explanationDialog = () => {
    dialog.showModal();
};

hitChanceContainer.addEventListener("click", () => {explanationDialog();});

dialog.addEventListener("click", () => {
    if (event.target === dialog) {
        dialog.close();
    }
});

console.log();