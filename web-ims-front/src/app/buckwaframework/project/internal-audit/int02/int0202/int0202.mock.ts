export class Questionnaire {
    [x: string]: any;
    id?: number;
    headerId?: any;
    title?: string = "";
    content?: string = "";
    detail?: Detail[];
    conclusion?: any = true;
}

class Detail {
    [x: string]: any;
    order?: string;
    headerId?: any;
    detailId?: any;
    content?: string;
}

export const _Questionnaire: Questionnaire[] = [
    { // Questionnaire 1
        title: "ด้านการเงิน",
        conclusion: "",
        detail: [ // Detail[]
            {
                order: "1",
                headerId: "1",
                content: "กำหนดหน้าที่"
            },
            {
                order: "1.1",
                detailId: "0101",
                content: "ผู้รับผิดชอบด้านบัญชีและด้านการเงิน แยกจากกัน"
            },
            {
                order: "1.2",
                detailId: "0102",
                content: "ผู้รับผิดชอบด้านการเงินเป็นข้าราขการ/ลูกจ้างประจำ/พนักงานราชการ"
            },
            {
                order: "1.3",
                detailId: "0103",
                content: "มอบหมายผู้รับผิดชอบการจัดเก็บเงินเป็นลายลักษณ์อักษร"
            },
            {
                order: "1.4",
                detailId: "0104",
                content: "คำสั่งแต่งตั้งคณะกรรมการเก็บรักษาเงิน"
            },
            {
                order: "1.5",
                detailId: "0105",
                content: "คำสั่งแต่งตั้งคณะกรรมการรับและนำส่งเงินประจำวัน/ผู้ที่ได้รับมอบหมาย"
            },
            {
                order: "1.6",
                detailId: "0106",
                content: "คำสั่งแต่งตั้งคณะกรรมการตรวจสอบการรับ - จ่ายเงินประจำวัน/ผู้ที่ได้รับมอบหมาย"
            },{
                order: "2",
                headerId: "2",
                content: "เงินสด เงินฝากธนาคาร เงินฝากคลัง"
            },
            {
                order: "2.1",
                detailId: "0201",
                content: "การเก็บรักษาเงินสดในมือคงเหลือไว้ในตู้"
            },
            {
                order: "2.2",
                detailId: "0202",
                content: "จัดทำทะเบียนคุมเงินรายได้แผ่นดิน และรายงานประจำเดือน"
            },
            {
                order: "2.3",
                detailId: "0203",
                content: "การนำเงินนอกงบประมาณฝากธนาคารพาณิชย์ และภายในวงเงินที่กระทรวงการคลังกำหนด"
            },
            {
                order: "2.4",
                detailId: "0204",
                content: "นำส่งเงินบำรุงองค์กรปกครองส่วนท้องถิ่น (10778) ให้ อปท. อย่างน้อยเดือนละ 1 ครั้ง"
            },
        ]
    },
    { // Questionnaire 2
        title: "ด้านเจ้าหนี้",
        conclusion: "",
        detail: [ // Detail[]
            {
                order: "1",
                headerId: "1",
                content: "กำหนดหน้าที่"
            },
            {
                order: "1.1",
                detailId: "0101",
                content: "ผู้รับผิดชอบด้านบัญชีและด้านการเงิน แยกจากกัน"
            }
        ]
    },
    { // Questionnaire 3
        title: "ด้านระบบ e-payment",
        conclusion: "",
        detail: [ // Detail[]
            {
                order: "1",
                headerId: "1",
                content: "กำหนดหน้าที่"
            },
            {
                order: "1.1",
                detailId: "0101",
                content: "ผู้รับผิดชอบด้านบัญชีและด้านการเงิน แยกจากกัน"
            }
        ]
    },
    { // Questionnaire 4
        title: "ด้านระบบ GFMIS",
        conclusion: "",
        detail: [ // Detail[]
            {
                order: "1",
                headerId: "1",
                content: "กำหนดหน้าที่"
            },
            {
                order: "1.1",
                detailId: "0101",
                content: "ผู้รับผิดชอบด้านบัญชีและด้านการเงิน แยกจากกัน"
            }
        ]
    },
    { // Questionnaire 5
        title: "ด้านระบบบัญชีเกณฑ์คงค้าง",
        conclusion: "",
        detail: [ // Detail[]
            {
                order: "1",
                headerId: "1",
                content: "กำหนดหน้าที่"
            },
            {
                order: "1.1",
                detailId: "0101",
                content: "ผู้รับผิดชอบด้านบัญชีและด้านการเงิน แยกจากกัน"
            }
        ]
    },
    { // Questionnaire 6
        title: "ด้านจัดซื้อจัดจ้างพัสดุโดยวิธีคัดเลือก",
        conclusion: "",
        detail: [ // Detail[]
            {
                order: "1",
                headerId: "1",
                content: "กำหนดหน้าที่"
            },
            {
                order: "1.1",
                detailId: "0101",
                content: "ผู้รับผิดชอบด้านบัญชีและด้านการเงิน แยกจากกัน"
            }
        ]
    },
    { // Questionnaire 7
        title: "ด้านจัดซื้อจัดจ้างพัสดุโดยวิธีเฉพาะเจาะจง",
        conclusion: "",
        detail: [ // Detail[]
            {
                order: "1",
                headerId: "1",
                content: "กำหนดหน้าที่"
            },
            {
                order: "1.1",
                detailId: "0101",
                content: "ผู้รับผิดชอบด้านบัญชีและด้านการเงิน แยกจากกัน"
            }
        ]
    },
];

export default {
    _Questionnaire, // Mock Data
    Questionnaire // Class Model
};