import { Layout as AntLayout, BackTop } from 'antd';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import TopBar from '../TopBar';
import MainMenu from '../Menu/MainMenu';
import { connect } from 'react-redux';

const query = {
	'screen-xs': {
		maxWidth: 575,
	},
	'screen-sm': {
		minWidth: 576,
		maxWidth: 767,
	},
	'screen-md': {
		minWidth: 768,
		maxWidth: 991,
	},
	'screen-lg': {
		minWidth: 992,
		maxWidth: 1199,
	},
	'screen-xl': {
		minWidth: 1200,
		maxWidth: 1599,
	},
	'screen-xxl': {
		minWidth: 1600,
	},
};

@connect(state => state)
class Layout extends React.Component {
    render() {
        const { user } = this.props.app;
        const { children } = this.props;
        let isVerified = false;

        if (user && user.emails) {
            const primary_email = user.emails.find(obj => obj.is_primary === true);
            if (primary_email && primary_email.status === 1) {
                isVerified = true;
            }
        }
        
        return (
            <ContainerQuery query={query}>
                {params => (
                    <div className={classNames(params)}>
                        <AntLayout style={{ minHeight: '100vh' }}>
                            <AntLayout.Header>
                                <TopBar showProfile={true}/>
                            </AntLayout.Header>
                            <BackTop />
                            <AntLayout>
                                {user.username && (<AntLayout.Sider>
                                    <MainMenu />
                                </AntLayout.Sider>)}
                                <AntLayout.Content style={{ height: '100%' }}>
                                    <div className="utils__content">
                                        {children}
                                    </div>
                                </AntLayout.Content>
                            </AntLayout>
                            <AntLayout.Footer>
                                {/* <Footer /> */}
                            </AntLayout.Footer>
                        </AntLayout>
                    </div>
                )}
            </ContainerQuery>
        );
    }
}

export default Layout;