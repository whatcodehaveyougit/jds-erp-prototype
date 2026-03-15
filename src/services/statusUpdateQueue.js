const QUEUE_KEY = 'jds_status_update_queue_v1';

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

function readQueue() {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeQueue(queue) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

// Keep at most one pending update per plant. Latest status wins.
export function upsertQueuedStatusUpdate(item) {
  const queue = readQueue().filter((q) => q.plantId !== item.plantId);
  queue.push({
    id: createId(),
    plantId: item.plantId,
    plantName: item.plantName,
    status: item.status,
    queuedAt: Date.now(),
  });
  writeQueue(queue);
}

export function removeQueuedStatusUpdate(plantId) {
  const queue = readQueue().filter((q) => q.plantId !== plantId);
  writeQueue(queue);
}

export function setQueuedStatusUpdates(items) {
  writeQueue(items);
}

export function getQueuedStatusUpdates() {
  return readQueue().sort((a, b) => b.queuedAt - a.queuedAt);
}

export function getQueuedStatusCount() {
  return readQueue().length;
}

export function getPendingPlantIdSet() {
  return new Set(readQueue().map((q) => q.plantId));
}
