import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom'

import SingleUser from 'components/SingleUser'
import { getUser } from 'utils'

const Users = ({currentUser}) => {
    const { id } = useParams()
    
    const [userData, setUserData] = useState( { id: id, fetched: false } )
    const [loading, setLoading] = useState( true )
    const [error, setError] = useState( null )

    /**
     * Run this when id changes.
     */
    useEffect( () => {
        setUserData({...userData, fetched: false})
    }, [id])

    /**
     * Run this every time userData changes
     */
    useEffect( () => {
        if ( ! userData?.fetched ) {
            const fetchUserData = async () => {
                const response = await fetch('/src/data/league-data.json'
                ,{
                headers : { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }})
                .then(function(response){
                    return response.json();
                })
                .then(async data => {
                    let thisUserData = data.users.filter( user => {
                        // The initial state id is set as a string
                        return id === user.id.toString()
                    }).shift()

                    // Get roster data
                    const thisUserRosterData = await Promise.all(thisUserData.leagues.map( async id => {
                        const leagueName = data.leagues.filter( league => id === league.id ).shift().name
                        const rosterData = data.leagues.filter( league => id === league.id )
                        .shift().users.filter( user => thisUserData.id === user.id ).shift()

                        // Get all the team data here
                        const fullUserWithLeagueData = await getUser({userID: thisUserData.id, leagueID: id})

                        // Add rosterData.points too
                        rosterData.name = leagueName
                        rosterData.id = id
                        rosterData.roster = fullUserWithLeagueData.roster.roster
                        rosterData.points = fullUserWithLeagueData.points
                        return rosterData
                    }))

                    thisUserData = {
                        ...thisUserData,
                        fetched: true,
                        leagueRosters: thisUserRosterData
                    }

                    setUserData( thisUserData )
                })
                .catch(error => {
                    setError(error)
                })
                .finally(() => {
                    setLoading(false)
                })
            }

            fetchUserData()
        }
    }, [ userData.fetched ] )

    if (loading) return "Loading..."
    if (error) {
        console.log('error:', error)
        return "Error!"
    }

    return (
        <>
            <SingleUser user={userData} current={currentUser.id === userData.id} />
        </>
    )
}

export default Users