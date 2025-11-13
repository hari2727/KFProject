module "appconfig_demo_profile" {
  source                  = "github.com/HayGroup/kfone-common//terraform/modules/AppConfigProfile?ref=main"
  profile_name            = "profile-manager-config"
  application_id          = var.application_id
  deployment_strategy_id  = var.deployment_strategy_id

  content = {
    APP_ENV = var.APP_ENV,
  } 
}