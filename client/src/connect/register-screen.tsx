import React from "react";

export function RegisterScreen() {
  return (
    <div>
      <h1>Register</h1>
      <form>
        <input />
        <button
          onClick={(e) => {
            e.preventDefault();
            fetch("/api/user/create", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                username: "u",
                password: "p",
                deviceId: "d",
                key: "fakekey",
              }),
            });
          }}
        >
          Create Account
        </button>
      </form>
    </div>
  );
}
