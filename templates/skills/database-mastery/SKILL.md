---
name: database-mastery
description: Comprehensive Power SOP for Database Mastery. Combined from multiple specialized skills.
---

# Database Mastery Master SOP



--- SECTION: POSTGRES-BEST-PRACTICES ---


# Supabase Postgres Best Practices

Comprehensive performance optimization guide for Postgres, maintained by Supabase. Contains rules across 8 categories, prioritized by impact to guide automated query optimization and schema design.

## When to Apply

Reference these guidelines when:
- Writing SQL queries or designing schemas
- Implementing indexes or query optimization
- Reviewing database performance issues
- Configuring connection pooling or scaling
- Optimizing for Postgres-specific features
- Working with Row-Level Security (RLS)

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Query Performance | CRITICAL | `query-` |
| 2 | Connection Management | CRITICAL | `conn-` |
| 3 | Security & RLS | CRITICAL | `security-` |
| 4 | Schema Design | HIGH | `schema-` |
| 5 | Concurrency & Locking | MEDIUM-HIGH | `lock-` |
| 6 | Data Access Patterns | MEDIUM | `data-` |
| 7 | Monitoring & Diagnostics | LOW-MEDIUM | `monitor-` |
| 8 | Advanced Features | LOW | `advanced-` |

## How to Use

Read individual rule files for detailed explanations and SQL examples:

```
rules/query-missing-indexes.md
rules/schema-partial-indexes.md
rules/_sections.md
```

Each rule file contains:
- Brief explanation of why it matters
- Incorrect SQL example with explanation
- Correct SQL example with explanation
- Optional EXPLAIN output or metrics
- Additional context and references
- Supabase-specific notes (when applicable)

## Full Compiled Document

For the complete guide with all rules expanded: `AGENTS.md`


--- SECTION: PRISMA-EXPERT ---


# Prisma Expert

You are an expert in Prisma ORM with deep knowledge of schema design, migrations, query optimization, relations modeling, and database operations across PostgreSQL, MySQL, and SQLite.

## When Invoked

### Step 0: Recommend Specialist and Stop
If the issue is specifically about:
- **Raw SQL optimization**: Stop and recommend postgres-expert or mongodb-expert
- **Database server configuration**: Stop and recommend database-expert
- **Connection pooling at infrastructure level**: Stop and recommend devops-expert

### Environment Detection
```bash
# Check Prisma version
npx prisma --version 2>/dev/null || echo "Prisma not installed"

# Check database provider
grep "provider" prisma/schema.prisma 2>/dev/null | head -1

# Check for existing migrations
ls -la prisma/migrations/ 2>/dev/null | head -5

# Check Prisma Client generation status
ls -la node_modules/.prisma/client/ 2>/dev/null | head -3
```

### Apply Strategy
1. Identify the Prisma-specific issue category
2. Check for common anti-patterns in schema or queries
3. Apply progressive fixes (minimal → better → complete)
4. Validate with Prisma CLI and testing

## Problem Playbooks

### Schema Design
**Common Issues:**
- Incorrect relation definitions causing runtime errors
- Missing indexes for frequently queried fields
- Enum synchronization issues between schema and database
- Field type mismatches

**Diagnosis:**
```bash
# Validate schema
npx prisma validate

# Check for schema drift
npx prisma migrate diff --from-schema-datamodel prisma/schema.prisma --to-schema-datasource prisma/schema.prisma

# Format schema
npx prisma format
```

**Prioritized Fixes:**
1. **Minimal**: Fix relation annotations, add missing `@relation` directives
2. **Better**: Add proper indexes with `@@index`, optimize field types
3. **Complete**: Restructure schema with proper normalization, add composite keys

**Best Practices:**
```prisma
// Good: Explicit relations with clear naming
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  posts     Post[]   @relation("UserPosts")
  profile   Profile? @relation("UserProfile")
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([email])
  @@map("users")
}

model Post {
  id       String @id @default(cuid())
  title    String
  author   User   @relation("UserPosts", fields: [authorId], references: [id], onDelete: Cascade)
  authorId String
  
  @@index([authorId])
  @@map("posts")
}
```

**Resources:**
- https://www.prisma.io/docs/concepts/components/prisma-schema
- https://www.prisma.io/docs/concepts/components/prisma-schema/relations

### Migrations
**Common Issues:**
- Migration conflicts in team environments
- Failed migrations leaving database in inconsistent state
- Shadow database issues during development
- Production deployment migration failures

**Diagnosis:**
```bash
# Check migration status
npx prisma migrate status

# View pending migrations
ls -la prisma/migrations/

# Check migration history table
# (use database-specific command)
```

**Prioritized Fixes:**
1. **Minimal**: Reset development database with `prisma migrate reset`
2. **Better**: Manually fix migration SQL, use `prisma migrate resolve`
3. **Complete**: Squash migrations, create baseline for fresh setup

**Safe Migration Workflow:**
```bash
# Development
npx prisma migrate dev --name descriptive_name

# Production (never use migrate dev!)
npx prisma migrate deploy

# If migration fails in production
npx prisma migrate resolve --applied "migration_name"
# or
npx prisma migrate resolve --rolled-back "migration_name"
```

**Resources:**
- https://www.prisma.io/docs/concepts/components/prisma-migrate
- https://www.prisma.io/docs/guides/deployment/deploy-database-changes

### Query Optimization
**Common Issues:**
- N+1 query problems with relations
- Over-fetching data with excessive includes
- Missing select for large models
- Slow queries without proper indexing

**Diagnosis:**
```bash
# Enable query logging
# In schema.prisma or client initialization:
# log: ['query', 'info', 'warn', 'error']
```

```typescript
// Enable query events
const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
  ],
});

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query);
  console.log('Duration: ' + e.duration + 'ms');
});
```

**Prioritized Fixes:**
1. **Minimal**: Add includes for related data to avoid N+1
2. **Better**: Use select to fetch only needed fields
3. **Complete**: Use raw queries for complex aggregations, implement caching

**Optimized Query Patterns:**
```typescript
// BAD: N+1 problem
const users = await prisma.user.findMany();
for (const user of users) {
  const posts = await prisma.post.findMany({ where: { authorId: user.id } });
}

// GOOD: Include relations
const users = await prisma.user.findMany({
  include: { posts: true }
});

// BETTER: Select only needed fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    posts: {
      select: { id: true, title: true }
    }
  }
});

// BEST for complex queries: Use $queryRaw
const result = await prisma.$queryRaw`
  SELECT u.id, u.email, COUNT(p.id) as post_count
  FROM users u
  LEFT JOIN posts p ON p.author_id = u.id
  GROUP BY u.id
`;
```

**Resources:**
- https://www.prisma.io/docs/guides/performance-and-optimization
- https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access

### Connection Management
**Common Issues:**
- Connection pool exhaustion
- "Too many connections" errors
- Connection leaks in serverless environments
- Slow initial connections

**Diagnosis:**
```bash
# Check current connections (PostgreSQL)
psql -c "SELECT count(*) FROM pg_stat_activity WHERE datname = 'your_db';"
```

**Prioritized Fixes:**
1. **Minimal**: Configure connection limit in DATABASE_URL
2. **Better**: Implement proper connection lifecycle management
3. **Complete**: Use connection pooler (PgBouncer) for high-traffic apps

**Connection Configuration:**
```typescript
// For serverless (Vercel, AWS Lambda)
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
```

```env
# Connection URL with pool settings
DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=5&pool_timeout=10"
```

**Resources:**
- https://www.prisma.io/docs/guides/performance-and-optimization/connection-management
- https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel

### Transaction Patterns
**Common Issues:**
- Inconsistent data from non-atomic operations
- Deadlocks in concurrent transactions
- Long-running transactions blocking reads
- Nested transaction confusion

**Diagnosis:**
```typescript
// Check for transaction issues
try {
  const result = await prisma.$transaction([...]);
} catch (e) {
  if (e.code === 'P2034') {
    console.log('Transaction conflict detected');
  }
}
```

**Transaction Patterns:**
```typescript
// Sequential operations (auto-transaction)
const [user, profile] = await prisma.$transaction([
  prisma.user.create({ data: userData }),
  prisma.profile.create({ data: profileData }),
]);

// Interactive transaction with manual control
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ data: userData });
  
  // Business logic validation
  if (user.email.endsWith('@blocked.com')) {
    throw new Error('Email domain blocked');
  }
  
  const profile = await tx.profile.create({
    data: { ...profileData, userId: user.id }
  });
  
  return { user, profile };
}, {
  maxWait: 5000,  // Wait for transaction slot
  timeout: 10000, // Transaction timeout
  isolationLevel: 'Serializable', // Strictest isolation
});

// Optimistic concurrency control
const updateWithVersion = await prisma.post.update({
  where: { 
    id: postId,
    version: currentVersion  // Only update if version matches
  },
  data: {
    content: newContent,
    version: { increment: 1 }
  }
});
```

**Resources:**
- https://www.prisma.io/docs/concepts/components/prisma-client/transactions

## Code Review Checklist

### Schema Quality
- [ ] All models have appropriate `@id` and primary keys
- [ ] Relations use explicit `@relation` with `fields` and `references`
- [ ] Cascade behaviors defined (`onDelete`, `onUpdate`)
- [ ] Indexes added for frequently queried fields
- [ ] Enums used for fixed value sets
- [ ] `@@map` used for table naming conventions

### Query Patterns
- [ ] No N+1 queries (relations included when needed)
- [ ] `select` used to fetch only required fields
- [ ] Pagination implemented for list queries
- [ ] Raw queries used for complex aggregations
- [ ] Proper error handling for database operations

### Performance
- [ ] Connection pooling configured appropriately
- [ ] Indexes exist for WHERE clause fields
- [ ] Composite indexes for multi-column queries
- [ ] Query logging enabled in development
- [ ] Slow queries identified and optimized

### Migration Safety
- [ ] Migrations tested before production deployment
- [ ] Backward-compatible schema changes (no data loss)
- [ ] Migration scripts reviewed for correctness
- [ ] Rollback strategy documented

## Anti-Patterns to Avoid

1. **Implicit Many-to-Many Overhead**: Always use explicit join tables for complex relationships
2. **Over-Including**: Don't include relations you don't need
3. **Ignoring Connection Limits**: Always configure pool size for your environment
4. **Raw Query Abuse**: Use Prisma queries when possible, raw only for complex cases
5. **Migration in Production Dev Mode**: Never use `migrate dev` in production


--- SECTION: PRISMA-ORM ---


# Prisma ORM

Database modeling, migrations, queries, and performance optimization with Prisma.

## When to Use

Use this skill when working on full stack tasks related to prisma orm.

## Key Concepts

1. **Best Practices**: Follow industry standards
2. **Implementation**: Step-by-step guidance
3. **Examples**: Real-world applications

## Guidelines

- Start with understanding requirements
- Apply proven patterns
- Test and validate results


--- SECTION: NEON-POSTGRES ---


# Neon Postgres

## Patterns

### Prisma with Neon Connection

Configure Prisma for Neon with connection pooling.

Use two connection strings:
- DATABASE_URL: Pooled connection for Prisma Client
- DIRECT_URL: Direct connection for Prisma Migrate

The pooled connection uses PgBouncer for up to 10K connections.
Direct connection required for migrations (DDL operations).


### Drizzle with Neon Serverless Driver

Use Drizzle ORM with Neon's serverless HTTP driver for
edge/serverless environments.

Two driver options:
- neon-http: Single queries over HTTP (fastest for one-off queries)
- neon-serverless: WebSocket for transactions and sessions


### Connection Pooling with PgBouncer

Neon provides built-in connection pooling via PgBouncer.

Key limits:
- Up to 10,000 concurrent connections to pooler
- Connections still consume underlying Postgres connections
- 7 connections reserved for Neon superuser

Use pooled endpoint for application, direct for migrations.


## ⚠️ Sharp Edges

| Issue | Severity | Solution |
|-------|----------|----------|
| Issue | high | See docs |
| Issue | high | See docs |
| Issue | high | See docs |
| Issue | medium | See docs |
| Issue | medium | See docs |
| Issue | low | See docs |
| Issue | medium | See docs |
| Issue | high | See docs |


--- SECTION: DATABASE-DESIGN ---


# Database Design

> **Learn to THINK, not copy SQL patterns.**

## 🎯 Selective Reading Rule

**Read ONLY files relevant to the request!** Check the content map, find what you need.

| File | Description | When to Read |
|------|-------------|--------------|
| `database-selection.md` | PostgreSQL vs Neon vs Turso vs SQLite | Choosing database |
| `orm-selection.md` | Drizzle vs Prisma vs Kysely | Choosing ORM |
| `schema-design.md` | Normalization, PKs, relationships | Designing schema |
| `indexing.md` | Index types, composite indexes | Performance tuning |
| `optimization.md` | N+1, EXPLAIN ANALYZE | Query optimization |
| `migrations.md` | Safe migrations, serverless DBs | Schema changes |

---

## ⚠️ Core Principle

- ASK user for database preferences when unclear
- Choose database/ORM based on CONTEXT
- Don't default to PostgreSQL for everything

---

## Decision Checklist

Before designing schema:

- [ ] Asked user about database preference?
- [ ] Chosen database for THIS context?
- [ ] Considered deployment environment?
- [ ] Planned index strategy?
- [ ] Defined relationship types?

---

## Anti-Patterns

❌ Default to PostgreSQL for simple apps (SQLite may suffice)
❌ Skip indexing
❌ Use SELECT * in production
❌ Store JSON when structured data is better
❌ Ignore N+1 queries
