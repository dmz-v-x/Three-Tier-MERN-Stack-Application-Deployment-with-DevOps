1. Using CI/CD (using Jenkins and ArgoCD). This MERN Stack Application will be deployed in EKS Cluster. That's within a private VPC. We will not be creating anything manually. We will setup everything using Terraform

2. Part 1 --> Automated Infrastructure

So firstly we will launch a EC2 instance, this is going to be manual, We are going to setup EC2 instance on AWS Cloud. And Within this EC2 instance we are going to install terraform, Jenkins.
Where using Jenkins we will run the terraform scripts. And this script will create a private vpc on AWS. And within this VPC we will have a EKS cluster. With two nodes (worker node 1, worker node 2). Along with a jump server, where this jump server will be useful for us to connect to the eks cluster. To Perform any administrative activities on the EKS cluster. So no one will have access to this EKS cluster, except the jump server.

3. Part 2 --> CI/CD

In the Part 2 we will implement a comprehensive CI/CD using Jenkins and ArgoCD. In the Jenkins CI part we are going to have multiple stages.
First we will checkout the code from the github repository. This github repository has the application code.
Then we will perform the code quality analysis on the code then we will run the dependency checks using OWASP and then we will run file scanning, we will create a docker image. Then we will push the created docker image on to the ecr (private container registry) instead of using dockerhub. Then we will perform docker image scanning, (container image scanning) using trivy and then finally we will update the new version that is pushed to ECR onto the kubernetes manifest. So the kubernetes manifest will be updated to the newer versions. We will be running code quality scanning using sonar where we will do the sonar scanning and gating.

Once CI is done we will take that kubernetes manifest and we are going to deploy them onto the EKS cluster using argocd

4. Part 3 --> Monitoring

Then in the third part. We will see first how to use a custom domain, how to integrate that with Route53 of AWS. Then we will setup Prometheus, and we will use prometheus as a data source. To visualize the complete observability metrics using grafana

==============================================================

Demo:

1. Going to AWS EC2 and creating a Jenkins server -> using image as ubuntu t2.2xlarge instance type. The terrafrom files we have made will be executed from this jenkins server. For this Jenkins server we will use default security group

2. We will choose default VPC and for security group we need to open few ports such as 8080 for jenkins and 9000 for sonarqube. We will run Jenkins and sonarqube on that instance.

3. Storage we will provide 30

4. For IAM instance profile we will provide it with administrative access

5. After that there are a lot of thing that we need to install in our jenkins server. So for that we are going to use the user data, we can provide the bash commands or script consisting of all the softwares that we need in our ec2 instance.

so we are installing jdk(prerequisite for jenkins), jenkins itself, docker, terraform, aws-cli, sonarqube as a container, trivy.

We will do that installing all softwares using user data.

This is the best practice we can disable the ssh access to the instance, and whatever we want to install in our server we can specify that in user data and that things will get installed on the server. And if we want to connect to instance rather than using ssh we can use ssm (Session Manager) -> From AWS Console itself.

And then we will launch the instance.
sudo su ubuntu

We can also see what processes are running using sudo htop command

We can run the previleged commands either by switching to root user as sudo -i

or by adding prefix sudo before the commands that require super user previleges.

To check if required softwares are installed in our system:

-> java --version
-> jenkins --version
-> docker version
-> terraform version
-> aws s3 help -> if this shows output means aws-cli is also configured.
-> To check if sonarqube is running as a container we can do: docker ps
-> To check trivy is installed: trivy --help

6. Now we will create a pipeline from the Jenkins server to create our infrastructure.
   Copy the public ip of jenkins server:
   <ip>:8080

7. So to get the jenkins initial password for the very first time we can run command:

systemctl status jenkins.service

8. We will install suggested plugins. Now we also need to install stage view in jenkins which doesn't comes with suggested plugins so we have to install it manually.

9. create the user.

10. Now since we need to deploy infrastructure though jenkins so for that we need to install some plugins.

11. So we need to install AWS credentials plugin, pipeline: aws steps plugin

12. Now we need to store some AWS credentials and then we will add credentials to jenkins so in kind we need to select the type as AWS Credentials, And then we need to provide the access key and secret access key (we can find these access key in - iam - users - security credentials) and then click on create. The Id we provide here, the same id will be used in the jenkins pipeline. Also we can have a maximum of two access keys.

13. Now we will also configure Terraform for our jenkins server.
    So go to Manage Jenkins -> Tools -> we will not be able to find terraform because we have not installed the terraform plugin.
    So we will install Terraform plugin and then under tools terraform option will be available there and we can configure it.

Now since terraform is installed in our machine already we don't need to install it again and again we can go to the ec2 instance and find where exactly the terraform is located by running command:

whereis terraform

and then provide the location of the binary to the terrafrom.And the location of the directory will usually be /usr/bin/terrafrom --> then we can click on apply and save.

14. Now we will create a pipeline job named as Create-Infrastructure-Job

So in the pipeline job we have set it up in such a way that we provided our the pipeline with the aws cred and the github repo where our infrastructure code terraform code is situated and thus jenkins will provision our infrastructure.

For different environments we will require different .tfvars file according to the environment. With environment specific configurations. Also we will require a different state file.

Q1 -> When to use chdir in terraform commands
Q2 -> Do we have to specify the terraform.tfvars file or is it automatically picked up, is it the same with dev.tfvars or some other files prod.tfvars?

15. WE will install another plugin called stage-view from plugins.

16. Now we will create Jump server, so our cluster and worker nodes will be private, now there may be instances when we need to access our eks cluster like when we need to update kubeconfig file by running aws eks update kubeconfig. That will update the context of kubernetes. So we can't access private cluster outside of vpc (because of security issues). Now that jump server will be in same vpc and using this jump server we will connect to the vpc. Now we will restrict access to the jump server so that only people who need access to the eks cluster can access the jump server.

we will put our jump server in the public subnet.

17. Now we will create a Jump server EC2 instance as:

-> Name: Jump Server
-> Image: Ubuntu 22.04
-> Instance type: t2.medium
-> vpc: dev-medium-vpc in public subnet.
-> memory: 30
-> Adminstrative Access.
-> Few Things we need to install in our jump server as:

---> AWS-CLI 2. Installing Kubectl 3. Install Helm 4. Install eksctl

And now we will have two EC2 instance one is for jump server and another is for jenkins server.

Again we will use user data to automate the process rather than manually sshing to instance and then installing manually

When using SSM agent we first need to switch to ubuntu user.
Using command: sudo su ubuntu.

Now we can check if the services are installed or not:
aws --version
kubectl version
eksctl
helm

===============================================================

Now we will first login to jenkins server using ssm.

1. And we will configure the aws using aws configure command in this jenkins server. It won't give us any error

aws configure.

Apart from the jump server we will not be able to access the kubernetes cluster (eks cluster).

Then we will update the kube config file in the jenkins server as:

aws eks update-kubeconfig --name <cluster-name> --region <region-name>

Next we will install the kubectl as

sudo apt update
sudo curl -LO "https://dl.k8s.io/release/v1.28.4/bin/linux/amd64/kubectl"
sudo chmod+x kubectl
sudo mv kubectl /user/local/bin/

this will install the kubectl now if we do:

kubectl get nodes (This will time out) in Jenkins server ec2 instance.

2. Now we will do the same thing in the Jump server as:

--> aws configure

--> now we will do
aws eks update-kubeconfig --name <cluster-name> --region <region-name>

as kubectl is alredy installed in our machine.

and now we will run:
kubectl get nodes

and we can see the nodes.

Okay so we have setup our kubernetes server and the jump server.

===============================================================

Now the next thing is we will configure the AWSLoadBalancerController and argocd in the same from the jump server.

So what we are tring to do is that: Eks cluster is a kubernetes cluster and within the kubernetes cluster we have pods running for example we have the ingress controller running and now how will the pods running inside the eks cluster, that is a ingress controller pod create a load balancer that is another aws resource, for that what we need to do is we need to tie up the service account of the pod with a iam user or a iam role, In this case we use a iam role and we will use policy and using policy we will grant permission to kubernetes pod so that it can using that service account create a load balancer. so basically we are tying up the concept of kubernetes with the iam.

1. So first of all to create or configure a AWSLoadBalancer we need to have a service account it will create a load balancer and even before that we need to we need to download the iam-policy.json file we can do that using command:

curl -O https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.5.4/docs/install/iam_policy.json

eksctl create iamserviceaccount --cluster=<cluster-name> --namespace=kube-system --name=aws-load-blancer-controller --role-name AmazonEKSLoadBalancerControllerRole --attach-policy-arn=arn:aws:iam::<account-id>:policy/AWSLoadBalancerControllerIAMPolicy --approve --region=<region-name>

Now if we do:

kubectl get sa -n kube-system

we can see the aws-load-balancer-controller

2. Next we will need to add the helm repository for eks
   using helm we will deploy the ingress controller and the argocd

-> helm repo add eks https://aws.github.io/eks-charts

-> helm install aws-load-balancer-controller eks aws-load-balancer-controller -n kube-system --set clusterName=<cluster-name> --set serviceAccount.create=galse --set serviceAccount.name=aws-load-balancer-controller.

Now if we run
kubectl get deployment -n kube-system aws-load-balancer-controller

we can see 2/2 ready state

--> Now we will create a namespace for argocd

kubectl create namespace argocd

Now we will apply the argocd manifest files directly from github as:

kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/v2.4.7/manifests/install.yaml

This will create all the resources we need.

We can see all the resources created using:
kubectl get all -n argocd.

--> Now we need to expose the argocd so that we can access the argocd. so we will use the LoadBalancer type instead of nodeport.

So we need to the change the service tpe of the service argocd as:

kubectl get svc -n argocd

kubectl edit svc argocd-server -n argocd
After running this command change the type from clusterIp to LoadBalancer we can save and exit from vim.

This will create the load balancer for us. This load balancer is created by ccm component of the eks cluster. It is not created by the load balancer component we have created.

Now using the dns name of the load balancer we can access the argocd ui

--> Now we can fetch the password of the argocd, the username is admin

Now to fetch the password:

--> kubectl get secrets -n argocd
--> kubectl edit secret argocd-initial-admin-secret -n argocd

we will get the password from here and we need to decode it:

echo <password> | base64 --decode

This will give us the actual password and we can paste it in argocd ui and we can login to argocd.

So Now the complete infrastructure setup part is done.

===============================================================

1. Now we need to configure our sonarqube. It is running as a docker container on port 9000

So we need to fetch our Ec2 instance ip as:
curl ifconfig.me
Running curl ifconfig.me from a machine will return the public IP address that the machine is using to access the internet.

and then: <ip>:9000
This will open the sonarqube ui and we can login to it using:

so both username and password for soanrqube is admin and admin

We can now create the new password.

Now we need to setup few rules.

2. Now first of all we need to generate a token for it. So that jenkins is able to connect to the sonarqube.

Go to administration section -> security -> users -> update token(hamburger sign) -> provide a name and expires in -> generate.

This will generate the token

3. Next we will create a webhook in sonarqube. why? -->
   Webhook are used to notify external services (in our case jenkins) when a project analysis is done. An HTTP POST request including a JSON payload is sent to each of the provided URLs.

configuration --> webhook --> create --> give a name --> for url --> it will be jenkins url as:
http://<ip>:8080/sonarqube-webhook/ --> create

4. Now we need to create a project --> Here it will fetch all the code and do all the code quality analysis on that particular fetched code.

Projects -> Manually -> Provide project display name (Frontend) --> main brach --> Set up --> Locally --> use existing token and paste the generated token --> continue --> select the other for js code --> os is linux --> now copy the script this we will provide in the jenkins

Again same step for the backend project.

5. Now next step is store all the credentials and tokens in the jenkins.

so in jenkins:

Dashboard -> Manage Jenkins -> Credentials -> System -> Global Credentials

Give name: Secret text
Scope: Global
Secret: Provide the sonarqube token
id: sonar-token
Generate

Now next secret is for account id of the aws:

Kind: Secret text
Scope: Global
Secret: AWS account ID
ID: Account_ID
Generate

Now we will create the ecr repository through the AWS account. To store our frontend and backend docker images.

Go to ECR -> Crete Repo -> private -> Name (Frontend) -> create

Go to ECR -> Crete Repo -> private -> Name (Backend) -> create

Now in Jenkins in Credentials:

Kind: Secret Text
Scope: Global
Secret: Frontend
ID: ECR_REPO1
Create

Kind: Secret Text
Scope: Global
Secret: Backend
ID: ECR_REPO1
Create

Using this we will push docker images to the ecr forntend image to frontend ecr repo, backend image to backend ecr repo.

Now we need to update the tag of the aws repository in the kubernetes manifest files so for that we need to push the tag changes to the repository. For that we need to have github credentials in Jenkins.

kind: Username with password
Scope: Global
Username:github username
password: personal access token
id: GITHUB_APP
Create

6. Now we need to install few plugins.

docker: this plugin integrates Jenkins with Docker
docker pipeline: Build and use Docker containers from pipelines.
Docker Commons: Provides the common shared functionality for various Docker-related plugins.
Docker API: This plugin provides docker-java api for other plugins.
Nodejs
OWASP Dependency-Check: This plugin can independently execute a Dependency-Check analysis and visualize results.
SonarQube Scanner

--> Install

We will install these plugins.

7. Now plugins have been installed and we need to configure all the tools by going to tools section.

-> First one is NodeJS -> Search for nodejs in the Jenkins and Add NodeJS -> Provide a name -> select a version

-> Next we will install sonarqube --> Add sonarqube scanner -> Provide the name

-> After that we are going to configure the Dependency Check -> Add dependency check -> provide a name -> Automatic installation -> INstall from github.com

-> The next thing will be docker -> provide the name -> Install automatically.

That's all for the configuration-> Apply and save.

8. We have not configured the webhook from jenkins to the sonarqube so we need to do that we will do to

system (in jenkins) -> search for sonar (in sonarqube servers) -> Add sonarqube installation -> provide name as (sonar-server) -> we will provide the server url for the sonarqube as http://<ip of jenkins server>:9000 -> provide the sonarqube token -> click apply and save.

9. Now we will create the first pipeline. For frontend.
   Name: Three-tier-frontend -> pipeline -> ok
