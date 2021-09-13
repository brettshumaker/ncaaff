/**
 * External dependencies
 */
import {
    BrowserRouter as Router,
    Switch,
    Route
  } from "react-router-dom";
import { useState, useEffect } from "react";
import 'normalize.css';
import styled from 'styled-components'
import { createGlobalStyle } from "styled-components";

/**
 * Internal dependencies
 */
import Header from 'components/Header'
import Home from 'routes/Home'
import Footer from 'components/Footer/'
import Teams from 'routes/Teams'
import Users from 'routes/Users'
import Leagues from 'routes/Leagues'
import { getAllUsers, getUserDisplayName, useLocalStorage } from 'utils'

const GlobalStyles = createGlobalStyle`
    html {
        --black: #121623;
        --white: #eee;

        color: var(--black);
    }

    body {
        height: 100vh;
    }

    #root {
        height: 100%;
        display: grid;
        grid-template-rows: max-content 1fr max-content;
    }
`

const MainContentWrap = styled.div`
    margin: 0 6vw
`

// Quick user switcher, thing
const UserSwitcher = ({currentUser, setCurrentUser}) => {
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
        <div style={{
            width: "150px",
            position: "absolute",
            top: ".5em",
            right: "2em",
            fontSize: "10px",
            lineHeight: "20px",
        }}>
            <label htmlFor="currentUser">View league as:</label>
            <select
                name="currentUser"
                value={currentUser.id}
                onChange={(event) => {
                    const newUser = userList.find(user => user.id === parseInt(event.target.value))

                    // Store this locally
                    useLocalStorage({key:'currentUser', value: newUser})

                    // And update our state
                    setCurrentUser(newUser)
                }}
                style={{width: "100%"}}
            >
                {
                    userList.map(user => {
                        return <option key={user.id} value={user.id}>{user.display}</option>
                    })
                }
            </select>
        </div>
    )
}

const App = () => {
    const [currentUser, setCurrentUser] = useState(useLocalStorage({key: 'currentUser'}) ? useLocalStorage({key: 'currentUser'}) : {id:1})

    return (
        <Router>
            <GlobalStyles />
            <Header currentUser={currentUser}>
                <UserSwitcher currentUser={currentUser} setCurrentUser={setCurrentUser} />
            </Header>
            <MainContentWrap>
                <Switch>
                    <Route path="/users/:id" children={<Users currentUser={currentUser} />} />
                    <Route path="/leagues/:id" children={<Leagues />} />
                    <Route path="/teams/:id/:slug" children={<Teams />} />
                    <Route path="/" children={<Home />} />
                </Switch>
            </MainContentWrap>
            <Footer />
        </Router>
    )
}

export default App