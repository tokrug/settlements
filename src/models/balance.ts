import { Settlement } from "./models";

// Updated Balance Interface
export interface Balance {
    currency: string;
    balances: {
        [participantId: string]: number;
    };
}

export const computeBalances = (settlement: Settlement): Balance[] => {
    // Step 1: Identify all unique currencies involved in the settlement
    const currencies = new Set<string>();

    settlement.items.forEach(item => {
        if (item.currency) {
            currencies.add(item.currency);
        }
    });

    settlement.partialSettlements.forEach(transfer => {
        if (transfer.currency) {
            currencies.add(transfer.currency);
        }
    });

    // Step 2: Initialize a map to hold balances grouped by currency
    const currencyBalancesMap: { [currency: string]: { [participantId: string]: number } } = {};

    currencies.forEach((currency) => {
        const participantBalances: { [participantId: string]: number } = {};

        settlement.participants.forEach((participant) => {
            // Compute totalPaid for the current currency
            const totalPaid = settlement.items
                .filter(item => item.currency === currency)
                .reduce((sum, item) => sum + (item.paidBy[participant.id] || 0), 0);

            // Compute totalShouldPay for the current currency
            const totalShouldPay = settlement.items
                .filter(item => item.currency === currency)
                .reduce((sum, item) => sum + (item.shouldPay[participant.id] || 0), 0);

            // Compute totalSent for the current currency
            const totalSent = settlement.partialSettlements
                .filter(transfer => transfer.currency === currency && transfer.senderId === participant.id)
                .reduce((sum, transfer) => sum + transfer.amount, 0);

            // Compute totalReceived for the current currency
            const totalReceived = settlement.partialSettlements
                .filter(transfer => transfer.currency === currency && transfer.receiverId === participant.id)
                .reduce((sum, transfer) => sum + transfer.amount, 0);

            // Calculate the balance for the current currency
            const balance = totalPaid - totalShouldPay + totalSent - totalReceived;

            participantBalances[participant.id] = balance;
        });

        currencyBalancesMap[currency] = participantBalances;
    });

    // Step 3: Convert the map to an array of Balance objects
    const balanceList: Balance[] = Array.from(currencies).map((currency) => ({
        currency,
        balances: currencyBalancesMap[currency],
    }));

    return balanceList;
};
