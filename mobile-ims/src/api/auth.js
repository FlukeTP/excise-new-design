import API from './api';

const LOGIN = 'api/security/login';
const DETAIL = 'api/restful/userDetail';

function login(username = "", password = "") {
    return API.POST(
        LOGIN,
        `username=${username}&password=${password}`,
        true
    ).then(response => {
        if (response.status == 200) {
            return true;
        } else {
            return false;
        }
    });
}

function logout() {
    return API.DELETE(
        LOGIN,
        true
    ).then(response => {
        if (response.status == 200) {
            return true;
        } else {
            return false;
        }
    });
}

function detail() {
    return API.GET(
        DETAIL
    ).then(response => {
        return response;
    });
}

export {
    login,
    logout,
    detail
};