## 1. State Management

- [x] 1.1 Add `sessionCount` state (`useState(0)`) to `app/generator/page.tsx`
- [x] 1.2 Increment `sessionCount` inside `handleResult` after setting the spec

## 2. UI

- [x] 2.1 Add counter display to the header `<div>` in `app/generator/page.tsx` — show "X specs generated this session" (hide or show "0" when count is 0, per design choice)
- [x] 2.2 Style the counter badge with Tailwind (subtle pill or inline text alongside the title/subtitle)

## 3. Verification

- [x] 3.1 Confirm counter starts at 0 on page load
- [x] 3.2 Confirm counter increments by 1 after each successful spec generation
- [x] 3.3 Confirm counter resets to 0 after a page reload
- [x] 3.4 Confirm counter does NOT increment when the API call fails
