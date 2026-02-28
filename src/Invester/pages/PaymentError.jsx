import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, RefreshCw, LifeBuoy } from 'lucide-react';
import error from '../../assets/error.webp'
function PaymentError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-6 py-12">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[35%] h-[35%] bg-red-100/50 dark:bg-red-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl w-full bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center">
          
          {/* Content Side */}
          <div className="w-full lg:w-1/2 p-10 md:p-16 text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 mb-8">
              <AlertCircle size={40} />
            </div>
            
            <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
              Oops! <span className="text-red-600">Payment Failed.</span>
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              We couldn't process your transaction. This might be due to a connection timeout or insufficient funds. Don't worry, no funds were deducted.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/proposals">
                <button className="flex items-center justify-center gap-2 bg-amber-950 hover:bg-amber-900 text-amber-50 px-8 py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-amber-950/20">
                  <RefreshCw size={18} />
                  Try Again
                </button>
              </Link>
              
              <Link to="/">
                <button className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-8 py-4 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                  Explore More
                </button>
              </Link>
            </div>

            {/* Support Link */}
            <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800 flex items-center justify-center lg:justify-start gap-2 text-gray-400 text-sm">
              <LifeBuoy size={16} />
              <span>Need help? <a href="mailto:support@farmfund.com" className="text-emerald-600 font-semibold hover:underline">Contact Support</a></span>
            </div>
          </div>

          {/* Image Side */}
          <div className="w-full lg:w-1/2 bg-gray-50 dark:bg-gray-800/30 p-12 flex items-center justify-center order-1 lg:order-2">
            <div className="relative group">
               <div className="absolute inset-0 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all" />
               <img 
                src={error}
                alt="Payment Error Illustration" 
                className="relative z-10 max-w-full h-auto transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default PaymentError;