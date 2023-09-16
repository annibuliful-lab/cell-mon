resource "vultr_object_storage" "object_storage" {
  cluster_id = var.s3.cluster_id
  label      = var.s3.label
}
