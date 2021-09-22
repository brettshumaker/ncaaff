import { useState, useEffect } from 'react'
import styled from 'styled-components'

import { getTeamRecord } from 'utils/utils';
import TeamSchedule from 'components/TeamSchedule';

const SingleTeamHeader = styled.div`
    display: grid;
    grid-template-columns: max-content 1fr;
    grid-gap: 15px;

    @media screen and (max-width: 550px) {
        grid-template-columns: 1fr
    }
`

const SingleTeamLogo = styled.div`

    @media screen and (max-width: 550px) {
        position: relative;
        text-align: center;
        padding: 10px;
        overflow: hidden;

        &:before {
            background-image: ${props => `url(${props.logoURL})`};
            background-position: center center;
            background-size: cover;
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: -1;
            opacity: .3;
            filter: blur(7px);
        }

        &:after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #c800001a;
            z-index: -2;
        }
    }
`

const SingleTeam = ( { id }) => {

    const [teamData, setTeamData] = useState( null );
    const [loading, setLoading] = useState( true );
    const [error, setError] = useState( null );

    useEffect( () => {
        fetch(`https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/${id}`)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw response
            })
            .then(data => {
                const conferenceID = data.team.groups.isConference ? data.team.groups.id : data.team.groups.parent.id
                const teamData = data.team
                fetch(`https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard/conferences?groups=${conferenceID}`)
                    .then(response => {
                        if (response.ok) {
                            return response.json()
                        }
                        throw response
                    })
                    .then(data => {
                        teamData.groups.conferenceData = data.conferences;
                        setTeamData(teamData)
                    })
                    .catch(error => {
                        return error
                    })
                    .finally(() => {
                        setLoading(false)
                    })
            })
            .catch(error => {
                setError(error)
            })
    }, [id])

    if (loading) return "Loading..."
    if (error) return "Error!"

    return(
        <>
            <SingleTeamHeader>
                <SingleTeamLogo logoURL={teamData.logos[0].href}>
                    <img src={teamData.logos[0].href} width="150" alt={teamData.displayName} title={teamData.displayName} />
                </SingleTeamLogo>
                <div>
                    <h1><a href={teamData.links[0].href} title={`View ${teamData.displayName} on ESPN`} target="_blank">{teamData.displayName}</a></h1>
                    <h3>{teamData.groups.conferenceData[0].shortName}{ ! teamData.groups.isConference ? ` (${teamData.groups.conferenceData.
                        filter( (conf ) => {
                            return teamData.groups.id === conf.groupId
                        }).shift().name})` : ``}</h3>
                    <h3>Record: {getTeamRecord(teamData)}</h3>
                </div>
            </SingleTeamHeader>
            <TeamSchedule teamID={id} />
        </>
    )
}

export default SingleTeam