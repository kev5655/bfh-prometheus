# Use an official Golang image as the base image
FROM golang:latest

# Set the current working directory inside the container
WORKDIR /app

# Copy the go.mod and go.sum files and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the application source code
COPY . .

# Build the Go app
RUN go build -o /matrix-app

# Expose the port on which the application will run
EXPOSE 3030

# Run the executable
CMD ["/matrix-app"]
