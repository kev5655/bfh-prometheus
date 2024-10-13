// /pages/api/multiply.ts
import type { NextApiRequest, NextApiResponse } from "next";

type MatrixMultiplicationResult = {
  application: string;
  size: number;
  execution_time: string;
};

function generateMatrix(size: number): number[][] {
  const matrix: number[][] = [];
  for (let i = 0; i < size; i++) {
    matrix[i] = [];
    for (let j = 0; j < size; j++) {
      matrix[i][j] = Math.random() * 100;
    }
  }
  return matrix;
}

function multiplyMatrices(a: number[][], b: number[][]): number[][] {
  const size = a.length;
  const result: number[][] = Array.from({ length: size }, () =>
    Array(size).fill(0)
  );

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let sum = 0;
      for (let k = 0; k < size; k++) {
        sum += a[i][k] * b[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<MatrixMultiplicationResult | { error: string }>
) {
  const { size } = req.query;

  if (!size || isNaN(Number(size)) || Number(size) <= 0) {
    return res.status(400).json({ error: "Invalid size parameter" });
  }

  const matrixSize = parseInt(size as string, 10);

  const start = process.hrtime();
  const a = generateMatrix(matrixSize);
  const b = generateMatrix(matrixSize);
  multiplyMatrices(a, b);
  const elapsed = process.hrtime(start);
  const elapsedTime = `${(elapsed[0] * 1000 + elapsed[1] / 1e6).toFixed(2)} ms`;

  // Return JSON result
  res.status(200).json({
    application: process.env.HOSTNAME ?? "node-matrix-application",
    size: matrixSize,
    execution_time: elapsedTime,
  });
}
