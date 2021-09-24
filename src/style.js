import 'normalize.css';
import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
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

export const MainContentWrap = styled.div`
    margin: 0 6vw;
    position: relative;
`