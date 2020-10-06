import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
     name: 'isEmpty',
     pure: false
})
export class IsEmptyPipe implements PipeTransform {
     transform(value: any, args: any[] = []): any {
          let response = null;
          if (value || typeof (value) == "number") {
               response = value;
               if (typeof (value) === "string") {
                    if (typeof (value.trim()) === "string" && (value.trim()).length == 0) {
                         response = "-"
                    }
               }
          } else {
               response = "-"
          }
          return response;
     }
}
