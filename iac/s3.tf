# locals {
#  s3_bucket_folders = toset([
#    "template"
#  ])
# }

# resource "aws_s3_object" "s3_bucket_folder_object" {
#    for_each        = toset(local.s3_bucket_folders)
#    bucket          = module.naming.generated_names.template.simple_storage_service[0]
#    key             = "${each.value}/"
#    content_type    = "application/x-directory"
# }