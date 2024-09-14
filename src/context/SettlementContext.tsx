import React, { createContext, useState, useEffect } from 'react';
import { Settlement } from '../models/models';
import { auth } from '../firebase';
import { addSettlement, deleteSettlement, updateSettlement, getSettlements } from '../repositories/SettlementRepository';
import { useUser } from './UserContext';

interface SettlementContextType {
    settlements: Settlement[];
    addSettlement: (settlement: Settlement) => Promise<void>;
    updateSettlement: (settlement: Settlement) => Promise<void>;
    deleteSettlement: (id: string) => Promise<void>;
}

export const SettlementContext = createContext<SettlementContextType>({
    settlements: [],
    addSettlement: async () => {},
    updateSettlement: async () => {},
    deleteSettlement: async () => {},
});

export const SettlementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settlements, setSettlements] = useState<Settlement[]>([]);
    const { user } = useUser();

    useEffect(() => {
        if (auth.currentUser) {
            const unsubscribe = getSettlements(auth.currentUser.uid, setSettlements);
            return () => unsubscribe();
        } else {
            setSettlements([]);
        }
    }, [user]);

    const handleAddSettlement = async (settlement: Settlement) => {
        await addSettlement(settlement);
    };

    const handleUpdateSettlement = async (settlement: Settlement) => {
        await updateSettlement(settlement);
    };

    const handleDeleteSettlement = async (id: string) => {
        await deleteSettlement(id);
    };

    return (
        <SettlementContext.Provider
            value={{
                settlements,
                addSettlement: handleAddSettlement,
                updateSettlement: handleUpdateSettlement,
                deleteSettlement: handleDeleteSettlement,
            }}
        >
            {children}
        </SettlementContext.Provider>
    );
};
