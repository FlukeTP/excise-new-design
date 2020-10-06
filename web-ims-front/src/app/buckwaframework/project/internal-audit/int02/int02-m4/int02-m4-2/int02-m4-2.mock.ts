export class Result {
    [x: string]: any;
    title?: string;
    pass?: number;
    fail?: number;
    risk?: string;
    detail?: Detail[];
}

class Detail {
    [x: string]: any;
    title?: string;
    approve?: number;
    reject?: number;
    risk?: string;
}

export const _Result: Result[] = [
    { // Result 1
        id: 1,
        title: "สสพ.แม่ฮ่องสอน",
        pass: 2,
        fail: 3,
        risk: "ปานกลาง",
        detail: [
            { // Detail 1
                title: "ด้านการเงิน",
                approve: 8,
                reject: 2,
                risk: "ต่ำ"
            },
            { // Detail 2
                title: "ด้านเจ้าหนี้",
                approve: 7,
                reject: 2,
                risk: "ต่ำ"
            },
            { // Detail 3
                title: "ด้านระบบ e-payment",
                approve: 2,
                reject: 9,
                risk: "สูง"
            },
            { // Detail 4
                title: "ด้านระบบ GFMIS",
                approve: 2,
                reject: 10,
                risk: "สูง"
            },
            { // Detail 5
                title: "ด้านระบบ ",
                approve: 1,
                reject: 8,
                risk: "สูง"
            },
        ]
    },
    { // Result 2
        id: 2,
        title: "สสพ.นนทบุรี",
        pass: 2,
        fail: 3,
        risk: "ปานกลาง",
        detail: [
            { // Detail 1
                title: "ด้านการเงิน",
                approve: 8,
                reject: 2,
                risk: "ต่ำ"
            },
            { // Detail 2
                title: "ด้านเจ้าหนี้",
                approve: 7,
                reject: 2,
                risk: "ต่ำ"
            },
            { // Detail 3
                title: "ด้านระบบ e-payment",
                approve: 2,
                reject: 9,
                risk: "สูง"
            },
            { // Detail 4
                title: "ด้านระบบ GFMIS",
                approve: 2,
                reject: 10,
                risk: "สูง"
            },
            { // Detail 5
                title: "ด้านระบบ ",
                approve: 1,
                reject: 8,
                risk: "สูง"
            },
        ]
    },
    { // Result 3
        id: 3,
        title: "สสพ.ลำปาง",
        pass: 1,
        fail: 4,
        risk: "สูง",
        detail: [
            { // Detail 1
                title: "ด้านการเงิน",
                approve: 2,
                reject: 8,
                risk: "สูง"
            },
            { // Detail 2
                title: "ด้านเจ้าหนี้",
                approve: 2,
                reject: 9,
                risk: "สูง"
            },
            { // Detail 3
                title: "ด้านระบบ e-payment",
                approve: 3,
                reject: 9,
                risk: "สูง"
            },
            { // Detail 4
                title: "ด้านระบบ GFMIS",
                approve: 3,
                reject: 10,
                risk: "สูง"
            },
            { // Detail 5
                title: "ด้านระบบ ",
                approve: 7,
                reject: 3,
                risk: "ต่ำ"
            },
        ]
    },
    { // Result 4
        id: 4,
        title: "สสพ.อุทัยธานี",
        pass: 3,
        fail: 2,
        risk: "ปานกลาง",
        detail: [
            { // Detail 1
                title: "ด้านการเงิน",
                approve: 2,
                reject: 8,
                risk: "สูง"
            },
            { // Detail 2
                title: "ด้านเจ้าหนี้",
                approve: 2,
                reject: 9,
                risk: "สูง"
            },
            { // Detail 3
                title: "ด้านระบบ e-payment",
                approve: 8,
                reject: 1,
                risk: "ต่ำ"
            },
            { // Detail 4
                title: "ด้านระบบ GFMIS",
                approve: 8,
                reject: 2,
                risk: "ต่ำ"
            },
            { // Detail 5
                title: "ด้านระบบ ",
                approve: 7,
                reject: 3,
                risk: "ต่ำ"
            },
        ]
    },
    { // Result 5
        id: 5,
        title: "สสพ.กาญจนบุรี",
        pass: 4,
        fail: 1,
        risk: "ต่ำ",
        detail: [
            { // Detail 1
                title: "ด้านการเงิน",
                approve: 7,
                reject: 2,
                risk: "ต่ำ"
            },
            { // Detail 2
                title: "ด้านเจ้าหนี้",
                approve: 2,
                reject: 9,
                risk: "สูง"
            },
            { // Detail 3
                title: "ด้านระบบ e-payment",
                approve: 8,
                reject: 1,
                risk: "ต่ำ"
            },
            { // Detail 4
                title: "ด้านระบบ GFMIS",
                approve: 8,
                reject: 2,
                risk: "ต่ำ"
            },
            { // Detail 5
                title: "ด้านระบบ ",
                approve: 7,
                reject: 3,
                risk: "ต่ำ"
            },
        ]
    },
    { // Result 6
        id: 6,
        title: "สสพ.พังงา",
        pass: 4,
        fail: 1,
        risk: "ต่ำ",
        detail: [
            { // Detail 1
                title: "ด้านการเงิน",
                approve: 7,
                reject: 2,
                risk: "ต่ำ"
            },
            { // Detail 2
                title: "ด้านเจ้าหนี้",
                approve: 2,
                reject: 9,
                risk: "สูง"
            },
            { // Detail 3
                title: "ด้านระบบ e-payment",
                approve: 8,
                reject: 1,
                risk: "ต่ำ"
            },
            { // Detail 4
                title: "ด้านระบบ GFMIS",
                approve: 8,
                reject: 2,
                risk: "ต่ำ"
            },
            { // Detail 5
                title: "ด้านระบบ ",
                approve: 7,
                reject: 3,
                risk: "ต่ำ"
            },
        ]
    }
];

export default { Result, _Result };