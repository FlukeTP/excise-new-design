import { Injectable } from "@angular/core";

@Injectable()
export class Int06051Service {

    private data: any;
    constructor() {
        // TODO
    }

    setData(data: any): void {
        this.data = Object.assign({}, data); // Assign new Addres Object
    }

    getData(): any {
        return this.data;
    }

}