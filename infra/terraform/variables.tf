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
  description = "GCP machine type for emulator host (min n1-standard-4 for 1 emulator)"
  type        = string
  default     = "n1-standard-8"
}

variable "emulator_count" {
  description = "Number of Android emulator instances to start"
  type        = number
  default     = 2
}
