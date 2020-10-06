export const SET_NOTIFY_COUNTS = "SET_NOTIFY_COUNTS";
export const UPDATE_NOTIFY_COUNTS = "UPDATE_NOTIFY_COUNTS";
export const ADD_NOTIFY_DETAILS = "ADD_NOTIFY_DETAILS";
export const SET_NOTIFY_DETAILS = "SET_NOTIFY_DETAILS";
export const UPDATE_NOTIFY_DETAILS = "UPDATE_NOTIFY_DETAILS";
export const SET_NOTIFY_DETAIL_LIST = "SET_NOTIFY_DETAIL_LIST";
export const UPDATE_NOTIFY_DETAIL_LIST = "UPDATE_NOTIFY_DETAIL_LIST";

// Count
export function setNotifyCounts(data) {
    return {
        type: SET_NOTIFY_COUNTS,
        payload: data
    };
}
export function updateNotifyCounts(type, data) {
    return {
        type: UPDATE_NOTIFY_COUNTS,
        payload: { type, data }
    };
}

// Notify Details
export function addNotifyDetails(data) {
    return {
        type: ADD_NOTIFY_DETAILS,
        payload: data
    };
}
export function setNotifyDetails(data) {
    return {
        type: SET_NOTIFY_DETAILS,
        payload: data
    };
}
export function updateNotifyDetails(type, data) {
    return {
        type: UPDATE_NOTIFY_DETAILS,
        payload: { type, data }
    };
}

// Notify Details List
export function setNotifyDetailList(data) {
    return {
        type: SET_NOTIFY_DETAIL_LIST,
        payload: data
    };
}
export function updateNotifyDetailList(index, data) {
    return {
        type: UPDATE_NOTIFY_DETAIL_LIST,
        payload: { index, data }
    };
}