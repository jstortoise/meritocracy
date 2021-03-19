import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { getClientDetail } from '../../../redux/ducks/client';
import { Card, Row, Col, Icon, Avatar } from 'antd';
import ProgressBar from '../../../components/ProgressBar';
import './style.scss';

const DetailPageWithRouter = props => {
    const router = useRouter();
    return (<DetailPage {...props} router={router}/>);
};

DetailPageWithRouter.getInitialProps = async () => {
    return { roles: [0, 1, 2, 3] };
};

@connect(state => state)
class DetailPage extends React.Component {
    state = {
        organisation: {}
    };
    
    componentDidMount() {
        this.getOrganisation();
    }

    getOrganisation = () => {
        const { router } = this.props;
        const { id } = router.query;
        getClientDetail(id, res => {
            if (res.success) {
                this.setState({ organisation: res.data });
            }
        });
    };

    render() {
        const { organisation } = this.state;
        let type = 'Legacy';
        if (organisation.type == 1) {
            type = 'Certified';
        } else if (organisation.type == 2) {
            type = 'Public';
        } else if (organisation.type == 3) {
            type = 'Private';
        }
        
        return (
            <Card
                className="organisation-panel"
                actions={[
                    <Icon type="star" key="star" />,
                    <Icon type="read" key="read" />,
                    <Icon type="bar-chart" key="bar-chart" />,
                    <Icon type="setting" key="setting" />,
                ]}
            >
                <div style={{margin: '-9px'}}>
                    <Row>
                        <Card.Meta
                            avatar={
                                <Avatar shape="square" src="/static/images/organisation_logo.png" />
                            }
                            title={organisation.name}
                            description={type}
                        />
                    </Row>
                    <Row>
                        <ProgressBar value={organisation.meritPoint}/>
                    </Row>
                    <Row type="flex" justify="space-between">
                        <Col>Type</Col>
                        <Col>{type}</Col>
                    </Row>
                    <Row type="flex" justify="space-between">
                        <Col>Owner</Col>
                        <Col>{organisation.ownerFullname}</Col>
                    </Row>
                    <Row type="flex" justify="space-between">
                        <Col>URL</Col>
                        <Col>{organisation.rootUrl}</Col>
                    </Row>
                    <Row type="flex" justify="space-between">
                        <Col>Members Count</Col>
                        <Col>{organisation.type === 2 ? '-' : organisation.membersCount}</Col>
                    </Row>
                    <Row type="flex" justify="space-between">
                        <Col>Active Sessions</Col>
                        <Col>{organisation.type === 2 ? '-' : (organisation.sessions && organisation.sessions.length)}</Col>
                    </Row>
                </div>
            </Card>
        );
    }
}

export default DetailPageWithRouter;