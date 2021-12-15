/**
 * External Dependencies
 */
import { useEffect, useState, useRef } from 'react'

/**
 * Internal Dependencies
 */
import ESPN from 'images/ESPN_wordmark.svg'
import { useAsync, shortenConferenceName } from 'utils/utils'
import { getGameTime, gameShouldHaveStarted, getLiveGameData, getGameHeadline } from 'utils/game'
import { PrettyGameInfo, ScrolledOverflowContainer } from './style'

const TeamGameLogo = ({team}) => {
    return (
        <div className="game-team-logo">
            <img src={team.team.logos[0].href} width="60" alt={team.team.displayName} title={team.team.displayName} />
        </div>
    )
}

const GameHeadline = ( { gameData, className = '' } ) => {
    const headline = getGameHeadline( gameData );

    if ( '' === headline ) {
        return '';
    }

    return (
        <div className={`game-headline ${ className }`}>
            <p>{ shortenConferenceName( headline ) }</p>
        </div>
    )
}

const FutureGame = ( {gameData} ) => {
    const {mediaDisplayName, homeTeam, awayTeam, venue, gamecastLink, gameTimeData} = gameData

    return(
        <div className="next-game">
            <PrettyGameInfo className={ `prettyGameInfo future-game ${ getGameHeadline( gameData ) !== '' ? 'has-headline' : '' }` }>
                <GameHeadline gameData={ gameData } />
                <div className="away">
                    <span className="team-name"><span className="rank">{awayTeam.rank}</span> {awayTeam.team.displayName}</span>
                    <TeamGameLogo team={awayTeam} />
                </div>
                <div className="game-date-time-channel">
                    <span className="channel">{mediaDisplayName ? mediaDisplayName : ''}</span>
                    <span className="date">{gameTimeData.dayMonth}</span>
                    <span className="time">{gameTimeData.time}</span>
                    <span className="headline"><GameHeadline gameNotes={ gameData?.notes } className="in-gdtc" /></span>
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

const CurrentGame = ( { gameData, basicGameData } ) => {
    const [ scrollingPlayScrollLeft, setScrollingPlayScrollLeft ] = useState(0);

    console.log('rendering CurrentGame', {gameData, basicGameData})
    const {mediaDisplayName, venue, gamecastLink} = basicGameData;
    const homeTeam = gameData.header.competitions[0].competitors.find( team => team.homeAway === 'home')
    const awayTeam = gameData.header.competitions[0].competitors.find( team => team.homeAway === 'away')
    const shortDetail = gameData.header.competitions[0].status.type.shortDetail;
    const someoneHasPossession = awayTeam.possession || homeTeam.possession;
    const downDistance = gameData.drives?.current?.plays.slice(-1)[0]?.end?.downDistanceText
    const lastPlay = gameData.drives?.current?.plays.slice(-1)[0].text;
    const gameStatus = gameData.header.competitions[0].status.type.name;
    // console.log(gameData.drives.current.plays.slice(-1)[0], downDistance !== undefined)

    const autoScrollPlay = useRef(null)

    useEffect( () => {
        if ( autoScrollPlay.current ) {
            const scrollingContent = autoScrollPlay.current.firstChild;
            const scrollAmount = scrollingContent.clientWidth - scrollingContent.scrollWidth;

            if ( scrollAmount < 0 ) {
                setScrollingPlayScrollLeft( scrollAmount * 1.5 )
            }
        }
    }, [])

    return(
        <div className="next-game">
            <PrettyGameInfo className={`prettyGameInfo in-progress-game ${someoneHasPossession ? 'possession' : ''} ${ getGameHeadline( gameData ) !== '' ? 'has-headline' : '' }`}>
                <GameHeadline gameData={ gameData } />
                <div className={`away${awayTeam.possession ? ' has-possession' : ''}`}>
                    <span className="team-name"><span className="rank">{awayTeam.rank}</span> {awayTeam.team.displayName}</span>
                    <TeamGameLogo team={awayTeam} />
                    <span className="score">{awayTeam.score}</span>
                </div>
                <div className="game-date-time-channel">
                    <span className="channel">{mediaDisplayName ? mediaDisplayName : ''}</span>
                    { gameStatus === 'STATUS_FINAL' && <span className="date">{basicGameData.gameTimeData.dayMonth}</span>}
                    <span className="clock-quarter">{shortDetail}</span>
                    { downDistance !== undefined && <span className="down-distance">{downDistance}</span> }
                </div>
                <div className={`home${homeTeam.possession ? ' has-possession' : ''}`}>
                    <span className="team-name"><span className="rank">{homeTeam.rank}</span>{homeTeam.team.displayName}</span>
                    <TeamGameLogo team={homeTeam} />
                    <span className="score">{homeTeam.score}</span>
                </div>
                { lastPlay !== undefined && <div className="last-play" ref={autoScrollPlay}><ScrolledOverflowContainer scrollAmount={scrollingPlayScrollLeft}>LAST PLAY: {lastPlay}</ScrolledOverflowContainer></div> }
                <div className="game-meta">
                    <span className="venue">{venue}</span> 
                    <span className="gamecast">
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

const FeaturedGame = ( {game: nextGameData} ) => {
    const[ gameInProgress, setGameInProgress] = useState(false);
    const[ preliminaryGameData, setPreliminaryGameData] = useState();
    const[ inProgressGameData, setInProgressGameData] = useState();
    const{run, data, isSuccess, isLoading, isError, error} = useAsync();

    useEffect( () => {
        const competition = nextGameData.header ? nextGameData.header.competitions[0] : nextGameData.competitions[0]
        const mediaDisplayName = competition.broadcasts[0]?.media.shortName
        const homeTeam = competition.competitors.find(team => team.homeAway === 'home')
        const awayTeam = competition.competitors.find(team => team.homeAway === 'away')
        const venueData = nextGameData.header ? nextGameData.gameInfo.venue : competition.venue
        const venue = `${venueData.fullName} - ${venueData.address.city}, ${venueData.address.state}`
        const links = nextGameData.header ? nextGameData.header.links : nextGameData.links
        const gamecastLink = links.find(link => link.text === 'Gamecast').href
        const gameTimeData = nextGameData.date ? getGameTime(nextGameData.date) : null

        if ( ! nextGameData.header ) {
            homeTeam.rank = homeTeam.curatedRank.current > 25 ? '' : homeTeam.curatedRank.current
            awayTeam.rank = awayTeam.curatedRank.current > 25 ? '' : awayTeam.curatedRank.current
        }

        setPreliminaryGameData( {
            id: nextGameData.header ? nextGameData.header.id : nextGameData.id,
            mediaDisplayName,
            homeTeam,
            awayTeam,
            venue,
            gamecastLink,
            gameTimeData,
            notes: competition.notes,
        } );

        setGameInProgress( gameShouldHaveStarted( nextGameData.date ) )
    }, [nextGameData] );

    useEffect( () => {
        if ( ! gameInProgress )
            return;

        const getAsyncLiveGameData = async () => {
            const result = await run( getLiveGameData( preliminaryGameData.id ) )
            setInProgressGameData( result )
        }
        // The game is in progress, lets try and get our in-game data
        getAsyncLiveGameData();
    }, [ gameInProgress ]);

    if ( ! gameInProgress && preliminaryGameData ) {
        return(
            <FutureGame gameData={preliminaryGameData} />
        )
    }

    // This is silly...figure out something else.
    if ( ! inProgressGameData || ! isSuccess || isLoading || ( isLoading && ! preliminaryGameData ) ) {
        return <p>Loading live game data...</p>
    }

    /**
     * Maybe show these pieces of data here:
     *      - quarter       :: inProgressGameData.header.competitions[0].status.period
     *      - clock time    :: inProgressGameData.header.competitions[0].status.displayClock
     *          - can also use status.detail or shortDetail to show "12:50 - 2nd Quarter" or "12:50 - 2nd"
     *      - short detail  :: inProgressGameData.header.competitions[0].status.shortDetail
     *      - current score :: inProgressGameData.scoringPlays[last].awayScore/.homeScore
     *      - possession    :: inProgressGameData.drives.current.team
     *      - last play     :: inProgressGameData.drives.current.plays[last].text can also use [last].type.text to get the type of play.
     */

    return (
        <CurrentGame gameData={ inProgressGameData } basicGameData={preliminaryGameData} />
    )

}

export default FeaturedGame;
