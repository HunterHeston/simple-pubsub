# Simple PubSub

Simple pubsub provides a topic based publish subscribe framework built on top of express.js.


## About
This repo contains the source for three objects.
* Server
* Receiver
* Writer

### Server
This class has three main jobs:
1. Accept registrations for `messages` on a `topic` by the `Receiver` class.
2. Allow `Writers` to publish messages on a `topic`. 
3. Route `messages` to `Receivers` who registered for a given `topic`.

### Receiver
The two main jobs of a receiver are:
1. Allow users of this class to register for `messages` on a given `topic`.
2. Allow users of this class to trigger classbacks when `messages` are received on a given `topic`.

### Writer
The only job of this class is to allow users to write `messages` on a `topic`.

