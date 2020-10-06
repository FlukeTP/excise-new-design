
export var TextDateTH = {
  days: ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"],
  months: [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม"
  ],
  monthsShort: [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค."
  ],
  today: "วันนี้",
  now: "เดี๋ยวนี้",
  am: "ก่อนบ่าย",
  pm: "หลังบ่าย"
};

export var patternDate = {
  DD_MM_YYYY: 'DD/MM/YYYY',
  DD_MMMM_YYYY: 'DD MMMM YYYY',
}

export var monthsToNumber = StringMonths => {
  var index = 0;
  for (let i = 0; i < 12; i++) {
    if (TextDateTH.months[i] == StringMonths) {
      index = i + 1;
    }
  }

  return (index < 10 ? "0" : "") + index;
};

export var digit = number => {
  return (number < 10 ? "0" : "") + number;
};
// formatter("ป")
export var formatter = (what: string = "") => {
  switch (what) {
    case "เวลา":
      return {
        time: function (date, settings) {
          if (!date) return "";
          var now = date,
            h = now.getHours(),
            m = now.getMinutes(),
            s = now.getSeconds();
          return digit(h) + ":" + digit(m); // + ':' + digit(s);
        }
      };
    case "ด":
      return {
        cell: (cell, date, cellOptions) => {
          if (cellOptions.mode == "year") {
            cell[0].innerText = toDateLocale(date)[0].split("/")[2];
          }
        },
        header: function (date, mode, settings) {
          let month = date.getMonth();
          let _year = toDateLocale(date)[0].split("/")[2];
          return _year;
        },
        date: function (date, settings) {
          if (!date) return "";
          let _month = date.getMonth();
          return TextDateTH.months[_month];
        }
      };
    case "ดป":
      return {
        cell: (cell, date, cellOptions) => {
          if (cellOptions.mode == "year") {
            cell[0].innerText = toDateLocale(date)[0].split("/")[2];
          }
        },
        header: function (date, mode, settings) {
          let month = date.getMonth();
          let _year = toDateLocale(date)[0].split("/")[2];
          return _year;
        },
        date: function (date, settings) {
          if (!date) return "";
          let _year = toDateLocale(date)[0].split("/")[2];
          let _month = date.getMonth();
          return TextDateTH.months[_month] + " " + _year;
        }
      };
    case "ป":
      return {
        cell: function (cell, date, cellOptions) {
          let _year = toDateLocale(date)[0].split("/")[2];
          cell[0].innerHTML = _year;
        },
        header: function (date, mode, settings) {
          let _year = toDateLocale(date)[0].split("/")[2];
          return _year;
        },
        date: function (date, settings) {
          let _year = toDateLocale(date)[0].split("/")[2];
          return _year;
        }
      };
    case "วดป":
      return {
        cell: (cell, date, cellOptions) => {
          if (cellOptions.mode == "year") {
            cell[0].innerText = toDateLocale(date)[0].split("/")[2];
          }
        },
        header: function (date, mode, settings) {
          let month = date.getMonth();
          let _year = toDateLocale(date)[0].split("/")[2];
          return TextDateTH.months[month] + " " + _year;
        },
        date: function (date, settings) {
          if (!date) return "";
          let day = date.getDate();
          let month = date.getMonth();
          let _year = toDateLocale(date)[0].split("/")[2];
          return (
            digit(day) + " " + TextDateTH.months[month] + " " + _year.toString()
          );
        }
      };
    case "วดปเวลา":
      return {
        cell: (cell, date, cellOptions) => {
          if (cellOptions.mode == "year") {
            cell[0].innerText = toDateLocale(date)[0].split("/")[2];
          }
        },
        datetime: function (date, mode, settings) {
          //return a string to show on the header for the given 'date' and 'mode'
          if (!date) return "";
          let day = date.getDate();
          // let month = date.getMonth();
          let month = toDateLocale(date)[0].split("/")[1];
          let _year = toDateLocale(date)[0].split("/")[2];
          let h = date.getHours();
          let m = date.getMinutes();
          let s = date.getSeconds();
          return (
            digit(day) +
            "/" +
            digit(month) +
            "/" +
            _year +
            " " +
            digit(h) +
            ":" +
            digit(m)
          );
        }
      };
    case "day":
      return {
        cell: (cell, date, cellOptions) => {
          if (cellOptions.mode == "year") {
            cell[0].innerText = toDateLocale(date)[0].split("/")[2];
          }
        },
        header: function (date, mode, settings) {
          let _year = toDateLocale(date)[0].split("/")[2];
          let _month = TextDateTH.months[date.getMonth()];
          return `${_month} ${_year}`;
        },
        date: function (date, settings) {
          if (!date) return "";
          let day = date.getDate();
          return digit(day);
        }
      };
    case "month":
      return {
        cell: (cell, date, cellOptions) => {
          if (cellOptions.mode == "year") {
            cell[0].innerText = toDateLocale(date)[0].split("/")[2];
          }
        },
        header: function (date, mode, settings) {
          let _year = toDateLocale(date)[0].split("/")[2];
          return _year;
        },
        date: function (date, settings) {
          //return a string to show on the header for the given 'date' and 'mode'
          let _date = toDateLocale(date);
          let _month = TextDateTH.months[parseInt(_date[0].split("/")[1]) - 1];
          return _month;
        }
      };
    case "monthOnly":
      return {
        cell: (cell, date, cellOptions) => {
          if (cellOptions.mode == "year") {
            cell[0].innerText = toDateLocale(date)[0].split("/")[2];
          }
        },
        header: function (date, mode, settings) {
          settings.className.nextIcon = "";
          settings.className.prevIcon = "";
          settings.className.link = "";
          return "เดือน";
        },
        date: function (date, settings) {
          //return a string to show on the header for the given 'date' and 'mode'
          let _date = toDateLocale(date);
          let _month = TextDateTH.months[parseInt(_date[0].split("/")[1]) - 1];
          return _month;
        }
      };
    case "year":
      return {
        cell: function (cell, date, cellOptions) {
          let _year = toDateLocale(date)[0].split("/")[2];
          cell[0].innerHTML = _year;
        },
        header: function (date, mode, settings) {
          let _year = toDateLocale(date)[0].split("/")[2];
          return _year;
        },
        date: function (date, settings) {
          let _year = toDateLocale(date)[0].split("/")[2];
          return _year;
        }
      };
    case "day-month":
      return {
        header: function (date, mode, settings) {
          let _year = toDateLocale(date)[0].split("/")[2];
          let _month = TextDateTH.months[date.getMonth()];
          return `${_month} ${_year}`;
        },
        date: function (date, settings) {
          let _date = toDateLocale(date);
          let _month = TextDateTH.months[date.getMonth()];
          let _day = parseInt(_date[0].split("/")[0]);
          return `${_day} ${_month}`;
        }
      };
    case "month-year":
      return {
        header: function (date, mode, settings) {
          let _year = toDateLocale(date)[0].split("/")[2];
          return _year;
        },
        cell: (cell, date, cellOptions) => {
          if (cellOptions.mode == "year") {
            cell[0].innerText = toDateLocale(date)[0].split("/")[2];
          }
        },
        date: function (date, settings) {
          let _month = toDateLocale(date)[0].split("/")[1];
          let _year = toDateLocale(date)[0].split("/")[2];
          return digit(_month) + "/" + _year;
        }
      };

    default:
      return {
        header: (date, mode, settings) => {
          let month = date.getMonth();
          let _year = toDateLocale(date)[0].split("/")[2];
          return TextDateTH.months[month] + " " + _year;
        },
        cell: (cell, date, cellOptions) => {
          if (cellOptions.mode == "year") {
            cell[0].innerText = toDateLocale(date)[0].split("/")[2];
          }
        },
        date: (date, settings) => {
          let day = date.getDate();
          let _month = toDateLocale(date)[0].split("/")[1];
          let _year = toDateLocale(date)[0].split("/")[2];
          return digit(day) + "/" + digit(_month) + "/" + _year.toString();
        }
      };
  }
};

export var toDateLocale = date => {
  if (date.getFullYear() > new Date().getFullYear() + 500) {
    return [`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`];
  } else {
    const _date = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    ); // Date.UTC()
    return _date.toLocaleString("th-TH", { timeZone: "UTC" }).split(" ");
  }
};

export var ThaiFormatter = date => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("th-TH", options);
};

export var stringToDate = date => {
  let strSpit = date.split(/[ ,]+/);
  if (strSpit.length > 1) {
    let _date = strSpit[0]; //date
    let _time = strSpit[1]; //time

    //sub date
    let dateSpit = _date.split("/");
    let _dd = dateSpit[0];
    let _mm = dateSpit[1];
    let _yyyy = parseInt(dateSpit[2]) - 543;
    let mmddyyyytime = _mm + "/" + _dd + "/" + _yyyy + " " + _time; // mm/dd/yyyy time

    return new Date(mmddyyyytime);
  } else {
    let dateSpit = date.split("/");
    let _dd = dateSpit[0];
    let _mm = dateSpit[1];
    let _yyyy = parseInt(dateSpit[2]) - 543;
    let mmddyyyy = _mm + "/" + _dd + "/" + _yyyy; // mm/dd/yyyy time

    return new Date(mmddyyyy);
  }
};
export var fullMonth = date => {
  let dateSpit = date.split("/");
  let _dd = dateSpit[0];
  let _mm = dateSpit[1];
  let _yyyy = parseInt(dateSpit[2]);

  let month = TextDateTH.months[_mm - 1];
  let ddfullmonthyyyy = parseInt(_dd) + " " + month + " " + _yyyy; // full month

  return ddfullmonthyyyy;
};


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
// DD MMMM YYYY -> DD/MM/YYYY, DD/MM/YYYY -> DD MMMM YYYY
export function converDate(dateStr: string, patternOld: string) {
  switch (patternOld) {
    case patternDate.DD_MMMM_YYYY:
      let sptDate = dateStr.split(" ");
      for (let index = 0; index < TextDateTH.months.length; index++) {
        const element = TextDateTH.months[index];
        if (element == sptDate[1]) {
          sptDate[1] = (index + 1).toString();
          return `${sptDate[0]}/${sptDate[1]}/${sptDate[2]}`;
        }
      }
      break;
    case patternDate.DD_MM_YYYY:
      let sptDate2 = dateStr.split("/");
      sptDate2[1] = TextDateTH.months[Number(sptDate2[1])-1];
      return `${sptDate2[0]} ${sptDate2[1]} ${sptDate2[2]}`;
      break;
    default:
      break;
  }
}

export default {
  TextDateTH,
  formatter,
  digit,
  ThaiFormatter,
  stringToDate,
  fullMonth,
  converDate,

  // ConverDate พศ เป็น คศ
  ThDateToEnDate,
  ThMonthYearToEnMonthYear,
  ThYearToEnYear,

  // ConvertDate คศ เป็น พศ
  EnDateToThDate, // ววดดปป
  EnMonthYearToThMonthYear, // ดดปป
  EnYearToThYear, // ปี
};
