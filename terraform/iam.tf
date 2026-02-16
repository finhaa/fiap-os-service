# IAM role for OS Service pods (IRSA - IAM Roles for Service Accounts)
data "aws_iam_policy_document" "os_service_assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Federated"
      identifiers = [data.terraform_remote_state.core_infra.outputs.oidc_provider_arn]
    }

    actions = ["sts:AssumeRoleWithWebIdentity"]

    condition {
      test     = "StringEquals"
      variable = "${replace(data.terraform_remote_state.core_infra.outputs.oidc_provider_arn, "/^(.*provider/)/", "")}:sub"
      values   = ["system:serviceaccount:ftc-app-${var.environment}:os-service"]
    }

    condition {
      test     = "StringEquals"
      variable = "${replace(data.terraform_remote_state.core_infra.outputs.oidc_provider_arn, "/^(.*provider/)/", "")}:aud"
      values   = ["sts.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "os_service" {
  name_prefix        = "os-service-${var.environment}-"
  assume_role_policy = data.aws_iam_policy_document.os_service_assume_role.json

  tags = local.common_tags
}

# Policy for EventBridge/SQS access
data "aws_iam_policy_document" "os_service" {
  statement {
    sid    = "AllowEventBridgePublish"
    effect = "Allow"
    actions = [
      "events:PutEvents"
    ]
    resources = [
      "arn:aws:events:${local.region}:${local.account_id}:event-bus/${var.project_name}-events-${var.environment}"
    ]
  }

  statement {
    sid    = "AllowSQSConsume"
    effect = "Allow"
    actions = [
      "sqs:ReceiveMessage",
      "sqs:DeleteMessage",
      "sqs:GetQueueAttributes"
    ]
    resources = [
      "arn:aws:sqs:${local.region}:${local.account_id}:os-service-events-${var.environment}"
    ]
  }

  statement {
    sid    = "AllowSecretsManagerRead"
    effect = "Allow"
    actions = [
      "secretsmanager:GetSecretValue"
    ]
    resources = [
      aws_secretsmanager_secret.os_service_db.arn
    ]
  }
}

resource "aws_iam_role_policy" "os_service" {
  name_prefix = "os-service-policy-"
  role        = aws_iam_role.os_service.id
  policy      = data.aws_iam_policy_document.os_service.json
}
