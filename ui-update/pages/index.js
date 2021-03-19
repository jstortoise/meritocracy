import Link from 'next/link';
import { Button } from 'antd';
import './style.scss';

class Home extends React.Component {
    static async getInitialProps() {
        return { roles: [-1] };
    }

    render() {
        return (
            <div className="landing-page">
                <div className="header-left">
                    <h2>Be in charge of your Identity</h2>
                    <p>Give your Community Universal Authentication in web, mobile and legacy applications</p>
                </div>
                <div className="header-right">
                    <h2>Blockchain powered</h2>
                    <p>
                        Unparalleled transparency, Enhanced Security at your fingertips,<br/>
                        Retain your Identity, Ratings, and Badges wherever you go.
                    </p>
                </div>
                <div className="clear"></div>
                <div className="signup-container">
                    <Link href="/signup">
                        <Button
                            type="primary"
                            className="btn-purple"
                            size="small"
                            shape="round"
                        >
                            SIGN UP
                        </Button>
                    </Link>
                    <h2>For a Free account today!</h2>
                </div>
            </div>
        );
    };
}

export default Home;