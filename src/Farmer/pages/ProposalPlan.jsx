import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalFooter,
  ModalBody,
  ModalHeader,
  TextInput,
  Textarea,
  FileInput,
  Select,
} from "flowbite-react";
import { Wallet, Target, Users, TrendingUp, Plus } from "lucide-react";
import { toast } from "sonner";

import {
  getFarmerproposalAPI,
  createProposalAPI,
  postUpdateAPI,
} from "../../services/allAPIs";

import ProposalTable from "../components/ProposalTable";
import PostUpdate from "../components/PostUpdate";
import StatCard from "../components/StatCard";

export default function ProposalPlan() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFunding, setOpenFunding] = useState(false);

  const [selectedProposal, setSelectedProposal] = useState("");
  const [updateContent, setUpdateContent] = useState("");

  /* ---------------- PROPOSAL FORM STATE ---------------- */
  const [proposalData, setProposalData] = useState({
    title: "",
    description: "",
    location: "",
    targetAmount: "",
    duration: "",
    expectedReturn: "",
    category: "",
    lastDate: "",
    risk: "",
    bgimage: null,
    image: null,
  });

  // fetching
  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      const reqHeader = {
        Authorization: `Bearer ${token}`,
      };

      const result = await getFarmerproposalAPI(reqHeader);

      if (result.status === 200) {
        setProposals(result.data.proposals || []);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load proposals");
    } finally {
      setLoading(false);
    }
  };

  // stats
  const totalRaised = proposals.reduce(
    (sum, p) => sum + Number(p.raisedAmount || 0),
    0,
  );

  const totalTarget = proposals.reduce(
    (sum, p) => sum + Number(p.targetAmount || 0),
    0,
  );

  const totalInvestors = proposals.reduce(
    (sum, p) => sum + (p.investments?.length || 0),
    0,
  );

  const activeProposalsCount = proposals.filter(
    (p) => p.status === "active",
  ).length;

  //  post update
  const handlePostUpdate = async (proposalId, formData) => {
    try {
      const token = sessionStorage.getItem("token");

      const res = await postUpdateAPI(proposalId, formData, {
        Authorization: `Bearer ${token}`,
      });

      if (res.status === 200) {
        toast.success("Update posted successfully");
      }
    } catch (err) {
      toast.error("Failed to post update");
    }
  };

  //  form handle
  const handleChange = (e) => {
    setProposalData({ ...proposalData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProposalData({
      ...proposalData,
      [e.target.name]: e.target.files[0],
    });
  };

  const handleCreateProposal = async () => {
    const values = Object.values(proposalData);
    if (values.includes("") || values.includes(null)) {
      toast.error("All fields including images are required");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.error("Please login again");
        return;
      }

      const formData = new FormData();
      Object.entries(proposalData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const reqHeader = {
        Authorization: `Bearer ${token}`,
      };

      const result = await createProposalAPI(formData, reqHeader);

      if (result.status === 201) {
        toast.success("Proposal created successfully");
        setOpenFunding(false);
        fetchProposals();
      } else {
        toast.error("Failed to create proposal");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen px-4">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          icon={Wallet}
          label="Total Raised"
          value={`₹${totalRaised}`}
        />
        <StatCard
          icon={Target}
          label="Remaining Target"
          value={`₹${totalTarget - totalRaised}`}
        />
        <StatCard icon={Users} label="Investors" value={totalInvestors} />
        <StatCard
          icon={TrendingUp}
          label="Active Proposals"
          value={activeProposalsCount}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Proposals */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">My Proposals</h2>
            <Button
              onClick={() => setOpenFunding(true)}
              className="bg-green-700"
            >
              <Plus className="mr-1" /> New Proposal
            </Button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
            <ProposalTable proposals={proposals} setProposals={setProposals} />
          </div>
        </div>

        {/* Updates */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
          <PostUpdate
            proposals={proposals}
            selectedProposal={selectedProposal}
            setSelectedProposal={setSelectedProposal}
            updateContent={updateContent}
            setUpdateContent={setUpdateContent}
            onPost={handlePostUpdate}
          />
        </div>
      </div>

      {/* MODAL */}
      <Modal show={openFunding} onClose={() => setOpenFunding(false)}>
        <ModalHeader>New Investment Proposal</ModalHeader>
        <ModalBody className="grid gap-3">
          <TextInput name="title" placeholder="Title" onChange={handleChange} />
          <Textarea
            name="description"
            placeholder="Description"
            rows={4}
            onChange={handleChange}
            className="pb-6"
          />
          <TextInput
            name="location"
            placeholder="Location"
            onChange={handleChange}
          />
          <TextInput
            name="category"
            placeholder="Category"
            onChange={handleChange}
          />
          <TextInput
            type="number"
            name="targetAmount"
            placeholder="Target Amount"
            onChange={handleChange}
          />
          <TextInput
            name="duration"
            placeholder="Duration (months)"
            onChange={handleChange}
          />

          <Select name="risk" onChange={handleChange}>
            <option value="">Select Risk</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>

          <TextInput
            name="expectedReturn"
            placeholder="Expected Return %"
            onChange={handleChange}
          />
          {/* Closing Date */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Closing Date
            </label>
            <TextInput
              type="date"
              name="lastDate"
              min={new Date().toISOString().split("T")[0]}
              onChange={handleChange}
              required
            />
          </div>
          {/* Image Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Background Image */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Background Image
              </label>
              <FileInput
                name="bgimage"
                accept="image/*"
                onChange={handleFileChange}
              />
              <p className="text-xs text-gray-500">
                Recommended: wide image in jpg or jpeg (landscape)
              </p>
            </div>

            {/* Card Image */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Card Image
              </label>
              <FileInput
                name="image"
                accept="image/*"
                onChange={handleFileChange}
              />
              <p className="text-xs text-gray-500">Recommended: square image in jpg or jpeg </p>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button color="success" onClick={handleCreateProposal}>
            Submit
          </Button>
          <Button color="gray" onClick={() => setOpenFunding(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}