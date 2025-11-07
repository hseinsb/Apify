FROM apify/actor-node-playwright-chrome:20

# Switch to root user to install ffmpeg
USER root

# Install ffmpeg for video/audio processing
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

# Switch back to default user
USER myuser

COPY package*.json ./

RUN npm --quiet set progress=false \
    && npm install --only=prod --no-optional \
    && echo "Installed NPM packages:" \
    && (npm list --only=prod --no-optional --all || true) \
    && echo "Node.js version:" \
    && node --version \
    && echo "NPM version:" \
    && npm --version \
    && echo "FFmpeg version:" \
    && ffmpeg -version

COPY . ./

