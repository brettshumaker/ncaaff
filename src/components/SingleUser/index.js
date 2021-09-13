import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { LeagueUserRow } from 'components/SingleLeague'

const SingleUser = ( { user }) => {
    const [userData, setUserData] = useState( user )

    const displayName = user.name.display !== '' ? user.name.display : `${user.name.first ?? ''} ${user.name.last ?? ''}`.trim()

    const UserLeagues = () => {
        return(
            <>
            <div key='user-league'>
                {userData.leagueRosters.map( league => {
                    const newUserData = {...userData, roster: league.roster}
                    return (
                        <div key={`user-${userData.id}-league-${league.id}`} className={league.id}>
                            <LeagueUserRow key={`user-${userData.id}-league-${league.id}`} user={newUserData}>
                                {[
                                    <h3 key={`user-${userData.id}-league-${league.id}`} style={{flex: "0 0 100%"}}><Link to={`/leagues/${league.id}`}>{league.name}</Link> - {league.points} point{league.points !== 1 ? 's' : ''}</h3>
                                ]}
                            </LeagueUserRow>
                        </div>
                    )
                })}
            </div>
            </>
        )
    }

    return (
        <>
            <h1>{displayName}</h1>
            <h2>Leagues</h2>
            <UserLeagues />
        </>
    )
}

export default SingleUser