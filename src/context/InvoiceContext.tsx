import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { Invoice, InvoiceStatus } from '../types';
import { loadInvoices, saveInvoices } from '../storage';

interface InvoiceCtx {
  invoices: Invoice[];
  add: (inv: Invoice) => void;
  update: (inv: Invoice) => void;
  remove: (id: string) => void;
  markPaid: (id: string) => void;
}

const Ctx = createContext<InvoiceCtx>(null!);

export function InvoiceProvider({ children }: { children: React.ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>(loadInvoices);

  useEffect(() => saveInvoices(invoices), [invoices]);

  const add      = useCallback((inv: Invoice) => setInvoices(p => [inv, ...p]), []);
  const update   = useCallback((inv: Invoice) => setInvoices(p => p.map(i => i.id === inv.id ? inv : i)), []);
  const remove   = useCallback((id: string)   => setInvoices(p => p.filter(i => i.id !== id)), []);
  const markPaid = useCallback((id: string)   =>
    setInvoices(p => p.map(i => i.id === id ? { ...i, status: 'paid' as InvoiceStatus } : i)), []);

  return <Ctx.Provider value={{ invoices, add, update, remove, markPaid }}>{children}</Ctx.Provider>;
}

export const useInvoices = () => useContext(Ctx);
