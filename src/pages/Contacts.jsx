import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';
import { formatDistanceToNow } from 'date-fns';

const Contacts = ({ token }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${backendUrl}/api/contact/list`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setContacts(response.data.contacts);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchContacts();
    }
  }, [token]);

  const handleStatusChange = async (contactId, newStatus) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/contact/update-status`,
        { contactId, status: newStatus },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        // Update the contact status in the local state
        setContacts(prevContacts =>
          prevContacts.map(contact =>
            contact._id === contactId ? { ...contact, status: newStatus } : contact
          )
        );
        // If we're viewing the contact details, update that too
        if (selectedContact && selectedContact._id === contactId) {
          setSelectedContact({ ...selectedContact, status: newStatus });
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update contact status');
    }
  };

  const handleDelete = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/contact/delete`,
        { contactId },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        // Remove the contact from the local state
        setContacts(prevContacts => prevContacts.filter(contact => contact._id !== contactId));
        // If we're viewing the contact details, close the modal
        if (selectedContact && selectedContact._id === contactId) {
          setShowModal(false);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete contact');
    }
  };

  const viewContactDetails = (contact) => {
    setSelectedContact(contact);
    setShowModal(true);
    
    // If the contact is unread, mark it as read
    if (contact.status === 'Unread') {
      handleStatusChange(contact._id, 'Read');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Unread':
        return 'bg-red-100 text-red-800';
      case 'Read':
        return 'bg-blue-100 text-blue-800';
      case 'Responded':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Contact Messages</h2>
        <button
          onClick={fetchContacts}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading contacts...</div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-4 bg-gray-100 rounded">No contact messages found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-2 px-4 border text-left">Name</th>
                <th className="py-2 px-4 border text-left">Email</th>
                <th className="py-2 px-4 border text-left">Phone</th>
                <th className="py-2 px-4 border text-left">Status</th>
                <th className="py-2 px-4 border text-left">Date</th>
                <th className="py-2 px-4 border text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{contact.name}</td>
                  <td className="py-2 px-4 border">{contact.email}</td>
                  <td className="py-2 px-4 border">{contact.phone}</td>
                  <td className="py-2 px-4 border">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(contact.status)}`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border">{formatDate(contact.date)}</td>
                  <td className="py-2 px-4 border">
                    <button
                      onClick={() => viewContactDetails(contact)}
                      className="mr-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(contact._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Contact Details Modal */}
      {showModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Contact Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <div>
                  <p className="text-sm text-gray-500">From: <span className="font-medium text-gray-700">{selectedContact.name}</span></p>
                  <p className="text-sm text-gray-500">Email: <span className="font-medium text-gray-700">{selectedContact.email}</span></p>
                  <p className="text-sm text-gray-500">Phone: <span className="font-medium text-gray-700">{selectedContact.phone}</span></p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date: <span className="font-medium text-gray-700">{new Date(selectedContact.date).toLocaleString()}</span></p>
                  <div className="flex items-center mt-1">
                    <p className="text-sm text-gray-500 mr-2">Status:</p>
                    <select
                      value={selectedContact.status}
                      onChange={(e) => handleStatusChange(selectedContact._id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="Unread">Unread</option>
                      <option value="Read">Read</option>
                      <option value="Responded">Responded</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Message:</h4>
              <div className="bg-gray-50 p-4 rounded whitespace-pre-wrap">
                {selectedContact.message}
              </div>
            </div>
            
            <div className="flex justify-end mt-6 gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleStatusChange(selectedContact._id, 'Responded');
                  window.open(`mailto:${selectedContact.email}?subject=Re: Your message to YMGS&body=Dear ${selectedContact.name},%0D%0A%0D%0AThank you for contacting us.%0D%0A%0D%0A`);
                }}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Reply via Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts; 