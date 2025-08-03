"use client";

import { useState, useEffect } from "react";
import { UserButton, useUser, SignOutButton } from "@clerk/nextjs";
import { getUserRequests, getTravelerRequests, getTravelerByUserId, addRequest } from "@/lib/firebase-utils";
import type { RequestItem, Traveler } from "@/lib/firebase-utils";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function DashboardPage() {
  const { user, isSignedIn } = useUser();
  const [activeTab, setActiveTab] = useState("requests");
  const [myRequests, setMyRequests] = useState<RequestItem[]>([]);
  const [acceptedRequests, setAcceptedRequests] = useState<RequestItem[]>([]);
  const [traveler, setTraveler] = useState<Traveler | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>("Testing connection...");

  // Test function to create sample data
  const createSampleRequest = async () => {
    if (!user?.id) return;
    
    try {
      const sampleRequest = {
        itemName: "Traditional Indian Spices",
        description: "Looking for authentic Indian spices like garam masala, turmeric, and cardamom",
        budget: 25,
        urgency: 'normal' as const,
        quantity: 2,
        preferredBrand: "MDH or Everest",
        specialInstructions: "Please ensure they are sealed and within expiry date",
        requesterId: user.id,
        requesterName: user.firstName + ' ' + user.lastName || user.username || 'User',
        requesterLocation: "Amsterdam, Netherlands",
        status: 'pending' as const
      };

      const result = await addRequest(sampleRequest);
      if (result.success) {
        alert('Sample request created successfully! Refresh the page to see it.');
        window.location.reload();
      } else {
        alert('Failed to create sample request: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating sample request:', error);
      alert('Error creating sample request');
    }
  };

  // Test Firebase connection
  useEffect(() => {
    const testConnection = async () => {
      try {
        // Try to access a collection to test connection
        const testQuery = await getDocs(collection(db, 'requests'));
        setConnectionStatus("Connected to Firebase successfully");
      } catch (error) {
        console.error('Firebase connection test failed:', error);
        setConnectionStatus(`Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    testConnection();
  }, []);

  // Load user data - optimized with better error handling and timeouts
  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Load user requests first (most important)
        const requestsResult = await getUserRequests(user.id);
        if (requestsResult.success && requestsResult.data) {
          setMyRequests(requestsResult.data);
        } else if (!requestsResult.success) {
          console.error('Failed to load user requests:', requestsResult.error);
          // Don't fail completely, just log the error
        }

        // Then check if user is a traveler (less critical)
        try {
          const travelerResult = await getTravelerByUserId(user.id);
          if (travelerResult.success && travelerResult.data) {
            setTraveler(travelerResult.data);
            
            // Load traveler's accepted requests (only if we have traveler data)
            try {
              const travelerRequestsResult = await getTravelerRequests(travelerResult.data.id!);
              if (travelerRequestsResult.success && travelerRequestsResult.data) {
                setAcceptedRequests(travelerRequestsResult.data);
              } else if (!travelerRequestsResult.success) {
                console.error('Failed to load traveler requests:', travelerRequestsResult.error);
              }
            } catch (travelerError) {
              console.error('Error loading traveler requests:', travelerError);
              // Don't fail the whole load for this
            }
          }
        } catch (travelerError) {
          console.error('Error loading traveler data:', travelerError);
          // Don't fail the whole load for this
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setError('Unable to connect to the database. Please check your internet connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user?.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "accepted": return "bg-blue-100 text-blue-800";
      case "in-progress": return "bg-orange-100 text-orange-800";
      case "completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Waiting for traveler";
      case "accepted": return "Accepted by traveler";
      case "in-progress": return "Item purchased";
      case "completed": return "Delivered";
      default: return status;
    }
  };

  // Calculate dashboard stats
  const totalRequests = myRequests.length;
  const activeRequests = myRequests.filter(r => r.status === 'pending' || r.status === 'accepted').length;
  const completedRequests = myRequests.filter(r => r.status === 'completed').length;
  const totalSpent = myRequests.reduce((sum, r) => sum + r.budget + (r.serviceFee || 0), 0);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <a href="/" className="text-2xl font-bold text-orange-600">GiftsFromIndia</a>
              </div>
              <div className="flex space-x-4">
                <a href="/" className="text-gray-700 hover:text-orange-600">Home</a>
                <a href="/request" className="text-gray-700 hover:text-orange-600">Request Items</a>
                <a href="/traveler" className="text-gray-700 hover:text-orange-600">Become a Traveler</a>
                <SignOutButton>
                  <button className="text-gray-700 hover:text-orange-600">Sign Out</button>
                </SignOutButton>
              </div>
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              <a href="/traveler" className="text-gray-700 hover:text-orange-600">Become a Traveler</a>
              <SignOutButton>
                <button className="text-gray-700 hover:text-orange-600">Sign Out</button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your dashboard...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
            </div>
          </div>
        ) : (
          <>
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome back, {user?.firstName || user?.username || 'User'}!</h1>
              
              {/* Connection Status */}
              <div className={`mb-4 p-3 rounded-lg text-sm ${
                connectionStatus.includes('successfully') 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
              }`}>
                <span className="font-medium">Database Status:</span> {connectionStatus}
              </div>
              
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-orange-600">{totalRequests}</div>
                  <div className="text-sm text-gray-600">Total Requests</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">{activeRequests}</div>
                  <div className="text-sm text-gray-600">Active Requests</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">{completedRequests}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-600">€{totalSpent}</div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                </div>
              </div>
            </div>

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
                My Requests
              </button>
              <button
                onClick={() => setActiveTab("traveling")}
                className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                  activeTab === "traveling"
                    ? "bg-orange-600 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Traveling Requests
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                  activeTab === "profile"
                    ? "bg-orange-600 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Profile
              </button>
            </div>

            {/* My Requests Tab */}
            {activeTab === "requests" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Requests</h2>
                {myRequests.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <p className="text-gray-600 mb-4">You haven't made any requests yet.</p>
                    <div className="space-x-4">
                      <a href="/request" className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors">
                        Make Your First Request
                      </a>
                      <button 
                        onClick={createSampleRequest}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Create Sample Request (Test)
                      </button>
                    </div>
                  </div>
                ) : (
                  myRequests.map((request) => (
                    <div key={request.id} className="bg-white rounded-lg shadow-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{request.itemName}</h3>
                          <p className="text-gray-600 mt-1">Request ID: #{request.id}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                            {getStatusText(request.status)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <span className="font-medium text-gray-700">Budget:</span> €{request.budget}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Service Fee:</span> €{request.serviceFee || 0}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Total Cost:</span> €{(request.budget + (request.serviceFee || 0))}
                        </div>
                      </div>

                      {request.travelerName && (
                        <div className="bg-blue-50 rounded-lg p-4 mb-4">
                          <h4 className="font-semibold text-blue-900 mb-2">Traveler Information</h4>
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Traveler:</span> {request.travelerName}
                            </div>
                            <div>
                              <span className="font-medium">Travel Date:</span> {request.travelDate}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          Created: {new Date().toLocaleDateString()}
                        </div>
                        {request.status === "accepted" && (
                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                            Contact Traveler
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Traveling Requests Tab */}
            {activeTab === "traveling" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Requests I'm Carrying</h2>
                {acceptedRequests.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <p className="text-gray-600 mb-4">You haven't accepted any requests yet.</p>
                    <a href="/traveler" className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors">
                      Browse Available Requests
                    </a>
                  </div>
                ) : (
                  acceptedRequests.map((request) => (
                    <div key={request.id} className="bg-white rounded-lg shadow-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{request.itemName}</h3>
                          <p className="text-gray-600 mt-1">Request ID: #{request.id}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                            {getStatusText(request.status)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <span className="font-medium text-gray-700">Requester:</span> {request.requesterName}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Location:</span> {request.requesterLocation}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Travel Date:</span> {request.travelDate}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <span className="font-medium text-gray-700">Budget:</span> €{request.budget}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Service Fee:</span> €{request.serviceFee || 0}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Total Earnings:</span> €{request.budget + (request.serviceFee || 0)}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          Accepted: {new Date().toLocaleDateString()}
                        </div>
                        <div className="space-x-2">
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Contact Requester
                          </button>
                          {request.status === "in-progress" && (
                            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                              Mark as Delivered
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Profile Settings</h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          defaultValue={user?.firstName + ' ' + user?.lastName || user?.username || ''}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          defaultValue={user?.primaryEmailAddress?.emailAddress || ''}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          defaultValue="+31 6 12345678"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Pickup Location</label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                          <option>Schiphol Airport</option>
                          <option>Eindhoven Airport</option>
                          <option>Rotterdam Airport</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notification Settings</label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" defaultChecked className="mr-2" />
                            Email notifications
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" defaultChecked className="mr-2" />
                            SMS notifications
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            Push notifications
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t">
                  <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 