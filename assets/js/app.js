// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import "../css/app.scss"

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import deps with the dep name or local files with a relative path, for example:
//
//     import {Socket} from "phoenix"
//     import socket from "./socket"
//
import "phoenix_html"
import {Socket} from "phoenix"
import NProgress from "nprogress"
import {LiveSocket} from "phoenix_live_view"

let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")

let Hooks = {}
Hooks.ServerCounter = {
  updated() {
    let client_clock = parseInt(document.getElementById("client_clock").innerHTML);
    let server_clock = parseInt(document.getElementById("server_clock".innerHTML));
    let client_counter = document.getElementById("client_counter");
    let server_counter = parseInt(document.getElementById("server_counter").innerHTML);
    if (client_clock <= server_clock) {
      client_counter.innerHTML = server_counter;
      client_clock.innerHTML = server_clock;
    }
  }
}
Hooks.Button = {
  mounted() {
    this.el.addEventListener("click", e => {
      let client_clock = document.getElementById("client_clock");
      let client_counter = document.getElementById("client_counter");
      client_clock.innerHTML = parseInt(client_clock.innerHTML) + 1;
      client_counter.innerHTML = parseInt(client_counter.innerHTML) + 1;
    })
  }
}

let liveSocket = new LiveSocket("/live", Socket, {hooks: Hooks, params: {_csrf_token: csrfToken}})

// Show progress bar on live navigation and form submits
window.addEventListener("phx:page-loading-start", info => NProgress.start())
window.addEventListener("phx:page-loading-stop", info => NProgress.done())

// connect if there are any LiveViews on the page
liveSocket.connect()

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)
window.liveSocket = liveSocket
