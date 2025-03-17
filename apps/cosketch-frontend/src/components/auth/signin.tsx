"use client";

import React, { useState } from "react";
import { Input, InputPassword } from "@/components/forms/input";
import Link from "next/link";
import { X } from "lucide-react";
import siteMetadata from "@/data/siteMetadata";
import Animation from "@/components/animation";
import { Button } from "@/components/forms/button";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className="flex justify-center items-center md:h-screen h-[90vh] w-screen bg-bggreen">
      <section className="p-4 shadow-md w-full mx-6 sm:max-w-md max-w-sm rounded-md bg-white">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-bold text-secondary">
            <Animation type="underline" color="#93C5FD">
              Sign in
            </Animation>{" "}
          </h2>
          <Link href="/" className="text-secondary hover:text-primary">
            <X size={22} />
          </Link>
        </div>
        <p className="text-sm text-gray-700 mb-6">{siteMetadata.slogan}</p>
        {/* <form onSubmit={handleSignup} className="space-y-4"> */}{" "}
        <Input
          title={"Email"}
          placeholder={"Enter your Email"}
          type={"email"}
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputPassword
          title={"Password"}
          placeholder="Enter your password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="pt-2">
          <Button
            text={"Sign in"}
            onClick={() => {}}
            type="submit"
            disabled={false}
          />
        </div>
        {/* </form> */}
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Create an account?{" "}
            <Link
              href="/signup"
              className="text-primary-darkest  hover:text-primary font-medium hover:underline transition-all duration-300"
            >
              Sign up
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Signin;
