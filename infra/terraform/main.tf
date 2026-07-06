terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project     = var.project_id
  region      = var.region
  zone        = var.zone
  credentials = file("${path.module}/sa-key.json")
}

# Static IP so the frontend config doesn't change between restarts
resource "google_compute_address" "emulator_ip" {
  name   = "android-emulator-ip"
  region = var.region
}

# VM with nested virtualization — required for Android KVM emulator
resource "google_compute_instance" "emulator_host" {
  name         = "android-emulator-host"
  machine_type = var.machine_type
  zone         = var.zone

  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2204-lts"
      size  = 100
      type  = "pd-ssd"
    }
  }

  advanced_machine_features {
    enable_nested_virtualization = true
  }

  network_interface {
    network = "default"
    access_config {
      nat_ip = google_compute_address.emulator_ip.address
    }
  }

  metadata = {
    startup-script = file("${path.module}/../scripts/startup.sh")
    emulator-count = var.emulator_count
  }

  tags = ["android-emulator"]

  service_account {
    scopes = ["cloud-platform"]
  }
}

# Firewall: WebRTC, ADB, and web UI ports
# TODO: restrict source_ranges to your office/VPN CIDR before production use
resource "google_compute_firewall" "emulator_access" {
  name    = "allow-android-emulator"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["80", "443", "3000", "6080", "8080", "8554", "5554", "5555"]
  }

  allow {
    protocol = "udp"
    ports    = ["8554"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["android-emulator"]
}
