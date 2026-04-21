import { useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { FiChevronDown, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import type { Invoice, InvoiceItem, Address } from '../types';

interface Props {
  initial?: Invoice;
  onSave: (inv: Invoice) => void;
  onSaveDraft: (inv: Invoice) => void;
  onClose: () => void;
}

const emptyAddress = (): Address => ({ street: '', city: '', postCode: '', country: '' });
const emptyItem = (): InvoiceItem => ({ id: uuid(), name: '', quantity: 1, price: 0 });

function addDays(date: string, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function genId() {
  const L = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return L[Math.floor(Math.random() * 26)] + L[Math.floor(Math.random() * 26)] +
    String(Math.floor(Math.random() * 9000) + 1000);
}

function calcTotal(items: InvoiceItem[]) {
  return items.reduce((s, i) => s + i.quantity * i.price, 0);
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const TERMS = [{ v: 1, l: 'Net 1 Day' }, { v: 7, l: 'Net 7 Days' }, { v: 14, l: 'Net 14 Days' }, { v: 30, l: 'Net 30 Days' }];

// ── shared input style ──────────────────────────────────────────────────────
const inp = (err?: string) =>
  `w-full px-4 py-3 rounded border text-sm font-bold text-[#0C0E16] dark:text-white bg-white dark:bg-[#1E2139] focus:outline-none transition-colors cursor-text ${err ? 'border-[#EC5757]' : 'border-[#DFE3FA] dark:border-[#252945] hover:border-[#7C5DFA] focus:border-[#7C5DFA]'}`;

const lbl = 'block text-[13px] text-[#7E88C3] dark:text-[#DFE3FA] mb-2';

// ── Field wrapper ───────────────────────────────────────────────────────────
function Field({ label, id, error, children }: { label: string; id: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label htmlFor={id} className="text-[13px] text-[#7E88C3] dark:text-[#DFE3FA]">{label}</label>
        {error && <span className="text-[11px] text-[#EC5757]">{error}</span>}
      </div>
      {children}
    </div>
  );
}

// ── Address block ───────────────────────────────────────────────────────────
function AddressFields({ prefix, value, onChange, errors }: {
  prefix: string; value: Address; onChange: (a: Address) => void; errors: Record<string, string>;
}) {
  return (
    <div className="space-y-4">
      <Field label="Street Address" id={`${prefix}-street`} error={errors[`${prefix}.street`]}>
        <input id={`${prefix}-street`} className={inp(errors[`${prefix}.street`])}
          value={value.street} onChange={e => onChange({ ...value, street: e.target.value })} />
      </Field>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Field label="City" id={`${prefix}-city`} error={errors[`${prefix}.city`]}>
          <input id={`${prefix}-city`} className={inp(errors[`${prefix}.city`])}
            value={value.city} onChange={e => onChange({ ...value, city: e.target.value })} />
        </Field>
        <Field label="Post Code" id={`${prefix}-postCode`} error={errors[`${prefix}.postCode`]}>
          <input id={`${prefix}-postCode`} className={inp(errors[`${prefix}.postCode`])}
            value={value.postCode} onChange={e => onChange({ ...value, postCode: e.target.value })} />
        </Field>
        <div className="col-span-2 lg:col-span-1">
          <Field label="Country" id={`${prefix}-country`} error={errors[`${prefix}.country`]}>
            <input id={`${prefix}-country`} className={inp(errors[`${prefix}.country`])}
              value={value.country} onChange={e => onChange({ ...value, country: e.target.value })} />
          </Field>
        </div>
      </div>
    </div>
  );
}

// ── Custom date picker ──────────────────────────────────────────────────────
function DatePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const date = value ? new Date(value + 'T00:00:00') : new Date();
  const [viewYear, setViewYear] = useState(date.getFullYear());
  const [viewMonth, setViewMonth] = useState(date.getMonth());

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }
  function selectDay(d: number) {
    const mm = String(viewMonth + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    onChange(`${viewYear}-${mm}-${dd}`);
    setOpen(false);
  }

  const selectedDay = value ? new Date(value + 'T00:00:00') : null;
  const isSelected = (d: number) =>
    selectedDay &&
    selectedDay.getFullYear() === viewYear &&
    selectedDay.getMonth() === viewMonth &&
    selectedDay.getDate() === d;

  const displayLabel = value
    ? `${String(new Date(value + 'T00:00:00').getDate()).padStart(2,'0')} ${MONTHS[new Date(value + 'T00:00:00').getMonth()]} ${new Date(value + 'T00:00:00').getFullYear()}`
    : 'Select date';

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(o => !o)}
        className={`w-full px-4 py-3 rounded border text-sm font-bold text-left flex justify-between items-center transition-colors cursor-pointer bg-white dark:bg-[#1E2139] text-[#0C0E16] dark:text-white ${open ? 'border-[#7C5DFA]' : 'border-[#DFE3FA] dark:border-[#252945] hover:border-[#7C5DFA]'}`}>
        {displayLabel}
        <FiChevronDown size={13} className={`text-[#7C5DFA] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+8px)] left-0 z-30 bg-white dark:bg-[#252945] rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.2)] p-6 w-[260px]">
          {/* Month/year nav */}
          <div className="flex items-center justify-between mb-5">
            <button type="button" onClick={prevMonth} className="text-[#7C5DFA] hover:opacity-70 cursor-pointer p-1">
              <FiChevronLeft size={14} />
            </button>
            <span className="text-sm font-bold text-[#0C0E16] dark:text-white">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button type="button" onClick={nextMonth} className="text-[#7C5DFA] hover:opacity-70 cursor-pointer p-1">
              <FiChevronRight size={14} />
            </button>
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-y-2">
            {Array.from({ length: firstDay }).map((_, i) => <span key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => (
              <button key={d} type="button" onClick={() => selectDay(d)}
                className={`text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-colors
                  ${isSelected(d)
                    ? 'bg-[#7C5DFA] text-white'
                    : 'text-[#0C0E16] dark:text-white hover:text-[#7C5DFA]'}`}>
                {d}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Custom payment terms dropdown ───────────────────────────────────────────
function TermsPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const label = TERMS.find(t => t.v === value)?.l ?? 'Net 30 Days';

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(o => !o)}
        className={`w-full px-4 py-3 rounded border text-sm font-bold text-left flex justify-between items-center transition-colors cursor-pointer bg-white dark:bg-[#1E2139] text-[#0C0E16] dark:text-white ${open ? 'border-[#7C5DFA]' : 'border-[#DFE3FA] dark:border-[#252945] hover:border-[#7C5DFA]'}`}>
        {label}
        <FiChevronDown size={13} className={`text-[#7C5DFA] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+10px)] left-0 z-30 w-full bg-white dark:bg-[#252945] rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.2)] overflow-hidden">
          {TERMS.map((t, i) => (
            <button key={t.v} type="button" onClick={() => { onChange(t.v); setOpen(false); }}
              className={`w-full px-4 py-4 text-sm font-bold text-left cursor-pointer transition-colors text-[#0C0E16] dark:text-white hover:text-[#7C5DFA]
                ${i < TERMS.length - 1 ? 'border-b border-[#DFE3FA] dark:border-[#1E2139]' : ''}`}>
              {t.l}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main form ───────────────────────────────────────────────────────────────
export default function InvoiceForm({ initial, onSave, onSaveDraft, onClose }: Props) {
  const today = new Date().toISOString().split('T')[0];
  const [senderAddress, setSenderAddress] = useState<Address>(initial?.senderAddress ?? emptyAddress());
  const [clientName, setClientName] = useState(initial?.clientName ?? '');
  const [clientEmail, setClientEmail] = useState(initial?.clientEmail ?? '');
  const [clientAddress, setClientAddress] = useState<Address>(initial?.clientAddress ?? emptyAddress());
  const [createdAt, setCreatedAt] = useState(initial?.createdAt ?? today);
  const [paymentTerms, setPaymentTerms] = useState(initial?.paymentTerms ?? 30);
  const [description, setDescription] = useState(initial?.description ?? '');
  const [items, setItems] = useState<InvoiceItem[]>(initial?.items?.length ? initial.items : [emptyItem()]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const firstRef = useRef<HTMLInputElement>(null);

  useEffect(() => { firstRef.current?.focus(); }, []);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  function validate() {
    const e: Record<string, string> = {};
    if (!clientName.trim()) e.clientName = 'Required';
    if (!clientEmail.trim()) e.clientEmail = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) e.clientEmail = 'Invalid email';
    if (!description.trim()) e.description = 'Required';
    if (!senderAddress.street.trim()) e['s.street'] = 'Required';
    if (!senderAddress.city.trim()) e['s.city'] = 'Required';
    if (!senderAddress.postCode.trim()) e['s.postCode'] = 'Required';
    if (!senderAddress.country.trim()) e['s.country'] = 'Required';
    if (!clientAddress.street.trim()) e['c.street'] = 'Required';
    if (!clientAddress.city.trim()) e['c.city'] = 'Required';
    if (!clientAddress.postCode.trim()) e['c.postCode'] = 'Required';
    if (!clientAddress.country.trim()) e['c.country'] = 'Required';
    if (items.length === 0) e.items = 'Add at least one item';
    items.forEach((item, i) => {
      if (!item.name.trim()) e[`item.${i}.name`] = 'Required';
      if (item.quantity <= 0) e[`item.${i}.qty`] = '> 0';
      if (item.price < 0) e[`item.${i}.price`] = '≥ 0';
    });
    return e;
  }

  function build(status: Invoice['status']): Invoice {
    return {
      id: initial?.id ?? genId(),
      createdAt, paymentDue: addDays(createdAt, paymentTerms),
      description, paymentTerms, clientName, clientEmail, status,
      senderAddress, clientAddress, items, total: calcTotal(items),
    };
  }

  function handleSend() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(build(initial?.status === 'draft' ? 'pending' : (initial?.status ?? 'pending')));
  }

  function updateItem(i: number, field: keyof InvoiceItem, value: string | number) {
    setItems(p => p.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
  }

  return (
    <div className="fixed inset-0 z-40 flex" role="dialog" aria-modal="true" aria-label={initial ? 'Edit invoice' : 'New invoice'}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="hidden lg:block absolute left-[83px] top-0 w-5 h-5 bg-white dark:bg-[#141625] z-20" />
      <div className="hidden lg:block absolute left-[83px] bottom-0 w-5 h-5 bg-white dark:bg-[#141625] z-20" />

      <div className="relative z-10 flex flex-col bg-white dark:bg-[#141625]
        w-full max-w-[616px] h-full
        lg:ml-[103px] lg:rounded-r-[20px]
        overflow-hidden">

        <div className="px-6 lg:px-14 pt-[88px] lg:pt-14 pb-6 bg-white dark:bg-[#141625]">
          <h1 className="text-2xl font-bold text-[#0C0E16] dark:text-white">
            {initial ? `Edit #${initial.id}` : 'New Invoice'}
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto px-6 lg:px-14 pb-4">
          <div className="space-y-10">
            <section>
              <h3 className="text-[#7C5DFA] font-bold text-sm mb-4">Bill From</h3>
              <AddressFields prefix="s" value={senderAddress} onChange={setSenderAddress} errors={errors} />
            </section>

            <section>
              <h3 className="text-[#7C5DFA] font-bold text-sm mb-4">Bill To</h3>
              <div className="space-y-4">
                <Field label="Client's Name" id="clientName" error={errors.clientName}>
                  <input ref={firstRef} id="clientName" className={inp(errors.clientName)}
                    value={clientName} onChange={e => setClientName(e.target.value)} />
                </Field>
                <Field label="Client's Email" id="clientEmail" error={errors.clientEmail}>
                  <input id="clientEmail" type="email" className={inp(errors.clientEmail)}
                    value={clientEmail} onChange={e => setClientEmail(e.target.value)} />
                </Field>
                <AddressFields prefix="c" value={clientAddress} onChange={setClientAddress} errors={errors} />
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Field label="Invoice Date" id="createdAt">
                <DatePicker value={createdAt} onChange={setCreatedAt} />
              </Field>
              <Field label="Payment Terms" id="paymentTerms">
                <TermsPicker value={paymentTerms} onChange={setPaymentTerms} />
              </Field>
              <div className="lg:col-span-2">
                <Field label="Project Description" id="description" error={errors.description}>
                  <input id="description" className={inp(errors.description)}
                    value={description} onChange={e => setDescription(e.target.value)} />
                </Field>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-[#777F98] mb-4">Item List</h3>
              {errors.items && <p className="text-[#EC5757] text-xs mb-3">{errors.items}</p>}

              <div className="space-y-[72px] lg:space-y-4">
                <div className="hidden lg:grid grid-cols-[1fr_64px_100px_80px_24px] gap-4">
                  {['Item Name', 'Qty.', 'Price', 'Total', ''].map(h => (
                    <span key={h} className={lbl}>{h}</span>
                  ))}
                </div>

                {items.map((item, i) => (
                  <div key={item.id} className="flex flex-col lg:grid lg:grid-cols-[1fr_64px_100px_80px_24px] gap-4">
                    <div>
                      <label className="lg:hidden text-[11px] text-[#7E88C3] mb-1 block">Item Name</label>
                      <input aria-label="Item name" className={inp(errors[`item.${i}.name`])}
                        value={item.name} onChange={e => updateItem(i, 'name', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-[64px_100px_1fr_24px] lg:contents gap-4 items-center">
                      <div>
                        <label className="lg:hidden text-[11px] text-[#7E88C3] mb-1 block">Qty.</label>
                        <input aria-label="Quantity" type="number" min={1} className={`${inp(errors[`item.${i}.qty`])} cursor-pointer`}
                          value={item.quantity} onChange={e => updateItem(i, 'quantity', Number(e.target.value))} />
                      </div>
                      <div>
                        <label className="lg:hidden text-[11px] text-[#7E88C3] mb-1 block">Price</label>
                        <input aria-label="Price" type="number" min={0} step={0.01} className={inp(errors[`item.${i}.price`])}
                          value={item.price} onChange={e => updateItem(i, 'price', Number(e.target.value))} />
                      </div>
                      <div>
                        <label className="lg:hidden text-[11px] text-[#7E88C3] mb-1 block">Total</label>
                        <p className="text-[#888EB0] dark:text-[#DFE3FA] font-bold text-sm pt-3">
                          {(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                      <button aria-label="Remove item" onClick={() => setItems(p => p.filter((_, idx) => idx !== i))}
                        className="text-[#888EB0] hover:text-[#EC5757] transition-colors mt-3">
                        <svg width="13" height="16" viewBox="0 0 13 16" fill="currentColor">
                          <path d="M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H2.694a1.777 1.777 0 01-1.777-1.778V3.556h10.666zM8.473 0l.888.889H13v1.778H0V.889h3.64L4.528 0h3.945z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => setItems(p => [...p, emptyItem()])}
                className="mt-20 lg:mt-10 w-full py-4 rounded-full bg-[#F9FAFE] dark:bg-[#252945] text-[#7E88C3] dark:text-[#DFE3FA] font-bold text-sm hover:bg-[#DFE3FA] dark:hover:bg-[#0C0E16] transition-colors">
                + Add New Item
              </button>
            </section>
          </div>
        </div>

        <div className="mt-15 px-6 lg:px-14 py-8 bg-white dark:bg-[#141625] shadow-[0_-16px_48px_rgba(0,0,0,0.15)] flex items-center gap-2">
          {!initial ? (
            <>
              <button onClick={onClose}
                className="px-[15px] py-[12px] lg:px-6 lg:py-4 rounded-full bg-[#F9FAFE] dark:bg-[#252945] text-[#7E88C3] dark:text-[#DFE3FA] font-bold text-sm hover:bg-[#DFE3FA] transition-colors">
                Discard
              </button>
              <div className="flex-1" />
              <button onClick={() => onSaveDraft(build('draft'))}
                className="px-[15px] py-[12px] lg:px-6 lg:py-4 rounded-full bg-[#373B53] text-[#888EB0] font-bold md:text-sm text-[12px] hover:bg-[#0C0E16] transition-colors">
                Save as Draft
              </button>
              <button onClick={handleSend}
                className="px-[15px] py-[12px] lg:px-6 lg:py-4 rounded-full bg-[#7C5DFA] text-white font-bold md:text-sm text-[12px] hover:bg-[#9277FF] transition-colors">
                Save &amp; Send
              </button>
            </>
          ) : (
            <>
              <div className="flex-1" />
              <button onClick={onClose}
                className="px-[15px] py-[12px] lg:px-6 lg:py-4 rounded-full bg-[#F9FAFE] dark:bg-[#252945] text-[#7E88C3] dark:text-[#DFE3FA] font-bold text-sm hover:bg-[#DFE3FA] transition-colors">
                Cancel
              </button>
              <button onClick={handleSend}
                className="px-[15px] py-[12px] lg:px-6 lg:py-4 rounded-full bg-[#7C5DFA] text-white font-bold text-sm hover:bg-[#9277FF] transition-colors">
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
