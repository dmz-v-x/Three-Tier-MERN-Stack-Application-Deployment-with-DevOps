properties([
    parameters([
        string(
            defaultValue: 'dev',
            description: 'Environment to deploy (dev/prod)',
            name: 'Environment'
        ),
        choice(
            choices: ['plan', 'apply', 'destroy'], 
            description: 'Terraform action to perform',
            name: 'Terraform_Action'
        )
    ])
])

pipeline {
    agent any
    
    environment {
        AWS_REGION = 'ap-south-1'
        TERRAFORM_DIR = './Infrastructure Setup'
        BACKEND_BUCKET = 'mern-application-terraform-bucket'
        DYNAMODB_TABLE = 'terraform-state-lock-mern-application'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/dmz-v-x/Three-Tier-MERN-Stack-Application-Deployment-with-DevOps'
            }
        }

        stage('Create Backend Infrastructure') {
            steps {
                withAWS(credentials: 'aws-credentials', region: env.AWS_REGION) {
                    script {
                        // Create S3 bucket
                        sh """
                            echo "Creating S3 bucket for Terraform state..."
                            aws s3api create-bucket \
                                --bucket ${env.BACKEND_BUCKET} \
                                --region ${env.AWS_REGION} \
                                --create-bucket-configuration LocationConstraint=${env.AWS_REGION}
                            
                            # Enable versioning
                            aws s3api put-bucket-versioning \
                                --bucket ${env.BACKEND_BUCKET} \
                                --versioning-configuration Status=Enabled
                            
                            # Enable encryption
                            aws s3api put-bucket-encryption \
                                --bucket ${env.BACKEND_BUCKET} \
                                --server-side-encryption-configuration '{
                                    "Rules": [{
                                        "ApplyServerSideEncryptionByDefault": {
                                            "SSEAlgorithm": "AES256"
                                        }
                                    }]
                                }'
                            
                            # Block public access
                            aws s3api put-public-access-block \
                                --bucket ${env.BACKEND_BUCKET} \
                                --public-access-block-configuration \
                                    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
                        """

                        // Create DynamoDB table
                        sh """
                            echo "Creating DynamoDB table for state locking..."
                            aws dynamodb create-table \
                                --table-name ${env.DYNAMODB_TABLE} \
                                --attribute-definitions AttributeName=LockID,AttributeType=S \
                                --key-schema AttributeName=LockID,KeyType=HASH \
                                --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
                        """
                    }
                }
            }
            // Add error handling for cases where resources might already exist
            post {
                failure {
                    script {
                        echo "Backend infrastructure creation failed. This might be because resources already exist."
                        // Continue pipeline even if creation fails (resources might already exist)
                        currentBuild.result = 'SUCCESS'
                    }
                }
            }
        }

        stage('Terraform Init') {
            steps {
                withAWS(credentials: 'aws-credentials', region: env.AWS_REGION) {
                    dir(env.TERRAFORM_DIR) {
                        sh 'terraform init'
                    }
                }
            }
        }

        stage('Terraform Format') {
            steps {
                dir(env.TERRAFORM_DIR) {
                    sh 'terraform fmt -check'
                }
            }
        }

        stage('Terraform Validate') {
            steps {
                dir(env.TERRAFORM_DIR) {
                    sh 'terraform validate'
                }
            }
        }

        stage('Terraform Action') {
            steps {
                withAWS(credentials: 'aws-credentials', region: env.AWS_REGION) {
                    dir(env.TERRAFORM_DIR) {
                        script {
                            switch(params.Terraform_Action) {
                                case 'plan':
                                    sh 'terraform plan'
                                    break
                                case 'apply':
                                    sh 'terraform apply -auto-approve'
                                    break
                                case 'destroy':
                                    input message: 'Are you sure you want to destroy the infrastructure?', ok: 'Destroy'
                                    sh 'terraform destroy -auto-approve'
                                    break
                                default:
                                    error "Invalid Terraform action: ${params.Terraform_Action}"
                            }
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo "Infrastructure ${params.Terraform_Action} completed successfully!"
        }
        failure {
            echo "Infrastructure ${params.Terraform_Action} failed!"
        }
    }
}
