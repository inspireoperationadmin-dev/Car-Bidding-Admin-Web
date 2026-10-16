import { useState, useEffect, useCallback } from "react";
import {
  ShieldCheck,
  Building,
  FileText,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Eye,
  AlertCircle,
  Phone,
  Calendar,
  Layers,
  Star,
  Sparkles,
  MapPin,
} from "lucide-react";
import apiClient from "@/api/client";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";

interface PendingMechanic {
  id: number;
  businessName: string | null;
  licenseNumber: string | null;
  businessAddress: string | null;
  contactNumber: string | null;
  verificationStatus: string;
  businessLicenseUrl: string | null;
  insuranceCertUrl: string | null;
  govtIdUrl: string | null;
  submittedAt: string | null;
  email?: string;
  googleRating?: number | null;
  googleReviewCount?: number | null;
  googleReviews?: Array<{
    author: string;
    rating: number;
    text: string;
    relativeTime: string;
    profilePhotoUrl?: string;
  }> | null;
  googlePlaceUrl?: string | null;
}

export const MechanicVerification = () => {
  const [mechanics, setMechanics] = useState<PendingMechanic[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedMech, setSelectedMech] = useState<PendingMechanic | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLabel, setPreviewLabel] = useState("");
  const [syncingReviews, setSyncingReviews] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleSyncGoogleReviews = async (mechanicId: number) => {
    setSyncingReviews(true);
    try {
      const res = await apiClient.post(`/mechanics/${mechanicId}/sync-google-reviews`);
      if (res.data.success) {
        const updated = res.data.data;
        setSelectedMech((prev) =>
          prev
            ? {
                ...prev,
                googleRating: updated.rating,
                googleReviewCount: updated.reviewCount,
                googleReviews: updated.reviews,
                googlePlaceUrl: updated.googleMapsUri,
              }
            : null
        );
        // Also update in list
        setMechanics((prev) =>
          prev.map((m) =>
            m.id === mechanicId
              ? {
                  ...m,
                  googleRating: updated.rating,
                  googleReviewCount: updated.reviewCount,
                  googleReviews: updated.reviews,
                  googlePlaceUrl: updated.googleMapsUri,
                }
              : m
          )
        );
        setNotification({
          message: `Successfully synced Google Reviews for ${updated.businessName}!`,
          type: "success",
        });
      }
    } catch (err: any) {
      setNotification({
        message: err.response?.data?.message || "Failed to sync Google Reviews",
        type: "error",
      });
    } finally {
      setSyncingReviews(false);
    }
  };

  const fetchPendingList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/mechanics/pending");
      setMechanics(res.data.data ?? []);
    } catch (err) {
      console.error(err);
      setNotification({
        message: "Failed to load pending mechanics list",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingList();
  }, [fetchPendingList]);

  const handleReview = (mechanic: PendingMechanic) => {
    setSelectedMech(mechanic);
    setRejectReason("");
    setPreviewUrl(null);
    setOpenModal(true);
  };

  const handleDecision = async (status: "APPROVED" | "REJECTED") => {
    if (!selectedMech) return;
    if (status === "REJECTED" && !rejectReason.trim()) {
      setNotification({
        message: "Please provide a rejection reason for the mechanic",
        type: "error",
      });
      return;
    }

    setActionLoading(true);
    try {
      await apiClient.post(`/mechanics/${selectedMech.id}/verify`, {
        status,
        reason: status === "REJECTED" ? rejectReason : undefined,
      });

      setNotification({
        message: `Mechanic ${selectedMech.businessName ?? selectedMech.id} ${
          status === "APPROVED" ? "approved successfully" : "rejected"
        }`,
        type: "success",
      });
      setOpenModal(false);
      fetchPendingList();
    } catch (err: any) {
      setNotification({
        message: err.response?.data?.message || "Verification update failed",
        type: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="warning" className="text-xs font-bold uppercase tracking-wider">
              Compliance & KYC
            </Badge>
            <span className="text-xs font-medium text-muted-foreground">
              Mechanic Vetting
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Mechanic Verification
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review business credentials, insurance certificates, and government IDs before mechanics can bid on repair jobs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={fetchPendingList}
            disabled={loading}
            className="gap-2 font-semibold"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Pending</span>
          </Button>
        </div>
      </div>

      {/* ================= NOTIFICATION TOAST ================= */}
      {notification && (
        <div
          className={`flex items-center justify-between rounded-2xl border p-4 text-sm font-medium ${
            notification.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "border-destructive/30 bg-destructive/10 text-destructive"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notification.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs opacity-70 hover:opacity-100 uppercase tracking-wider font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ================= PENDING TABLE CARD ================= */}
      <div className="rounded-2xl border border-border/70 bg-card/80 p-6 backdrop-blur-md shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-foreground">
              Pending Verification Requests
            </h3>
            <Badge variant="default" className="text-xs font-bold">
              {mechanics.length} Pending
            </Badge>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/60">
              <tr>
                <th className="px-5 py-3.5">Workshop / Business</th>
                <th className="px-5 py-3.5">License No</th>
                <th className="px-5 py-3.5">Contact</th>
                <th className="px-5 py-3.5">Submitted</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <RefreshCw className="mx-auto h-6 w-6 animate-spin text-primary mb-2" />
                    <span>Loading pending applicants...</span>
                  </td>
                </tr>
              ) : mechanics.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
                    <p className="font-semibold text-foreground">All Clear!</p>
                    <p className="text-xs">No pending mechanic verification requests at this time.</p>
                  </td>
                </tr>
              ) : (
                mechanics.map((mech) => (
                  <tr key={mech.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-5 py-4 font-semibold text-foreground">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                          <Building className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground leading-tight">
                            {mech.businessName || "Unnamed Workshop"}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {mech.businessAddress || "No address specified"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs font-medium text-muted-foreground">
                      {mech.licenseNumber || "N/A"}
                    </td>
                    <td className="px-5 py-4 text-xs font-medium text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-primary" />
                        <span>{mech.contactNumber || "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">
                      {mech.submittedAt
                        ? new Date(mech.submittedAt).toLocaleDateString()
                        : "Recent"}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant="warning" className="text-xs">
                        {mech.verificationStatus || "PENDING"}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleReview(mech)}
                        className="gap-1.5 font-semibold text-xs"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Review Dossier</span>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= REVIEW DOSSIER DIALOG ================= */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <DialogTitle className="text-xl font-bold">
                Mechanic Verification Dossier
              </DialogTitle>
            </div>
            <DialogDescription>
              Carefully inspect the business credentials and submitted certificates below before rendering a verification decision.
            </DialogDescription>
          </DialogHeader>

          {selectedMech && (
            <div className="space-y-6 py-2">
              {/* Business Overview Card */}
              <div className="rounded-xl border border-border/70 bg-muted/30 p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-bold text-muted-foreground uppercase tracking-wider block text-[10px]">
                      Business Name
                    </span>
                    <span className="font-bold text-foreground text-sm">
                      {selectedMech.businessName || "Unnamed Workshop"}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-muted-foreground uppercase tracking-wider block text-[10px]">
                      License Registration
                    </span>
                    <span className="font-mono font-bold text-foreground text-sm">
                      {selectedMech.licenseNumber || "N/A"}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="font-bold text-muted-foreground uppercase tracking-wider block text-[10px]">
                      Workshop Address
                    </span>
                    <span className="font-medium text-foreground">
                      {selectedMech.businessAddress || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-muted-foreground uppercase tracking-wider block text-[10px]">
                      Contact Number
                    </span>
                    <span className="font-medium text-foreground">
                      {selectedMech.contactNumber || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-muted-foreground uppercase tracking-wider block text-[10px]">
                      Submission Date
                    </span>
                    <span className="font-medium text-foreground">
                      {selectedMech.submittedAt
                        ? new Date(selectedMech.submittedAt).toLocaleString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Google Reviews & Digital Reputation Card */}
              <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <Star className="h-4 w-4 fill-amber-500" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Google Business Reviews & Reputation
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        Direct public feedback for this registered workshop
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedMech.googlePlaceUrl && (
                      <a
                        href={selectedMech.googlePlaceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                      >
                        <span>Maps Link</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSyncGoogleReviews(selectedMech.id)}
                      disabled={syncingReviews}
                      className="gap-1.5 text-xs font-semibold h-8"
                    >
                      <RefreshCw className={`h-3 w-3 ${syncingReviews ? "animate-spin" : ""}`} />
                      <span>{selectedMech.googleRating ? "Refresh Reviews" : "Fetch Google Reviews"}</span>
                    </Button>
                  </div>
                </div>

                {selectedMech.googleRating ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border/50">
                      <div className="flex items-center gap-1 font-extrabold text-lg text-foreground">
                        <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                        <span>{Number(selectedMech.googleRating).toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground font-normal">/ 5.0</span>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">
                        ({selectedMech.googleReviewCount ?? 0} verified Google reviews)
                      </span>
                    </div>

                    {/* Customer Review Quotes */}
                    {selectedMech.googleReviews && selectedMech.googleReviews.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                          Recent Verified Reviews
                        </span>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {selectedMech.googleReviews.map((rev, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-lg border border-border/60 bg-muted/20 text-xs space-y-1"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-foreground">{rev.author}</span>
                                <div className="flex items-center gap-1 text-[11px] text-amber-500 font-medium">
                                  <span>{"★".repeat(rev.rating)}</span>
                                  <span className="text-muted-foreground text-[10px] ml-1">{rev.relativeTime}</span>
                                </div>
                              </div>
                              <p className="text-muted-foreground italic text-[11px]">"{rev.text}"</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3 rounded-lg border border-dashed text-center text-xs text-muted-foreground bg-muted/20">
                    No Google reviews synced yet. Click <strong>Fetch Google Reviews</strong> to verify digital reputation against Google Places.
                  </div>
                )}
              </div>

              {/* Uploaded Documents Gallery */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Submitted Verification Documents
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      label: "Business License",
                      url: selectedMech.businessLicenseUrl,
                    },
                    {
                      label: "Insurance Certificate",
                      url: selectedMech.insuranceCertUrl,
                    },
                    {
                      label: "Government ID",
                      url: selectedMech.govtIdUrl,
                    },
                  ].map((doc) => (
                    <div
                      key={doc.label}
                      className="flex flex-col items-center justify-between rounded-xl border border-border/80 bg-card p-3 text-center transition-all hover:border-primary/50"
                    >
                      <FileText className="h-8 w-8 text-primary/70 mb-1" />
                      <span className="text-xs font-semibold text-foreground mb-2 line-clamp-1">
                        {doc.label}
                      </span>
                      {doc.url ? (
                        <div className="flex gap-1.5 w-full">
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full text-[11px] h-7 px-2"
                            onClick={() => {
                              setPreviewUrl(doc.url);
                              setPreviewLabel(doc.label);
                            }}
                          >
                            Preview
                          </Button>
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border/80 text-muted-foreground hover:bg-muted"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      ) : (
                        <Badge variant="destructive" className="text-[10px]">
                          Missing
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Document Preview Pane */}
              {previewUrl && (
                <div className="overflow-hidden rounded-xl border border-border/80 bg-card">
                  <div className="flex items-center justify-between bg-muted/50 px-4 py-2 text-xs font-semibold border-b border-border/60">
                    <span>Preview: {previewLabel}</span>
                    <button
                      onClick={() => setPreviewUrl(null)}
                      className="text-xs text-muted-foreground hover:text-foreground font-bold"
                    >
                      Close Preview
                    </button>
                  </div>
                  <div className="p-2 flex justify-center bg-black/5 dark:bg-black/20">
                    {previewUrl.toLowerCase().includes(".pdf") ? (
                      <iframe
                        src={previewUrl}
                        title={previewLabel}
                        className="w-full h-80 rounded-lg border border-border/60 bg-white"
                      />
                    ) : (
                      <img
                        src={previewUrl}
                        alt={previewLabel}
                        className="max-h-72 object-contain rounded-lg shadow-sm"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Rejection Note Textarea */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Rejection Reason (Required only if declining applicant)
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Explain why the application is being rejected (e.g., expired insurance, blurry document)..."
                  className="w-full rounded-xl border border-input bg-background p-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="destructive"
              disabled={actionLoading}
              onClick={() => handleDecision("REJECTED")}
              className="gap-1.5 font-bold"
            >
              <XCircle className="h-4 w-4" />
              <span>Reject Application</span>
            </Button>
            <Button
              variant="default"
              disabled={actionLoading}
              onClick={() => handleDecision("APPROVED")}
              className="gap-1.5 font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Approve & Activate Mechanic</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MechanicVerification;
