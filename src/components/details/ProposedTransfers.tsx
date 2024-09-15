// Transfers.tsx
import React, { useEffect, useState } from 'react';
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Typography,
    Paper,
    Button
} from '@mui/material';
import { PartialSettlement, Settlement } from '../../models/models';
import { Balance, computeBalances } from '../../models/balance';
import { Transfer, computeTransfers } from '../../models/transfer';
import { formatCurrency } from '../../utils/currencyFormatter';
import { v4 as uuidv4 } from 'uuid'; // Import UUID for unique IDs

interface TransfersProps {
    settlement: Settlement;
    addTransfer: (transfer: PartialSettlement) => void;
}

const ProposedTransfers: React.FC<TransfersProps> = ({ settlement, addTransfer }) => {
    const { participants } = settlement;
    const [transfers, setTransfers] = useState<Transfer[]>([]);

    useEffect(() => {
        const balances: Balance[] = computeBalances(settlement);
        const computedTransfers: Transfer[] = computeTransfers(balances);
        setTransfers(computedTransfers);
    }, [settlement]);

    // Helper function to get participant name by ID
    const getParticipantName = (id: string): string => {
        const participant = participants.find(p => p.id === id);
        return participant ? participant.name : id;
    };

    // Handler to add a transfer
    const handleAddTransfer = (transfer: Transfer) => {
        const partialSettlement: PartialSettlement = {
            id: uuidv4(), // Generate a unique ID
            date: new Date().toISOString(), // Current date in ISO format
            amount: transfer.amount,
            senderId: transfer.senderId,
            receiverId: transfer.receiverId,
            currency: transfer.currency
        };
        addTransfer(partialSettlement);
    };

    return (
        <>
            <Typography variant="h5" gutterBottom style={{ marginTop: '2rem' }}>
                Proposed Transfers
            </Typography>
            {transfers.length === 0 ? (
                <Typography variant="body1">All balances are settled. No transfers needed.</Typography>
            ) : (
                <Table component={Paper} size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Currency</strong></TableCell>
                            <TableCell><strong>Sender</strong></TableCell>
                            <TableCell><strong>Receiver</strong></TableCell>
                            <TableCell align="right"><strong>Amount</strong></TableCell>
                            <TableCell align="center"><strong>Action</strong></TableCell> {/* New Action Column */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transfers.map((transfer, index) => (
                            <TableRow key={index}>
                                <TableCell>{transfer.currency}</TableCell>
                                <TableCell>{getParticipantName(transfer.senderId)}</TableCell>
                                <TableCell>{getParticipantName(transfer.receiverId)}</TableCell>
                                <TableCell align="right">
                                    {formatCurrency(transfer.amount, transfer.currency)}
                                </TableCell>
                                <TableCell align="center">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={() => handleAddTransfer(transfer)}
                                    >
                                        Add Transfer
                                    </Button>
                                </TableCell> {/* Action Button */}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </>
    );
};

export default ProposedTransfers;
