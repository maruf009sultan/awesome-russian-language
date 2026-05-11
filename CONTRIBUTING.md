# Contributing to Awesome Russian Language

First off, thank you for considering a contribution! 🙌 This is a **curated** list — we prioritize quality over quantity, and every resource should be genuinely useful for Russian language learners.

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

---

## Table of Contents

- [Quick Rules](#quick-rules)
- [Quality Criteria](#quality-criteria)
- [Formatting Conventions](#formatting-conventions)
- [Tags and Annotations](#tags-and-annotations)
- [Category Guide](#category-guide)
- [How to Submit a Pull Request](#how-to-submit-a-pull-request)
- [Updating Your Pull Request](#updating-your-pull-request)
- [Reporting Issues](#reporting-issues)

---

## Quick Rules

| ✅ Do | ❌ Don't |
|-------|---------|
| Search existing entries before suggesting | Add duplicate resources |
| One item per pull request | Bundle multiple items in one PR |
| Add to the **bottom** of the relevant category | Insert alphabetically or at the top |
| Use the exact formatting template below | Invent your own format |
| Verify the link works before submitting | Submit dead or broken links |
| Include a brief explanation in your PR | Submit empty PR descriptions |
| Disclose affiliation with the resource | Submit your own product without disclosure |
| Check spelling and grammar | Leave trailing whitespace |

---

## Quality Criteria

This is a **curated list, not a collection**. We'd rather leave things out than include too much.

### ✅ A resource SHOULD be included if it meets most of these:

- **Actively maintained** — Updated within the last 2 years, or a timeless classic (e.g., a published grammar reference)
- **Genuinely useful** — You or another contributor can personally vouch for it
- **Properly documented** — Clear description of what the resource offers
- **Accessible** — Has at least a free tier or free trial, OR is the definitive resource in its category
- **Accurate** — Factually correct Russian language content from reputable sources
- **Specifically about Russian** — Not just a generic tool that happens to support Russian among 50+ languages

### ❌ A resource should NOT be included if it:

- Is abandoned, broken, or has been discontinued
- Is behind a complete paywall with no free access whatsoever
- Contains machine-translated content of low quality
- Is purely promotional or spammy
- Doesn't specifically help with learning or using Russian
- Is a duplicate of an existing entry (check first!)
- Is a generic Wikipedia article (unless it's a genuinely useful reference like Russian phonology or grammar)
- Links to an Amazon search page rather than a specific product
- Is an unrelated blog post or article that merely mentions Russian

### 🟡 Special Cases

- **GitHub repositories** — Should have ≥10 stars and/or active maintenance. Repos with 0–2 stars and no recent activity will generally not be accepted.
- **YouTube channels** — Must be active (uploads within the past year) or have substantial evergreen content.
- **Apps** — Must still be available on their respective app stores. Discontinued apps will be removed.
- **Paid resources** — Only accepted if they are the definitive or best-in-class option for their category, AND the description clearly marks them as `[Paid]`.

---

## Formatting Conventions

### Entry Template

Add your entry as a new row at the **bottom** of the appropriate category's table:

```
| N | [Resource Name](https://example.com) | Short description of what it offers [Tag] | Level |
```

Where:
- `N` = the next sequential number in the table (just continue from the last entry)
- `[Resource Name]` = the **official name** of the resource as it appears on its website
- `(URL)` = the **primary URL** — official site, GitHub repo, or app store listing (not aggregators or review sites)
- `Short description` = one concise sentence describing what the resource IS, not marketing fluff
- `[Tag]` = one of: `[Free]`, `[Freemium]`, `[Paid]`
- `Level` = CEFR level: `A1`, `A2`, `B1`, `B2`, `C1`, `C2`, or `All`

### Description Rules

| Rule | Example |
|------|---------|
| Start with an uppercase letter | ✅ "Audio lessons for all levels" ❌ "audio lessons for all levels" |
| Be objective, not marketing | ✅ "Interactive grammar exercises" ❌ "The BEST grammar tool ever!!!" |
| Don't start with "A" or "An" | ✅ "Morphological analyzer for Russian" ❌ "A morphological analyzer" |
| Keep it to one sentence | ✅ "Word2Vec trained on classic Russian novels" ❌ "Word2Vec trained on classic Russian novels, which can be used for..." |
| Describe what it IS, not what it isn't | ✅ "Freemium podcast with structured lessons" ❌ "Not just another podcast" |
| Note the interface language if not English | ✅ "300+ lessons with grammar and audio (site in French)" |

### Emoji Prefixes (Optional)

Use these before the resource name when appropriate:

| Emoji | Meaning | When to Use |
|-------|---------|-------------|
| 📦 | Open-source / GitHub repo | For any resource hosted on GitHub or similar |
| ▶️ | Video content | YouTube channels, video courses |
| 🎙️ | Audio content | Podcasts, audiobooks |
| 📱 | Mobile app | App store listings |

### Formatting Examples

✅ **Good entries:**
```
| 23 | [DeepPavlov](https://github.com/deeppavlov/DeepPavlov) | Open-source NLP framework with extensive Russian support [Free] | C1 |
| 42 | 📦 [russian-words — 1.5M Forms](https://github.com/danakt/russian-words) | 1,531,464 Russian words in all morphological forms [Free] | C1 |
| 7 | ▶️ [Real Russian Club](https://www.youtube.com/@RealRussianClub) | Slow Russian, grammar, vlogs for intermediate learners [Free] | B1 |
```

❌ **Bad entries:**
```
| 23 | [DeepPavlov](https://pypi.org/project/deeppavlov/) | An amazing NLP framework that will blow your mind!!! [Free] | C1 |
| 42 | [russian words](https://github.com/danakt/russian-words) | words [Free] | C1 |
| 7 | [Real Russian Club](https://youtube.com) | Russian stuff [Free] | B1 |
```

---

## Tags and Annotations

### Price Tags (Required — every resource must have one)

| Tag | Meaning | Criteria |
|-----|---------|----------|
| `[Free]` | Completely free to use with full functionality | No paywall for core features; ad-supported is OK |
| `[Freemium]` | Free tier with premium upgrade | Core content accessible for free; advanced features require payment |
| `[Paid]` | Requires payment with no meaningful free tier | Only accepted for best-in-class definitive resources |

**Important:** When tagging, consider the user experience:
- If a free tier provides substantial, usable content → `[Freemium]`
- If a "free trial" is just 7 days of access → `[Paid]`
- If everything works for free with optional paid extras → `[Free]`
- Cloud API services that charge per use → `[Paid]`

### CEFR Level Tags

| Level | Description | What the learner can do |
|-------|-------------|------------------------|
| `A1` | Beginner | Introduce yourself, basic phrases, simple questions |
| `A2` | Elementary | Routine tasks, short conversations, describe background |
| `B1` | Intermediate | Deal with travel situations, express opinions, simple texts |
| `B2` | Upper Intermediate | Fluent interaction, complex texts, clear arguments |
| `C1` | Advanced | Implicit meaning, academic text, flexible expression |
| `C2` | Proficiency | Near-native understanding, spontaneous expression |
| `All` | All levels | Resource is useful regardless of proficiency |

---

## Category Guide

Not sure which section your resource belongs in? Use this guide:

| Category | What Goes Here | What Doesn't |
|----------|---------------|-------------|
| 🏠 Getting Started | Beginner guides, roadmaps, overview resources | Specific grammar topics, individual courses |
| 🔤 Alphabet & Phonetics | Cyrillic learning, letter pronunciation, reading basics | Verb conjugations, vocabulary |
| 🗣️ Pronunciation & Speaking | Accent training, conversation practice, speech tools | Written grammar exercises |
| 📝 Grammar | Grammar rules, tables, explanations, exercises | Individual vocabulary lists |
| 📚 Courses & MOOCs | Structured multi-lesson courses (free or paid) | Single YouTube videos, individual lessons |
| 📖 Reading Practice & Books | Graded readers, literature, bilingual texts | Grammar textbooks |
| 💬 Vocabulary & Phrases | Word lists, phrasebooks, idioms, slang | Grammar rules |
| 🃏 Flashcards & SRS | Spaced repetition tools, flashcard decks | General learning apps |
| 🎧 Podcasts & Audio | Audio lessons, Russian-language podcasts | Music, radio streams |
| 📺 YouTube & Video | Video courses, educational channels | Movies, TV shows |
| 🎬 Movies & TV | Russian films, TV series with learning value | Educational videos |
| 🎵 Music & Songs | Russian music with lyrics, song-based learning | Pure entertainment |
| 📻 Radio & Streaming | Live Russian radio, streaming services | Recorded podcasts |
| 📱 Apps & Gamified Learning | Mobile applications for learning Russian | Desktop-only tools |
| 🎮 Games & Quizzes | Interactive games, quizzes for practice | Flashcard apps |
| 🤝 Language Exchange | Tandem learning, community platforms, tutors | Solo study tools |
| 📖 Dictionaries & Translation | Russian dictionaries, translation tools | Grammar checkers |
| ✍️ Writing & Grammar Tools | Spell checkers, grammar checkers, writing aids | Dictionaries |
| ⌨️ Keyboards & Input | Russian keyboard apps, input methods | Fonts |
| 🖊️ Handwriting & Cursive | Cursive practice, handwriting guides | Keyboard typing |
| 🧪 Proficiency Tests | TORFL prep, CEFR tests, assessment tools | General courses |
| 🌐 Browser Extensions | Browser-based learning tools | Standalone apps |
| 🔤 Fonts & Typography | Russian fonts, Cyrillic typography | Keyboard layouts |
| 🎭 Culture & History | Russian culture, history, traditions | Language mechanics |
| 📰 News & Media | Russian news sources for learners | Academic journals |
| 🔬 Linguistics & Etymology | Academic linguistics, etymology, language history | Beginner resources |
| 💻 GitHub Repos & NLP | Open-source tools, datasets, computational resources | Non-code resources |
| 🗣️ TTS & Speech Tools | Text-to-speech, speech-to-text tools | General audio |
| 🧒 Russian for Kids | Children's learning materials | Adult resources |
| 💼 Specialized Russian | Russian for business, science, law, medicine | General learning |
| 📝 Blogs & Learning Guides | Tips, strategies, advice from learners/teachers | Structured courses |

**Proposing a new category?** Open a separate issue first to discuss it before submitting a PR.

---

## How to Submit a Pull Request

### Prerequisites
- A [GitHub account](https://github.com/join)
- Basic familiarity with [Markdown](https://docs.github.com/en/get-started/writing-on-github)

### Steps

1. **Fork** this repository to your own GitHub account.

2. **Edit** the `README.md` file:
   - Add your entry at the **bottom** of the appropriate category table
   - Use the next sequential number
   - Follow the formatting conventions above
   - Make sure there are **no blank lines** within the table (it breaks Markdown rendering)

3. **Commit** your change with a descriptive message:
   - ✅ `Add RussianPod101 to Podcasts`
   - ✅ `Update Duolingo description to note leaderboard feature`
   - ❌ `Update README.md`
   - ❌ `Added stuff`

4. **Open a pull request** with:
   - **Title**: `Add [Resource Name]` or `Update [Resource Name]`
   - **Description** must include:
     - 🔗 Link to the resource
     - 📝 Why it should be included (or what changed)
     - 🤝 Whether you are affiliated with the resource (be honest!)
     - ✅ Confirmation that you've searched for duplicates

5. **Wait for review.** A maintainer will review your PR and may request changes.

### PR Template

```markdown
## Resource Addition / Update

**Resource name:** 
**URL:** 
**Category:** 
**Price tag:** [Free] / [Freemium] / [Paid]

**Why should this be included?**

**Is this resource affiliated with you?** Yes / No

**I have searched for duplicates:** Yes
```

---

## Updating Your Pull Request

Sometimes, a maintainer will ask you to edit your pull request before it can be merged. This is usually because:

- The formatting doesn't match the conventions
- The description is too vague or too marketing-heavy
- The resource doesn't meet the quality criteria
- The price tag is incorrect

To update your PR:

1. Go to your fork of the repository
2. Edit the file again
3. Commit the changes to the **same branch** (this automatically updates the PR)
4. Leave a comment on the PR letting the maintainer know you've made the changes

For detailed instructions, see [this guide on amending commits](https://github.com/RichardLitt/knowledge/blob/master/github/amending-a-commit-guide.md).

---

## Reporting Issues

Found a problem but don't want to submit a PR? Open an issue!

**Good issues to report:**
- 🔗 Dead links (404 errors, DNS failures)
- 🏷️ Incorrect price tags (resource is now paid but marked [Free])
- 📝 Inaccurate descriptions
- 🔄 Duplicate entries
- 📦 Archived or abandoned GitHub repositories
- 📱 Discontinued apps or services

**When reporting, please include:**
- The resource name
- The section it's in
- What's wrong
- (If possible) The correct information

---

Thank you for helping make this list the best Russian language resource on the internet! 🇷🇺✨
