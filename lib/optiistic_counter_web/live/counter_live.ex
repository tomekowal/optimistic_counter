defmodule OptiisticCounterWeb.CounterLive do
  use OptiisticCounterWeb, :live_view

  @impl true
  def mount(_params, _session, socket) do
    {:ok, assign(socket, counter: 10, server_clock: 0)}
  end

  @impl true
  def handle_event("inc", _, socket) do
    new_counter = socket.assigns.counter + 1

    socket
    |> assign(counter: new_counter)
    |> noreply
  end

  defp noreply(socket) do
    {:noreply, assign(socket, server_clock: socket.assigns.server_clock + 1)}
  end
end
