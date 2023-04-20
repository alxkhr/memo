# roadmap

- refresh token
  - fix login and register on server
  - use newToken on client
    - always add auth-header, if token exists (read from memory, not localstorage)
    - refresh token if not authorized
    - show login if not authorized to refresh
- ux
  - undo or confirm when deleting
- run it on own server
  - database
  - local keys etc
- mobile version
- server logs
- test
  - sync with two connected devices
  - sync with two users
  - account switching sideeffect: account re-login: login, sync, logout, login, sync (duplicates?)
  - switch users on a device

# ideas

- solve account switching
  - idea: offer delete db when logged out
- pwa for offline
- logo
- dark mode
- connection status always visible in header (connected or not, unreachable server, synchronizing-spinner...)
- autofocus textarea when details are opened (maybe use forward ref for textarea)
- close the suggestions on esc and on choosing one (fixes new line after tag bug)
- immediately sync when connect
- sync now button in connect-screen
- really responsive design
  - list beneath details on desktop
- semantic html
  - tags: ie. header, navigation
- support more content types (links, drawings, photos, todo-list)
- support more search/filter/sort/visualize stategies (lost notes in a calender?)
- tag support for search input
- save searches & "dashboard" / most used searches
- support bulk operations (ie. for a whole search result list)
- two-factor login / associated devices
- test automation

# known bugs

- not able to make new line after tag
