const URL = "http://150.95.24.42:8080/ims-webapp";
// const URL = "http://192.168.1.103:8080/ims-webapp";

const HEADER = {
    JSON: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    URLENCODED: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    }
}

const API = {
    POST: async function (url, body, headers?) {
        return fetch(`${URL}/${url}`, {
            method: 'POST',
            headers: headers ? HEADER.URLENCODED : HEADER.JSON,
            body: headers ? body : JSON.stringify(body),
            credentials: 'same-origin'
        }).then(response => {
            return headers ? response : (response ? JSON.parse(response._bodyText) : "");
        }).catch(error => {
            console.error("POST ERROR => ", error);
        })
    },
    GET: function (url, headers?) {
        return fetch(`${URL}/${url}`, {
            method: 'GET',
            headers: headers ? HEADER.URLENCODED : HEADER.JSON,
            credentials: 'same-origin'
        }).then(response => {
            return headers ? response : (response ? JSON.parse(response._bodyText) : "");
        }).catch(error => {
            console.error("GET ERROR => ", error);
        })
    },
    DELETE: function (url, headers?) {
        return fetch(`${URL}/${url}`, {
            method: 'DELETE',
            headers: headers ? HEADER.URLENCODED : HEADER.JSON,
            credentials: 'same-origin'
        }).then(response => {
            return headers ? response : (response ? JSON.parse(response._bodyText) : "");
        }).catch(error => {
            console.error("DELETE ERROR => ", error);
        })
    },
}

export default API;