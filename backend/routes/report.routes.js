const express = require("express");
const router = express.Router();
const { getDB } = require("../db");
const { ObjectId } = require("mongodb");

// ==================== ১. ডাক্তার vs ওষুধ ম্যাট্রিক্স ====================
router.get("/doctor-medicine-matrix", async (req, res) => {
  try {
    const db = getDB();
    const prescriptions = await db.collection("prescriptions").find({}).toArray();
    
    const matrix = {};
    
    for (const prescription of prescriptions) {
      const doctor = prescription.doctor;
      if (!doctor || doctor === "") continue;
      
      if (!matrix[doctor]) {
        matrix[doctor] = {};
      }
      
      if (prescription.medicines && Array.isArray(prescription.medicines)) {
        for (const medicine of prescription.medicines) {
          const medicineName = medicine.name;
          if (!medicineName) continue;
          
          matrix[doctor][medicineName] = (matrix[doctor][medicineName] || 0) + 1;
        }
      }
    }
    
    res.status(200).json({
      success: true,
      data: matrix,
      totalDoctors: Object.keys(matrix).length
    });
    
  } catch (error) {
    console.error("Error in doctor-medicine-matrix:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== ২. ডাক্তারের ফেবারিট ওষুধ (টপ ৩) ====================
router.get("/doctor-favorite-medicines", async (req, res) => {
  try {
    const db = getDB();
    const prescriptions = await db.collection("prescriptions").find({}).toArray();
    
    const doctorFavorites = {};
    
    for (const prescription of prescriptions) {
      const doctor = prescription.doctor;
      if (!doctor || doctor === "") continue;
      
      if (!doctorFavorites[doctor]) {
        doctorFavorites[doctor] = {};
      }
      
      if (prescription.medicines && Array.isArray(prescription.medicines)) {
        for (const medicine of prescription.medicines) {
          const medicineName = medicine.name;
          if (!medicineName) continue;
          
          doctorFavorites[doctor][medicineName] = (doctorFavorites[doctor][medicineName] || 0) + 1;
        }
      }
    }
    
    // টপ ৩ বাছাই
    const result = {};
    for (const doctor in doctorFavorites) {
      const sorted = Object.entries(doctorFavorites[doctor])
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name, count]) => ({ 
          name, 
          count,
          percentage: ((count / Object.values(doctorFavorites[doctor]).reduce((a,b) => a+b, 0)) * 100).toFixed(1)
        }));
      
      result[doctor] = {
        topMedicines: sorted,
        totalPrescriptions: Object.values(doctorFavorites[doctor]).reduce((a,b) => a+b, 0),
        uniqueMedicines: Object.keys(doctorFavorites[doctor]).length
      };
    }
    
    res.status(200).json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error("Error in doctor-favorite-medicines:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== ৩. কোম্পানি প্রেফারেন্স রিপোর্ট ====================
router.get("/doctor-company-preferences", async (req, res) => {
  try {
    const db = getDB();
    const prescriptions = await db.collection("prescriptions").find({}).toArray();
    
    const companyPref = {};
    
    for (const prescription of prescriptions) {
      const doctor = prescription.doctor;
      if (!doctor || doctor === "") continue;
      
      if (!companyPref[doctor]) {
        companyPref[doctor] = {};
      }
      
      if (prescription.medicines && Array.isArray(prescription.medicines)) {
        for (const medicine of prescription.medicines) {
          const company = medicine.company;
          if (!company) continue;
          
          companyPref[doctor][company] = (companyPref[doctor][company] || 0) + 1;
        }
      }
    }
    
    // টপ কোম্পানি ও পরিসংখ্যান
    const result = {};
    for (const doctor in companyPref) {
      const sorted = Object.entries(companyPref[doctor])
        .sort((a, b) => b[1] - a[1]);
      
      const topCompany = sorted[0];
      const allCompanies = sorted.map(([company, count]) => ({
        company,
        count,
        percentage: ((count / Object.values(companyPref[doctor]).reduce((a,b) => a+b, 0)) * 100).toFixed(1)
      }));
      
      result[doctor] = {
        topCompany: topCompany ? {
          name: topCompany[0],
          count: topCompany[1]
        } : null,
        allCompanies: allCompanies,
        totalMedicineCount: Object.values(companyPref[doctor]).reduce((a,b) => a+b, 0)
      };
    }
    
    res.status(200).json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error("Error in doctor-company-preferences:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== ৪. কমন ওষুধ (সব ডাক্তারই যেগুলো লিখেন) ====================
router.get("/common-medicines-across-doctors", async (req, res) => {
  try {
    const db = getDB();
    const prescriptions = await db.collection("prescriptions").find({}).toArray();
    
    const medicineDoctorMap = {};
    const doctorSet = new Set();
    
    for (const prescription of prescriptions) {
      const doctor = prescription.doctor;
      if (!doctor || doctor === "") continue;
      
      doctorSet.add(doctor);
      
      if (prescription.medicines && Array.isArray(prescription.medicines)) {
        for (const medicine of prescription.medicines) {
          const medicineName = medicine.name;
          if (!medicineName) continue;
          
          if (!medicineDoctorMap[medicineName]) {
            medicineDoctorMap[medicineName] = new Set();
          }
          medicineDoctorMap[medicineName].add(doctor);
        }
      }
    }
    
    const totalDoctors = doctorSet.size;
    
    const result = Object.entries(medicineDoctorMap)
      .map(([medicine, doctors]) => ({
        medicine,
        doctorCount: doctors.size,
        doctors: Array.from(doctors),
        percentage: ((doctors.size / totalDoctors) * 100).toFixed(1),
        isUniversal: doctors.size === totalDoctors
      }))
      .sort((a, b) => b.doctorCount - a.doctorCount);
    
    res.status(200).json({
      success: true,
      data: result,
      totalDoctors: totalDoctors
    });
    
  } catch (error) {
    console.error("Error in common-medicines-across-doctors:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== ৫. কম্প্রিহেনসিভ ডাক্তার রিপোর্ট (সব কিছু একসাথে) ====================
router.get("/comprehensive-doctor-report", async (req, res) => {
  try {
    const db = getDB();
    const prescriptions = await db.collection("prescriptions").find({}).toArray();
    
    const doctorStats = {};
    
    for (const prescription of prescriptions) {
      const doctor = prescription.doctor;
      if (!doctor || doctor === "") continue;
      
      if (!doctorStats[doctor]) {
        doctorStats[doctor] = {
          doctorName: doctor,
          totalPrescriptions: 0,
          medicines: {},
          companies: {},
          prescriptionsList: []
        };
      }
      
      doctorStats[doctor].totalPrescriptions++;
      
      if (prescription.medicines && Array.isArray(prescription.medicines)) {
        for (const medicine of prescription.medicines) {
          // ওষুধের পরিসংখ্যান
          if (medicine.name) {
            doctorStats[doctor].medicines[medicine.name] = 
              (doctorStats[doctor].medicines[medicine.name] || 0) + 1;
          }
          
          // কোম্পানির পরিসংখ্যান
          if (medicine.company) {
            doctorStats[doctor].companies[medicine.company] = 
              (doctorStats[doctor].companies[medicine.company] || 0) + 1;
          }
        }
      }
    }
    
    // ফরম্যাট করা ডাটা
    const result = [];
    for (const doctor in doctorStats) {
      const stats = doctorStats[doctor];
      
      // টপ মেডিসিন
      const topMedicines = Object.entries(stats.medicines)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));
      
      // টপ কোম্পানি
      const topCompanies = Object.entries(stats.companies)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name, count]) => ({ name, count }));
      
      result.push({
        doctor: stats.doctorName,
        totalPrescriptions: stats.totalPrescriptions,
        uniqueMedicines: Object.keys(stats.medicines).length,
        uniqueCompanies: Object.keys(stats.companies).length,
        topMedicines: topMedicines,
        topCompanies: topCompanies,
        mostPrescribedMedicine: topMedicines[0] || null,
        favoriteCompany: topCompanies[0] || null
      });
    }
    
    // মোট প্রেসক্রিপশন অনুযায়ী সাজানো
    result.sort((a, b) => b.totalPrescriptions - a.totalPrescriptions);
    
    res.status(200).json({
      success: true,
      data: result,
      totalDoctors: result.length
    });
    
  } catch (error) {
    console.error("Error in comprehensive-doctor-report:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== ৬. নির্দিষ্ট ডাক্তারের বিস্তারিত রিপোর্ট ====================
router.get("/doctor-details/:doctorName", async (req, res) => {
  try {
    const db = getDB();
    const doctorName = decodeURIComponent(req.params.doctorName);
    
    const prescriptions = await db.collection("prescriptions")
      .find({ doctor: doctorName })
      .toArray();
    
    if (prescriptions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No prescriptions found for this doctor"
      });
    }
    
    const medicines = {};
    const companies = {};
    const patients = new Set();
    
    for (const prescription of prescriptions) {
      if (prescription.patientRegistrationNo) {
        patients.add(prescription.patientRegistrationNo);
      }
      
      if (prescription.medicines && Array.isArray(prescription.medicines)) {
        for (const medicine of prescription.medicines) {
          if (medicine.name) {
            medicines[medicine.name] = (medicines[medicine.name] || 0) + 1;
          }
          if (medicine.company) {
            companies[medicine.company] = (companies[medicine.company] || 0) + 1;
          }
        }
      }
    }
    
    const topMedicines = Object.entries(medicines)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));
    
    const topCompanies = Object.entries(companies)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
    
    res.status(200).json({
      success: true,
      data: {
        doctorName: doctorName,
        totalPrescriptions: prescriptions.length,
        totalPatients: patients.size,
        uniqueMedicines: Object.keys(medicines).length,
        uniqueCompanies: Object.keys(companies).length,
        topMedicines: topMedicines,
        topCompanies: topCompanies,
        prescriptions: prescriptions.map(p => ({
          id: p._id,
          date: p.createdAt || p.date,
          patientRegNo: p.patientRegistrationNo,
          medicines: p.medicines,
          advices: p.advices
        }))
      }
    });
    
  } catch (error) {
    console.error("Error in doctor-details:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== ৭. ওষুধভিত্তিক রিপোর্ট (কোন ডাক্তার কতবার লিখেছে) ====================
router.get("/medicine-doctor-stats/:medicineName", async (req, res) => {
  try {
    const db = getDB();
    const medicineName = decodeURIComponent(req.params.medicineName);
    
    const prescriptions = await db.collection("prescriptions").find({}).toArray();
    
    const doctorStats = {};
    
    for (const prescription of prescriptions) {
      const doctor = prescription.doctor;
      if (!doctor) continue;
      
      let found = false;
      if (prescription.medicines && Array.isArray(prescription.medicines)) {
        found = prescription.medicines.some(m => m.name === medicineName);
      }
      
      if (found) {
        doctorStats[doctor] = (doctorStats[doctor] || 0) + 1;
      }
    }
    
    const result = Object.entries(doctorStats)
      .map(([doctor, count]) => ({ doctor, prescriptionCount: count }))
      .sort((a, b) => b.prescriptionCount - a.prescriptionCount);
    
    res.status(200).json({
      success: true,
      medicineName: medicineName,
      data: result,
      totalDoctors: result.length
    });
    
  } catch (error) {
    console.error("Error in medicine-doctor-stats:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;