import { useState, useEffect } from 'react'
import {Link} from 'react-router-dom'
import styled from 'styled-components'

import { slugifyText } from 'utils'

const GameWrapper = styled.div`
    display: grid;
    grid-template-columns: [date] 100px [game] 200px  [result time] auto;
    font-size: 12px;
    line-height: 19px;
    color: #6c6d6f;
    border-bottom: 1px solid #f1f2f3;

    &:nth-child(2n) {
        background: rgba(0,0,0,.02)
    }

    div {
        padding: 4px 4px 3px;
    }

    .game-result {
        color: red;
        font-weight: bold;
        &.winner {
            color: green;
        }
    }
`

async function getTeamSchedule( {teamID} ) {
    const thisYear = new Date( Date.now() ).getFullYear()

    // Regular Season
    const regularSeason = await fetch(`http://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/${teamID}/schedule?season=${thisYear}&seasontype=2`)
        .then(response => {
            if ( response.ok) {
                return response.json()
            }
            throw response
        })
        .then(scheduleData => {
            return scheduleData.events
        })

    // Post Season
    const postSeason = await fetch(`http://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/${teamID}/schedule?season=${thisYear}&seasontype=3`)
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

const SingleGame = ({event, teamID}) => {
    const isComplete = isGameComplete(event)
    const game = event.competitions[0]
    const mediaDisplayName = game.broadcasts[0]?.media.shortName ?? ''
    const homeTeam = game.competitors.find(team => team.homeAway === 'home')
    const awayTeam = game.competitors.find(team => team.homeAway === 'away')
    const homeGame = teamID.toString() === homeTeam.id
    const opponent = homeGame ? awayTeam : homeTeam
    const gameTimeData = getGameTime(event.date)

    const dateDisplay = `${new Date( event.date ).toLocaleString('en-us', {weekday:'short'})}, ${new Date( event.date ).toLocaleString('en-us', {month:'short'})} ${new Date( event.date ).getDate()}`
    const opponentDisplay = <div>
            {homeGame ? 'vs' : '@'} <Link to={`/teams/${opponent.id}/${slugifyText(opponent.team.displayName)}`} style={{borderBottom: "none"}}><img src={opponent.team.logos[0].href} alt={opponent.team.displayName} width="20px" style={{
                verticalAlign: "top",
                margin: "0 0 0 .65em",
            }} /></Link> <span className="team-name"><span className="rank">{opponent.rank}</span> <Link to={`/teams/${opponent.id}/${slugifyText(opponent.team.displayName)}`} style={{borderBottom: "none"}}>{opponent.team.nickname}</Link></span>
        </div>

    // Return a completed game
    if ( isComplete ) {
        const isTeamWinner = homeGame ? homeTeam.winner : awayTeam.winner
        const winningScore = homeTeam.winner ? homeTeam.score.displayValue : awayTeam.score.displayValue
        const losingScore = homeTeam.winner ? awayTeam.score.displayValue : homeTeam.score.displayValue
        return (
            <GameWrapper>
                <div>
                    {dateDisplay}
                </div>
                {opponentDisplay}
                <div>
                    {isTeamWinner ? <span className="game-result winner">W</span> : <span className="game-result loser">L</span>} {winningScore} - {losingScore}
                </div>
            </GameWrapper>
        )
    }

    // Return a future game
    return (
        <GameWrapper>
            <div>
                {dateDisplay}
            </div>
            {opponentDisplay}
            <div>
                {gameTimeData.time}{mediaDisplayName !== '' ? ` on ${mediaDisplayName}` : ''}
            </div>
        </GameWrapper>
    )
}

const TeamSchedule = ({teamID}) => {
    const [teamSchedule, setTeamSchedule] = useState([]);
    const [loading, setLoading] = useState( true );

    useEffect( () => {
        // Gets the full team schedule
        getTeamSchedule( {teamID} )
            .then( schedule => {
                setTeamSchedule( schedule )
                setLoading(false)
            })

    }, [teamID])

    if ( loading ) {
        return (
            <>
                <h4>Full Schedule</h4>
                <p>Loading team schedule...</p>
            </>
        )
    }

    return (
        <>
        <div style={{
            background: "#ffffff",
            padding: "10px 12px",
            borderRadius: "10px",
            margin: "2em 0",
        }}>
        <h4>Full Schedule</h4>
            {
                teamSchedule.map( event => <SingleGame key={event.id} event={event} teamID={teamID} />)
            }
        </div>
        </>
    )
    
}

export default TeamSchedule