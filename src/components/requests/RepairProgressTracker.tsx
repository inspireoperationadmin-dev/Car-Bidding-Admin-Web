import React, { useState, useEffect } from 'react';
import {
  Wrench,
  CheckCircle2,
  Clock,
  Camera,
  Calendar,
  AlertCircle,
  Plus,
  Loader2,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import apiClient from '@/api/client';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';

export interface RepairMilestone {
  id: number;
  stage: string;
  title: string;
  description?: string | null;
  photoUrls?: string[] | null;
  estimatedCompletionDate?: string | null;
  durationDays?: number | null;
  durationHours?: number | null;
  createdAt: string;
}

interface RepairProgressTrackerProps {
  requestId: number;
  initialDurationDays?: number | null;
  initialDurationHours?: number | null;
}

const STAGES = [
  { key: 'VEHICLE_DROPPED_OFF', label: 'Vehicle Received', desc: 'Vehicle checked in at garage' },
  { key: 'DIAGNOSTIC_TEARDOWN', label: 'Diagnostic Teardown', desc: 'Disassembly and fault diagnosis' },
  { key: 'PARTS_PROCUREMENT', label: 'Parts Sourcing', desc: 'OEM / certified parts delivery' },
  { key: 'REPAIR_IN_PROGRESS', label: 'Repair in Progress', desc: 'Active mechanical & assembly labor' },
  { key: 'QUALITY_INSPECTION', label: 'Quality Test', desc: 'Diagnostic scan & safety road test' },
  { key: 'COMPLETED_READY_FOR_PICKUP', label: 'Ready for Pickup', desc: 'Sanitized & ready for customer handover' },
];

export const RepairProgressTracker: React.FC<RepairProgressTrackerProps> = ({
  requestId,
  initialDurationDays,
  initialDurationHours,
}) => {
  const [milestones, setMilestones] = useState<RepairMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogModal, setShowLogModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [stage, setStage] = useState('REPAIR_IN_PROGRESS');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [durationDays, setDurationDays] = useState<number | undefined>(initialDurationDays ?? undefined);
  const [durationHours, setDurationHours] = useState<number | undefined>(initialDurationHours ?? undefined);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/requests/${requestId}/repair-progress`);
      if (res.data.success) {
        setMilestones(res.data.data.milestones || []);
      }
    } catch (err) {
      console.error('Failed to load repair progress', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (requestId) {
      fetchProgress();
    }
  }, [requestId]);

  const currentStageIndex = milestones.length > 0
    ? STAGES.findIndex((s) => s.key === milestones[milestones.length - 1].stage)
    : 0;

  const handleLogMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      await apiClient.post(`/requests/${requestId}/repair-progress`, {
        stage,
        title,
        description,
        photoUrls: photoUrl ? [photoUrl] : [],
        durationDays,
        durationHours,
      });
      setTitle('');
      setDescription('');
      setPhotoUrl('');
      setShowLogModal(false);
      fetchProgress();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Duration Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border/80 bg-muted/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-primary" />
            <h3 className="font-bold text-sm text-foreground">Live Repair Work Telemetry</h3>
            <Badge variant="success" className="text-[10px] px-1.5 py-0 font-bold">
              Active Milestone Tracking
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Customer and platform tracking of work execution, diagnostics, and milestone delivery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {(durationDays || durationHours) && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-card text-xs">
              <Clock className="h-3.5 w-3.5 text-amber-500" />
              <span className="font-semibold text-foreground">
                Est: {durationDays ? `${durationDays} Days` : ''}{durationDays && durationHours ? ' / ' : ''}{durationHours ? `${durationHours} Labor Hrs` : ''}
              </span>
            </div>
          )}

          <Button
            size="sm"
            variant="gradient"
            onClick={() => setShowLogModal(true)}
            className="gap-1.5 text-xs font-semibold h-8 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Log Milestone</span>
          </Button>
        </div>
      </div>

      {/* Progress Stage Stepper */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
        {STAGES.map((s, idx) => {
          const isCompleted = idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex;

          return (
            <div
              key={s.key}
              className={`p-3 rounded-xl border text-center transition-all ${
                isCurrent
                  ? 'border-primary bg-primary/10 text-primary shadow-sm ring-2 ring-primary/20'
                  : isCompleted
                  ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400'
                  : 'border-border/60 bg-muted/20 text-muted-foreground opacity-60'
              }`}
            >
              <div className="flex items-center justify-center mb-1.5">
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <span
                    className={`h-4 w-4 rounded-full text-[10px] font-bold flex items-center justify-center ${
                      isCurrent
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {idx + 1}
                  </span>
                )}
              </div>
              <p className="text-xs font-bold leading-tight line-clamp-1">{s.label}</p>
              <p className="text-[10px] opacity-75 mt-0.5 line-clamp-1">{s.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Timeline of Logged Updates */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-primary" />
          <span>Work Progress History</span>
        </h4>

        {loading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
          </div>
        ) : milestones.length === 0 ? (
          <div className="p-6 rounded-xl border border-dashed text-center text-xs text-muted-foreground bg-muted/10">
            No repair milestones logged yet. Once the mechanic begins work on the vehicle, stage updates and photos will stream here.
          </div>
        ) : (
          <div className="relative pl-6 space-y-4 border-l-2 border-primary/20 ml-3">
            {milestones.map((m) => (
              <div key={m.id} className="relative group">
                {/* Dot */}
                <div className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full border-2 border-background bg-primary ring-4 ring-primary/20" />

                <div className="p-3.5 rounded-xl border border-border/70 bg-card shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">{m.title}</span>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-medium uppercase">
                        {m.stage.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      {new Date(m.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {m.description && (
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {m.description}
                    </p>
                  )}

                  {m.photoUrls && m.photoUrls.length > 0 && (
                    <div className="flex items-center gap-2 pt-1">
                      {m.photoUrls.map((url, i) => (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="relative h-16 w-20 rounded-lg overflow-hidden border border-border hover:opacity-90 transition-opacity"
                        >
                          <img src={url} alt="Milestone proof" className="h-full w-full object-cover" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Log Milestone Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in-0">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-bold text-base text-foreground">Log Repair Milestone</h4>
              <button
                type="button"
                onClick={() => setShowLogModal(false)}
                className="text-muted-foreground hover:text-foreground font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleLogMilestone} className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Repair Stage</Label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs"
                >
                  {STAGES.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Milestone Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Brake Caliper & Disc Replacement Complete"
                  className="text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Detailed Notes</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe technical checks completed, parts replaced, or next steps..."
                  rows={3}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Photo Proof URL (Optional)</Label>
                <Input
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://..."
                  className="text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Updated Duration (Days)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={durationDays ?? ''}
                    onKeyDown={(e) => {
                      if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => setDurationDays(e.target.value ? Math.max(0, Number(e.target.value)) : undefined)}
                    placeholder="e.g. 2"
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Labor Hours</Label>
                  <Input
                    type="number"
                    min={0}
                    value={durationHours ?? ''}
                    onKeyDown={(e) => {
                      if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => setDurationHours(e.target.value ? Math.max(0, Number(e.target.value)) : undefined)}
                    placeholder="e.g. 14"
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLogModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  variant="default"
                  disabled={submitting || !title.trim()}
                  className="gap-1.5"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  <span>Save Milestone</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
