import ClientLoginForm from "./ClientLoginForm"
import AuthLink from "./AuthLink"

export default function LoginForm() {
  return (
    <div className="w-full max-w-md">
      <h1 className="text-[#ff6868] text-4xl font-bold text-center mb-12">Sign In to Tintern</h1>

      <ClientLoginForm />

      <div className="text-center mt-6">
        <p className="text-[#d9d9d9]">
          Don't have an account?
          <AuthLink href="/auth/signup">
            <span className="ml-1">Register</span>
          </AuthLink>
        </p>
      </div>
    </div>
  )
}

