import styled from 'styled-components'
import { Link } from 'react-router-dom'

const StyledMenu = styled.nav`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    background: #353535;
    box-shadow: ${({ open }) => open ? '14px 0 22px #0000008f' : 'none'};
    border-right: thin solid #000000;
    height: 100vh;
    text-align: left;
    padding: 4rem 2rem 2rem;
    position: absolute;
    top: 0;
    left: 0;
    transition: transform 0.3s ease-in-out;
    transform: ${({ open }) => open ? 'translateX(0)' : 'translateX(-100%)'};
    z-index: 9;

    /* @media (max-width: ${({ theme }) => theme.mobile}) {
        width: 100%;
    } */

    a {
        font-size: 2rem;
        text-transform: uppercase;
        padding: 2rem 0;
        font-weight: bold;
        letter-spacing: 0.5rem;
        color: var(--white);
        text-decoration: none;
        transition: color 0.3s linear;

        /* @media (max-width: ${({ theme }) => theme.mobile}) {
            font-size: 1.5rem;
            text-align: center;
        } */

        /* &:hover {
            color: ${({ theme }) => theme.primaryHover};
        } */
    }
`

const Nav = ({open, setOpen, currentUser}) => {
    return (
        <StyledMenu open={open}>
            <Link to={`/users/${currentUser.id}`} onClick={() => setOpen(!open)}>
                <span role="img" aria-label="Account">📔</span>
                My Account
            </Link>
            <Link to="/leagues/1" onClick={() => setOpen(!open)}>
                <span role="img" aria-label="price">🏆</span>
                My Leagues
            </Link>
            <Link to="/" onClick={() => setOpen(!open)}>
                <span role="img" aria-label="home">🏠</span>
                Home
            </Link>
        </StyledMenu>
    )
}

export default Nav