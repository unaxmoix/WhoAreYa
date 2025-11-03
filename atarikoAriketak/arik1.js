fetch('competitions.json')
.then(r => r.json())
.then(data => {
    const emaitza = data.competitions.filter(item => item.id == 2014);
    console.log(emaitza);
}).catch(error => console.error('Errorea JSON kargatzean:', error));