import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import CarDetail from "./CarDetail";

const renderDetail = () =>
  render(
    <MemoryRouter initialEntries={["/cars/car-1"]}>
      <Routes>
        <Route path="/cars/:id" element={<CarDetail />} />
      </Routes>
    </MemoryRouter>,
  );

describe("CarDetail", () => {
  it("shows the vehicle returned by the API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              id: "car-1",
              make: "Toyota",
              model: "Axio",
              year: 2020,
              price: 1500000,
              description: "A clean sedan",
              imageUrl: "/car.png",
            }),
            { status: 200 },
          ),
      ),
    );

    renderDetail();

    expect(await screen.findByRole("heading", { name: "Toyota Axio" })).toBeInTheDocument();
    expect(screen.getByText("A clean sedan")).toBeInTheDocument();
  });

  it("shows a missing state when the vehicle does not exist", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify({ success: false, message: "Car not found" }), {
            status: 404,
          }),
      ),
    );

    renderDetail();

    expect(
      await screen.findByText("That vehicle is no longer listed."),
    ).toBeInTheDocument();
  });
});
