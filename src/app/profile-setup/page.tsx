"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { addTraveler } from "@/lib/firebase-utils";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function ProfileSetup() {
  const { user } = useUser();
  const router = useRouter();
  const [profileType, setProfileType] = useState<"requester" | "traveler" | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    // Requester fields
    name: user?.firstName || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    phone: "",
    // Traveler fields
    travelDate: "",
    departureCity: "",
    arrivalAirport: "",
    passportNumber: "",
    maxItems: "",
    serviceFee: ""
  });

  const handleProfileType = (type: "requester" | "traveler") => {
    setProfileType(type);
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRequesterSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "requesters"), {
        userId: user?.id,
        name: form.name,
        email: form.email,
        phone: form.phone,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      router.push("/request");
    } catch (error) {
      alert("Error saving profile");
    } finally {
      setLoading(false);
    }
  };

  const handleTravelerSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addTraveler({
        name: form.name,
        email: form.email,
        phone: form.phone,
        travelDate: form.travelDate,
        departureCity: form.departureCity,
        arrivalAirport: form.arrivalAirport,
        passportNumber: form.passportNumber,
        maxItems: parseInt(form.maxItems),
        serviceFee: parseInt(form.serviceFee),
        userId: user?.id || "",
        status: "active"
      });
      router.push("/traveler");
    } catch (error) {
      alert("Error saving profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            Complete Your Profile
          </h1>
          {!profileType && (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="border-2 border-orange-200 rounded-lg p-6 hover:border-orange-400 transition-colors">
                <h3 className="text-xl font-semibold mb-4">I want to request items</h3>
                <p className="text-gray-600 mb-4">
                  Set up your profile to request items from India. We'll need your contact information.
                </p>
                <button
                  onClick={() => handleProfileType("requester")}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700"
                >
                  Set up Requester Profile
                </button>
              </div>
              <div className="border-2 border-blue-200 rounded-lg p-6 hover:border-blue-400 transition-colors">
                <h3 className="text-xl font-semibold mb-4">I want to carry items</h3>
                <p className="text-gray-600 mb-4">
                  Set up your traveler profile to earn money carrying items from India to Netherlands.
                </p>
                <button
                  onClick={() => handleProfileType("traveler")}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                >
                  Set up Traveler Profile
                </button>
              </div>
            </div>
          )}
          {profileType === "requester" && (
            <form className="max-w-lg mx-auto mt-8" onSubmit={handleRequesterSubmit}>
              <h2 className="text-2xl font-bold mb-6">Requester Profile</h2>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Email</label>
                <input name="email" value={form.email} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700" disabled={loading}>
                {loading ? "Saving..." : "Save and Continue"}
              </button>
            </form>
          )}
          {profileType === "traveler" && (
            <form className="max-w-lg mx-auto mt-8" onSubmit={handleTravelerSubmit}>
              <h2 className="text-2xl font-bold mb-6">Traveler Profile</h2>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Email</label>
                <input name="email" value={form.email} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Travel Date</label>
                <input name="travelDate" value={form.travelDate} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" type="date" />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Departure City</label>
                <input name="departureCity" value={form.departureCity} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Arrival Airport</label>
                <input name="arrivalAirport" value={form.arrivalAirport} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Passport Number</label>
                <input name="passportNumber" value={form.passportNumber} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Max Items You Can Carry</label>
                <input name="maxItems" value={form.maxItems} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" type="number" />
              </div>
              <div className="mb-6">
                <label className="block mb-2 font-medium">Service Fee (€)</label>
                <input name="serviceFee" value={form.serviceFee} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" type="number" />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700" disabled={loading}>
                {loading ? "Saving..." : "Save and Continue"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}