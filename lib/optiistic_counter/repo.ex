defmodule OptiisticCounter.Repo do
  use Ecto.Repo,
    otp_app: :optiistic_counter,
    adapter: Ecto.Adapters.Postgres
end
