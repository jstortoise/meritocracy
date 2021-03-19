import axios from 'axios';
import getConfig from 'next/config';
import { getCookie, setCookie } from '../../utils/cookie';

const { publicRuntimeConfig } = getConfig();

export const API_URL = publicRuntimeConfig.API_URL;

const checkHeaders = result => {
    if (result.headers) {
        if (result.headers['x-refresh-token']) {
            setCookie('token', result.headers['x-refresh-token']);
        }
    }
    setCookie('expired', 0);
    if (result.data) {
        if (result.data.token === false && !result.data.success) {
            setCookie('expired', 1);
        }
    }
};

export const sendGet = async (url, req = null) => {
    let result = {}
    try {
        result = await axios.get(API_URL + url, {
            headers: {
                'Content-Type': 'application/json',
                'x-token': getCookie('token', req),
            },
        });
    } catch(e) {}

    checkHeaders(result);
    return result;
};

export const sendPost = async (url, body = {}, req = null) => {
    let result = {};
    try {
        result = await axios.post(API_URL + url, body, {
            headers: {
                'Content-Type': 'application/json',
                'x-token': getCookie('token', req),
            },
        });
    } catch(e) {}

    checkHeaders(result);
    return result;
};

export const sendPut = async (url, body = {}, req = null) => {
    let result = {};
    try {
        result = await axios.put(API_URL + url, body, {
            headers: {
                'Content-Type': 'application/json',
                'x-token': getCookie('token', req),
            },
        });
    } catch(e) {}

    checkHeaders(result);
    return result;
};

export const sendDelete = async (url, req = null) => {
    let result = {};
    try {
        result = await axios.delete(API_URL + url, {
            headers: {
                'Content-Type': 'application/json',
                'x-token': getCookie('token', req),
            },
        });
    } catch(e) {}

    checkHeaders(result);
    return result;
};
