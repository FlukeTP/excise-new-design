export var numberWithCommas = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export var thaiNumber = str => {
  const th = ["๐", "๑", "๒", "๓", "๔", "๕", "๖", "๗", "๘", "๙"];
  const en = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  for (let i = 0; i < str.length; i++) {
    for (let j = 0; i < en.length; j++) {
      if (str[i].toString() == en[j]) {
        str[i] = th[j];
      }
    }
  }
  return str;
};

export default { numberWithCommas, thaiNumber };
