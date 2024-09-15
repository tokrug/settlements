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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Settlement, Item, Person } from '../../../models/models';
import EditItemDialog from './EditItemDialog';
import NewItemDialog from './NewItemDialog';
import { formatCurrency } from '../../../utils/currencyFormatter';

interface SettlementItemsProps {
    settlement: Settlement;
    addItem: (item: Item) => void;
    deleteItem: (id: string) => void;
    updateItem: (item: Item) => void;
}

const SettlementItems: React.FC<SettlementItemsProps> = ({ settlement, addItem, deleteItem, updateItem  }) => {
    const { 
        items, 
        participants, 
    } = settlement;

    const [editItem, setEditItem] = useState<Item | null>(null);
    const [openNewItem, setOpenNewItem] = useState(false);

    // Calculate summary totals by currency for paid and should pay
    const summaryPaidBy: { [currency: string]: { [participantId: string]: number } } = {};
    const summaryShouldPay: { [currency: string]: { [participantId: string]: number } } = {};

    items.forEach(item => {
        const currency = item.currency;

        // Initialize currency entries if they don't exist
        if (!summaryPaidBy[currency]) {
            summaryPaidBy[currency] = {};
        }
        if (!summaryShouldPay[currency]) {
            summaryShouldPay[currency] = {};
        }

        participants.forEach(p => {
            summaryPaidBy[currency][p.id] = (summaryPaidBy[currency][p.id] || 0) + (item.paidBy[p.id] || 0);
            summaryShouldPay[currency][p.id] = (summaryShouldPay[currency][p.id] || 0) + (item.shouldPay[p.id] || 0);
        });
    });

    const currenciesUsed = new Set(Object.keys(summaryPaidBy).concat(Object.keys(summaryShouldPay)));

    return (
        <>
            <Typography variant="h5" gutterBottom style={{ marginTop: '2rem' }}>
                Items
            </Typography>
            <Button
                variant="outlined"
                size="small"
                onClick={() => setOpenNewItem(true)}
                style={{ marginBottom: '1rem' }}
            >
                Add Item
            </Button>
            <Table size="small">
                <TableHead>
                    {/* New Header Row */}
                    <TableRow>
                        <TableCell colSpan={2} style={{ borderRight: '2px solid black' }}></TableCell>
                        <TableCell colSpan={participants.length} align="center" style={{ borderRight: '2px solid black' }}>
                            Paid
                        </TableCell>
                        <TableCell colSpan={participants.length} align="center" style={{ borderRight: '2px solid black' }}>
                            Should Pay
                        </TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell style={{ borderRight: '2px solid black' }}>Date</TableCell>
                        {participants.map((p) => (
                            <TableCell key={p.id} style={{ borderRight: p === participants[participants.length - 1] ? '2px solid black' : 'none' }}>
                                {p.name}
                            </TableCell>
                        ))}
                        {participants.map((p) => (
                            <TableCell key={p.id} style={{ borderRight: p === participants[participants.length - 1] ? '2px solid black' : 'none' }}>
                                {p.name}
                            </TableCell>
                        ))}
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.title}</TableCell>
                            <TableCell style={{ borderRight: '2px solid black' }}>{item.date}</TableCell>
                            {participants.map((p) => (
                                <TableCell key={p.id} style={{ borderRight: p === participants[participants.length - 1] ? '2px solid black' : 'none' }}>
                                    {formatCurrency(item.paidBy[p.id] || 0, item.currency)} {/* Change 'USD' to the appropriate currency code */}
                                </TableCell>
                            ))}
                            {participants.map((p) => (
                                <TableCell key={p.id} style={{ borderRight: p === participants[participants.length - 1] ? '2px solid black' : 'none' }}>
                                    {formatCurrency(item.shouldPay[p.id] || 0, item.currency)} {/* Change 'USD' to the appropriate currency code */}
                                </TableCell>
                            ))}
                            <TableCell>
                                <IconButton size="small" onClick={() => setEditItem(item)}>
                                    ✏️
                                </IconButton>
                                <IconButton size="small" onClick={() => deleteItem(item.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                    {/* Summary Row */}
                    {Array.from(currenciesUsed).map((currency) => (
                        <TableRow key={currency}>
                            <TableCell><strong>Total {currency}</strong></TableCell>
                            <TableCell style={{ borderRight: '2px solid black' }}></TableCell>
                            {participants.map((p) => (
                                    <TableCell key={`sum-paid-${p.id}`} style={{ borderRight: 'none' }}>
                                            <strong>{formatCurrency(summaryPaidBy[currency][p.id], currency)}</strong>
                                    </TableCell>
                            ))}
                            {participants.map((p) => (
                                    <TableCell key={`sum-shouldPay-${p.id}`} style={{ borderRight: 'none' }}>
                                        <strong>{formatCurrency(summaryShouldPay[currency][p.id], currency)}</strong>
                                    </TableCell>
                            ))}
                            <TableCell></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* New Item Dialog */}
            <NewItemDialog
                open={openNewItem}
                onClose={() => setOpenNewItem(false)}
                participants={settlement.participants}
                defaultCurrency={settlement.defaultCurrency}
                onAddItem={addItem}
            />

            {/* Edit Item Dialog */}
            {editItem && (
                <EditItemDialog
                    open={Boolean(editItem)}
                    onClose={() => setEditItem(null)}
                    participants={participants}
                    item={editItem}
                    onUpdateItem={updateItem}
                />
            )}
        </>
    );
};

export default SettlementItems;