FROM ubuntu:22.04

# Install dependencies
RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Download PocketBase
RUN wget https://github.com/pocketbase/pocketbase/releases/download/v0.22.6/pocketbase_0.22.6_linux_amd64.zip \
    && unzip pocketbase_0.22.6_linux_amd64.zip \
    && chmod +x pocketbase \
    && rm pocketbase_0.22.6_linux_amd64.zip

# Create directory for data
RUN mkdir -p /pb_data

# Expose port
EXPOSE 8090

# Start PocketBase
CMD ["./pocketbase", "serve", "--http", "0.0.0.0:8090"] 