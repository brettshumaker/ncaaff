/**
 * External dependencies
 */
import {
    Switch,
    Route
  } from "react-router-dom";
import 'normalize.css';
import styled from 'styled-components'
import { createGlobalStyle } from "styled-components";

/**
 * Internal dependencies
 */
import Header from 'components/Header'
import Footer from 'components/Footer/'
import Teams from 'routes/Teams'
import Users from 'routes/Users'
import Leagues from 'routes/Leagues'
import UserSwitcher from "components/UserSwitcher";

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

const MainContentWrap = styled.div`
    margin: 0 6vw;
    position: relative;
`
const App = () => {
    return (
        <>
            <GlobalStyles />
            <Header>
                { process.env.NODE_ENV === 'development' ? <UserSwitcher /> : ''}
            </Header>
            <MainContentWrap>
                <Switch>
                    <Route path="/users/:id" children={<Users />} />
                    <Route path="/leagues/:id" children={<Leagues />} />
                    <Route path="/teams/:id/:slug" children={<Teams />} />
                    <Route path="/" children={<Leagues />} />
                </Switch>
            </MainContentWrap>
            <Footer />
        </>
    )
}

export default App