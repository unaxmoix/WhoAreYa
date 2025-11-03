fetch('competitions.json')
.then(r => r.json())
.then(data => {
    const emaitza = data.competitions.filter(item => item.plan == 'TIER_ONE' && ['ESP', 'ENG', 'ITA', 'FRA'].includes(item.area.code) && ['Primera Division', 'Ligue 1', 'Serie A', 'Premier League'].includes(item.name))
    .map(competition => competition.id);
    console.log(emaitza);
}).catch(error => console.error('Errorea JSON kargatzean:', error));