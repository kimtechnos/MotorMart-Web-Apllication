import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Contact from "./Contact";

describe("Contact", () => {
  it("sends the form to the contact API", async () => {
    const fetchMock = vi.fn(
      async () =>
        new Response(JSON.stringify({ success: true, message: "Message sent successfully" }), {
          status: 201,
        }),
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<Contact />);
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Amina Otieno" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "amina@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Message"), {
      target: { value: "Can I see the Axio on Saturday?" },
    });
    fireEvent.click(screen.getByLabelText("Send Message"));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Message sent successfully",
    );
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.email).toBe("amina@example.com");
    expect(fetchMock.mock.calls[0][0]).toContain("/api/contact");
  });
});
