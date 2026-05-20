import { useEffect, useState } from "react";
import api from "../api/axios";
import { medicines as medicineList } from "../data/medicines";
import { doctors } from "../data/doctors";

const adviceList = [
  "Rest and drink plenty of water",
  "Take medicine after food",
  "Avoid oily food",
  "Complete full course of medicine",
  "Follow up after 7 days",
  "Keep wound clean and dry",
];

export default function Prescription() {
  const [patients, setPatients] = useState([]);
  const [prescriptionHistory, setPrescriptionHistory] = useState([]);

  const [form, setForm] = useState({
    patientRegistrationNo: "",
    doctor: "",
    medicines: [],
    advices: [],
  });

  const [medicine, setMedicine] = useState({
    name: "",
    company: "",
    dose: "",
    days: "",
  });

  const [query, setQuery] = useState("");
  const [showList, setShowList] = useState(false);
  const fetchPatients = async () => {
    const res = await api.get("/patients");
    setPatients(res.data);
  };

  const fetchHistory = async (regNo) => {
    try {
      const res = await api.get(`/prescriptions/patient/${regNo}`);
      setPrescriptionHistory(res.data);
    } catch (err) {
      setPrescriptionHistory([]);
    }
  };
  useEffect(() => {
    fetchPatients();
  }, []);

  // 🧠 patient select → auto doctor detect
  const handlePatientSelect = (e) => {
    const regNo = e.target.value;

    const patient = patients.find((p) => p.registrationNo === regNo);
    const doctor = doctors.find((d) => d.id === patient?.doctorId);

    setForm({
      ...form,
      patientRegistrationNo: regNo,
      doctor: doctor?.name || "",
    });

    // 🔥 LOAD HISTORY
    fetchHistory(regNo);
  };

  const selectMedicine = (m) => {
    setMedicine({
      name: m.name,
      company: m.company,
      dose: "",
      days: "",
    });

    setQuery(m.name);
    setShowList(false);
  };

  const addMedicine = () => {
    if (!medicine.name || !medicine.dose || !medicine.days) return;

    setForm({
      ...form,
      medicines: [...form.medicines, medicine],
    });

    setMedicine({ name: "", company: "", dose: "", days: "" });
    setQuery("");
  };

  const addAdvice = (advice) => {
    if (form.advices.includes(advice)) return;

    setForm({
      ...form,
      advices: [...form.advices, advice],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post("/prescriptions", form);

    setForm({
      patientRegistrationNo: "",
      doctor: "",
      medicines: [],
      advices: [],
    });
  };

  const filteredMedicines = medicineList.filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Prescription</h1>

      <div className="bg-white p-4 rounded-xl shadow space-y-5">
        {/* PATIENT + AUTO DOCTOR */}
        <div className="grid grid-cols-2 gap-3">
          <select
            value={form.patientRegistrationNo}
            onChange={handlePatientSelect}
            className="border p-2 rounded"
          >
            <option value="">Select Patient</option>

            {patients.map((p) => (
              <option key={p.registrationNo} value={p.registrationNo}>
                {p.registrationNo} - {p.name}
              </option>
            ))}
          </select>

          <input
            value={form.doctor}
            readOnly
            placeholder="Auto detected doctor"
            className="border p-2 rounded bg-gray-100"
          />
        </div>

        {/* MEDICINE SEARCH */}
        <div className="relative">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowList(true);
            }}
            placeholder="Search medicine..."
            className="border p-2 rounded w-full"
          />

          {showList && query && (
            <div className="absolute z-50 w-full bg-white border mt-1 rounded shadow max-h-60 overflow-y-auto">
              {filteredMedicines.map((m, i) => (
                <div
                  key={i}
                  onClick={() => selectMedicine(m)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  <div className="font-medium">{m.name}</div>
                  <div className="text-xs text-gray-500">{m.company}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DOSE + DAYS DROPDOWN */}
        <div className="grid grid-cols-2 gap-3">
          <select
            name="dose"
            value={medicine.dose}
            onChange={(e) => setMedicine({ ...medicine, dose: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="">Dose</option>
            <option>1-0-1</option>
            <option>1-1-1</option>
            <option>0-1-0</option>
          </select>

          <select
            name="days"
            value={medicine.days}
            onChange={(e) => setMedicine({ ...medicine, days: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="">Days</option>
            <option>3</option>
            <option>5</option>
            <option>7</option>
            <option>10</option>
          </select>
        </div>

        <button
          onClick={addMedicine}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Medicine
        </button>

        {/* MEDICINE LIST */}
        <div className="space-y-2">
          {form.medicines.map((m, i) => (
            <div key={i} className="border p-2 rounded">
              {m.name} | {m.company} | {m.dose} | {m.days}
            </div>
          ))}
        </div>

        {/* ADVICE SECTION */}
        <div className="space-y-2">
          <h2 className="font-semibold">Advice</h2>

          <div className="flex flex-wrap gap-2">
            {adviceList.map((a, i) => (
              <button
                key={i}
                type="button"
                onClick={() => addAdvice(a)}
                className="px-3 py-1 border rounded hover:bg-gray-100"
              >
                {a}
              </button>
            ))}
          </div>

          {/* selected advice */}
          <div className="text-sm text-gray-600">
            {form.advices.join(" | ")}
          </div>
        </div>

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Save Prescription
        </button>
      </div>

      {/* HISTORY SECTION */}
{prescriptionHistory.length > 0 && (
  <div className="bg-white p-4 rounded-xl shadow">
    <h2 className="font-semibold mb-2">Previous Prescriptions</h2>

    <div className="space-y-3">
      {prescriptionHistory.map((p, i) => (
        <div key={i} className="border p-2 rounded">

          <div className="text-sm font-semibold">
            Doctor: {p.doctor}
          </div>

          <div className="text-xs text-gray-500">
            {p.advices?.join(", ")}
          </div>

          <div className="mt-2">
            {p.medicines?.map((m, idx) => (
              <div key={idx} className="text-sm">
                {m.name} | {m.dose} | {m.days} days
              </div>
            ))}
          </div>

        </div>
      ))}
    </div>
  </div>
)}
    </div>
  );
}
