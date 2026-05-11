# Contributing to Awesome Russian Language

First off, thank you for considering a contribution! This list thrives because of community effort. Every corrected link, new resource, and improved description helps Russian learners worldwide.

Please read this guide carefully before submitting a pull request. Following these guidelines ensures your contribution is reviewed and merged quickly.

---

## Table of Contents

- [Quick Rules](#quick-rules)
- [Adding a Resource](#adding-a-resource)
- [Entry Format](#entry-format)
- [Pricing Tags](#pricing-tags)
- [CEFR Levels](#cefr-levels)
- [Description Style](#description-style)
- [Fixing Broken Links](#fixing-broken-links)
- [Suggesting a New Category](#suggesting-a-new-category)
- [Pull Request Process](#pull-request-process)
- [PR Checklist](#pr-checklist)

---

## Quick Rules

| Do | Don't |
|----|-------|
| Verify the link works before submitting | Submit broken or dead links |
| Tag resources accurately as `[Free]`, `[Freemium]`, or `[Paid]` | Tag paid resources as `[Free]` |
| Add new resources to the **bottom** of the relevant category | Insert resources alphabetically or at the top |
| Use the existing table format exactly | Change the formatting style |
| Write concise, informative descriptions | Write marketing taglines or vague descriptions |
| One resource per PR (preferred) | Bundle many resources in one PR without individual verification |
| Search for duplicates before submitting | Add resources that already exist in the list |

---

## Adding a Resource

### Step 1: Verify the Resource

Before adding anything, confirm:

1. **The link works** — Visit the URL yourself. Does it load? Is the content still there?
2. **It's relevant** — Is it genuinely useful for English speakers learning Russian?
3. **It's not a duplicate** — Search the README for the URL or resource name. Different pages on the same site are fine (e.g., different lessons on russianforfree.com), but the exact same URL should not appear twice.
4. **The pricing is correct** — Is it actually free, or does it have a paywall after a trial?

### Step 2: Determine the Correct Category

Our 33 categories cover every aspect of Russian learning. Choose the most specific category:

- **Grammar** resources → Use the appropriate subsection (Cases, Verbs of Motion, Aspects, Conjugation, Participles, Prepositions, Word Formation, Cheat Sheets, or Exercises)
- **Apps** → Use "Apps & Gamified Learning" (not "Games & Quizzes")
- **YouTube channels** → Use "YouTube & Video" (not "Podcasts & Audio")
- **Academic/dictionary tools** → Use "Dictionaries & Translation" or "Linguistics & Etymology" as appropriate
- **Developer/NLP tools** → Use "GitHub Repositories & NLP" or "TTS & Speech Tools"

When in doubt, look at similar entries already in the list.

### Step 3: Add the Entry

Add your resource to the **bottom** of the relevant category's table. Number it sequentially (continue from the last number in that section).

---

## Entry Format

Every resource entry follows this exact table format:

```markdown
| # | Resource | Description | Level |
|:---:|----------|-------------|:-----:|
| 42 | [Resource Name](https://example.com) | Concise description of what the resource offers [Free] | A1 |
```

### Format Breakdown

| Field | Rules |
|-------|-------|
| `#` | Sequential number within the section. Continue from the last entry. |
| `Resource` | Link text should be the **name of the resource**, not a generic label. Use `▶️` prefix for YouTube/video links, `📄` for PDFs, `📦` for GitHub repos/datasets, `🎙️` for audiobooks. |
| `Description` | One sentence describing what the resource offers. See [Description Style](#description-style). |
| `Pricing Tag` | Must be one of: `[Free]`, `[Freemium]`, `[Paid]`, `[Deprecated]`, `[Dead]`. Placed **inside** the description cell, after the description text. |
| `Level` | CEFR level: `A1`, `A2`, `B1`, `B2`, `C1`, `C2`, or `All`. |

### Icon Prefixes

Use these icons before the link text to indicate the resource type:

| Icon | Meaning | Example |
|------|---------|---------|
| `▶️` | YouTube video or video playlist | `▶️ [Complete Russian Course (YouTube)](https://...)` |
| `📄` | PDF document or downloadable file | `📄 [Russian Grammar Reference Chart (PDF)](https://...)` |
| `📦` | GitHub repository or dataset | `📦 [Natasha NLP Toolkit](https://github.com/...)` |
| `🎙️` | Audiobook or audio-only content | `🎙️ [LibriVox — Russian Audiobooks](https://...)` |
| *(none)* | Website, app, or web tool | `[OpenRussian.org](https://...)` |

---

## Pricing Tags

Choosing the correct tag is critical. When in doubt, test the resource yourself.

### `[Free]` — Completely Free

The resource provides all its content at no cost, with no paywall, no subscription requirement, and no limited trial period.

**Qualifies as `[Free]`:**
- Websites with free content supported by ads or donations
- Open-source software (free to use)
- Blog posts and articles that are fully readable without an account
- YouTube videos, Wikipedia pages, and Archive.org items
- Apps that are fully functional without any in-app purchase

**Does NOT qualify as `[Free]`:**
- Apps with "free daily lessons" but a subscription for full content → `[Freemium]`
- Services with a 7-day or 14-day free trial → `[Freemium]`
- Sites where you can see a preview but must pay for the full article → `[Freemium]`

### `[Freemium]` — Free Tier with Paid Upgrade

The resource offers meaningful free content but also has a premium/paid tier that unlocks additional features, removes limits, or provides more content.

**Qualifies as `[Freemium]`:**
- Duolingo (free with ads; Super Duolingo subscription available)
- Anki desktop/Android (free); AnkiMobile iOS ($24.99) → tag as `[Paid]` for the iOS entry
- Sites with free basic access but a "Pro" or "Premium" subscription
- Podcasts that are free to listen but have Patreon for transcripts

**Description should mention the limitation:**
```markdown
| 5 | [Easy Pronunciation](https://easypronunciation.com) | Practice with HD audio (limited free tier; subscription for full access) [Freemium] | All |
```

### `[Paid]` — Requires Payment

The resource requires payment to use and offers no meaningful free content. These are included only when they are widely-used standard references (like major textbooks or industry tools).

**Description should indicate what the payment covers:**
```markdown
| 24 | [Golosa: A Basic Course](https://amazon.com/...) | University-standard textbook (paid textbook; Amazon link for reference) [Paid] | A1 |
```

### `[Deprecated]` — No Longer Functional

The resource was previously useful but is now closed, abandoned, or no longer accepting new users. Kept for historical reference.

### `[Dead]` — Site is Offline

The website or app is no longer accessible (domain expired, service shut down). Kept temporarily for archival purposes. These are candidates for removal.

---

## CEFR Levels

Use the Common European Framework of Reference to indicate the target proficiency:

| Level | Description | Use When |
|-------|-------------|----------|
| `A1` | Beginner | Resource teaches basic alphabet, greetings, simple phrases |
| `A2` | Elementary | Resource covers routine conversations, basic grammar |
| `B1` | Intermediate | Resource deals with travel, opinions, everyday situations |
| `B2` | Upper Intermediate | Resource involves complex texts, fluent interaction |
| `C1` | Advanced | Resource targets academic/professional Russian |
| `C2` | Proficiency | Resource is for near-native mastery |
| `All` | All Levels | Resource is genuinely useful at any proficiency level |

> **Important:** Don't default to `All` — use it only when the resource genuinely serves learners at every level. A grammar reference chart is `All`; a "First 100 Words" list is `A1`.

---

## Description Style

### Good Descriptions

```
9-hour course from zero covering the entire alphabet [Free]
Comprehensive guide to all six cases with formation rules [Free]
Practice with HD audio, adjustable speed, phonetic transcription (limited free tier; subscription for full access) [Freemium]
University-standard Russian textbook with audio (paid textbook; Amazon link for reference) [Paid]
```

### Bad Descriptions

```
A great resource for learning Russian! [Free]          ← Vague, no specific information
Learn Russian easily and quickly [Freemium]            ← Marketing tagline, not a description
Russian learning website [Free]                        ← Too generic, describes nothing unique
```

### Rules

1. **Be specific** — What does the resource actually offer? (Lessons? Flashcards? Videos? A dictionary?)
2. **Be concise** — One sentence, ideally under 15 words before the tag
3. **Start with a capital letter** — First word should be capitalized
4. **Don't repeat the resource name** — The link text already says the name
5. **Mention limitations** — If freemium, briefly note what's limited (e.g., "limited free tier", "free daily lessons; premium for full content")
6. **No marketing language** — Avoid words like "amazing", "best", "revolutionary", "easy"

---

## Fixing Broken Links

If you find a broken or dead link:

1. **Check if the content moved** — Search for the resource name or author. Many sites restructure URLs.
2. **If you find the new URL** — Submit a PR updating just the URL, keeping the description intact
3. **If the resource is truly gone** — Either:
   - Replace the entry with a similar resource (same category, same purpose), or
   - Tag it as `[Dead]` and note it in your PR description so the maintainer can decide

---

## Suggesting a New Category

We welcome category suggestions! To propose a new category:

1. Open an **Issue** (not a PR) with the title "New Category: [Name]"
2. Explain why the category is needed and list at least 3 resources that would belong in it
3. Wait for maintainer feedback before creating the PR

---

## Pull Request Process

### Before You Start

1. **Fork** the repository
2. **Create a branch** for your changes: `git checkout -b add/resource-name`
3. Make your changes following all the guidelines above

### PR Title Format

Use descriptive titles:

- `Add: [Resource Name] — [Category]` for new resources
- `Fix: Update URL for [Resource Name]` for link fixes
- `Tag: Change [Resource Name] from [Free] to [Freemium]` for pricing corrections
- `Remove: [Resource Name] — dead link` for removals

### After Submitting

- Be responsive to feedback and review requests
- If asked to make changes, push new commits to the same branch (do not close and reopen the PR)
- Your PR will be merged once it passes review

---

## PR Checklist

Before submitting your pull request, verify each item:

- [ ] I have searched the list and confirmed this resource is **not a duplicate**
- [ ] I have **visited the URL** and confirmed it works and the content is relevant
- [ ] I have used the **correct pricing tag** (`[Free]`, `[Freemium]`, `[Paid]`, etc.) based on actual testing
- [ ] I have placed the resource in the **correct category** at the **bottom** of the section
- [ ] I have used the **exact table format** matching existing entries
- [ ] I have used an **icon prefix** (`▶️`, `📄`, `📦`, `🎙️`) if applicable
- [ ] I have assigned the **appropriate CEFR level** (not defaulting to `All` without reason)
- [ ] My description is **concise, specific, and free of marketing language**
- [ ] I have **numbered the entry** sequentially within its section
- [ ] I have **updated the resource count** in the Table of Contents and Statistics section if adding/removing a resource
- [ ] My PR has a **descriptive title** following the format above
- [ ] I have read and followed all guidelines in this CONTRIBUTING.md

---

## Questions?

If you're unsure about anything, open an **Issue** first and ask. We're happy to help you make a great contribution!

---

*This contributing guide is inspired by the [sindresorhus/awesome](https://github.com/sindresorhus/awesome) contributing guidelines and adapted for the Awesome Russian Language list.*
