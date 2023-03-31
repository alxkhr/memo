# roadmap

- sync/merge client and server database
  - sync only if logged in / connected and online
  - what happens on logout?
    - only critical if user logs in as a different user, two options...
      - copy memos -> delete last sync in localStorage
      - delete db and las sync, warn that unsynced memos will be lost
- refresh token
- tag insert support
- search for tags in list
- design
- pwa for offline
- two-factor login / associated devices
