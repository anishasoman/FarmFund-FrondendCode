import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PageNotFound from "./components/PageNotFound";
import InvestorDashboard from "./Invester/pages/InvesterDashboard";
import AdminDashboard from "./Admin/pages/AdminDashboard";
import Register from "./pages/Registerpage";
import Login from "./pages/Loginpage";
import ProposalDetails from "./Invester/pages/Proposaldetails";
import Proposals from "./Invester/pages/Proposals";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PaymentSuccess from "./Invester/pages/PaymentSuccess";
import PaymentError from "./Invester/pages/PaymentError";
import Working from "./pages/Working";
import FarmerDashboard from "./Farmer/pages/FarmerDashboard";

export default function App() {
  return (
    <>
      
       
          <Header />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/working" element={<Working />} /> 
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/farmer" element={<FarmerDashboard />} />
            <Route path="/investdashboard" element={<InvestorDashboard />} />
            <Route path="/proposals" element={<Proposals />} />
            <Route path="/proposals/:id" element={<ProposalDetails />} />
            <Route path='/payment-success' element={<PaymentSuccess />} />
            <Route path='/payment-error' element={<PaymentError />} />    
            <Route path="*" element={<PageNotFound />} />
            
          </Routes>

          <Footer />
      

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </>
  );
}
