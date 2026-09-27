import { get, set, del } from 'idb-keyval';

const QUEUE_KEY = 'remission_offline_metrics_queue';

export async function queueOfflineMetric(metricData) {
  const existing = (await get(QUEUE_KEY)) || [];
  existing.push({ id: Date.now(), timestamp: new Date().toISOString(), payload: metricData });
  await set(QUEUE_KEY, existing);
}

export async function flushOfflineMetrics(apiEndpoint) {
  const queue = (await get(QUEUE_KEY)) || [];
  if (!queue.length) return { flushed: 0 };

  const remaining = [];
  let flushedCount = 0;

  for (const item of queue) {
    try {
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item.payload),
      });
      if (res.ok) {
        flushedCount++;
      } else {
        remaining.push(item);
      }
    } catch (err) {
      remaining.push(item);
    }
  }

  await set(QUEUE_KEY, remaining);
  return { flushed: flushedCount, remaining: remaining.length };
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    flushOfflineMetrics('/api/client/metrics');
  });
}
