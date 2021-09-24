/**
 * External Dependencies
 */
import dayjs from 'dayjs'

/**
 * Internal Dependencies
 */
import { espnClient } from './clients'
import { dateToESPNISO } from './utils'

function isGameComplete(event) {
    return event.competitions[0].status.type.completed
}

function getGameTime(dateString) {
    const dateObj = new Date(dateString)
    const returnObj = {
        weekday: dateObj.toLocaleString('en-us',{ weekday: 'long'}),
        dayMonth: dateObj.toLocaleString('en-US',{day: 'numeric',month: 'numeric'}),
        time: dateObj.toLocaleString('en-US',{hour:'numeric', minute: 'numeric'}),
    }

    returnObj.time = returnObj.time !== '12:00 AM' ? returnObj.time : 'TBD'

    return returnObj
}

function getNextOrCurrentGame( teamSchedule, fake = false ) {
    if ( fake ) {
        return fakeGetNextOrCurrentGame();
    }

    // Let's try and keep this week's game around until 5am the following Sunday.
    // Theoretically, this should change to the NEXT Sunday at 5am Sunday after
    // the game happens and will, therefore, show the next week's game.
    let sundayDayJS = dayjs().day(7).startOf('day').hour(5)
    if ( 7 === dayjs().day() && 5 <= dayjs().hour() ) {
        sundayDayJS = sundayDayJS.day(7).add(1,'day')
    }

    return teamSchedule.filter( game => {
        const gameEpoch = Math.floor( Date.parse(game.date) / 1000 );

        // Basically checks to 
        if ( gameEpoch <= sundayDayJS.unix() ) {
            return game
        }
    }).slice(-1)[0]
}

function fakeGetNextOrCurrentGame() {
    console.log('FAKING getNextOrCurrentGame TO IN PROGRESS OSU @ MINN GAME');
    return require('/src/data/example-in-game.json')
}

function gameShouldHaveStarted( gameDate ) {
    // An in-progress game won't have a date. This is fragile - probably need to do something better
    if ( ! gameDate ) {
        return true;
    }
    return gameDate <= dateToESPNISO()
}

function gameInProgress( gameID ) {
    return 'STATUS_IN_PROGRESS' === game.header.competitions.status.type.name
}

function getLiveGameData( gameID, fake = false ) {
    if ( fake ) {
        return new Promise( resolve => {
            resolve( fakeGetNextOrCurrentGame() )
        })
    }

    return fetch(`https://site.api.espn.com/apis/site/v2/sports/football/college-football/summary?event=${gameID}`).then(response => response.json() )
}

async function getTeamSchedule( {teamID} ) {
    const thisYear = new Date( Date.now() ).getFullYear()

    const regularSeason = await espnClient(`teams/${teamID}/schedule?season=${thisYear}&seasontype=2`)
        .then(scheduleData => {
            return scheduleData.events
        })

    // Post Season
    const postSeason = await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/${teamID}/schedule?season=${thisYear}&seasontype=3`)
        .then(response => {
            if ( response.ok) {
                return response.json()
            }
            throw response
        })
        .then(scheduleData => {
            return scheduleData.events
        })

    return [...regularSeason, ...postSeason]
}

export { isGameComplete, getGameTime, getNextOrCurrentGame, getTeamSchedule, gameInProgress, gameShouldHaveStarted, getLiveGameData }