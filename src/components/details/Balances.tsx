import React, { useEffect, useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@mui/material';
import { Settlement } from '../../models/models';
import { computeBalances } from '../../models/balance';
import { formatCurrency } from '../../utils/currencyFormatter';

interface BalancesProps {
    settlement: Settlement;
}

interface BalanceModel {
    id: string; 
    name: string; 
    balance: number;
}

const Balances: React.FC<BalancesProps> = ({ settlement }) => {
    const { participants } = settlement;
    const [balances, setBalances] = useState<BalanceModel[]>([]);

    useEffect(() => {
        const balances = computeBalances(settlement);
        setBalances(balances);
    }, [settlement]);

    return (
        <>
            <Typography variant="h5" gutterBottom style={{ marginTop: '2rem' }}>
                Balances
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        {participants.map(p => (
                            <TableCell key={p.id} align="right">{p.name}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        {balances.map(b => (
                            <TableCell key={b.id} align="right">
                                {formatCurrency(-b.balance, 'USD')}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableBody>
            </Table>
        </>
    );
};

export default Balances;