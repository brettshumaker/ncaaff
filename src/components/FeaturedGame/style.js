import styled, { keyframes } from 'styled-components'

export const PrettyGameInfo = styled.div`
    display: grid;
    grid-template-columns: 1fr max-content 1fr;
    grid-column-gap: 30px;
    width: 100%;
    background: #ffffff;
    padding: 1em 1em .5em;
    border-radius: 10px;

    &.in-progress-game {

        .away {
            grid-template-columns: 1fr 60px 40px;
        }

        .home {
            grid-template-columns: 40px 60px 1fr;   
        }

        .home .team-name {
            grid-column-start: 3;
            grid-row-start: 1;
        }

        .home .game-team-logo {
            grid-column-start: 2;
            grid-row-start: 1;
        }

        .home .score {
            grid-row-start: 1;
            grid-column-start: 1;
            text-align: left
        }

        .score {
            text-align: right;
            font-weight: bold;
            font-size: 30px;
        }

        &.possession {
            .has-possession::after {
                content: url("data:image/svg+xml,%3Csvg viewBox='0 0 116 63' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M116 31.5C116 40.3155 90.0325 63 58 63C25.9675 63 0 40.208 0 31.5C0 22.792 25.9675 0 58 0C90.0325 0 116 22.6845 116 31.5Z' fill='%23764519'/%3E%3C/svg%3E%0A");
                position: absolute;
                right: -20px;
                width: 16px;
            }
        }


        @media screen and (max-width: 550px) {
            .home .score,
            .away .score {
                grid-row-start: 1;
                grid-column-start: 1;
                text-align: center;
                font-size: 20px;
            }

            .away, .home {
                grid-template-columns: 27px 40px 1fr;
            }

            .away .game-team-logo,
            .home .game-team-logo {
                grid-column-start: 2;
                grid-row-start: 1;

                img {
                    width: 40px;
                }
            }

            .away .team-name,
            .home .team-name {
                grid-column-start: 3;
                grid-row-start: 1;
            }

            &.possession {
                .away, .home {
                    grid-template-columns: 10px 27px 40px 1fr;
                }

                .home .score,
                .away .score {
                    grid-row-start: 1;
                    grid-column-start: 2;
                }
                
                .away .game-team-logo,
                .home .game-team-logo {
                    grid-row-start: 1;
                    grid-column-start: 3;
                }
                
                .away .team-name,
                .home .team-name {
                    grid-row-start: 1;
                    grid-column-start: 4;
                }

                .has-possession::after {
                    position: inherit;
                    right: 0px;
                    width: 10px;
                    grid-row-start: 1;
                    grid-column-start: 1;
                }
            }


        }
    }

    @media screen and (max-width: 550px) {
        grid-template-columns: 1em 1fr 1em;
        grid-column-gap: 0;
        padding: 0 0 .5em;

        > div {
            grid-column-start: 2;
            grid-column-end: 2
        }
    }

    h4 {
        margin: 0 0 8px;
        grid-column-start: 2;
        grid-column-end: 2;

        @media screen and (min-width: 551px) {
            grid-column-start: 1;
            grid-column-end: 4;
        }
    }

    .away, .home {
        display: grid;
        grid-template-columns: 1fr 60px;
        grid-column-gap: 6px;
        align-items: center;
        position: relative;
    }

    .team-name {
        font-weight: bold
    }

    .rank {
        font-size: 11px;
        color: #424344;
        position: relative;
        bottom: 2px;
        margin-right: .1rem;
    }

    .home {
        grid-template-columns: 60px 1fr;

        .game-team-logo {
            grid-column-start: 1
        }

        .team-name {
            grid-column-start: 2;
            grid-row-start: 1;
        }
    }

    .away {
        text-align: right;

        @media screen and (max-width: 550px) {
            text-align: left;
            grid-template-columns: 60px 1fr;

            .game-team-logo {
                grid-column-start: 1;
            }

            .team-name {
                grid-column-start: 2;
                grid-row-start: 1;
            }
        }
    }

    .game-team-logo {
        position: relative
    }

    .game-date-time-channel {
        text-align: center;
        font-size: 10px;
        letter-spacing: .7px;
        color: #6c6d6f;
        display: grid;
        grid-template-rows: 1fr 17px 1fr;

        @media screen and (max-width: 550px) {
            text-align: left;
            grid-template-rows: 1fr;
            grid-template-columns: max-content max-content 1fr;
            grid-column-gap: 8px;
            margin: 0 0 15px;
            align-items: center;
            grid-column-start: 1;
            grid-column-end: 4;
            grid-row-start: 1;
            padding: 10px 1.5em;
            background: #fafafa;
            border-top: 1px solid #f1f2f3;
            border-bottom: 1px solid #f1f2f3;
            border-radius: 10px 10px 0 0;
        }

        .channel {
            align-self: end;

            @media screen and (max-width: 550px) {
                grid-column-start: 3;
                grid-row-start: 1;
                align-self: center;
                text-align: right;
            }
        }

        .clock-quarter {
            align-self: center;
        }

        .date {
            align-self: center;
            font-size: 13px;
            font-weight: 600;
            color: #48494a;

            @media screen and (max-width: 550px) {
                grid-column-start: 1;
                grid-row-start: 1;
            }
        }

        .time {
            @media screen and (max-width: 550px) {
                grid-column-start: 2;
                grid-row-start: 1;
            }
        }
    }

    .last-play {
        overflow: hidden;
        grid-column: 1/-1;
        text-align: center;
        margin: 1em 15px 0;
        min-width: 0;

        p {
            font-size: 9px;
            margin: 0;
            white-space: nowrap;

            &.scrolling {
                position: relative;
                left: 0;
                transition: all 1s linear;
            }
        }
    }

    .game-meta {
        grid-column-start: 1;
        grid-column-end: 4;
        align-self: center;
        text-align: center;
        width: 100%;
        font-size: 11px;
        opacity: 0.45;
        margin-top: 1.5em;
        transition: opacity .25s;

        .gamecast {
            border-left: thin solid;
            margin-left: .5em;
            padding-left: .5em;
        }

        @media screen and (max-width: 550px) {
            grid-column-start: 2;
            grid-column-end: 2;
        }

        &:hover {
            opacity: .8;
        }

        a {
            border-bottom: none
        }
    }
`

const scrolllastplay = (left) => keyframes`
    0% {
        left: 0;
    }
    25% {
        left: ${left}px; /* This needs to be a variable */
    }
`

export const ScrolledOverflowContainer = styled.p`
    @media screen and (max-width: 550px) {
        position: relative;
        animation: 8s infinite linear ${props => scrolllastplay(props.scrollAmount)};
        animation-delay: 1.5s;
    }
`