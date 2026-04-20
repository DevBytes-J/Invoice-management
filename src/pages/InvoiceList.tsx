import { useState } from 'react';
import { useInvoices } from '../context/InvoiceContext';
import InvoiceHeader from '../components/InvoiceHeader';
import StatusBadge from '../components/StatusBadge';
import type { InvoiceStatus } from '../types';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatAmount(n: number) {
  return '£ ' + n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

interface Props {
  onNewInvoice: () => void;
  onSelect: (id: string) => void;
}

export default function InvoiceList({ onNewInvoice, onSelect }: Props) {
  const { invoices } = useInvoices();
  const [selected, setSelected] = useState<InvoiceStatus[]>([]);

  const filtered = selected.length ? invoices.filter(i => selected.includes(i.status)) : invoices;

  return (
    <div className="min-h-screen bg-[#F8F8FB] dark:bg-[#141625] px-6 py-12 lg:py-16">
      <div className="max-w-[780px] mx-auto">

        <InvoiceHeader
          total={filtered.length}
          onNewInvoice={onNewInvoice}
          selected={selected}
          onFilterChange={setSelected}
        />

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-16 text-center">
            <img src="/empty.png" alt="" className="w-[214px] mb-10" aria-hidden="true" />
            <h2 className="text-xl font-bold text-[#0C0E16] dark:text-white mb-4">There is nothing here</h2>
            <p className="text-[#888EB0] text-sm max-w-[220px] leading-relaxed">
              Create an invoice by clicking the{' '}
              <strong className="text-[#888EB0]">New Invoice</strong> button and get started
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {filtered.map(inv => (
              <li key={inv.id}>
                <button
                  style={{ boxShadow: '0px 10px 10px -10px #48549F1A' }}
                  onClick={() => onSelect(inv.id)}
                  className="w-full text-left bg-white dark:bg-[#1E2139] rounded-lg border border-transparent hover:border-[#7C5DFA] transition-all px-[30px] pt-[16px] pb-[16px] flex flex-col lg:flex-row lg:items-center lg:gap-7"
                >
                  <div className="flex justify-between items-start lg:hidden mb-4">
                    <span className="font-bold text-[#0C0E16] dark:text-white text-[15px]">
                      <span className="text-[#7E88C3]">#</span>{inv.id}
                    </span>
                    <span className="text-[#888EB0] text-sm">{inv.clientName}</span>
                  </div>
                  <div className="flex justify-between items-center lg:hidden">
                    <div>
                      <p className="text-[#888EB0] text-sm mb-2">Due {formatDate(inv.paymentDue)}</p>
                      <p className="font-bold text-lg text-[#0C0E16] dark:text-white">{formatAmount(inv.total)}</p>
                    </div>
                    <StatusBadge status={inv.status} />
                  </div>

                  <span className="hidden lg:block font-bold text-[#0C0E16] dark:text-white w-[100px] shrink-0 text-[15px]">
                    <span className="text-[#7E88C3]">#</span>{inv.id}
                  </span>
                  <span className="hidden lg:block text-[#888EB0] text-sm w-[130px] shrink-0">
                    Due {formatDate(inv.paymentDue)}
                  </span>
                  <span className="hidden lg:block text-[#888EB0] text-sm flex-1">
                    {inv.clientName}
                  </span>
                  <span className="hidden lg:block font-bold text-lg text-[#0C0E16] dark:text-white w-[130px] text-right shrink-0 text-[15px]">
                    {formatAmount(inv.total)}
                  </span>
                  <div className="hidden lg:flex items-center gap-8 shrink-0">
                    <StatusBadge status={inv.status} />
                    <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
                      <path d="M1 1l4 4-4 4" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
