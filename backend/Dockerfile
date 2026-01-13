FROM node:18

# 1. Install Python and build essentials
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 2. Copy dependency files
COPY package*.json ./
COPY requirements.txt ./

# 3. Install Node dependencies
RUN npm install

# 4. Install Python dependencies 
# Note: --break-system-packages is required for newer Debian/Ubuntu versions in Docker
RUN pip3 install --no-cache-dir --break-system-packages \
    joblib \
    scikit-learn \
    numpy \
    pandas

# If you have other specific versions in requirements.txt, use this instead:
# RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt

# 5. Copy the rest of the application
COPY . .

EXPOSE 5149
CMD ["node", "server.js"]