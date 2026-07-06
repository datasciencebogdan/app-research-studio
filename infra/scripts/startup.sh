#!/bin/bash
# App Research Studio — GCP VM startup script
# Runs once on first boot (or after VM recreation).
# Installs: Docker, Android emulator (noVNC), Node.js 20, App Research Studio.
set -e
exec > /var/log/startup.log 2>&1

echo "[1/6] System packages..."
apt-get update -q
apt-get install -y docker.io curl git android-tools-adb

systemctl enable docker
systemctl start docker

# Verify KVM (requires nested virtualization enabled on the GCP VM)
if [ ! -e /dev/kvm ]; then
  echo "ERROR: /dev/kvm not found — nested virtualization must be enabled" >&2
  exit 1
fi

echo "[2/6] Starting Android emulator (Docker)..."
docker pull budtmo/docker-android:emulator_11.0

docker run -d \
  --name android-emulator \
  --restart unless-stopped \
  --privileged \
  --device /dev/kvm:/dev/kvm \
  -p 6080:6080 \
  -p 5554:5554 \
  -p 5555:5555 \
  -e EMULATOR_DEVICE="Nexus 5" \
  -e WEB_VNC=true \
  budtmo/docker-android:emulator_11.0

echo "[3/6] Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

echo "[4/6] Cloning App Research Studio..."
git clone https://github.com/datasciencebogdan/app-research-studio.git /opt/app-research-studio
cd /opt/app-research-studio
npm ci
npm run build

echo "[5/6] Creating systemd service..."
cat > /etc/systemd/system/app-research-studio.service << 'UNIT'
[Unit]
Description=App Research Studio
After=network.target docker.service
Requires=docker.service

[Service]
Type=simple
WorkingDirectory=/opt/app-research-studio
Environment=NODE_ENV=production
Environment=PORT=3000
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
UNIT

systemctl daemon-reload
systemctl enable app-research-studio
systemctl start app-research-studio

echo "[6/6] Connecting ADB to emulator (waiting for boot)..."
# Wait up to 5 min for emulator to finish booting
for i in $(seq 1 30); do
  sleep 10
  if adb connect localhost:5555 2>&1 | grep -q "connected"; then
    echo "ADB connected to emulator."
    break
  fi
  echo "  Waiting for emulator... ($((i*10))s)"
done

EXTERNAL_IP=$(curl -sf \
  "http://metadata.google.internal/computeMetadata/v1/instance/network-interfaces/0/access-configs/0/external-ip" \
  -H "Metadata-Flavor: Google")

echo ""
echo "======================================================"
echo "Setup complete!"
echo "App Research Studio : http://${EXTERNAL_IP}:3000"
echo "Android emulator    : http://${EXTERNAL_IP}:6080"
echo "======================================================"
