import { useEffect, useState } from "react";
import api from "../api/axios";

export default function OperationNotes() {
  const [patients, setPatients] = useState([]);

  const [form, setForm] = useState({
    patientRegistrationNo: "",
    findings: "",
    procedureDetails: "",
    complications: "",
    postOpCondition: ""
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
    await api.post("/operation-notes", form);

    setForm({
      patientRegistrationNo: "",
      findings: "",
      procedureDetails: "",
      complications: "",
      postOpCondition: ""
    });
  };

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">Operation Notes</h1>

      {/* FORM */}
      <div className="bg-white p-4 rounded-xl shadow">
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">

          <select
            name="patientRegistrationNo"
            value={form.patientRegistrationNo}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          >
            <option value="">Select Patient</option>
            {patients.map((p, i) => (
              <option key={i} value={p.registrationNo}>
                {p.registrationNo} - {p.name}
              </option>
            ))}
          </select>

          <input
            name="findings"
            placeholder="Findings"
            value={form.findings}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="procedureDetails"
            placeholder="Procedure Details"
            value={form.procedureDetails}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="complications"
            placeholder="Complications"
            value={form.complications}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="postOpCondition"
            placeholder="Post Op Condition"
            value={form.postOpCondition}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <button
            type="submit"
            className="col-span-2 bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
          >
            Save Operation Note
          </button>

        </form>
      </div>

    </div>
  );
}