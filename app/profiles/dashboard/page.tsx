'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import QrCodeIcon from '@mui/icons-material/QrCode';
import ShareIcon from '@mui/icons-material/Share';
import BarChartIcon from '@mui/icons-material/BarChart';
import GroupsIcon from '@mui/icons-material/Groups';
import MouseIcon from '@mui/icons-material/Mouse';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

// Icon aliases
const Plus = AddIcon;
const Eye = VisibilityIcon;
const Edit = EditIcon;
const Trash2 = DeleteIcon;
const MoreVertical = MoreVertIcon;
const QrCode = QrCodeIcon;
const Share2 = ShareIcon;
const BarChart = BarChartIcon;
const Users = GroupsIcon;
const MousePointer = MouseIcon;
const TrendingUp = TrendingUpIcon;
const Copy = ContentCopyIcon;
const ExternalLink = OpenInNewIcon;

interface Profile {
  id: string;
  name: string;
  title: string;
  company: string;
  image?: string;
  status: 'active' | 'draft' | 'inactive';
  views: number;
  clicks: number;
  shares: number;
  lastUpdated: string;
  qrCode?: string;
  publicUrl: string;
}

export default function ProfileDashboard() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load profiles from localStorage or API
    const loadProfiles = () => {
      const savedProfiles = localStorage.getItem('userProfiles');
      if (savedProfiles) {
        setProfiles(JSON.parse(savedProfiles));
      } else {
        // Mock data for demonstration
        setProfiles([
          {
            id: '1',
            name: 'John Doe',
            title: 'CEO & Founder',
            company: 'Tech Innovations',
            image: '/api/placeholder/100/100',
            status: 'active',
            views: 1245,
            clicks: 342,
            shares: 89,
            lastUpdated: '2 hours ago',
            publicUrl: 'linkist.ai/johndoe'
          },
          {
            id: '2',
            name: 'Jane Smith',
            title: 'Marketing Director',
            company: 'Creative Agency',
            status: 'draft',
            views: 567,
            clicks: 123,
            shares: 34,
            lastUpdated: '1 day ago',
            publicUrl: 'linkist.ai/janesmith'
          }
        ]);
      }
      setLoading(false);
    };

    loadProfiles();
  }, []);

  const handleDeleteProfile = (id: string) => {
    if (confirm('Are you sure you want to delete this profile?')) {
      setProfiles(profiles.filter(p => p.id !== id));
      localStorage.setItem('userProfiles', JSON.stringify(profiles.filter(p => p.id !== id)));
    }
  };

  const handleDuplicateProfile = (profile: Profile) => {
    const newProfile = {
      ...profile,
      id: Date.now().toString(),
      name: `${profile.name} (Copy)`,
      status: 'draft' as const,
      views: 0,
      clicks: 0,
      shares: 0,
      lastUpdated: 'Just now'
    };
    const updatedProfiles = [...profiles, newProfile];
    setProfiles(updatedProfiles);
    localStorage.setItem('userProfiles', JSON.stringify(updatedProfiles));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage and track your digital profiles</p>
            </div>
            <Link
              href="/profiles/templates"
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create New Profile
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {profiles.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-3 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+12%</span>
              <span className="text-gray-500 ml-1">from last week</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {profiles.reduce((sum, p) => sum + p.clicks, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <MousePointer className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-3 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+8%</span>
              <span className="text-gray-500 ml-1">from last week</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Shares</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {profiles.reduce((sum, p) => sum + p.shares, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Share2 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-3 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+15%</span>
              <span className="text-gray-500 ml-1">from last week</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Profiles</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {profiles.filter(p => p.status === 'active').length}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="flex items-center mt-3 text-sm">
              <span className="text-gray-500">of {profiles.length} total profiles</span>
            </div>
          </div>
        </div>

        {/* Profiles Grid */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Your Profiles</h2>
          </div>

          {profiles.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No profiles yet</h3>
              <p className="text-gray-500 mb-6">Create your first digital profile to get started</p>
              <Link
                href="/profiles/create"
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Profile
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow relative"
                >
                  {/* Dropdown Menu */}
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => setShowDropdown(showDropdown === profile.id ? null : profile.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <MoreVertical className="h-5 w-5 text-gray-500" />
                    </button>
                    {showDropdown === profile.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        <Link
                          href={`/profiles/builder?id=${profile.id}`}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Link>
                        <Link
                          href={`/profiles/${profile.id}/analytics`}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <BarChart className="h-4 w-4 mr-2" />
                          View Analytics
                        </Link>
                        <button
                          onClick={() => handleDuplicateProfile(profile)}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </button>
                        <Link
                          href={`/p/${profile.id}`}
                          target="_blank"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Public Profile
                        </Link>
                        <button
                          onClick={() => handleDeleteProfile(profile.id)}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left border-t"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Profile Info */}
                  <div className="flex items-start space-x-4 mb-4">
                    {profile.image ? (
                      <img
                        src={profile.image}
                        alt={profile.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-xl">
                        {profile.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{profile.name}</h3>
                      <p className="text-sm text-gray-600">{profile.title}</p>
                      <p className="text-sm text-gray-500">{profile.company}</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(profile.status)}`}>
                      {profile.status}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">Updated {profile.lastUpdated}</span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-y border-gray-100">
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-gray-900">{profile.views}</p>
                      <p className="text-xs text-gray-500">Views</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-gray-900">{profile.clicks}</p>
                      <p className="text-xs text-gray-500">Clicks</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-gray-900">{profile.shares}</p>
                      <p className="text-xs text-gray-500">Shares</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Link
                      href={`/profiles/builder?id=${profile.id}`}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition text-center"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/p/${profile.id}`}
                      target="_blank"
                      className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-700 transition text-center"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => router.push(`/profiles/${profile.id}/qr`)}
                      className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 transition"
                    >
                      <QrCode className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Public URL */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Public URL</p>
                    <p className="text-sm text-gray-700 font-mono truncate">{profile.publicUrl}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}