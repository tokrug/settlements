import { Balance } from './balance';

// Define the Transfer Interface
export interface Transfer {
    currency: string;
    senderId: string;
    receiverId: string;
    amount: number;
}

/**
 * Computes the minimal list of transfers required to settle all balances to zero.
 * @param balances - The list of balances per currency and participant.
 * @returns A list of Transfer objects representing the necessary money transfers.
 */
export const computeTransfers = (balances: Balance[]): Transfer[] => {
    const transfers: Transfer[] = [];

    balances.forEach(balance => {
        const { currency, balances: participantBalances } = balance;

        // Separate creditors and debtors
        const creditors: { participantId: string; amount: number }[] = [];
        const debtors: { participantId: string; amount: number }[] = [];

        for (const [participantId, amount] of Object.entries(participantBalances)) {
            if (amount > 0) {
                creditors.push({ participantId, amount });
            } else if (amount < 0) {
                debtors.push({ participantId, amount: -amount }); // Store as positive debt
            }
            // Ignore zero balances
        }

        // Sort creditors descending by amount
        creditors.sort((a, b) => b.amount - a.amount);
        // Sort debtors descending by amount
        debtors.sort((a, b) => b.amount - a.amount);

        let i = 0; // Index for debtors
        let j = 0; // Index for creditors

        while (i < debtors.length && j < creditors.length) {
            const debtor = debtors[i];
            const creditor = creditors[j];

            const transferAmount = Math.min(debtor.amount, creditor.amount);

            // Create a transfer from debtor to creditor
            transfers.push({
                currency,
                senderId: debtor.participantId,
                receiverId: creditor.participantId,
                amount: transferAmount,
            });

            // Update amounts
            debtors[i].amount -= transferAmount;
            creditors[j].amount -= transferAmount;

            // Move to next debtor if current debtor is settled
            if (debtors[i].amount === 0) {
                i++;
            }

            // Move to next creditor if current creditor is settled
            if (creditors[j].amount === 0) {
                j++;
            }
        }
    });

    return transfers;
};
