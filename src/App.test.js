import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the Weather App title", () => {
  render(<App />);
  expect(screen.getByText(/Weather App/i)).toBeInTheDocument();
});

test("shows validation error when submitting empty city", async () => {
  render(<App />);
  const button = screen.getByRole("button", { name: /get weather/i });
  button.click();
  expect(await screen.findByRole("alert")).toHaveTextContent(/please enter a city name/i);
});
