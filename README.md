# dropout-jeep

[![Greenkeeper badge](https://badges.greenkeeper.io/ceejbot/dropout-jeep.svg)](https://greenkeeper.io/)

Grown-up conversations about computers, programming, and software engineering, moderated when necessary. Inspired by every place I've had a good conversation online, from The WELL to Metafilter.

Many thanks to [the NSA](http://www.zerohedge.com/news/2013-12-30/how-nsa-hacks-your-iphone-presenting-dropout-jeep) for the awesome name. My tax dollars got me something nice!

## Operational requirements

- persistent disk storage for the leveldb instances
- a Redis for session storage (backed up as you see fit)

## TODO

Right now:

- way to get all comments by person
- marking posts as favorite
- embedding gists
- asset pipeline for css / js 
- pagination
- caching

Later:

- moderation implementation / admin role, display
- tags design
- API split-out
- backbone / websockets / in-browser updates
- sane data storage
- email validation [Mailgun](http://www.mailgun.com)
- payment service - which?
- invitation code OR payment required for signup
- two-factor auth with authy or sms or something
- notifications of some kind
- contract a graphic designer
- backups (Tarsnap?)

Sort of done:

- code display: syntax highlighting etc
- browserify

## License 

MIT
