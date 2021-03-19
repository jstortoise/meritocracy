import Router from 'next/router';
import { getCookie } from './cookie';

// checks if the page is being loaded on the server, and if so, get auth token from the cookie:
export default function(ctx, pageProps) {
    const { roles } = pageProps;
    const g_token = getCookie('token', ctx.req);
    const expired = getCookie('expired', ctx.req) * 1;
    const { user } = ctx.store.getState().app;

    if (ctx.isServer) {
        const { url } = ctx.req;
        if (url != '/loading' && !url.startsWith("/login?redirectUrl")) {
            if (roles) {
                if (g_token) {
                    if (user.role >= 0 && !expired && roles.includes(-1)) {
                        ctx.res.writeHead(302, { Location: '/dashboard' });
                        ctx.res.end();
                    } else if (expired && !roles.includes(-1)) {
                        ctx.res.writeHead(302, { Location: '/expired' });
                        ctx.res.end();
                    }
                } else if (!g_token && !roles.includes(-1)) {
                    ctx.res.writeHead(302, { Location: '/login' });
                    ctx.res.end();
                }
            }
        }
    } else {
        const { pathname } = ctx;
        if (pathname != '/loading') {
            if (roles) {
                if (g_token) {
                    if (user.role >= 0 && !expired && roles.includes(-1)) {
                        Router.push('/dashboard');
                    } else if (expired && !roles.includes(-1)) {
                        Router.push('/expired');
                    }
                } else if (!g_token && !roles.includes(-1)) {
                    Router.push('/login');
                }
            }
        }
    }
}