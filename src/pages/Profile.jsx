import { getAuth, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

const Profile = () => {
  const [changeDetail, setChangeDetail] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  const onchange = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      [event.target.id]: event.target.value,
    }));
  };

  const handleSignOutClick = () => {
    auth.signOut();
    navigate("/");
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // updat the firebse auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        // update the firestore db
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        });
        toast.success("Profile Updated. ");
      }
    } catch (error) {
      toast.error("Could not update the profile.");
    }
  };

  return (
    <section className="flex justify-center items-center flex-col max-w-6xl mx-auto">
      <h1 className="text-3xl text-center mt-6 font-bold">Profile</h1>
      <div className="w-full md:w-[50%] mt-6 px-3">
        <form>
          <input
            disabled={!changeDetail}
            onchange={onchange}
            type="name"
            id="name"
            value={name}
            onChange={onchange}
            className={`mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out ${
              changeDetail && "bg-red-200 focus:bg-red-200"
            }`}
          />
          <input
            disabled
            type="email"
            id="email"
            value={email}
            onChange={onchange}
            className="mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
          />

          <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6">
            <p className="flex items-center">
              Don't you want to change your name?{" "}
              <span
                onClick={() => {
                  changeDetail && onSubmit();
                  setChangeDetail(!changeDetail);
                }}
                className="text-red-600 hover:text-red-800 transition duration-200 ml-1 cursor-pointer ease-in-out "
              >
                {changeDetail ? "Apply Change" : "Edit"}
              </span>
            </p>
            <p
              onClick={handleSignOutClick}
              className="text-blue-600 hover:text-blue-800 transition duration-200 cursor-pointer ease-in-out "
            >
              Sign out
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Profile;
