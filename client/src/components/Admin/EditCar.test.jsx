import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import EditCar from "./EditCar";

describe("EditCar", () => {
  it("loads the existing vehicle and saves numeric year and price", async () => {
    const fetchMock = vi.fn(async (url, options = {}) => {
      if (options.method === "PATCH") {
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }
      return new Response(
        JSON.stringify({
          id: "car-1",
          make: "Toyota",
          model: "Axio",
          year: 2018,
          price: 900000,
          description: "older",
          imageUrl: "http://example.com/axio.png",
        }),
        { status: 200 },
      );
    });
    vi.stubGlobal("fetch", fetchMock);

    render(
      <MemoryRouter initialEntries={["/admin/edit-car/car-1"]}>
        <Routes>
          <Route path="/admin/edit-car/:id" element={<EditCar />} />
          <Route path="/admin/manage-cars" element={<p>Inventory</p>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByDisplayValue("Toyota")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Model"), {
      target: { value: "Fielder" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Inventory")).toBeInTheDocument();
    const patchCall = fetchMock.mock.calls.find((call) => call[1]?.method === "PATCH");
    const body = JSON.parse(patchCall[1].body);
    expect(body.model).toBe("Fielder");
    expect(body.year).toBe(2018);
    expect(body.price).toBe(900000);
  });
});
