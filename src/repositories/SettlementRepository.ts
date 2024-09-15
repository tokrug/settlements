import { Settlement } from '../models/models';
import { db } from '../firebase';
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
    query,
    where,
    onSnapshot,
    QuerySnapshot,
    setDoc,
    getDoc,
} from 'firebase/firestore';

/**
 * Adds a new settlement to the database.
 * @param settlement The settlement to add.
 */
export const addSettlement = async (settlement: Settlement): Promise<void> => {
    try {
        await setDoc(doc(db, 'settlements', settlement.id), settlement);
    } catch (error) {
        console.error('Error adding settlement:', error);
        throw error;
    }
};

/**
 * Deletes a settlement by its ID.
 * @param id The ID of the settlement to delete.
 */
export const deleteSettlement = async (id: string): Promise<void> => {
    try {
        const settlementDoc = doc(db, 'settlements', id);
        await deleteDoc(settlementDoc);
    } catch (error) {
        console.error('Error deleting settlement:', error);
        throw error;
    }
};

/**
 * Updates an existing settlement.
 * @param settlement The settlement with updated data.
 */
export const updateSettlement = async (settlement: Settlement): Promise<void> => {
    try {
        await setDoc(doc(db, 'settlements', settlement.id), settlement, { merge: true });
    } catch (error) {
        console.error('Error updating settlement:', error);
        throw error;
    }
};

/**
 * Retrieves a list of settlements for the specified owner.
 * @param ownerId The ID of the owner.
 * @param callback Function to handle real-time updates.
 * @returns A function to unsubscribe from the snapshot listener.
 */
export const getSettlements = (
    ownerId: string,
    callback: (settlements: Settlement[]) => void
): () => void => {
    const q = query(collection(db, 'settlements'), where('ownerId', '==', ownerId));
    const unsubscribe = onSnapshot(
        q,
        (snapshot: QuerySnapshot) => {
            const settlements: Settlement[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Settlement[];
            callback(settlements);
        },
        (error) => {
            console.error('Error fetching settlements:', error);
        }
    );
    return unsubscribe;
};


/**
 * Retrieves a single settlement by ID with real-time updates.
 * @param id The ID of the settlement.
 * @param callback Function to handle the updated settlement data.
 * @returns A function to unsubscribe from the snapshot listener.
 */
export const getSettlement = (
    id: string,
    callback: (settlement: Settlement | undefined) => void
): () => void => {
    const settlementDoc = doc(db, 'settlements', id);
    const unsubscribe = onSnapshot(
        settlementDoc,
        (docSnap) => {
            if (docSnap.exists()) {
                const settlement: Settlement = { id: docSnap.id, ...docSnap.data() } as Settlement;
                callback(settlement);
            } else {
                callback(undefined);
            }
        },
        (error) => {
            console.error('Error fetching settlement:', error);
            callback(undefined);
        }
    );
    return unsubscribe;
};