import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from '@mui/material';
import { PartialSettlement, Person } from '../../../models/models';
import { v4 as uuidv4 } from 'uuid';
import { currencies } from '../../../models/currency'; // Import currencies

interface NewTransferDialogProps {
    open: boolean;
    onClose: () => void;
    onAddTransfer: (transfer: PartialSettlement) => void;
    participants: Person[];
}

const NewTransferDialog: React.FC<NewTransferDialogProps> = ({
    open,
    onClose,
    onAddTransfer,
    participants,
}) => {
    const [newTransferDate, setNewTransferDate] = useState('');
    const [newTransferAmount, setNewTransferAmount] = useState<number>(0);
    const [newTransferSender, setNewTransferSender] = useState<string>('');
    const [newTransferReceiver, setNewTransferReceiver] = useState<string>('');
    const [newTransferCurrency, setNewTransferCurrency] = useState<string>('');

    const handleAdd = () => {
        if (newTransferSender === newTransferReceiver) {
            alert('Sender and receiver cannot be the same.');
            return;
        }
        if (newTransferAmount <= 0) {
            alert('Amount must be greater than zero.');
            return;
        }
        if (newTransferDate === '') {
            alert('Please select a date.');
            return;
        }
        if (!newTransferSender || !newTransferReceiver) {
            alert('Please select both sender and receiver.');
            return;
        }

        const newTransfer: PartialSettlement = {
            id: uuidv4(),
            date: newTransferDate,
            amount: newTransferAmount,
            senderId: newTransferSender,
            receiverId: newTransferReceiver,
            currency: newTransferCurrency
        };

        onAddTransfer(newTransfer);

        // Reset dialog fields
        setNewTransferDate('');
        setNewTransferAmount(0);
        setNewTransferSender('');
        setNewTransferReceiver('');
        setNewTransferCurrency('USD');
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} disableScrollLock>
            <DialogTitle>Dodaj przelew</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="Data"
                    type="date"
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={newTransferDate}
                    onChange={(e) => setNewTransferDate(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Kwota"
                    type="number"
                    fullWidth
                    value={newTransferAmount}
                    onChange={(e) => setNewTransferAmount(Number(e.target.value))}
                />
                <TextField
                        select
                        label="Currency"
                    value={newTransferCurrency}
                    onChange={(e) => setNewTransferCurrency(e.target.value)} // Update selected currency
                >
                    {Object.values(currencies).map((currency) => (
                        <MenuItem key={currency.code} value={currency.code}>
                            {currency.symbol} {currency.code}
                        </MenuItem>
                    ))}
                </TextField>
                <FormControl fullWidth margin="dense">
                    <InputLabel id="sender-label">Od</InputLabel>
                    <Select
                        labelId="sender-label"
                        value={newTransferSender}
                        label="Od"
                        onChange={(e) => setNewTransferSender(e.target.value)}
                    >
                        {participants.map((p) => (
                            <MenuItem key={p.id} value={p.id}>
                                {p.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="dense">
                    <InputLabel id="receiver-label">Do</InputLabel>
                    <Select
                        labelId="receiver-label"
                        value={newTransferReceiver}
                        label="Do"
                        onChange={(e) => setNewTransferReceiver(e.target.value)}
                    >
                        {participants.map((p) => (
                            <MenuItem key={p.id} value={p.id}>
                                {p.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Anuluj</Button>
                <Button
                    onClick={handleAdd}
                    disabled={
                        !newTransferDate ||
                        !newTransferSender ||
                        !newTransferReceiver ||
                        newTransferSender === newTransferReceiver ||
                        newTransferAmount <= 0
                    }
                >
                    Dodaj
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NewTransferDialog;