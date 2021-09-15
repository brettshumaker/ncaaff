import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useAuth } from 'context/auth-context'
import { getAllUsers, getUserDisplayName, useLocalStorage } from 'utils'


const StyledUserSwitcher = styled.div`
    width: 150px;
    position: absolute;
    top: .5em;
    right: 2em;
    font-size: 10px;
    line-height: 20px;
    @media screen and (max-width: 550px) {
        display: none;
    }
`

const CurrentUserView = styled.div`
     text-align: right;

     @media screen and (max-width: 550px) {
        display: none;
    }
`

// Quick user switcher, thing
const UserSwitcher = () => {
    const {user: currentUser, login} = useAuth()
    const [userList, setUserList] = useState([])

    useEffect(() => {
        getAllUsers()
        .then( users => {
            const newUserList = users.map(user => {
                return {
                    id: user.id,
                    display: getUserDisplayName({user})
                }
            })
            setUserList(newUserList)
        })
    }, [currentUser])

    if ( userList.length === 0 ) {
        return ''
    }

    return (
        <>
            <StyledUserSwitcher>
                <label htmlFor="currentUser">View league as:</label>
                <select
                    name="currentUser"
                    value={currentUser.id}
                    onChange={(event) => {
                        const newUser = userList.find(user => user.id === parseInt(event.target.value))

                        // Store this locally
                        useLocalStorage({key:'currentUser', value: newUser})

                        // And update our state
                        login(newUser)
                    }}
                    style={{width: "100%"}}
                >
                    {
                        userList.map(user => {
                            return <option key={user.id} value={user.id}>{user.display}</option>
                        })
                    }
                </select>
            </StyledUserSwitcher>
            <CurrentUserView>
                {
                    currentUser.display ? <p>Welcome, {currentUser.display}</p> : <p>Please select a user</p>
                }
            </CurrentUserView>
        </>
    )
}

export default UserSwitcher