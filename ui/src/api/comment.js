import * as common from './common';

export const addComment = commentInfo => {
	return common.sendPost('/comment/add', commentInfo);
};

export const deleteComment = _id => {
	return common.sendGet(`/comment/delete/${_id}`);
};

export const getComments = clientId => {
	return common.sendGet(`/comment/${clientId}/list`);
};

export const getOrgDetail = clientId => {
	return common.sendGet(`/comment/detail/${clientId}`);
};
