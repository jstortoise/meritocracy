import { Row, Col, Button, Avatar, Typography } from 'antd';
import './style.scss';

class SliderComponent extends React.Component {
    static async getInitialProps() {
        return { roles: [0, 1, 2, 3] };
    }

    onPrev = () => {
        const { onChange, current, data } = this.props;
        if (onChange && data && current > 0) {
            onChange(current - 1);
        }
    };

    onNext = () => {
        const { onChange, current, data } = this.props;
        if (onChange && data && current < data.length - 1) {
            onChange(current + 1);
        }
    };

    render() {
        const { data, current } = this.props;
        let title = 'ORGANISATION MEMBER RATINGS',
            description = 'LIFESTYLE GALAXY ORGANIZATION';
        if (data && data.length > 0) {
            title = data[current].clientName;
            description = data[current].description;
        }

        return (
            <Row className="organisation-slider" type="flex" align="middle" gutter={5}>
                <Col>
                    <Button icon="left" shape="round" onClick={this.onPrev} disabled={current === 0}></Button>
                </Col>
                <Col>
                    <Row type="flex" align="middle">
                        <Col><Avatar shape="square" src="/static/images/organisation_logo.png" /></Col>
                        <Col>
                            <Typography.Text>
                                <span className="title">{title}</span>
                                <br/>
                                <span className="description">{description}</span>
                            </Typography.Text>
                        </Col>
                    </Row>
                </Col>
                <Col>
                    <Button icon="right" shape="round" onClick={this.onNext} disabled={current === data.length - 1}></Button>
                </Col>
            </Row>
        );
    }
}

export default SliderComponent;