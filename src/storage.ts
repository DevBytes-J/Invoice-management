import type { Invoice } from './types';

const KEY = 'invoices';

const SEED: Invoice[] = [
  {
    id: 'RT3080', createdAt: '2021-07-19', paymentDue: '2021-08-19', description: 'Re-branding',
    paymentTerms: 30, clientName: 'Jensen Huang', clientEmail: 'jensen@example.com', status: 'paid',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '106 Kendell Street', city: 'Sharrington', postCode: 'NR24 5WQ', country: 'United Kingdom' },
    items: [{ id: '1', name: 'Brand Guidelines', quantity: 1, price: 1800.90 }], total: 1800.90,
  },
  {
    id: 'XM9141', createdAt: '2021-08-21', paymentDue: '2021-09-20', description: 'Graphic Design',
    paymentTerms: 30, clientName: 'Alex Grim', clientEmail: 'alex@example.com', status: 'pending',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '84 Church Way', city: 'Bradford', postCode: 'BD1 9PB', country: 'United Kingdom' },
    items: [{ id: '1', name: 'Banner Design', quantity: 1, price: 556.00 }], total: 556.00,
  },
  {
    id: 'RG0314', createdAt: '2021-09-01', paymentDue: '2021-10-01', description: 'Website Redesign',
    paymentTerms: 30, clientName: 'John Morrison', clientEmail: 'john@example.com', status: 'paid',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '2 Stratford Drive', city: 'Bowerham', postCode: 'LA1 4AX', country: 'United Kingdom' },
    items: [{ id: '1', name: 'Website Redesign', quantity: 1, price: 14002.33 }], total: 14002.33,
  },
  {
    id: 'RT2080', createdAt: '2021-09-12', paymentDue: '2021-10-12', description: 'Logo Concept',
    paymentTerms: 30, clientName: 'Alysa Werner', clientEmail: 'alysa@example.com', status: 'pending',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '63 Warwick Road', city: 'Carlisle', postCode: 'CA1 1ER', country: 'United Kingdom' },
    items: [{ id: '1', name: 'Logo Sketches', quantity: 1, price: 102.04 }], total: 102.04,
  },
  {
    id: 'AA1449', createdAt: '2021-09-14', paymentDue: '2021-10-14', description: 'Re-branding',
    paymentTerms: 30, clientName: 'Mellisa Clarke', clientEmail: 'mellisa@example.com', status: 'pending',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '46 Abbey Row', city: 'Cambridge', postCode: 'CB5 6EG', country: 'United Kingdom' },
    items: [{ id: '1', name: 'New Logo', quantity: 1, price: 4032.33 }], total: 4032.33,
  },
  {
    id: 'TY9141', createdAt: '2021-10-31', paymentDue: '2021-10-31', description: 'Landing Page Design',
    paymentTerms: 30, clientName: 'Thomas Wayne', clientEmail: 'thomas@example.com', status: 'pending',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '3 Tally Hill', city: 'Ibstock', postCode: 'LE67 6RR', country: 'United Kingdom' },
    items: [{ id: '1', name: 'Landing Page', quantity: 1, price: 6155.91 }], total: 6155.91,
  },
  {
    id: 'FV2353', createdAt: '2021-11-12', paymentDue: '2021-12-12', description: 'Logo Re-design',
    paymentTerms: 30, clientName: 'Anita Wainwright', clientEmail: 'anita@example.com', status: 'draft',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '17 Elm Road', city: 'Manchester', postCode: 'M1 1AE', country: 'United Kingdom' },
    items: [{ id: '1', name: 'Logo Re-design', quantity: 1, price: 3102.04 }], total: 3102.04,
  },
];

export function loadInvoices(): Invoice[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as Invoice[]) : [];
    if (parsed.length === 0) {
      localStorage.setItem(KEY, JSON.stringify(SEED));
      return SEED;
    }
    return parsed;
  } catch {
    return SEED;
  }
}

export function saveInvoices(invoices: Invoice[]): void {
  localStorage.setItem(KEY, JSON.stringify(invoices));
}
