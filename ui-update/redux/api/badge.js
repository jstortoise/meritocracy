import * as common from './common';

// Get badge list
export const getBadgeList = () => common.sendGet(`/badge/list`);