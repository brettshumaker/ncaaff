import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BsGearFill } from 'react-icons/bs'
import styled from 'styled-components'

import { LeagueUserRow } from 'components/SingleLeague'
import { useAuth } from 'context/auth-context'
import { getUserDisplayName } from 'utils/utils'

const SingleUserPage = styled.div`
    position: relative;
`
const SettingsLink = styled.div`
    background: var(--black);
    color: var(--white);
    position: absolute;
    top: 0;
    right: 0;
    font-size: 28px;
    width: 40px;
    height: 40px;
    display: grid;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
`

const SingleUser = ( { user }) => {
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