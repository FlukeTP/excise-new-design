export interface Person {
    withdrawalPersonsId?: number;
    withdrawalId?: number;
    officeCode?: string;
    OFFICEDesc?: string;
    paymentMethod: string;
    refPayment: string;
    paymentDate: Date;
    amount: number;
    payee: string;
    bankName: string;
}

export interface List {
    withdrawalId: number;
    officeCode: string;
    OFFICEDesc: string;
    refNum: string;
    withdrawalDate: Date;
    activities: string;
    budgetType: string;
    withdrawalAmount: number;
    socialSecurity: number;
    withholdingTax: number;
    receivedAmount: number;
    anotherAmount: number;
    paymentDocNum: string;
    withdrawalDocNum: string;
    itemDesc: string;
    note: string;
    budgetId: string;
    budgetName: string;
    categoryId: string;
    categoryName: string;
    listId: string;
    listName: string;
    personType: String;
    payee: String;
}

export interface Int06101 {
    persons: Person[];
    activity: string;
	budge?: string;
	searchFlag?: string;
	dateForm?: string;
	dateTo?: string;
	OfficeCode?: string;
	secter?: string;
	area?: string;
	branch?: string;
	refnum: string;
	withdrawal: string;
	budged: string;
	category: string;
	list: string;
	budget: string;
	amountOfMoney: string;
	deductSocial: string;
	withholding: string;
	other: string;
	amountOfMoney1: string;
	numberRequested: string;
	documentNumber: string;
	itemDescription: string;
    note: string;
    budgetName: string;
    categoryName: string;
    listName: string;
    personType: String;
    payee: String;
}