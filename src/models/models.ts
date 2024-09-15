export interface Person {
    id: string;
    name: string;
}

export interface Payment {
    [personId: string]: number;
}

export interface Item {
    id: string;
    title: string;
    date?: string;
    paidBy: Payment;
    shouldPay: Payment;
    currency: string;
}

export interface PartialSettlement {
    id: string;
    date: string;
    amount: number;
    senderId: string;
    receiverId: string;
    currency: string;
}

export interface Settlement {
    id: string;
    title: string;
    participants: Person[];
    items: Item[];
    partialSettlements: PartialSettlement[];
    ownerId: string;
    isPublic: boolean;
    defaultCurrency: string;
}
