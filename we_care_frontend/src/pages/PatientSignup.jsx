import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import { authController } from '../api/authController'

function PatientSignup() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bloodgroup: '',
    gender: '',
    password: '',
  })

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await authController.registerPatient(formData)

      if (response.success) {
        alert('Patient Registered Successfully!')
        navigate('/login')
      } else {
        setError(response.message || 'Registration failed. Please try again.')
      }
    } catch (err) {
      setError('Something went wrong. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center py-8">
      <main className="w-full flex flex-col items-center justify-center px-5 max-md:px-4">
        <AuthCard className="w-full max-w-[470px] p-[28px_24px_24px] text-center bg-white/95 border border-[#d8ece7] rounded-[22px] shadow-[0_14px_34px_rgba(15,23,42,0.08)] max-md:p-[24px_18px_20px]">
          <h2 className="text-[1.9rem] leading-[1.2] text-[#111827] mb-6 font-bold">
            Patient&apos;s Registration
          </h2>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full h-12 px-[14px] rounded-xl border-[1.6px] border-[#c7e6de] outline-none bg-white text-[#111827] text-base transition-all duration-200 ease-in placeholder:text-[#9ca3af] focus:border-[#13a57a] focus:shadow-[0_0_0_4px_rgba(19,165,122,0.12)]"
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full h-12 px-[14px] rounded-xl border-[1.6px] border-[#c7e6de] outline-none bg-white text-[#111827] text-base transition-all duration-200 ease-in placeholder:text-[#9ca3af] focus:border-[#13a57a] focus:shadow-[0_0_0_4px_rgba(19,165,122,0.12)]"
            />

            <input
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full h-12 px-[14px] rounded-xl border-[1.6px] border-[#c7e6de] outline-none bg-white text-[#111827] text-base transition-all duration-200 ease-in placeholder:text-[#9ca3af] focus:border-[#13a57a] focus:shadow-[0_0_0_4px_rgba(19,165,122,0.12)]"
            />

            <input
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full h-12 px-[14px] rounded-xl border-[1.6px] border-[#c7e6de] outline-none bg-white text-[#111827] text-base transition-all duration-200 ease-in placeholder:text-[#9ca3af] focus:border-[#13a57a] focus:shadow-[0_0_0_4px_rgba(19,165,122,0.12)]"
            />

            {/* 2. BLOOD GROUP FIXED: Added explicit values */}
            <select
              name="bloodgroup"
              value={formData.bloodgroup}
              onChange={handleChange}
              required
              className="w-full h-12 px-[14px] rounded-xl border-[1.6px] border-[#c7e6de] outline-none bg-white text-[#111827] text-base transition-all duration-200 ease-in focus:border-[#13a57a] focus:shadow-[0_0_0_4px_rgba(19,165,122,0.12)]"
            >
              <option value="">Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>

            {/* 3. GENDER FIXED: Capitalized Male/Female */}
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full h-12 px-[14px] rounded-xl border-[1.6px] border-[#c7e6de] outline-none bg-white text-[#111827] text-base transition-all duration-200 ease-in focus:border-[#13a57a] focus:shadow-[0_0_0_4px_rgba(19,165,122,0.12)]"
            >
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full h-12 px-[14px] rounded-xl border-[1.6px] border-[#c7e6de] outline-none bg-white text-[#111827] text-base transition-all duration-200 ease-in placeholder:text-[#9ca3af] focus:border-[#13a57a] focus:shadow-[0_0_0_4px_rgba(19,165,122,0.12)]"
            />

            <button 
              type="submit"
              disabled={loading}
              className={`w-full h-12 mt-[10px] border-none rounded-full cursor-pointer bg-gradient-to-r from-[#0da574] to-[#10b084] text-white text-[1.04rem] font-bold shadow-[0_8px_18px_rgba(16,176,132,0.2)] transition-all duration-200 ease-in ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-[1px] hover:opacity-[0.97]'}`}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="mt-[14px] text-center text-[0.94rem] text-[#6b7280]">
            Already have account?{' '}
            <Link
              to="/login"
              className="text-[#128b8e] no-underline font-bold hover:underline"
            >
              Login
            </Link>
          </p>
        </AuthCard>
      </main>
    </div>
  )
}

export default PatientSignup