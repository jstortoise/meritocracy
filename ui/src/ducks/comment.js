import { createReducer } from 'redux-act';

import * as CommentAPI from 'api/comment';

export const REDUCER = 'comment';

export const addComment = async (commentInfo, callback) => {
	let data = { success: false };
	try {
		const result = await CommentAPI.addComment(commentInfo);
		if (result.data) {
			data = result.data;
		}
	} catch (e) {}
	callback(data);
};

export const deleteComment = async (_id, callback) => {
	const result = await CommentAPI.deleteComment(_id);
	callback(result.data);
};

export const getComments = async (clientId, callback) => {
	const result = await CommentAPI.getComments(clientId);
	callback(result.data);
};

export const getOrgDetail = async (clientId, callback) => {
	const result = await CommentAPI.getOrgDetail(clientId);
	callback(result.data);
};

const initialState = {};

export default createReducer({}, initialState);
