import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react"; 
import success from '../../assets/success.gif'
import {
  InvestmentPaymentAPI,
  getProposalFullDetailsAPI,
} from "../../services/allAPIs";
import { jsPDF } from "jspdf";
function PaymentSuccess() {
  const hasVerified = useRef(false);
  const [verifying, setVerifying] = useState(true);
  const [proposalData, setProposalData] = useState(null);


  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          toast.error("User not authenticated");
          return;
        }

        const params = new URLSearchParams(window.location.search);
        const sessionId = params.get("session_id");
        console.log(sessionId);
        
        const proposalId = params.get("proposalId");
        console.log(proposalId);
        
        if (!sessionId || !proposalId) {
          toast.error("Missing session or proposal ID");
          return;
        }

        await InvestmentPaymentAPI(
          { sessionId },
          { Authorization: `Bearer ${token}` },
        );

        toast.success("Investment successful");

        const result = await getProposalFullDetailsAPI(proposalId, {
          Authorization: `Bearer ${token}`,
        });

        if (result.status === 200) {
          setProposalData(result.data);
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong");
      } finally {
        setVerifying(false);
      }
    };

    fetchData();
  }, []);

  const downloadReceipt = () => {
    if (!proposalData || !Array.isArray(proposalData.investments)) {
      toast.error("Investment data missing");
      return;
    }

    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("User not authenticated");
      return;
    }

    let investorEmail = "";
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      investorEmail = decoded?.userMail;
    } catch {
      toast.error("Invalid token");
      return;
    }

    const myInvestment = proposalData.investments.find(
      (inv) => inv.investorEmail === investorEmail,
    );

    if (!myInvestment) {
      toast.error("Your investment record not found");
      return;
    }

    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();

//  header 
    doc.setFillColor(34, 139, 34); // green
    doc.rect(0, 0, pageWidth, 25, "F");

    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text("FarmFund", 20, 15);

    doc.setFontSize(12);
    doc.text("Investment Receipt", pageWidth - 60, 15);

    // Reset color
    doc.setTextColor(0, 0, 0);

    let y = 40;

// title 
    doc.setFontSize(16);
    doc.text("Investment Summary", 20, y);

    y += 10;
    doc.setLineWidth(0.5);
    doc.line(20, y, pageWidth - 20, y);

    y += 10;

// two columns 

    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Investor Details", 20, y);
    doc.text("Project Details", pageWidth / 2, y);

    doc.setFont(undefined, "normal");
    y += 4;

    //left
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");

    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${myInvestment.investorName}`, 20, y + 10);
    doc.text(`Email: ${myInvestment.investorEmail}`, 20, y + 18);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, y + 26);

    //right
    const rightX = pageWidth / 2;

    doc.setFont("helvetica", "bold");

    doc.setFont("helvetica", "normal");
    doc.text(`Farmer: ${proposalData.farmer?.name || "N/A"}`, rightX, y + 10);
    doc.text(`Location: ${proposalData.location}`, rightX, y + 18);
    doc.text(`Project: ${proposalData.title}`, rightX, y + 26);
    doc.text(`Duration: ${proposalData.duration} months`, rightX, y + 34);
    doc.text(`Risk: ${proposalData.risk}`, rightX, y + 42);

    y += 60; // move down after columns

// bottom 

    doc.setFont(undefined, "bold");
    doc.text("Investment Breakdown", 20, y);

    y += 8;
    doc.line(20, y, pageWidth - 20, y);
    y += 12;

    doc.setFont(undefined, "normal");

    doc.text("Amount Invested:", 20, y);
    doc.text(`Rs ${myInvestment.investedAmount}`, pageWidth - 40, y, {
      align: "right",
    });

    y += 10;

    doc.text("Expected Return:", 20, y);
    doc.text(`${proposalData.expectedReturn}%`, pageWidth - 40, y, {
      align: "right",
    });
    y += 10;
    doc.text("Expected Profit:", 20, y);
    doc.text(`Rs ${myInvestment.expectedProfit}`, pageWidth - 40, y, {
      align: "right",
    });

    y += 10;

    doc.setFont(undefined, "bold");
    doc.text("Total Return:", 20, y);
    doc.setTextColor(34, 139, 34);
    doc.text(`Rs ${myInvestment.totalReturnAmount}`, pageWidth - 40, y, {
      align: "right",
    });

    doc.setTextColor(0, 0, 0);

    y += 20;
    doc.line(20, y, pageWidth - 20, y);

// footer 

    y += 15;
    doc.setFontSize(10);
    doc.text("Issued by FarmFund", pageWidth / 2, y, { align: "center" });

    doc.text(
      "Empowering Sustainable Farming Investments...",
      pageWidth / 2,
      y + 6,
      { align: "center" },
    );

    doc.save(`FarmFund-Investment-Receipt-${proposalData.title}.pdf`);
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-950 px-4">
  
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100/50 dark:bg-emerald-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-100/50 dark:bg-amber-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-md w-full bg-white dark:bg-gray-900 rounded-[2.5rem] p-10 shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 text-center">
   
        <div className="relative mx-auto w-24 h-24 mb-8">
          {verifying ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-16 h-16 text-emerald-600 animate-spin" />
            </div>
          ) : (
            <>
              <div className="absolute inset-0 bg-emerald-100 dark:bg-emerald-900/30 rounded-full animate-ping opacity-20" />
              <img
                src={success}
                alt="success"
                className="relative z-10 w-full h-full object-contain"
              />
            </>
          )}
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            {verifying ? "Verifying Payment..." : "Payment Received!"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
            {verifying
              ? "We are confirming your transaction with the bank."
              : "Thank you for your investment. Your contribution is now helping a farm grow."}
          </p>
        </div>

        {/* Transaction Details (Proper styling for logic) */}
        {!verifying && (
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
            <span className="text-xs font-medium uppercase tracking-widest text-gray-400">
              Status
            </span>
            <div className="flex items-center justify-center gap-2 mt-1 text-emerald-600 font-bold">
              <CheckCircle2 size={18} />
              <span>Investment Confirmed</span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-10">
          <Link to="/proposals">
            <button className="group relative w-full bg-amber-950 dark:bg-amber-900 text-amber-50 px-8 py-4 rounded-2xl font-bold shadow-xl shadow-amber-950/20 hover:bg-amber-900 dark:hover:bg-amber-800 transition-all active:scale-95 flex items-center justify-center gap-2 overflow-hidden">
              <span>Keep Investing</span>
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </Link>
          {proposalData && (
            <button
              onClick={downloadReceipt}
              className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition-all"
            >
              Download Receipt
            </button>
          )}
          <Link
            to="/"
            className="block mt-4 text-sm font-medium text-gray-400 hover:text-emerald-600 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
