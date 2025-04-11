# VPC Configuration
cidr_block = "10.0.0.0/16"
vpc_name   = "main-vpc"
env        = "dev"

# Kubernetes Cluster
cluster_name = "my-eks-cluster"

# Public Subnet Configuration
public_subnet_count       = 3
public_subnet_name        = "public-subnet"
public_cidr_blocks        = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
public_availability_zones = ["ap-south-1a", "ap-south-1b", "ap-south-1c"]

# Private Subnet Configuration
private_subnet_count       = 3
private_subnet_name        = "private-subnet"
private_cidr_blocks        = ["10.0.11.0/24", "10.0.12.0/24", "10.0.13.0/24"]
private_availability_zones = ["ap-south-1a", "ap-south-1b", "ap-south-1c"]

# Internet Gateway Configuration
igw_name = "main-igw"

# NAT Gateway Configuration
eip_name = "nat-eip"
ngw_name = "main-ngw"

# Route Table Names
public_rt_name  = "public-rt"
private_rt_name = "private-rt"

# Security Group Configuration
security_group_name = "eks-cluster-sg"

# EKS Cluster Configuration
is_eks_cluster_enabled  = true
cluster_version         = "1.31"
endpoint_private_access = true
endpoint_public_access  = false

# EKS Cluster Role Configuration
is_eks_role_enabled = true

# EKS OIDC Role Configuration
namespace       = "default"
service_account = "aws-test"

# EKS Node Group Configurations

# On-demand Node Group Configuration
desired_capacity_on_demand = 1
min_capacity_on_demand     = 1
max_capacity_on_demand     = 5
ondemand_instance_types    = ["t3.medium"]

# Spot Node Group Configuration
desired_capacity_spot = 1
min_capacity_spot     = 1
max_capacity_spot     = 5
spot_instance_types   = ["t3.medium", "t3.large"]

# Optional Configuration
disk_size = 50

# EKS Node Group role Configuration

is_eks_nodegroup_role_enabled = true

# EKS Addons Configuration
addons = {
  "vpc-cni" = {
    version = "v1.19.3-eksbuild.1"
    tags = {
      "Purpose" = "Networking"
    }
  }
  "coredns" = {
    version = "v1.11.4-eksbuild.2"
  }
  "kube-proxy" = {
    version = "v1.31.3-eksbuild.2"
  }
  "aws-ebs-csi-driver" = {
    version = "v1.41.0-eksbuild.1"
    tags = {
      "Purpose" = "Storage"
    }
  }
}


# -----------------------------------------
