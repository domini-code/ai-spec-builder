## ADDED Requirements

### Requirement: Session counter displayed in header
The generator page header SHALL display the number of specs successfully generated during the current browser session. The counter SHALL be visible at all times once the page is loaded, starting at zero.

#### Scenario: Initial state on page load
- **WHEN** the user loads or reloads the generator page
- **THEN** the counter SHALL display zero (or be hidden when count is 0)

#### Scenario: Counter increments after successful generation
- **WHEN** a spec is successfully generated (API call completes without error and result is rendered)
- **THEN** the counter SHALL increment by exactly one

#### Scenario: Counter does not increment on failed generation
- **WHEN** the spec generation API call returns an error or the stream is interrupted before completion
- **THEN** the counter SHALL NOT change

#### Scenario: Counter resets on page reload
- **WHEN** the user reloads or navigates away and back to the generator page
- **THEN** the counter SHALL reset to zero

### Requirement: No persistence of session counter
The session counter SHALL NOT be stored in any persistent medium, including localStorage, sessionStorage, cookies, or any backend store.

#### Scenario: Counter is not persisted after reload
- **WHEN** the user generates 3 specs, then reloads the page
- **THEN** the counter SHALL show 0, not 3

#### Scenario: Counter is independent per tab
- **WHEN** the user opens two tabs of the generator page and generates specs in each tab independently
- **THEN** each tab SHALL maintain its own counter with no synchronization between tabs
