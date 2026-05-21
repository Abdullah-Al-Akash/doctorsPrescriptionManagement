import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Reports() {
  const [activeTab, setActiveTab] = useState("comprehensive");
  const [loading, setLoading] = useState(true);
  const [comprehensiveReport, setComprehensiveReport] = useState([]);
  const [doctorMatrix, setDoctorMatrix] = useState({});
  const [companyPref, setCompanyPref] = useState({});
  const [commonMedicines, setCommonMedicines] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [medicineSearch, setMedicineSearch] = useState("");
  const [medicineStats, setMedicineStats] = useState(null);

  useEffect(() => {
    fetchComprehensiveReport();
    fetchDoctorMatrix();
    fetchCompanyPreferences();
    fetchCommonMedicines();
  }, []);

  const fetchComprehensiveReport = async () => {
    try {
      const res = await api.get("/reports/comprehensive-doctor-report");
      if (res.data.success) {
        setComprehensiveReport(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorMatrix = async () => {
    try {
      const res = await api.get("/reports/doctor-medicine-matrix");
      if (res.data.success) {
        setDoctorMatrix(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCompanyPreferences = async () => {
    try {
      const res = await api.get("/reports/doctor-company-preferences");
      if (res.data.success) {
        setCompanyPref(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCommonMedicines = async () => {
    try {
      const res = await api.get("/reports/common-medicines-across-doctors");
      if (res.data.success) {
        setCommonMedicines(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDoctorDetails = async (doctorName) => {
    try {
      const res = await api.get(`/reports/doctor-details/${encodeURIComponent(doctorName)}`);
      if (res.data.success) {
        setDoctorDetails(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const searchMedicine = async () => {
    if (!medicineSearch) return;
    try {
      const res = await api.get(`/reports/medicine-doctor-stats/${encodeURIComponent(medicineSearch)}`);
      if (res.data.success) {
        setMedicineStats(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDoctorClick = (doctorName) => {
    setSelectedDoctor(doctorName);
    fetchDoctorDetails(doctorName);
  };

  const tabs = [
    { id: "comprehensive", name: "📊 Comprehensive Report", icon: "📊" },
    { id: "matrix", name: "💊 Doctor vs Medicine", icon: "💊" },
    { id: "company", name: "🏢 Company Preferences", icon: "🏢" },
    { id: "common", name: "⭐ Common Medicines", icon: "⭐" },
    { id: "search", name: "🔍 Search Medicine", icon: "🔍" }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold">Doctor & Medicine Analytics</h1>
        <p className="text-blue-100 mt-2">Track prescription patterns, favorite medicines, and company preferences</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm">Total Doctors</p>
          <p className="text-2xl font-bold">{comprehensiveReport.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-green-500">
          <p className="text-gray-500 text-sm">Total Prescriptions</p>
          <p className="text-2xl font-bold">
            {comprehensiveReport.reduce((sum, d) => sum + d.totalPrescriptions, 0)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-purple-500">
          <p className="text-gray-500 text-sm">Unique Medicines</p>
          <p className="text-2xl font-bold">
            {comprehensiveReport.reduce((sum, d) => sum + d.uniqueMedicines, 0)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-orange-500">
          <p className="text-gray-500 text-sm">Most Active Doctor</p>
          <p className="text-lg font-bold truncate">
            {comprehensiveReport[0]?.doctor || "N/A"}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow">
        <div className="border-b">
          <nav className="flex flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Comprehensive Report Tab */}
          {activeTab === "comprehensive" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Doctor Performance Report</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left text-sm font-semibold">Doctor</th>
                      <th className="p-3 text-left text-sm font-semibold">Prescriptions</th>
                      <th className="p-3 text-left text-sm font-semibold">Medicines</th>
                      <th className="p-3 text-left text-sm font-semibold">Top Medicine</th>
                      <th className="p-3 text-left text-sm font-semibold">Favorite Company</th>
                      <th className="p-3 text-left text-sm font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comprehensiveReport.map((doc, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{doc.doctor}</td>
                        <td className="p-3">{doc.totalPrescriptions}</td>
                        <td className="p-3">{doc.uniqueMedicines}</td>
                        <td className="p-3">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            {doc.mostPrescribedMedicine?.name || "N/A"}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                            {doc.favoriteCompany?.name || "N/A"}
                          </span>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleDoctorClick(doc.doctor)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            View Details →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Doctor vs Medicine Matrix Tab */}
          {activeTab === "matrix" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Doctor vs Medicine Prescription Matrix</h2>
              <div className="space-y-4">
                {Object.entries(doctorMatrix).map(([doctor, medicines]) => {
                  const sorted = Object.entries(medicines).sort((a, b) => b[1] - a[1]).slice(0, 5);
                  return (
                    <div key={doctor} className="border rounded-lg p-4">
                      <h3 className="font-bold text-lg text-blue-600">{doctor}</h3>
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-5 gap-2">
                        {sorted.map(([med, count]) => (
                          <div key={med} className="bg-gray-50 p-2 rounded text-center">
                            <p className="text-sm font-medium">{med}</p>
                            <p className="text-xs text-gray-500">{count} times</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Company Preferences Tab */}
          {activeTab === "company" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Doctor's Favorite Companies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(companyPref).map(([doctor, data]) => (
                  <div key={doctor} className="border rounded-lg p-4">
                    <h3 className="font-bold text-lg">{doctor}</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        Top Company: 
                        <span className="font-semibold text-green-600 ml-1">
                          {data.topCompany?.name || "N/A"}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">
                          ({data.topCompany?.count || 0} times)
                        </span>
                      </p>
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">All Companies:</p>
                        <div className="flex flex-wrap gap-1">
                          {data.allCompanies?.slice(0, 3).map((comp, idx) => (
                            <span key={idx} className="bg-gray-100 px-2 py-1 rounded text-xs">
                              {comp.company} ({comp.count})
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Common Medicines Tab */}
          {activeTab === "common" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Medicines Prescribed by Most Doctors</h2>
              <div className="space-y-3">
                {commonMedicines.slice(0, 10).map((med, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{med.medicine}</h3>
                        <p className="text-sm text-gray-600">
                          Prescribed by {med.doctorCount} out of {med.totalDoctors} doctors
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        med.isUniversal ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                      }`}>
                        {med.isUniversal ? "Universal" : `${med.percentage}%`}
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${med.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Medicine Tab */}
          {activeTab === "search" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Which Doctors Prescribe a Medicine?</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter medicine name (e.g., Paracetamol)"
                  value={medicineSearch}
                  onChange={(e) => setMedicineSearch(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && searchMedicine()}
                  className="flex-1 border p-2 rounded-lg"
                />
                <button
                  onClick={searchMedicine}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Search
                </button>
              </div>

              {medicineStats && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">
                    Doctors who prescribe "{medicineStats.medicineName}":
                  </h3>
                  <div className="space-y-2">
                    {medicineStats.data.map((stat, idx) => (
                      <div key={idx} className="flex justify-between items-center border-b py-2">
                        <span className="font-medium">{stat.doctor}</span>
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                          {stat.prescriptionCount} prescriptions
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Doctor Details Modal */}
      {selectedDoctor && doctorDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">{doctorDetails.doctorName}</h2>
              <button
                onClick={() => {
                  setSelectedDoctor(null);
                  setDoctorDetails(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Total Prescriptions</p>
                  <p className="text-2xl font-bold">{doctorDetails.totalPrescriptions}</p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Total Patients</p>
                  <p className="text-2xl font-bold">{doctorDetails.totalPatients}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Unique Medicines</p>
                  <p className="text-2xl font-bold">{doctorDetails.uniqueMedicines}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Unique Companies</p>
                  <p className="text-2xl font-bold">{doctorDetails.uniqueCompanies}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Top 10 Medicines</h3>
                <div className="space-y-1">
                  {doctorDetails.topMedicines.map((med, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{med.name}</span>
                      <span className="text-gray-600">{med.count} times</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Top Companies</h3>
                <div className="flex flex-wrap gap-2">
                  {doctorDetails.topCompanies.map((comp, idx) => (
                    <span key={idx} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      {comp.name} ({comp.count})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}