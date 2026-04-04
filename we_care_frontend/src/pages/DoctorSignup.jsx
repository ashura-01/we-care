import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import { authController } from '../api/authController'

function DoctorSignup() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bloodgroup: '',
    gender: '',
    specialization: '',
    experience: '',
    hospital: '',
    fees: '',
    password: '',
  })

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const data = new FormData()
      Object.entries(formData).forEach(([key, value]) => data.append(key, value))
      if (imageFile) data.append('image', imageFile)

      const response = await authController.registerDoctor(data)

      if (response.success) {
        alert('Doctor Registered Successfully!')
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

  const inputClass = "w-full h-12 px-[14px] rounded-xl border-[1.6px] border-[#c7e6de] outline-none bg-white text-[#111827] text-base transition-all duration-200 ease-in placeholder:text-[#9ca3af] focus:border-[#13a57a] focus:shadow-[0_0_0_4px_rgba(19,165,122,0.12)]"

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center py-8">
      <main className="w-full flex flex-col items-center justify-center px-5 max-md:px-4">
        <AuthCard className="w-full max-w-[470px] p-[28px_24px_24px] text-center bg-white/95 border border-[#d8ece7] rounded-[22px] shadow-[0_14px_34px_rgba(15,23,42,0.08)] max-md:p-[24px_18px_20px]">
          <h2 className="text-[1.9rem] leading-[1.2] text-[#111827] mb-6 font-bold">
            Doctor&apos;s Registration
          </h2>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">

            {/* --- PROFILE IMAGE UPLOAD --- */}
            <div className="flex flex-col items-center gap-3 mb-2">
              <div className="relative w-[100px] h-[100px] rounded-full border-2 border-dashed border-[#68B2A0] overflow-hidden bg-[#f0f9f7] flex items-center justify-center cursor-pointer group"
                onClick={() => document.getElementById('doctor-image-input').click()}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-[#68B2A0]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                      <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z"/>
                    </svg>
                    <span className="text-[10px] font-semibold text-center leading-tight">Upload<br/>Photo</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">Change</span>
                </div>
              </div>
              <input
                id="doctor-image-input"
                type="file"
                accept="image/jpg,image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
              <p className="text-[11px] text-[#9ca3af]">Click to upload profile photo (optional)</p>
            </div>

            {/* --- PERSONAL INFO --- */}
            <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className={inputClass} />
            <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required className={inputClass} />
            <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required className={inputClass} />
            <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} required className={inputClass} />

            <div className="flex gap-3">
              <select name="bloodgroup" value={formData.bloodgroup} onChange={handleChange} required className={inputClass}>
                <option value="">Blood Group</option>
                {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
              <select name="gender" value={formData.gender} onChange={handleChange} required className={inputClass}>
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* --- PROFESSIONAL INFO --- */}
            <input name="specialization" placeholder="Specialization" value={formData.specialization} onChange={handleChange} required className={inputClass} />

            <div className="flex gap-3">
              <input name="experience" type="number" placeholder="Experience (Years)" value={formData.experience} onChange={handleChange} required className={inputClass} />
              <input name="fees" type="number" placeholder="Consultation Fee" value={formData.fees} onChange={handleChange} required className={inputClass} />
            </div>

            <input name="hospital" placeholder="Hospital" value={formData.hospital} onChange={handleChange} required className={inputClass} />
            <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required className={inputClass} />

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
            <Link to="/login" className="text-[#128b8e] no-underline font-bold hover:underline">
              Login
            </Link>
          </p>
        </AuthCard>
      </main>
    </div>
  )
}

export default DoctorSignup