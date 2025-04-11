module "vpc" {
  source     = "./modules/1. vpc"
  cidr_block = var.cidr_block
  vpc_name   = var.vpc_name
  env        = var.env
}

# ----------------------------------------

module "subnets" {
  source = "./modules/2. subnets"

  vpc_id       = module.vpc.vpc_id
  env          = var.env
  cluster_name = var.cluster_name

  # Public subnet configurations
  public_subnet_count       = var.public_subnet_count
  public_subnet_name        = var.public_subnet_name
  public_cidr_blocks        = var.public_cidr_blocks
  public_availability_zones = var.public_availability_zones

  # Private subnet configurations
  private_subnet_count       = var.private_subnet_count
  private_subnet_name        = var.private_subnet_name
  private_cidr_blocks        = var.private_cidr_blocks
  private_availability_zones = var.private_availability_zones

  depends_on = [module.vpc]
}

# ---------------------------------------

module "internet_gateway" {
  source       = "./modules/3. internet_gateway"
  vpc_id       = module.vpc.vpc_id
  igw_name     = var.igw_name
  env          = var.env
  cluster_name = var.cluster_name

  depends_on = [module.vpc]
}

# -------------------------------------

module "nat_gateway" {
  source           = "./modules/4. nat_gateway"
  public_subnet_id = module.subnets.public_subnet_ids[0]
  eip_name         = var.eip_name
  ngw_name         = var.ngw_name
  env              = var.env

  depends_on = [
    module.subnets,
    module.internet_gateway
  ]
}

# -------------------------------------

# Route Tables
module "route_tables" {
  source             = "./modules/5. route_table"
  vpc_id             = module.vpc.vpc_id
  igw_id             = module.internet_gateway.igw_id
  ngw_id             = module.nat_gateway.ngw_id
  public_rt_name     = var.public_rt_name
  private_rt_name    = var.private_rt_name
  public_subnet_ids  = module.subnets.public_subnet_ids
  private_subnet_ids = module.subnets.private_subnet_ids
  env                = var.env

  depends_on = [
    module.vpc,
    module.subnets,
    module.internet_gateway,
    module.nat_gateway
  ]
}

# --------------------------------------

# Security Group
module "security_group" {
  source         = "./modules/6. security_group"
  vpc_id         = module.vpc.vpc_id
  security_group = var.security_group_name
  env            = var.env

  depends_on = [module.vpc]
}

# --------------------------------------

# EKS Cluster
module "eks_cluster" {
  source                  = "./modules/7. eks_cluster"
  is_eks_cluster_enabled  = var.is_eks_cluster_enabled
  cluster_name            = var.cluster_name
  cluster_version         = var.cluster_version
  subnet_ids              = concat(module.subnets.private_subnet_ids, module.subnets.public_subnet_ids)
  endpoint_private_access = var.endpoint_private_access
  endpoint_public_access  = var.endpoint_public_access
  security_group_ids      = [module.security_group.sg_id]
  cluster_role_arn        = module.eks_cluster_role.eks_cluster_role_arn
  env                     = var.env

  depends_on = [
    module.subnets,
    module.security_group,
    module.eks_cluster_role,
    module.policy_attachments,
    module.route_tables
  ]
}

# --------------------------------------

# EKS Cluster Role
module "eks_cluster_role" {
  source              = "./modules/8. eks_cluster_role"
  cluster_name        = var.cluster_name
  is_eks_role_enabled = var.is_eks_role_enabled
  env                 = var.env
}

# --------------------------------------

# EKS OIDC Provider Module
module "eks_oidc" {
  source                 = "./modules/9. eks_oidc"
  oidc_url               = module.eks_certificate.eks_certificate_url
  certificate_thumbprint = module.eks_certificate.eks_certificate_thumbprint
  env                    = var.env

  depends_on = [module.eks_certificate]
}

# --------------------------------------

# EKS OIDC Role Module
module "eks_oidc_role" {
  source            = "./modules/10. eks_oidc_role"
  role_name         = "${var.cluster_name}-oidc-role"
  oidc_provider_url = module.eks_oidc.oidc_provider_url
  oidc_provider_arn = module.eks_oidc.oidc_provider_arn
  namespace         = var.namespace
  service_account   = var.service_account
  env               = var.env

  depends_on = [module.eks_oidc]
}

# --------------------------------------

# EKS Certificate Module
module "eks_certificate" {
  source = "./modules/11. eks_certificate"
  eks_cluster = {
    identity = [{
      oidc = [{
        issuer = module.eks_cluster.cluster_oidc_issuer_url
      }]
    }]
  }

  depends_on = [
    module.eks_cluster
  ]

}

# --------------------------------------

# EKS Node Group Module

module "eks_node_groups" {
  source = "./modules/12. eks_node_groups"

  cluster_name  = module.eks_cluster.eks_cluster_name
  node_role_arn = module.eks_nodegroup_role.eks_nodegroup_role_arn
  subnet_ids    = module.subnets.private_subnet_ids
  env           = var.env

  # On-demand node group configuration
  desired_capacity_on_demand = var.desired_capacity_on_demand
  min_capacity_on_demand     = var.min_capacity_on_demand
  max_capacity_on_demand     = var.max_capacity_on_demand
  ondemand_instance_types    = var.ondemand_instance_types

  # Spot node group configuration
  desired_capacity_spot = var.desired_capacity_spot
  min_capacity_spot     = var.min_capacity_spot
  max_capacity_spot     = var.max_capacity_spot
  spot_instance_types   = var.spot_instance_types

  # Optional configurations
  disk_size = var.disk_size

  depends_on = [
    module.eks_cluster,
    module.eks_nodegroup_role,
    module.policy_attachments,
    module.route_tables
  ]
}

# --------------------------------------
# EKS Node Group Role Module

module "eks_nodegroup_role" {
  source = "./modules/13. eks_nodegroup_role"

  cluster_name                  = var.cluster_name
  is_eks_nodegroup_role_enabled = var.is_eks_nodegroup_role_enabled
  env                           = var.env
}

# --------------------------------------

# EKS Addons Module

module "eks_addons" {
  source = "./modules/14. eks_addons"

  cluster_name = var.cluster_name
  addons       = var.addons
  env          = var.env

  depends_on = [
    module.eks_cluster,
    module.eks_node_groups,
    module.eks_oidc_role
  ]
}


# --------------------------------------

# Policy Attachments:

module "policy_attachments" {
  source = "./modules/15. policy_attachments"

  is_eks_role_enabled           = var.is_eks_role_enabled
  is_eks_nodegroup_role_enabled = var.is_eks_nodegroup_role_enabled
  cluster_role_name             = module.eks_cluster_role.eks_cluster_role_name
  nodegroup_role_name           = module.eks_nodegroup_role.eks_nodegroup_role_name

  depends_on = [
    module.eks_cluster_role,
    module.eks_nodegroup_role
  ]
}
