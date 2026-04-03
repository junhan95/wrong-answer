# Wrong Answer AI — Claude Instructions

## Project Overview

Wrong Answer AI (wrong-answer.ai) is a Korean AI-powered personalized learning service that helps students identify, analyze, and overcome their mistakes. Built on a credit-based subscription model.

**Stack:** Node.js + Express (backend), React + Vite (frontend), PostgreSQL + Drizzle ORM, TypeScript

## gstack

gstack is installed at `.agents/skills/gstack/`. Use gstack skills for all major workflows.

### Skill Routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke office-hours
- Bugs, errors, "why is this broken", 500 errors → invoke investigate
- Ship, deploy, push, create PR → invoke ship
- QA, test the site, find bugs → invoke qa
- Code review, check my diff → invoke review
- Update docs after shipping → invoke document-release
- Weekly retro → invoke retro
- Design system, brand → invoke design-consultation
- Visual audit, design polish → invoke design-review
- Architecture review → invoke plan-eng-review
- Save progress, checkpoint, resume → invoke checkpoint
- Code quality, health check → invoke health

### Available Skills

| Skill | Command | Purpose |
|-------|---------|---------|
| Browse / QA | `/browse` | Headless browser for testing |
| QA + Fix | `/qa` | Test and fix bugs |
| QA Report | `/qa-only` | Test, report only |
| Ship | `/ship` | Run tests, push, PR |
| Investigate | `/investigate` | Root cause debugging |
| Review | `/review` | Pre-landing code review |
| Design Review | `/design-review` | Visual audit + fix |
| Health | `/health` | Code quality dashboard |
| Checkpoint | `/checkpoint` | Save/resume work state |
| Retro | `/retro` | Weekly engineering retro |

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server (frontend + backend)
npm run dev

# Database migrations
npm run db:push

# Type checking
npm run check
```

## Key Directories

```
client/         # React frontend (Vite)
  src/
    components/ # Reusable UI components
    pages/      # Route pages
    hooks/      # Custom React hooks
server/         # Express backend
  routes/       # API endpoints
  storage/      # Database access layer
shared/         # Shared types & schema (Drizzle)
```

## Environment Variables

See `.env` for required values:
- `DATABASE_URL` — PostgreSQL connection
- `SESSION_SECRET` — Express session
- `KAKAO_CLIENT_ID` / `KAKAO_CLIENT_SECRET` — Kakao OAuth
- `NAVER_CLIENT_ID` / `NAVER_CLIENT_SECRET` — Naver OAuth
- `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` — Stripe billing
- `VITE_STRIPE_PUBLISHABLE_KEY` — Frontend Stripe key
