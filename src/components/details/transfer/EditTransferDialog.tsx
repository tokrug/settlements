import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
} from '@mui/material';
import { PartialSettlement, Person } from '../../../models/models';

interface EditTransferDialogProps {
    open: boolean;
    onClose: () => void;
    transfer: PartialSettlement;
    participants: Person[];
    onUpdateTransfer: (updatedTransfer: PartialSettlement) => void;
}

const EditTransferDialog: React.FC<EditTransferDialogProps> = ({
    open,
    onClose,
    transfer,
    participants,
    onUpdateTransfer,
}) => {
    const [date, setDate] = useState<string>(transfer.date);
    const [amount, setAmount] = useState<number>(transfer.amount);
    const [senderId, setSenderId] = useState<string>(transfer.senderId);
    const [receiverId, setReceiverId] = useState<string>(transfer.receiverId);

    const handleSave = () => {
        const updatedTransfer: PartialSettlement = {
            ...transfer,
            date,
            amount,
            senderId,
            receiverId,
        };
        onUpdateTransfer(updatedTransfer);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} disableScrollLock>
            <DialogTitle>Edit Transfer</DialogTitle>
            <DialogContent>
                <TextField
                    label="Date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    label="Amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    select
                    label="Sender"
                    value={senderId}
                    onChange={(e) => setSenderId(e.target.value)}
                    fullWidth
                    margin="normal"
                >
                    {participants.map((p) => (
                        <MenuItem key={p.id} value={p.id}>
                            {p.name}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    label="Receiver"
                    value={receiverId}
                    onChange={(e) => setReceiverId(e.target.value)}
                    fullWidth
                    margin="normal"
                >
                    {participants.map((p) => (
                        <MenuItem key={p.id} value={p.id}>
                            {p.name}
                        </MenuItem>
                    ))}
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditTransferDialog;