This is Headnut.

# What is "Headnut"?

It's my personal brainchild (or brainnut, if you will) for making notes that are as organized as a squirrel's stash of acorns. With "Headnut" you can finally keep track of all your brilliant ideas, random thoughts, and hilarious memes in one place - and tag them for easy retrieval later. No more searching through a haystack of notebooks or drowning in a sea of digital files. It's time to get nutty with your note-taking game!

Why did I create "Headnut"? Well, I needed a tool that could keep up with my wild and wacky mind. As someone who's always brimming with ideas, I needed a way to capture them all in a way that made sense to me. It's like a gentle "Kopfnuss" (one way translation into German) to get my brain fixed. And since sharing is caring, I thought, "Why not make it available for everyone to use?"

But don't worry, "Headnut" is like a party that everyone's invited to - whether you're a student, a professional, or just a casual note-taker, you're welcome to join in the nutty fun. Just head over to [memo.alexanderkehr.com](https://memo.alexanderkehr.com) and start jotting down your thoughts like a boss.

Now, here's the fun part - your notes are stored locally on your device, just like how you store your secret stash of snacks. But if you want to sync them across multiple devices or store them on a server, you'll need to hit me up for a key or self-host the server. Yep, that's right - I'm the nutty gatekeeper of synchronization and server storage. But hey, it's all part of the nutty charm of "Headnut," right?

So, get ready to go nuts with your note-taking game! Welcome to "Headnut" - the nuttiest place to stash your notes and tag your way to organized bliss. And remember, when life gets nutty, just grab your "Headnut" and give your note-taking game a playful touch of "Kopfnuss"! Happy note-taking! 🌰🥜📝💥

-- by ChatGPT & Github Copilot & Alex

# Roadmap and Ideas

- fix some known bugs
- fix some todos in code
- solve account switching
  - idea: offer delete db when logged out
- pwa for offline
- share target for links to (finally) be able to tag bookmarks
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

# Known Bugs

- not able to make new line after tag
- undefined token on client after internal server error
- ~umlaute in tags
- tag background offset on mobile after linebreak?
