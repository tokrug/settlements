import React, { useEffect, useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Typography, Paper } from '@mui/material';
import { Settlement } from '../../models/models';
import { Balance, computeBalances } from '../../models/balance';
import { formatCurrency } from '../../utils/currencyFormatter';

interface BalancesProps {
    settlement: Settlement;
}

const Balances: React.FC<BalancesProps> = ({ settlement }) => {
    const { participants } = settlement;
    const [currencyBalances, setBalances] = useState<Balance[]>([]);

    useEffect(() => {
        const balances = computeBalances(settlement);
        setBalances(balances);
    }, [settlement]);

    return (
        <>
            <Typography variant="h5" gutterBottom style={{ marginTop: '2rem' }}>
                Balances
            </Typography>
            <Table size="small" component={Paper}>
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        {participants.map(p => (
                            <TableCell key={p.id} align="right">{p.name}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                {currencyBalances.map(b => (
                    <TableRow key={b.currency}>
                        <TableCell>{b.currency}</TableCell>
                        {participants.map(p => (
                            <TableCell key={p.id} align="right">
                                {formatCurrency(-b.balances[p.id], b.currency)}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </>
    );
};

export default Balances;