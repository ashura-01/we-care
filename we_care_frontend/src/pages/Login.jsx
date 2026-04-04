import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import { useAuth } from '../contexts/AuthContext';
import { authController } from '../api/authController'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  })

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  
  const { loginUser } = useAuth()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await authController.login(formData.email, formData.password)

      if (response.success) {
        console.log('Login successful!', response.user)
        
       await loginUser(response.user) 
        
        navigate('/')
      } else {
        setError(response.message || 'Login failed. Please try again.')
      }
    } catch {
      setError('Something went wrong. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen text-slate-800 flex flex-col items-center justify-center"
      style={{
        fontFamily: 'Arial, sans-serif',
        background: 'linear-gradient(135deg, #f8fbfa 0%, #eef7f4 100%)',
      }}
    >
      <main className="flex w-full flex-col items-center justify-center px-5 py-8">
        <div className="mb-6 text-center">
          <div className="text-[3.9rem] leading-none text-[#2d9aa3]">💚</div>
          <h1 className="mt-[6px] mb-[6px] text-[3rem] font-bold leading-[1.1] text-[#1c7f8d]">
            WeCare
          </h1>
          <p className="text-[0.98rem] text-[#7a8794]">
            AI-Powered Healthcare Connection
          </p>
        </div>

        <AuthCard className="w-full max-w-[376px] rounded-[22px] border border-[#d8ece7] bg-white/95 px-5 pt-7 pb-[18px] text-center shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
          <h2 className="mb-2 text-[1.1rem] font-extrabold leading-[1.2] text-[#0f172a] sm:text-[1.2rem] md:text-[1.05rem] lg:text-[1.05rem]">
            <span className="block text-[1.05em] sm:text-[1.8rem]">
              Sign in to your Account
            </span>
          </h2>

          <p className="mb-5 text-[0.96rem] text-[#6b7280]">Welcome back!</p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-[14px]">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="h-11 w-full rounded-[12px] border border-[#c7e6de] bg-white px-[14px] text-base text-[#111827] outline-none transition-all duration-200 placeholder:text-[#9ca3af] focus:border-[#13a57a] focus:shadow-[0_0_0_4px_rgba(19,165,122,0.12)]"
              />
            </div>

            <div className="mb-[14px]">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="h-11 w-full rounded-[12px] border border-[#c7e6de] bg-white px-[14px] text-base text-[#111827] outline-none transition-all duration-200 placeholder:text-[#9ca3af] focus:border-[#13a57a] focus:shadow-[0_0_0_4px_rgba(19,165,122,0.12)]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`mt-[10px] h-[42px] w-full rounded-full border-none text-[1.04rem] font-bold text-white shadow-[0_8px_18px_rgba(16,176,132,0.2)] transition-all duration-200 ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-[1px] hover:opacity-95'
              }`}
              style={{
                background: 'linear-gradient(90deg, #0da574, #10b084)',
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="mt-[14px] text-center text-[0.94rem] text-[#6b7280]">
            Don&apos;t have an account?{' '}
            <Link
              to="/signup"
              className="font-bold text-[#128b8e] no-underline hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </AuthCard>
      </main>
    </div>
  )
}

export default Login