import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    registrationNo: "",
    name: "",
    age: "",
    gender: "",
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await api.get("/patients");
      setPatients(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/patients", form);

      setForm({
        registrationNo: "",
        name: "",
        age: "",
        gender: "",
      });

      fetchPatients();
    } catch (err) {
      console.log(err);
    }
  };

  const filteredPatients = patients.filter((p) => {
    return (
      (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.registrationNo || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Patients</h1>
      </div>

      {/* SEARCH */}
      <div>
        <input
          type="text"
          placeholder="Search by name or reg no..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* FORM */}
      <div className="bg-white p-4 rounded-xl shadow">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-4 gap-3"
        >
          <input
            name="registrationNo"
            placeholder="Reg No"
            value={form.registrationNo}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="age"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <button
            type="submit"
            className="col-span-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Add Patient
          </button>
        </form>
      </div>

      {/* TABLE */}
      <div className="bg-white p-4 rounded-xl shadow">
        <table className="w-full text-left">
          <thead className="border-b">
            <tr>
              <th className="p-2">Reg No</th>
              <th className="p-2">Name</th>
              <th className="p-2">Age</th>
              <th className="p-2">Gender</th>
            </tr>
          </thead>

          <tbody>
            {filteredPatients.map((p, i) => (
              <tr key={i} className="border-b">
                <td className="p-2">{p.registrationNo}</td>
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.age}</td>
                <td className="p-2">{p.gender}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}