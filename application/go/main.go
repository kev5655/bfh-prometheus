package main

import (
	"encoding/json"
	"fmt"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"math/rand"
	"net/http"
	"strconv"
	"time"
)

// MatrixMultiplicationResult holds the result and execution time of matrix multiplication
type MatrixMultiplicationResult struct {
	Size          int    `json:"size"`
	ExecutionTime string `json:"execution_time"`
}

// generateMatrix generates an n x n matrix with random float64 values
func generateMatrix(size int) [][]float64 {
	matrix := make([][]float64, size)
	for i := range matrix {
		matrix[i] = make([]float64, size)
		for j := range matrix[i] {
			matrix[i][j] = rand.Float64() * 100
		}
	}
	return matrix
}

// multiplyMatrices multiplies two matrices a and b
func multiplyMatrices(a, b [][]float64) [][]float64 {
	size := len(a)
	result := make([][]float64, size)
	for i := range result {
		result[i] = make([]float64, size)
		for j := range result[i] {
			sum := 0.0
			for k := 0; k < size; k++ {
				sum += a[i][k] * b[k][j]
			}
			result[i][j] = sum
		}
	}
	return result
}

// matrixMultiplyHandler handles the REST request for matrix multiplication
func matrixMultiplyHandler(w http.ResponseWriter, r *http.Request) {
	keys, ok := r.URL.Query()["size"]

	if !ok || len(keys[0]) < 1 {
		http.Error(w, "Missing size parameter", http.StatusBadRequest)
		return
	}

	sizeStr := keys[0]
	size, err := strconv.Atoi(sizeStr)
	if err != nil || size <= 0 {
		http.Error(w, "Invalid size parameter", http.StatusBadRequest)
		return
	}

	// Generate two random matrices of the given size
	fmt.Printf("Multiplying two %dx%d matrices\n", size, size)
	a := generateMatrix(size)
	b := generateMatrix(size)

	// Measure the execution time of the matrix multiplication
	start := time.Now()
	multiplyMatrices(a, b)
	elapsed := time.Since(start)

	result := MatrixMultiplicationResult{
		Size:          size,
		ExecutionTime: elapsed.String(),
	}

	// Return the result as JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func main() {
	http.Handle("/metrics", promhttp.Handler())
	http.HandleFunc("/multiply", matrixMultiplyHandler)
	fmt.Println("Server is listening on port 3030...")
	if err := http.ListenAndServe(":3030", nil); err != nil {
		fmt.Println("Failed to start server:", err)
	}
}
