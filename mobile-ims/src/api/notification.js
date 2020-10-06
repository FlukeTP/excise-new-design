import API from './api';

const SIMPLE = 'api/mobile-api/simpleNotificationMockup';
const COUNT = 'api/mobile-api/countNotification';
const DETAIL = 'api/mobile-api/viewTaCriteriaByTaPlanTaxAuditId';
const DETAIL_BY_ID = 'api/mobile-api/findPlanTaxAuditByAnalysNumber';

function simple(type) {
    return API.POST(
        SIMPLE,
        { type: type }
    ).then(response => {
        return response;
    });
}

function count() {
    return API.POST(
        COUNT,
        {}
    ).then(response => {
        return response;
    });
}

function detail(id, ref) {
    return API.POST(
        DETAIL,
        {
            id: id,
            analysNumber: ref
        }
    ).then(response => {
        return response;
    });
}

function detailById(ref) {
    return API.POST(
        DETAIL_BY_ID,
        {
            analysNumber: ref
        }
    ).then(response => {
        return response;
    });
}

export {
    simple,
    count,
    detail,
    detailById
};