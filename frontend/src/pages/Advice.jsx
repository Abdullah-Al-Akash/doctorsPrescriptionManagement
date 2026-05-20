import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Advice() {
  const [patients, setPatients] = useState([]);

  const [form, setForm] = useState({
    patientRegistrationNo: "",
    advice: []
  });

  const [input, setInput] = useState("");

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

  const addAdvice = () => {
    if (!input) return;

    setForm({
      ...form,
      advice: [...form.advice, input]
    });

    setInput("");
  };

  const handleSubmit = async () => {
    await api.post("/advice", form);

    setForm({
      patientRegistrationNo: "",
      advice: []
    });
  };

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">Advice</h1>

      {/* FORM */}
      <div className="bg-white p-4 rounded-xl shadow space-y-4">

        {/* Patient Select */}
        <select
          name="patientRegistrationNo"
          value={form.patientRegistrationNo}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="">Select Patient</option>
          {patients.map((p, i) => (
            <option key={i} value={p.registrationNo}>
              {p.registrationNo} - {p.name}
            </option>
          ))}
        </select>

        {/* Advice Input */}
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter advice..."
            className="border p-2 rounded w-full"
          />

          <button
            onClick={addAdvice}
            className="bg-blue-500 text-white px-4 rounded"
          >
            Add
          </button>
        </div>

        {/* Advice List */}
        <div className="space-y-2">
          {form.advice.map((a, i) => (
            <div key={i} className="border p-2 rounded">
              {a}
            </div>
          ))}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Save Advice
        </button>

      </div>

    </div>
  );
}