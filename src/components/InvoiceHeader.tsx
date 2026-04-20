import { useState } from 'react';
import { FiPlus, FiChevronDown } from 'react-icons/fi';
import type { InvoiceStatus } from '../types';

const ALL_STATUSES: InvoiceStatus[] = ['draft', 'pending', 'paid'];

interface Props {
  total: number;
  onNewInvoice: () => void;
  selected: InvoiceStatus[];
  onFilterChange: (s: InvoiceStatus[]) => void;
}

export default function InvoiceHeader({ total, onNewInvoice, selected, onFilterChange }: Props) {
  const [filterOpen, setFilterOpen] = useState(false);

  function toggleFilter(s: InvoiceStatus) {
    onFilterChange(selected.includes(s) ? [] : [s]);
  }

  return (
    <div className="flex items-center justify-between mb-10">
      <div>
        <h1 className="text-3xl font-bold text-[#0C0E16] dark:text-white tracking-tight">Invoices</h1>
        <p className="text-[13px] text-[#888EB0] mt-1">
          <span className="hidden lg:inline">There are </span>
          {total}
          <span className="hidden lg:inline"> total</span>
          {' '}invoice{total !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <button
            onClick={() => setFilterOpen(o => !o)}
            className="flex items-center gap-2 font-bold text-[#0C0E16] dark:text-white hover:opacity-70 transition-opacity"
            aria-expanded={filterOpen}
          >
            <span className="hidden lg:inline">Filter by status</span>
            <span className="lg:hidden">Filter</span>
            <FiChevronDown size={13} className={`text-[#7C5DFA] transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
          </button>

          {filterOpen && (
            <div className="absolute top-9 left-1/2 -translate-x-1/2 w-48 bg-white dark:bg-[#252945] rounded-lg shadow-2xl p-6 space-y-4 z-20">
              {ALL_STATUSES.map(s => (
                <label key={s} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selected.includes(s)}
                    onChange={() => toggleFilter(s)}
                    className="w-4 h-4 rounded accent-[#7C5DFA] cursor-pointer"
                  />
                  <span className="capitalize font-bold text-sm text-[#0C0E16] dark:text-white group-hover:text-[#7C5DFA] transition-colors">
                    {s}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onNewInvoice}
          className="flex items-center gap-3 bg-[#7C5DFA] hover:bg-[#9277FF] text-white font-bold pl-2 pr-5 py-2 rounded-full transition-colors"
        >
          <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0">
            <FiPlus size={15} className="text-[#7C5DFA]" strokeWidth={3} />
          </span>
          <span className="hidden lg:inline">New Invoice</span>
          <span className="lg:hidden">New</span>
        </button>
      </div>
    </div>
  );
}
