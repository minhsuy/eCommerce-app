import React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body items-center text-center gap-4">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-base-content/70">
            Sign in to continue to your dashboard
          </p>

          <div className="divider" />

          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn btn-primary w-full">Sign in</button>
            </SignInButton>

            <p className="text-sm text-base-content/60 mt-2">
              You’ll be redirected after signing in.
            </p>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center gap-3">
              <span className="text-sm text-base-content/70">
                You’re signed in
              </span>
              <UserButton />
            </div>

            <div className="alert alert-success w-full mt-2">
              <span>Account detected. You can continue.</span>
            </div>
          </SignedIn>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
