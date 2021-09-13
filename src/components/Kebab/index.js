import styled from 'styled-components'

const StyledKebab = styled.button`
    /* position: absolute;
    top: 5%;
    left: 2rem; */
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    width: 2rem;
    height: 2rem;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 10;

    &:focus {
        outline: none;
    }

    div {
        width: ${({ open }) => open ? '2em': '6px'};
        height: ${({ open }) => open ? '.3em': '6px'};
        background: var(--white);
        border-radius: 10px;
        transition: all 0.3s linear;
        position: relative;
        transform-origin: 1px;

        :first-child {
            transform: ${({ open }) => open ? 'rotate(45deg)' : 'rotate(0)'};
        }

        :nth-child(2) {
            opacity: ${({ open }) => open ? '0' : '1'};
            transform: ${({ open }) => open ? 'translateX(20px)' : 'translateX(0)'};
        }

        :nth-child(3) {
            transform: ${({ open }) => open ? 'rotate(-45deg)' : 'rotate(0)'};
        }
    }
`

const Kebab = ({open, setOpen}) => {
    return (
        <StyledKebab open={open} onClick={() => setOpen(!open)}>
            <div />
            <div />
            <div />
        </StyledKebab>
    )
}

export default Kebab