import React, { useState } from "react";
import Spinner from "./../components/Spinner";
import { toast } from "react-toastify";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import {
  Timestamp,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./../firebase";
import { useNavigate } from "react-router-dom";
const apiKey = process.env.REACT_APP_GEOCODE_API_KEY;
export default function CreateListing() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [geoLocationEnabled, setGeoLocationEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    latitude: 0,
    longitude: 0,
    images: {},
  });

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    description,
    offer,
    regularPrice,
    discountedPrice,
    latitude,
    longitude,
    images,
  } = formData;

  const handleChange = (e) => {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    // Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files, // Fixed typo here
      }));
    }
    // Text / Number / Boolean
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (+discountedPrice >= +regularPrice) {
      setLoading(false);
      toast.error("Discounted price needs to be less then regullar price.");
      return;
    }
    if (images.length > 7) {
      setLoading(false);
      toast.error("Maximum 6 iamges are allowed.");
      return;
    }
    let geolocation = {};
    if (geoLocationEnabled) {
      const encodedAddress = encodeURIComponent(address);

      const url = `https://map-geocoding.p.rapidapi.com/json?address=${encodedAddress}`;
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": "map-geocoding.p.rapidapi.com",
        },
      };

      const response = await fetch(url, options);
      const data = await response.json();
      console.log(data);

      const location =
        data.status === "ZERO_RESULTS"
          ? undefined
          : data.results[0]?.geometry.location;
      if (!location) {
        setLoading(false);
        toast.error("Please enter a correct address");
        return;
      }
      geolocation.lat = location.lat ?? 0;
      geolocation.lng = location.lng ?? 0;
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
    }

    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error("Image not Uploaded/.");
    });

    const formDataCopy = {
      ...formData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
    };

    delete formDataCopy.images;
    delete formDataCopy.latitude;
    delete formDataCopy.longitude;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;

    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
    setLoading(false);
    toast.success("Listing added.");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };

  if (loading) {
    return <Spinner />;
  }
  return (
    <main className="max-w-md px-2 mx-auto">
      <h1 className="text-3xl text-center mt-6 font-bold">Create Listing</h1>
      <form onSubmit={handleSubmit} className="mr-3">
        <p className="text-xl mt-6 font-semibold">Sell / Rent</p>
        <div className="flex ">
          <button
            type="button"
            id="type"
            value="sale"
            onClick={handleChange} // Changed from onChange to onClick
            className={`mr-3 px-7 py-3 text-sm uppercase font-medium shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out w-full ${
              type === "rent"
                ? "bg-white text-black"
                : "text-white bg-slate-600"
            }`}
          >
            sell
          </button>
          <button
            type="button"
            id="type"
            value="rent"
            onClick={handleChange} // Changed from onChange to onClick
            className={`ml-3 px-7 py-3 text-sm uppercase font-medium shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out w-full ${
              type === "sale"
                ? "bg-white text-black"
                : "text-white bg-slate-600"
            }`}
          >
            rent
          </button>
        </div>
        <p className="text-xl mt-6 font-semibold">Name</p>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={handleChange}
          maxLength={32}
          minLength={10}
          placeholder="Name"
          required
          className={`w-full px-4 py-2 text-xl text-gray-700 border border-gray-300 bg-white rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6`}
        />
        <div className="flex space-x-6">
          <div>
            <p className="text-xl font-semibold">Beds</p>
            <input
              type="number"
              id="bedrooms"
              value={bedrooms}
              onChange={handleChange}
              min="1"
              max="50"
              required
              className="w-full px-4 py-2 text-center text-xl text-gray-700 border border-gray-300 bg-white rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 "
            />
          </div>
          <div>
            <p className="text-xl font-semibold">Baths</p>
            <input
              type="number"
              id="bathrooms"
              value={bathrooms}
              onChange={handleChange}
              min="1"
              max="50"
              required
              className="w-full px-4 py-2 text-center text-xl text-gray-700 border border-gray-300 bg-white rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 "
            />
          </div>
        </div>
        <p className="text-xl mt-6 font-semibold">Parking spot</p>
        <div className="flex ">
          <button
            type="button"
            id="parking"
            value={true}
            onClick={handleChange} // Changed from onChange to onClick
            className={`mr-3 px-7 py-3 text-sm uppercase font-medium shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out w-full ${
              !parking ? "bg-white text-black" : "text-white bg-slate-600"
            }`}
          >
            yes
          </button>
          <button
            type="button"
            id="parking"
            value={false}
            onClick={handleChange} // Changed from onChange to onClick
            className={`ml-3 px-7 py-3 text-sm uppercase font-medium shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out w-full ${
              parking ? "bg-white text-black" : "text-white bg-slate-600"
            }`}
          >
            no
          </button>
        </div>
        <p className="text-xl mt-6 font-semibold">Furnished</p>
        <div className="flex ">
          <button
            type="button"
            id="furnished"
            value={true}
            onClick={handleChange} // Changed from onChange to onClick
            className={`mr-3 px-7 py-3 text-sm uppercase font-medium shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out w-full ${
              !furnished ? "bg-white text-black" : "text-white bg-slate-600"
            }`}
          >
            yes
          </button>
          <button
            type="button"
            id="furnished"
            value={false}
            onClick={handleChange} // Changed from onChange to onClick
            className={`ml-3 px-7 py-3 text-sm uppercase font-medium shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out w-full ${
              furnished ? "bg-white text-black" : "text-white bg-slate-600"
            }`}
          >
            no
          </button>
        </div>
        <p className="text-xl mt-6 font-semibold">Address</p>
        <textarea
          type="text"
          id="address"
          value={address}
          onChange={handleChange}
          maxLength={32}
          minLength={10}
          placeholder="Address"
          required
          className={`resize-none w-full px-4 py-2 text-xl text-gray-700 border border-gray-300 bg-white rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 `}
        />
        {!geoLocationEnabled && (
          <div className="flex space-x-6 mb-6">
            <div>
              <p className="text-xl mt-6 font-semibold">Latitude</p>
              <input
                type="number"
                id="latitude"
                value={latitude}
                onChange={handleChange}
                required
                min={-90}
                max={90}
                className="w-full px-4 py-2 text-center text-xl text-gray-700 border border-gray-300 bg-white rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600  "
              />
            </div>
            <div>
              <p className="text-xl mt-6 font-semibold">Longitude</p>
              <input
                type="number"
                id="longitude"
                value={longitude}
                onChange={handleChange}
                required
                min={-180}
                max={180}
                className="w-full px-4 py-2 text-center text-xl text-gray-700 border border-gray-300 bg-white rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600  "
              />
            </div>
          </div>
        )}
        <p className="text-xl  font-semibold">Description</p>
        <textarea
          type="text"
          id="description"
          value={description}
          onChange={handleChange}
          maxLength={32}
          minLength={10}
          placeholder="Description"
          required
          className={`resize-none w-full px-4 py-2 text-xl text-gray-700 border border-gray-300 bg-white rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6`}
        />
        <p className="text-xl font-semibold">Offer</p>
        <div className="flex mb-6">
          <button
            type="button"
            id="offer"
            value={true}
            onClick={handleChange} // Changed from onChange to onClick
            className={`mr-3 px-7 py-3 text-sm uppercase font-medium shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out w-full ${
              !offer ? "bg-white text-black" : "text-white bg-slate-600"
            }`}
          >
            yes
          </button>
          <button
            type="button"
            id="offer"
            value={false}
            onClick={handleChange} // Changed from onChange to onClick
            className={`ml-3 px-7 py-3 text-sm uppercase font-medium shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out w-full ${
              offer ? "bg-white text-black" : "text-white bg-slate-600"
            }`}
          >
            no
          </button>
        </div>
        <div className="flex mb-6 items-center ">
          <div className="">
            <p className="text-xl font-semibold">Regular Price</p>
            <div className="w-full flex justify-center items-center space-x-6">
              <input
                type="number"
                id="regularPrice"
                value={regularPrice}
                onChange={handleChange}
                min="100"
                max="5000000"
                required
                className="w-full px-4 py-2 text-center text-xl text-gray-700 border border-gray-300 bg-white rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600  "
              />
              {type === "rent" && (
                <div className="">
                  <p className="text-lg w-full whitespace-nowrap">$ / Month</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {offer && (
          <div className="flex mb-6 items-center ">
            <div className="">
              <p className="text-xl font-semibold">Discounted Price</p>
              <div className="w-full flex justify-center items-center space-x-6">
                <input
                  type="number"
                  id="discountedPrice"
                  value={discountedPrice}
                  onChange={handleChange}
                  min="100"
                  max="5000000"
                  required={offer}
                  className="w-full px-4 py-2 text-center text-xl text-gray-700 border border-gray-300 bg-white rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600  "
                />
                {type === "rent" && (
                  <div className="">
                    <p className="text-lg w-full whitespace-nowrap">
                      $ / Month
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="mb-6">
          <p className="text-xl font-semibold"> Images</p>
          <p className="text-gray-600 mb-1">
            The first image will be cover (max 6)
          </p>
          <input
            type="file"
            id="images" // Corrected typo from "iamges" to "images"
            onChange={handleChange}
            accept=".png,.jpg,.jpeg"
            multiple
            required
            className="w-full px-3 py-1.5 text-gray-700 border border-gray-300 bg-white rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600  "
          />
        </div>{" "}
        <button
          className="w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium rounded uppercase shadow-md hover:bg-blue-700 transition duration-200 ease-in-out active:bg-blue-800 hover:shadow-lg mb-6"
          type="submit"
        >
          create listing
        </button>
      </form>
    </main>
  );
}
