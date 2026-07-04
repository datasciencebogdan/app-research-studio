#!/bin/bash
set -e

apt-get update -q
apt-get install -y docker.io

systemctl enable docker
systemctl start docker
usermod -aG docker ubuntu

# Verify KVM is available (required for Android emulator acceleration)
if [ ! -e /dev/kvm ]; then
  echo "ERROR: /dev/kvm not found — nested virtualization not enabled" >&2
  exit 1
fi

# Pull and start Android 11 emulator with noVNC web interface on port 6080
# noVNC lets the emulator screen appear directly in any browser — no extra client needed
docker run -d \
  --name android-emulator-1 \
  --privileged \
  --device /dev/kvm:/dev/kvm \
  -p 6080:6080 \
  -p 5554:5554 \
  -p 5555:5555 \
  -e EMULATOR_DEVICE="Nexus 5" \
  -e WEB_VNC=true \
  budtmo/docker-android:emulator_11.0

echo "Emulator started. noVNC interface: http://$(curl -sf http://metadata.google.internal/computeMetadata/v1/instance/network-interfaces/0/access-configs/0/external-ip -H 'Metadata-Flavor: Google'):6080"
