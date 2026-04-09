## Why

Users have no visibility into how much they've used the tool during a session. A simple counter in the header provides immediate feedback and reinforces the value delivered each time a spec is generated.

## What Changes

- Add a session counter component to the app header
- Track the number of specs successfully generated during the current browser session
- Counter increments on each successful API response from the spec generation endpoint
- Counter resets on page reload (no persistence — in-memory state only)

## Capabilities

### New Capabilities

- `session-spec-counter`: Displays a live count of specs generated in the current session, shown in the header, incremented on each successful spec generation API call, reset on page reload.

### Modified Capabilities

<!-- No existing spec-level requirements are changing -->

## Impact

- **Components**: New `SpecCounter` component (or inline in header)
- **State**: `useState` counter lifted to the appropriate level to share between the generation form and the header
- **API layer**: Success callback from the spec generation API call triggers the increment
- **No persistence**: No `localStorage`, `sessionStorage`, or database writes
