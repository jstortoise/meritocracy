import './style.scss';

const Hexagon = props => {
    return (
        <div className="hexagon" style={props.style}>
            <span style={{ fontSize: props.size || '14px' }}>{props.text}</span>
        </div>
    );
};

export default Hexagon;