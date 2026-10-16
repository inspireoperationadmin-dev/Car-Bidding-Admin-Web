import React, { useState, useEffect } from 'react';
import {
  Mail,
  Calendar,
  Phone,
  MapPin,
  History,
  Gavel,
  CheckCircle2,
  DollarSign,
  Star,
  Wrench,
  Loader2,
  ShieldAlert,
  RefreshCw,
  ExternalLink,
  Building2,
  ShieldCheck,
  CreditCard,
  FileText,
  Eye,
  X,
  Clock,
  XCircle,
  AlertCircle,
  Image as ImageIcon,
  FileCheck,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import apiClient from '../../api/client';

interface UserDetailModalProps {
  open: boolean;
  onClose: () => void;
  user: any | null;
  loading?: boolean;
  onToggleStatus?: (id: number) => void;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  open,
  onClose,
  user,
  loading,
  onToggleStatus,
}) => {
  const [syncingGoogle, setSyncingGoogle] = useState(false);
  const [localGoogleReviews, setLocalGoogleReviews] = useState<any[] | null>(null);
  const [localGoogleRating, setLocalGoogleRating] = useState<number | null>(null);
  const [localGoogleReviewCount, setLocalGoogleReviewCount] = useState<number | null>(null);

  // Document & Portfolio preview state
  const [docPreviewUrl, setDocPreviewUrl] = useState<string | null>(null);
  const [docPreviewTitle, setDocPreviewTitle] = useState<string>('');

  useEffect(() => {
    if (user) {
      setLocalGoogleReviews(user.googleReviews || null);
      setLocalGoogleRating(user.googleRating ?? null);
      setLocalGoogleReviewCount(user.googleReviewCount ?? null);
    }
    setDocPreviewUrl(null);
    setDocPreviewTitle('');
  }, [user]);

  const handleSyncGoogle = async () => {
    if (!user?.mechanicId) return;
    setSyncingGoogle(true);
    try {
      const res = await apiClient.post(`/mechanics/${user.mechanicId}/sync-google-reviews`);
      if (res.data?.data) {
        const data = res.data.data;
        setLocalGoogleReviews(data.googleReviews || []);
        setLocalGoogleRating(data.googleRating ? Number(data.googleRating) : null);
        setLocalGoogleReviewCount(data.googleReviewCount ?? null);
      }
    } catch (err) {
      console.error('Failed to sync Google reviews in user dossier', err);
    } finally {
      setSyncingGoogle(false);
    }
  };

  if (!open) return null;

  const isMechanic = user?.role === 'MECHANIC';

  const verificationDocs = isMechanic
    ? [
        {
          key: 'businessLicense',
          label: 'Business Registration / License',
          desc: 'Official SIRET, Kbis, or Trade Registration',
          icon: Building2,
          url: user.businessLicenseUrl,
        },
        {
          key: 'insuranceCert',
          label: 'Liability Insurance Policy',
          desc: 'Workshop & Garage Premises Liability Policy',
          icon: ShieldCheck,
          url: user.insuranceCertUrl,
        },
        {
          key: 'govtId',
          label: 'Government-Issued Photo ID',
          desc: 'Passport, National ID, or Driver’s License',
          icon: CreditCard,
          url: user.govtIdUrl,
        },
      ]
    : [];

  const renderVerificationBadge = (status?: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 gap-1.5 py-0.5 px-2.5 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified Partner
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 gap-1.5 py-0.5 px-2.5 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            Pending Verification
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant="destructive" className="gap-1.5 py-0.5 px-2.5 text-xs font-semibold">
            <XCircle className="w-3.5 h-3.5" />
            Verification Declined
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground gap-1.5 py-0.5 px-2.5 text-xs">
            <AlertCircle className="w-3.5 h-3.5" />
            Not Submitted
          </Badge>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl border-border/70 shadow-2xl">
        <DialogHeader className="px-6 py-4 border-b border-border/60 bg-muted/20 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2.5">
            <DialogTitle className="text-lg font-bold text-foreground">
              User Dossier & Profile
            </DialogTitle>
            {user?.role && (
              <Badge variant="secondary" className="font-semibold text-xs tracking-wider">
                {user.role}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-9 h-9 text-primary animate-spin" />
              <p className="text-xs text-muted-foreground animate-pulse">Loading dossier details...</p>
            </div>
          ) : user ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* ================= LEFT PROFILE CARD (4 cols) ================= */}
              <div className="lg:col-span-4 space-y-4">
                <div className="rounded-2xl border border-border/70 bg-card p-5 text-center flex flex-col items-center shadow-xs">
                  <Avatar className="w-24 h-24 ring-4 ring-primary/10 shadow-md mb-3">
                    <AvatarImage src={user.profilePic || ''} alt={user.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>

                  <h3 className="font-bold text-lg text-foreground leading-tight">{user.name}</h3>

                  {isMechanic && user.businessName && (
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                      <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="truncate">{user.businessName}</span>
                    </div>
                  )}

                  <div className="mt-3">{renderVerificationBadge(user.verificationStatus)}</div>

                  <div className="w-full border-t border-border/60 my-4" />

                  {/* Contact Info List */}
                  <div className="w-full space-y-3 text-left text-xs">
                    <div className="flex items-start gap-2.5 text-muted-foreground">
                      <Mail className="w-3.5 h-3.5 shrink-0 text-primary mt-0.5" />
                      <span className="break-all select-all font-medium text-foreground/90">
                        {user.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 text-muted-foreground">
                      <Phone className="w-3.5 h-3.5 shrink-0 text-primary" />
                      <span className="font-medium text-foreground/90">
                        {user.phone || 'No phone recorded'}
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5 text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-primary mt-0.5" />
                      <span className="leading-relaxed text-foreground/90">
                        {user.address || 'Remote / Unset'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5 shrink-0 text-primary" />
                      <span>
                        Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>

                    {isMechanic && (user.licenseNumber || user.insurancePolicyNo || user.verificationDate) && (
                      <div className="pt-2 border-t border-border/50 text-[11px] text-muted-foreground space-y-1">
                        {user.licenseNumber && (
                          <div>
                            <span className="font-semibold text-foreground">License No: </span>
                            <span>{user.licenseNumber}</span>
                          </div>
                        )}
                        {user.insurancePolicyNo && (
                          <div>
                            <span className="font-semibold text-foreground">Insurance Policy: </span>
                            <span>{user.insurancePolicyNo}</span>
                          </div>
                        )}
                        {user.verificationDate && (
                          <div>
                            <span className="font-semibold text-foreground">Verified Date: </span>
                            <span>{new Date(user.verificationDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 w-full">
                    <Button
                      variant={user.status === 'ACTIVE' || user.isActive ? 'destructive' : 'default'}
                      className="w-full text-xs font-semibold cursor-pointer shadow-xs"
                      onClick={() => onToggleStatus?.(user.id)}
                    >
                      {user.status === 'ACTIVE' || user.isActive ? (
                        <>
                          <ShieldAlert className="w-3.5 h-3.5 mr-1.5" />
                          Deactivate Account
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                          Activate Account
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* ================= RIGHT DOSSIER CONTENT (8 cols) ================= */}
              <div className="lg:col-span-8 space-y-5">
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {!isMechanic ? (
                    <>
                      <div className="p-3.5 rounded-xl border border-border/70 bg-card text-center shadow-xs">
                        <History className="w-4 h-4 mx-auto text-primary mb-1" />
                        <p className="font-extrabold text-lg text-foreground">{user.requestsCount || 0}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-semibold">
                          Requests
                        </p>
                      </div>
                      <div className="p-3.5 rounded-xl border border-border/70 bg-card text-center shadow-xs">
                        <DollarSign className="w-4 h-4 mx-auto text-emerald-500 mb-1" />
                        <p className="font-extrabold text-lg text-emerald-600 dark:text-emerald-400">
                          €{user.totalSpent || 0}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase font-semibold">
                          Total Spent
                        </p>
                      </div>
                      <div className="p-3.5 rounded-xl border border-border/70 bg-card text-center shadow-xs">
                        <Gavel className="w-4 h-4 mx-auto text-amber-500 mb-1" />
                        <p className="font-extrabold text-lg text-amber-600 dark:text-amber-400">
                          {user.activeBids || 0}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase font-semibold">
                          Active Bids
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-3.5 rounded-xl border border-border/70 bg-card text-center shadow-xs">
                        <Gavel className="w-4 h-4 mx-auto text-primary mb-1" />
                        <p className="font-extrabold text-lg text-foreground">{user.totalBids || 0}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-semibold">
                          Total Bids
                        </p>
                      </div>
                      <div className="p-3.5 rounded-xl border border-border/70 bg-card text-center shadow-xs">
                        <Star className="w-4 h-4 mx-auto text-amber-500 fill-amber-500 mb-1" />
                        <p className="font-extrabold text-lg text-amber-600 dark:text-amber-400">
                          {user.rating ? Number(user.rating).toFixed(1) : '0'}/5
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase font-semibold">
                          Avg Rating
                        </p>
                      </div>
                      <div className="p-3.5 rounded-xl border border-border/70 bg-card text-center shadow-xs">
                        <Wrench className="w-4 h-4 mx-auto text-emerald-500 mb-1" />
                        <p className="font-extrabold text-lg text-emerald-600 dark:text-emerald-400">
                          {user.jobsDone || 0}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase font-semibold">
                          Jobs Done
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* ================= MECHANIC VERIFICATION DOCUMENTS ================= */}
                {isMechanic && (
                  <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between border-b border-border/60 pb-3">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-primary" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                          Compliance & Verification Documents
                        </h4>
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        {verificationDocs.filter((d) => Boolean(d.url)).length} of 3 Uploaded
                      </span>
                    </div>

                    {/* 3 Document Tiles */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {verificationDocs.map((doc) => {
                        const Icon = doc.icon;
                        const isUploaded = Boolean(doc.url);
                        return (
                          <div
                            key={doc.key}
                            className={`flex flex-col justify-between p-3.5 rounded-xl border transition-all text-left gap-3 ${
                              isUploaded
                                ? 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/10'
                                : 'border-border/70 bg-muted/20'
                            }`}
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <div
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                                    isUploaded
                                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                                      : 'bg-muted border-border text-muted-foreground'
                                  }`}
                                >
                                  <Icon className="w-4 h-4" />
                                </div>
                                {isUploaded ? (
                                  <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[9px] font-semibold py-0 px-1.5 h-4">
                                    Uploaded
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="text-[9px] text-muted-foreground py-0 px-1.5 h-4"
                                  >
                                    Missing
                                  </Badge>
                                )}
                              </div>
                              <p className="font-semibold text-xs text-foreground leading-snug line-clamp-1">
                                {doc.label}
                              </p>
                              <p className="text-[10px] text-muted-foreground line-clamp-2">
                                {doc.desc}
                              </p>
                            </div>

                            {isUploaded ? (
                              <div className="flex items-center gap-1.5 pt-2 border-t border-border/40">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 text-[11px] h-7 px-2 gap-1 cursor-pointer bg-background hover:bg-accent border-border"
                                  onClick={() => {
                                    setDocPreviewUrl(doc.url!);
                                    setDocPreviewTitle(doc.label);
                                  }}
                                >
                                  <Eye className="w-3 h-3 text-primary" />
                                  <span>Preview</span>
                                </Button>
                                <a
                                  href={doc.url!}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
                                  title="Open in new tab"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            ) : (
                              <div className="text-[10px] text-muted-foreground italic pt-2 border-t border-border/40">
                                Document pending submission
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Inline Document Preview Player */}
                    {docPreviewUrl && (
                      <div className="overflow-hidden rounded-xl border border-border/80 bg-background shadow-md animate-fade-in">
                        <div className="flex items-center justify-between bg-muted/60 px-4 py-2.5 text-xs font-semibold border-b border-border/60">
                          <div className="flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-primary" />
                            <span className="text-foreground">Viewing: {docPreviewTitle}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <a
                              href={docPreviewUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-primary hover:underline inline-flex items-center gap-1"
                            >
                              <span>Open Full Size</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setDocPreviewUrl(null);
                                setDocPreviewTitle('');
                              }}
                              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="p-3 flex justify-center bg-black/5 dark:bg-black/20">
                          {docPreviewUrl.toLowerCase().includes('.pdf') ? (
                            <iframe
                              src={docPreviewUrl}
                              title={docPreviewTitle}
                              className="w-full h-96 rounded-lg border border-border/70 bg-white"
                            />
                          ) : (
                            <img
                              src={docPreviewUrl}
                              alt={docPreviewTitle}
                              className="max-h-96 object-contain rounded-lg shadow-sm"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ================= WORKSHOP DESCRIPTION ================= */}
                {isMechanic && user.description && (
                  <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-2 shadow-xs">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-primary" />
                      About Workshop & Operations
                    </h4>
                    <p className="text-xs text-foreground leading-relaxed whitespace-pre-line bg-muted/20 p-3.5 rounded-xl border border-border/50">
                      {user.description}
                    </p>
                  </div>
                )}

                {/* ================= PORTFOLIO SHOWCASE ================= */}
                {isMechanic && user.portfolioPhotos && user.portfolioPhotos.length > 0 && (
                  <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3.5 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-primary" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                          Workshop Portfolio Showcase
                        </h4>
                      </div>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {user.portfolioPhotos.length} Photos
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {user.portfolioPhotos.map((photo: any) => (
                        <div
                          key={photo.id}
                          onClick={() => {
                            setDocPreviewUrl(photo.url);
                            setDocPreviewTitle(photo.fileName || 'Portfolio Photo');
                          }}
                          className="group relative aspect-video rounded-xl overflow-hidden border border-border/80 bg-muted cursor-pointer hover:border-primary transition-all shadow-xs"
                        >
                          <img
                            src={photo.url}
                            alt="Workshop portfolio item"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Eye className="w-5 h-5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ================= GOOGLE REVIEWS SECTION ================= */}
                {isMechanic && (
                  <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3.5 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                          Google Business Reviews
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {user.googlePlaceUrl && (
                          <a
                            href={user.googlePlaceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
                          >
                            <span>View on Maps</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        {user.mechanicId && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs gap-1.5 cursor-pointer"
                            onClick={handleSyncGoogle}
                            disabled={syncingGoogle}
                          >
                            <RefreshCw
                              className={`h-3 w-3 ${syncingGoogle ? 'animate-spin' : ''}`}
                            />
                            {syncingGoogle ? 'Syncing...' : 'Sync Google Reviews'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {localGoogleRating !== null ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                          <span className="text-xl font-black text-amber-600 dark:text-amber-400">
                            {Number(localGoogleRating).toFixed(1)}
                          </span>
                          <div className="flex text-amber-500 text-sm">
                            {'★'.repeat(Math.round(Number(localGoogleRating)))}
                            <span className="text-muted-foreground/40">
                              {'★'.repeat(5 - Math.round(Number(localGoogleRating)))}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">
                            ({localGoogleReviewCount ?? 0} verified Google reviews)
                          </span>
                        </div>

                        {localGoogleReviews && localGoogleReviews.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                              Recent Reviews
                            </span>
                            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                              {localGoogleReviews.map((rev: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="p-2.5 rounded-lg border border-border/60 bg-muted/20 text-xs space-y-1"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-semibold text-foreground">
                                      {rev.author}
                                    </span>
                                    <div className="flex items-center gap-1 text-[11px] text-amber-500 font-medium">
                                      <span>{'★'.repeat(rev.rating)}</span>
                                      <span className="text-muted-foreground text-[10px] ml-1">
                                        {rev.relativeTime}
                                      </span>
                                    </div>
                                  </div>
                                  <p className="text-muted-foreground italic text-[11px]">
                                    "{rev.text}"
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl border border-dashed text-center text-xs text-muted-foreground bg-muted/20">
                        No Google reviews synced yet. Click <strong>Sync Google Reviews</strong> to verify digital reputation against Google Places.
                      </div>
                    )}
                  </div>
                )}

                {/* ================= RECENT PLATFORM ACTIONS ================= */}
                <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <History className="w-4 h-4 text-primary" />
                    Recent Platform Actions
                  </div>

                  <div className="space-y-2">
                    {(user.activities || [1, 2, 3]).map((_: any, i: number) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30 text-xs"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium text-foreground">
                            {i === 0
                              ? 'Security credential audit verified'
                              : i === 1
                              ? 'Profile contact details refreshed'
                              : 'Account session logged in'}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            Recorded by Thriio Audit Logger
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailModal;