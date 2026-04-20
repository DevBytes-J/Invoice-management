import { useEffect, useRef } from 'react';

interface Props {
  invoiceId: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteModal({ invoiceId, onConfirm, onCancel }: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const deleteRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { onCancel(); return; }
      if (e.key !== 'Tab') return;
      const els = [cancelRef.current!, deleteRef.current!];
      const first = els[0], last = els[els.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
      <div className="bg-white dark:bg-[#1E2139] rounded-lg p-12 max-w-md w-full">
        <h2 id="modal-title" className="text-2xl font-bold text-[#0C0E16] dark:text-white mb-3">
          Confirm Deletion
        </h2>
        <p className="text-[#888EB0] text-sm mb-8 leading-relaxed">
          Are you sure you want to delete invoice <strong className="text-[#0C0E16] dark:text-white">#{invoiceId}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button ref={cancelRef} onClick={onCancel}
            className="px-6 py-3 rounded-full bg-[#F9FAFE] dark:bg-[#252945] text-[#7E88C3] dark:text-[#DFE3FA] font-bold hover:bg-[#DFE3FA] transition-colors text-sm">
            Cancel
          </button>
          <button ref={deleteRef} onClick={onConfirm}
            className="px-6 py-3 rounded-full bg-[#EC5757] text-white font-bold hover:bg-[#FF9797] transition-colors text-sm">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
