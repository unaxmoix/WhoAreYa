export { fetchJSON };

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
