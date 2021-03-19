import { Card, Row, Col, Icon, Avatar } from 'antd';
import ProgressBar from '../../ProgressBar';
import { dateFormat } from '../../../redux/ducks/app';
import './style.scss';

class OrganisationPanel extends React.Component {
    render() {
        const { data, style, onClick } = this.props;

        return (
            <Card
                actions={[
                    <Icon type="star" key="star" />,
                    <Icon type="read" key="read" />,
                    <Icon type="bar-chart" key="bar-chart" />,
                    <Icon type="setting" key="setting" />,
                ]}
                className="organisation-panel"
                onClick={onClick}
                style={style}
            >
                <div style={{margin: '-9px'}}>
                    <Row>
                        <Card.Meta
                            avatar={
                                <Avatar shape="square" src="/static/images/organisation_logo.png" />
                            }
                            title={data.name}
                            description={<p>Crypto Mining<br/>Finance</p>}
                        />
                    </Row>
                    <Row>
                        <ProgressBar value={data.meritPoint}/>
                    </Row>
                    <Row type="flex" justify="space-between">
                        <Col>Total users</Col>
                        <Col>{data.type === 2 ? '-' : data.totalUsers}</Col>
                    </Row>
                    <Row type="flex" justify="space-between">
                        <Col>Online</Col>
                        <Col>{data.type === 2 ? '-' : 0}</Col>
                    </Row>
                    <Row type="flex" justify="space-between">
                        <Col>Created</Col>
                        <Col>{dateFormat(new Date(data.createdAt))}</Col>
                    </Row>
                    <Row type="flex" justify="space-between">
                        <Col>Admins</Col>
                        <Col>{data.adminCount}</Col>
                    </Row>
                    <Row type="flex" justify="space-between">
                        <Col>Managers</Col>
                        <Col>{data.type === 2 ? '-' : data.managerCount}</Col>
                    </Row>
                </div>
            </Card>
        );
    };
}

export default OrganisationPanel;