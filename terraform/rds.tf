# Fetch VPC information from core infrastructure
data "terraform_remote_state" "core_infra" {
  backend   = "s3"
  workspace = var.environment
  config = {
    bucket = "fiap-tech-challenge-tf-state-${data.aws_caller_identity.current.account_id}"
    key    = "kubernetes-core-infra/terraform.tfstate"
    region = var.aws_region
  }
}

# Random password for database
resource "random_password" "db_password" {
  length  = 32
  special = true
}

# Security group for RDS
resource "aws_security_group" "os_service_rds" {
  name_prefix = "${var.project_name}-os-service-rds-${var.environment}"
  description = "Security group for OS Service RDS PostgreSQL"
  vpc_id      = data.terraform_remote_state.core_infra.outputs.vpc_id

  ingress {
    description     = "PostgreSQL from EKS"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [data.terraform_remote_state.core_infra.outputs.cluster_security_group_id]
  }

  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(
    local.common_tags,
    {
      Name = "${var.project_name}-os-service-rds-${var.environment}"
    }
  )

  lifecycle {
    create_before_destroy = true
  }
}

# DB subnet group
resource "aws_db_subnet_group" "os_service" {
  name_prefix = "${var.project_name}-os-service-${var.environment}"
  description = "Subnet group for OS Service RDS"
  subnet_ids  = data.terraform_remote_state.core_infra.outputs.private_subnet_ids

  tags = merge(
    local.common_tags,
    {
      Name = "${var.project_name}-os-service-db-subnet-${var.environment}"
    }
  )
}

# RDS PostgreSQL instance
resource "aws_db_instance" "os_service" {
  identifier = "${var.project_name}-os-service-${var.environment}"

  # Engine
  engine               = "postgres"
  engine_version       = "15.4"
  instance_class       = var.db_instance_class
  allocated_storage    = var.db_allocated_storage
  storage_type         = "gp3"
  storage_encrypted    = true

  # Database
  db_name  = var.db_name
  username = "postgres"
  password = random_password.db_password.result
  port     = 5432

  # Network
  db_subnet_group_name   = aws_db_subnet_group.os_service.name
  vpc_security_group_ids = [aws_security_group.os_service_rds.id]
  publicly_accessible    = false

  # Backup
  backup_retention_period = var.environment == "production" ? 7 : 1
  backup_window           = "03:00-04:00"
  maintenance_window      = "mon:04:00-mon:05:00"

  # Monitoring
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]
  monitoring_interval             = 60
  monitoring_role_arn             = aws_iam_role.rds_monitoring.arn

  # Performance Insights
  performance_insights_enabled = var.environment == "production"

  # High availability
  multi_az = var.environment == "production"

  # Deletion protection
  deletion_protection = var.environment == "production"
  skip_final_snapshot = var.environment != "production"
  final_snapshot_identifier = var.environment == "production" ? "${var.project_name}-os-service-${var.environment}-final" : null

  tags = merge(
    local.common_tags,
    {
      Name = "${var.project_name}-os-service-${var.environment}"
    }
  )
}

# IAM role for RDS monitoring
resource "aws_iam_role" "rds_monitoring" {
  name_prefix = "rds-monitoring-role-os-service"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "monitoring.rds.amazonaws.com"
        }
      }
    ]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy_attachment" "rds_monitoring" {
  role       = aws_iam_role.rds_monitoring.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}
