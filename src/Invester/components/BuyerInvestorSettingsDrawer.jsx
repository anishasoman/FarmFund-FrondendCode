import { useEffect, useState } from "react";
import {
  Drawer,
  DrawerHeader,
  DrawerItems,
  Label,
  TextInput,
  Button,
} from "flowbite-react";
import { updateUserAPI } from "../../services/allAPIs";
import { serverURL } from "../../services/serverURL";
import { HiPencil, HiTrash } from "react-icons/hi";
import { toast } from "react-toastify";

export default function BuyerInvestorSettingsDrawer({
  openSettings,
  setOpenSettings,
  userData,
  refreshUser,
}) {
  const token = sessionStorage.getItem("token");

  const [formData, setFormData] = useState({
    username: "",
    address: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [profileFile, setProfileFile] = useState(null);
  const [preview, setPreview] = useState("");

  /* LOAD USER DATA */

  useEffect(() => {
    if (!userData) return;

    setFormData({
      username: userData.username || "",
      address: userData.address || "",
      phone: userData.phone || "",
      password: "",
      confirmPassword: "",
    });

    setPreview(
      userData.profile ? `${userData.profile}` : "",
    );
    setProfileFile(null);
  }, [userData]);

  /*HANDLERS */

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfileFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    // PASSWORD VALIDATION
    if (formData.password || formData.confirmPassword) {
      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
    }

    try {
      const body = new FormData();

      body.append("username", formData.username);
      body.append("address", formData.address);
      body.append("phone", formData.phone);

      if (profileFile) body.append("profile", profileFile);
      if (formData.password) body.append("password", formData.password);

      const res = await updateUserAPI(body, {
        Authorization: `Bearer ${token}`,
      });

      if (res.status === 200) {
        toast.success("Profile updated successfully");
        await refreshUser();
        setOpenSettings(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  return (
    <Drawer
      open={openSettings}
      onClose={() => setOpenSettings(false)}
      position="right"
    >
      <DrawerHeader title="Profile Settings" />
      <DrawerItems>
        <div className="flex flex-col gap-4 p-2">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-green-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                {preview ? (
                  <img src={preview} className="w-full h-full object-cover" />
                ) : (
                  formData.username?.charAt(0).toUpperCase()
                )}
              </div>

              <label
                htmlFor="profileUpload"
                className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow cursor-pointer"
              >
                <HiPencil className="w-4 h-4 text-green-600" />
              </label>

              <input
                id="profileUpload"
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <span className="text-xs text-gray-500">
              Click pen to change photo
            </span>
          </div>

          {/* Fields */}
          <Label>Username</Label>
          <TextInput
            name="username"
            value={formData.username}
            onChange={handleChange}
          />

          <Label>Address</Label>
          <TextInput
            name="address"
            value={formData.address}
            onChange={handleChange}
          />

          <Label>Phone</Label>
          <TextInput
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          {/*  Password Section */}

          <Label>New Password</Label>
          <TextInput
            type="password"
            name="password"
            placeholder="Leave blank to keep current"
            value={formData.password}
            onChange={handleChange}
          />

          <Label className="mt-2">Confirm Password</Label>
          <TextInput
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <Button className="bg-green-600 text-white" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DrawerItems>
    </Drawer>
  );
}
