"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Navigation from "../components/navigation"
import DecorativeElements from "../components/decorative-elements"
import "../../styles.css"


export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login attempt with:", { email, password })
  }

  return (
    <div className="page-container">
      <Navigation />
      <DecorativeElements />

      <main className="main-content">
        <div className="auth-card">
          <h1 className="card-title">Account Login</h1>

          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="submit-button">
              Login
            </button>
          </form>

          <div className="form-footer">
            <p>Don't have an account?</p>
            <Link href="/auth/signup">Sign Up</Link>
          </div>
        </div>
      </main>
    </div>
  )
}

