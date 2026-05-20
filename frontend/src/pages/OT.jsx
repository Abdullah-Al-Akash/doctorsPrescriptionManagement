import { useEffect, useState } from "react";
import api from "../api/axios";
import { doctors } from "../data/doctors";

export default function OT() {
  const [patients, setPatients] = useState([]);
  const [otHistory, setOtHistory] = useState([]);

  const [form, setForm] = useState({
    patientRegistrationNo: "",
    otType: "",
    surgeon: "",
    otDate: "",
    anesthesia: "",
    notes: "",
    postOT: ""
  });

  const [search, setSearch] = useState("");
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    const res = await api.get("/patients");
    setPatients(res.data);
  };

  // 🧠 FETCH OT HISTORY
  const fetchOtHistory = async (regNo) => {
    try {
      const res = await api.get(`/ot/patient/${regNo}`);
      setOtHistory(res.data || []);
    } catch (err) {
      console.log(err);
      setOtHistory([]);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🧠 SELECT PATIENT
  const selectPatient = (p) => {
    setForm({
      ...form,
      patientRegistrationNo: p.registrationNo
    });

    setSearch(p.registrationNo + " - " + p.name);
    setShowList(false);

    // 🔥 load OT history
    fetchOtHistory(p.registrationNo);
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
      notes: "",
      postOT: ""
    });

    setSearch("");
    setOtHistory([]);
  };

  const filteredPatients = patients.filter((p) =>
    p.registrationNo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">OT Entry</h1>

      <div className="bg-white p-4 rounded-xl shadow space-y-4">

        {/* PATIENT SEARCH */}
        <div className="relative">

          <input
            type="text"
            placeholder="Search patient by Reg No..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowList(true);
            }}
            onFocus={() => setShowList(true)}
            className="border p-2 rounded w-full"
          />

          {showList && search && (
            <div className="absolute z-50 bg-white border w-full mt-1 rounded shadow max-h-60 overflow-y-auto">

              {filteredPatients.map((p) => (
                <div
                  key={p.registrationNo}
                  onClick={() => selectPatient(p)}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                >
                  <div className="font-medium">
                    {p.registrationNo}
                  </div>
                  <div className="text-xs text-gray-500">
                    {p.name}
                  </div>
                </div>
              ))}

            </div>
          )}

        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">

          <select
            name="otType"
            value={form.otType}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">OT Type</option>
            <option>Appendectomy</option>
            <option>C-Section</option>
            <option>Gallbladder Removal</option>
            <option>Orthopedic Surgery</option>
          </select>

          <select
            name="surgeon"
            value={form.surgeon}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Select Surgeon</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name} ({d.specialty})
              </option>
            ))}
          </select>

          <input
            type="date"
            name="otDate"
            value={form.otDate}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <select
            name="anesthesia"
            value={form.anesthesia}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Anesthesia</option>
            <option>General</option>
            <option>Spinal</option>
            <option>Local</option>
          </select>

          <textarea
            name="notes"
            placeholder="OT Notes"
            value={form.notes}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />

          <textarea
            name="postOT"
            placeholder="Post OT report"
            value={form.postOT}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />

          <button
            type="submit"
            className="col-span-2 bg-green-600 text-white p-2 rounded"
          >
            Save OT Record
          </button>

        </form>
      </div>

      {/* 🧠 OT HISTORY SECTION */}
      {otHistory.length > 0 && (
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-2">Previous OT History</h2>

          <div className="space-y-2">
            {otHistory.map((ot, i) => (
              <div key={i} className="border p-2 rounded">
                <div>
                  <b>{ot.otType}</b> | {ot.otDate}
                </div>
                <div className="text-sm text-gray-600">
                  Surgeon: {ot.surgeon} | Anesthesia: {ot.anesthesia}
                </div>
                <div className="text-sm">
                  {ot.postOT}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}