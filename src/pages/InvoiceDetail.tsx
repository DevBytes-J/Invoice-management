import { useState } from 'react';
import { useInvoices } from '../context/InvoiceContext';
import StatusBadge from '../components/StatusBadge';
import DeleteModal from '../components/DeleteModal';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatAmount(n: number) {
  return '£ ' + n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

interface Props {
  id: string;
  onBack: () => void;
  onEdit: (id: string) => void;
}

export default function InvoiceDetail({ id, onBack, onEdit }: Props) {
  const { invoices, remove, markPaid } = useInvoices();
  const [showDelete, setShowDelete] = useState(false);

  const inv = invoices.find(i => i.id === id);
  if (!inv) return <div className="p-8 text-[#888EB0]">Invoice not found.</div>;

  function handleDelete() {
    remove(inv!.id);
    onBack();
  }

  const labelCls = 'text-[13px] text-[#7E88C3] dark:text-[#DFE3FA] mb-2';
  const valueCls = 'font-bold text-[15px] text-[#0C0E16] dark:text-white';

  return (
    <div className="min-h-screen bg-[#F8F8FB] dark:bg-[#141625] px-6 py-12 lg:py-16">
      <div className="max-w-[780px] mx-auto">

        <button onClick={onBack} className="flex items-center gap-4 font-bold text-[#0C0E16] dark:text-white hover:opacity-70 mb-8 transition-opacity">
          <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
            <path d="M6 1L1 5l5 4" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Go back
        </button>

        <div className="bg-white dark:bg-[#1E2139] rounded-lg px-8 py-5 flex items-center justify-between mb-4"
          style={{ boxShadow: '0px 10px 10px -10px #48549F1A' }}>
          <div className="flex items-center gap-4">
            <span className="text-[#888EB0] text-sm">Status</span>
            <StatusBadge status={inv.status} />
          </div>
          <div className="hidden lg:flex items-center gap-3">
            {inv.status !== 'paid' && (
              <button onClick={() => onEdit(inv.id)}
                className="px-6 py-3 rounded-full bg-[#F9FAFE] dark:bg-[#252945] text-[#7E88C3] dark:text-[#DFE3FA] font-bold hover:bg-[#DFE3FA] transition-colors text-sm">
                Edit
              </button>
            )}
            <button onClick={() => setShowDelete(true)}
              className="px-6 py-3 rounded-full bg-[#EC5757] text-white font-bold hover:bg-[#FF9797] transition-colors text-sm">
              Delete
            </button>
            {inv.status !== 'paid' && (
              <button onClick={() => markPaid(inv.id)}
                className="px-6 py-3 rounded-full bg-[#7C5DFA] text-white font-bold hover:bg-[#9277FF] transition-colors text-sm">
                Mark as Paid
              </button>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E2139] rounded-lg px-8 py-10"
          style={{ boxShadow: '0px 10px 10px -10px #48549F1A' }}>

          <div className="flex justify-between mb-8">
            <div>
              <p className={valueCls}><span className="text-[#7E88C3]">#</span>{inv.id}</p>
              <p className="text-[#7E88C3] text-sm mt-1">{inv.description}</p>
            </div>
            <div className="text-right text-[#7E88C3] text-sm leading-relaxed">
              <p>{inv.senderAddress.street}</p>
              <p>{inv.senderAddress.city}</p>
              <p>{inv.senderAddress.postCode}</p>
              <p>{inv.senderAddress.country}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            <div className="space-y-8">
              <div>
                <p className={labelCls}>Invoice Date</p>
                <p className={valueCls}>{formatDate(inv.createdAt)}</p>
              </div>
              <div>
                <p className={labelCls}>Payment Due</p>
                <p className={valueCls}>{formatDate(inv.paymentDue)}</p>
              </div>
            </div>
            <div>
              <p className={labelCls}>Bill To</p>
              <p className={`${valueCls} mb-2`}>{inv.clientName}</p>
              <div className="text-[#7E88C3] text-sm leading-relaxed">
                <p>{inv.clientAddress.street}</p>
                <p>{inv.clientAddress.city}</p>
                <p>{inv.clientAddress.postCode}</p>
                <p>{inv.clientAddress.country}</p>
              </div>
            </div>
            <div>
              <p className={labelCls}>Sent to</p>
              <p className={valueCls}>{inv.clientEmail}</p>
            </div>
          </div>

          <div className="bg-[#F9FAFE] dark:bg-[#252945] rounded-lg overflow-hidden">
            <div className="hidden lg:grid grid-cols-[1fr_80px_120px_120px] px-8 py-4 text-[#7E88C3] text-sm">
              <span>Item Name</span>
              <span className="text-center">QTY.</span>
              <span className="text-right">Price</span>
              <span className="text-right">Total</span>
            </div>

            <div className="px-8 py-4 space-y-4">
              {inv.items.map(item => (
                <div key={item.id} className="grid grid-cols-2 lg:grid-cols-[1fr_80px_120px_120px] items-center">
                  <p className="font-bold text-[#0C0E16] dark:text-white text-sm">{item.name}</p>
                  <p className="font-bold text-[#0C0E16] dark:text-white text-sm text-right lg:hidden">
                    {formatAmount(item.quantity * item.price)}
                  </p>
                  <p className="hidden lg:block text-[#7E88C3] text-sm text-center">{item.quantity}</p>
                  <p className="hidden lg:block text-[#7E88C3] text-sm text-right">{formatAmount(item.price)}</p>
                  <p className="hidden lg:block font-bold text-[#0C0E16] dark:text-white text-sm text-right">
                    {formatAmount(item.quantity * item.price)}
                  </p>
                  <p className="lg:hidden text-[#7E88C3] text-sm mt-1">
                    {item.quantity} x {formatAmount(item.price)}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-[#373B53] dark:bg-[#0C0E16] rounded-b-lg px-8 py-6 flex items-center justify-between">
              <span className="text-white text-sm">Amount Due</span>
              <span className="text-white font-bold text-2xl">{formatAmount(inv.total)}</span>
            </div>
          </div>
        </div>

        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1E2139] px-6 py-5 flex items-center justify-end gap-3">
          {inv.status !== 'paid' && (
            <button onClick={() => onEdit(inv.id)}
              className="px-6 py-3 rounded-full bg-[#F9FAFE] dark:bg-[#252945] text-[#7E88C3] font-bold hover:bg-[#DFE3FA] transition-colors text-sm">
              Edit
            </button>
          )}
          <button onClick={() => setShowDelete(true)}
            className="px-6 py-3 rounded-full bg-[#EC5757] text-white font-bold hover:bg-[#FF9797] transition-colors text-sm">
            Delete
          </button>
          {inv.status !== 'paid' && (
            <button onClick={() => markPaid(inv.id)}
              className="px-6 py-3 rounded-full bg-[#7C5DFA] text-white font-bold hover:bg-[#9277FF] transition-colors text-sm">
              Mark as Paid
            </button>
          )}
        </div>
      </div>

      {showDelete && (
        <DeleteModal
          invoiceId={inv.id}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </div>
  );
}
