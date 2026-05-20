import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Patients from "./pages/Patients";
import OT from "./pages/OT";
import Prescription from "./pages/Prescription";
import { Reports } from './pages/Reports';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Patients />} />
        <Route path="ot" element={<OT />} />
        <Route path="prescription" element={<Prescription />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}