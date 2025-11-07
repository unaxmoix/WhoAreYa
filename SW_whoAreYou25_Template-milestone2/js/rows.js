// YOUR CODE HERE :  
// .... stringToHTML ....
import { stringToHTML } from "./fragments.js";

// .... setupRows .....

const delay = 350;
const attribs = ['nationality', 'leagueId', 'teamId', 'position', 'birthdate']
const leaguesId = {"564": "es1", "8": "en1", "82": "de1", "384": "it1", "301": "fr1"}


export let setupRows = function (game) {


    function leagueToFlag(leagueId) {
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

    function setContent(guess) {
        return [
            `<img src="https://playfootball.games/media/nations/${guess.nationality.toLowerCase()}.svg" alt="" style="width: 60%;">`,
            `<img src="https://playfootball.games/media/competitions/${leagueToFlag(guess.leagueId)}.png" alt="" style="width: 60%;">`,
            `<img src="https://cdn.sportmonks.com/images/soccer/teams/${guess.teamId % 32}/${guess.teamId}.png" alt="" style="width: 60%;">`,
            `${guess.position}`,
            `${getAge(guess.birthdate)}`
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

    let getPlayer = function (playerId) {
        return game.players.filter(player => player.id == playerId)[0]
    }

    return /* addRow */ function (playerId) {

        let guess = getPlayer(playerId)
        console.log(guess)

        let content = setContent(guess)
        showContent(content, guess)
    }
}
