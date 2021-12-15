/**
 * External Dependencies
 */
import { useState, useEffect } from 'react'

/**
 * Internal Dependencies
 */
import FeaturedGame from 'components/FeaturedGame'
import CompactSingleGame from './CompactSingleGame'
import { getTeamSchedule, getNextOrCurrentGame } from 'utils/game'
import { TeamScheduleWrapper } from './style'

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
            return <p>Loading next game...</p>
        }

        if ( ! nextGame ) {
            return ''
        }

        return <FeaturedGame game={nextGame} />
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