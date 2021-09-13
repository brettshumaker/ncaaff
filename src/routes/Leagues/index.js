import { useParams } from 'react-router-dom'

import SingleLeague from 'components/SingleLeague'

const Leagues = () => {
    let { id } = useParams();
    id = id === undefined ? 1 : id
    return (
        <SingleLeague id={parseInt(id)} />
    )
}

export default Leagues