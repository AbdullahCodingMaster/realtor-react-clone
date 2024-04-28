import React, { useState } from "react";

export default function CreateListing() {
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
  } = formData;
  const handleChange = () => {};
  return (
    <main className="max-w-md px-2 mx-auto">
      <h1 className="text-3xl text-center mt-6 font-bold">Create Listing</h1>
      <form className="mr-3">
        <p className="text-xl mt-6 font-semibold">Sell / Rent</p>
        <div className="flex ">
          <button
            type="button"
            id="type"
            value="sale"
            onChange={handleChange}
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
            onChange={handleChange}
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
              name="bedrooms"
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
              name="bathrooms"
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
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
          name="address"
          id="address"
          value={address}
          onChange={handleChange}
          maxLength={32}
          minLength={10}
          placeholder="Address"
          required
          className={`resize-none w-full px-4 py-2 text-xl text-gray-700 border border-gray-300 bg-white rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6`}
        />
        <p className="text-xl  font-semibold">Description</p>
        <textarea
          type="text"
          name="description"
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            id="iamges"
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
