# Linear task template (Todo)

Every Linear issue for this repo follows the structure below. **The issue itself is written in
Russian**: the title, the section headings exactly as shown, the body, and the checklist lines.
This file explains each section in English. The `linear-tasks` skill uses it as the source of
structure when creating issues.

Drop empty or irrelevant sections — no placeholders. Sections marked _(optional)_ are added only
when there is something to say.

Issue metadata: project **Todo**, the milestone matching the area of work (Фундамент, Ядро,
Фильтры, Визуал, Хранилища, Аудит, Полировка), state `Todo`, type labels (`Feature` /
`Improvement` / `Bug` / `UI` / `Infra` / `AI`). Use a "blocked by" relation only for a real
technical dependency; otherwise "related".

The title stays short; specifics go into the body.

---

## Порядок _(optional)_

Which issues (`MY-<n>`) this one comes after and why, and which issues build on it.

## Зачем

The problem or gap today and what should change. One or two paragraphs, grounded in the code
(folder, component, current behavior), focused on the result a user sees.

## Что сделать

A numbered list of concrete steps:

- which folders, components, styles, and stored data are touched;
- states and edge cases: keyboard and touch, an open panel, an empty list, a reload, blocked or
  broken storage, a second tab, `prefers-reduced-motion`, 320px width, both themes;
- anything to be decided in the plan — phrase it as «решить в плане»; the assignee then stops after
  the plan commit and waits for the author's approval.

## Решения автора (<date>) _(optional)_

The author's answers given before the work starts — final for the assignee.

## Готово когда

Observable criteria that can be checked by hand — not "done", but "when X, the app does Y".

## Риски и крайние случаи _(optional)_

What can break and which other issues it affects.

## Вне скоупа _(optional)_

What is deliberately excluded — adjacent work goes into separate issues, linked.

## Обязательно проверить и обновить

Keep the relevant lines, delete the rest. Copy them into the issue as-is:

- [ ] `ai/superpowers/` — план (+ спека, если меняется поведение) одним коммитом до кода
- [ ] `README.md` — фичи, скрипты, структура
- [ ] `ai/map.md` — если добавлен, переименован или удалён файл, папка, ключ storage или скрипт
- [ ] `ai/rules/*`, `ai/skills/*` — если изменился паттерн
- [ ] `ai/decisions/` — датированная запись, если зафиксировано долгоживущее решение
- [ ] Доки в пределах лимитов `ai/rules/docs.md`; если лимит превышен — сократить

## Проверка

Copy into the issue, one line per check under "Verification" in `AGENTS.md`, plus the manual line:

- [ ] `pnpm lint`
- [ ] `pnpm format:check`
- [ ] `pnpm build`
- [ ] Прогнано руками в `pnpm dev`: десктоп (клавиатура, мышь), 320px, обе темы

The project has no automated tests — verification is the checks and using the app in the browser.
