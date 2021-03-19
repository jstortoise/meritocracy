import { connect } from 'react-redux';
import Link from 'next/link';
import ProfileMenu from './ProfileMenu';
import { Input, Row, Col } from 'antd';
import logo_sm from '../../public/static/images/logo_sm.svg';
import logo_text from '../../public/static/images/logo_text.svg';
import '../style.scss';
import Router from 'next/router';
import { getParamsFromQuery, getQueryFromParams } from '../../redux/ducks/app';

const isServer = () => typeof window === `undefined`;

@connect(state => state)
class TopBar extends React.Component {
    onSearch = val => {
        let params = getParamsFromQuery(window.location.href);
        params['keyword'] = val;
        let query = getQueryFromParams(params);
        Router.replace(`/search?${query}`);
    }

    render() {
        const { showProfile } = this.props;
        const { user } = this.props.app;
        var keyword = '';
        if (!isServer()) {
            if (Router.pathname === '/search') {
                keyword = getParamsFromQuery(window.location.href).keyword;
            }
        }
        return (
            <div className="topbar">
                <Row type="flex" align="middle" justify="space-between">
                    <Col lg={{ span: 12 }} md={{ span: 16 }} sm={{ span: 18 }} xs={{ span: 16 }}>
                        <Row type="flex" align="middle" justify="start" gutter={{ md: 48, sm: 8, xs: 0  }} style={{ margin: 0 }}>
                            <Col xl={{ span: 10 }} lg={{ span: 12 }} md={{ span: 8 }} sm={{ span: 6 }} xs={{ span: 4 }} >
                                <Link href="/">
                                    <a>
                                        <div className="logo">
                                            <img src={logo_sm} alt="Logo" />
                                            <img src={logo_text} alt="Meritocracy" style={{ marginLeft: '17px' }} className="brand"/>
                                        </div>
                                    </a>
                                </Link>
                            </Col>
                            {(user.username && showProfile) && (
                                <Col xl={{ span: 14 }} lg={{ span: 12 }} md={{ span: 16 }} sm={{ span: 18 }} xs={{ span: 20 }} >
                                    <div className="search-container">
                                        <Input.Search
                                            placeholder="Accounts, Organisations, Features"
                                            style={{ float: 'left', maxWidth: '500px', minWidth: '120px', width: '100%' }}
                                            defaultValue={keyword}
                                            onSearch={val => this.onSearch(val)}
                                        />
                                    </div>
                                </Col>
                            )}
                        </Row>
                    </Col>
                    <Col lg={{ span: 12 }} md={{ span: 8 }} sm={{ span: 6 }} xs={{ span: 8 }}>
                        <div className="topbar__right">
                            <ProfileMenu showProfile={showProfile} />
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default TopBar;
