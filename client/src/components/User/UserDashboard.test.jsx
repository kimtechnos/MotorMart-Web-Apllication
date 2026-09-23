import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useUserStore from "../../store/useUserstore";
import UserDashboard from "./UserDashboard";

describe("UserDashboard", () => {
  beforeEach(() => {
    useUserStore.setState({
      user: {
        id: "user-1",
        fullName: "Amina Otieno",
        email: "amina@example.com",
        phoneNumber: "0712000000",
        role: "user",
      },
    });
    vi.restoreAllMocks();
  });

  it("shows the signed-in profile and that person's inquiries", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              success: true,
              data: [
                {
                  id: "inq-1",
                  message: "Is this still available?",
                  car: { id: "car-1", make: "Toyota", model: "Axio", year: 2020 },
                },
              ],
            }),
            { status: 200 },
          ),
      ),
    );

    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>,
    );

    expect(screen.getByText("Welcome, Amina Otieno")).toBeInTheDocument();
    expect(screen.getByText("amina@example.com")).toBeInTheDocument();
    expect(await screen.findByText("Toyota Axio")).toBeInTheDocument();
    expect(screen.getByText("Is this still available?")).toBeInTheDocument();
  });
});
