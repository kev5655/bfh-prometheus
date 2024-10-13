// /pages/api/metrics.ts
import { NextApiRequest, NextApiResponse } from 'next';
import client from 'prom-client';

const register = new client.Registry();

// Collect default metrics from prom-client
client.collectDefaultMetrics({ register });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', register.contentType);
  const metrics = await register.metrics();
  res.status(200).send(metrics);
}
