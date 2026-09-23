import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./Home";

describe("Home", () => {
  it("shows validation messages when a vehicle search is submitted empty", async () => {
    const { container } = render(<Home />);

    fireEvent.submit(container.querySelector("form"));

    expect(
      await screen.findByText("Vehicle type is required"),
    ).toBeInTheDocument();
    expect(screen.getByText("Vehicle year is required")).toBeInTheDocument();
    expect(screen.getByText("Vehicle model is required")).toBeInTheDocument();
    expect(screen.getByText("Vehicle price is required")).toBeInTheDocument();
  });
});
