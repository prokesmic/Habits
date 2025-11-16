type EmailJob = {
  id: string;
  userId: string;
  to: string;
  templateId: string;
  data: any;
  scheduledFor: Date;
  status: "pending" | "sent" | "failed";
  attempts: number;
};

const memoryQueue: EmailJob[] = [];

export function queueEmail(userId: string, to: string, templateId: string, data: any, delayHours = 0) {
  const scheduledFor = new Date(Date.now() + delayHours * 3600 * 1000);
  memoryQueue.push({
    id: `${Date.now()}-${Math.random()}`,
    userId,
    to,
    templateId,
    data,
    scheduledFor,
    status: "pending",
    attempts: 0,
  });
}

export function getPendingJobs(limit = 50) {
  const now = Date.now();
  return memoryQueue.filter((j) => j.status === "pending" && j.scheduledFor.getTime() <= now).slice(0, limit);
}

export function markJobSent(id: string) {
  const job = memoryQueue.find((j) => j.id === id);
  if (job) job.status = "sent";
}

export function markJobFailed(id: string) {
  const job = memoryQueue.find((j) => j.id === id);
  if (job) {
    job.attempts += 1;
    if (job.attempts >= 3) job.status = "failed";
  }
}


