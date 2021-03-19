import { Provider } from 'react-redux';
import App from 'next/app';
import withRedux from 'next-redux-wrapper';
import Head from 'next/head';
import NProgress from 'nprogress';
import Router from 'next/router';
import 'antd/dist/antd.css';
import Layout from '../components/Layout';
import DefaultLayout from '../components/Layout/DefaultLayout';
import Error from './_error';
import Loading from './loading';
import { initStore } from '../redux';
import { checkAuth, logout } from '../redux/ducks/auth';
import checkRouter from '../utils/init';
import { getCookie } from '../utils/cookie';
import IdleTimer from 'react-idle-timer';

Router.events.on('routeChangeStart', url => NProgress.start());

Router.events.on('routeChangeComplete', () => {
    window.scrollTo(0, 0);
    NProgress.done();
});
Router.events.on('routeChangeError', () => NProgress.done());

export const isServer = () => typeof window === `undefined`;

export default withRedux(initStore, { debug: false })(
    class MyApp extends App {
        static async getInitialProps({ Component, ctx }) {
            // check token valid
            let pageProps = {};

            if (Component.getInitialProps) {
                pageProps = await Component.getInitialProps(ctx);
            }

            // check auth
            try {
                const { dispatch } = ctx.store;
                const user = await checkAuth(dispatch, ctx);
                const { roles } = pageProps;

                pageProps.accessTokenLifespan = user.accessTokenLifespan || -1;

                if (roles && !roles.includes(-1)) {
                    if (!(user.role >= 0)) {
                        Router.push('/expired');
                    } else if (!roles.includes(user.role)) {
                        pageProps.err = true;
                    }
                }
            } catch (e) { }

            checkRouter(ctx, pageProps);

            return { pageProps };
        }

        constructor(props) {
            super(props);

            this.idleTimer = null;
            this.onIdle = this._onIdle.bind(this);
        }

        _onIdle(e) {
            const { roles } = this.props.pageProps;
            if (roles && !roles.includes(-1) && !(getCookie('expired') * 1)) {
                this.idleTimer.pause();
                const { dispatch } = this.props.store;
                dispatch(logout(true));
            }
        }

        componentDidUpdate() {
            this.onIdle = this._onIdle.bind(this);
            this.idleTimer.reset();
        }

        render() {
            const { Component, pageProps, store, router } = this.props;
            const { accessTokenLifespan } = pageProps;

            let isLogin = false;
            if (router.asPath.startsWith('/login?redirectUrl')) {
                isLogin = true;
            }

            return isServer() && !Component ? (<Loading />) : (
                <div>
                    <Head>
                        <title>Meritocracy</title>
                    </Head>
                    <Provider store={store}>
                        {isLogin ? (
                            <DefaultLayout {...pageProps}>
                                <Component {...pageProps} />
                            </DefaultLayout>
                        ) : (
                            <Layout {...pageProps}>
                                <IdleTimer
                                    ref={ref => { this.idleTimer = ref }}
                                    startOnMount={false}
                                    onIdle={this.onIdle}
                                    debounce={1000}
                                    timeout={1000 * accessTokenLifespan} />
                                {pageProps.err ? (
                                    <Error />
                                ) : (
                                    <Component {...pageProps} />
                                )}
                            </Layout>
                        )}
                    </Provider>
                </div>
            );
        }
    }
);