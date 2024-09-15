import React, { useState, useEffect } from 'react';
import {
    Typography,
    Button,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Settlement,
    Item,
    PartialSettlement
} from '../../models/models';
import { getSettlement, updateSettlement } from '../../repositories/SettlementRepository';
import { auth } from '../../firebase';
import SettlementItems from './settlement-items/SettlementItems';
import PartialSettlements from './transfer/PartialSettlements';
import DebtMatrix from './DebtMatrix';
import Balances from './Balances';
import ProposedTransfers from './ProposedTransfers';

const SettlementDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [settlement, setSettlement] = useState<Settlement | undefined>(undefined);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            const unsubscribe = getSettlement(id, setSettlement);
            return () => unsubscribe();
        } else {
            setSettlement(undefined);
        }
    }, [id]);

    if (!settlement) return <Typography>Settlement not found</Typography>;

    if (!settlement.partialSettlements) {
        settlement.partialSettlements = [];
    }

    const handleAddItem = (item: Item) => {
        const updatedItems = [...settlement.items, item];
        const updatedSettlement = { ...settlement, items: updatedItems };
        updateSettlement(updatedSettlement);
    };

    const handleDeleteItem = (itemId: string) => {
        const updatedItems = settlement.items.filter((i) => i.id !== itemId);
        const updatedSettlement = { ...settlement, items: updatedItems };
        updateSettlement(updatedSettlement);
    };

    const handleUpdateItem = (updatedItem: Item) => {
        const updatedItems = settlement.items.map((item) =>
            item.id === updatedItem.id ? updatedItem : item
        );
        const updatedSettlement = { ...settlement, items: updatedItems };
        updateSettlement(updatedSettlement);
    };

    const handleAddTransfer = (transfer: PartialSettlement) => {
        const updatedTransfers = [...settlement.partialSettlements, transfer];
        const updatedSettlement = { ...settlement, partialSettlements: updatedTransfers };
        updateSettlement(updatedSettlement);
    };

    const handleDeleteTransfer = (transferId: string) => {
        const updatedTransfers = settlement.partialSettlements.filter(
            (t) => t.id !== transferId
        );
        const updatedSettlement = { ...settlement, partialSettlements: updatedTransfers };
        updateSettlement(updatedSettlement);
    };

    const handleUpdateTransfer = (updatedTransfer: PartialSettlement) => {
        const updatedTransfers = settlement.partialSettlements.map((t) =>
            t.id === updatedTransfer.id ? updatedTransfer : t
        );
        const updatedSettlement = { ...settlement, partialSettlements: updatedTransfers };
        updateSettlement(updatedSettlement);
    };

    const togglePublicAccess = async () => {
        if (!settlement) return;
        const updatedSettlement: Settlement = {
            ...settlement,
            isPublic: !settlement.isPublic,
        };
        await updateSettlement(updatedSettlement);
    };

    return (
        <>
            <Typography variant="h4" gutterBottom>
                {settlement.title}
            </Typography>
            <Button size="small" variant="outlined" onClick={() => navigate('/settlements')}>
                Back to List
            </Button>
            {auth.currentUser?.uid === settlement.ownerId && (
                <Button
                    size="small"
                    variant="outlined"
                    onClick={togglePublicAccess}
                    style={{ marginLeft: '1rem' }}
                >
                    {settlement.isPublic ? 'Disable Share Link' : 'Enable Share Link'}
                </Button>
            )}

            {/* Settlement Items Component */}
            <SettlementItems
                settlement={settlement}
                addItem={handleAddItem}
                deleteItem={handleDeleteItem}
                updateItem={handleUpdateItem}
            />

            {/* Partial Settlements Component */}
            <PartialSettlements
                settlement={settlement}
                addTransfer={handleAddTransfer}
                deleteTransfer={handleDeleteTransfer}
                updateTransfer={handleUpdateTransfer}
            />

            {/* Balances Component */}
            <Balances
                settlement={settlement}
            />

            {/* Proposed Transfers Component */}
            <ProposedTransfers
                settlement={settlement}
                addTransfer={handleAddTransfer}
            />

            {/* Debts Matrix Component */}
            <DebtMatrix
                settlement={settlement}
            />
        </>
    );
};

export default SettlementDetail;