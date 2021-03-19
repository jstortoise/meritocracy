import * as common from './common';

export const getFacebookInfo = fbToken => common.sendGet(`/social/facebook/detail/${fbToken}`);
