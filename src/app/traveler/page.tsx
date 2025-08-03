"use client";

import { useState, useEffect } from "react";
import { SignInButton, SignUpButton, SignOutButton, useUser } from "@clerk/nextjs";
import { addTraveler, getAvailableRequests, updateRequestStatus } from "@/lib/firebase-utils";
import type { RequestItem } from "@/lib/firebase-utils";

export default function TravelerPage() {
  const { isSignedIn, user } = useUser();
  const [activeTab, setActiveTab] = useState("requests"); // Changed default to "requests"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    travelDate: "",
    departureCity: "",
    arrivalAirport: "Schiphol",
    passportNumber: "",
    maxItems: "5",
    serviceFee: "15"
  });

  const [availableRequests, setAvailableRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Load available requests automatically when component mounts
  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true);
      try {
        const result = await getAvailableRequests();
        if (result.success && result.data) {
          setAvailableRequests(result.data);
        }
      } catch (error) {
        console.error('Error loading requests:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // Load requests immediately when component mounts
    loadRequests();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      alert("Please sign in to register as a traveler.");
      return;
    }
    try {
      const travelerData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        travelDate: formData.travelDate,
        departureCity: formData.departureCity,
        arrivalAirport: formData.arrivalAirport,
        passportNumber: formData.passportNumber,
        maxItems: parseInt(formData.maxItems),
        serviceFee: parseInt(formData.serviceFee),
        userId: user?.id || '',
        status: 'active' as const
      };
      const result = await addTraveler(travelerData);
      if (result.success) {
        alert("Registration successful! You can now browse available requests.");
        setActiveTab("requests");
        // Refresh the requests list after registration
        const updatedResult = await getAvailableRequests();
        if (updatedResult.success && updatedResult.data) {
          setAvailableRequests(updatedResult.data);
        }
      } else {
        alert("Error registering as traveler. Please try again.");
      }
    } catch (error) {
      console.error('Error registering traveler:', error);
      alert("Error registering as traveler. Please try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const acceptRequest = async (requestId: string) => {
    if (!isSignedIn) {
      alert("Please sign in to accept requests.");
      return;
    }
    try {
      const result = await updateRequestStatus(
        requestId, 
        'accepted', 
        user?.id || '', 
        user?.firstName + ' ' + user?.lastName || user?.username || 'Anonymous'
      );
      if (result.success) {
        alert("Request accepted! We'll connect you with the requester.");
        // Refresh the requests list
        const updatedResult = await getAvailableRequests();
        if (updatedResult.success && updatedResult.data) {
          setAvailableRequests(updatedResult.data);
        }
      } else {
        alert("Error accepting request. Please try again.");
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      alert("Error accepting request. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold text-orange-600">GiftsFromIndia</a>
            </div>
            <div className="flex space-x-4">
              <a href="/" className="text-gray-700 hover:text-orange-600">Home</a>
              <a href="/request" className="text-gray-700 hover:text-orange-600">Request Items</a>
              <a href="/traveler" className="text-gray-700 hover:text-orange-600">Browse Requests</a>
              {isSignedIn ? (
                <>
                  <a href="/dashboard" className="text-gray-700 hover:text-orange-600">Dashboard</a>
                  <SignOutButton>
                    <button className="text-gray-700 hover:text-orange-600">Sign Out</button>
                  </SignOutButton>
                </>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <button className="text-gray-700 hover:text-orange-600">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
                      Sign Up
                    </button>
                  </SignUpButton>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 mb-8">
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              activeTab === "requests"
                ? "bg-orange-600 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Available Requests
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              activeTab === "register"
                ? "bg-orange-600 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Register as Traveler
          </button>
        </div>

        {/* Available Requests Tab - Now Default */}
        {activeTab === "requests" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Requests</h2>
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading available requests...</p>
                </div>
              </div>
            ) : availableRequests.length === 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <p className="text-gray-600 mb-4">No requests available at the moment.</p>
                <p className="text-sm text-gray-500">Check back later or register as a traveler to get notified of new requests.</p>
              </div>
            ) : (
              availableRequests.map((request) => (
                <div key={request.id} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{request.itemName}</h3>
                      <p className="text-gray-600 mt-1">{request.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                        €{request.budget}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-4 gap-4 mb-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Quantity:</span> {request.quantity}
                    </div>
                    <div>
                      <span className="font-medium">Urgency:</span> {request.urgency}
                    </div>
                    <div>
                      <span className="font-medium">Requester:</span> {request.requesterName}
                    </div>
                    <div>
                      <span className="font-medium">Location:</span> {request.requesterLocation}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Request ID: #{request.id}
                    </div>
                    <button
                      onClick={() => acceptRequest(request.id || '')}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Accept Request
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Registration Form */}
        {activeTab === "register" && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Become a Traveler</h1>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-orange-900 mb-3">💰 Earn Money While Traveling!</h3>
              <ul className="space-y-2 text-orange-800">
                <li>• Earn €10-50 per item carried</li>
                <li>• Flexible service fees you set</li>
                <li>• Safe and secure transactions</li>
                <li>• Help people get authentic Indian products</li>
              </ul>
            </div>
            {!isSignedIn ? (
              <div className="text-center py-12">
                <p className="mb-6 text-lg text-gray-700">You must be signed in to become a traveler.</p>
                <div className="flex justify-center gap-4">
                  <SignInButton mode="modal">
                    <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700">Sign In</button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="bg-white text-orange-600 border-2 border-orange-600 px-6 py-3 rounded-lg hover:bg-orange-50">Sign Up</button>
                  </SignUpButton>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="passportNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      Passport Number *
                    </label>
                    <input
                      type="text"
                      id="passportNumber"
                      name="passportNumber"
                      value={formData.passportNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="travelDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Travel Date *
                    </label>
                    <input
                      type="date"
                      id="travelDate"
                      name="travelDate"
                      value={formData.travelDate}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="departureCity" className="block text-sm font-medium text-gray-700 mb-2">
                      Departure City (India) *
                    </label>
                    <input
                      type="text"
                      id="departureCity"
                      name="departureCity"
                      value={formData.departureCity}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="e.g., Mumbai, Delhi, Bangalore..."
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="maxItems" className="block text-sm font-medium text-gray-700 mb-2">
                      Max Items to Carry
                    </label>
                    <select
                      id="maxItems"
                      name="maxItems"
                      value={formData.maxItems}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="1">1 item</option>
                      <option value="3">3 items</option>
                      <option value="5">5 items</option>
                      <option value="10">10 items</option>
                      <option value="unlimited">Unlimited</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="serviceFee" className="block text-sm font-medium text-gray-700 mb-2">
                      Service Fee (€)
                    </label>
                    <select
                      id="serviceFee"
                      name="serviceFee"
                      value={formData.serviceFee}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="10">€10</option>
                      <option value="15">€15</option>
                      <option value="20">€20</option>
                      <option value="25">€25</option>
                      <option value="30">€30</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="arrivalAirport" className="block text-sm font-medium text-gray-700 mb-2">
                      Arrival Airport
                    </label>
                    <select
                      id="arrivalAirport"
                      name="arrivalAirport"
                      value={formData.arrivalAirport}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="Schiphol">Schiphol (Amsterdam)</option>
                      <option value="Eindhoven">Eindhoven</option>
                      <option value="Rotterdam">Rotterdam</option>
                    </select>
                  </div>
                </div>
                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full bg-orange-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-orange-700 transition-colors"
                  >
                    Register as Traveler
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 