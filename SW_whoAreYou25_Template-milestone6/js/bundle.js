(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { setupRows } = require("./rows.js");
const { match } = require("./match.js");
const { parse } = require("./parse.js");


function autocomplete(inp, game) {

    let addRow = setupRows(game);

    let players = game.players;

    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    let currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        let a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) {
            return false;
        }
        currentFocus = -2;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < players.length; i++) {

            let matches = match(players[i].name.toUpperCase(), e.target.value.toUpperCase())
            /*check if the item starts with the same letters as the text field value:*/
            let espacios = e.target.value.trim().split(" ").length;
            
            if (matches.length==espacios && players[i].name.toUpperCase().includes(e.target.value.toUpperCase())) {
                let parts = parse(players[i].name.toUpperCase(), matches)

                let izenPrestatua = parts.map(p => {
                    if (p.highlight) {
                        return `<span class='font-bold'>${p.text}</span>`;
                    } else {
                        return `<span>${p.text}</span>`;
                    }
                }).join('');        

                b = document.createElement("DIV");
                b.classList.add('flex', 'items-start', 'gap-x-3', 'leading-tight', 'uppercase', 'text-sm');
                b.innerHTML = `<img src="https://cdn.sportmonks.com/images/soccer/teams/${players[i].teamId % 32}/${players[i].teamId}.png"  width="28" height="28">`;

                /*make the matching letters bold:*/
                b.innerHTML += `<div class='self-center'>
                                    ${izenPrestatua}
                                    <input type='hidden' name='name' value='${players[i].name}'>
                                    <input type='hidden' name='id' value='${players[i].id}'>
                                </div>`;

                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;

                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();

                    addRow(this.getElementsByTagName("input")[1].value)
                });
                a.appendChild(b);
            }
        }
    });

    inp.addEventListener("keydown", function (e) {
        let x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus += 2;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus -= 2;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });

    // players.find ( p => { return p.id == 47323 })

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active", "bg-slate-200", "pointer");
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active", "bg-slate-200", "pointer");
        }
    }

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        let x = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

module.exports = {autocomplete}

},{"./match.js":5,"./parse.js":6,"./rows.js":7}],2:[function(require,module,exports){
const { getStats } = require("./stats.js");

const folder = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="h-6 w-6" name="folder"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>`;
const leftArrow = `<svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" class="h-4 w-4 absolute right-0 -bottom-0.5" name="leftArrowInCircle"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"></path></svg>`;

// YOUR CODE HERE export stringToHTML . Consider to use a single export command instead of one for each const/function
//
const stringToHTML = (str) => {
    var parser = new DOMParser();
    var doc = parser.parseFromString(str, 'text/html');
    return doc.body
};


const higher = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20
20" fill="white" aria-hidden="true" width="25" style="margin-right: -8
px; margin-left: -3px;"><path fill-rule="evenodd" d="M5.293 7.707a1 1
0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1
1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clip-rule="evenodd"
></path></svg>`

const lower = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20
" fill="white" aria-hidden="true" width="25" style="margin-right: -8px
; margin-left: -3px;"><path fill-rule="evenodd" d="M14.707 12.293a1 1
0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586
V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd
"></path></svg>`

let toggle = function(){
        if (document.getElementById("showHide").nextSibling.firstChild.style.display == 'none') {
            document.getElementById("showHide").innerText = "Hide Guess Distribution"
            document.getElementById("showHide").nextSibling.firstChild.style.display = 'block'
        }else {
            document.getElementById("showHide").innerText = "Show Guess Distribution"
            document.getElementById("showHide").nextSibling.firstChild.style.display = 'none'
        }
}

let headless = function (inner) {
    return `<div id="headlessui-portal-root">
  <div>
    <div class="fixed z-10 inset-0 overflow-y-auto" id="headlessui-dialog-1" role="dialog" aria-modal="true" aria-labelledby="headlessui-dialog-title-6">
      <div class="flex items-center justify-center min-h-screen py-10 px-2 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" id="headlessui-dialog-overlay-5" aria-hidden="true"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&ZeroWidthSpace;</span>
        ${inner}
      </div>
    </div>
  </div>
</div>`
}

let stats = function() {
    const {totalGames, bestStreak, currentStreak, successRate, gamesFailed, winDistribution} = getStats("gameStats");

    let blocks = `<div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden sh
adow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6 dark:bg-gray-800"><div class="absolute right-4 top-4" id="closedialog"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" class="h-6 w-6 cursor-pointer dark:stroke-white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div><div><div class="text-center"><h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100" id="headlessui-dialog-title-7">Statistics</h3><div class="mt-2"><div class="flex justify-center my-2"><div class="items-center justify-center m-1 w-1/4 dark:text-white"><div class="text-3xl font-bold">${totalGames}</div><div class="text-xs">Total tries</div></div><div class="items-center justify-center m-1 w-1/4 dark:text-white"><div class="text-3xl font-bold">${successRate}%</div><div class="text-xs">Success rate</div></div><div class="items-center justify-center m-1 w-1/4 dark:text-white"><div class="text-3xl font-bold">${currentStreak}</div><div class="text-xs">Current streak</div></div><div class="items-center justify-center m-1 w-1/4 dark:text-white"><div class="text-3xl font-bold">${bestStreak}</div><div class="text-xs">Best streak</div></div></div>
<h4 class="cursor-pointer text-lg leading-6 font-medium text-gray-900 dark:text-gray-100" id="showHide">Show Guess Distribution</h4><div class="columns-1 justify-left m-2 text-sm dark:text-white">`

    let sum = winDistribution.reduce(function (previousValue, currentValue) {
        return previousValue + currentValue;
    });

    blocks += "<div id='guesscontainer' style='display:none'>"
    for(let i=1; i<=8; i++){
        blocks += `<div class="flex justify-left m-1">
                        <div class="items-center justify-center w-2">${i}</div>
                        <div class="rounded-full w-full ml-2">
                            <div class="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 rounded-l-full" style="width: ${Math.ceil(winDistribution[i] / sum * 100) }%;">
                                ${winDistribution[i]}
                            </div>
                        </div>
                    </div>`
        }
    blocks += "</div>"

    blocks += `<div class="mt-2 justify-center items-center space-x-2 dark:text-white">
                    <div>
                        <h5>New footballer:</h5>
                        <span class="text-lg font-medium text-gray-900 dark:text-gray-100" id="nextPlayer"></span>
                    </div>
                   <!-- <button type="button" class="rounded-md border border-transparent shadow-sm px-4 pt-1 pb-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm" tabindex="0"><span class="block text-2xl tracking-wide font-bold leading-7">Share</span>
                   <span class="block text-xs tracking-tight font-light">#HashTag</span></button> -->
               </div>
               <div class="mt-3">
               </div>
               <div class="dark:text-white">
                   <div class="text-lg font-extrabold text-[#b837c6] dark:text-[#ceff27]" style="color: #ceff27">Web Sistemak</div>
                   <div class="text-sm">2025/2026 ikasturteko praktika</div>
               </div>               
               </div></div></div></div>`

    return blocks
}
module.exports = { lower , higher, folder, leftArrow, stringToHTML, stats, toggle, headless};

},{"./stats.js":8}],3:[function(require,module,exports){

async function fetchJSON(what) {
    // YOUR CODE HERE
    return fetch(what)
    .then(r => {
      return r.json();
    })
    .catch(error => {
      console.error('Errorea fitxategia irakurtzean:', error.message);
      return null;
    }); 
}
module.exports = { fetchJSON };

},{}],4:[function(require,module,exports){
const { folder, leftArrow } = require ("./fragments.js");
const { fetchJSON } = require("./loaders.js");
const { autocomplete } = require("./autocomplete.js");

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


      // YOUR CODE HERE
        autocomplete(document.getElementById("myInput"), game)

  }
);

},{"./autocomplete.js":1,"./fragments.js":2,"./loaders.js":3}],5:[function(require,module,exports){
const removeDiacritics = require('remove-accents').remove;

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_special_characters
const specialCharsRegex = /[.*+?^${}()|[\]\\]/g;

// http://www.ecma-international.org/ecma-262/5.1/#sec-15.10.2.6
const wordCharacterRegex = /[a-z0-9_]/i;

const whitespacesRegex = /\s+/;

function escapeRegexCharacters(str) {
  return str.replace(specialCharsRegex, '\\$&');
}

function extend(subject, baseObject) {
  subject = subject || {};
  Object.keys(subject).forEach((key) => {
    baseObject[key] = !!subject[key];
  });
  return baseObject;
}

let match = function(text, query, options) {
  options = extend(options, {
    insideWords: false,
    findAllOccurrences: false,
    requireMatchAll: false
  });

  const cleanedTextArray = Array.from(text).map((x) => removeDiacritics(x));
  let cleanedText = cleanedTextArray.join('');

  query = removeDiacritics(query);

  return (
    query
      .trim()
      .split(whitespacesRegex)
      // If query is blank, we'll get empty string here, so let's filter it out.
      .filter((word) => word.length > 0)
      .reduce((result, word) => {
        const wordLen = word.length;
        const prefix =
          !options.insideWords && wordCharacterRegex.test(word[0]) ? '\\b' : '';
        const regex = new RegExp(prefix + escapeRegexCharacters(word), 'i');
        let occurrence;
        let index;

        occurrence = regex.exec(cleanedText);
        if (options.requireMatchAll && occurrence === null) {
          cleanedText = '';
          return [];
        }

        while (occurrence) {
          index = occurrence.index;

          const cleanedLength = cleanedTextArray
            .slice(index, index + wordLen)
            .join('').length;
          const offset = wordLen - cleanedLength;

          const initialOffset =
            index - cleanedTextArray.slice(0, index).join('').length;

          const indexes = [
            index + initialOffset,
            index + wordLen + initialOffset + offset
          ];

          if (indexes[0] !== indexes[1]) {
            result.push(indexes);
          }

          // Replace what we just found with spaces so we don't find it again.
          cleanedText =
            cleanedText.slice(0, index) +
            new Array(wordLen + 1).join(' ') +
            cleanedText.slice(index + wordLen);

          if (!options.findAllOccurrences) {
            break;
          }

          occurrence = regex.exec(cleanedText);
        }

        return result;
      }, [])
      .sort((match1, match2) => match1[0] - match2[0])
  );
};
module.exports = {match}

},{"remove-accents":9}],6:[function(require,module,exports){

let parse = function (text, matches) {
  const result = [];

  if (matches.length === 0) {
    result.push({
      text,
      highlight: false
    });
  } else if (matches[0][0] > 0) {
    result.push({
      text: text.slice(0, matches[0][0]),
      highlight: false
    });
  }

  matches.forEach((match, i) => {
    const startIndex = match[0];
    const endIndex = match[1];

    result.push({
      text: text.slice(startIndex, endIndex),
      highlight: true
    });

    if (i === matches.length - 1) {
      if (endIndex < text.length) {
        result.push({
          text: text.slice(endIndex, text.length),
          highlight: false
        });
      }
    } else if (endIndex < matches[i + 1][0]) {
      result.push({
        text: text.slice(endIndex, matches[i + 1][0]),
        highlight: false
      });
    }
  });

  return result;
};
module.exports = {parse}
},{}],7:[function(require,module,exports){
// YOUR CODE HERE :  
// .... stringToHTML ....
// .... setupRows .....
// .... initState ....
//
const { stringToHTML, higher, lower, stats, toggle, headless } = require("./fragments.js");
const { initState, updateStats } = require("./stats.js");

// From: https://stackoverflow.com/a/7254108/243532
function pad(a, b){
    return(1e15 + a + '').slice(-b);
}


const delay = 350;
const attribs = ['nationality', 'leagueId', 'teamId', 'position', 'birthdate']
const leaguesId = {"564": "es1", "8": "en1", "82": "de1", "384": "it1", "301": "fr1"}


let setupRows = function (game) {


    let [state, updateState] = initState('WAYgameState', game.solution.id)


    function leagueToFlag(leagueId) {
        // YOUR CODE HERE
        return leaguesId[leagueId]

    }


    function getAge(dateString) {
        // YOUR CODE HERE
        let data = new Date(dateString)
        let gaur = new Date()
        let urteKop = gaur.getFullYear() - data.getFullYear()
        let hilKop = gaur.getMonth() - data.getMonth()
        if (hilKop < 0 || (hilKop === 0 && gaur.getDate() < data.getDate())) {
            urteKop--;
        }
        return urteKop
    }
    
    let check = function (theKey, theValue) {
            // YOUR CODE HERE
        if(theKey === "birthdate"){
            let urteKopSaiakera = getAge(theValue)
            let urteKopZuzena = getAge(game.solution[theKey])
            if(urteKopSaiakera === urteKopZuzena) return 'correct'
            else if(urteKopSaiakera > urteKopZuzena) return 'lower'
            else return 'higher'
        } else if(typeof theValue === "number"){
            let zenbakiZuzena = game.solution[theKey]
            if(theValue === zenbakiZuzena) return 'correct'
            else if(theValue > zenbakiZuzena) return 'lower'
            else return 'higher'
        } else{
            let emaitzaZuzena = game.solution[theKey]
            if(theValue === emaitzaZuzena) return 'correct'
            else return 'incorrect'
        }
    }

        function unblur(outcome) {
        return new Promise( (resolve, reject) =>  {
            setTimeout(() => {
                document.getElementById("mistery").classList.remove("hue-rotate-180", "blur")
                document.getElementById("combobox").remove()
                let color, text
                if (outcome=='success'){
                    color =  "bg-blue-500"
                    text = "Awesome"
                } else {
                    color =  "bg-rose-500"
                    text = "The player was " + game.solution.name
                }
                document.getElementById("picbox").innerHTML += `<div class="animate-pulse fixed z-20 top-14 left-1/2 transform -translate-x-1/2 max-w-sm shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${color} text-white"><div class="p-4"><p class="text-sm text-center font-medium">${text}</p></div></div>`
                resolve();
            }, "2000")
        })
    }

    function success(){
        unblur('success')
        showStats("4000")
    }

    function gameOver(){
        unblur('gameOver')
        showStats("4000")
    }

    function showStats(timeout) {
        return new Promise( (resolve, reject) =>  {
            setTimeout(() => {
                document.body.appendChild(stringToHTML(headless(stats())));
                document.getElementById("showHide").onclick = toggle;
                bindClose();
                resolve();
            }, timeout)
        })
    }

    function bindClose() {
        document.getElementById("closedialog").onclick = function () {
            document.body.removeChild(document.body.lastChild)
            document.getElementById("mistery").classList.remove("hue-rotate-180", "blur")
        }
    }


    function setContent(guess) {
        let gezi
        if(check("birthdate", guess.birthdate) == 'correct') gezi=''
        else if(check("birthdate", guess.birthdate) == 'lower') gezi=lower
        else gezi=higher
                
        return [
            `<img src="https://playfootball.games/media/nations/${guess.nationality.toLowerCase()}.svg" alt="" style="width: 60%;">`,
            `<img src="https://playfootball.games/media/competitions/${leagueToFlag(guess.leagueId)}.png" alt="" style="width: 60%;">`,
            `<img src="https://cdn.sportmonks.com/images/soccer/teams/${guess.teamId % 32}/${guess.teamId}.png" alt="" style="width: 60%;">`,
            `${guess.position}`,
            `${getAge(guess.birthdate)} ${gezi}` /* YOUR CODE HERE */
        ]
    }

    function showContent(content, guess) {
        let fragments = '', s = '';
        for (let j = 0; j < content.length; j++) {
            s = "".concat(((j + 1) * delay).toString(), "ms")
            fragments += `<div class="w-1/5 shrink-0 flex justify-center ">
                            <div class="mx-1 overflow-hidden w-full max-w-2 shadowed font-bold text-xl flex aspect-square rounded-full justify-center items-center bg-slate-400 text-white ${check(attribs[j], guess[attribs[j]]) == 'correct' ? 'bg-green-500' : ''} opacity-0 fadeInDown" style="max-width: 60px; animation-delay: ${s};">
                                ${content[j]}
                            </div>
                         </div>`
        }

        let child = `<div class="flex w-full flex-wrap text-l py-2">
                        <div class=" w-full grow text-center pb-2">
                            <div class="mx-1 overflow-hidden h-full flex items-center justify-center sm:text-right px-4 uppercase font-bold text-lg opacity-0 fadeInDown " style="animation-delay: 0ms;">
                                ${guess.name}
                            </div>
                        </div>
                        ${fragments}`

        let playersNode = document.getElementById('players')
        playersNode.prepend(stringToHTML(child))
    }


    function resetInput(){
        let myInput = document.getElementById("myInput")
        myInput.value=""
        myInput.placeholder=`Guess ${game.guesses.length+1} of 8`

    }

    let getPlayer = function (playerId) {
        // YOUR CODE HERE   
        return game.players.filter(player => player.id == playerId)[0]
    }


    function gameEnded(lastGuess){
        // YOUR CODE HERE
        if(lastGuess == game.solution.id || game.guesses.length == 8) return true
        else return false
    }

    function timeToNewPlayer(){
        const nextPlayer = document.getElementById("nextPlayer");
        
        const orain = new Date();
        const egunBuk = new Date();
        egunBuk.setHours(23, 59, 59, 999);
        const dif = egunBuk - orain;

        const orduak = Math.floor(dif / (1000 * 60 * 60));
        const minutuak = Math.floor((dif % (1000 * 60 * 60)) / (1000 * 60));
        const segunduak = Math.floor((dif % (1000 * 60)) / 1000);

        const h = String(orduak).padStart(2, "0");
        const m = String(minutuak).padStart(2, "0");
        const s = String(segunduak).padStart(2, "0");

        nextPlayer.textContent = `${h}:${m}:${s}`;
    }

    resetInput();

    return /* addRow */ function (playerId) {

        let guess = getPlayer(playerId)
        console.log(guess)

        let content = setContent(guess)

        game.guesses.push(playerId)
        updateState(playerId)

        resetInput();

         if (gameEnded(playerId)) {

            if (playerId == game.solution.id) {
                updateStats(game.guesses.length);
                success();
            }

            else if (game.guesses.length == 8) { 
                updateStats(9);
                gameOver();
            }
                  setTimeout(()=>setInterval(timeToNewPlayer,"1000"), "3000")


         }


        showContent(content, guess)
    }
}
module.exports = {setupRows}

},{"./fragments.js":2,"./stats.js":8}],8:[function(require,module,exports){


let initState = function(what, solutionId) { 
    // YOUR CODE HERE
    let state = JSON.parse(localStorage.getItem(what))
    if(state==null) state = { "guesses": [], "solution": solutionId}   
    let funtzioa_anonimoa = function(guess){
        state.guesses.push(guess);
        localStorage.setItem(what, JSON.stringify(state));
    }
    return [state, funtzioa_anonimoa]
}

function successRate (e){
    // YOUR CODE HERE
    return e.successRate
}

let getStats = function(what) {
    // YOUR CODE HERE
    let stats = JSON.parse(localStorage.getItem(what))
    if(stats==null) stats = {winDistribution: [0,0,0,0,0,0,0,0,0], gamesFailed: 0, 
                            currentStreak: 0, bestStreak: 0, totalGames: 0, successRate: 0}
    return stats
};


function updateStats(t){
    gamestats.totalGames=gamestats.totalGames+1
    gamestats.winDistribution[t-1]=gamestats.winDistribution[t-1]+1
    if(t<9){
        gamestats.currentStreak=gamestats.currentStreak+1
        if(gamestats.currentStreak>gamestats.bestStreak) gamestats.bestStreak=gamestats.currentStreak
    }else{
        gamestats.gamesFailed=gamestats.gamesFailed+1
        gamestats.currentStreak=0
    }
    gamestats.successRate=Math.round(((gamestats.totalGames-gamestats.gamesFailed)/gamestats.totalGames)*100)
    localStorage.setItem('gameStats', JSON.stringify(gamestats));
};


let gamestats = getStats('gameStats');

module.exports = {updateStats, getStats, initState}

},{}],9:[function(require,module,exports){
var characterMap = {
	"À": "A",
	"Á": "A",
	"Â": "A",
	"Ã": "A",
	"Ä": "A",
	"Å": "A",
	"Ấ": "A",
	"Ắ": "A",
	"Ẳ": "A",
	"Ẵ": "A",
	"Ặ": "A",
	"Æ": "AE",
	"Ầ": "A",
	"Ằ": "A",
	"Ȃ": "A",
	"Ả": "A",
	"Ạ": "A",
	"Ẩ": "A",
	"Ẫ": "A",
	"Ậ": "A",
	"Ç": "C",
	"Ḉ": "C",
	"È": "E",
	"É": "E",
	"Ê": "E",
	"Ë": "E",
	"Ế": "E",
	"Ḗ": "E",
	"Ề": "E",
	"Ḕ": "E",
	"Ḝ": "E",
	"Ȇ": "E",
	"Ẻ": "E",
	"Ẽ": "E",
	"Ẹ": "E",
	"Ể": "E",
	"Ễ": "E",
	"Ệ": "E",
	"Ì": "I",
	"Í": "I",
	"Î": "I",
	"Ï": "I",
	"Ḯ": "I",
	"Ȋ": "I",
	"Ỉ": "I",
	"Ị": "I",
	"Ð": "D",
	"Ñ": "N",
	"Ò": "O",
	"Ó": "O",
	"Ô": "O",
	"Õ": "O",
	"Ö": "O",
	"Ø": "O",
	"Ố": "O",
	"Ṍ": "O",
	"Ṓ": "O",
	"Ȏ": "O",
	"Ỏ": "O",
	"Ọ": "O",
	"Ổ": "O",
	"Ỗ": "O",
	"Ộ": "O",
	"Ờ": "O",
	"Ở": "O",
	"Ỡ": "O",
	"Ớ": "O",
	"Ợ": "O",
	"Ù": "U",
	"Ú": "U",
	"Û": "U",
	"Ü": "U",
	"Ủ": "U",
	"Ụ": "U",
	"Ử": "U",
	"Ữ": "U",
	"Ự": "U",
	"Ý": "Y",
	"à": "a",
	"á": "a",
	"â": "a",
	"ã": "a",
	"ä": "a",
	"å": "a",
	"ấ": "a",
	"ắ": "a",
	"ẳ": "a",
	"ẵ": "a",
	"ặ": "a",
	"æ": "ae",
	"ầ": "a",
	"ằ": "a",
	"ȃ": "a",
	"ả": "a",
	"ạ": "a",
	"ẩ": "a",
	"ẫ": "a",
	"ậ": "a",
	"ç": "c",
	"ḉ": "c",
	"è": "e",
	"é": "e",
	"ê": "e",
	"ë": "e",
	"ế": "e",
	"ḗ": "e",
	"ề": "e",
	"ḕ": "e",
	"ḝ": "e",
	"ȇ": "e",
	"ẻ": "e",
	"ẽ": "e",
	"ẹ": "e",
	"ể": "e",
	"ễ": "e",
	"ệ": "e",
	"ì": "i",
	"í": "i",
	"î": "i",
	"ï": "i",
	"ḯ": "i",
	"ȋ": "i",
	"ỉ": "i",
	"ị": "i",
	"ð": "d",
	"ñ": "n",
	"ò": "o",
	"ó": "o",
	"ô": "o",
	"õ": "o",
	"ö": "o",
	"ø": "o",
	"ố": "o",
	"ṍ": "o",
	"ṓ": "o",
	"ȏ": "o",
	"ỏ": "o",
	"ọ": "o",
	"ổ": "o",
	"ỗ": "o",
	"ộ": "o",
	"ờ": "o",
	"ở": "o",
	"ỡ": "o",
	"ớ": "o",
	"ợ": "o",
	"ù": "u",
	"ú": "u",
	"û": "u",
	"ü": "u",
	"ủ": "u",
	"ụ": "u",
	"ử": "u",
	"ữ": "u",
	"ự": "u",
	"ý": "y",
	"ÿ": "y",
	"Ā": "A",
	"ā": "a",
	"Ă": "A",
	"ă": "a",
	"Ą": "A",
	"ą": "a",
	"Ć": "C",
	"ć": "c",
	"Ĉ": "C",
	"ĉ": "c",
	"Ċ": "C",
	"ċ": "c",
	"Č": "C",
	"č": "c",
	"C̆": "C",
	"c̆": "c",
	"Ď": "D",
	"ď": "d",
	"Đ": "D",
	"đ": "d",
	"Ē": "E",
	"ē": "e",
	"Ĕ": "E",
	"ĕ": "e",
	"Ė": "E",
	"ė": "e",
	"Ę": "E",
	"ę": "e",
	"Ě": "E",
	"ě": "e",
	"Ĝ": "G",
	"Ǵ": "G",
	"ĝ": "g",
	"ǵ": "g",
	"Ğ": "G",
	"ğ": "g",
	"Ġ": "G",
	"ġ": "g",
	"Ģ": "G",
	"ģ": "g",
	"Ĥ": "H",
	"ĥ": "h",
	"Ħ": "H",
	"ħ": "h",
	"Ḫ": "H",
	"ḫ": "h",
	"Ĩ": "I",
	"ĩ": "i",
	"Ī": "I",
	"ī": "i",
	"Ĭ": "I",
	"ĭ": "i",
	"Į": "I",
	"į": "i",
	"İ": "I",
	"ı": "i",
	"Ĳ": "IJ",
	"ĳ": "ij",
	"Ĵ": "J",
	"ĵ": "j",
	"Ķ": "K",
	"ķ": "k",
	"Ḱ": "K",
	"ḱ": "k",
	"K̆": "K",
	"k̆": "k",
	"Ĺ": "L",
	"ĺ": "l",
	"Ļ": "L",
	"ļ": "l",
	"Ľ": "L",
	"ľ": "l",
	"Ŀ": "L",
	"ŀ": "l",
	"Ł": "l",
	"ł": "l",
	"Ḿ": "M",
	"ḿ": "m",
	"M̆": "M",
	"m̆": "m",
	"Ń": "N",
	"ń": "n",
	"Ņ": "N",
	"ņ": "n",
	"Ň": "N",
	"ň": "n",
	"ŉ": "n",
	"N̆": "N",
	"n̆": "n",
	"Ō": "O",
	"ō": "o",
	"Ŏ": "O",
	"ŏ": "o",
	"Ő": "O",
	"ő": "o",
	"Œ": "OE",
	"œ": "oe",
	"P̆": "P",
	"p̆": "p",
	"Ŕ": "R",
	"ŕ": "r",
	"Ŗ": "R",
	"ŗ": "r",
	"Ř": "R",
	"ř": "r",
	"R̆": "R",
	"r̆": "r",
	"Ȓ": "R",
	"ȓ": "r",
	"Ś": "S",
	"ś": "s",
	"Ŝ": "S",
	"ŝ": "s",
	"Ş": "S",
	"Ș": "S",
	"ș": "s",
	"ş": "s",
	"Š": "S",
	"š": "s",
	"Ţ": "T",
	"ţ": "t",
	"ț": "t",
	"Ț": "T",
	"Ť": "T",
	"ť": "t",
	"Ŧ": "T",
	"ŧ": "t",
	"T̆": "T",
	"t̆": "t",
	"Ũ": "U",
	"ũ": "u",
	"Ū": "U",
	"ū": "u",
	"Ŭ": "U",
	"ŭ": "u",
	"Ů": "U",
	"ů": "u",
	"Ű": "U",
	"ű": "u",
	"Ų": "U",
	"ų": "u",
	"Ȗ": "U",
	"ȗ": "u",
	"V̆": "V",
	"v̆": "v",
	"Ŵ": "W",
	"ŵ": "w",
	"Ẃ": "W",
	"ẃ": "w",
	"X̆": "X",
	"x̆": "x",
	"Ŷ": "Y",
	"ŷ": "y",
	"Ÿ": "Y",
	"Y̆": "Y",
	"y̆": "y",
	"Ź": "Z",
	"ź": "z",
	"Ż": "Z",
	"ż": "z",
	"Ž": "Z",
	"ž": "z",
	"ſ": "s",
	"ƒ": "f",
	"Ơ": "O",
	"ơ": "o",
	"Ư": "U",
	"ư": "u",
	"Ǎ": "A",
	"ǎ": "a",
	"Ǐ": "I",
	"ǐ": "i",
	"Ǒ": "O",
	"ǒ": "o",
	"Ǔ": "U",
	"ǔ": "u",
	"Ǖ": "U",
	"ǖ": "u",
	"Ǘ": "U",
	"ǘ": "u",
	"Ǚ": "U",
	"ǚ": "u",
	"Ǜ": "U",
	"ǜ": "u",
	"Ứ": "U",
	"ứ": "u",
	"Ṹ": "U",
	"ṹ": "u",
	"Ǻ": "A",
	"ǻ": "a",
	"Ǽ": "AE",
	"ǽ": "ae",
	"Ǿ": "O",
	"ǿ": "o",
	"Þ": "TH",
	"þ": "th",
	"Ṕ": "P",
	"ṕ": "p",
	"Ṥ": "S",
	"ṥ": "s",
	"X́": "X",
	"x́": "x",
	"Ѓ": "Г",
	"ѓ": "г",
	"Ќ": "К",
	"ќ": "к",
	"A̋": "A",
	"a̋": "a",
	"E̋": "E",
	"e̋": "e",
	"I̋": "I",
	"i̋": "i",
	"Ǹ": "N",
	"ǹ": "n",
	"Ồ": "O",
	"ồ": "o",
	"Ṑ": "O",
	"ṑ": "o",
	"Ừ": "U",
	"ừ": "u",
	"Ẁ": "W",
	"ẁ": "w",
	"Ỳ": "Y",
	"ỳ": "y",
	"Ȁ": "A",
	"ȁ": "a",
	"Ȅ": "E",
	"ȅ": "e",
	"Ȉ": "I",
	"ȉ": "i",
	"Ȍ": "O",
	"ȍ": "o",
	"Ȑ": "R",
	"ȑ": "r",
	"Ȕ": "U",
	"ȕ": "u",
	"B̌": "B",
	"b̌": "b",
	"Č̣": "C",
	"č̣": "c",
	"Ê̌": "E",
	"ê̌": "e",
	"F̌": "F",
	"f̌": "f",
	"Ǧ": "G",
	"ǧ": "g",
	"Ȟ": "H",
	"ȟ": "h",
	"J̌": "J",
	"ǰ": "j",
	"Ǩ": "K",
	"ǩ": "k",
	"M̌": "M",
	"m̌": "m",
	"P̌": "P",
	"p̌": "p",
	"Q̌": "Q",
	"q̌": "q",
	"Ř̩": "R",
	"ř̩": "r",
	"Ṧ": "S",
	"ṧ": "s",
	"V̌": "V",
	"v̌": "v",
	"W̌": "W",
	"w̌": "w",
	"X̌": "X",
	"x̌": "x",
	"Y̌": "Y",
	"y̌": "y",
	"A̧": "A",
	"a̧": "a",
	"B̧": "B",
	"b̧": "b",
	"Ḑ": "D",
	"ḑ": "d",
	"Ȩ": "E",
	"ȩ": "e",
	"Ɛ̧": "E",
	"ɛ̧": "e",
	"Ḩ": "H",
	"ḩ": "h",
	"I̧": "I",
	"i̧": "i",
	"Ɨ̧": "I",
	"ɨ̧": "i",
	"M̧": "M",
	"m̧": "m",
	"O̧": "O",
	"o̧": "o",
	"Q̧": "Q",
	"q̧": "q",
	"U̧": "U",
	"u̧": "u",
	"X̧": "X",
	"x̧": "x",
	"Z̧": "Z",
	"z̧": "z",
	"й":"и",
	"Й":"И",
	"ё":"е",
	"Ё":"Е",
};

var chars = Object.keys(characterMap).join('|');
var allAccents = new RegExp(chars, 'g');
var firstAccent = new RegExp(chars, '');

function matcher(match) {
	return characterMap[match];
}

var removeAccents = function(string) {
	return string.replace(allAccents, matcher);
};

var hasAccents = function(string) {
	return !!string.match(firstAccent);
};

module.exports = removeAccents;
module.exports.has = hasAccents;
module.exports.remove = removeAccents;

},{}]},{},[4]);
