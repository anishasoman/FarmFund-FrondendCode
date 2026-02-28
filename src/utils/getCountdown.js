export const getCountdown = (lastDate) => {
  if (!lastDate) return "No deadline";

  const end = new Date(lastDate).getTime();
  const now = new Date().getTime();
  const diff = end - now;

  if (diff <= 0) return "Closed";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  return `${days}d ${hours}h left`;
};
// import { getCountdown } from "../utils/getCountdown";
//         {/* Countdown */}
//         <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
//           <HiOutlineClock />
//           {getCountdown(proposal.lastDate)}
//         </div>