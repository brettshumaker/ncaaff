import { useParams } from 'react-router-dom'

import SingleTeam from 'components/SingleTeam'

const Teams = () => {
    let { id } = useParams();
    return (
        <SingleTeam id={id} />
    )
}

export default Teams