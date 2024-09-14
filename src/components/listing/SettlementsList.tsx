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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { SettlementContext } from '../../context/SettlementContext';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Person, Settlement } from '../../models/models';
import { auth } from '../../firebase';
import { createTestSettlement } from '../../testing/CreateTestSettlement';

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
    const navigate = useNavigate();

    const handleCreateSettlement = () => {
        const newSettlement: Settlement = {
            id: uuidv4(),
            title,
            participants,
            items: [],
            partialSettlements: [], // Initialize as empty array
            ownerId: auth.currentUser.uid,
            isPublic: false
        };
        addSettlement(newSettlement);
        setOpen(false);
        setTitle('');
        setParticipants([]);
    };

    const handleOpenEditDialog = (settlement: Settlement) => {
        setEditingSettlement(settlement);
        setEditTitle(settlement.title);
        setOpenEdit(true);
    };

    const handleEditSettlement = () => {
        if (editingSettlement) {
            const updatedSettlement: Settlement = { ...editingSettlement, title: editTitle };
            updateSettlement(updatedSettlement);
            setOpenEdit(false);
            setEditingSettlement(null);
            setEditTitle('');
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