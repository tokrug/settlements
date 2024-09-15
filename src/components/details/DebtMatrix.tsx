import React, { useEffect, useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Typography, Paper } from '@mui/material';
import { Settlement, Person } from '../../models/models';
import { computeBalances } from '../../models/balance';
import { formatCurrency } from '../../utils/currencyFormatter';

interface DebtMatrixProps {
    settlement: Settlement;
}

const DebtMatrix: React.FC<DebtMatrixProps> = ({ settlement }) => {
    const { participants } = settlement;
    const [debts, setDebts] = useState<{ [currency: string]: { [debtorId: string]: { [creditorId: string]: number } } }>({});

    // Adjusted calculateDebts to handle balances for each currency separately
    const calculateDebts = (balancesByCurrency: { currency: string; balances: { [participantId: string]: number } }[]) => {
        const debtsByCurrency: { [currency: string]: { [debtorId: string]: { [creditorId: string]: number } } } = {};

        balancesByCurrency.forEach(({ currency, balances }) => {
            const creditors = Object.entries(balances)
                .filter(([_, balance]) => balance > 0)
                .map(([id, balance]) => ({ id, balance }));

            const debtors = Object.entries(balances)
                .filter(([_, balance]) => balance < 0)
                .map(([id, balance]) => ({ id, balance: -balance }));

            const debtsMatrix: { [debtorId: string]: { [creditorId: string]: number } } = {};

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

    useEffect(() => {
        if (settlement) {
            const balancesByCurrency = computeBalances(settlement); // Get balances grouped by currency
            const computedDebtsByCurrency = calculateDebts(balancesByCurrency); // Calculate debts for each currency
            setDebts(computedDebtsByCurrency); // Store debts in state
        }
    }, [settlement]);

    return (
        <>
            <Typography variant="h5" gutterBottom style={{ marginTop: '2rem' }}>
                Debts Matrix
            </Typography>
            <Table size="small" component={Paper}>
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        {participants.map((p) => (
                            <TableCell key={p.id} align="right">To {p.name}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {participants.map((row) => (
                        Object.keys(debts).map((currency) => (
                            <TableRow key={`${row.id}-${currency}`}>
                                <TableCell>
                                    {row.name} owes ({currency})
                                </TableCell>
                                {participants.map((col) => (
                                    <TableCell key={col.id} align="right">
                                        {debts[currency][row.id] && debts[currency][row.id][col.id]
                                            ? formatCurrency(debts[currency][row.id][col.id], currency)
                                            : ''}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ))}
                </TableBody>
            </Table>
        </>
    );
};

export default DebtMatrix;
