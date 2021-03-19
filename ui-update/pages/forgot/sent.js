import Link from 'next/link';
import { Result, Button } from 'antd';
import './style.scss';

class SentPage extends React.Component {
    static async getInitialProps() {
        return { roles: [-1] };
    }

    render() {
        return (
            <Result
                status="success"
                title="Successfully sent email to reset your password"
                subTitle="Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder."
                extra={<Link href="/forgot"><Button>Resend</Button></Link>}
            />
        );
    }
}

export default SentPage;