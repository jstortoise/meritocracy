import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { verifyUserEmail } from '../../redux/ducks/auth';

const VerifyEmailWithRouter = props => {
    const router = useRouter();
    return (<VerifyEmail {...props} router={router}/>);
};

@connect(state => state)
class VerifyEmail extends React.Component {
    componentDidMount() {
        const { router, dispatch } = this.props;
        const { id } = router.query;
        dispatch(verifyUserEmail(id));
    }

    render() {
        return null;
    }
}

export default VerifyEmailWithRouter;