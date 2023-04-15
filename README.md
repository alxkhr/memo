# roadmap

- design
  - list / search
  - login / register
  - dark mode
- fix render bug (loop) with setSupportCoords
  - reproduce: choose first suggestion after typing #
  - reproduce: maybe bbecause of double ##
- mobile version
- what happens with sync on logout?
  - only critical if user logs in as a different user, two options...
    - copy memos -> delete last sync in localStorage
    - delete db and las sync, warn that unsynced memos will be lost
- refresh token
- ux
  - undo or confirm when deleting
- test
  - sync with two connected devices
  - sync with two users
  - switch users on a device

# ideas

- pwa for offline
- logo
- connection status always visible in header (connected or not, unreachable server...)
- autofocus textarea when details are opened (maybe use forward ref for textarea)
- close the suggestions on esc and on choosing one (fixes new line after tag bug)
- really responsive design
  - list beneath details on desktop
- support more content types (links, drawings, photos, todo-list)
- support more search/filter/sort/visualize stategies (lost notes in a calender?)
- tag support for search input
- save searches & "dashboard" / most used searches
- support bulk operations (ie. for a whole search result list)
- two-factor login / associated devices
- test automation

# known bugs

- not able to make new line after tag
