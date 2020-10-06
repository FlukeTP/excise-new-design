import { Injectable } from '@angular/core';

@Injectable()
export class Int12070102Service {

  constructor() { }

  setValueFind(formData: any) {
    const dataRes = {
      phoneNumber: formData.phoneNumber,
      self: formData.father,
      couple: formData.couple,
      father: formData.father,
      mother: formData.mother,
      child1: formData.child1,
      child2: formData.child2,
      child3: formData.child3,
      ownerClaim1: formData.ownerClaim1 ? true : false,
      ownerClaim2: formData.ownerClaim2 ? true : false,
      ownerClaim3: formData.ownerClaim3 ? true : false,
      ownerClaim4: formData.ownerClaim4 ? true : false,
      otherClaim1: formData.otherClaim1 ? true : false,
      otherClaim2: formData.otherClaim2 ? true : false,
      otherClaim3: formData.otherClaim3 ? true : false,
      otherClaim4: formData.otherClaim4 ? true : false,
      disease: formData.disease,
      totalMoney: formData.totalMoney,
      claimStatus: formData.claimStatus,
      claimMoney: formData.claimMoney,
    };
    return dataRes;
  }
}
