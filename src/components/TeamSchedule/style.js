import styled from 'styled-components'

export const TeamScheduleWrapper = styled.div`
    background: #ffffff;
    padding: 8px 0;
    border-radius: 10px;
    margin: 2em 0;

    h4 {
        margin: .5em 0 1em 12px;
    }
`

export const GameWrapper = styled.div`
    display: grid;
    grid-template-columns: [date] 80px [game] 1fr [result time] max-content;
    font-size: 12px;
    line-height: 19px;
    color: #6c6d6f;
    border-bottom: 1px solid #f1f2f3;
    padding: 0 8px;

    &:nth-child(2n) {
        background: rgba(0,0,0,.02)
    }

    @media screen and (max-width: 550px) {
        grid-template-columns: [date] 55px [game] 1fr [result time] max-content;

        .date-day {
            display: none
        }
    }

    div {
        padding: 4px 4px 3px;
    }

    
    .opponent-display {
        display: grid;
        grid-template-columns: 18px 12px 20px 1fr;
        grid-column-gap: 2px;
        padding-left: 0;

        img {
            vertical-align: top;
        }

        span.rank {
            font-size: 10px;
            font-weight: bold;
            text-align: right;
        }
    }

    .game-result {
        color: red;
        font-weight: bold;
        &.winner {
            color: green;
        }
    }
`