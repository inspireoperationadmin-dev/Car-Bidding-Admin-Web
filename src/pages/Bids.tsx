import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Gavel,
  Car,
  User,
  Clock,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Coins,
  Sparkles,
} from "lucide-react";

import type { AppDispatch, RootState } from "../store";
import {
  fetchRequestsWithBids,
  selectRequestsWithBids,
  selectIsBidLoading,
} from "../store/slices/bidSlice";
import type { RequestWithBidsDto } from "../store/slices/bidSlice";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

/* ---------- Status Pill Helper ---------- */
const getStatusBadge = (status: string) => {
  switch (status) {
    case "BIDDING":
      return <Badge variant="info">Live Bidding</Badge>;
    case "APPROVED":
      return <Badge variant="success">Approved</Badge>;
    case "BIDS_VIEWABLE":
      return <Badge variant="warning">Bids Viewable</Badge>;
    case "MECHANIC_SELECTED":
      return <Badge variant="default">Mechanic Selected</Badge>;
    case "COMPLETED":
      return <Badge variant="success">Completed</Badge>;
    case "PENDING":
      return <Badge variant="outline">Pending</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getBidBadge = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return <Badge variant="info">Active</Badge>;
    case "SELECTED":
      return <Badge variant="success">Won / Selected</Badge>;
    case "WITHDRAWN":
      return <Badge variant="warning">Withdrawn</Badge>;
    case "REJECTED":
      return <Badge variant="destructive">Declined</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

/* ========== Expandable Request Row ========== */
function RequestRow({ row }: { row: RequestWithBidsDto }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr
        onClick={() => setOpen(!open)}
        className="cursor-pointer hover:bg-muted/40 transition-colors border-b border-border/60"
      >
        <td className="w-12 px-4 py-4 text-center">
          <button
            type="button"
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {open ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </td>
        <td className="px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
              <Car className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-foreground">
                {row.carBrand} {row.carModel}
              </p>
              <p className="text-xs text-muted-foreground">Model Year: {row.carYear}</p>
            </div>
          </div>
        </td>
        <td className="px-5 py-4 text-xs font-medium text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-primary" />
            <span>{row.customerName}</span>
          </div>
        </td>
        <td className="px-5 py-4">{getStatusBadge(row.status)}</td>
        <td className="px-5 py-4 text-center">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
              row.bidCount > 0
                ? "bg-primary/15 text-primary border border-primary/20"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {row.bidCount} {row.bidCount === 1 ? "bid" : "bids"}
          </span>
        </td>
        <td className="px-5 py-4 text-xs text-muted-foreground">
          {new Date(row.createdAt).toLocaleDateString()}
        </td>
      </tr>

      {/* Sub-table with Mechanic Bids */}
      {open && (
        <tr className="bg-muted/20">
          <td colSpan={6} className="p-4 pl-14">
            <div className="rounded-xl border border-border/70 bg-card p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <Gavel className="h-3.5 w-3.5 text-primary" />
                  <span>Submitted Mechanic Bids ({row.bids.length})</span>
                </h4>
                <span className="text-[11px] font-semibold text-muted-foreground">
                  20% Escrow deposit triggers on selection
                </span>
              </div>

              {row.bids.length === 0 ? (
                <p className="py-4 text-center text-xs text-muted-foreground">
                  No mechanics have submitted bids on this request yet.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-border/60">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/50 font-semibold uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="px-4 py-2.5">Mechanic</th>
                        <th className="px-4 py-2.5">Bid Total</th>
                        <th className="px-4 py-2.5">20% Deposit</th>
                        <th className="px-4 py-2.5">Duration</th>
                        <th className="px-4 py-2.5">Mechanic Notes</th>
                        <th className="px-4 py-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {row.bids.map((bid) => (
                        <tr key={bid.id} className="hover:bg-muted/30">
                          <td className="px-4 py-3 font-semibold text-foreground">
                            <div>
                              <p>{bid.mechanicName}</p>
                              <p className="text-[10px] text-muted-foreground">{bid.mechanicEmail}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-bold text-foreground">
                            €{bid.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-3 font-semibold text-primary">
                            €{(bid.price * 0.2).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>
                                {bid.estimatedDurationDays}d {bid.estimatedDurationHours}h
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">
                            {bid.notes || "No notes provided"}
                          </td>
                          <td className="px-4 py-3">
                            {getBidBadge(bid.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function Bids() {
  const dispatch = useDispatch<AppDispatch>();
  const requests = useSelector(selectRequestsWithBids);
  const loading = useSelector(selectIsBidLoading);
  const { error } = useSelector((state: RootState) => state.bids);

  useEffect(() => {
    dispatch(fetchRequestsWithBids());
  }, [dispatch]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="default" className="text-xs font-bold uppercase tracking-wider">
              Live Auction Engine
            </Badge>
            <span className="text-xs font-medium text-muted-foreground">
              Marketplace Telemetry
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Live Auctions & Bidding
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track competitive repair estimates, mechanic offers, and 20% milestone deposit rates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="gap-2 font-semibold"
          >
            <Download className="h-4 w-4" />
            <span>Export Bids</span>
          </Button>
          <Button
            variant="default"
            onClick={() => dispatch(fetchRequestsWithBids())}
            disabled={loading}
            className="gap-2 font-semibold"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>Sync Auctions</span>
          </Button>
        </div>
      </div>

      {/* ================= ERROR DISPLAY ================= */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {/* ================= AUCTIONS TABLE ================= */}
      <div className="rounded-2xl border border-border/70 bg-card/80 p-6 backdrop-blur-md shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-foreground">
              Active Auction Requests
            </h3>
            <Badge variant="outline" className="text-xs font-bold">
              {requests.length} Requests
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">
            Click any row to reveal submitted mechanic bids
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/60">
              <tr>
                <th className="w-12 px-4 py-3.5"></th>
                <th className="px-5 py-3.5">Vehicle Spec</th>
                <th className="px-5 py-3.5">Vehicle Owner</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-center">Bids Received</th>
                <th className="px-5 py-3.5">Date Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <RefreshCw className="mx-auto h-6 w-6 animate-spin text-primary mb-2" />
                    <span>Loading active auctions...</span>
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <Sparkles className="mx-auto h-8 w-8 text-primary mb-2" />
                    <p className="font-semibold text-foreground">No active auctions</p>
                    <p className="text-xs">Incoming repair requests will appear here once approved for bidding.</p>
                  </td>
                </tr>
              ) : (
                requests.map((row) => <RequestRow key={row.id} row={row} />)
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
