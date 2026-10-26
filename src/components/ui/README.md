# ui/ — примітиви

Правила — у `CLAUDE.md`. Тут перелік того, що є зараз.

| примітив | що це |
|---|---|
| `Button` | два варіанти: `light` (головна, біла, чорний текст), `outline` (друга, контур `tertiary`); розміри `sm` 36, `md` 48; `active` для вибраного стану; повне скруглення |
| `ScrollHeading` | заголовок секції, що заповнюється білим за скролом (Heading + ScrollFill в одному): усі заголовки секцій сайту |
| `SectionLabel` | підпис над сіткою: eyebrow виїжджає, лінія розтягується («Latest & Greatest», «Our team») |
| `Calendar` | календар місяця для «Book a call»: стрілки, дні тижня, сітка днів (доступний — контур, вибраний — білий, недоступний — сірий) |
| `TextField` | поле форми (Figma, Contact): підпис — сам плейсхолдер `lead` (білий), під ним лише нижня лінія `tertiary` (у фокусі білий), без рамки й скруглення; висота 56, `multiline` росте з текстом; `label` → `placeholder` + `aria-label` |
| `IconButton` | один розмір 48, без заливки, hover `fill` |
| `Select` | випадайка у вигляді табу `outline` (36) |
| `Heading` | `hero` (40 → 64 → 96/92 від lg, h1 першого екрана), `display` (56 → 140, h1 Work і кейсу, фінальний CTA), `statement` (40 → 64, теза секції, цифри, назва кейсу в Hero), `cell` (40 → 64 → 92/72 від xl, заголовок «Meet our team» у клітинці сітки команди; Figma 92 / 80%); Instrument Sans Medium; тони `primary`/`secondary` |
| `Text` | `quote` 28/36, `lead` 20/28, `body` 16/24, `dense` 12/16; `weight="medium"`, `uppercase`; тони `primary`/`secondary` |
| `Eyebrow` | лейбл над заголовком: Inter Medium 16, uppercase, `secondary` |
| `Section` | обгортка секції: фон `black`, gutters 24 → 40, ритм `default` / `top` |
| `Media` | фото з плейсхолдером `fill`; `next` (друге фото на hover), `hover="zoom"`, `fill` |
| `Motion` | `InView`, `Rise`, `Grow`, `Fade`, `ScrollFill`, `Roll` (поява при скролі, як на metalab.com), `Reveal` (інтро) |
| `OrbitLink` | кругле посилання «All works» з текстом по колу |
| `Cursor` | курсор-лого «ö»; над `Button light` очі радіють |
| `Logo`, `icons` | логотип; `ArrowIcon`, `ChevronDownIcon` |

Складені компоненти сайту (поза `ui/`): `Page` (шапка + вміст + CTA + курсор), `TopBar`, `WorkCard`, `WorkMosaic`.

## Токени (src/index.css)

- **Кольори:** `primary` #FFFFFF, `secondary` #999999, `tertiary` #333333 (текст і лінії); фони `black` #000000, `canvas` #0D0D0F, `fill` #1A1A1A. Суцільні, без прозорості.
- **Шрифти:** Instrument Sans (заголовки), Inter (решта). Розміри кратні 4: 12 · 16 · 20 · 28 · 40 · 56 · 64 · 96 · 128 · 140.
- **Скруглення:** `radius-control` (кнопки, повне); картки, фото й попапи — гострі кути. Тіней немає.

- **Відступи:** 4 · 8 · 12 · 16 · 24 · 32 · 40 · 64 · 80 · 120; заголовок секції → вміст = 40, великі блоки всередині = 64, картки в сітці = 12, секції = 80 → 120.

## Як змінювати
Нове значення — спочатку в токени, новий вигляд — у примітив; тут оновити таблицю. Невживане видаляти одразу.
