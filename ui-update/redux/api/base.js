import * as common from './common';

// Get Base Detail List
export const getBaseDetailList = type => common.sendGet(`/base/${type}/list`);