import * as common from './common';

// Notifications
export const getNotificationList = (isRead = -1) => common.sendGet(`/notification/list/${isRead}`);
export const updateNotification = (id, params) => common.sendPut(`/notification/${id}/update`, params);
export const deleteNotification = id => common.sendDelete(`/notification/delete/${id}`);
