import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Home from "./Home";

const renderHome = () =>
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );

describe("Home", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("shows an empty state when the search returns no vehicles", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify([]), { status: 200 })),
    );

    renderHome();

    expect(
      await screen.findByText("No vehicles match your search."),
    ).toBeInTheDocument();
  });

  it("shows a vehicle that matches the search", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url) => {
        const cars = String(url).includes("make=Toyota")
          ? [
              {
                id: "car-1",
                make: "Toyota",
                model: "Axio",
                year: 2020,
                price: 1500000,
                description: "clean",
                imageUrl: "/car.png",
              },
            ]
          : [];
        return new Response(JSON.stringify(cars), { status: 200 });
      }),
    );

    renderHome();
    fireEvent.change(screen.getByLabelText("Make"), {
      target: { value: "Toyota" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    expect(await screen.findByText("Toyota Axio")).toBeInTheDocument();
  });
});
