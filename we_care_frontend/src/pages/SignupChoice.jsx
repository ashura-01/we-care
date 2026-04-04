import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import RoleCard from '../components/RoleCard'
import { Stethoscope, User } from 'lucide-react'

function SignupChoice() {
  const navigate = useNavigate()

  const handleDoctor = () => {
    navigate('/signup/doctor')
  }

  const handlePatient = () => {
    navigate('/signup/patient')
  }

  return (
    <div className="min-h-screen bg-[#f7fbf9] flex flex-col items-center justify-center">
      <main className="flex w-full justify-center px-4 py-8">
        <AuthCard className="w-full max-w-[910px] rounded-[28px] border border-[#e3ece8] bg-white px-6 pb-5 pt-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <RoleCard
              icon={<Stethoscope size={72} strokeWidth={2.2} color="#169b98" />}
              title="Register as Doctor"
              onClick={handleDoctor}
            />

            <RoleCard
              icon={<User size={72} strokeWidth={2.2} color="#169b98" />}
              title="Register as Patient"
              onClick={handlePatient}
            />
          </div>

          <p className="mt-5 text-center text-[20px] text-[#6b7280]">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#0f7f85] hover:underline">
              Login
            </Link>
          </p>
        </AuthCard>
      </main>
    </div>
  )
}

export default SignupChoice