terraform {
  required_providers {
    vultr = {
      source  = "vultr/vultr"
      version = "2.16.2"
    }
  }
}
provider "vultr" {
  api_key     = var.api_key
  rate_limit  = 100
  retry_limit = 3
}
