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

    // Get the last completed game
    const lastCompleted = teamSchedule.reduce( ( theLast, game ) => {
        if ( game.competitions[0].status.type.completed ) {
            return game;
        }
        return theLast
    }, false );

    // Get the next scheduled game
    const nextScheduled = teamSchedule.reduce( ( theNext, game ) => {
        if ( ! theNext && ! game.competitions[0].status.type.completed ) {
            return game;
        }
        return theNext
    }, false );

    // If no last completed, show the next scheduled
    if ( ! lastCompleted && nextScheduled ) {
        return nextScheduled;
    }

    // If no next scheduled, show the last completed
    if ( ! nextScheduled && lastCompleted ) {
        return lastCompleted;
    }

    // If neither exist, show no games scheduled. Probably between seasons
    if ( ! lastCompleted && ! nextScheduled ) {
        // Return something else here
        return false;
    }

    // Now we should have both a last completed and a next scheduled - decide which to show.
    // Set up some date values to compare
    const currentDate = dayjs();
    const lastCompletedDate = dayjs.unix( Math.floor( Date.parse(lastCompleted.date) / 1000 ) )

    // Sunday noon after last completed:
    const sundayNoonAfterLastCompleted = lastCompletedDate.day(7).startOf('day').hour(12);

    // If the epoch of the next sunday after the game at noon ET is less than the current time
    if ( sundayNoonAfterLastCompleted.unix() < currentDate.unix() ) {
        // Show next scheduled
        return nextScheduled
    } else {
        // Else show last completed
        return lastCompleted
    }
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

const getGameHeadline = ( gameData ) => {
    if ( gameData?.notes?.length > 0 && gameData.notes[0].headline ) {
        return gameData.notes[0].headline
    }

    if ( gameData?.header?.gameNote ) {
        return gameData.header.gameNote
    }

    return '';
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
     // If it's February or later, use this year, otherwise use the previous year
     const thisYear = dayjs().month() + 1 > 1 ? dayjs().year() : dayjs().year() - 1;

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

export {
    isGameComplete,
    getGameTime,
    getNextOrCurrentGame,
    getTeamSchedule,
    gameInProgress,
    gameShouldHaveStarted,
    getLiveGameData,
    getGameHeadline,
}