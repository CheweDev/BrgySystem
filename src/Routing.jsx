import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import Login from "./components/Auth/Login.jsx";
import Register from "./components/Auth/Register.jsx";
import UserDashboard from "./components/User/UserDashboard.jsx";
import AttendanceForm from "./components/User/AttendanceForm.jsx";
import UserProfile from "./components/User/UserProfile.jsx";
import UserNotification from "./components/User/UserNotification.jsx";
import Document from "./Document.jsx";
import AdminDashboard from "./components/Admin/AdminDashboard.jsx";
import AdminProfile from "./components/Admin/AdminProfile.jsx";
import AdminNotification from "./components/Admin/AdminNotification.jsx";
import AdminAttendance from "./components/Admin/AdminAttendance.jsx";
import SuperAdminDashboard from "./components/SuperAdmin/SAdminDashboard.jsx";
import SAProfile from "./components/SuperAdmin/SAProfile.jsx";
import SANotif from "./components/SuperAdmin/SANotif.jsx";
import SAProcess from "./components/SuperAdmin/SAProcess.jsx";
import BrgyClearance from "./components/Certificates/BrgyClearance.jsx";
import LowIncomeCertificateForm from "./components/Certificates/LowIncome.jsx";
import DeathCertificate from "./components/Certificates/DeathCertificate.jsx";
import IndigentCertificate from "./components/Certificates/IndigentCertificate.jsx";
import OnessCertificate from "./components/Certificates/OnessCertificate.jsx";
import SeniorCitizen from "./components/Certificates/SeniorCitizen.jsx";
import ResidencyCertificate from "./components/Certificates/ResidencyCertificate.jsx";
import Oath from "./components/Certificates/Oath.jsx";
import FirstTimeJobseekerCertificate from "./components/Certificates/FirstTimeJobSeeker.jsx";

const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/attendance" element={<AttendanceForm />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/user-notification" element={<UserNotification />} />
        <Route path="/document" element={<Document />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-profile" element={<AdminProfile />} />
        <Route path="/admin-notification" element={<AdminNotification />} />
        <Route path="/attendance-list" element={<AdminAttendance />} />
        <Route path="/super-dashboard" element={<SuperAdminDashboard />} />
        <Route path="/prof" element={<SAProfile />} />
        <Route path="/notif" element={<SANotif />} />
        <Route path="/process" element={<SAProcess />} />
        <Route path="/brgy" element={<BrgyClearance />} />
        <Route path="/low" element={<LowIncomeCertificateForm />} />
        <Route path="/death" element={<DeathCertificate />} />
        <Route path="/indigent" element={<IndigentCertificate />} />
        <Route path="/oness" element={<OnessCertificate />} />
        <Route path="/senior" element={<SeniorCitizen />} />
        <Route path="/residency" element={<ResidencyCertificate />} />
        <Route path="/Oath" element={<Oath />} />
        <Route path="/jobseeker" element={<FirstTimeJobseekerCertificate />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;
