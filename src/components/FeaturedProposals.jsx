import ProposalCard from "./ProposalCard";
import { Link } from "react-router-dom";

export default function FeaturedProposals({ proposals }) {
  return (
    <div className="max-w-7xl mx-auto px-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-serif font-semibold text-gray-900 dark:text-white">
            Featured Proposals
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1 max-w-xl">
            Discover high-potential farming projects looking for investors like you.
          </p>
        </div>

        <Link
          to="/proposals"
          className="inline-flex items-center gap-2
                     border border-green-700 dark:border-green-500
                     text-green-700 dark:text-green-400
                     px-5 py-2 rounded-full text-sm font-medium
                     hover:bg-green-700 hover:text-white
                     dark:hover:bg-green-600 dark:hover:text-white
                     transition"
        >
          View All Proposals 
        </Link>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {proposals.length > 0 ? (
          proposals.map((proposal) => (
            <ProposalCard key={proposal._id} proposal={proposal} />
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No proposals available right now.
          </p>
        )}
      </div>

    </div>
  );
}
