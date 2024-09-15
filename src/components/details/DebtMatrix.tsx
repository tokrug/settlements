import React, { useEffect, useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Typography, Paper } from '@mui/material';
import { Settlement, Person } from '../../models/models';
import { Balance, computeBalances } from '../../models/balance';
import { calculateDebts } from '../../models/debt';
import { formatCurrency } from '../../utils/currencyFormatter';

interface DebtMatrixProps {
    settlement: Settlement;
}

interface DebtsByCurrency {
    [currency: string]: DebtMatrix;
}

interface DebtMatrix {
    [debtorId: string]: { [creditorId: string]: number }
}

const DebtMatrix: React.FC<DebtMatrixProps> = ({ settlement }) => {
    const { participants } = settlement;
    const [debts, setDebts] = useState<{ [currency: string]: { [debtorId: string]: { [creditorId: string]: number } } }>({});

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
