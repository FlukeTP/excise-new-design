export const SET_USER = "SET_USER";
export const UPDATE_USER = "UPDATE_USER";

export function setUser(user) {
    return {
        type: SET_USER,
        payload: user
    };
}
export function updateUser(user) {
    return {
        type: UPDATE_USER,
        payload: user
    };
}