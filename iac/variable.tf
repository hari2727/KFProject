variable "ENVIRONMENT" {
  type = string
  default = "sbx"
}
variable "INSTANCE" {
  type = string
  default = "kfone"
}
variable "location" {
  type = string
  default = "northvirginia"
}
variable "region" {
  type = string
  default = "us-east-1"
}


## appconfig variales
variable "application_id" {
  type = string
}
variable "deployment_strategy_id" {
  type = string
}

## mq variables

#### Tagging Variables ###### 

variable "Env" {
  type    = string
  default = ""
  description = "Envrionment for tag"
}
variable "Accessibility" {
  type        = string
  description = "Accessibility tag. Available values are [private, public, intranet, authenticated, anonymous]"
}
variable "Classification" {
  type        = string
  description = "Data Classification. Available values are [Public, Proprietary (default), Confidential, Restricted, Confidential:geo-restricted, Proprietary:geo-restricted]"
}
variable "HasPII" {
  type        = string
  description = "This is the boolean value true or false for hasPII"
}
variable "Compliance" {
  type        = string
  description = "This is the Compliance. Available values are [HIPAA, PCI, GDPR, ITAR, FedRAMP, CCPA]"
}
variable "Owner" {
  type        = string
  description = "Owner for this resource"
}
variable "infra_KFDAppGroup" {
  type        = string
  description = "Tag value for Infra KFDAppGroup "
}
variable "infra_KFDAppSubGroup" {
  type        = string
  description = "Tag value for Infra for Module"
}
variable "WBS-Code" {
  type        = string
  description = "WBS Code for the cost center for this infra"
}
variable "Cost-Center" {
  type        = string
  description = "Cost Centre for this infra"
}
variable "Applications-Dept" {
  type        = string
  description = "Tag value for Applications Department"
}
variable "Line-Of-Business" {
  type        = string
  description = "Tag value for Line of Business in KF Digital"
}
variable "Tech-Owner" {
  type        = string
  description = "Tech-Owner for this resource"
}

variable "map-migrated" {
  type        = string
  default     = "migJVH5TLG7X3"
  description = "map-migrated identify using cost center"
}

#### Application specific configurations ######

variable "APP_ENV" {
  type    = string
  default = "DEV"
}