"use client";

import Image from "next/image";
import { SignInButton, SignUpButton, SignOutButton, useUser } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-orange-600">GiftsFromIndia</h1>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#how-it-works" className="text-gray-700 hover:text-orange-600">How it works</a>
              <a href="/request" className="text-gray-700 hover:text-orange-600">Request Items</a>
              <a href="/traveler" className="text-gray-700 hover:text-orange-600">Browse Requests</a>
            </div>
            <div className="flex space-x-4">
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

      {/* Hero Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Get Authentic Indian Products
              <span className="text-orange-600"> Delivered to Netherlands</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect with travelers flying from India to Netherlands. Request items like ashwagandha, 
              medicines, pressure cookers, and more. Save money while helping travelers earn.
            </p>
            <div className="flex justify-center space-x-4">
              <a href="/request" className="bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-700 transition-colors">
                Request an Item
              </a>
              <a href="/traveler" className="bg-white text-orange-600 border-2 border-orange-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-50 transition-colors">
                Browse Requests
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div id="how-it-works" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How it Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Request Items</h3>
              <p className="text-gray-600">
                Submit your request for items you need from India. Specify your budget and requirements.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Travelers Accept</h3>
              <p className="text-gray-600">
                Travelers flying from India can see your request and accept it for a service fee.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Meet & Collect</h3>
              <p className="text-gray-600">
                Meet at Schiphol Airport to collect your items and pay the traveler directly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Items */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Popular Items</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center border border-gray-200">
              <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-600">🌿</span>
              </div>
              <h3 className="font-semibold mb-2">Ashwagandha</h3>
              <p className="text-gray-600 text-sm">Natural supplements and Ayurvedic medicines</p>
              <p className="text-xs text-gray-500 mt-2">Popular brands: Patanjali, Himalaya</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center border border-gray-200">
              <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-600">🍳</span>
              </div>
              <h3 className="font-semibold mb-2">Pressure Cookers</h3>
              <p className="text-gray-600 text-sm">Prestige, Hawkins, and other quality brands</p>
              <p className="text-xs text-gray-500 mt-2">3L, 5L, 7L sizes available</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center border border-gray-200">
              <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-600">🌶️</span>
              </div>
              <h3 className="font-semibold mb-2">Spices & Masalas</h3>
              <p className="text-gray-600 text-sm">Authentic Indian spices and spice mixes</p>
              <p className="text-xs text-gray-500 mt-2">Garam masala, turmeric, cardamom</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center border border-gray-200">
              <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-600">👕</span>
              </div>
              <h3 className="font-semibold mb-2">Traditional Wear</h3>
              <p className="text-gray-600 text-sm">Sarees, kurtas, and traditional Indian clothing</p>
              <p className="text-xs text-gray-500 mt-2">Silk, cotton, designer wear</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center border border-gray-200">
              <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-600">💊</span>
              </div>
              <h3 className="font-semibold mb-2">Medicines</h3>
              <p className="text-gray-600 text-sm">Prescription and over-the-counter medicines</p>
              <p className="text-xs text-gray-500 mt-2">Ayurvedic and allopathic</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center border border-gray-200">
              <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-600">🍯</span>
              </div>
              <h3 className="font-semibold mb-2">Honey & Ghee</h3>
              <p className="text-gray-600 text-sm">Pure honey, clarified butter, and dairy products</p>
              <p className="text-xs text-gray-500 mt-2">Organic and natural varieties</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center border border-gray-200">
              <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-600">📱</span>
              </div>
              <h3 className="font-semibold mb-2">Electronics</h3>
              <p className="text-gray-600 text-sm">Mobile phones, accessories, and gadgets</p>
              <p className="text-xs text-gray-500 mt-2">Unlocked phones and chargers</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center border border-gray-200">
              <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-600">🎁</span>
              </div>
              <h3 className="font-semibold mb-2">Gifts & Souvenirs</h3>
              <p className="text-gray-600 text-sm">Handcrafted items, jewelry, and decorative pieces</p>
              <p className="text-xs text-gray-500 mt-2">Handmade and traditional crafts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose GiftsFromIndia?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold mb-4 text-orange-600">For Requesters</h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Save 30-50% compared to import costs</li>
                <li>• Get authentic Indian products</li>
                <li>• No customs or shipping hassles</li>
                <li>• Direct communication with travelers</li>
                <li>• Secure payment only after delivery</li>
                <li>• Real-time tracking of your requests</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">For Travelers</h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Earn €10-50 per item carried</li>
                <li>• Flexible service fees you set</li>
                <li>• Help people get what they need</li>
                <li>• Safe and secure transactions</li>
                <li>• Choose requests that fit your schedule</li>
                <li>• Build trust and reputation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-orange-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-orange-100">Successful Deliveries</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">200+</div>
              <div className="text-orange-100">Active Travelers</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">1000+</div>
              <div className="text-orange-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">€15K+</div>
              <div className="text-orange-100">Total Savings</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">GiftsFromIndia</h3>
              <p className="text-gray-400">
                Connecting India and Netherlands through trusted travelers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/request" className="hover:text-white">Request Items</a></li>
                <li><a href="/traveler" className="hover:text-white">Browse Requests</a></li>
                <li><a href="#how-it-works" className="hover:text-white">How it Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Facebook</a></li>
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 GiftsFromIndia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
