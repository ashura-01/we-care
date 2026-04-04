import api from "../api/api";

export const getStats = async () => {
  try {
    const [doctorsRes, hospitalsRes] = await Promise.all([
      api.get("/doctors?perpage=1"),
      api.get("/hospitals"),
    ]);

    const totalDoctors = doctorsRes.data?.pagination?.totalDoctors || "500";
    const totalHospitals = doctorsRes.data?.success
      ? hospitalsRes.data?.hospitals?.length || "200"
      : "200";

    return [
      { number: `${totalDoctors}+`, label: "Doctors" },
      { number: `${totalHospitals}+`, label: "Hospitals" },
      { number: "8", label: "Divisions Covered" },
    ];
  } catch {
    return [
      { number: "500+", label: "Doctors" },
      { number: "200+", label: "Hospitals" },
      { number: "8", label: "Divisions Covered" },
    ];
  }
};