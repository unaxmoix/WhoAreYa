export {initState}

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



