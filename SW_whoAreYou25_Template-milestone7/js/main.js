const { folder, leftArrow } = require ("./fragments.js");
const { fetchJSON } = require("./loaders.js");
const { autocomplete } = require("./autocomplete.js");
const { setupRows } = require("./rows.js");


function differenceInDays(date1) {
    // YOUR CODE HERE
    const difMs = new Date() - new Date(date1);
    const difDays = Math.floor(difMs / (1000 * 60 * 60 * 24));
    return difDays;
}

let difference_In_Days = differenceInDays(new Date("01-10-2025"));

window.onload = function () {
  document.getElementById( "gamenumber").innerText = difference_In_Days.toString();
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

    let egunekoEgoera

    function egoeraHasieratu(){
      const d = new Date();
      const data = { year: d.getFullYear(), month: d.getMonth(), day: d.getDate() };
      egunekoEgoera = { "data": data, "guesses": [], "irabazi": false}
      localStorage.setItem("egunekoEgoera", JSON.stringify(egunekoEgoera));
      let state = JSON.parse(localStorage.getItem("WAYgameState"))
      state = { "guesses": [], "solution": game.solution}
      localStorage.setItem("WAYgameState", JSON.stringify(state))
    }
    
    const gaur = new Date();
    egunekoEgoera = JSON.parse(localStorage.getItem("egunekoEgoera"))
    if(egunekoEgoera==null || egunekoEgoera.data.year != gaur.getFullYear() || egunekoEgoera.data.month != gaur.getMonth() || egunekoEgoera.data.day != gaur.getDate()){
      egoeraHasieratu()
      console.log("ADI! egunekoEgoera hasieratu da!")
    }
    
    game.guesses = egunekoEgoera.guesses
    
    setupRows(game)
    console.log(game.guesses)
    game.guesses.forEach((g) => setupRows.showContent(setupRows.setContent(setupRows.getPlayer(g)), setupRows.getPlayer(g)))

    if(egunekoEgoera.guesses.length <= 8 && egunekoEgoera.irabazi){
      setupRows.success()
      setupRows.deituInterval()
    } else if(egunekoEgoera.guesses.length == 8 && !egunekoEgoera.irabazi){
      setupRows.gameOver()
      setupRows.deituInterval()
    }
    autocomplete(document.getElementById("myInput"), game)

  }
);
