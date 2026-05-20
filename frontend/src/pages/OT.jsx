import { useEffect, useState } from "react";
import api from "../api/axios";

export default function OT() {
  const [patients, setPatients] = useState([]);

  const [form, setForm] = useState({
    patientRegistrationNo: "",
    otType: "",
    surgeon: "",
    otDate: "",
    anesthesia: "",
    notes: ""
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/ot", form);

    setForm({
      patientRegistrationNo: "",
      otType: "",
      surgeon: "",
      otDate: "",
      anesthesia: "",
      notes: ""
    });
  };

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">OT Entry</h1>

      {/* FORM */}
      <div className="bg-white p-4 rounded-xl shadow">
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">

          {/* Patient Select */}
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
            name="otType"
            placeholder="OT Type"
            value={form.otType}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="surgeon"
            placeholder="Surgeon"
            value={form.surgeon}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="date"
            name="otDate"
            value={form.otDate}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="anesthesia"
            placeholder="Anesthesia"
            value={form.anesthesia}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <textarea
            name="notes"
            placeholder="Notes"
            value={form.notes}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />

          <button
            type="submit"
            className="col-span-2 bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            Save OT
          </button>

        </form>
      </div>

    </div>
  );
}