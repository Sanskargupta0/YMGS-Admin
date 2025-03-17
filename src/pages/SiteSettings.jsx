import { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import PropTypes from "prop-types";

const SiteSettings = ({ token }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    contactEmail: "",
    contactPhone: "",
    contactAddress: "",
    businessHours: "",
    footerEmail: "",
    footerPhone: ""
  });

  const fetchSettings = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await axios.get(backendUrl + "/api/order/settings");
      
      if (response.data.success) {
        setSettings(response.data.settings);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      const response = await axios.post(
        backendUrl + "/api/order/settings/update",
        settings,
        { headers: { token } }
      );
      
      if (response.data.success) {
        toast.success("Settings updated successfully");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Site Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your website's contact information and other settings.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Page Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={settings.contactEmail}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  name="contactPhone"
                  value={settings.contactPhone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Address
              </label>
              <input
                type="text"
                name="contactAddress"
                value={settings.contactAddress}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Hours
              </label>
              <textarea
                name="businessHours"
                value={settings.businessHours}
                onChange={handleInputChange}
                rows="3"
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">
                Format: Mon - Sat: 8:00 AM - 8:00 PM (use line breaks for multiple lines)
              </p>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Footer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Footer Email
                </label>
                <input
                  type="email"
                  name="footerEmail"
                  value={settings.footerEmail}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Footer Phone
                </label>
                <input
                  type="text"
                  name="footerPhone"
                  value={settings.footerPhone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Settings"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

SiteSettings.propTypes = {
  token: PropTypes.string
};

export default SiteSettings; 