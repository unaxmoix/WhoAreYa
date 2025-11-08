// YOUR CODE HERE :  
// .... stringToHTML ....
// .... setupRows .....
// .... initState ....
//
import { stringToHTML } from "./fragments.js";
import { higher, lower } from "./fragments.js";
import { initState } from "./stats.js";

const delay = 350;
const attribs = ['nationality', 'leagueId', 'teamId', 'position', 'birthdate']
const leaguesId = {"564": "es1", "8": "en1", "82": "de1", "384": "it1", "301": "fr1"}


export let setupRows = function (game) {


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
    }

    function gameOver(){
        unblur('gameOver')
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
        // YOUR CODE HERE
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


    resetInput();

    return /* addRow */ function (playerId) {

        let guess = getPlayer(playerId)
        console.log(guess)

        let content = setContent(guess)

        game.guesses.push(playerId)
        updateState(playerId)

        resetInput();

         if (gameEnded(playerId)) {
            // updateStats(game.guesses.length);

            if (playerId == game.solution.id) {
                success();
            }

            if (game.guesses.length == 8) {
                gameOver();
            }
         }


        showContent(content, guess)
    }
}
