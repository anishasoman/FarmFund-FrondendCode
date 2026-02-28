import { useEffect, useState } from "react";
import { Drawer, DrawerHeader, DrawerItems, Label, TextInput, Textarea, Button } from "flowbite-react";
import { updateUserAPI } from "../../services/allAPIs";
import { serverURL } from "../../services/serverURL";
import { useUser } from "../../contexts/UserContext";
import { toast } from "react-toastify";

export default function AdminSettingsDrawer({ openSettings, setOpenSettings }) {
  const { user, fetchUser } = useUser();
  const token = sessionStorage.getItem("token");

  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    location: "",
  });

  useEffect(() => {
    if (!user) return;
    setFormData({
      username: user.username || "",
      password: "",
      confirmPassword: "",
      location: user.location || "",

    });
    setProfilePreview(user.profile ? `${user.profile}` : "");
    setProfileFile(null);
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value && key !== "confirmPassword") body.append(key, value);
      });

      if (profileFile) body.append("profile", profileFile);

      const res = await updateUserAPI(body, headers);
      if (res.status === 200) {
        await fetchUser();
        setOpenSettings(false);
        toast.success("Profile updated successfully");
      }
    } catch (err) {
      console.error(err);
      toast.error("Profile update failed");
    }
  };

  const firstLetter = formData.username?.charAt(0).toUpperCase() || "F";

  return (
    <Drawer open={openSettings} onClose={() => setOpenSettings(false)} position="right">
      <DrawerHeader title="Profile Settings" />
      <DrawerItems>
        <form onSubmit={handleSave} className="grid gap-4 p-2">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-2">
            <label htmlFor="uploadProfile" className="cursor-pointer">
              <input type="file" hidden id="uploadProfile" accept="image/*" onChange={handleImageChange} />
              <div className="w-24 h-24 rounded-full bg-green-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                {profilePreview ? <img src={profilePreview} className="w-full h-full object-cover" /> : firstLetter}
              </div>
            </label>
          </div>

          <Label>Username</Label>
          <TextInput name="username" value={formData.username} onChange={handleChange} required />


          <Label>Location</Label>
          <TextInput name="location" value={formData.location} onChange={handleChange} />


          <Label>New Password</Label>
          <TextInput type="password" name="password" value={formData.password} onChange={handleChange} />

          <Label>Confirm Password</Label>
          <TextInput type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />

          <Button type="submit" className="mt-2 bg-green-600 hover:bg-green-700 text-white">
            Save Changes
          </Button>
        </form>
      </DrawerItems>
    </Drawer>
  );
}
