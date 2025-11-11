import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";
import "./ProfileCard.css"; // Update path if different
import ProfileCard from "../pages/ProfileCard"; // ✅ THIS LINE IS IMPORTANT

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start pt-20 px-4">
      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">Profile</h1>
      </div>

      {/* Avatar Upload */}
      <div className="relative mb-8">
        <label
          htmlFor="avatar-upload"
          className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${
            isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
          }`}
        >
          <Camera className="w-5 h-5 text-base-200" />
          <input
            type="file"
            id="avatar-upload"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isUpdatingProfile}
          />
        </label>
        <p className="text-sm text-zinc-400 mt-2 text-center">
          {isUpdatingProfile
            ? "Uploading..."
            : "Click the camera icon to update your photo"}
        </p>
      </div>

      {/* Profile Card */}
      <div className="w-full max-w-md px-4 mb-10">
        <ProfileCard
          avatarUrl={selectedImg || authUser.profilePic || "/avatar.png"}
          miniAvatarUrl={selectedImg || authUser.profilePic || "/avatar.png"}
          name={authUser?.fullName || "Unnamed User"}
          title="Member"
          handle={authUser?.fullName?.toLowerCase().replace(/\s+/g, "") || "user"}
          status="Online"
          contactText="Message"
          onContactClick={() => alert("Message sent!")}
        />
      </div>

      {/* User Info */}
      <div className="w-full max-w-2xl bg-base-300 rounded-xl p-6 space-y-6 text-left">
        <div>
          <h2 className="text-lg font-medium mb-2">Personal Info</h2>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border mt-1">
                {authUser?.fullName}
              </p>
            </div>

            <div>
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border mt-1">
                {authUser?.email}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-700">
          <h2 className="text-lg font-medium mb-2">Account Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-zinc-700">
              <span>Member Since</span>
              <span>{authUser.createdAt?.split("T")[0]}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Account Status</span>
              <span className="text-green-500">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
