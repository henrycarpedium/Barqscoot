// src/services/supportApi.js
import { v4 as uuidv4 } from 'uuid';

// Mock data for support tickets
const mockTickets = [
  {
    id: 'TKT-001',
    title: 'Scooter not starting',
    description: 'The scooter SC-089 is not starting even after charging',
    status: 'open',
    priority: 'high',
    category: 'technical',
    userId: 'user-123',
    userName: 'John Doe',
    userEmail: 'john.doe@email.com',
    assignedTo: 'agent-001',
    assignedToName: 'Sarah Wilson',
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z',
    resolvedAt: null,
    tags: ['scooter', 'technical', 'urgent'],
    attachments: [],
    responses: [
      {
        id: 'resp-001',
        message: 'Hello John, thank you for reporting this issue. We are looking into the scooter SC-089 problem.',
        author: 'Sarah Wilson',
        authorType: 'agent',
        createdAt: '2024-01-20T11:00:00Z',
        attachments: []
      },
      {
        id: 'resp-002',
        message: 'I tried again but still the same issue. The display shows battery full but motor won\'t start.',
        author: 'John Doe',
        authorType: 'user',
        createdAt: '2024-01-20T14:30:00Z',
        attachments: []
      }
    ]
  },
  {
    id: 'TKT-002',
    title: 'Billing dispute - overcharged',
    description: 'I was charged $25 for a 10-minute ride which should have been $5',
    status: 'in_progress',
    priority: 'medium',
    category: 'billing',
    userId: 'user-456',
    userName: 'Emma Smith',
    userEmail: 'emma.smith@email.com',
    assignedTo: 'agent-002',
    assignedToName: 'Mike Johnson',
    createdAt: '2024-01-19T15:20:00Z',
    updatedAt: '2024-01-20T09:15:00Z',
    resolvedAt: null,
    tags: ['billing', 'dispute', 'refund'],
    attachments: ['receipt-001.pdf'],
    responses: [
      {
        id: 'resp-003',
        message: 'Hi Emma, I\'m reviewing your billing details. Can you please provide the ride ID?',
        author: 'Mike Johnson',
        authorType: 'agent',
        createdAt: '2024-01-19T16:00:00Z',
        attachments: []
      },
      {
        id: 'resp-004',
        message: 'The ride ID is RD-789456. I have attached the receipt.',
        author: 'Emma Smith',
        authorType: 'user',
        createdAt: '2024-01-19T16:30:00Z',
        attachments: ['receipt-001.pdf']
      },
      {
        id: 'resp-005',
        message: 'Thank you for the details. I found the issue - there was a surge pricing applied incorrectly. Processing your refund now.',
        author: 'Mike Johnson',
        authorType: 'agent',
        createdAt: '2024-01-20T09:15:00Z',
        attachments: []
      }
    ]
  },
  {
    id: 'TKT-003',
    title: 'Account locked after payment failure',
    description: 'My account got locked after my card was declined, but I have updated the payment method',
    status: 'resolved',
    priority: 'low',
    category: 'account',
    userId: 'user-789',
    userName: 'David Chen',
    userEmail: 'david.chen@email.com',
    assignedTo: 'agent-001',
    assignedToName: 'Sarah Wilson',
    createdAt: '2024-01-18T12:00:00Z',
    updatedAt: '2024-01-18T16:30:00Z',
    resolvedAt: '2024-01-18T16:30:00Z',
    tags: ['account', 'payment', 'resolved'],
    attachments: [],
    responses: [
      {
        id: 'resp-006',
        message: 'Hi David, I can help you unlock your account. Let me check your payment method.',
        author: 'Sarah Wilson',
        authorType: 'agent',
        createdAt: '2024-01-18T12:30:00Z',
        attachments: []
      },
      {
        id: 'resp-007',
        message: 'Your account has been unlocked and the new payment method is verified. You can now use the service.',
        author: 'Sarah Wilson',
        authorType: 'agent',
        createdAt: '2024-01-18T16:30:00Z',
        attachments: []
      }
    ]
  },
  {
    id: 'TKT-004',
    title: 'App crashes when booking scooter',
    description: 'The mobile app crashes every time I try to book a scooter near Central Park',
    status: 'open',
    priority: 'medium',
    category: 'technical',
    userId: 'user-321',
    userName: 'Lisa Rodriguez',
    userEmail: 'lisa.rodriguez@email.com',
    assignedTo: null,
    assignedToName: null,
    createdAt: '2024-01-20T08:15:00Z',
    updatedAt: '2024-01-20T08:15:00Z',
    resolvedAt: null,
    tags: ['app', 'crash', 'booking'],
    attachments: ['crash-log.txt'],
    responses: []
  },
  {
    id: 'TKT-005',
    title: 'Request for corporate account',
    description: 'We would like to set up a corporate account for our company with 50+ employees',
    status: 'open',
    priority: 'low',
    category: 'sales',
    userId: 'user-654',
    userName: 'Robert Taylor',
    userEmail: 'robert.taylor@company.com',
    assignedTo: 'agent-003',
    assignedToName: 'Jennifer Lee',
    createdAt: '2024-01-19T14:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
    resolvedAt: null,
    tags: ['corporate', 'sales', 'new-account'],
    attachments: ['company-details.pdf'],
    responses: [
      {
        id: 'resp-008',
        message: 'Hello Robert, thank you for your interest in our corporate program. I\'ll send you the details shortly.',
        author: 'Jennifer Lee',
        authorType: 'agent',
        createdAt: '2024-01-19T15:00:00Z',
        attachments: []
      }
    ]
  },
  {
    id: 'TKT-006',
    title: 'GPS tracking not working',
    description: 'The GPS on scooter SC-156 seems to be malfunctioning. It shows wrong location on the map.',
    status: 'in_progress',
    priority: 'high',
    category: 'technical',
    userId: 'user-890',
    userName: 'Maria Garcia',
    userEmail: 'maria.garcia@email.com',
    assignedTo: 'agent-001',
    assignedToName: 'Sarah Wilson',
    createdAt: '2024-01-20T16:30:00Z',
    updatedAt: '2024-01-20T17:15:00Z',
    resolvedAt: null,
    tags: ['gps', 'tracking', 'hardware'],
    attachments: ['screenshot-map.png'],
    responses: [
      {
        id: 'resp-009',
        message: 'Thank you for reporting this GPS issue. I\'m escalating this to our technical team.',
        author: 'Sarah Wilson',
        authorType: 'agent',
        createdAt: '2024-01-20T16:45:00Z',
        attachments: []
      }
    ]
  },
  {
    id: 'TKT-007',
    title: 'Refund request for cancelled ride',
    description: 'I was charged for a ride that I cancelled within 2 minutes of booking. Please process refund.',
    status: 'open',
    priority: 'medium',
    category: 'billing',
    userId: 'user-111',
    userName: 'Alex Johnson',
    userEmail: 'alex.johnson@email.com',
    assignedTo: null,
    assignedToName: null,
    createdAt: '2024-01-20T13:20:00Z',
    updatedAt: '2024-01-20T13:20:00Z',
    resolvedAt: null,
    tags: ['refund', 'cancellation', 'billing'],
    attachments: [],
    responses: []
  },
  {
    id: 'TKT-008',
    title: 'Unable to end ride',
    description: 'The end ride button is not working. I parked the scooter but cannot end the trip.',
    status: 'open',
    priority: 'high',
    category: 'technical',
    userId: 'user-222',
    userName: 'Sophie Brown',
    userEmail: 'sophie.brown@email.com',
    assignedTo: 'agent-002',
    assignedToName: 'Mike Johnson',
    createdAt: '2024-01-20T18:45:00Z',
    updatedAt: '2024-01-20T19:00:00Z',
    resolvedAt: null,
    tags: ['app', 'ride-end', 'urgent'],
    attachments: [],
    responses: [
      {
        id: 'resp-010',
        message: 'Hi Sophie, I can help you end the ride manually. Can you please provide the scooter ID?',
        author: 'Mike Johnson',
        authorType: 'agent',
        createdAt: '2024-01-20T19:00:00Z',
        attachments: []
      }
    ]
  },
  {
    id: 'TKT-009',
    title: 'Promo code not working',
    description: 'I tried to use promo code SAVE20 but it says invalid code. The code was sent to me via email.',
    status: 'resolved',
    priority: 'low',
    category: 'general',
    userId: 'user-333',
    userName: 'Tom Wilson',
    userEmail: 'tom.wilson@email.com',
    assignedTo: 'agent-003',
    assignedToName: 'Jennifer Lee',
    createdAt: '2024-01-19T11:30:00Z',
    updatedAt: '2024-01-19T14:20:00Z',
    resolvedAt: '2024-01-19T14:20:00Z',
    tags: ['promo', 'discount', 'resolved'],
    attachments: ['promo-email.png'],
    responses: [
      {
        id: 'resp-011',
        message: 'Hi Tom, I checked and the promo code SAVE20 has expired. I\'ve applied a new discount to your account.',
        author: 'Jennifer Lee',
        authorType: 'agent',
        createdAt: '2024-01-19T12:00:00Z',
        attachments: []
      },
      {
        id: 'resp-012',
        message: 'Thank you! I can see the discount in my account now.',
        author: 'Tom Wilson',
        authorType: 'user',
        createdAt: '2024-01-19T14:20:00Z',
        attachments: []
      }
    ]
  },
  {
    id: 'TKT-010',
    title: 'Account verification issues',
    description: 'I uploaded my ID for verification 3 days ago but my account is still not verified.',
    status: 'in_progress',
    priority: 'medium',
    category: 'account',
    userId: 'user-444',
    userName: 'Rachel Green',
    userEmail: 'rachel.green@email.com',
    assignedTo: 'agent-001',
    assignedToName: 'Sarah Wilson',
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-20T11:30:00Z',
    resolvedAt: null,
    tags: ['verification', 'id-check', 'account'],
    attachments: ['id-document.jpg'],
    responses: [
      {
        id: 'resp-013',
        message: 'Hi Rachel, I\'m reviewing your verification documents. There seems to be an issue with the image quality.',
        author: 'Sarah Wilson',
        authorType: 'agent',
        createdAt: '2024-01-18T10:00:00Z',
        attachments: []
      },
      {
        id: 'resp-014',
        message: 'I\'ve uploaded a clearer image. Please check now.',
        author: 'Rachel Green',
        authorType: 'user',
        createdAt: '2024-01-19T15:30:00Z',
        attachments: ['id-document-clear.jpg']
      },
      {
        id: 'resp-015',
        message: 'Perfect! Your account verification is now in progress and should be completed within 24 hours.',
        author: 'Sarah Wilson',
        authorType: 'agent',
        createdAt: '2024-01-20T11:30:00Z',
        attachments: []
      }
    ]
  }
];

// Mock support agents
const mockAgents = [
  {
    id: 'agent-001',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@barqscoot.com',
    role: 'Senior Support Agent',
    status: 'online',
    activeTickets: 3,
    totalTickets: 45,
    avgResolutionTime: 2.5 // hours
  },
  {
    id: 'agent-002',
    name: 'Mike Johnson',
    email: 'mike.johnson@barqscoot.com',
    role: 'Support Agent',
    status: 'online',
    activeTickets: 5,
    totalTickets: 32,
    avgResolutionTime: 3.2
  },
  {
    id: 'agent-003',
    name: 'Jennifer Lee',
    email: 'jennifer.lee@barqscoot.com',
    role: 'Sales Support',
    status: 'away',
    activeTickets: 2,
    totalTickets: 28,
    avgResolutionTime: 4.1
  }
];

// Mock support metrics
const mockMetrics = {
  totalTickets: 165,
  openTickets: 28,
  inProgressTickets: 15,
  resolvedTickets: 122,
  avgResolutionTime: 3.2, // hours
  customerSatisfaction: 4.6, // out of 5
  firstResponseTime: 0.8, // hours
  ticketsByCategory: {
    technical: 48,
    billing: 35,
    account: 32,
    sales: 18,
    general: 32
  },
  ticketsByPriority: {
    high: 12,
    medium: 18,
    low: 135
  },
  resolutionTrend: [
    { date: '2024-01-14', resolved: 12, created: 15 },
    { date: '2024-01-15', resolved: 18, created: 14 },
    { date: '2024-01-16', resolved: 16, created: 12 },
    { date: '2024-01-17', resolved: 14, created: 18 },
    { date: '2024-01-18', resolved: 20, created: 16 },
    { date: '2024-01-19', resolved: 15, created: 13 },
    { date: '2024-01-20', resolved: 8, created: 11 }
  ]
};

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Support API service
export const supportService = {
  // Get all tickets with optional filters
  getAllTickets: async (filters = {}) => {
    await delay(500);
    let filteredTickets = [...mockTickets];

    if (filters.status) {
      filteredTickets = filteredTickets.filter(ticket => ticket.status === filters.status);
    }
    if (filters.priority) {
      filteredTickets = filteredTickets.filter(ticket => ticket.priority === filters.priority);
    }
    if (filters.category) {
      filteredTickets = filteredTickets.filter(ticket => ticket.category === filters.category);
    }
    if (filters.assignedTo) {
      filteredTickets = filteredTickets.filter(ticket => ticket.assignedTo === filters.assignedTo);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredTickets = filteredTickets.filter(ticket =>
        ticket.title.toLowerCase().includes(searchLower) ||
        ticket.description.toLowerCase().includes(searchLower) ||
        ticket.userName.toLowerCase().includes(searchLower) ||
        ticket.userEmail.toLowerCase().includes(searchLower)
      );
    }

    return { data: filteredTickets };
  },

  // Get ticket by ID
  getTicketById: async (ticketId) => {
    await delay(300);
    const ticket = mockTickets.find(t => t.id === ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    return { data: ticket };
  },

  // Create new ticket
  createTicket: async (ticketData) => {
    await delay(500);
    const newTicket = {
      id: `TKT-${String(mockTickets.length + 1).padStart(3, '0')}`,
      ...ticketData,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      resolvedAt: null,
      responses: []
    };
    mockTickets.unshift(newTicket);
    return { data: newTicket };
  },

  // Update ticket
  updateTicket: async (ticketId, updateData) => {
    await delay(300);
    const ticketIndex = mockTickets.findIndex(t => t.id === ticketId);
    if (ticketIndex === -1) {
      throw new Error('Ticket not found');
    }

    mockTickets[ticketIndex] = {
      ...mockTickets[ticketIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
      ...(updateData.status === 'resolved' && { resolvedAt: new Date().toISOString() })
    };

    return { data: mockTickets[ticketIndex] };
  },

  // Add response to ticket
  addResponse: async (ticketId, responseData) => {
    await delay(400);
    const ticket = mockTickets.find(t => t.id === ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const newResponse = {
      id: `resp-${uuidv4()}`,
      ...responseData,
      createdAt: new Date().toISOString()
    };

    ticket.responses.push(newResponse);
    ticket.updatedAt = new Date().toISOString();

    return { data: newResponse };
  },

  // Assign ticket to agent
  assignTicket: async (ticketId, agentId) => {
    await delay(300);
    const ticket = mockTickets.find(t => t.id === ticketId);
    const agent = mockAgents.find(a => a.id === agentId);

    if (!ticket) throw new Error('Ticket not found');
    if (!agent) throw new Error('Agent not found');

    ticket.assignedTo = agentId;
    ticket.assignedToName = agent.name;
    ticket.updatedAt = new Date().toISOString();

    return { data: ticket };
  },

  // Get all support agents
  getAllAgents: async () => {
    await delay(200);
    return { data: mockAgents };
  },

  // Get support metrics
  getMetrics: async () => {
    await delay(300);
    return { data: mockMetrics };
  }
};

export default supportService;
