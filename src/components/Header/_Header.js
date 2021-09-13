import styled from 'styled-components'
import { useState } from 'react'

import Kebab from 'components/Kebab'
import Nav from 'components/Header/Nav/index'


const StyledHeader = styled.div`
    background: var(--black);
    color: var(--white);
    padding: 2em;
    display: grid;
    grid-template-columns: 4em 4fr 1fr;
    margin-bottom: 2em;
`

const Header = ({children}) => {
    const [navOpen, setNavOpen] = useState(false)

    return (
        <>
        <StyledHeader role="header">
            <Nav open={navOpen} setOpen={setNavOpen} />
            <Kebab open={navOpen} setOpen={setNavOpen} />
            <div>
                <p>NCAA College Football Fantasy Football</p>
            </div>
            {children}
        </StyledHeader>
        </>
    )
}

export default Header