fetch('premiere.json')
.then(r => r.json())
.then(data => {
    const emaitza1 = data.premiere[0].teams.filter(item => item.name == 'Arsenal FC');
    console.log(emaitza1);

    const emaitza2 = emaitza1[0].squad.map(item => item.name);
    console.log(emaitza2);

    const emaitza3 = emaitza1[0].squad[0];
    console.log(emaitza3);

    const emaitza4 = data;
    emaitza4.premiere[0].teams.forEach(team => {
        team.squad.forEach(player => {
            player.teamId=team.id;
            player.leagueId=2021;
        });
    });
    console.log(emaitza4);

    const emaitza5 = emaitza4;
    emaitza5.premiere[0].teams.forEach(team => {
        team.squad.forEach(player => {
            player.birthDate=player.dateOfBirth;
            delete player.dateOfBirth;
        });
    });
    console.log(emaitza5)

    const emaitza6 = emaitza5;
    emaitza6.premiere[0].teams.forEach(team => {
        team.squad.forEach(player => {
            if(player.position == 'Goalkeeper')
                player['position']='GK';
            else if(['Defence', 'Centre-Back', 'Right-Back', 'Left-Back'].includes(player.position))
                player['position']='DF';
            else if(['Midfield', 'Central Midfield', 'Defensive Midfield', 'Attacking Midfield', 'Left Midfield'].includes(player.position))
                player['position']='MF';
            else if(['Offence', 'Centre-Forward', 'Right Winger', 'Left Winger'].includes(player.position))
                player['position']='FW';
        });
    });
    console.log(emaitza6)
}).catch(error => console.error('Errorea JSON kargatzean:', error));