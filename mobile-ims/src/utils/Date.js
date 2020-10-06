export const DATE = {
    MONTH: [
        'ม.ค.',
        'ก.พ.',
        'มี.ค.',
        'เม.ย.',
        'พ.ค.',
        'ก.ค.',
        'มิ.ย.',
        'ส.ค.',
        'ก.ย.',
        'ต.ค.',
        'พ.ย.',
        'ธ.ค.',
    ],
}

export function EnDateToThDate(dateStr: string) {
    const DATE_REGEXP: RegExp = new RegExp('^(0?[1-9]|[1-2][0-9]|3[0-1])/(0?[1-9]|1[0-2])/([0-9]{4})$', 'gi');
    return dateStr.replace(DATE_REGEXP,
      (str: string, day: string, month: string, year: string) => {
        return `${day}/${month}/${parseInt(year, 10) + 543}`;
      });
  }
  
  export function EnMonthYearToThMonthYear(dateStr: string) {
    const DATE_REGEXP: RegExp = new RegExp('^(0?[1-9]|1[0-2])/([0-9]{4})$', 'gi');
    return dateStr.replace(DATE_REGEXP,
      (str: string, month: string, year: string) => {
        return `${month}/${parseInt(year, 10) + 543}`;
      });
  }
  
  export function EnYearToThYear(dateStr: string) {
    const DATE_REGEXP: RegExp = new RegExp('^([0-9]{4})$', 'gi');
    return dateStr.replace(DATE_REGEXP,
      (str: string, day: string, month: string, year: string) => {
        return `${parseInt(year, 10) + 543}`;
      });
  }
  
  
  export function ThDateToEnDate(dateStr: string) {
    const DATE_REGEXP: RegExp = new RegExp('^(0?[1-9]|[1-2][0-9]|3[0-1])/(0?[1-9]|1[0-2])/([0-9]{4})$', 'gi');
    return dateStr.replace(DATE_REGEXP,
      (str: string, day: string, month: string, year: string) => {
        return `${day}/${month}/${parseInt(year, 10) - 543}`;
      });
  }
  
  export function ThMonthYearToEnMonthYear(dateStr: string) {
    const DATE_REGEXP: RegExp = new RegExp('^(0?[1-9]|1[0-2])/([0-9]{4})$', 'gi');
    return dateStr.replace(DATE_REGEXP,
      (str: string, month: string, year: string) => {
        return `${month}/${parseInt(year, 10) - 543}`;
      });
  }
  
  export function ThYearToEnYear(dateStr: string) {
    const DATE_REGEXP: RegExp = new RegExp('^([0-9]{4})$', 'gi');
    return dateStr.replace(DATE_REGEXP,
      (str: string, day: string, month: string, year: string) => {
        return `${parseInt(year, 10) - 543}`;
      });
  }