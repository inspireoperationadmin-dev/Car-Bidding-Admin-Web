import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Download, AlertCircle, RefreshCw, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";

// Store & Slices
import type { AppDispatch, RootState } from "../store";
import { fetchRequests, reviewRequest } from "../store/slices/requestSlice";

// Sub-components
import { RequestTable } from "@/components/requests/RequestTable";
import { RequestFilters } from "@/components/requests/RequestFilters";
import type { RequestFilterState } from "@/components/requests/RequestFilters";
import { RequestDetailModal } from "@/components/requests/RequestDetailModal";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

export const RequestPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  // --- REDUX STATE ---
  const { requests, isLoading: loading, error } = useSelector(
    (state: RootState) => state.requests
  );

  // --- LOCAL UI STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [activeFilters, setActiveFilters] = useState<RequestFilterState>({
    status: "ALL",
    search: "",
    dateFrom: null,
    dateTo: null,
  });

  // --- API CALLS ---
  useEffect(() => {
    dispatch(fetchRequests(activeFilters));
  }, [dispatch, activeFilters]);

  // --- HANDLERS ---
  const handleOpenModal = (id: number) => {
    const request = requests.find((r) => r.id === id);
    if (request) {
      setSelectedRequest(request);
      setIsModalOpen(true);
    }
  };

  const handleReviewSubmit = async (id: number, reviewData: any) => {
    try {
      await dispatch(reviewRequest({ id, ...reviewData })).unwrap();
      setIsModalOpen(false);
      dispatch(fetchRequests(activeFilters));
    } catch (err) {
      console.error("Failed to submit review:", err);
    }
  };

  const underReviewCount = requests.filter((r) => r.isUnderAdminReview).length;

  const filteredRequests = requests.filter((r) => {
    if (activeFilters.status === "UNDER_REVIEW") {
      return r.isUnderAdminReview;
    }
    return true;
  });

  // Pagination slice
  const paginatedRequests = filteredRequests.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const totalPages = Math.ceil(filteredRequests.length / rowsPerPage) || 1;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ================= HEADER SECTION ================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="default" className="text-xs font-bold uppercase tracking-wider">
              Repair Orders
            </Badge>
            <span className="text-xs font-medium text-muted-foreground">
              {requests.length} Total Requests
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Service Requests
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review customer repair submissions, verify damages, and approve for live bidding.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="gap-2 font-semibold"
            onClick={() => window.print()}
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button
            variant="default"
            className="gap-2 font-semibold"
            onClick={() => dispatch(fetchRequests(activeFilters))}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>Sync</span>
          </Button>
        </div>
      </div>

      {/* ================= LOW BIDS ATTENTION BANNER ================= */}
      {underReviewCount > 0 && activeFilters.status !== "UNDER_REVIEW" && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
            <div>
              <p className="font-bold text-sm">
                {underReviewCount} Request{underReviewCount > 1 ? "s" : ""} Require Admin Resolution
              </p>
              <p className="text-xs text-muted-foreground">
                These requests closed with fewer than 3 bids. Review them to approve existing bids, extend bidding time, or expand shop radius.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-amber-500/40 hover:bg-amber-500/20 text-xs font-semibold shrink-0"
            onClick={() => setActiveFilters((prev) => ({ ...prev, status: "UNDER_REVIEW" }))}
          >
            Filter Under Review ({underReviewCount})
          </Button>
        </div>
      )}

      {/* ================= FILTER SECTION ================= */}
      <RequestFilters
        onFilterChange={(newFilters) => {
          setActiveFilters(newFilters);
          setPage(0);
        }}
      />

      {/* ================= ERROR HANDLING ================= */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {/* ================= TABLE CONTAINER ================= */}
      <div className="relative">
        <RequestTable
          requests={paginatedRequests}
          onView={handleOpenModal}
          onReview={handleOpenModal}
        />
      </div>

      {/* ================= MODERN PAGINATION ================= */}
      <div className="flex items-center justify-between border-t border-border/60 pt-4 text-sm text-muted-foreground">
        <div>
          Showing{" "}
          <span className="font-bold text-foreground">
            {filteredRequests.length > 0 ? page * rowsPerPage + 1 : 0}
          </span>{" "}
          to{" "}
          <span className="font-bold text-foreground">
            {Math.min((page + 1) * rowsPerPage, filteredRequests.length)}
          </span>{" "}
          of <span className="font-bold text-foreground">{filteredRequests.length}</span> requests
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="gap-1 font-semibold"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>
          <span className="text-xs font-semibold px-2">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="gap-1 font-semibold"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ================= DETAIL & REVIEW MODAL ================= */}
      <RequestDetailModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        request={selectedRequest}
        onReviewSubmit={handleReviewSubmit}
      />
    </div>
  );
};

export default RequestPage;
