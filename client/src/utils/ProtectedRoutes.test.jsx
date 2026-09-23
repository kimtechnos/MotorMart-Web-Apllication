import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
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

describe("ProtectedRoutes", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("redirects guests to login", () => {
    renderProtectedAdminRoute();

    expect(screen.getByText("Login page")).toBeInTheDocument();
  });

  it("redirects users without the allowed role", () => {
    window.localStorage.setItem("authToken", "token");
    window.localStorage.setItem("userRole", "user");

    renderProtectedAdminRoute();

    expect(screen.getByText("Unauthorized page")).toBeInTheDocument();
  });

  it("renders the nested route for an allowed user", () => {
    window.localStorage.setItem("authToken", "token");
    window.localStorage.setItem("userRole", "admin");

    renderProtectedAdminRoute();

    expect(screen.getByText("Admin dashboard")).toBeInTheDocument();
  });
});
