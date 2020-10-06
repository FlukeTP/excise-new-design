export var conditionList = [
  {text:"ไม่ระบุ",        condition:"N"   },
  {text:"น้อยกว่า",       condition:"<"   },
  {text:"น้อยกว่าเท่ากับ",  condition:"<="  },
  {text:"เท่ากับ",        condition:"="   },
  {text:"มากกว่าเท่ากับ",  condition:">="  },
  {text:"มากกว่า",       condition:">"   }
];



  export var revertCondition = (value: string) =>{
    let res = "";
      for (let index = 0; index < conditionList.length; index++) {
        if(value==conditionList[index].condition){

          res = String(conditionList[index].text);

        }else  if(value==conditionList[index].text){

          res = String(conditionList[index].condition);

        }
      }
    return res;
  }


