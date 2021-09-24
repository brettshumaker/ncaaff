import styled from 'styled-components'
import ESPN from 'images/ESPN_wordmark.svg'

const StyledFooter = styled.div`
    text-align: center;
    background: var(--black);
    color: var(--white);
    padding: 2em;
    margin-top: 3em;
    min-height: 100px;
`

const LegalCredit = styled.p`
    font-size: 12px;
    font-weight: 300;
    letter-spacing: .02rem;
`

const Footer = () => {
    return (
        <StyledFooter id="footer">
            <LegalCredit>Powered by data provided by <img src={ESPN} alt="ESPN" title="ESPN" style={{height:"10px"}} /> | &copy;{new Date().getFullYear()}</LegalCredit>
        </StyledFooter>
    )
}

export default Footer