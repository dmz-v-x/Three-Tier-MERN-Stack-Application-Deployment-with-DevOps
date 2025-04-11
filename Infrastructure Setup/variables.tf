# VPC Variables

variable "cidr_block" {
  description = "The CIDR block for the VPC"
  type        = string
}

variable "vpc_name" {
  description = "The name of the VPC"
  type        = string
}

variable "env" {
  description = "The environment name"
  type        = string
}

# -------------------------------------

# Subnet Variables
variable "public_subnet_count" {
  description = "The number of public subnets"
  type        = number
}

variable "private_subnet_count" {
  description = "The number of private subnets"
  type        = number
}

variable "public_cidr_blocks" {
  description = "List of CIDR blocks for public subnets"
  type        = list(string)
}

variable "private_cidr_blocks" {
  description = "List of CIDR blocks for private subnets"
  type        = list(string)
}

variable "public_availability_zones" {
  description = "List of availability zones for public subnets"
  type        = list(string)
}

variable "private_availability_zones" {
  description = "List of availability zones for private subnets"
  type        = list(string)
}

variable "public_subnet_name" {
  description = "Base name for public subnets"
  type        = string
}

variable "private_subnet_name" {
  description = "Base name for private subnets"
  type        = string
}

variable "cluster_name" {
  description = "The name of the EKS cluster"
  type        = string
}

# -----------------------------------------------


# Internet Gateway Variables
variable "igw_name" {
  description = "The name of the Internet Gateway"
  type        = string
}

# ---------------------------------------------------

# NAT Gateway Variables
variable "eip_name" {
  description = "The name of the Elastic IP"
  type        = string
}

variable "ngw_name" {
  description = "The name of the NAT Gateway"
  type        = string
}

# --------------------------------------------------

# Route Table Variables
variable "public_rt_name" {
  description = "Name of the public route table"
  type        = string
}

variable "private_rt_name" {
  description = "Name of the private route table"
  type        = string
}

# -------------------------------------------------

# Security Group Variables
variable "security_group_name" {
  description = "The name of the security group"
  type        = string
}

# -------------------------------------------------
# EKS Cluster Variables
variable "is_eks_cluster_enabled" {
  type        = bool
  description = "Flag to enable/disable EKS cluster creation"
  default     = true
}

variable "cluster_version" {
  type        = string
  description = "The version of the EKS cluster"
}

variable "endpoint_private_access" {
  type        = bool
  description = "Enable private endpoint access"
  default     = true
}

variable "endpoint_public_access" {
  type        = bool
  description = "Enable public endpoint access"
  default     = false
}

# variable "cluster_role_arn" {
#   type        = string
#   description = "ARN of the IAM role for the EKS cluster"
# }

# -------------------------------------------------

# EKS Cluster Role Variables
variable "is_eks_role_enabled" {
  description = "Flag to enable the EKS cluster role"
  type        = bool
  default     = true
}

# EKS OIDC Role Variables
variable "namespace" {
  type        = string
  description = "Kubernetes namespace for the service account"
  default     = "default"
}

variable "service_account" {
  type        = string
  description = "Kubernetes service account name"
}

# -------------------------------------------------

# EKS Node Group Variables

# On-demand node group variables
variable "desired_capacity_on_demand" {
  type        = number
  description = "Desired capacity for on-demand node group"
  default     = 2
}

variable "min_capacity_on_demand" {
  type        = number
  description = "Min capacity for on-demand node group"
  default     = 1
}

variable "max_capacity_on_demand" {
  type        = number
  description = "Max capacity for on-demand node group"
  default     = 4
}

variable "ondemand_instance_types" {
  type        = list(string)
  description = "Instance types for the on-demand node group"
  default     = ["t3.medium"]
}

# Spot node group variables
variable "desired_capacity_spot" {
  type        = number
  description = "Desired capacity for spot node group"
  default     = 1
}

variable "min_capacity_spot" {
  type        = number
  description = "Min capacity for spot node group"
  default     = 1
}

variable "max_capacity_spot" {
  type        = number
  description = "Max capacity for spot node group"
  default     = 4
}

variable "spot_instance_types" {
  type        = list(string)
  description = "Instance types for the spot node group"
  default     = ["t3.medium", "t3.large"]
}

variable "disk_size" {
  type        = number
  description = "Disk size in GiB for worker nodes"
  default     = 50
}

# -------------------------------------------------

# EKS Node Group Role Variable
variable "is_eks_nodegroup_role_enabled" {
  description = "Flag to enable the EKS nodegroup role"
  type        = bool
  default     = true
}

# -------------------------------------------------

# EKS Addons Variables:

variable "addons" {
  description = "Map of EKS addon configurations"
  type = map(object({
    version = string
    tags    = optional(map(string))
  }))
  default = {
    "vpc-cni" = {
      version = "v1.12.0-eksbuild.1"
      tags = {
        "Purpose" = "Networking"
      }
    }
    "coredns" = {
      version = "v1.8.7-eksbuild.3"
    }
    "kube-proxy" = {
      version = "v1.24.7-eksbuild.2"
    }
    "aws-ebs-csi-driver" = {
      version = "v1.5.0-eksbuild.1"
      tags = {
        "Purpose" = "Storage"
      }
    }
  }
}

# -------------------------------------------------


