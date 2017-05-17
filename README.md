# timekeeper
Chrome extension to keep track of productivity


## Current State
- Keeps track of sessions using Date.now()

- Alerts on initialize

- Alerts time of elapsed session in seconds on tab change

## Needs Implementation

- Session updating needs to be more selective 
  - For instance, if two tabs have same website open
- Session needs to update based on URL change
  - Make sure just the root URL initiates a session change, not subdirectories of the URL
- Session logging - need to push old sessions into a data structure 
  - Checking if log for URL already exists
  
There's a lot more to do but those are good for now
