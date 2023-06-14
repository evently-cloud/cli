Changelog
=========

0.3.2 (????-??-??)
------------------

* Added selector:replay command


0.3.1 (2023-06-11)
------------------

* Add a description for list-entities and list-events.
* Fix for ledger:download. This command was broken due to a bug in an
  underlying library.


0.3.0 (2023-06-05)
------------------

* Added `append:list`, `append:serial` and `append:fact` commands.


0.2.0 (2023-04-23)
------------------

* Auto-generate readme with oclif.
* Added support for registry:delete command, to delete events from the
  registry.
* Added registry:list-entities command.
* Added registry:list-events command.
* Documentation fixes.


0.1.0 (2023-03-29)
------------------

* Added the `registry:new` command, allowing you to add new event types to the
  registry.
* Added support for the `EVENTLY_BOOKMARK` environment variable, letting users
  change the main API endpoint.
* Switched to using Ketting.
* Using ESLint.
* First time published on npmjs.org.


0.0.1 (2023-02-27)
------------------

* Initial version using undici.
