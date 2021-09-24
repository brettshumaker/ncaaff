/**
 * External Dependencies
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

/**
 * Internal Dependencies
 */
import { getLeague, getUser, getUserDisplayName, getTeamData, getRankedLeagueUsers } from 'utils/utils'
import { CompactRosterTeam, StyledLeagueUserRow, RankBlock } from './style'

function CompactUserRoster({userRosterWithData}) {
    return userRosterWithData.map(teamData => {
        return (
            <Link key={teamData.uid} to={`/teams/${teamData.id}/${teamData.slug}`} style={{borderBottom: "none"}}>
                <CompactRosterTeam
                    className={`compact-roster team-id-${teamData.id}`}
                >
                    <img src={teamData.logos[0].href} width="75" alt={teamData.displayName} title={teamData.displayName} />
                </CompactRosterTeam>
            </Link>
        )
    })
}

export{LeagueUserRow}
function LeagueUserRow({user, children}) {
    const hasRankBlock = Boolean(children.find(child => child.props.displayName === 'rankBlock'))
    return (
        <StyledLeagueUserRow
            key={user.id}
            className={`league-user user-${user.id} ${user.commissioner ? 'league-commissioner' : ''}`}
            hasRankBlock={hasRankBlock}
        >
            {children}
            <CompactUserRoster userRosterWithData={user.roster} />
        </StyledLeagueUserRow>
    )
}

const SingleLeague = ({id}) => {
    const [singleLeagueData, setSingleLeagueData] = useState({
        status: 'pending',
        leagueData: {}
    })

    useEffect(() => {
        if ( 'loaded' === singleLeagueData.status )
            return

        getLeague(id)
        .then( async league => {
            const leagueUserData = await Promise.all(league.users.map( user => {
                return getUser( {userID: user.id, leagueID: league.id})
                    .then( async userData => {
                        // userData.roster = userData.roster.roster ? userData.roster.roster : userData.roster
                        userData.roster = userData.roster.roster
                        const newRoster = []
                        await Promise.all(userData.roster.map( async ( team, index ) => {
                            return await getTeamData( team )
                                .then(teamData => {
                                    newRoster.push(teamData)
                                })
                        })).then( teamData => {
                            userData.roster = newRoster
                            return userData
                        })
                        return userData
                    })
            }))
            .then(data => data)
            league.users = getRankedLeagueUsers( leagueUserData )
            return league
        })
        .then( leagueData => {
            setSingleLeagueData({
                status: 'loaded',
                leagueData
            })
        })
    }, [singleLeagueData.status])

    function LeagueUserCard({id}) {
        const user = singleLeagueData.leagueData.users.find(user => id === user.id)
        return (
            <>
                <LeagueUserRow user={user}>
                    <RankBlock className={`rank-${user.rank.replace('T-', '').replace('st', '').replace('nd', '').replace('rd', '').replace('th', '')}`} displayName="rankBlock">
                        <p>{user.rank}</p>
                    </RankBlock>
                    <p style={{
                        flex:"0 0 100%",
                        marginTop:0,
                    }}><Link to={`/users/${user.id}`}>{getUserDisplayName({user})}</Link> - <span style={{fontWeight: "bold"}}>{user.points} point{user.points !== 1 ? 's' : ''}</span></p>
                </LeagueUserRow>
            </>
        )
    }

    if ( 'pending' === singleLeagueData.status ) {
        return <h1>Loading league data...</h1>
    }

    return (
        <>
            <h1>{singleLeagueData.leagueData.name}</h1>
            { singleLeagueData.leagueData.users.map( ( user, index ) => <LeagueUserCard key={user.id} id={user.id} />) }
        </>
    )
}

export default SingleLeague