variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "europe-central2"
}

variable "zone" {
  description = "GCP zone"
  type        = string
  default     = "europe-central2-a"
}

variable "machine_type" {
  description = "GCP machine type for emulator host (n2-standard-4 = 4 CPU / 16GB RAM, ~$0.19/h)"
  type        = string
  default     = "n2-standard-4"
}

variable "emulator_count" {
  description = "Number of Android emulator instances to start"
  type        = number
  default     = 1
}
