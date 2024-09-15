import React, { useContext, useState } from 'react';
import {
    Button,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { SettlementContext } from '../../context/SettlementContext';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Person, Settlement } from '../../models/models';
import { auth } from '../../firebase';
import { createTestSettlement } from '../../testing/CreateTestSettlement';
import { currencies } from '../../models/currency'; // Import currencies

const SettlementsList: React.FC = () => {
    const { settlements, addSettlement, deleteSettlement, updateSettlement } =
        useContext(SettlementContext);
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [participants, setParticipants] = useState<Person[]>([]);
    const [participantName, setParticipantName] = useState('');
    const [openEdit, setOpenEdit] = useState(false);
    const [editingSettlement, setEditingSettlement] = useState<Settlement | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState('USD'); // New state for selected currency
    const navigate = useNavigate();

    const handleCreateSettlement = () => {
        const newSettlement: Settlement = {
            id: uuidv4(),
            title,
            participants,
            items: [],
            partialSettlements: [], // Initialize as empty array
            ownerId: auth.currentUser.uid,
            isPublic: false,
            defaultCurrency: selectedCurrency // Use selected currency
        };
        addSettlement(newSettlement);
        setOpen(false);
        setTitle('');
        setSelectedCurrency('USD');
        setParticipants([]);
    };

    const handleOpenEditDialog = (settlement: Settlement) => {
        setEditingSettlement(settlement);
        setEditTitle(settlement.title);
        setSelectedCurrency(settlement.defaultCurrency);
        setOpenEdit(true);
    };

    const handleEditSettlement = () => {
        if (editingSettlement) {
            const updatedSettlement: Settlement = { 
                ...editingSettlement, 
                title: editTitle, 
                defaultCurrency: selectedCurrency // Use selected currency
            };
            updateSettlement(updatedSettlement);
            setOpenEdit(false);
            setEditingSettlement(null);
            setEditTitle('');
            setSelectedCurrency('USD');
        }
    };

    const addTestSettlement = () => {
        const testSettlement = createTestSettlement(auth.currentUser.uid);
        addSettlement(testSettlement);
    }

    return (
        <>
            <Typography variant="h4" gutterBottom>
                Settlements
            </Typography>
            <Button variant="contained" onClick={() => setOpen(true)}>
                New Settlement
            </Button>
            <Button variant="contained" onClick={() => addTestSettlement()}>
                Create Test Settlement
            </Button>
            <List>
                {settlements.map((settlement) => (
                    <ListItem
                        key={settlement.id}
                        button
                        onClick={() => navigate(`/settlements/${settlement.id}`)}
                    >
                        <ListItemText primary={settlement.title} />
                        
                        <IconButton
                            edge="end"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEditDialog(settlement);
                            }}
                        >
                            <EditIcon />
                        </IconButton>
                        
                        <IconButton
                            edge="end"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteSettlement(settlement.id);
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                ))}
            </List>

            {/* Dialog for creating a new settlement */}
            <Dialog open={open} onClose={() => setOpen(false)} disableScrollLock>
                <DialogTitle>New Settlement</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Title"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    
                    <Typography variant="h6">Participants</Typography>
                    {participants.map((p) => (
                        <Typography key={p.id}>{p.name}</Typography>
                    ))}
                    <TextField
                        margin="dense"
                        label="Name"
                        fullWidth
                        value={participantName}
                        onChange={(e) => setParticipantName(e.target.value)}
                    />
                    <Button
                        onClick={() => {
                            if (participantName.trim() !== '') {
                                setParticipants([
                                    ...participants,
                                    { id: uuidv4(), name: participantName.trim() },
                                ]);
                                setParticipantName('');
                            }
                        }}
                    >
                        Add Participant
                    </Button>
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateSettlement}>Create</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for editing a settlement */}
            <Dialog open={openEdit} onClose={() => setOpenEdit(false)} disableScrollLock>
                <DialogTitle>Edit Settlement</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Title"
                        fullWidth
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
                    <Button onClick={handleEditSettlement} disabled={editTitle.trim() === ''}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default SettlementsList;