router.get("/dashboard", async (req, res) => {
  const db = getDB();

  const prescriptions = await db.collection("prescriptions").find().toArray();
  const ots = await db.collection("ot").find().toArray();
  const patients = await db.collection("patients").find().toArray();

  // 🔥 DOCTOR ANALYTICS
  const doctorMap = {};

  prescriptions.forEach((p) => {
    const doc = p.doctor;

    if (!doctorMap[doc]) {
      doctorMap[doc] = {
        doctor: doc,
        totalPatients: 0,
        medicines: {},
        companies: {}
      };
    }

    doctorMap[doc].totalPatients += 1;

    p.medicines.forEach((m) => {
      doctorMap[doc].medicines[m.name] =
        (doctorMap[doc].medicines[m.name] || 0) + 1;

      doctorMap[doc].companies[m.company] =
        (doctorMap[doc].companies[m.company] || 0) + 1;
    });
  });

  // convert object → array
  const doctorReport = Object.values(doctorMap);

  // 🔥 MEDICINE ANALYTICS
  const medicineMap = {};

  prescriptions.forEach((p) => {
    p.medicines.forEach((m) => {
      medicineMap[m.name] =
        (medicineMap[m.name] || 0) + 1;
    });
  });

  const medicineReport = Object.entries(medicineMap).map(
    ([name, count]) => ({ name, count })
  );

  // 🔥 OT ANALYTICS
  const otMap = {};

  ots.forEach((o) => {
    otMap[o.otType] =
      (otMap[o.otType] || 0) + 1;
  });

  const otReport = Object.entries(otMap).map(
    ([type, count]) => ({ type, count })
  );

  res.json({
    summary: {
      patients: patients.length,
      prescriptions: prescriptions.length,
      ot: ots.length
    },
    doctorReport,
    medicineReport,
    otReport
  });
});