import React, { useState } from 'react';
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Typography,
    Button,
    Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Settlement, PartialSettlement, Person } from '../../../models/models';
import EditTransferDialog from './EditTransferDialog';
import NewTransferDialog from './NewTransferDialog';
import { formatCurrency } from '../../../utils/currencyFormatter';

interface PartialSettlementsProps {
    settlement: Settlement;
    addTransfer: (transfer: PartialSettlement) => void;
    deleteTransfer: (id: string) => void;
    updateTransfer: (transfer: PartialSettlement) => void;
}

const PartialSettlements: React.FC<PartialSettlementsProps> = ({ settlement, addTransfer, deleteTransfer, updateTransfer }) => {
    const { 
        partialSettlements, 
        participants, 
    } = settlement;

    const [editTransfer, setEditTransfer] = useState<PartialSettlement | null>(null);
    const [openNewTransfer, setOpenNewTransfer] = useState(false);

    return (
        <>
            <Typography variant="h5" gutterBottom style={{ marginTop: '2rem' }}>
                Transfers
            </Typography>
            <Button
                size="small"
                variant="outlined"
                onClick={() => setOpenNewTransfer(true)}
                style={{ marginBottom: '1rem' }}
            >
                Add Transfer
            </Button>
            <Table size="small" component={Paper}>
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>From</TableCell>
                        <TableCell>To</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {partialSettlements.map((transfer) => (
                        <TableRow key={transfer.id}>
                            <TableCell>{transfer.date}</TableCell>
                            <TableCell>{formatCurrency(transfer.amount, transfer.currency)}</TableCell>
                            <TableCell>
                                {participants.find(p => p.id === transfer.senderId)?.name || 'Unknown'}
                            </TableCell>
                            <TableCell>
                                {participants.find(p => p.id === transfer.receiverId)?.name || 'Unknown'}
                            </TableCell>
                            <TableCell>
                                <IconButton size="small" onClick={() => {
                                    setEditTransfer(transfer);
                                }}>
                                    ✏️
                                </IconButton>
                                <IconButton size="small" onClick={() => deleteTransfer(transfer.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Edit Transfer Dialog */}
            {editTransfer && (
                <EditTransferDialog
                    open={Boolean(editTransfer)}
                    onClose={() => setEditTransfer(null)}
                    transfer={editTransfer}
                    participants={participants}
                    onUpdateTransfer={updateTransfer}
                />
            )}

             {/* New Transfer Dialog */}
             <NewTransferDialog
                open={openNewTransfer}
                onClose={() => setOpenNewTransfer(false)}
                onAddTransfer={addTransfer}
                participants={settlement.participants}
            />
        </>
    );
};

export default PartialSettlements;