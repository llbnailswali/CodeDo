# CodeDo — 90-Day Curriculum & Data Gathering Plan

> **Purpose:** Persistent source of truth for creating, validating, organizing, and tracking all CodeDo educational data.
>
> This file exists so AI sessions can resume content creation without losing curriculum position, duplicating lessons, or drifting from the product roadmap.

---

# 1. Data Mission

CodeDo is a gamified programming-learning application.

The initial educational journey is:

> **90-Day Kotlin Journey**

The objective is not to create a short 36-lesson course. The original 36 lessons are the foundational curriculum and must be expanded into a roughly 90-day learning journey with deeper practice, mastery, debugging, challenges, and practical Kotlin/Android progression.

The user should be able to spend approximately:

- **5–15 minutes** on the required daily learning
- **15–30+ minutes** when they choose Practice, Battle, Quests, Mastery, or Projects

The data system must support long-term progression without artificially padding lessons.

---

# 2. Source of Truth

Curriculum must remain synchronized with:

`CODEDO_PROJECT_PLAN.md`

If documents conflict with this document:

1. Do not silently choose.
2. Identify the conflict.
3. Prefer the latest explicit project decision.
4. Update the documentation after the decision is confirmed.

The current product direction is a **90-day Kotlin journey**.

---

# 3. Curriculum Structure

Target approximately:

- 10 worlds
- ~90 days
- 3 new core lessons/day by default
- Multiple practice activities per day
- Boss/review milestones
- 1,000+ total challenge records over time
- Expandable curriculum after Day 90

Important:

**3 lessons/day means 3 newly unlocked core lessons, not 3 total activities.**

Practice, quests, battles, mastery, and project challenges are additional activities.

---

# 4. World Map

## World 1 — Kotlin Foundations

Approx. Days 1–10

Original lessons:
1. Welcome to Kotlin
2. Variables
3. val vs var
4. Data Types
5. Operators
6. Strings
7. String Templates
8. Null Safety

Expansion skills:
- Basic expressions
- Type recognition
- Mutability decisions
- Basic output prediction
- Reading Kotlin syntax
- Beginner debugging

---

## World 2 — Logic

Approx. Days 11–18

Original:
9. Boolean Values
10. Comparisons
11. if / else
12. when
13. Logical Operators

Expansion:
- Nested conditions
- Compound conditions
- Range logic
- Truth-table reasoning
- Debugging conditions
- Output prediction

Boss:
**Logic Boss**

---

## World 3 — Loops

Approx. Days 19–27

Original:
14. for Loops
15. while Loops
16. Ranges
17. Nested Loops
18. Loop Control

Expansion:
- step
- downTo
- until
- break
- continue
- tracing iterations
- nested loops
- loop debugging
- pattern problems

Boss:
**Loop Boss**

---

## World 4 — Functions

Approx. Days 28–37

Original:
19. Functions
20. Parameters
21. Return Values
22. Default Arguments
23. Named Arguments
24. Lambdas

Expansion:
- Function design
- Return reasoning
- Expression functions
- Higher-order functions
- Lambda syntax
- Function references
- Common function bugs

Boss:
**Function Boss**

---

## World 5 — Collections

Approx. Days 38–48

Original:
25. Lists
26. Sets
27. Maps
28. map()
29. filter()
30. reduce()

Expansion:
- Mutable/immutable collections
- Iteration
- contains
- find
- any/all/none
- sorted/sortedBy
- grouping
- chaining
- collection debugging
- data transformation

Boss:
**Collections Boss**

---

## World 6 — OOP

Approx. Days 49–58

Original:
31. Classes
32. Objects
33. Constructors
34. Properties
35. Inheritance
36. Interfaces

Expansion:
- Primary constructors
- Secondary constructors
- Visibility
- Encapsulation
- Data classes
- Enum classes
- Abstract classes
- Composition
- Inheritance decisions
- Interfaces

Boss:
**OOP Boss**

---

## World 7 — Kotlin Mastery

Approx. Days 59–68

Skills:
- Scope functions
- Extension functions
- Destructuring
- Smart casts
- Type checks
- Sealed classes
- Generics
- Delegation concepts
- Functional patterns
- Exception handling
- Advanced collections

Boss:
**Kotlin Mastery Challenge**

---

## World 8 — Coroutines & Async Kotlin

Approx. Days 69–75

Skills:
- Async programming concepts
- suspend
- Coroutine basics
- Dispatchers
- launch
- async/await
- Structured concurrency
- Cancellation
- Exception handling
- Flow

Boss:
**Async Boss**

---

## World 9 — Android Development Foundations

Approx. Days 76–84

Skills:
- Android project structure
- Activity/lifecycle concepts
- State
- ViewModel
- UI state
- Jetpack Compose
- Composables
- Layouts
- Lists
- Navigation
- Repository concept
- JSON/networking
- Room/Firebase concepts
- Basic architecture

---

## World 10 — Real Projects

Approx. Days 85–90 initially, then expandable.

Projects:
1. Number Guessing Game
2. Quiz Game
3. To-Do App
4. Notes App
5. Expense Tracker
6. Weather App
7. Movie/Content App
8. Chat App
9. Larger Android project

Projects should unlock based on skill prerequisites.

---

# 5. Data Hierarchy

Use this conceptual hierarchy:

```text
Curriculum
 └── World
      └── Module
           └── Lesson
                └── Challenge
                     └── Skill
```

Additional:

```text
PracticeChallenge
DailyQuest
BattleQuestion
BossChallenge
Project
ProjectChallenge
Achievement
```

---

# 6. Lesson Model

Every lesson should have:

```text
id
worldId
moduleId
order
title
shortDescription
estimatedMinutes
skills[]
difficulty
xp
challengeIds[]
prerequisiteLessonIds[]
```

Optional:

```text
isBoss
isReview
isProject
tags[]
```

---

# 7. Challenge Model

Every challenge should contain at least:

```text
id
type
lessonId
skillId
question
code
options
correctAnswer
explanation
xp
hint
difficulty
```

Optional:

```text
secondHint
tags[]
relatedSkillIds[]
prerequisiteChallengeIds[]
```

Supported challenge types:

```text
multiple_choice
true_false
fill_blank
code_completion
find_bug
code_ordering
output_prediction
match_concept
tap_correct_line
boss
```

---

# 8. Challenge Design Rules

Every challenge must test something meaningful.

Avoid:
- Trivia with no programming value
- Pure terminology memorization
- Repeated wording
- Ambiguous questions
- Multiple valid answers unless explicitly intended
- Tricks unrelated to the skill
- Unrealistic Kotlin code
- Excessive complexity for beginner lessons

Prefer:
- Predict output
- Explain behavior
- Complete code
- Fix code
- Choose correct implementation
- Trace execution
- Compare alternatives
- Identify bugs
- Apply a concept in a new context

---

# 9. Challenge Progression

For each concept, aim to move through:

```text
1. Recognition
2. Understanding
3. Application
4. Prediction
5. Modification
6. Debugging
7. Combination
8. Mastery
```

Example for loops:

```text
What keyword creates a for loop?
        ↓
What does this loop print?
        ↓
Complete the loop
        ↓
Change the range
        ↓
Find the bug
        ↓
Combine loop + condition
        ↓
Solve a practical problem
        ↓
Boss challenge
```

---

# 10. Difficulty Rules

Use:

```text
Beginner
Easy
Medium
Hard
Boss
```

Suggested progression:

### Beginner
Single concept, minimal code.

### Easy
One concept plus a small variation.

### Medium
Multiple steps or related concepts.

### Hard
Combination of skills, debugging, or less obvious behavior.

### Boss
Requires understanding rather than memorization and may combine multiple skills.

Do not introduce advanced syntax before prerequisites are established.

---

# 11. Skill Taxonomy

Every challenge must map to one primary skill.

Examples:

```text
variables
mutability
data_types
type_inference
operators
strings
string_templates
null_safety

booleans
comparisons
conditions
when
logical_operators

for_loops
while_loops
ranges
nested_loops
loop_control

functions
parameters
return_values
default_arguments
named_arguments
lambdas

lists
sets
maps
map_function
filter_function
reduce_function
collection_operations

classes
objects
constructors
properties
inheritance
interfaces
data_classes
enums
sealed_classes

scope_functions
extension_functions
generics
smart_casts
destructuring
exceptions

coroutines
suspend
dispatchers
async_await
flow

compose
state
viewmodel
navigation
architecture
networking
room
firebase

projects
debugging
problem_solving
code_reading
```

---

# 12. Skill Mastery Data

For each skill track:

```text
skillId
masteryPercent
attempts
correctAttempts
incorrectAttempts
lastPracticedAt
lastMistakeAt
mistakeCount
```

Mastery should be influenced by:

- Correct answers
- Difficulty
- Recency
- Repeated mistakes
- Successful review
- Boss performance

Do not make mastery rise simply because a lesson was opened.

---

# 13. Mistake Data

Every incorrect answer records:

```text
questionId
skillId
mistakeCount
lastMistakeDate
```

Optional future fields:

```text
errorCategory
attemptsBeforeCorrect
reviewCount
masteryBefore
masteryAfter
```

Mistake data feeds Practice.

---

# 14. Adaptive Practice

Practice must use the user's data.

Priority order:

1. Repeated mistakes
2. Low mastery
3. Recently introduced skills
4. Skills due for review
5. Random reinforcement

Never simply repeat the exact same question.

For example:

If the user struggles with loops:

```text
for loops
while loops
ranges
nested loops
loop control
```

should all become candidates.

Create variations using different code, values, wording, and challenge types.

---

# 15. Daily Content Structure

Each day should have:

```text
Core lessons
Practice recommendations
Daily quests
Daily battle
Optional mastery challenge
```

Example:

```text
DAY 37

Core:
Lesson A
Lesson B
Lesson C

Practice:
Functions — 5 questions

Quest 1:
Complete 2 lessons

Quest 2:
Answer 10 questions

Quest 3:
Fix 2 bugs

Battle:
10 questions / 5 minutes

Optional:
Function Boss
```

---

# 16. Content Volume Targets

Target over the initial 90-day product:

### Core lessons
Approximately 180–270 meaningful lesson units depending on final daily grouping.

### Core challenges
At least 5 per lesson.

### Practice variants
Hundreds of additional variants.

### Boss challenges
At least 1 meaningful boss per major world/module.

### Debugging challenges
A substantial pool across all worlds.

### Battle pool
A reusable pool selected only from unlocked skills.

### Project challenges
Enough to make projects feel interactive rather than static instructions.

Long-term target:

> **1,000+ quality challenge records/variants**

Quality is more important than raw quantity.

---

# 17. Daily Battle Data

Each battle question should have:

```text
id
skillId
difficulty
type
question
code
options
correctAnswer
explanation
```

Battle selection rules:

- Only unlocked skills
- Mix difficulties
- Avoid too many questions from one skill
- Prefer skills recently learned and mastered
- Include debugging/output questions
- Avoid repeated questions in consecutive battles

---

# 18. Daily Quest Data

Quest model:

```text
id
type
target
currentProgress
rewardXp
rewardGems
date
```

Quest types:

```text
complete_lessons
answer_questions
fix_bugs
practice_skill
complete_battle
earn_xp
get_perfect_lesson
```

Generate three quests per day.

Keep quests achievable within the user's chosen daily goal.

---

# 19. Project Data

Every project should contain:

```text
id
title
description
difficulty
estimatedMinutes
requiredSkills[]
challengeIds[]
xpReward
gemReward
badgeId
```

Project progression:

```text
Requirements
↓
Project unlocked
↓
Understand goal
↓
Complete mini challenges
↓
Build sections
↓
Debug
↓
Final challenge
↓
Project complete
↓
Badge + XP
```

Projects should feel like achievements, not long lectures.

---

# 20. Achievement Data

Achievement:

```text
id
title
description
icon
conditionType
target
rewardXp
rewardGems
```

Track progress.

Examples:

```text
Hello World
Bug Hunter
Speed Coder
Perfect
Week One
Code Warrior
100 Days
World Explorer
Loop Master
Function Master
Kotlin Master
Battle Winner
Project Builder
```

---

# 21. Content Quality Checklist

Before accepting any challenge:

### Technical correctness
- Is the Kotlin syntax valid?
- Is the output correct?
- Is the explanation correct?
- Are imports/context assumptions clear?

### Educational quality
- Does it test the intended skill?
- Is the difficulty appropriate?
- Is the answer unambiguous?
- Are distractors plausible?
- Does the explanation teach?

### Product quality
- Is it fun to answer?
- Is it short enough for mobile?
- Is it visually compatible with CodeDo?
- Does it avoid unnecessary reading?

### Data quality
- Unique ID
- Correct world
- Correct lesson
- Correct skill
- Correct difficulty
- Correct XP
- No duplicate question

---

# 22. Duplicate Detection

Before adding new data, search existing curriculum for:

- Same question
- Same code
- Same correct answer
- Same learning objective
- Near-identical wording

Duplicates are acceptable only when intentionally used as spaced repetition variants.

A repeated concept should normally use a different context or challenge type.

---

# 23. Content Generation Workflow

For every new module:

## Step 1 — Define skills

List all skills to be taught.

## Step 2 — Define prerequisites

Identify what must already be known.

## Step 3 — Define lessons

Split the module into short lessons.

## Step 4 — Define challenge objectives

Each challenge should have a clear learning objective.

## Step 5 — Generate challenges

Create varied challenge types.

## Step 6 — Validate

Check syntax, answer, explanation, difficulty.

## Step 7 — Tag

Assign:
- world
- module
- lesson
- skill
- difficulty
- challenge type

## Step 8 — Add practice variants

Create alternate questions for mastery.

## Step 9 — Add boss challenge

Test combined understanding.

## Step 10 — Update progress

Update the Content Progress section below.

---

# 24. Session Resume Protocol

When an AI session starts:

1. Read `CODEDO_PROJECT_PLAN.md`.
2. Read this file.
3. Inspect current curriculum data.
4. Read the Content Progress section.
5. Identify the first incomplete item.
6. Continue from that exact point.
7. Do not recreate completed content.
8. Validate new content.
9. Update this file before ending the session.

Never assume content generation starts from Day 1.

---

# 25. Content Progress Tracker

Update this section after every meaningful content-generation session.

## World 1 — Foundations

```text
Status: [PARTIALLY COMPLETED]
Lessons: 3 / 8 core lessons seeded with rich multi-challenge pools
Challenges: 8 core + multiple variants
Practice variants: 3
Boss: [ ] 
Validation: [x] Validated TypeScript & Kotlin syntax
```

## World 2 — Logic

```text
Status: [PARTIALLY COMPLETED]
Lessons: 2 / 5 core lessons seeded
Challenges: 4
Practice variants: 2
Boss: [ ] 
Validation: [x] Validated TypeScript & Kotlin syntax
```

## World 3 — Loops

```text
Status: [PARTIALLY COMPLETED]
Lessons: 2 / 5 core lessons seeded
Challenges: 3
Practice variants: 1
Boss: [ ] 
Validation: [x] Validated TypeScript & Kotlin syntax
```

## World 4 — Functions

```text
Status: [NOT STARTED]
Lessons: 0 / target
Challenges: 0 / target
Practice variants: 0 / target
Boss: [ ] 
Validation: [ ]
```

## World 5 — Collections

```text
Status: [NOT STARTED]
Lessons: 0 / target
Challenges: 0 / target
Practice variants: 0 / target
Boss: [ ] 
Validation: [ ]
```

## World 6 — OOP

```text
Status: [NOT STARTED]
Lessons: 0 / target
Challenges: 0 / target
Practice variants: 0 / target
Boss: [ ] 
Validation: [ ]
```

## World 7 — Kotlin Mastery

```text
Status: [NOT STARTED]
Lessons: 0 / target
Challenges: 0 / target
Practice variants: 0 / target
Boss: [ ] 
Validation: [ ]
```

## World 8 — Coroutines

```text
Status: [NOT STARTED]
Lessons: 0 / target
Challenges: 0 / target
Practice variants: 0 / target
Boss: [ ] 
Validation: [ ]
```

## World 9 — Android

```text
Status: [NOT STARTED]
Lessons: 0 / target
Challenges: 0 / target
Practice variants: 0 / target
Projects: 0 / target
Validation: [ ]
```

## World 10 — Projects

```text
Status: [NOT STARTED]
Projects: 0 / target
Project challenges: 0 / target
Validation: [ ]
```

---

# 26. Current Content Cursor

This is the most important resume field.

Update it after every session.

```text
Current World: World 1 — Kotlin Foundations
Current Day: Day 1-3
Current Module: foundations (Variables, Operators, Data Types)
Current Lesson: W1-L02 / operators
Last Completed Challenge: W1-OP-02
Next Item: Expand World 1 remaining lessons (val vs var, Strings, String Templates, Null Safety) & World 2 logic boss
```

---

# 27. Content Session Log

Append one entry after each content session.

```text
## 2026-09-04

Completed:
- Migrated curriculum architecture into modular repositories under /src/data/curriculum/
- Initialized World 1 (Foundations), World 2 (Logic), World 3 (Loops) question pools
- Created 10-question Daily Battle Arena question bank
- Established zero-dependency syntax highlighter and challenge badges

Added:
- Typed interfaces for ChallengeType, UserMistake, WorldMeta, DailyQuest
- StorageManager with calendar-based reset and mistake tracking

Validated:
- Clean TypeScript linting and Vite build compilation

Issues:
- Need to expand the core 36 lesson foundation across all 10 worlds to reach the full 90-day scope

Next:
- Expand World 1 and World 2 challenges, implement daily quest generation and 3-lesson completion gate
```

---

# 28. Content IDs

Use stable IDs.

Recommended:

```text
W1-L01
W1-L01-C01
W1-L01-C02

W2-L03
W2-L03-C01
```

Skills:

```text
skill.variables
skill.null_safety
skill.if_else
```

Projects:

```text
project.number_guessing
project.quiz_game
```

Achievements:

```text
achievement.hello_world
achievement.bug_hunter
```

Never rename IDs after they are referenced by user progress unless a migration is explicitly created.

---

# 29. JSON/TypeScript Data Example

Conceptual lesson:

```ts
const lesson: Lesson = {
  id: "W1-L02",
  worldId: "W1",
  moduleId: "foundations",
  order: 2,
  title: "Variables",
  shortDescription: "Store and use values in Kotlin.",
  estimatedMinutes: 3,
  skills: ["variables", "type_inference"],
  difficulty: "beginner",
  xp: 30,
  challengeIds: [
    "W1-L02-C01",
    "W1-L02-C02",
    "W1-L02-C03",
    "W1-L02-C04",
    "W1-L02-C05"
  ],
  prerequisiteLessonIds: ["W1-L01"]
};
```

---

# 30. Current Status

```text
90-Day curriculum design:
[x] Planned
[x] World 1 data (8 lessons, 40 questions complete)
[x] World 2 data (5 lessons + Logic Boss, 26 questions complete)
[x] World 3 data (5 lessons + Loop Boss, 26 questions complete)
[x] World 4 data (7 lessons + Function Boss, 36 questions complete)
[x] World 5 data (6 lessons + Object Architect Boss, 31 questions complete)
[x] World 6 data (6 lessons + Stream Weaver Boss, 31 questions complete)
[x] World 7 data (5 lessons + Type Alchemist Boss, 26 questions complete)
[x] World 8 data (5 lessons + Async Overlord Boss, 26 questions complete)
[x] World 9 data (5 lessons + Compose Architect Boss, 26 questions complete)
[ ] World 10 data (Real-World Applied Projects)

Validation:
[x] Schema validation
[x] TypeScript compilation
[x] Comprehensive duplicate detection
[x] Kotlin correctness review
[x] Difficulty review
[x] Mobile UX review
```
