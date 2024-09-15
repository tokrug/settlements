import { Item, PartialSettlement, Person, Settlement } from "../models/models";
import { v4 as uuidv4 } from 'uuid';

export const createTestSettlement = (ownerId: string): Settlement => {
    // Generate UUIDs for persons
    const person1Id = uuidv4();
    const person2Id = uuidv4();
    const person3Id = uuidv4();
  
    const person1: Person = { id: person1Id, name: 'Alice' };
    const person2: Person = { id: person2Id, name: 'Bob' };
    const person3: Person = { id: person3Id, name: 'Charlie' };
  
    // Generate UUIDs for items
    const item1Id = uuidv4();
    const item2Id = uuidv4();
  
    const item1: Item = {
      id: item1Id,
      title: 'Lunch',
      date: '2023-01-01',
      paidBy: { [person1Id]: 30 },
      shouldPay: {
        [person1Id]: 10,
        [person2Id]: 10,
        [person3Id]: 10,
      },
      currency: 'USD'
    };
  
    const item2: Item = {
      id: item2Id,
      title: 'Museum Tickets',
      date: '2023-01-02',
      paidBy: { [person2Id]: 45 },
      shouldPay: {
        [person1Id]: 15,
        [person2Id]: 15,
        [person3Id]: 15,
      },
      currency: 'USD'
    };
  
    // Generate UUIDs for partial settlements
    const partialSettlement1Id = uuidv4();
    const partialSettlement2Id = uuidv4();
  
    const partialSettlement1: PartialSettlement = {
      id: partialSettlement1Id,
      date: '2023-01-03',
      amount: 10,
      senderId: person2Id,
      receiverId: person1Id,
      currency: 'USD'
    };
  
    const partialSettlement2: PartialSettlement = {
      id: partialSettlement2Id,
      date: '2023-01-04',
      amount: 15,
      senderId: person3Id,
      receiverId: person2Id,
      currency: 'USD'
    };
  
    // Generate a UUID for the settlement
    const settlementId = uuidv4();
  
    const settlement: Settlement = {
      id: settlementId,
      title: 'Weekend Trip',
      participants: [person1, person2, person3],
      items: [item1, item2],
      partialSettlements: [partialSettlement1, partialSettlement2],
      ownerId: ownerId, // Use the input parameter for ownerId
      isPublic: false,
      defaultCurrency: 'USD'
    };
  
    return settlement;
}