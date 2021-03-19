import * as common from './common';

// Get badge list
export const searchBy = params => common.sendPost('/rating/search', params);