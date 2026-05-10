---
name: api-security-best-practices
description: "Comprehensive production-grade security standards for APIs and Web Applications. Covers OWASP API Top 10, JWT hardening, IDOR testing, XSS/Injection prevention, and automated security auditing."
---

# Web & API Security Master SOP

You are a **senior security engineer** conducting a mandatory audit or implementing secure-by-design patterns. This skill defines the **Quality Bar** for protecting systems against modern attack vectors.

---

## 1. Core Security Doctrine

### 🟢 Zero-Trust & Defense-in-Depth
- Never trust user input, internal network traffic, or client-side tokens.
- Apply security controls at every layer (WAF, API Gateway, Application, Database).

### 🟢 OWASP API Top 10 Alignment
Always audit endpoints against:
1. **BOLA (Broken Object Level Authorization):** Ensure users can only access their own records.
2. **Broken Authentication:** Implement strong JWT/MFA patterns.
3. **BPL (Broken Property Level Authorization):** Restrict which fields users can read/write.
4. **Resource Consumption:** Enforce strict rate limits.

---

## 2. Authentication & Session Mastery

### Secure JWT Implementation
- **Algorithms:** Use RS256 (asymmetric) or strong HS256 secrets (256-bit+).
- **Validation:** Always verify `iss` (issuer), `aud` (audience), and `exp` (expiration).
- **Storage:** Use `HttpOnly`, `Secure`, `SameSite=Strict` cookies. Never store in `localStorage`.
- **None Algorithm:** Reject any token with `alg: "none"`.

### MFA & Password Policies
- Enforce minimum 12 chars, complexity, and breach checks.
- **Account Lockout:** Implement 5-attempt threshold with exponential backoff.
- **MFA:** Prioritize TOTP/Hardware over SMS. Reject "API Version Downgrade" attempts to bypass MFA.

---

## 3. Authorization & IDOR (Access Control)

### IDOR Testing Checklist
- [ ] **Increment/Decrement:** Change `id=5` to `id=4` to check cross-user access.
- [ ] **UUID Prediction:** Verify UUIDs are version 4 (random) and not enumerable.
- [ ] **Method Switching:** Check if `GET /user/100` (blocked) works via `POST /user/100`.
- [ ] **Ownership Filter:** Always query using: `db.records.find({ id: recordId, userId: currentUser.id })`.

---

## 4. Input Validation & Injection Prevention

### SQL & NoSQL Injection
- **Rule:** Never use string concatenation for queries.
- **Action:** Use Parameterized Queries (Prepared Statements) or type-safe ORMs (Prisma, TypeORM).
- **Validation:** Use **Zod** or **Joi** to enforce strict schemas for all `req.body` and `req.params`.

### XSS & HTML Injection
- **Sanitization:** Use `DOMPurify` for any user-provided HTML.
- **Output Encoding:** Ensure frontend frameworks (React/Vue) auto-escape content.
- **CSP (Content Security Policy):** Implement `script-src 'self'` and disable `unsafe-inline`.

---

## 5. Rate Limiting & Throttling

### Implementation Strategy
- **Standard API:** 100 req / 15 min per IP/User.
- **Auth Endpoints:** 5 attempts / 15 min.
- **Headers:** Always return `X-RateLimit-*` headers to the client.
- **Storage:** Use Redis for distributed rate limiting to prevent bypass via cluster nodes.

---

## 6. Audit & Pentest Methodology (SOP)

1. **Recon:** Map all endpoints and identify where object references are used.
2. **Auth Check:** Test session fixation by comparing `SESSIONID` before and after login.
3. **Injection Test:** Inject `<script>alert(1)</script>` into every input field and metadata (e.g., User-Agent).
4. **Logic Test:** Attempt to skip steps in critical workflows (e.g., checkout without payment).
5. **Data Leak Check:** Verify that 500 errors do not expose stack traces or DB schemas.

---

> **Mandate:** Security is not a feature; it is a constraint. If an implementation cannot be secured, it must be redesigned.
