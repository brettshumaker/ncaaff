/**
 * External Dependencies
 */
import { useState, useEffect } from 'react'
import {Link} from 'react-router-dom'
import styled from 'styled-components'

/**
 * Internal Dependencies
 */
import { slugifyText } from 'utils/utils'
import FeaturedGame from 'components/FeaturedGame'
import { isGameComplete, getGameTime, getTeamSchedule, getNextOrCurrentGame } from 'utils/game'

const TeamScheduleWrapper = styled.div`
    background: #ffffff;
    padding: 8px 0;
    border-radius: 10px;
    margin: 2em 0;

    h4 {
        margin: .5em 0 1em 12px;
    }
`

const GameWrapper = styled.div`
    display: grid;
    grid-template-columns: [date] 80px [game] 1fr [result time] max-content;
    font-size: 12px;
    line-height: 19px;
    color: #6c6d6f;
    border-bottom: 1px solid #f1f2f3;
    padding: 0 8px;

    &:nth-child(2n) {
        background: rgba(0,0,0,.02)
    }

    @media screen and (max-width: 550px) {
        grid-template-columns: [date] 55px [game] 1fr [result time] max-content;

        .date-day {
            display: none
        }
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

const CompactSingleGame = ({event, teamID}) => {
    const isComplete = isGameComplete(event)
    const game = event.competitions[0]
    const mediaDisplayName = game.broadcasts[0]?.media.shortName ?? ''
    const homeTeam = game.competitors.find(team => team.homeAway === 'home')
    const awayTeam = game.competitors.find(team => team.homeAway === 'away')
    const homeGame = teamID.toString() === homeTeam.id
    const opponent = homeGame ? awayTeam : homeTeam
    const gameTimeData = getGameTime(event.date)


    const dateDisplay = <><span className="date-day">{new Date( event.date ).toLocaleString('en-us', {weekday:'short'})}, </span>{new Date( event.date ).toLocaleString('en-us', {month:'short'})} {new Date( event.date ).getDate()}</>
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
                {gameTimeData.time}<span className="game-time-media">{mediaDisplayName !== '' ? ` on ${mediaDisplayName}` : ''}</span>
            </div>
        </GameWrapper>
    )
}

const TeamSchedule = ({teamID}) => {
    const [teamSchedule, setTeamSchedule] = useState([]);
    const [scheduleLoading, setScheduleLoading] = useState( true );
    const [nextGame, setNextGame] = useState([]);
    const [nextGameLoading, setNextGameLoading] = useState( true );

    useEffect( () => {
        // Gets the full team schedule
        getTeamSchedule( {teamID} )
            .then( schedule => {
                setTeamSchedule( schedule )

                // We have everything we need now...
                setScheduleLoading(false)
            })

    }, [teamID])

    useEffect( () => {
        if ( ! scheduleLoading ) {
            // Now get the next game from the schedule.
            setNextGame( getNextOrCurrentGame( teamSchedule ) )
            setNextGameLoading( false )
        }
    }, [teamSchedule, scheduleLoading])

    const NextGame = () => {
        if ( nextGameLoading ) {
            return (
                <>
                    <p>Loading next game...</p>
                </>
            )
        }

        return (
            <FeaturedGame game={nextGame} />
        )
    }

    const FullSchedule = () => {
        if ( scheduleLoading ) {
            return (
                <>
                    <h4>Full Schedule</h4>
                    <p>Loading team schedule...</p>
                </>
            )
        }

        return (
            <TeamScheduleWrapper>
                <h4>Full Schedule</h4>
                {
                    teamSchedule.map( event => <CompactSingleGame key={event.id} event={event} teamID={teamID} />)
                }
            </TeamScheduleWrapper>
        )
    }

    return (
        <>
            <NextGame />
            <FullSchedule />
        </>
    )
    
}

export default TeamSchedule