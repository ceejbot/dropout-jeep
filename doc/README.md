# dropout-jeep

Dropout-jeep is kink memes as a service. The goal is to do it on the cheap (aka efficiently) and then charge enough money to make it self-sustaining.

## why the name

I own the domain. It's an NSA data-stealing technology code-name. This amuses me.

## features

Stable accounts: you must be logged in to play. Your email address is never shown, but moderators of a meme see an opaque ID that is stable. This gets you anonymous posters that can be banned for repeated bad behavior.

Accounts are free.

Creating a meme is a for-pay feature. $12/year gets you a meme.

Email notifications are a for-pay feature with a recurring monthly or yearly cost. $12/year gets you all the email you want. [Or is there a limit?]

Create a kink meme. Fill out some information about the meme, create a new event for it, and then advertise it elsewhere.

Meme owners may add moderators to a meme. Moderators can create new events; ban users from a specific meme; delete or hide prompts, fills, and comments; freeze prompts or fills.

Event is the equivalent of a "post" on the old LJ kink meme. It can be open for a fixed time span or can be closed by hand. Closed events no longer accept new prompts or fills; users may continue to post comments.

Logged-in users may post prompts, fills, and comments. Paid-up logged-in users can also subscribe to notifications for fills/comments on prompts (they're auto-subscribed to their own prompts), new prompts on a post, or new prompts on a meme. [Too many options? What do people really *want* to subscribe to, as opposed to what they're forced to do on LJ?]

## data

user
- email
- password
- link to payment
- opaque internal ID
- opaque external ID (to display to moderators)

meme
- internal ID
- owned by a user (opaque internal ID)
- list of moderators mapped to list of visible mod pseudonyms
- payment status ?
- header information of some kind (title, banner, rules, whatever)
- boolean indicating whether you need to be logged in to see it (this feature has implications)
- list of events
- list of banned users
- list of users to be notified on activity

event
- internal ID
- owned by a meme
- meta information: timestamps, state (open, closed)
- title (plaintext)
- body (sanitized html or markdown)
- auto-generated prompt/fill index
- list of prompts
- list of users to be notified on activity

prompt
- internal ID
- owned by a user (opaque internal ID)
- meta information: timestamps, state (open, filled, hidden, frozen)
- body (sanitized html or markdown)
- list of fills
- list of comments
- list of users to be notified on activity

fill
- internal ID
- owned by a user (opaque internal ID)
- meta information: timestamps, state (hidden, frozen)
- title (plaintext)
- body (sanitized html or markdown)
- list of comments
- list of users to be notified on activity

comment
- internal ID
- owned by a user (opaque internal ID)
- meta information: timestamps, state (hidden)
- body (sanitized html or markdown)
- note that comments are NOT threaded

## basic approach

Write static html page chunks & serve those via nginx server-side includes. Do this for all page content that might normally be driven by a database: this is a caching mechanism. All the plaintext page chunks can be fully regenerated from the database if necessary with a command-line tool.

In some cases we'll assemble a db-backed page via a template engine in the traditional manner.

Beanstalkd stores a list of pages to regenerate. A worker peeks at the oldest page, generates it, then marks it as done.

Some pages should be backed by a webservice & a db; e.g. user profile pages, ban lists, etc.

## views

### cached static page chunks

- meme top view: header info & list of events
- meme event view: header info, list of fills, list of unfilled prompts
- prompt view
- fill view (prompt, fill, comments)
- user page (other than self)

### live db-backed views

- user page (self)
- payment pages
- forms that require csrf tokens (which is probably all forms)
- moderator view for meme (ban list? other things)

## data storage

RethinkDB. Why not. Use it in something serious!

Beanstalkd for work queues.

Redis for tokens/expiring data/caches.

## required services

- recurring payments processor (Stripe probably)
- email api (I like Mailgun)
- no SMS requirements unless I choose that for 2-factor auth, in which case Twilio
