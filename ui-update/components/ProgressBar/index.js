import { Divider } from 'antd';
import Hexagon from '../Hexagon';
import './style.scss';

const ProgressBar = props => {
    const value = props.value || 0;
    let s_value = Math.floor(value);
    let e_value = Math.ceil(value);
    if (e_value == s_value) {
        // if (s_value > 0) {
        //     s_value--;
        // } else {
            e_value++;
        // }
    }
    const percent = (value - s_value) * 100 + '%';

    return (
        <div className="progressbar" style={props.style}>
            <Hexagon text={s_value} size={20}/>
            <div className="background">
                <div className="percent" style={{ width: percent }}></div>
                <Divider type="vertical"/>
                <Divider type="vertical"/>
                <Divider type="vertical"/>
                <Divider type="vertical"/>
                <Divider type="vertical"/>
                <Divider type="vertical"/>
                <Divider type="vertical"/>
                <Divider type="vertical"/>
                <Divider type="vertical"/>
                <Divider type="vertical"/>
                <Divider type="vertical"/>
            </div>
            <Hexagon text={e_value} size={20}/>
        </div>
    );
};

export default ProgressBar;