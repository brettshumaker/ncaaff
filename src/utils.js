const dataExpirations = {
    'team': 60 * 60 * 24, // One day
    'currentUser': 60 * 60 * 24 * 5 // 5 days
}

/**
 * Gets or sets a value from local storage
 */
const useLocalStorage = ({key, value = null}) => {
    if ( value === null && ! isLocalStorageStale(key) ) {
        return JSON.parse(localStorage.getItem(key)).data
    } else {
        localStorage.setItem(key, JSON.stringify({dataSetAt: getCurrentTimestamp(), data: value}))
        return value
    }
}

const getCurrentTimestamp = () => Math.floor(Date.now()/1000)

const isLocalStorageStale = key => {
    const keyToTrack = Object.keys(dataExpirations).find(dataKey => key.startsWith(dataKey))

    if ( ! keyToTrack ) {
        return false
    }
    
    const keySetAt = JSON.parse(localStorage.getItem(key))?.dataSetAt
    
    if ( keySetAt + dataExpirations[keyToTrack] > getCurrentTimestamp() ) {
        return false
    }

    return true
}

/**
 * Load our local json file
 */
const getLocalJSON = async () => {
    return await fetch('/src/data/league-data.json'
        ,{
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }})
        .then(function(response){
            return response.json();
        })
}

/**
 * Get data for a single team
 */
async function getTeamData(team) {
    // If the `team` is already an object, return...I think this should happen anyway
    if ( 'number' !== typeof team ) {
        return team
    }

    if ( useLocalStorage({key: `team-${team}`}) ) {
        return useLocalStorage({key: `team-${team}`})
    }

    return await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/${team}`)
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            throw response
        })
        .then(data => {
            useLocalStorage({key: `team-${team}`, value: data.team})
            return data.team
        })
}

/**
 * Get a team's record
 */
const getTeamRecord = team => {
    return team.record.items[0].summary
}

/**
 * Get the number of wins for a team
 */
const getTeamWins = team => {
    return parseInt( getTeamRecord(team).split('-')[0] )
}

const getTotalRosterPoints = (teams) => {
    const rosterPoints = teams.reduce( async (totalPoints, team) => {
        let winsToAdd = 0;
        await getTeamData(team)
        .then(team => {
            winsToAdd += getTeamWins(team)
        })

        return await totalPoints + winsToAdd
    },0)

    return rosterPoints
}

const sortUsersByPoints = users => {
    return users.sort((a,b) => a.points > b.points ? -1 : 1)
}

const getRankString = (rank, isTied = false) => {
    const lastDigit = parseInt(rank.toString()[rank.toString().length - 1])
    const tiedString = isTied ? 'T-' : ''

    switch( rank ) {
        case 11:
        case 12:
        case 13:
            return `${tiedString}${rank}th`
    }

    switch( lastDigit ) {
        case 1:
            return `${tiedString}${rank}st`
        case 2:
            return `${tiedString}${rank}nd`
        case 3:
            return `${tiedString}${rank}rd`
        default:
            return `${tiedString}${rank}th`
    }
}

const getTies = users => {
    const scoreCounts = users.reduce( (allScores, user) => {
        if ( ! allScores.find( el => el.score === user.points) ) {
            allScores.push({
            score: user.points,
            count: 0
            })
        }

        allScores.find( el => el.score === user.points).count++
        return allScores
    },[])

    return scoreCounts.reduce((ties, score) => {
        if ( score.count > 1 ) {
            ties.push(score)
        }

        return ties
    },[])
}

const getRankedLeagueUsers = leagueUsers => {
    let thisRank = 1;
    let tieCount = 0;
    const ties = getTies(leagueUsers)

    return sortUsersByPoints(leagueUsers).map( (user, index) => {
        const isTied = ties.find(tie => user.points === tie.score)

        // If there's no tie with this score, the rank is correct. Set it and return.
        if ( ! isTied ) {
            user.rank = getRankString( thisRank )
            thisRank++
            return user
        }

        // Increment the tieCount counter.
        tieCount++

        // Set the user's rank.
        user.rank = getRankString( thisRank, true )

        // If the number of ties we've counted matches the number of ties for this score,
        // increment the rank by the tie counter and then reset the tie counter.
        if ( tieCount === isTied.count ) {
            thisRank += tieCount
            tieCount = 0
        }

        return user
    })
}

/**
 * Get data for a list of teams
 */
const getAllTeamData = async teams => {
    // Make the array unique so we're not fetching the same team data more than once.
    teams = [...new Set(teams)]
    const results = await Promise.all(
        teams.map( team => getTeamData(team) )
    )
    return results
}

/**
 * Get a roster for a particular user from a particular league.
 */
const getUserLeagueRoster = async (userID, leagueID) => {
    const theLeague = await getLeague(leagueID)
    const theRoster = theLeague?.users.filter( roster => userID === roster.id ).shift()
    
    if ( ! theRoster ) {
        throw new Error(`No roster found for ${userID} in league ${leagueID}.`)
    }

    // Fill out team data
    const rosterWithFullTeamData = await getAllTeamData( theRoster.roster)
    theRoster.roster = rosterWithFullTeamData

    return theRoster
}

const getAllUsers = async () => {
    return await getLocalJSON().then(function(data) {
        return data.users
    })
}

/**
 * Get data for a particular user, and their roster if leagueID is passed.
 */
const getUser = async ({userID, leagueID = null}) => {
    return getLocalJSON().then(function(data) {
        const userData = data.users.filter( user => {
            return userID === user.id
        }).shift()

        if ( ! userData ) {
            throw new Error(`User ID ${userID} not found.`)
        }

        return userData
    })
    .then( userPromise => {
        return userPromise
    })
    .then(user => {
        // If leagueID is not set, go ahead and just return the user.
        if ( ! leagueID ) {
            return user
        }

        return getUserLeagueRoster(userID, leagueID)
        .then( rosterPromise => rosterPromise)
        .then( roster => {
            user.roster = roster
            return roster
        }).then( async roster => {
             // Now get the user's total wins for this league
             user.points = await getTotalRosterPoints(roster.roster)
            return user
        })
        .catch(error => {
            throw new Error(error)
        })
    })
    .catch( error => {
        console.log(`got an error: ${error}`)
        return error
    })
}

/**
 * Get data for a particular league.
 * @returns leagueData object
 */
const getLeague = async id => {
    return getLocalJSON().then(function(data) {
        const leagueData = data.leagues.filter( league => {
            return id === league.id
        }).shift()

        if ( ! leagueData ) {
            throw new Error(`League ID ${id} does not exist.`)
        }
        return leagueData;
    })
    .catch(error => {
        throw new Error(error)
    })
}

const getUserDisplayName = ({user}) => {
    return user.name.display !== '' ? user.name.display : `${user.name.first ?? ''} ${user.name.last ?? ''}`.trim()
}

const slugifyText = (text) => {
    return text.replace(/\s+/g, '-').toLowerCase()
}

export {getUser, getAllUsers, sortUsersByPoints, getLeague, getAllTeamData, getTeamData, getUserDisplayName, getTeamRecord, getTeamWins, useLocalStorage, getTotalRosterPoints, getUserLeagueRoster, getRankString, getRankedLeagueUsers, slugifyText}