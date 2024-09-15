import { Balance } from "./balance";

export interface DebtsByCurrency {
    [currency: string]: DebtMatrix;
}

export interface DebtMatrix {
    [debtorId: string]: { [creditorId: string]: number }
}

export const calculateDebts = (balancesByCurrency: Balance[]): DebtsByCurrency => {
    const debtsByCurrency: { [currency: string]: { [debtorId: string]: { [creditorId: string]: number } } } = {};

    balancesByCurrency.forEach(({ currency, balances }) => {
        const creditors = Object.entries(balances)
            .filter(([_, balance]) => balance > 0)
            .map(([id, balance]) => ({ id, balance }));

        const debtors = Object.entries(balances)
            .filter(([_, balance]) => balance < 0)
            .map(([id, balance]) => ({ id, balance: -balance }));

        const debtsMatrix: DebtMatrix = {};

        debtors.forEach(debtor => {
            let amountOwed = debtor.balance;
            creditors.forEach(creditor => {
                if (amountOwed === 0) return;
                if (creditor.balance === 0) return;

                const owed = Math.min(amountOwed, creditor.balance);
                if (!debtsMatrix[debtor.id]) {
                    debtsMatrix[debtor.id] = {};
                }
                debtsMatrix[debtor.id][creditor.id] = (debtsMatrix[debtor.id][creditor.id] || 0) + owed;

                creditor.balance -= owed;
                amountOwed -= owed;
            });
        });

        debtsByCurrency[currency] = debtsMatrix;
    });

    return debtsByCurrency;
};