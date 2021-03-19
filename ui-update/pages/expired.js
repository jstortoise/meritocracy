import Link from 'next/link';
import { Result, Button } from 'antd';

class Expired extends React.Component {
    render() {
        return (
            <Result
                title="Your session has been expired"
                status="403"
                extra={
                    <Link href="/login">
                        <Button type="primary" key="login">
                            Click here to login
                        </Button>
                    </Link>
                }
            />
        );
    }
}

export default Expired;