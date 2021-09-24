/**
 * External dependencies
 */
import {
    Switch,
    Route
  } from "react-router-dom";


/**
 * Internal dependencies
 */
import Header from 'components/Header'
import Footer from 'components/Footer/'
import Teams from 'routes/Teams'
import Users from 'routes/Users'
import Leagues from 'routes/Leagues'
import UserSwitcher from "components/UserSwitcher";
import { GlobalStyles, MainContentWrap } from "style";

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