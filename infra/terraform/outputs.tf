output "emulator_external_ip" {
  description = "External IP of the Android emulator host"
  value       = google_compute_address.emulator_ip.address
}

output "emulator_web_ui" {
  description = "URL to access the emulator web interface"
  value       = "http://${google_compute_address.emulator_ip.address}:8080"
}

output "ssh_command" {
  description = "SSH command to connect to the emulator host"
  value       = "gcloud compute ssh android-emulator-host --zone=${var.zone}"
}
