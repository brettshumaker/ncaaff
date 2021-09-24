import styled from 'styled-components'

export const SingleTeamHeader = styled.div`
    display: grid;
    grid-template-columns: max-content 1fr;
    grid-gap: 15px;

    @media screen and (max-width: 550px) {
        grid-template-columns: 1fr
    }
`

export const SingleTeamLogo = styled.div`

    @media screen and (max-width: 550px) {
        position: relative;
        text-align: center;
        padding: 10px;
        overflow: hidden;

        &:before {
            background-image: ${props => `url(${props.logoURL})`};
            background-position: center center;
            background-size: cover;
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: -1;
            opacity: .3;
            filter: blur(7px);
        }

        &:after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #c800001a;
            z-index: -2;
        }
    }
`