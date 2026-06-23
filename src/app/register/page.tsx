import Link from "next/link";
import { ShieldCheck, Mail, Lock, ArrowRight, User, Phone } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="bg-[#F4F7FA] min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-[#0A58CA] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-[#0B1B3D]">Create Profile</h2>
          <p className="mt-2 text-sm text-gray-600">
            One account for all your Sarkari Job needs
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#002D62] to-[#0A58CA] p-6 text-center">
            <h3 className="text-white font-bold tracking-wide">ONE-TIME REGISTRATION (OTR)</h3>
          </div>
          
          <div className="p-8">
            <form className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#0B1B3D] mb-2">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A58CA] focus:border-transparent transition-colors bg-gray-50 focus:bg-white"
                      placeholder="As per 10th certificate"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0B1B3D] mb-2">Mobile Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A58CA] focus:border-transparent transition-colors bg-gray-50 focus:bg-white"
                      placeholder="10-digit mobile number"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0B1B3D] mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A58CA] focus:border-transparent transition-colors bg-gray-50 focus:bg-white"
                    placeholder="Enter active email address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0B1B3D] mb-2">Create Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A58CA] focus:border-transparent transition-colors bg-gray-50 focus:bg-white"
                    placeholder="Minimum 8 characters"
                  />
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 text-[#0A58CA] focus:ring-[#0A58CA] border-gray-300 rounded cursor-pointer"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-medium text-gray-700 cursor-pointer">
                    I agree to the <Link href="#" className="text-[#0A58CA] hover:underline">Terms of Service</Link> and <Link href="#" className="text-[#0A58CA] hover:underline">Privacy Policy</Link>.
                  </label>
                </div>
              </div>

              <button
                type="button"
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#0A58CA] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A58CA] transition-all"
              >
                Complete Registration <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
          
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-[#0A58CA] hover:text-blue-800 transition-colors">
                Sign In Instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
