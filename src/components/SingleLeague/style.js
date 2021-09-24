import styled from "styled-components"

export const CompactRosterTeam = styled.div`
    display: inline
`

export const StyledLeagueUserRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    flex-grow: 1;
    border-bottom: thin solid 1px;
    position: relative;
    z-index: 0;
    background: #ffffff;
    padding: 1em;
    padding-left: ${props => props.hasRankBlock ? '115px' : ''};
    border-radius: 4px;
    border: thin solid #bfbfbf;
    box-shadow: inset 31px 32px 87px #0000001a;
    margin-bottom: 1.5em;

    > h3 {
        margin-top: 0;
    }
`

export const RankBlock = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    width: 100px;
    height: 100%;
    display: grid;
    align-items: center;
    background: var(--black);
    color: var(--white);
    font-size: 30px;
    font-weight: bold;
    text-align: center;
    border-radius: 4px 0 0 4px;

    &.rank-1 {
        background: linear-gradient(to bottom, #dec25b, #dcb74d, #e4a910);
    }

    &.rank-2 {
        background: linear-gradient(to bottom,#949494,#7d7d7d,#5d5d5d);
    }

    &.rank-3 {
        background: linear-gradient(to bottom,#c59e57,#d8b679,#9a6e1f);
    }

    p {
        margin: 0;
    }
`