import { useState } from 'react'
import {
  Megaphone,
  Users,
  Send,
  Clock,
  CheckCircle,
  Plus,
  Search,
  MoreVertical,
  ExternalLink
} from 'lucide-react'

interface BroadcastingPageProps {
  themeColor: string
}

// Dummy campaign data
const campaigns = [
  {
    id: 1,
    name: 'Holiday Season Promotion',
    status: 'active',
    recipients: 2500,
    sent: 2450,
    delivered: 2380,
    read: 1890,
    scheduledAt: '2026-01-20 10:00 AM',
  },
  {
    id: 2,
    name: 'New Product Launch',
    status: 'scheduled',
    recipients: 5000,
    sent: 0,
    delivered: 0,
    read: 0,
    scheduledAt: '2026-01-25 09:00 AM',
  },
  {
    id: 3,
    name: 'Customer Feedback Survey',
    status: 'completed',
    recipients: 1200,
    sent: 1200,
    delivered: 1180,
    read: 890,
    scheduledAt: '2026-01-15 02:00 PM',
  },
  {
    id: 4,
    name: 'Weekly Newsletter',
    status: 'draft',
    recipients: 3500,
    sent: 0,
    delivered: 0,
    read: 0,
    scheduledAt: null,
  },
]

// Real WhatsApp-style templates with actual sample data (no placeholder codes)
const templates = [
  {
    id: 1,
    name: 'Marketing - Product Promotion',
    category: 'Marketing',
    headerImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop',
    message: "Hey Sarah! 👋\n\nNow shop for your favourite products on WhatsApp!\nGet ₹100 off on your first order! Just click on the catalogue below and add your faves to the cart! 🛒\nHappy shopping! ❤️",
    buttons: ['View Catalogue', 'Go to App', 'Not interested'],
    time: '6:25 a.m.'
  },
  {
    id: 2,
    name: 'Utility - Order Confirmation',
    category: 'Utility',
    headerImage: null,
    message: "Hi Rahul,\n\nYour order #ORD-78542 has been confirmed! ✅\n\n📦 Items: Nike Air Max, Blue (Size 10)\n💰 Total: ₹8,499\n🚚 Delivery by: Jan 25, 2026\n\nTrack your order anytime using the button below.",
    buttons: ['Track Order', 'Need Help?'],
    time: '10:30 a.m.'
  },
  {
    id: 3,
    name: 'Service - Appointment Reminder',
    category: 'Service',
    headerImage: null,
    message: "Hi Priya,\n\nThis is a reminder for your upcoming appointment:\n\n📅 Date: Monday, Jan 20\n⏰ Time: 10:30 AM\n📍 Location: Apollo Clinic, MG Road\n\nPlease arrive 10 minutes early. Reply YES to confirm or NO to reschedule.",
    buttons: ['Confirm', 'Reschedule', 'Cancel'],
    time: '9:00 a.m.'
  },
  {
    id: 4,
    name: 'Marketing - Flash Sale',
    category: 'Marketing',
    headerImage: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=200&fit=crop',
    message: "⚡ FLASH SALE ALERT! ⚡\n\nHey Amit!\n\n🔥 50% OFF on all items!\n⏰ Only for the next 24 hours!\n\nDon't miss out on these amazing deals. Shop now before it's gone!",
    buttons: ['Shop Now', 'View Offers'],
    time: '11:45 a.m.'
  },
  {
    id: 5,
    name: 'Utility - Shipping Update',
    category: 'Utility',
    headerImage: null,
    message: "📦 Shipping Update\n\nHi Neha,\n\nGreat news! Your package is on its way!\n\n🚚 Tracking: AWB789456123\n📍 Status: Out for delivery\n⏰ Expected: Today by 6 PM\n\nOur delivery partner will contact you shortly.",
    buttons: ['Track Package', 'Contact Support'],
    time: '3:20 p.m.'
  },
  {
    id: 6,
    name: 'Service - Feedback Request',
    category: 'Service',
    headerImage: null,
    message: "Hi Karan,\n\nThank you for your recent purchase! 🙏\n\nWe'd love to hear about your experience. Your feedback helps us serve you better.\n\nHow would you rate your experience?\n⭐⭐⭐⭐⭐",
    buttons: ['Rate Now', 'Maybe Later'],
    time: '5:00 p.m.'
  },
  {
    id: 7,
    name: 'Marketing - Welcome Message',
    category: 'Marketing',
    headerImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop',
    message: "Welcome to Kitten Shoes! 🎉\n\nHi Ananya,\n\nWe're thrilled to have you join us!\n\n🎁 Here's 20% OFF on your first order\nUse code: WELCOME20\n\nExplore our collection and find something you'll love!",
    buttons: ['Start Shopping', 'Browse Categories'],
    time: '8:00 a.m.'
  },
]

function getStatusColor(status: string) {
  switch (status) {
    case 'active': return { bg: '#dcfce7', text: '#16a34a' }
    case 'scheduled': return { bg: '#dbeafe', text: '#2563eb' }
    case 'completed': return { bg: '#f3f4f6', text: '#6b7280' }
    case 'draft': return { bg: '#fef3c7', text: '#d97706' }
    default: return { bg: '#f3f4f6', text: '#6b7280' }
  }
}

function getCategoryColor(category: string) {
  switch (category) {
    case 'Marketing': return { bg: '#fce7f3', text: '#db2777' }
    case 'Utility': return { bg: '#dbeafe', text: '#2563eb' }
    case 'Authentication': return { bg: '#fef3c7', text: '#d97706' }
    case 'Service': return { bg: '#dcfce7', text: '#16a34a' }
    default: return { bg: '#f3f4f6', text: '#6b7280' }
  }
}

// WhatsApp Message Template Component
function WhatsAppTemplateCard({ template, themeColor }: { template: typeof templates[0], themeColor: string }) {
  const categoryColors = getCategoryColor(template.category)

  return (
    <div
      className="flex-shrink-0 w-80 mx-2 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
    >
      {/* Template Name Header */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between gap-2">
          <h4
            className="font-semibold text-gray-800 text-sm truncate flex-1"
            style={{ letterSpacing: '-0.01em' }}
          >
            {template.name}
          </h4>
          <span
            className="px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 uppercase tracking-wide"
            style={{ backgroundColor: categoryColors.bg, color: categoryColors.text, fontSize: '10px' }}
          >
            {template.category}
          </span>
        </div>
      </div>

      {/* WhatsApp Chat Preview */}
      <div
        className="p-3"
        style={{
          backgroundColor: '#efeae2',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4cfc4' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      >
        {/* Message Bubble */}
        <div
          className="bg-white rounded-xl shadow-sm max-w-full overflow-hidden"
          style={{
            borderTopLeftRadius: '4px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
          }}
        >
          {/* Header Image */}
          {template.headerImage && (
            <div className="w-full h-32 bg-gray-100 overflow-hidden">
              <img
                src={template.headerImage}
                alt="Template header"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Message Content */}
          <div className="px-3 py-2.5">
            <p
              className="text-gray-900 whitespace-pre-line leading-relaxed"
              style={{
                fontSize: '14.2px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                letterSpacing: '0.01em',
                lineHeight: '1.45'
              }}
            >
              {template.message}
            </p>
            <div className="flex items-center justify-end gap-1 mt-1.5">
              <span
                className="text-gray-400"
                style={{ fontSize: '11px', fontFamily: 'inherit' }}
              >
                {template.time}
              </span>
              {/* Double check mark */}
              <svg width="16" height="11" viewBox="0 0 16 11" fill="none" className="text-[#53bdeb]">
                <path d="M11.071 0.929L4.929 7.071L2.929 5.071L1.515 6.485L4.929 9.899L12.485 2.343L11.071 0.929Z" fill="currentColor"/>
                <path d="M15.071 0.929L8.929 7.071L8.515 6.657L7.101 8.071L8.929 9.899L16.485 2.343L15.071 0.929Z" fill="currentColor"/>
              </svg>
            </div>
          </div>

          {/* Action Buttons */}
          {template.buttons && template.buttons.length > 0 && (
            <div className="border-t border-gray-100">
              {template.buttons.map((button, index) => (
                <button
                  key={index}
                  className="w-full py-3 font-medium text-[#00a884] hover:bg-[#f7f8fa] transition-colors flex items-center justify-center gap-1.5 border-b border-gray-100 last:border-b-0"
                  style={{
                    fontSize: '14px',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                  {button}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Use Template Button */}
      <div className="px-4 py-3 border-t border-gray-100 bg-white">
        <button
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
          style={{
            backgroundColor: themeColor,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            letterSpacing: '0.02em'
          }}
        >
          Use Template
        </button>
      </div>
    </div>
  )
}

export function BroadcastingPage({ themeColor }: BroadcastingPageProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCampaigns = campaigns.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Duplicate templates for seamless infinite scroll
  const scrollingTemplates = [...templates, ...templates]

  return (
    <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Broadcasting Campaign</h2>
            <p className="text-gray-600 mt-1">Create and manage broadcast messages</p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors"
            style={{ backgroundColor: themeColor }}
          >
            <Plus className="w-4 h-4" />
            New Campaign
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Campaigns', value: '24', icon: Megaphone },
            { label: 'Active Campaigns', value: '3', icon: Send },
            { label: 'Total Recipients', value: '15.2K', icon: Users },
            { label: 'Avg. Read Rate', value: '72%', icon: CheckCircle },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${themeColor}15` }}
                >
                  <stat.icon className="w-5 h-5" style={{ color: themeColor }} />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Templates Section - Scrolling Animation */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Message Templates</h3>
                <p className="text-sm text-gray-500 mt-1">WhatsApp approved templates for your campaigns</p>
              </div>
              <button
                className="text-sm font-medium hover:underline"
                style={{ color: themeColor }}
              >
                View All Templates
              </button>
            </div>
          </div>
          <div className="relative overflow-hidden py-4">
            {/* Gradient overlays for smooth edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            {/* Scrolling container */}
            <div className="flex animate-scroll-left">
              {scrollingTemplates.map((template, index) => (
                <WhatsAppTemplateCard
                  key={`${template.id}-${index}`}
                  template={template}
                  themeColor={themeColor}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Campaigns List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Campaigns</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                />
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {filteredCampaigns.map((campaign) => {
              const statusColors = getStatusColor(campaign.status)
              return (
                <div
                  key={campaign.id}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${themeColor}15` }}
                      >
                        <Megaphone className="w-5 h-5" style={{ color: themeColor }} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                            style={{ backgroundColor: statusColors.bg, color: statusColors.text }}
                          >
                            {campaign.status}
                          </span>
                          {campaign.scheduledAt && (
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              {campaign.scheduledAt}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {campaign.sent.toLocaleString()} / {campaign.recipients.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">Sent / Recipients</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {campaign.sent > 0 ? Math.round((campaign.read / campaign.sent) * 100) : 0}%
                        </p>
                        <p className="text-xs text-gray-500">Read Rate</p>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* CSS Animation Styles */}
      <style>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll-left {
          animation: scroll-left 40s linear infinite;
        }

        .animate-scroll-left:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
