import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { describe, expect, it } from "vitest";
import UserCarcard from "./UserCarcard";

const InquiryPage = () => {
  const { state } = useLocation();

  return <p>{`${state.carMake} ${state.carModel}`}</p>;
};

describe("UserCarcard", () => {
  it("opens an inquiry with the selected car details", () => {
    render(
      <MemoryRouter initialEntries={["/user/view-cars"]}>
        <Routes>
          <Route
            path="/user/view-cars"
            element={
              <UserCarcard
                carImg="/car.png"
                carMake="Toyota"
                carModel="Corolla"
                carYear="2024"
                carPrice="2500000"
                carDescription="A reliable sedan"
              />
            }
          />
          <Route path="/user/post-inquiry" element={<InquiryPage />} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("Toyota"));

    expect(screen.getByText("Toyota Corolla")).toBeInTheDocument();
  });
});
