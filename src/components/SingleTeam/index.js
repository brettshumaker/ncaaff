import { useState, useEffect } from 'react'
import styled from 'styled-components'

import { getTeamRecord } from 'utils';
import ESPN from 'images/ESPN_wordmark.svg'

const SingleTeamHeader = styled.div`
    display: grid;
    grid-template-columns: max-content 1fr;
    grid-gap: 15px;
`

const PrettyGameInfo = styled.div`
    display: grid;
    grid-template-columns: 1fr max-content 1fr;
    grid-column-gap: 30px;
    min-width: 50%;
    max-width: 100%;
    width: 800px;
    background: #ffffff;
    padding: 1em 1em .5em;
    border-radius: 4px;
    border: thin solid #bfbfbf;
    box-shadow: inset 31px 32px 87px #0000001a;

    .away, .home {
        display: grid;
        grid-template-columns: 1fr 65px;
        grid-column-gap: 6px;
        align-items: center
    }

    .team-name {
        font-weight: bold
    }

    .rank {
        font-size: 11px;
        color: #424344;
        position: relative;
        bottom: 2px;
        margin-right: .1rem;
    }

    .home {
        grid-template-columns: 60px 1fr;

        .game-team-logo {
            grid-column-start: 1
        }

        .team-name {
            grid-column-start: 2;
            grid-row-start: 1;
        }
    }

    .away {
        text-align: right;
    }

    .game-team-logo {
        position: relative
    }

    .game-date-time-channel {
        text-align: center;
        font-size: 10px;
        letter-spacing: .7px;
        color: #6c6d6f;
        display: grid;
        grid-template-rows: 1fr 17px 1fr;

        .channel {
            align-self: end;
        }

        .date {
            align-self: center;
            font-size: 13px;
            font-weight: 600;
            color: #48494a;
        }
    }

    .game-meta {
        grid-column-start: 1;
        grid-column-end: 4;
        align-self: center;
        text-align: center;
        width: 100%;
        font-size: 11px;
        opacity: 0.45;
        margin-top: 1.5em;
        transition: opacity .25s;

        &:hover {
            opacity: .8;
        }

        a {
            border-bottom: none
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
                fetch(`https://site.web.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard/conferences?groups=${conferenceID}`)
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
    }, [])

    if (loading) return "Loading..."
    if (error) return "Error!"

    const TeamGameLogo = ({team}) => {
        return (
            <div className="game-team-logo">
                <img src={team.team.logos[0].href} width="60" alt={team.team.displayName} title={team.team.displayName} />
            </div>
        )
    }

    function getGameTime(dateString) {
        const dateObj = new Date(dateString)
        return {
            weekday: dateObj.toLocaleString('en-us',{ weekday: 'long'}),
            dayMonth: dateObj.toLocaleString('en-US',{day: 'numeric',month: 'numeric'}),
            time: dateObj.toLocaleString('en-US',{hour:'numeric', minute: 'numeric', timeZoneName: 'short'}),
        }
    }

    const NextGame = () => {
        const nextGameData = teamData.nextEvent.pop()

        if ( ! nextGameData ) {
            return ''
        }

        const mediaDisplayName = nextGameData.competitions[0].broadcasts[0]?.media.shortName
        const homeTeam = nextGameData.competitions[0].competitors.find(team => team.homeAway === 'home')
        const awayTeam = nextGameData.competitions[0].competitors.find(team => team.homeAway === 'away')
        const venue = `${nextGameData.competitions[0].venue.fullName} - ${nextGameData.competitions[0].venue.address.city}, ${nextGameData.competitions[0].venue.address.state}`
        const gamecastLink = nextGameData.links.find(link => link.text === 'Gamecast').href
        const gameTimeData = getGameTime(nextGameData.date)
        homeTeam.rank = homeTeam.curatedRank.current > 25 ? '' : homeTeam.curatedRank.current
        awayTeam.rank = awayTeam.curatedRank.current > 25 ? '' : awayTeam.curatedRank.current

        return(
            <div className="next-game">
                <h4>Next Game:</h4>
                <PrettyGameInfo className="prettGameInfo">
                    <div className="away">
                        <span className="team-name"><span className="rank">{awayTeam.rank}</span> {awayTeam.team.displayName}</span>
                        <TeamGameLogo team={awayTeam} />
                    </div>
                    <div className="game-date-time-channel">
                        <span className="channel">{mediaDisplayName ? mediaDisplayName : ''}</span>
                        <span className="date">{gameTimeData.dayMonth}</span>
                        <span className="time">{gameTimeData.time}</span>
                    </div>
                    <div className="home">
                        <span className="team-name"><span className="rank">{homeTeam.rank}</span>{homeTeam.team.displayName}</span>
                        <TeamGameLogo team={homeTeam} />
                    </div>
                    <div className="game-meta">
                        <span className="venue">{venue}</span> 
                        <span className="gamecast" style={{
                            borderLeft: "thin solid",
                            marginLeft: ".5em",
                            paddingLeft: ".5em",
                        }}>
                            <a href={gamecastLink} target="_blank">
                                <img src={ESPN} alt="ESPN" title="ESPN" style={{height:"8px",marginRight:"2px"}} /> 
                                Gamecast
                            </a>
                        </span>
                    </div>
                </PrettyGameInfo>
            </div>
        )
    }

    return(
        <>
            <SingleTeamHeader>
                <div>
                    <img src={teamData.logos[0].href} width="150" alt={teamData.displayName} title={teamData.displayName} />
                </div>
                <div>
                    <h1>{teamData.displayName}</h1>
                    <h3>{teamData.groups.conferenceData[0].shortName}{ ! teamData.groups.isConference ? ` (${teamData.groups.conferenceData.
                        filter( (conf ) => {
                            return teamData.groups.id === conf.groupId
                        }).shift().name})` : ``}</h3>
                    <h3>Record: {getTeamRecord(teamData)}</h3>
                </div>
            </SingleTeamHeader>
            <NextGame />
        </>
    )
}

export default SingleTeam