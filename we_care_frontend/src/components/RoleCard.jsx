function RoleCard({ icon, title, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex min-h-[300px] w-full flex-col items-center justify-center rounded-[22px] border border-[#b7ddd6] bg-white text-center transition hover:bg-white"
    >
      <div className="mb-8 flex items-center justify-center">{icon}</div>
      <h2 className="text-[36px] font-bold leading-[1.2] text-[#127980]">
        {title}
      </h2>
    </button>
  )
}

export default RoleCard