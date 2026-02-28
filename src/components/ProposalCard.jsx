import { serverURL } from "../services/serverURL";
import { getCountdown } from "../utils/getCountdown";
import { HiOutlineClock } from "react-icons/hi";
import { Clock, TrendingUp } from "lucide-react";

export default function ProposalCard({ proposal }) {
const percent =
  proposal.targetAmount > 0
    ? Math.round((proposal.raisedAmount / proposal.targetAmount) * 100)
    : 0;


  const remaining = proposal.targetAmount - proposal.raisedAmount;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-none
                    border border-transparent dark:border-gray-700
                    overflow-hidden transition hover:shadow-lg">

      {/* Image */}
      <div className="relative">
        <img
          src={`${proposal.image}`}
          alt={proposal.title}
          className="h-48 w-full object-cover"
        />

        {/* Category */}
        <span className="absolute top-4 left-4 bg-yellow-400 text-gray-900
                         text-xs font-semibold px-3 py-1 rounded-full">
          {proposal.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">

        {/* Farmer */}
        <div className="flex items-center gap-3">
          <img
            src={`${proposal.farmerAvatar}`}
            alt={proposal.farmerName}
            className="w-9 h-9 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {proposal.farmerName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {proposal.location}, India
            </p>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-serif font-semibold text-lg text-gray-900 dark:text-white">
          {proposal.title}
        </h3>

        {/* Raised */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Raised</span>
          <span className="font-semibold text-gray-900 dark:text-gray-200">
            ₹{proposal.raisedAmount.toLocaleString()}
          </span>
        </div>

        {/* Progress */}
        <div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-700 dark:bg-green-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1 text-gray-500 dark:text-gray-400">
            <span>{percent}% funded</span>
            <span>₹{remaining.toLocaleString()} to go</span>
          </div>
        </div>

        {/* Footer */}
         <div className="flex items-center justify-between text-xs pt-2">
            <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
            {/* <Clock className="w-4 h-4" /> */}
            {proposal.duration} months
            </span>

             <span className="flex items-center gap-1.5 text-orange-500 font-semibold">
               <TrendingUp className="w-4 h-4" />
               {proposal.expectedReturn}% returns
               </span>
          </div>

                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                     <Clock className="w-4 h-4" />
                  {getCountdown(proposal.lastDate)}
                </div>
      </div>
    </div>
  );
}
