import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CreditCard,
  Search,
  Receipt,
  BarChart2,
  PieChart,
  Layers,
} from "lucide-react";
import type { AppDispatch, RootState } from "../store";
import {
  fetchPayments,
  fetchPaymentById,
  clearSelectedPayment,
} from "../store/slices/paymentSlice";

// Components
import { PaymentTable } from "../components/Payments/PaymentTable";
import PaymentDetailModal from "../components/Payments/PaymentDetailModal";
import { PaymentAnalytics } from "../components/Payments/PaymentAnalytics";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Input } from "../components/ui/input";

export const Payments = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { payments, isLoading, selectedPayment } = useSelector(
    (state: RootState) => state.payments
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("transactions");

  useEffect(() => {
    if (activeTab === "transactions") {
      dispatch(fetchPayments({ search: searchTerm }));
    }
  }, [dispatch, searchTerm, activeTab]);

  const handleViewDetail = (id: number) => {
    dispatch(fetchPaymentById(id));
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    dispatch(clearSelectedPayment());
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="default" className="text-xs font-bold uppercase tracking-wider">
              Disbursement Ledger
            </Badge>
            <span className="text-xs font-medium text-muted-foreground">
              20% Deposit / 80% Final Milestone
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Payment Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor escrow balances, verify Stripe transactions, and analyze mechanic payouts.
          </p>
        </div>

        {/* 20/80 Split Quick Indicator Pill */}
        <div className="flex items-center gap-2 rounded-2xl border border-border/80 bg-card/80 p-2.5 px-4 backdrop-blur-md shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Payment Model
            </p>
            <p className="text-xs font-extrabold text-foreground">
              20% Selection • 80% Completion
            </p>
          </div>
        </div>
      </div>

      {/* ================= MAIN TABS ================= */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full space-y-6"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="transactions" className="gap-2">
            <Receipt className="h-4 w-4" />
            <span>Transactions List</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart2 className="h-4 w-4" />
            <span>Analytics Dashboard</span>
          </TabsTrigger>
        </TabsList>

        {/* --- TRANSACTIONS VIEW --- */}
        <TabsContent value="transactions" className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transaction ID, customer, mechanic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 bg-card/60"
              />
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Layers className="h-4 w-4 text-primary" />
              <span>{payments.length} Recorded Transactions</span>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/80 backdrop-blur-md shadow-sm">
            <PaymentTable
              payments={payments}
              loading={isLoading}
              onView={handleViewDetail}
            />
          </div>
        </TabsContent>

        {/* --- ANALYTICS VIEW --- */}
        <TabsContent value="analytics">
          <div className="rounded-2xl border border-border/70 bg-card/80 p-6 backdrop-blur-md shadow-sm">
            <PaymentAnalytics />
          </div>
        </TabsContent>
      </Tabs>

      {/* ================= DETAIL MODAL ================= */}
      <PaymentDetailModal
        open={modalOpen}
        onClose={handleCloseModal}
        payment={selectedPayment}
        loading={isLoading}
      />
    </div>
  );
};

export default Payments;
