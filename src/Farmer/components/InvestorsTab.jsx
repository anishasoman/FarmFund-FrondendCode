import { useEffect, useState } from "react";
import { getFarmerproposalAPI } from "../../services/allAPIs";
import { useUser } from "../../contexts/UserContext";

const InvestorsTab = () => {
  const { user } = useUser();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchProposals = async () => {
    try {
      const reqHeader = {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      };

      const result = await getFarmerproposalAPI(reqHeader);

      console.log("PROPOSALS API:", result.data);

      if (result.status === 200) {
        setProposals(result.data.proposals || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchProposals();
}, []);


  if (loading) return <p>Loading investors...</p>;

  return (
    <div className="space-y-6">
      {proposals.map((proposal) => (
        <div
          key={proposal._id}
          className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow"
        >
          {/* Proposal title */}
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-bold dark:text-white">
              {proposal.title}
            </h3>
            <span className="text-green-700 font-semibold">
              ₹{proposal.raisedAmount} / ₹{proposal.targetAmount}
            </span>
          </div>

          {/* Investors list */}
          {proposal.investments.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-white">
              No investors yet
            </p>
          ) : (
            <div className="space-y-3">
              {proposal.investments.map((inv) => (
                <div
                  key={inv._id}
                  className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg dark:text-white"
                >
                  <div>
                    <p className="font-semibold dark:text-white">
                      {inv.investorName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-white">
                      Expected Return: {inv.expectedReturn}%
                    </p>
                  </div>

                  <p className="font-bold text-green-700">
                    ₹{inv.amount}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default InvestorsTab;
