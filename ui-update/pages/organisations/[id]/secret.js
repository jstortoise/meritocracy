import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { Card } from 'antd';
import { getClientDetail } from '../../../redux/ducks/client';

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
        return (
            <Card title={organisation.name} style={{ width: 400 }}>
                <p><b>APP_SECRET</b>:</p>
                <p>{organisation.secret}</p>
            </Card>
        );
    }
}

export default DetailPageWithRouter;