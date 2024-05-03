import { getAuth, updateProfile } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { FcHome } from "react-icons/fc";
import ListingItem from "../components/ListingItem";

const Profile = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    async function fetchUserListings() {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid), // Change === to ==
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q); // Change getDoc to getDocs
      let listings = [];
      querySnap.forEach((doc) => {
        listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    }
    fetchUserListings();
  }, [auth.currentUser.uid]);

  return (
    <>
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
          <button
            typeof="button"
            className="flex items-center justify-center w-full bg-blue-600 text-white mb-6 px-7 py-3 text-sm font-medium rounded uppercase shadow-md hover:bg-blue-700 transition duration-200 ease-in-out active:bg-blue-800 hover:shadow-lg"
            type="submit"
          >
            <Link
              to="/create-listing"
              className="flex items-center justify-center"
            >
              <FcHome className="text-2xl bg-white rounded-full mr-2" />
              sell and rent your home
            </Link>
          </button>
        </div>
      </section>
      <div className="max-w-6xl mx-auto mt-6 px-3">
        {loading ? (
          <p>Loading...</p>
        ) : listings.length > 0 ? (
          <>
            <h2 className="text-2xl text-center mt-6 font-semibold">
              My Listings
            </h2>
            <ul>
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                />
              ))}
            </ul>
          </>
        ) : (
          <p>No listings found.</p>
        )}
      </div>
    </>
  );
};

export default Profile;
