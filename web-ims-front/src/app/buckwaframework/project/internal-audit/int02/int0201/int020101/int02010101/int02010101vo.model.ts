export interface Int02010101Vo {
     id: number;
     idSide: number;
     sideDtl: string;
     qtnLevel: number;
     seq: number;
     seqDtl: number;
     children?: Int02010101Vo[];
     idHeading: number;
}

export interface Int02010101FormVo {
     save: Int02010101Vo[];
     delete: Int02010101Vo[];
     idHead: number
}