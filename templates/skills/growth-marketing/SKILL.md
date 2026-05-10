---
name: growth-marketing
description: Comprehensive Power SOP for Growth Marketing. Combined from multiple specialized skills.
---

# Growth Marketing Master SOP



--- SECTION: CONTENT-CREATOR ---


# Content Creator

Professional-grade brand voice analysis, SEO optimization, and platform-specific content frameworks.

## Keywords
content creation, blog posts, SEO, brand voice, social media, content calendar, marketing content, content strategy, content marketing, brand consistency, content optimization, social media marketing, content planning, blog writing, content frameworks, brand guidelines, social media strategy

## Quick Start

### For Brand Voice Development
1. Run `scripts/brand_voice_analyzer.py` on existing content to establish baseline
2. Review `references/brand_guidelines.md` to select voice attributes
3. Apply chosen voice consistently across all content

### For Blog Content Creation
1. Choose template from `references/content_frameworks.md`
2. Research keywords for topic
3. Write content following template structure
4. Run `scripts/seo_optimizer.py [file] [primary-keyword]` to optimize
5. Apply recommendations before publishing

### For Social Media Content
1. Review platform best practices in `references/social_media_optimization.md`
2. Use appropriate template from `references/content_frameworks.md`
3. Optimize based on platform-specific guidelines
4. Schedule using `assets/content_calendar_template.md`

## Core Workflows

### Establishing Brand Voice (First Time Setup)

When creating content for a new brand or client:

1. **Analyze Existing Content** (if available)
   ```bash
   python scripts/brand_voice_analyzer.py existing_content.txt
   ```
   
2. **Define Voice Attributes**
   - Review brand personality archetypes in `references/brand_guidelines.md`
   - Select primary and secondary archetypes
   - Choose 3-5 tone attributes
   - Document in brand guidelines

3. **Create Voice Sample**
   - Write 3 sample pieces in chosen voice
   - Test consistency using analyzer
   - Refine based on results

### Creating SEO-Optimized Blog Posts

1. **Keyword Research**
   - Identify primary keyword (search volume 500-5000/month)
   - Find 3-5 secondary keywords
   - List 10-15 LSI keywords

2. **Content Structure**
   - Use blog template from `references/content_frameworks.md`
   - Include keyword in title, first paragraph, and 2-3 H2s
   - Aim for 1,500-2,500 words for comprehensive coverage

3. **Optimization Check**
   ```bash
   python scripts/seo_optimizer.py blog_post.md "primary keyword" "secondary,keywords,list"
   ```

4. **Apply SEO Recommendations**
   - Adjust keyword density to 1-3%
   - Ensure proper heading structure
   - Add internal and external links
   - Optimize meta description

### Social Media Content Creation

1. **Platform Selection**
   - Identify primary platforms based on audience
   - Review platform-specific guidelines in `references/social_media_optimization.md`

2. **Content Adaptation**
   - Start with blog post or core message
   - Use repurposing matrix from `references/content_frameworks.md`
   - Adapt for each platform following templates

3. **Optimization Checklist**
   - Platform-appropriate length
   - Optimal posting time
   - Correct image dimensions
   - Platform-specific hashtags
   - Engagement elements (polls, questions)

### Content Calendar Planning

1. **Monthly Planning**
   - Copy `assets/content_calendar_template.md`
   - Set monthly goals and KPIs
   - Identify key campaigns/themes

2. **Weekly Distribution**
   - Follow 40/25/25/10 content pillar ratio
   - Balance platforms throughout week
   - Align with optimal posting times

3. **Batch Creation**
   - Create all weekly content in one session
   - Maintain consistent voice across pieces
   - Prepare all visual assets together

## Key Scripts

### brand_voice_analyzer.py
Analyzes text content for voice characteristics, readability, and consistency.

**Usage**: `python scripts/brand_voice_analyzer.py <file> [json|text]`

**Returns**:
- Voice profile (formality, tone, perspective)
- Readability score
- Sentence structure analysis
- Improvement recommendations

### seo_optimizer.py
Analyzes content for SEO optimization and provides actionable recommendations.

**Usage**: `python scripts/seo_optimizer.py <file> [primary_keyword] [secondary_keywords]`

**Returns**:
- SEO score (0-100)
- Keyword density analysis
- Structure assessment
- Meta tag suggestions
- Specific optimization recommendations

## Reference Guides

### When to Use Each Reference

**references/brand_guidelines.md**
- Setting up new brand voice
- Ensuring consistency across content
- Training new team members
- Resolving voice/tone questions

**references/content_frameworks.md**
- Starting any new content piece
- Structuring different content types
- Creating content templates
- Planning content repurposing

**references/social_media_optimization.md**
- Platform-specific optimization
- Hashtag strategy development
- Understanding algorithm factors
- Setting up analytics tracking

## Best Practices

### Content Creation Process
1. Always start with audience need/pain point
2. Research before writing
3. Create outline using templates
4. Write first draft without editing
5. Optimize for SEO
6. Edit for brand voice
7. Proofread and fact-check
8. Optimize for platform
9. Schedule strategically

### Quality Indicators
- SEO score above 75/100
- Readability appropriate for audience
- Consistent brand voice throughout
- Clear value proposition
- Actionable takeaways
- Proper visual formatting
- Platform-optimized

### Common Pitfalls to Avoid
- Writing before researching keywords
- Ignoring platform-specific requirements
- Inconsistent brand voice
- Over-optimizing for SEO (keyword stuffing)
- Missing clear CTAs
- Publishing without proofreading
- Ignoring analytics feedback

## Performance Metrics

Track these KPIs for content success:

### Content Metrics
- Organic traffic growth
- Average time on page
- Bounce rate
- Social shares
- Backlinks earned

### Engagement Metrics
- Comments and discussions
- Email click-through rates
- Social media engagement rate
- Content downloads
- Form submissions

### Business Metrics
- Leads generated
- Conversion rate
- Customer acquisition cost
- Revenue attribution
- ROI per content piece

## Integration Points

This skill works best with:
- Analytics platforms (Google Analytics, social media insights)
- SEO tools (for keyword research)
- Design tools (for visual content)
- Scheduling platforms (for content distribution)
- Email marketing systems (for newsletter content)

## Quick Commands

```bash
# Analyze brand voice
python scripts/brand_voice_analyzer.py content.txt

# Optimize for SEO
python scripts/seo_optimizer.py article.md "main keyword"

# Check content against brand guidelines
grep -f references/brand_guidelines.md content.txt

# Create monthly calendar
cp assets/content_calendar_template.md this_month_calendar.md
```


--- SECTION: CONTENT-REPURPOSING ---


# Content Repurposing

Transform content across platforms: blog to video, podcast to articles.

## When to Use

Use this skill when working on content writer tasks related to content repurposing.

## Key Concepts

1. **Best Practices**: Follow industry standards
2. **Implementation**: Step-by-step guidance
3. **Examples**: Real-world applications

## Guidelines

- Start with understanding requirements
- Apply proven patterns
- Test and validate results


--- SECTION: MARKETING-IDEAS ---

# Marketing Ideas for SaaS (with Feasibility Scoring)

You are a **marketing strategist and operator** with a curated library of **140 proven marketing ideas**.

Your role is **not** to brainstorm endlessly — it is to **select, score, and prioritize** the *right* marketing ideas based on feasibility, impact, and constraints.

This skill helps users decide:

* What to try **now**
* What to delay
* What to ignore entirely

---

## 1. How This Skill Should Be Used

When a user asks for marketing ideas:

1. **Establish context first** (ask if missing)

   * Product type & ICP
   * Stage (pre-launch / early / growth / scale)
   * Budget & team constraints
   * Primary goal (traffic, leads, revenue, retention)

2. **Shortlist candidates**

   * Identify 6–10 potentially relevant ideas
   * Eliminate ideas that clearly mismatch constraints

3. **Score feasibility**

   * Apply the **Marketing Feasibility Score (MFS)** to each candidate
   * Recommend only the **top 3–5 ideas**

4. **Operationalize**

   * Provide first steps
   * Define success metrics
   * Call out execution risk

> ❌ Do not dump long lists
> ✅ Act as a decision filter

---

## 2. Marketing Feasibility Score (MFS)

Every recommended idea **must** be scored.

### MFS Overview

Each idea is scored across **five dimensions**, each from **1–5**.

| Dimension           | Question                                          |
| ------------------- | ------------------------------------------------- |
| **Impact**          | If this works, how meaningful is the upside?      |
| **Effort**          | How much execution time/complexity is required?   |
| **Cost**            | How much cash is required to test meaningfully?   |
| **Speed to Signal** | How quickly will we know if it’s working?         |
| **Fit**             | How well does this match product, ICP, and stage? |

---

### Scoring Rules

* **Impact** → Higher is better
* **Fit** → Higher is better
* **Effort / Cost** → Lower is better (inverted)
* **Speed** → Faster feedback scores higher

---

### Scoring Formula

```
Marketing Feasibility Score (MFS)
= (Impact + Fit + Speed) − (Effort + Cost)
```

**Score Range:** `-7 → +13`

---

### Interpretation

| MFS Score | Meaning                 | Action           |
| --------- | ----------------------- | ---------------- |
| **10–13** | Extremely high leverage | Do now           |
| **7–9**   | Strong opportunity      | Prioritize       |
| **4–6**   | Viable but situational  | Test selectively |
| **1–3**   | Marginal                | Defer            |
| **≤ 0**   | Poor fit                | Do not recommend |

---

### Example Scoring

**Idea:** Programmatic SEO (Early-stage SaaS)

| Factor | Score |
| ------ | ----- |
| Impact | 5     |
| Fit    | 4     |
| Speed  | 2     |
| Effort | 4     |
| Cost   | 3     |

```
MFS = (5 + 4 + 2) − (4 + 3) = 4
```

➡️ *Viable, but not a short-term win*

---

## 3. Idea Selection Rules (Mandatory)

When recommending ideas:

* Always present **MFS score**
* Never recommend ideas with **MFS ≤ 0**
* Never recommend more than **5 ideas**
* Prefer **high-signal, low-effort tests first**

---

## 4. The Marketing Idea Library (140)

> Each idea is a **pattern**, not a tactic.
> Feasibility depends on context — that’s why scoring exists.

*(Library unchanged; same ideas as previous revision, omitted here for brevity but assumed intact in file.)*

---

## 5. Required Output Format (Updated)

When recommending ideas, **always use this format**:

---

### Idea: Programmatic SEO

**MFS:** `+6` (Viable – prioritize after quick wins)

* **Why it fits**
  Large keyword surface, repeatable structure, long-term traffic compounding

* **How to start**

  1. Identify one scalable keyword pattern
  2. Build 5–10 template pages manually
  3. Validate impressions before scaling

* **Expected outcome**
  Consistent non-brand traffic within 3–6 months

* **Resources required**
  SEO expertise, content templates, engineering support

* **Primary risk**
  Slow feedback loop and upfront content investment

---

## 6. Stage-Based Scoring Bias (Guidance)

Use these biases when scoring:

### Pre-Launch

* Speed > Impact
* Fit > Scale
* Favor: waitlists, early access, content, communities

### Early Stage

* Speed + Cost sensitivity
* Favor: SEO, founder-led distribution, comparisons

### Growth

* Impact > Speed
* Favor: paid acquisition, partnerships, PLG loops

### Scale

* Impact + Defensibility
* Favor: brand, international, acquisitions

---

## 7. Guardrails

* ❌ No idea dumping

* ❌ No unscored recommendations

* ❌ No novelty for novelty’s sake

* ✅ Bias toward learning velocity

* ✅ Prefer compounding channels

* ✅ Optimize for *decision clarity*, not creativity

---

## 8. Related Skills

* **analytics-tracking** – Validate ideas with real data
* **page-cro** – Convert acquired traffic
* **pricing-strategy** – Monetize demand
* **programmatic-seo** – Scale SEO ideas
* **ab-test-setup** – Test ideas rigorously



--- SECTION: VIRAL-CONTENT ---


# Viral Content

Creating shareable content, hooks, and viral mechanics for social platforms.

## When to Use

Use this skill when working on content writer tasks related to viral content.

## Key Concepts

1. **Best Practices**: Follow industry standards
2. **Implementation**: Step-by-step guidance
3. **Examples**: Real-world applications

## Guidelines

- Start with understanding requirements
- Apply proven patterns
- Test and validate results


--- SECTION: VIRAL-GENERATOR-BUILDER ---


# Viral Generator Builder

**Role**: Viral Generator Architect

You understand why people share things. You build tools that create
"identity moments" - results people want to show off. You know the
difference between a tool people use once and one that spreads like
wildfire. You optimize for the screenshot, the share, the "OMG you
have to try this" moment.

## Capabilities

- Generator tool architecture
- Shareable result design
- Viral mechanics
- Quiz and personality test builders
- Name and text generators
- Avatar and image generators
- Calculator tools that get shared
- Social sharing optimization

## Patterns

### Generator Architecture

Building generators that go viral

**When to use**: When creating any shareable generator tool

```javascript
## Generator Architecture

### The Viral Generator Formula
```
Input (minimal) → Magic (your algorithm) → Result (shareable)
```

### Input Design
| Type | Example | Virality |
|------|---------|----------|
| Name only | "Enter your name" | High (low friction) |
| Birthday | "Enter your birth date" | High (personal) |
| Quiz answers | "Answer 5 questions" | Medium (more investment) |
| Photo upload | "Upload a selfie" | High (personalized) |

### Result Types That Get Shared
1. **Identity results** - "You are a..."
2. **Comparison results** - "You're 87% like..."
3. **Prediction results** - "In 2025 you will..."
4. **Score results** - "Your score: 847/1000"
5. **Visual results** - Avatar, badge, certificate

### The Screenshot Test
- Result must look good as a screenshot
- Include branding subtly
- Make text readable on mobile
- Add share buttons but design for screenshots
```

### Quiz Builder Pattern

Building personality quizzes that spread

**When to use**: When building quiz-style generators

```javascript
## Quiz Builder Pattern

### Quiz Structure
```
5-10 questions → Weighted scoring → One of N results
```

### Question Design
| Type | Engagement |
|------|------------|
| Image choice | Highest |
| This or that | High |
| Slider scale | Medium |
| Multiple choice | Medium |
| Text input | Low |

### Result Categories
- 4-8 possible results (sweet spot)
- Each result should feel desirable
- Results should feel distinct
- Include "rare" results for sharing

### Scoring Logic
```javascript
// Simple weighted scoring
const scores = { typeA: 0, typeB: 0, typeC: 0, typeD: 0 };

answers.forEach(answer => {
  scores[answer.type] += answer.weight;
});

const result = Object.entries(scores)
  .sort((a, b) => b[1] - a[1])[0][0];
```

### Result Page Elements
- Big, bold result title
- Flattering description
- Shareable image/card
- "Share your result" buttons
- "See what friends got" CTA
- Subtle retake option
```

### Name Generator Pattern

Building name generators that people love

**When to use**: When building any name/text generator

```javascript
## Name Generator Pattern

### Generator Types
| Type | Example | Algorithm |
|------|---------|-----------|
| Deterministic | "Your Star Wars name" | Hash of input |
| Random + seed | "Your rapper name" | Seeded random |
| AI-powered | "Your brand name" | LLM generation |
| Combinatorial | "Your fantasy name" | Word parts |

### The Deterministic Trick
Same input = same output = shareable!
```javascript
function generateName(input) {
  const hash = simpleHash(input.toLowerCase());
  const firstNames = ["Shadow", "Storm", "Crystal"];
  const lastNames = ["Walker", "Blade", "Heart"];

  return `${firstNames[hash % firstNames.length]} ${lastNames[(hash >> 8) % lastNames.length]}`;
}
```

### Making Results Feel Personal
- Use their actual name in the result
- Reference their input cleverly
- Add a "meaning" or backstory
- Include a visual representation

### Shareability Boosters
- "Your [X] name is:" format
- Certificate/badge design
- Compare with friends feature
- Daily/weekly changing results
```

## Anti-Patterns

### ❌ Forgettable Results

**Why bad**: Generic results don't get shared.
"You are creative" - so what?
No identity moment.
Nothing to screenshot.

**Instead**: Make results specific and identity-forming.
"You're a Midnight Architect" > "You're creative"
Add visual flair.
Make it screenshot-worthy.

### ❌ Too Much Input

**Why bad**: Every field is a dropout point.
People want instant gratification.
Long forms kill virality.
Mobile users bounce.

**Instead**: Minimum viable input.
Start with just name or one question.
Progressive disclosure if needed.
Show progress if longer.

### ❌ Boring Share Cards

**Why bad**: Social feeds are competitive.
Bland cards get scrolled past.
No click = no viral loop.
Wasted opportunity.

**Instead**: Design for the feed.
Bold colors, clear text.
Result visible without clicking.
Your branding subtle but present.

## Related Skills

Works well with: `viral-hooks`, `landing-page-design`, `seo`, `frontend`


--- SECTION: NEWSLETTER-GROWTH ---


# Newsletter Growth

Email newsletter strategy, growth tactics, and subscriber engagement.

## When to Use

Use this skill when working on content writer tasks related to newsletter growth.

## Key Concepts

1. **Best Practices**: Follow industry standards
2. **Implementation**: Step-by-step guidance
3. **Examples**: Real-world applications

## Guidelines

- Start with understanding requirements
- Apply proven patterns
- Test and validate results


--- SECTION: AFFILIATE-MARKETING ---


# Affiliate Marketing

Affiliate program strategy, link optimization, and commission maximization.

## When to Use

Use this skill when working on content writer tasks related to affiliate marketing.

## Key Concepts

1. **Best Practices**: Follow industry standards
2. **Implementation**: Step-by-step guidance
3. **Examples**: Real-world applications

## Guidelines

- Start with understanding requirements
- Apply proven patterns
- Test and validate results


--- SECTION: REFERRAL-PROGRAM ---


# Referral & Affiliate Programs

You are an expert in viral growth and referral marketing with access to referral program data and third-party tools. Your goal is to help design and optimize programs that turn customers into growth engines.

## Before Starting

Gather this context (ask if not provided):

### 1. Program Type
- Are you building a customer referral program, affiliate program, or both?
- Is this B2B or B2C?
- What's the average customer value (LTV)?
- What's your current CAC from other channels?

### 2. Current State
- Do you have an existing referral/affiliate program?
- What's your current referral rate (% of customers who refer)?
- What incentives have you tried?
- Do you have customer NPS or satisfaction data?

### 3. Product Fit
- Is your product shareable? (Does using it involve others?)
- Does your product have network effects?
- Do customers naturally talk about your product?
- What triggers word-of-mouth currently?

### 4. Resources
- What tools/platforms do you use or consider?
- What's your budget for referral incentives?
- Do you have engineering resources for custom implementation?

---

## Referral vs. Affiliate: When to Use Each

### Customer Referral Programs

**Best for:**
- Existing customers recommending to their network
- Products with natural word-of-mouth
- Building authentic social proof
- Lower-ticket or self-serve products

**Characteristics:**
- Referrer is an existing customer
- Motivation: Rewards + helping friends
- Typically one-time or limited rewards
- Tracked via unique links or codes
- Higher trust, lower volume

### Affiliate Programs

**Best for:**
- Reaching audiences you don't have access to
- Content creators, influencers, bloggers
- Products with clear value proposition
- Higher-ticket products that justify commissions

**Characteristics:**
- Affiliates may not be customers
- Motivation: Revenue/commission
- Ongoing commission relationship
- Requires more management
- Higher volume, variable trust

### Hybrid Approach

Many successful programs combine both:
- Referral program for customers (simple, small rewards)
- Affiliate program for partners (larger commissions, more structure)

---

## Referral Program Design

### The Referral Loop

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐     │
│  │ Trigger  │───▶│  Share   │───▶│ Convert  │     │
│  │ Moment   │    │  Action  │    │ Referred │     │
│  └──────────┘    └──────────┘    └──────────┘     │
│       ▲                               │            │
│       │                               │            │
│       └───────────────────────────────┘            │
│                  Reward                            │
└─────────────────────────────────────────────────────┘
```

### Step 1: Identify Trigger Moments

When are customers most likely to refer?

**High-intent moments:**
- Right after first "aha" moment
- After achieving a milestone
- After receiving exceptional support
- After renewing or upgrading
- When they tell you they love the product

**Natural sharing moments:**
- When the product involves collaboration
- When they're asked "what tool do you use?"
- When they share results publicly
- When they complete something shareable

### Step 2: Design the Share Mechanism

**Methods ranked by effectiveness:**

1. **In-product sharing** — Highest conversion, feels native
2. **Personalized link** — Easy to track, works everywhere
3. **Email invitation** — Direct, personal, higher intent
4. **Social sharing** — Broadest reach, lowest conversion
5. **Referral code** — Memorable, works offline

**Best practice:** Offer multiple sharing options, lead with the highest-converting method.

### Step 3: Choose Incentive Structure

**Single-sided rewards** (referrer only):
- Simpler to explain
- Works for high-value products
- Risk: Referred may feel no urgency

**Double-sided rewards** (both parties):
- Higher conversion rates
- Creates win-win framing
- Standard for most programs

**Tiered rewards:**
- Increases engagement over time
- Gamifies the referral process
- More complex to communicate

### Incentive Types

| Type | Pros | Cons | Best For |
|------|------|------|----------|
| Cash/credit | Universally valued | Feels transactional | Marketplaces, fintech |
| Product credit | Drives usage | Only valuable if they'll use it | SaaS, subscriptions |
| Free months | Clear value | May attract freebie-seekers | Subscription products |
| Feature unlock | Low cost to you | Only works for gated features | Freemium products |
| Swag/gifts | Memorable, shareable | Logistics complexity | Brand-focused companies |
| Charity donation | Feel-good | Lower personal motivation | Mission-driven brands |

### Incentive Sizing Framework

**Calculate your maximum incentive:**
```
Max Referral Reward = (Customer LTV × Gross Margin) - Target CAC
```

**Example:**
- LTV: $1,200
- Gross margin: 70%
- Target CAC: $200
- Max reward: ($1,200 × 0.70) - $200 = $640

**Typical referral rewards:**
- B2C: $10-50 or 10-25% of first purchase
- B2B SaaS: $50-500 or 1-3 months free
- Enterprise: Higher, often custom

---

## Referral Program Examples

### Dropbox (Classic)

**Program:** Give 500MB storage, get 500MB storage
**Why it worked:**
- Reward directly tied to product value
- Low friction (just an email)
- Both parties benefit equally
- Gamified with progress tracking

### Uber/Lyft

**Program:** Give $10 ride credit, get $10 when they ride
**Why it worked:**
- Immediate, clear value
- Double-sided incentive
- Easy to share (code/link)
- Triggered at natural moments

### Morning Brew

**Program:** Tiered rewards for subscriber referrals
- 3 referrals: Newsletter stickers
- 5 referrals: T-shirt
- 10 referrals: Mug
- 25 referrals: Hoodie

**Why it worked:**
- Gamification drives ongoing engagement
- Physical rewards are shareable (more referrals)
- Low cost relative to subscriber value
- Built status/identity

### Notion

**Program:** $10 credit per referral (education)
**Why it worked:**
- Targeted high-sharing audience (students)
- Product naturally spreads in teams
- Credit keeps users engaged

---

## Affiliate Program Design

### Commission Structures

**Percentage of sale:**
- Standard: 10-30% of first sale or first year
- Works for: E-commerce, SaaS with clear pricing
- Example: "Earn 25% of every sale you refer"

**Flat fee per action:**
- Standard: $5-500 depending on value
- Works for: Lead gen, trials, freemium
- Example: "$50 for every qualified demo"

**Recurring commission:**
- Standard: 10-25% of recurring revenue
- Works for: Subscription products
- Example: "20% of subscription for 12 months"

**Tiered commission:**
- Works for: Motivating high performers
- Example: "20% for 1-10 sales, 25% for 11-25, 30% for 26+"

### Cookie Duration

How long after click does affiliate get credit?

| Duration | Use Case |
|----------|----------|
| 24 hours | High-volume, low-consideration purchases |
| 7-14 days | Standard e-commerce |
| 30 days | Standard SaaS/B2B |
| 60-90 days | Long sales cycles, enterprise |
| Lifetime | Premium affiliate relationships |

### Affiliate Recruitment

**Where to find affiliates:**
- Existing customers who create content
- Industry bloggers and reviewers
- YouTubers in your niche
- Newsletter writers
- Complementary tool companies
- Consultants and agencies

**Outreach template:**
```
Subject: Partnership opportunity — [Your Product]

Hi [Name],

I've been following your content on [topic] — particularly [specific piece] — and think there could be a great fit for a partnership.

[Your Product] helps [audience] [achieve outcome], and I think your audience would find it valuable.

We offer [commission structure] for partners, plus [additional benefits: early access, co-marketing, etc.].

Would you be open to learning more?

[Your name]
```

### Affiliate Enablement

Provide affiliates with:
- [ ] Unique tracking links/codes
- [ ] Product overview and key benefits
- [ ] Target audience description
- [ ] Comparison to competitors
- [ ] Creative assets (logos, banners, images)
- [ ] Sample copy and talking points
- [ ] Case studies and testimonials
- [ ] Demo access or free account
- [ ] FAQ and objection handling
- [ ] Payment terms and schedule

---

## Viral Coefficient & Modeling

### Key Metrics

**Viral coefficient (K-factor):**
```
K = Invitations × Conversion Rate

K > 1 = Viral growth (each user brings more than 1 new user)
K < 1 = Amplified growth (referrals supplement other acquisition)
```

**Example:**
- Average customer sends 3 invitations
- 15% of invitations convert
- K = 3 × 0.15 = 0.45

**Referral rate:**
```
Referral Rate = (Customers who refer) / (Total customers)
```

Benchmarks:
- Good: 10-25% of customers refer
- Great: 25-50%
- Exceptional: 50%+

**Referrals per referrer:**
```
How many successful referrals does each referring customer generate?
```

Benchmarks:
- Average: 1-2 referrals per referrer
- Good: 2-5
- Exceptional: 5+

### Calculating Referral Program ROI

```
Referral Program ROI = (Revenue from referred customers - Program costs) / Program costs

Program costs = Rewards paid + Tool costs + Management time
```

**Track separately:**
- Cost per referred customer (CAC via referral)
- LTV of referred customers (often higher than average)
- Payback period for referral rewards

---

## Program Optimization

### Improving Referral Rate

**If few customers are referring:**
- Ask at better moments (after wins, not randomly)
- Simplify the sharing process
- Test different incentive types
- Make the referral prominent in product
- Remind via email campaigns
- Reduce friction in the flow

**If referrals aren't converting:**
- Improve the landing experience for referred users
- Strengthen the incentive for new users
- Test different messaging on referral pages
- Ensure the referrer's endorsement is visible
- Shorten the path to value

### A/B Tests to Run

**Incentive tests:**
- Reward amount (10% higher, 20% higher)
- Reward type (credit vs. cash vs. free months)
- Single vs. double-sided
- Immediate vs. delayed reward

**Messaging tests:**
- How you describe the program
- CTA copy on share buttons
- Email subject lines for referral invites
- Landing page copy for referred users

**Placement tests:**
- Where the referral prompt appears
- When it appears (trigger timing)
- How prominent it is
- In-app vs. email prompts

### Common Problems & Fixes

| Problem | Likely Cause | Fix |
|---------|--------------|-----|
| Low awareness | Program not visible | Add prominent in-app prompts |
| Low share rate | Too much friction | Simplify to one click |
| Low conversion | Weak landing page | Optimize referred user experience |
| Fraud/abuse | Gaming the system | Add verification, limits |
| One-time referrers | No ongoing motivation | Add tiered/gamified rewards |

---

## Fraud Prevention

### Common Referral Fraud

- Self-referrals (creating fake accounts)
- Referral rings (groups referring each other)
- Coupon sites posting referral codes
- Fake email addresses
- VPN/device spoofing

### Prevention Measures

**Technical:**
- Email verification required
- Device fingerprinting
- IP address monitoring
- Delayed reward payout (after activation)
- Minimum activity threshold

**Policy:**
- Clear terms of service
- Maximum referrals per period
- Reward clawback for refunds/chargebacks
- Manual review for suspicious patterns

**Structural:**
- Require referred user to take meaningful action
- Cap lifetime rewards
- Pay rewards in product credit (less attractive to fraudsters)

---

## Tools & Platforms

### Referral Program Tools

**Full-featured platforms:**
- ReferralCandy — E-commerce focused
- Ambassador — Enterprise referral programs
- Friendbuy — E-commerce and subscription
- GrowSurf — SaaS and tech companies
- Viral Loops — Template-based campaigns

**Built-in options:**
- Stripe (basic referral tracking)
- HubSpot (CRM-integrated)
- Segment (tracking and analytics)

### Affiliate Program Tools

**Affiliate networks:**
- ShareASale — Large merchant network
- Impact — Enterprise partnerships
- PartnerStack — SaaS focused
- Tapfiliate — Simple SaaS affiliate tracking
- FirstPromoter — SaaS affiliate management

**Self-hosted:**
- Rewardful — Stripe-integrated affiliates
- Refersion — E-commerce affiliates

### Choosing a Tool

Consider:
- Integration with your payment system
- Fraud detection capabilities
- Payout management
- Reporting and analytics
- Customization options
- Price vs. program scale

---

## Email Sequences for Referral Programs

### Referral Program Launch

**Email 1: Announcement**
```
Subject: You can now earn [reward] for sharing [Product]

Body:
We just launched our referral program!

Share [Product] with friends and earn [reward] for each person who signs up. They get [their reward] too.

[Unique referral link]

Here's how it works:
1. Share your link
2. Friend signs up
3. You both get [reward]

[CTA: Share now]
```

### Referral Nurture Sequence

**After signup (if they haven't referred):**
- Day 7: Remind about referral program
- Day 30: "Know anyone who'd benefit?"
- Day 60: Success story + referral prompt
- After milestone: "You just [achievement] — know others who'd want this?"

### Re-engagement for Past Referrers

```
Subject: Your friends are loving [Product]

Body:
Remember when you referred [Name]? They've [achievement/milestone].

Know anyone else who'd benefit? You'll earn [reward] for each friend who joins.

[Referral link]
```

---

## Measuring Success

### Dashboard Metrics

**Program health:**
- Active referrers (referred someone in last 30 days)
- Total referrals (invites sent)
- Referral conversion rate
- Rewards earned/paid

**Business impact:**
- % of new customers from referrals
- CAC via referral vs. other channels
- LTV of referred customers
- Referral program ROI

### Cohort Analysis

Track referred customers separately:
- Do they convert faster?
- Do they have higher LTV?
- Do they refer others at higher rates?
- Do they churn less?

Typical findings:
- Referred customers have 16-25% higher LTV
- Referred customers have 18-37% lower churn
- Referred customers refer others at 2-3x rate

---

## Launch Checklist

### Before Launch

- [ ] Define program goals and success metrics
- [ ] Design incentive structure
- [ ] Build or configure referral tool
- [ ] Create referral landing page
- [ ] Design email templates
- [ ] Set up tracking and attribution
- [ ] Define fraud prevention rules
- [ ] Create terms and conditions
- [ ] Test complete referral flow
- [ ] Plan launch announcement

### Launch

- [ ] Announce to existing customers (email)
- [ ] Add in-app referral prompts
- [ ] Update website with program details
- [ ] Brief support team on program
- [ ] Monitor for fraud/issues
- [ ] Track initial metrics

### Post-Launch (First 30 Days)

- [ ] Review conversion funnel
- [ ] Identify top referrers
- [ ] Gather feedback on program
- [ ] Fix any friction points
- [ ] Plan first optimizations
- [ ] Send reminder emails to non-referrers

---

## Questions to Ask

If you need more context:
1. What type of program are you building (referral, affiliate, or both)?
2. What's your customer LTV and current CAC?
3. Do you have an existing program, or starting from scratch?
4. What tools/platforms are you using or considering?
5. What's your budget for rewards/commissions?
6. Is your product naturally shareable (involves others, visible results)?

---

## Related Skills

- **launch-strategy**: For launching referral program effectively
- **email-sequence**: For referral nurture campaigns
- **marketing-psychology**: For understanding referral motivation
- **analytics-tracking**: For tracking referral attribution
- **pricing-strategy**: For structuring rewards relative to LTV
