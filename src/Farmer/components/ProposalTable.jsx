import { useState } from "react";
import {
  Card,
  Table,
  Badge,
  Progress,
  Button,
  Modal,
  TextInput,
  ModalBody,
  ModalHeader,
  ModalFooter,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { Pencil } from "lucide-react";
import { serverURL } from "../../services/serverURL";
import { updateLastDateAPI } from "../../services/allAPIs";
import { toast } from "sonner";

export default function ProposalTable({ proposals, setProposals }) {
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [lastDate, setLastDate] = useState("");

//modal open
  const handleEdit = (proposal) => {
    setSelectedId(proposal._id);
    setLastDate(
      proposal.lastDate ? proposal.lastDate.split("T")[0] : ""
    );
    setOpenEdit(true);
  };

  // update date
  const handleUpdate = async () => {
    if (!lastDate) {
      toast.error("Please select a valid date");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");

      const reqHeader = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      await updateLastDateAPI(
        { proposalId: selectedId, lastDate },
        reqHeader
      );

      toast.success("Last date updated successfully");


      const isoDate = new Date(lastDate).toISOString();

      setProposals((prev) =>
        prev.map((p) =>
          p._id === selectedId ? { ...p, lastDate: isoDate } : p
        )
      );

      setOpenEdit(false);
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  return (
    <>
      <Card className="dark:bg-gray-800">
        <div className="overflow-x-auto">
          <Table hoverable>
            <TableHead>
              <TableRow>
                <TableHeadCell>Project</TableHeadCell>
                <TableHeadCell className="hidden md:table-cell">
                  Location
                </TableHeadCell>
                <TableHeadCell>Target</TableHeadCell>
                <TableHeadCell>Raised</TableHeadCell>
                <TableHeadCell className="hidden sm:table-cell">
                  Progress
                </TableHeadCell>
                <TableHeadCell>Return</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell>Edit</TableHeadCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {proposals.map((p) => {
                const progress = Math.round(
                  (p.raisedAmount / p.targetAmount) * 100
                );

                return (
                  <TableRow key={p._id} className="dark:border-gray-700">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            p.image
                              ? `${p.image}`
                              : "https://i.ibb.co/default-avatar.png"
                          }
                          alt={p.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {p.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {p.category}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      {p.location}
                    </TableCell>

                    <TableCell className="font-medium">
                      ₹{p.targetAmount.toLocaleString()}
                    </TableCell>

                    <TableCell className="font-semibold text-green-600">
                      ₹{p.raisedAmount.toLocaleString()}
                    </TableCell>

                    <TableCell className="hidden sm:table-cell w-48">
                      <Progress progress={progress} size="sm" />
                      <p className="text-xs text-gray-500 mt-1">
                        {progress}%
                      </p>
                    </TableCell>

                    <TableCell className="font-semibold text-green-700">
                      {p.expectedReturn}%
                    </TableCell>

                    <TableCell>
                      <Badge
                        color={
                          p.status === "active"
                            ? "success"
                            : p.status === "funded"
                            ? "info"
                            : "gray"
                        }
                      >
                        {p.status.toUpperCase()}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Button
                        size="xs"
                        color="gray"
                        onClick={() => handleEdit(p)}
                      >
                        <Pencil size={14} />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* editmodal*/}
      <Modal show={openEdit} onClose={() => setOpenEdit(false)}>
        <ModalHeader>Edit Last Date</ModalHeader>

        <ModalBody>
          <TextInput
            type="date"
            value={lastDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setLastDate(e.target.value)}
          />
        </ModalBody>

        <ModalFooter>
          <Button color="success" onClick={handleUpdate}>
            Save
          </Button>
          <Button color="gray" onClick={() => setOpenEdit(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
