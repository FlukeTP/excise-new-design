export class BaseModel {
    isDeleted: string = "N";
    version: number = 1;
    createdBy: string = "";
    createdDate: Date;
    updatedBy: string = "";
    updatedDate: Date;
}