import React, { useEffect, useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@mui/material';
import { Settlement, Person } from '../../models/models';
import { computeBalances } from '../../models/balance';
import { formatCurrency } from '../../utils/currencyFormatter';

interface DebtMatrixProps {
    settlement: Settlement;
}

const DebtMatrix: React.FC<DebtMatrixProps> = ({ settlement }) => {
    const { participants } = settlement;
    const [debts, setDebts] = useState<{ [key: string]: { [key: string]: number } }>({});
    
    const calculateDebts = (balances: { id: string; name: string; balance: number }[]) => {
        const creditors = balances.filter(b => b.balance > 0).map(b => ({ ...b }));
        const debtors = balances.filter(b => b.balance < 0).map(b => ({ ...b, balance: -b.balance }));

        const debtsMatrix: { [key: string]: { [key: string]: number } } = {};

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

        return debtsMatrix;
    };

    useEffect(() => {
        if (settlement) {
            const balances = computeBalances(settlement);
            const computedDebts = calculateDebts(balances);
            setDebts(computedDebts);
        }
    }, [settlement]);

    return (
        <>
            <Typography variant="h5" gutterBottom style={{ marginTop: '2rem' }}>
                Debts Matrix
            </Typography>
            <Table>
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
                        <TableRow key={row.id}>
                            <TableCell>{row.name} owns</TableCell>
                            {participants.map((col) => (
                                <TableCell key={col.id} align="right">
                                    {debts[row.id] && debts[row.id][col.id]
                                        ? formatCurrency(debts[row.id][col.id], 'USD')
                                        : ''}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
};

export default DebtMatrix;