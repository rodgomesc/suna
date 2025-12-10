import { getAll } from '@vercel/edge-config';
import type { IMaintenanceNotice } from '@/lib/edge-flags';

export const runtime = 'edge';

async function getMaintenanceNotice(): Promise<IMaintenanceNotice> {
  if (!process.env.EDGE_CONFIG) {
    return { enabled: false };
  }

  const flags = await getAll([
    'maintenance-notice_start-time',
    'maintenance-notice_end-time',
    'maintenance-notice_enabled',
  ]);

  if (!flags || Object.keys(flags).length === 0) {
    return { enabled: false };
  }

  const enabled = flags['maintenance-notice_enabled'];

  if (!enabled) {
    return { enabled: false };
  }

  const startTimeRaw = flags['maintenance-notice_start-time'];
  const endTimeRaw = flags['maintenance-notice_end-time'];

  if (!startTimeRaw || !endTimeRaw) {
    return { enabled: false };
  }

  const startTime = new Date(startTimeRaw as string);
  const endTime = new Date(endTimeRaw as string);

  if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
    console.error(
      `Invalid maintenance notice start or end time: ${startTimeRaw} or ${endTimeRaw}`,
    );
    return { enabled: false };
  }

  return {
    enabled: true,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
  };
}

export async function GET() {
  try {
    const maintenanceNotice = await getMaintenanceNotice();
    return Response.json(maintenanceNotice);
  } catch (error) {
    console.error('[API] Error in edge flags route:', error);
    return Response.json({ enabled: false }, { status: 500 });
  }
}