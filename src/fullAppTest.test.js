import {
  render,
  screen,
  act,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import App from "./App";
import userEvent from "@testing-library/user-event";
import { AuthContextProvider } from "./store/auth-context";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("full App unit test", () => {
  beforeEach(async () => {
    await act(async () =>
      render(
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      )
    );
  });

  it("Home page rendered in the initial render", () => {
    expect(
      screen.getByRole("heading", { name: /welcome on board!/i })
    ).toBeInTheDocument();
  });

  it("login form is shown if login link is clicked", async () => {
    await act(async () =>
      userEvent.click(screen.getByRole("link", { name: /login/i }))
    );
    expect(screen.getByTestId("loginform")).toBeInTheDocument();
  });
  it("signup page is rendered when create new account link is clicked", async () => {
    await act(async () =>
      userEvent.click(screen.getByRole("link", { name: /create new account/i }))
    );
    expect(
      screen.getByRole("heading", { name: /sign up/i })
    ).toBeInTheDocument();
  });

  it("cannot signup with existed email", async () => {
    jest.spyOn(window, "fetch").mockResolvedValueOnce({
      json: async () => ({
        error: {
          errors: [
            {
              message: "EMAIL_EXISTS",
            },
          ],
        },
      }),
    });

    await userEvent.type(
      screen.getByRole("textbox", { name: /your email/i }),
      "test@gmail.com"
    );
    await userEvent.type(screen.getByLabelText(/your password/i), "testttt");

    await act(async () =>
      fireEvent.submit(screen.getByRole("button", { name: /create account/i }))
    );
    expect(await screen.findByText(/email exists/i)).toBeInTheDocument();
    expect(mockNavigate).not.toBeCalled();
  });

  it("redirected to log in page if valid credentials are given", async () => {
    jest.spyOn(window, "fetch").mockResolvedValueOnce({
      ok: true,
    });

    await userEvent.type(
      screen.getByRole("textbox", { name: /your email/i }),
      "test@gmail.com"
    );
    await userEvent.type(screen.getByLabelText(/your password/i), "testttt");

    await act(async () =>
      fireEvent.submit(screen.getByRole("button", { name: /create account/i }))
    );
    expect(
      await screen.findByRole("heading", { name: /log in/i })
    ).toBeInTheDocument();
  });

  it("cannot login if email is invalid and an error message is shown", async () => {
    jest.spyOn(window, "fetch").mockResolvedValueOnce({
      json: async () => ({
        error: {
          errors: [
            {
              message: "EMAIL_NOT_FOUND",
            },
          ],
        },
      }),
    });

    await userEvent.type(
      screen.getByRole("textbox", { name: /your email/i }),
      "tesssst@gmail.com"
    );
    await userEvent.type(screen.getByLabelText(/your password/i), "test");

    await act(async () =>
      userEvent.click(screen.getByRole("button", { name: /log in/i }))
    );

    expect(await screen.findByText(/email not found/i)).toBeInTheDocument();
    expect(mockNavigate).not.toBeCalled();
  });
  it("cannot login if password is invalid and an error message is shown", async () => {
    jest.spyOn(window, "fetch").mockResolvedValueOnce({
      json: async () => ({
        error: {
          errors: [
            {
              message: "INVALID_PASSWORD",
            },
          ],
        },
      }),
    });
    await userEvent.type(
      screen.getByRole("textbox", { name: /your email/i }),
      "test@gmail.com"
    );
    await userEvent.type(screen.getByLabelText(/your password/i), "test");

    await act(async () =>
      userEvent.click(screen.getByRole("button", { name: /log in/i }))
    );

    expect(await screen.findByText(/invalid password/i)).toBeInTheDocument();
    expect(mockNavigate).not.toBeCalled();
  });
  it("logs in if a right credentials are given", async () => {
    jest.spyOn(window, "fetch").mockResolvedValueOnce({
      json: async () => ({
        idToken: "test",
        expiresIn: "3600",
      }),
      ok: true,
    });
    await userEvent.type(
      screen.getByRole("textbox", { name: /your email/i }),
      "test@gmail.com"
    );
    await userEvent.type(screen.getByLabelText(/your password/i), "123456");

    await act(async () =>
      userEvent.click(screen.getByRole("button", { name: /log in/i }))
    );

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenNthCalledWith(1, "/profile")
    );
  });

  it("cannot change password if short password is given and an error message is shown", async () => {
    jest.spyOn(window, "fetch").mockResolvedValueOnce({
      json: async () => ({
        error: {
          errors: [
            {
              message:
                "WEAK_PASSWORD : Password should be at least 6 characters",
            },
          ],
        },
      }),
    });
    await userEvent.type(screen.getByLabelText(/new password/i), "test");
    await act(async () =>
      userEvent.click(screen.getByRole("button", { name: /change password/i }))
    );
    await waitFor(() =>
      expect(
        screen.getByText(
          /weak password : password should be at least 6 characters/i
        )
      ).toBeInTheDocument()
    );
  });
  it("password changes if a right password is given", async () => {
    jest.spyOn(window, "fetch").mockResolvedValueOnce({
      json: async () => ({
        idToken: "test",
        expiresIn: "3600",
      }),
      ok: true,
    });
    await userEvent.type(screen.getByLabelText(/new password/i), "123456");
    await act(async () =>
      userEvent.click(screen.getByRole("button", { name: /change password/i }))
    );
    await waitFor(() =>
      expect(screen.getByText(/changed successfully/i)).toBeInTheDocument()
    );
  });

  it("log out if logout link is clicked", async () => {
    await act(async () =>
      userEvent.click(screen.getByRole("button", { name: /logout/i }))
    );
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenNthCalledWith(1, "/Home", {
        replace: true,
      })
    );
  });
});
