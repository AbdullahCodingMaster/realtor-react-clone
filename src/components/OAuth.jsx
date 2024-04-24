import { FcGoogle } from "react-icons/fc";
import React from "react";

export default function OAuth() {
  return (
    <button
      className="flex items-center justify-center w-full bg-red-600 text-white mb-6 px-7 py-3 text-sm font-medium rounded uppercase shadow-md hover:bg-red-700 transition duration-200 ease-in-out active:bg-red-800 hover:shadow-lg"
      type="submit"
    >
      <FcGoogle className="text-2xl bg-white rounded-full mr-2" />
      continue with google
    </button>
  );
}
