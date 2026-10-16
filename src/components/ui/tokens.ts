export const ui = {
  colors: {
    bg: 'linear-gradient(135deg, #0B0F1A 0%, #111827 40%, #0F172A 70%, #0B1120 100%)',
    text: '#F1F5F9',
    muted: '#64748B',
    muted2: '#475569',
    border: 'rgba(255,255,255,0.08)',
    panel: 'rgba(255,255,255,0.03)',
    panelHover: 'rgba(255,255,255,0.05)',
  },
  radius: {
    card: '24px',
    inner: '16px',
    btn: '14px',
  },
};

export const glassPanelSx = (hoverAccent = 'rgba(100,149,237,0.2)') => ({
  background: ui.colors.panel,
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: `1px solid ${ui.colors.border}`,
  borderRadius: ui.radius.card,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: ui.colors.panelHover,
    border: '1px solid rgba(255,255,255,0.12)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  },
});

export const chartTooltipStyle = {
  borderRadius: '16px',
  border: '1px solid rgba(255,255,255,0.1)',
  boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
  background: 'rgba(15,23,42,0.95)',
  backdropFilter: 'blur(20px)',
  color: '#E2E8F0',
  fontWeight: 600,
};
