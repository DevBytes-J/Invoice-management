import { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { InvoiceProvider, useInvoices } from "./context/InvoiceContext";
import Sidebar from "./components/Sidebar";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceList from "./pages/InvoiceList";
import InvoiceDetail from "./pages/InvoiceDetail";
import SplashScreen from "./components/SplashScreen";
import type { Invoice } from "./types";

type View = { page: "list" } | { page: "detail"; id: string };

function AppShell() {
  const [view, setView] = useState<View>({ page: "list" });
  const [showForm, setShowForm] = useState(false);
  const [editInvoice, setEditInvoice] = useState<Invoice | undefined>();
  const { add, update, invoices } = useInvoices();

  function handleSave(inv: Invoice) {
    editInvoice ? update(inv) : add(inv);
    setShowForm(false);
    setEditInvoice(undefined);
  }

  function openEdit(id: string) {
    setEditInvoice(invoices.find((i) => i.id === id));
    setShowForm(true);
  }

  return (
    <div className="min-h-screen bg-[#F8F8FB] dark:bg-[#141625] flex flex-col lg:flex-row">
      <Sidebar />
      <main className="flex-1 mt-[72px] lg:mt-0 lg:ml-[103px]">
        {view.page === "list" && (
          <InvoiceList
            onNewInvoice={() => {
              setEditInvoice(undefined);
              setShowForm(true);
            }}
            onSelect={(id) => setView({ page: "detail", id })}
          />
        )}
        {view.page === "detail" && (
          <InvoiceDetail
            id={view.id}
            onBack={() => setView({ page: "list" })}
            onEdit={openEdit}
          />
        )}
      </main>

      {showForm && (
        <InvoiceForm
          initial={editInvoice}
          onSave={handleSave}
          onSaveDraft={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditInvoice(undefined);
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [visible, setVisible] = useState(false);

  function handleSplashComplete() {
    setShowSplash(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }

  return (
    <ThemeProvider>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      {!showSplash && (
        <div
          className="transition-opacity duration-700"
          style={{ opacity: visible ? 1 : 0 }}
        >
          <InvoiceProvider>
            <AppShell />
          </InvoiceProvider>
        </div>
      )}
    </ThemeProvider>
  );
}
