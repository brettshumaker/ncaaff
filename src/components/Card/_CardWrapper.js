import styled from 'styled-components'
import Card from 'components/Card/index'

const StyledWrapper = styled.div`
    padding: 1em;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
    grid-gap: 1rem;
`

const CardWrapper = ( { data } ) => {
    return (
        <StyledWrapper>
            { data.map( (team) => {
                return <Card key={team.team.id} team={team.team} />
            })}
        </StyledWrapper>
    )
}

export default CardWrapper