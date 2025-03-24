import ClientSignupForm from "./ClientSignupForm"
import AuthLink from "./AuthLink"

export default function SignupForm() {
  return (
    <div className="w-full max-w-3xl">
      <h1 className="text-[#ff6868] text-4xl font-bold text-center mb-12">Welcome to Tintern!</h1>

      <ClientSignupForm />

      <div className="text-center mt-6">
        <p className="text-[#d9d9d9]">
          Already have an account?
          <AuthLink href="/auth/login">
            <span className="ml-1">Sign In</span>
          </AuthLink>
        </p>
      </div>
    </div>
  )
}

