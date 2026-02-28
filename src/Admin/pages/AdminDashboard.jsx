import { useEffect, useState } from "react";
import {
  Card,
  Badge,
  Button,
  Tabs,
  TabItem
} from "flowbite-react";
import {
  HiShieldCheck,
  HiCheckCircle,
  HiFlag,
  HiBan,
  HiTrash
} from "react-icons/hi";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getAdminAPI,
  getUsersAPI,
  updateFarmerAPI,
  getAllProposalsAPI,
  deleteUserAPI
} from "../../services/allAPIs";
import { serverURL } from "../../services/serverURL";
import AdminReviews from "../../Admin/components/AdminReviews";

const ITEMS_PER_PAGE = 6;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const [admin, setAdmin] = useState(null);
  const [users, setUsers] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [farmerPage, setFarmerPage] = useState(1);
  const [investorPage, setInvestorPage] = useState(1);
  const [inactivePage, setInactivePage] = useState(1);

  const reqHeader = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) navigate("/login");
    else fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [adminRes, usersRes, proposalsRes] = await Promise.all([
        getAdminAPI(reqHeader),
        getUsersAPI(reqHeader),
        getAllProposalsAPI(reqHeader)
      ]);

      if (adminRes.status === 200) setAdmin(adminRes.data);
      if (usersRes.status === 200) setUsers(usersRes.data);
      if (proposalsRes.status === 200) setProposals(proposalsRes.data);
    } catch {
      toast.error("Unauthorized access");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  /* filter */

  const farmers = users.filter(u => u.role === "farmer");
  const investors = users.filter(u => u.role === "investor");

  const activeFarmerIds = new Set(
    proposals.map(p => p.farmerId?._id?.toString())
  );

  const activeInvestorIds = new Set(
    proposals.flatMap(p =>
      p.investments?.map(inv => inv.investorId?._id?.toString()) || []
    )
  );

  const inactiveUsers = users.filter(user => {
    if (user.role === "farmer")
      return !activeFarmerIds.has(user._id.toString());
    if (user.role === "investor")
      return !activeInvestorIds.has(user._id.toString());
    return false;
  });



  const deleteUser = async id => {
    if (!confirm("Delete this user permanently?")) return;

    try {
      const res = await deleteUserAPI(id, reqHeader);
      if (res) {
        setUsers(prev => prev.filter(u => u._id !== id));
        toast.success("User deleted successfully");
      }
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await updateFarmerAPI(reqHeader, { userId: id, status });
      if (res.status === 200) {
        setUsers(prev =>
          prev.map(u => (u._id === id ? { ...u, status } : u))
        );
        toast.success(res.data.message);
      }
    } catch {
      toast.error("Status update failed");
    }
  };

  if (loading)
    return (
      <p className="text-center mt-20 text-lg text-gray-600 dark:text-gray-300">
        Loading dashboard…
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF9F6] to-[#eef5f1] dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-10">
          <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-xl">
            <HiShieldCheck className="text-white w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome, {admin?.username}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Admin Control & Verification Panel
            </p>
          </div>
        </div>

        <Tabs className="rounded-xl shadow-lg bg-white dark:bg-gray-900 p-4 ">

          {/* FARMERS */}
          <TabItem title="Farmers">
            <Grid>
              {paginate(farmers, farmerPage).map(f => (
                <FarmerCard
                  key={f._id}
                  farmer={f}
                  onVerify={() => updateStatus(f._id, "verified")}
                  onReport={() => updateStatus(f._id, "reported")}
                />
              ))}
            </Grid>
            <Pagination page={farmerPage} setPage={setFarmerPage} total={farmers.length} />
          </TabItem>

          {/* INVESTORS */}
          <TabItem title="Investors">
            <Grid>
              {paginate(investors, investorPage).map(i => (
                <UserCard key={i._id} user={i} />
              ))}
            </Grid>
            <Pagination page={investorPage} setPage={setInvestorPage} total={investors.length} />
          </TabItem>

          {/* INACTIVE USERS */}
          <TabItem title="Inactive Users">
            {inactiveUsers.length === 0 ? (
              <EmptyState />
            ) : (
              <Grid>
                {paginate(inactiveUsers, inactivePage).map(user => (
                  <Card
                    key={user._id}
                    className="hover:shadow-xl transition-all border-l-4 border-red-500 dark:bg-gray-800 dark:border-red-600"
                  >
                    <div className="flex items-center gap-4">
                      <ProfileAvatar user={user} />
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          {user.username}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                        <Badge color="failure">{user.role}</Badge>
                      </div>
                      <Button color="failure" onClick={() => deleteUser(user._id)} className="dark:text-white">
                        <HiTrash className="mr-1 dark:text-white" /> Delete
                      </Button>
                    </div>
                  </Card>
                ))}
              </Grid>
            )}
            <Pagination page={inactivePage} setPage={setInactivePage} total={inactiveUsers.length} />
          </TabItem>
          <TabItem title="Reviews">
  <div>
    <AdminReviews />
  </div>
          </TabItem>
        </Tabs>
      </div>
    </div>
  );
};

/* COMPONENTS */

const FarmerCard = ({ farmer, onVerify, onReport }) => (
  <Card className="hover:shadow-xl transition dark:bg-gray-800">
    <div className="flex items-center gap-4">
      <ProfileAvatar user={farmer} />
      <div className="flex-1">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {farmer.username}
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          🌾 {farmer.farmName || "—"}
        </p>
        <Badge className="mt-2 capitalize">{farmer.status || "pending"}</Badge>
      </div>
    </div>

    <div className="flex gap-2 mt-4">
      <Button color="success" onClick={onVerify} className="dark:text-white">
        <HiCheckCircle className="mr-1" /> Verify
      </Button>
      <Button color="failure" onClick={onReport} className="dark:text-white">
        <HiFlag className="mr-1" /> Report
      </Button>
    </div>
  </Card>
);

const UserCard = ({ user }) => (
  <Card className="hover:shadow-lg transition dark:bg-gray-800">
    <div className="flex gap-4">
      <ProfileAvatar user={user} />
      <div>
        <h3 className="font-bold text-gray-900 dark:text-white">
          {user.username}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {user.email}
        </p>
        <Badge>{user.role}</Badge>
      </div>
    </div>
  </Card>
);

const ProfileAvatar = ({ user }) =>
  user.profile ? (
    <img
      src={`${serverURL}/uploads/${user.profile}`}
      className="w-16 h-16 rounded-full object-cover"
    />
  ) : (
    <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xl">
      {user.username?.charAt(0).toUpperCase()}
    </div>
  );

const EmptyState = () => (
  <div className="text-center mt-16 text-gray-500 dark:text-gray-400">
    <HiBan className="mx-auto w-14 h-14 mb-3 opacity-40" />
    <p className="text-lg font-medium">No inactive users found</p>
    <p className="text-sm">All users are active</p>
  </div>
);

const Pagination = ({ page, setPage, total }) => {
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-4 mt-6">
      <Button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</Button>
      <span className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        Page {page} of {totalPages}
      </span>
      <Button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
    </div>
  );
};

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {children}
  </div>
);

const paginate = (array, page) => {
  const start = (page - 1) * ITEMS_PER_PAGE;
  return array.slice(start, start + ITEMS_PER_PAGE);
};

export default AdminDashboard;
