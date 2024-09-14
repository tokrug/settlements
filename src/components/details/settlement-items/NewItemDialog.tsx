import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    Typography,
} from '@mui/material';
import { Person, Item } from '../../../models/models';
import { v4 as uuidv4 } from 'uuid';

interface NewItemDialogProps {
    open: boolean;
    onClose: () => void;
    participants: Person[];
    onAddItem: (item: Item) => void;
}

const NewItemDialog: React.FC<NewItemDialogProps> = ({
                                                         open,
                                                         onClose,
                                                         participants,
                                                         onAddItem,
                                                     }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [paidBy, setPaidBy] = useState<{ [key: string]: number }>({});
    const [shouldPay, setShouldPay] = useState<{ [key: string]: number }>({});

    const handleAddItem = () => {
        const totalPaid = Object.values(paidBy).reduce((a, b) => a + b, 0);
        const totalShouldPay = Object.values(shouldPay).reduce((a, b) => a + b, 0);

        if (totalPaid !== totalShouldPay) {
            alert(
                `The sum of paid amounts (${totalPaid}) does not match the sum of due amounts (${totalShouldPay})`
            );
            return;
        }

        const newItem: Item = {
            id: uuidv4(),
            title,
            date,
            paidBy,
            shouldPay,
        };
        onAddItem(newItem);
        onClose();
        setTitle('');
        setDate('');
        setPaidBy({});
        setShouldPay({});
    };

    return (
        <Dialog open={open} onClose={onClose} disableScrollLock>
            <DialogTitle>New Item</DialogTitle>
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
                <Typography variant="h6">Paid Amounts</Typography>
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
                <Typography variant="h6">Due Amounts</Typography>
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
                <Button onClick={handleAddItem}>Add</Button>
            </DialogActions>
        </Dialog>
    );
};

export default NewItemDialog;
