import * as React from 'react'
import { getGameHeadline, getTeamSchedule } from './game'

const conferences = [
    {
        id: "1",
        name: "Atlantic Coast Conference",
        shortName: "ACC",
        hasChampionship: true,
        hasDivisions: true,
    },
    {
        id: "151",
        name: "American Athletic Conference",
        shortName: "AAC",
        hasChampionship: true,
        hasDivisions: false,
    },
    {
        id: "4",
        name: "Big 12",
        shortName: "Big 12",
        hasChampionship: true,
        hasDivisions: false,
    },
    {
        id: "5",
        name: "Big Ten",
        shortName: "B10",
        hasChampionship: true,
        hasDivisions: true,
    },
    {
        id: "12",
        name: "Conference USA",
        shortName: "C-USA",
        hasChampionship: true,
        hasDivisions: true,
    },
    {
        id: "18",
        name: "FBS Independent",
        shortName: "Independent",
        hasChampionship: false,
        hasDivisions: false,
    },
    {
        id: "15",
        name: "Mid-American Conference",
        shortName: "MAC",
        hasChampionship: true,
        hasDivisions: true,
    },
    {
        id: "17",
        name: "Mountain West Conference",
        shortName: "Mountain West",
        hasChampionship: true,
        hasDivisions: true,
    },
    {
        id: "9",
        name: "Pac-12",
        shortName: "Pac-12",
        hasChampionship: true,
        hasDivisions: true,
    },
    {
        id: "8",
        name: "Southeastern Conference",
        shortName: "SEC",
        hasChampionship: true,
        hasDivisions: true,
    },
    {
        id: "37",
        name: "Sun Belt",
        shortName: "Sun Belt",
        hasChampionship: true,
        hasDivisions: true,
    },
];

const dataExpirations = {
    'team': 60 * 60 * 2, // 2 hours
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
    return new Promise((resolve, reject) => {
        const localData = require( '/src/data/league-data.json')
        resolve(JSON.parse(JSON.stringify(localData)))
    })
}

/**
 * Returns Date.now() into a string that can be compared against a game date string from the ESPN API
 */
const dateToESPNISO = () => {
    return new Date( Date.now() ).toISOString().slice(0,-8) + 'Z'
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

const getTeamBonusPoints = async team => {
    // console.log(team)
    // Get team's schedule
    const schedule = await getTeamSchedule( { teamID: team.id } )

    // Setup some variables
    let bonusPoints = 0

    // Loop through games
    schedule.map( game => {
        // Get the game headline
        const headline = getGameHeadline( game?.competitions[0] );
        
        // Look for conference championship game in notes
        if ( '' !== headline && headline?.toLowerCase().indexOf( 'championship' , 0 ) >= 0 ) {
            // console.log( `${team.displayName} in championship: ${headline}`)
            // Get the conference for this championship game.
            const thisConference = conferences.find( conference => {
                if ( conference.id === team.groups.id || ( ! team.groups.isConference && conference.id === team.groups.parent.id ) ) {
                    return conference;
                }
            })

            // If this team is in a conference that has divisions and they were in
            // a conference champ game, add division winner bonus points (+1)
            if ( thisConference.hasDivisions ) {
                // console.log( 'awarding division champ bonus' )
                bonusPoints += 1;
            }
            
            // If this team was in a conference champ game and won, add conf champ bonus points (+2)
            const winner = game.competitions[0].competitors.find( team => team?.winner )
            if ( winner?.id === team.id ) {
                // console.log( `awarding conf champ bonus for ${team.id}` )
                bonusPoints += 1;
            }
            // console.log(thisConference, winner.id, game, team)
        }

        // Look for CFP semifinals in notes
        if ( '' !== headline && headline?.toLowerCase().indexOf( 'semifinal' , 0 ) >= 0 ) {
            // console.log( `${team.displayName} in CFP: ${headline}`)
            // If this team was in a semifinal game, add playoff points(+2)
            // console.log( 'awarding CFP appearance bonus' )
            bonusPoints += 2;

            const winner = game.competitions[0].competitors.find( team => team?.winner )
            if ( winner?.id === team.id ) {
                // console.log( `awarding CFP win bonus for ${team.id}` )
                bonusPoints += 2;
            }
        }

        if ( '' !== headline && headline?.toLowerCase().indexOf( 'final' , 0 ) >= 0 ) {
            // console.log( `${team.displayName} in CFP: ${headline}`)

            // If this team won the final cfp game, add nat champ points(+4)
            const winner = game.competitions[0].competitors.find( team => team?.winner )
            if ( winner?.id === team.id ) {
                // console.log( `awarding CFP national championship bonus for ${team.id}` )
                bonusPoints += 3;
            }
        }
    });

    return bonusPoints;
}

const getTotalRosterPoints = (teams) => {
    const rosterPoints = teams.reduce( async (totalPoints, team) => {
        let pointsToAdd = 0;
        await getTeamData(team)
        .then( async team => {
            pointsToAdd += getTeamWins(team)
            pointsToAdd += await getTeamBonusPoints(team)
        })

        return await totalPoints + pointsToAdd 
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

        // The user is likely already built out with their league data - return
        if ( user.points ) {
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

const shortenConferenceName = ( text ) => {
    const conferenceToReplace = conferences.filter( conference => {
        const nameToCheck = conference.name.toLowerCase();
        const stringToCheck = text.toLowerCase();
        return stringToCheck.includes( nameToCheck );
    });
    
    const conference = conferenceToReplace[0];

    if ( ! conference ) {
        // Nothing to replace.
        return text;
    }
    
    // replace as-is
    text = text.replace( conference.name, conference.shortName )
    
    // replace uppercase
    text = text.replace( conference.name.toUpperCase(), conference.shortName.toUpperCase() )

    // replace lowercase
    text = text.replace( conference.name.toLowerCase(), conference.shortName.toLowerCase() )

    return text;
}



function useSafeDispatch(dispatch) {
    const mounted = React.useRef(false)
    React.useLayoutEffect(() => {
      mounted.current = true
      return () => (mounted.current = false)
    }, [])
    return React.useCallback(
      (...args) => (mounted.current ? dispatch(...args) : void 0),
      [dispatch],
    )
}

const defaultInitialState = {status: 'idle', data: null, error: null}
function useAsync(initialState) {
  const initialStateRef = React.useRef({
    ...defaultInitialState,
    ...initialState,
  })
  const [{status, data, error}, setState] = React.useReducer(
    (s, a) => ({...s, ...a}),
    initialStateRef.current,
  )

  const safeSetState = useSafeDispatch(setState)

  const setData = React.useCallback(
    data => safeSetState({data, status: 'resolved'}),
    [safeSetState],
  )
  const setError = React.useCallback(
    error => safeSetState({error, status: 'rejected'}),
    [safeSetState],
  )
  const reset = React.useCallback(
    () => safeSetState(initialStateRef.current),
    [safeSetState],
  )

  const run = React.useCallback(
    promise => {
      if (!promise || !promise.then) {
        throw new Error(
          `The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?`,
        )
      }
      safeSetState({status: 'pending'})
      return promise.then(
        data => {
          setData(data)
          return data
        },
        error => {
          setError(error)
          return Promise.reject(error)
        },
      )
    },
    [safeSetState, setData, setError],
  )

  return {
    // using the same names that react-query uses for convenience
    isIdle: status === 'idle',
    isLoading: status === 'pending',
    isError: status === 'rejected',
    isSuccess: status === 'resolved',

    setData,
    setError,
    error,
    status,
    data,
    run,
    reset,
  }
}

export {
    getUser,
    getAllUsers,
    sortUsersByPoints,
    getLeague,
    getAllTeamData,
    getTeamData,
    getUserDisplayName,
    getTeamRecord,
    getTeamWins,
    useLocalStorage,
    getTotalRosterPoints,
    getUserLeagueRoster,
    getRankString, 
    getRankedLeagueUsers,
    slugifyText,
    shortenConferenceName,
    useAsync,
    dateToESPNISO,
}
