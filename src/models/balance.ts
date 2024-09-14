import { Settlement } from "./models";

export interface Balance {
    id: string;
    name: string;
    balance: number;
}

export const computeBalances = (settlement: Settlement): Balance[] => {
    const balances: Balance[] = settlement.participants.map((p) => {
        const totalPaid = settlement.items.reduce(
            (sum, item) => sum + (item.paidBy[p.id] || 0),
            0
        );
        const totalShouldPay = settlement.items.reduce(
            (sum, item) => sum + (item.shouldPay[p.id] || 0),
            0
        );
        const totalSent = settlement.partialSettlements.reduce(
            (sum, transfer) => sum + (transfer.senderId === p.id ? transfer.amount : 0),
            0
        );
        const totalReceived = settlement.partialSettlements.reduce(
            (sum, transfer) => sum + (transfer.receiverId === p.id ? transfer.amount : 0),
            0
        );
        return {
            id: p.id,
            name: p.name,
            balance: totalPaid - totalShouldPay + totalSent - totalReceived,
        };
    });
    return balances;
};