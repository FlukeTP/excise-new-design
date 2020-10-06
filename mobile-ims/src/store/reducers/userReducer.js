import { USER } from '../actions/index';
import _ from 'lodash';

let user = {
    id: "57024255",
    name: "สิทธิศักดิ์ นามสมมุติ",
    position: "เจ้าหน้าที่ฝ่ายตรวจสอบอื่นๆ"
};
export default function (state = user, action) {
    switch (action.type) {
        case USER.SET_USER:
            let setState = _.clone(state);
            setState = action.payload;
            return setState;
        case USER.UPDATE_USER:
            let updateState = _.clone(state);
            updateState = action.payload;
            return updateState;
        default:
            return state;
    }
}