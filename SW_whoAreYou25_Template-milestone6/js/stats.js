

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
