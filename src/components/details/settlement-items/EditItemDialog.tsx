import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    Typography,
    MenuItem,
} from '@mui/material';
import { Person, Item } from '../../../models/models';
import { currencies } from '../../../models/currency'; // Import currencies

interface EditItemDialogProps {
    open: boolean;
    onClose: () => void;
    participants: Person[];
    item: Item;
    onUpdateItem: (item: Item) => void;
}

const EditItemDialog: React.FC<EditItemDialogProps> = ({
                                                           open,
                                                           onClose,
                                                           participants,
                                                           item,
                                                           onUpdateItem,
                                                       }) => {
    const [title, setTitle] = useState(item.title);
    const [date, setDate] = useState(item.date || '');
    const [selectedCurrency, setSelectedCurrency] = useState(item.currency);
    const [paidBy, setPaidBy] = useState<{ [key: string]: number }>(item.paidBy);
    const [shouldPay, setShouldPay] = useState<{ [key: string]: number }>(
        item.shouldPay
    );

    const handleUpdateItem = () => {
        const totalPaid = Object.values(paidBy).reduce((a, b) => a + b, 0);
        const totalShouldPay = Object.values(shouldPay).reduce((a, b) => a + b, 0);

        if (totalPaid !== totalShouldPay) {
            alert(
                `The total paid amount (${totalPaid}) does not match the total due amount (${totalShouldPay})`
            );
            return;
        }

        const updatedItem: Item = {
            ...item,
            title,
            date,
            paidBy,
            shouldPay,
            currency: selectedCurrency
        };
        onUpdateItem(updatedItem);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} disableScrollLock>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="Title"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                <TextField
                    select
                    label="Currency"
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)} // Update selected currency
                >
                    {Object.values(currencies).map((currency) => (
                        <MenuItem key={currency.code} value={currency.code}>
                            {currency.symbol} {currency.code}
                        </MenuItem>
                    ))}
                </TextField>
                <Typography variant="h6">Amounts Paid</Typography>
                {participants.map((p) => (
                    <TextField
                        key={p.id}
                        margin="dense"
                        label={p.name}
                        type="number"
                        fullWidth
                        value={paidBy[p.id] || ''}
                        onChange={(e) =>
                            setPaidBy({ ...paidBy, [p.id]: parseFloat(e.target.value) })
                        }
                    />
                ))}
                <Typography variant="h6">Amounts Due</Typography>
                {participants.map((p) => (
                    <TextField
                        key={p.id}
                        margin="dense"
                        label={p.name}
                        type="number"
                        fullWidth
                        value={shouldPay[p.id] || ''}
                        onChange={(e) =>
                            setShouldPay({ ...shouldPay, [p.id]: parseFloat(e.target.value) })
                        }
                    />
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleUpdateItem}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditItemDialog;
