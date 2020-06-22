# OptiisticCounter - an experiment with optimistic UI in Phoenix LiveView

During [Elixir Conf Virtual 2020](https://virtual.elixirconf.eu/)
Chris talked about the current state and future of [Phoenix LiveView](https://hexdocs.pm/phoenix_live_view/Phoenix.LiveView.html).
LiveView has an excellent programming model similar to React+Redux or Elm Architecture based on Erlang's GenServer.
It makes it suitable to build sophisticated user interfaces or even simple games.

The model goes like this:
- The user interacts with the website in the browser
- JS part of LiveView sends an event to the server
- The server part of LiveView processes an event changing state
- Server pushes minimal changes to update the DOM in browser

There is a small problem with latency which makes it unsuitable for games.
Every event (click, keypress) needs to make a roundtrip to the server before updating the UI.
The latency is small enough to feel snappy in forms and business logic but can too high for games.
You can try playing this [multiplication game](https://live-view-math.herokuapp.com/) to see what I mean.
(the UI is for mobile, on desktop you can use your keyboard)

Such games are better fit for a client-side framework. 

However, if I want to make a multiplayer version of such a game where people compete to get the best score,
I would still love to use LiveView.

I wondered if it is possible to have both.

# How to test the POC

To start your Phoenix server:

  * Install dependencies with `mix deps.get`
  * Create and migrate your database with `mix ecto.setup`
  * Install Node.js dependencies with `npm install` inside the `assets` directory
  * Start Phoenix endpoint with `mix phx.server`
  * Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.
  * open JS console and type: `liveSocket.enableLatencySim(1000);`

There is only one button to increment the counter. Click it to see how the client counter and the server counter change over time with simulated latency.

# How does it work?

We have two counters, the client one we will try update with zero latency. The server one is our source of truth, but it might lag. It might be hidden from the user.

The increment action is defined twice:
- for the client counter in the button on click event
- for the server counter in regular "handle_event" callback

Both client and server keep their internal logical clock.
It is a simplified version of the vector clock algorithm.
The server processes all events from client plus server-initiated ones. That means the client clock can never outpace server one.

We overwrite the optimistic client counter only after server one catches up.

# Why I feel this is important?

The problem of latency pops up in some design decisions in LiveView. E.g. you can't set `input` value in `handle_event` because typing fast caused could send multiple keystrokes to a server and after processing first one, the state from the server would overwrite whatever user typed so far.

Incorporating this simplified vector clock to all LV events would elegantly solve that problem.

## Learn more

  * Official website: https://www.phoenixframework.org/
  * Guides: https://hexdocs.pm/phoenix/overview.html
  * Docs: https://hexdocs.pm/phoenix
  * Forum: https://elixirforum.com/c/phoenix-forum
  * Source: https://github.com/phoenixframework/phoenix
