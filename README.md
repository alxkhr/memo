# roadmap

- test
  - sync with two connected devices
  - sync with two users
  - account switching sideeffect: account re-login: login, sync, logout, login, sync (duplicates?)
  - switch users on a device

# ideas

- fix some known bugs
- fix some todos in code
- solve account switching
  - idea: offer delete db when logged out
- pwa for offline
- logo + favicon
- dark mode
- connection status always visible in header (connected or not, unreachable server, synchronizing-spinner...)
- autofocus textarea when details are opened (maybe use forward ref for textarea)
- close the suggestions on esc and on choosing one (fixes new line after tag bug)
- really responsive design
  - list beneath details on desktop
  - suggestions not as dropdown on mobile, maybe over keyboard
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
- undefined token on client after internal server error
