"use client";

import { useState } from "react";
import { SignInButton, SignUpButton, SignOutButton, useUser } from "@clerk/nextjs";
import { addRequest } from "@/lib/firebase-utils";

export default function RequestPage() {
  const { isSignedIn, user } = useUser();
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    budget: "",
    urgency: "normal",
    quantity: "1",
    preferredBrand: "",
    specialInstructions: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      alert("Please sign in to submit a request.");
      return;
    }
    try {
      const requestData = {
        itemName: formData.itemName,
        description: formData.description,
        budget: parseFloat(formData.budget),
        urgency: formData.urgency as 'low' | 'normal' | 'high' | 'urgent',
        quantity: parseInt(formData.quantity),
        preferredBrand: formData.preferredBrand || undefined,
        specialInstructions: formData.specialInstructions || undefined,
        requesterId: user?.id || '',
        requesterName: user?.firstName + ' ' + user?.lastName || user?.username || 'Anonymous',
        requesterLocation: 'Netherlands',
        status: 'pending' as const
      };
      const result = await addRequest(requestData);
      if (result.success) {
        alert("Your request has been submitted! We'll notify you when a traveler accepts.");
        setFormData({
          itemName: "",
          description: "",
          budget: "",
          urgency: "normal",
          quantity: "1",
          preferredBrand: "",
          specialInstructions: ""
        });
      } else {
        alert("Error submitting request. Please try again.");
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      alert("Error submitting request. Please try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Request an Item from India</h1>
          {!isSignedIn ? (
            <div className="text-center py-12">
              <p className="mb-6 text-lg text-gray-700">You must be signed in to request an item.</p>
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
              {/* Item Name */}
              <div>
                <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-2">
                  What would you like to request? *
                </label>
                <input
                  type="text"
                  id="itemName"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Ashwagandha, Pressure Cooker, Indian Spices..."
                />
              </div>
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Provide more details about the item, brand preferences, specifications..."
                />
              </div>
              {/* Budget and Quantity */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Budget (€) *
                  </label>
                  <input
                    type="number"
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="50"
                  />
                </div>
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <select
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="more">More than 5</option>
                  </select>
                </div>
              </div>
              {/* Preferred Brand */}
              <div>
                <label htmlFor="preferredBrand" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Brand (Optional)
                </label>
                <input
                  type="text"
                  id="preferredBrand"
                  name="preferredBrand"
                  value={formData.preferredBrand}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Patanjali, Prestige, Tata..."
                />
              </div>
              {/* Urgency */}
              <div>
                <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-2">
                  How urgent is this request?
                </label>
                <select
                  id="urgency"
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="low">Low - I can wait a few weeks</option>
                  <option value="normal">Normal - Within 2-3 weeks</option>
                  <option value="high">High - Within 1 week</option>
                  <option value="urgent">Urgent - As soon as possible</option>
                </select>
              </div>
              {/* Special Instructions */}
              <div>
                <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions (Optional)
                </label>
                <textarea
                  id="specialInstructions"
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Any special requirements, packaging preferences, or additional notes..."
                />
              </div>
              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full bg-orange-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-orange-700 transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </form>
          )}
          {/* Information Box */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">How it works after submission:</h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>Your request will be visible to travelers flying from India to Netherlands</li>
              <li>Travelers can accept your request and purchase the items</li>
              <li>You'll be notified when someone accepts your request</li>
              <li>Meet at Schiphol Airport to collect your items</li>
              <li>Pay the traveler directly for the items + their service fee</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 