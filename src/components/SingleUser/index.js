/**
 * External Dependencies
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BsGearFill } from 'react-icons/bs'

/**
 * Internal Dependencies
 */
import { LeagueUserRow } from 'components/SingleLeague'
import { useAuth } from 'context/auth-context'
import { getUserDisplayName } from 'utils/utils'
import { SingleUserPage, SettingsLink } from './style'

const SingleUser = ( { user }) => {
    // TODO - check this out
    const [userData, setUserData] = useState( user )
    const {user: loggedInUser} = useAuth();

    const isThisUser = loggedInUser.id === user.id

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
        <SingleUserPage>
            <h1>{getUserDisplayName({user})}</h1>
            {
                isThisUser ? <SettingsLink><BsGearFill /></SettingsLink> : ''
            }
            <h2>Leagues</h2>
            <UserLeagues />
        </SingleUserPage>
    )
}

export default SingleUser