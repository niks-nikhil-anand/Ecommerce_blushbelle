"use client"
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  Shield, 
  Eye, 
  EyeOff,
  UserCheck,
  UserX,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  X,
  Mail,
  Phone,
  Lock,
  User,
  ChevronDown
} from 'lucide-react'

const StaffAdminPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    role: 'User'
  })

  // Mock staff data
  const [staffMembers, setStaffMembers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@company.com',
      mobile: '+1 (555) 123-4567',
      role: 'Admin',
      status: 'Active',
      joinDate: '2024-01-15',
      lastActive: '2 hours ago'
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@company.com',
      mobile: '+1 (555) 234-5678',
      role: 'Editor',
      status: 'Active',
      joinDate: '2024-02-20',
      lastActive: '1 day ago'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      mobile: '+1 (555) 345-6789',
      role: 'Moderator',
      status: 'Pending',
      joinDate: '2024-03-10',
      lastActive: '3 days ago'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@company.com',
      mobile: '+1 (555) 456-7890',
      role: 'Viewer',
      status: 'Blocked',
      joinDate: '2024-01-05',
      lastActive: '1 week ago'
    },
    {
      id: 5,
      name: 'Alex Chen',
      email: 'alex.chen@company.com',
      mobile: '+1 (555) 567-8901',
      role: 'SuperAdmin',
      status: 'Active',
      joinDate: '2023-12-01',
      lastActive: 'Online'
    }
  ])

  const roles = ['User', 'Admin', 'SuperAdmin', 'Moderator', 'Editor', 'Viewer']
  const statuses = ['Blocked', 'Pending', 'inReview', 'Active']

  const getRoleColor = (role) => {
    const colors = {
      'SuperAdmin': 'bg-red-100 text-red-800 border-red-200',
      'Admin': 'bg-purple-100 text-purple-800 border-purple-200',
      'Moderator': 'bg-blue-100 text-blue-800 border-blue-200',
      'Editor': 'bg-green-100 text-green-800 border-green-200',
      'Viewer': 'bg-gray-100 text-gray-800 border-gray-200',
      'User': 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
    return colors[role] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getStatusColor = (status) => {
    const colors = {
      'Active': 'bg-green-100 text-green-800 border-green-200',
      'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'inReview': 'bg-blue-100 text-blue-800 border-blue-200',
      'Blocked': 'bg-red-100 text-red-800 border-red-200'
    }
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getStatusIcon = (status) => {
    const icons = {
      'Active': <CheckCircle className="w-4 h-4" />,
      'Pending': <Clock className="w-4 h-4" />,
      'inReview': <AlertCircle className="w-4 h-4" />,
      'Blocked': <XCircle className="w-4 h-4" />
    }
    return icons[status] || <AlertCircle className="w-4 h-4" />
  }

  const filteredStaff = staffMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === 'All' || member.role === selectedRole
    const matchesStatus = selectedStatus === 'All' || member.status === selectedStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const updateMemberRole = (id, newRole) => {
    setStaffMembers(prev => prev.map(member => 
      member.id === id ? { ...member, role: newRole } : member
    ))
  }

  const updateMemberStatus = (id, newStatus) => {
    setStaffMembers(prev => prev.map(member => 
      member.id === id ? { ...member, status: newStatus } : member
    ))
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    const newMember = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      role: formData.role,
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      lastActive: 'Just now'
    }
    setStaffMembers(prev => [...prev, newMember])
    setFormData({ name: '', email: '', mobile: '', password: '', role: 'User' })
    setShowAddModal(false)
  }

  const CustomSelect = ({ value, onChange, options, placeholder, className }) => {
    const [isOpen, setIsOpen] = useState(false)
    
    // Close dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event) => {
        if (isOpen && !event.target.closest('.dropdown-container')) {
          setIsOpen(false)
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen])
    
    return (
      <div className={`relative dropdown-container ${className}`}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors flex items-center justify-between"
        >
          <span className={value ? 'text-gray-900' : 'text-gray-500'}>
            {value || placeholder}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
            >
              {options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option)
                    setIsOpen(false)
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors first:rounded-t-lg last:rounded-b-lg"
                >
                  {option}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="h-screen overflow-y-auto p-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
                <p className="text-gray-600">Manage user roles and permissions</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Staff</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border p-6 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search staff members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
              <CustomSelect
                value={selectedRole === 'All' ? '' : selectedRole}
                onChange={setSelectedRole}
                options={['All', ...roles]}
                placeholder="All Roles"
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
              <CustomSelect
                value={selectedStatus === 'All' ? '' : selectedStatus}
                onChange={setSelectedStatus}
                options={['All', ...statuses]}
                placeholder="All Statuses"
                className="pl-10"
              />
            </div>
          </div>
        </motion.div>

        {/* Staff Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredStaff.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Basic Info */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{member.name}</h3>
                      <div className="relative">
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {member.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {member.mobile}
                      </div>
                    </div>
                  </div>

                  {/* Role and Status */}
                  <div className="space-y-3 mb-4">
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">Role</label>
                      <CustomSelect
                        value={member.role}
                        onChange={(newRole) => updateMemberRole(member.id, newRole)}
                        options={roles}
                        placeholder="Select Role"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">Status</label>
                      <CustomSelect
                        value={member.status}
                        onChange={(newStatus) => updateMemberStatus(member.id, newStatus)}
                        options={statuses}
                        placeholder="Select Status"
                      />
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-2 text-xs text-gray-500 mb-4">
                    <div className="flex justify-between">
                      <span>Joined:</span>
                      <span>{member.joinDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Active:</span>
                      <span>{member.lastActive}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-md hover:bg-blue-100 transition-colors flex items-center justify-center space-x-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span className="text-xs">Edit</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded-md hover:bg-red-100 transition-colors flex items-center justify-center space-x-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span className="text-xs">Remove</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredStaff.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No staff members found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </motion.div>
        )}

        {/* Add Staff Modal */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-lg shadow-xl w-full max-w-md"
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Add New Staff Member</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter full name"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>

                  {/* Mobile Number Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="tel"
                        required
                        value={formData.mobile}
                        onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter mobile number"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Role Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <CustomSelect
                      value={formData.role}
                      onChange={(role) => setFormData({...formData, role})}
                      options={roles}
                      placeholder="Select Role"
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Add Staff Member
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default StaffAdminPage