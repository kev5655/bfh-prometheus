// /pages/api/index.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).send('Hello from go-matrix-api (TypeScript with Next.js)');
}
