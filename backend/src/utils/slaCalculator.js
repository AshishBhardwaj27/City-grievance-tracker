// SLA target hours by urgency level
const SLA_HOURS = { critical: 4, high: 24, medium: 72, low: 168 };
// Warning threshold — percentage of SLA elapsed
const WARNING_THRESHOLD = 0.8;

const calculateSLADeadline = (urgency, createdAt = new Date()) => {
  const hours = SLA_HOURS[urgency] || 72;
  const deadline = new Date(createdAt.getTime() + hours * 3600_000);
  return { deadline, targetResolutionHours: hours };
};

const getSLAStatus = (sla) => {
  if (!sla?.deadline) return "no_sla";
  if (sla.isBreached) return "breached";
  const now = Date.now();
  const deadline = new Date(sla.deadline).getTime();
  const total = sla.targetResolutionHours * 3600_000;
  const elapsed = now - (deadline - total);
  const ratio = elapsed / total;
  if (ratio >= 1) return "breached";
  if (ratio >= WARNING_THRESHOLD) return "warning";
  return "on_track";
};

const getHoursRemaining = (deadline) => {
  if (!deadline) return null;
  return Math.max(0, (new Date(deadline) - Date.now()) / 3600_000);
};

export { calculateSLADeadline, getSLAStatus, getHoursRemaining };
