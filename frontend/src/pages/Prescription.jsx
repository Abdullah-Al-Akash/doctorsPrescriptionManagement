import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Prescription() {
  const [patients, setPatients] = useState([]);

  const [form, setForm] = useState({
    patientRegistrationNo: "",
    doctor: "",
    medicines: []
  });

  const [medicine, setMedicine] = useState({
    name: "",
    dose: "",
    days: ""
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    const res = await api.get("/patients");
    setPatients(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMedChange = (e) => {
    setMedicine({ ...medicine, [e.target.name]: e.target.value });
  };

  const addMedicine = () => {
    setForm({
      ...form,
      medicines: [...form.medicines, medicine]
    });

    setMedicine({ name: "", dose: "", days: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/prescriptions", form);

    setForm({
      patientRegistrationNo: "",
      doctor: "",
      medicines: []
    });
  };

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">Prescription</h1>

      {/* FORM */}
      <div className="bg-white p-4 rounded-xl shadow space-y-4">

        {/* Patient + Doctor */}
        <div className="grid grid-cols-2 gap-3">

          <select
            name="patientRegistrationNo"
            value={form.patientRegistrationNo}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Select Patient</option>
            {patients.map((p, i) => (
              <option key={i} value={p.registrationNo}>
                {p.registrationNo} - {p.name}
              </option>
            ))}
          </select>

          <input
            name="doctor"
            placeholder="Doctor Name"
            value={form.doctor}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        {/* Medicine Add */}
        <div className="grid grid-cols-3 gap-3">

          <input
            name="name"
            placeholder="Medicine"
            value={medicine.name}
            onChange={handleMedChange}
            className="border p-2 rounded"
          />

          <input
            name="dose"
            placeholder="Dose (1-0-1)"
            value={medicine.dose}
            onChange={handleMedChange}
            className="border p-2 rounded"
          />

          <input
            name="days"
            placeholder="Days"
            value={medicine.days}
            onChange={handleMedChange}
            className="border p-2 rounded"
          />

        </div>

        <button
          type="button"
          onClick={addMedicine}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Medicine
        </button>

        {/* Medicine List */}
        <div className="space-y-2">
          {form.medicines.map((m, i) => (
            <div key={i} className="border p-2 rounded">
              {m.name} | {m.dose} | {m.days} days
            </div>
          ))}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Save Prescription
        </button>

      </div>

    </div>
  );
}