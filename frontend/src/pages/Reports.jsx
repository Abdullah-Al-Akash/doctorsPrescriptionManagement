import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";

const doctors = [
  "Dr. Rahim",
  "Dr. Karim",
  "Dr. Sumi",
  "Dr. Hasan",
  "Dr. Anika"
];

export default function Reports() {
  const [doctorReport, setDoctorReport] = useState([]);
  const [medicineReport, setMedicineReport] = useState([]);
  const [otReport, setOtReport] = useState([]);

  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [ots, setOts] = useState([]);

  const [filters, setFilters] = useState({
    doctor: ""
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [d, m, o, p, pr, ot] = await Promise.all([
        api.get("/reports/doctor-company"),
        api.get("/reports/medicine-usage"),
        api.get("/reports/company-usage"),
        api.get("/patients"),
        api.get("/prescriptions"),
        api.get("/ot")
      ]);

      setDoctorReport(d.data);
      setMedicineReport(m.data);
      setOtReport(o.data);
      setPatients(p.data);
      setPrescriptions(pr.data);
      setOts(ot.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 📊 SUMMARY STATS (safe memoized)
  const summary = useMemo(() => {
    const totalPatients = patients.length;
    const totalPrescriptions = prescriptions.length;
    const totalOT = ots.length;

    const sortedMedicine = [...medicineReport].sort(
      (a, b) => b.count - a.count
    );

    return {
      totalPatients,
      totalPrescriptions,
      totalOT,
      topMedicine: sortedMedicine[0]?._id || "N/A"
    };
  }, [patients, prescriptions, ots, medicineReport]);

  // filtered doctor report
  const filteredDoctorReport = useMemo(() => {
    if (!filters.doctor) return doctorReport;

    return doctorReport.filter(
      (d) => d._id?.doctor === filters.doctor
    );
  }, [doctorReport, filters.doctor]);

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">Reports Dashboard</h1>

      {/* 🎛️ FILTER BAR */}
      <div className="bg-white p-4 rounded-xl shadow flex gap-3">
        <select
          value={filters.doctor}
          onChange={(e) =>
            setFilters({ doctor: e.target.value })
          }
          className="border p-2 rounded w-1/3"
        >
          <option value="">All Doctors</option>
          {doctors.map((d, i) => (
            <option key={i}>{d}</option>
          ))}
        </select>

        <button
          onClick={fetchAll}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Refresh
        </button>
      </div>

      {/* 🔥 SUMMARY CARDS */}
      <div className="grid grid-cols-4 gap-4">

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Patients</h2>
          <p className="text-2xl font-bold">
            {summary.totalPatients}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Prescriptions</h2>
          <p className="text-2xl font-bold">
            {summary.totalPrescriptions}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">OT Cases</h2>
          <p className="text-2xl font-bold">
            {summary.totalOT}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Top Medicine</h2>
          <p className="text-lg font-bold">
            {summary.topMedicine}
          </p>
        </div>

      </div>

      {/* 👨‍⚕️ DOCTOR REPORT */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-bold mb-3">
          Doctor Prescription Report
        </h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Doctor</th>
              <th className="p-2">Medicine</th>
              <th className="p-2">Count</th>
            </tr>
          </thead>

          <tbody>
            {filteredDoctorReport.length === 0 ? (
              <tr>
                <td className="p-2 text-gray-400" colSpan={3}>
                  No data found
                </td>
              </tr>
            ) : (
              filteredDoctorReport.map((d, i) => (
                <tr key={i} className="border-b">
                  <td className="p-2">{d._id.doctor}</td>
                  <td className="p-2">{d._id.medicine}</td>
                  <td className="p-2 font-bold">{d.count}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 💊 MEDICINE REPORT */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-bold mb-3">Medicine Usage</h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Medicine</th>
              <th className="p-2">Count</th>
            </tr>
          </thead>

          <tbody>
            {medicineReport.map((m, i) => (
              <tr key={i} className="border-b">
                <td className="p-2">{m._id}</td>
                <td className="p-2 font-bold">{m.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🏥 OT REPORT */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-bold mb-3">OT Usage Report</h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Company</th>
              <th className="p-2">Count</th>
            </tr>
          </thead>

          <tbody>
            {otReport.map((o, i) => (
              <tr key={i} className="border-b">
                <td className="p-2">{o._id}</td>
                <td className="p-2 font-bold">{o.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}