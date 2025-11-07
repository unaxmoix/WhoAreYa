import { folder, leftArrow } from "./fragments.js";
import { fetchJSON } from "./loaders.js";
import { setupRows } from "./rows.js";


function differenceInDays(date1) {
    // YOUR CODE HERE
    const difMs = new Date() - new Date(date1);
    const difDays = Math.floor(difMs / (1000 * 60 * 60 * 24));
    return difDays;
}

let difference_In_Days = differenceInDays(new Date("01-10-2025"));

window.onload = function () {
  document.getElementById("gamenumber").innerText = difference_In_Days.toString();
  document.getElementById("back-icon").innerHTML = folder + leftArrow;
};

let game = {
  guesses: [],
  solution: {},
  players: [],
  leagues: []
};

function getSolution(players, solutionArray, difference_In_Days) {
    // YOUR CODE HERE
    const index = (difference_In_Days - 1) % solutionArray.length;
    return players.filter(p => p.id == solutionArray[index])[0]; 
}

Promise.all([fetchJSON('json/fullplayers25.json'), fetchJSON("json/solution25.json")]).then(
  (values) => {

    let solution;
    
    [game.players, solution] = values;

    game.solution = getSolution(game.players, solution, difference_In_Days);
    
    console.log(game.solution);

    document.getElementById("mistery").src = `https://playfootball.games/media/players/${game.solution.id % 32}/${game.solution.id}.png`;


    // YOUR CODE HERE
    let addRow = setupRows(game);
    // get myInput object...
    let saiakera = document.getElementById("myInput")
    // when the user types a number an press the Enter key:
    saiakera.addEventListener("keydown", (event)=>{
      if (event.key === "Enter") {
        //let jokalari = game.players.filter(player=> player.id === saiakera.value)[0]
        console.log(saiakera.value)
        addRow(saiakera.value);
      }
    })     
  }
);
