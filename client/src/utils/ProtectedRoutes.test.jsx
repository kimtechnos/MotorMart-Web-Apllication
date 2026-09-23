import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useUserStore from "../store/useUserstore";
import ProtectedRoutes from "./ProtectedRoutes";

const renderProtectedAdminRoute = () =>
  render(
    <MemoryRouter initialEntries={["/admin/dashboard"]}>
      <Routes>
        <Route element={<ProtectedRoutes allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<p>Admin dashboard</p>} />
        </Route>
        <Route path="/login" element={<p>Login page</p>} />
        <Route path="/unauthorized" element={<p>Unauthorized page</p>} />
      </Routes>
    </MemoryRouter>,
  );

const sessionResponse = (user, status = 200) =>
  Promise.resolve(
    new Response(JSON.stringify({ success: status === 200, data: user }), {
      status,
      headers: { "Content-Type": "application/json" },
    }),
  );

describe("ProtectedRoutes", () => {
  beforeEach(() => {
    useUserStore.setState({ user: null });
    vi.restoreAllMocks();
  });

  it("redirects guests to login", async () => {
    vi.stubGlobal("fetch", () => sessionResponse(null, 401));

    renderProtectedAdminRoute();

    expect(await screen.findByText("Login page")).toBeInTheDocument();
  });

  it("redirects users without the allowed role", async () => {
    vi.stubGlobal("fetch", () =>
      sessionResponse({ fullName: "Driver", role: "user" }),
    );

    renderProtectedAdminRoute();

    expect(await screen.findByText("Unauthorized page")).toBeInTheDocument();
  });

  it("renders the nested route for an allowed user", async () => {
    vi.stubGlobal("fetch", () =>
      sessionResponse({ fullName: "Owner", role: "admin" }),
    );

    renderProtectedAdminRoute();

    expect(await screen.findByText("Admin dashboard")).toBeInTheDocument();
  });
});
