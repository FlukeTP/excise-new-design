import { ExciseTax } from './excise-tax.model';
import { File } from './file.model';
export class Excise {
    [x: string]: any
    worksheetHeaderId: number
    analysNumber: string
    exciseId: string
    companyName: string
    factoryName: string
    factoryAddress: string
    exciseOwnerArea: string
    productType: string
    exciseOwnerArea1: string
    totalAmount: number
    percentage: number
    totalMonth: number
    decideType: string
    flag: string
    firstMonth: number
    lastMonth: number
    createBy: string
    createDatetime: any
    updateBy: string
    updateDatetime: any
    exciseTax: ExciseTax[]
    file: File[]
}