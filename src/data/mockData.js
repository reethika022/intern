export const farmers = [
  { id: "F-1001", name: "Ravi Kumar", mobile: "98765 23014", village: "Narsapur", mandal: "Chevella", district: "Ranga Reddy", crop: "Paddy", interest: "High", status: "Active" },
  { id: "F-1002", name: "Anitha Reddy", mobile: "99887 44120", village: "Moinabad", mandal: "Moinabad", district: "Ranga Reddy", crop: "Cotton", interest: "Medium", status: "Pending" },
  { id: "F-1003", name: "Suresh Naik", mobile: "91234 88901", village: "Kothapally", mandal: "Shadnagar", district: "Ranga Reddy", crop: "Chilli", interest: "High", status: "Approved" },
  { id: "F-1004", name: "Lakshmi Bai", mobile: "90123 67012", village: "Mallapur", mandal: "Medchal", district: "Medchal", crop: "Maize", interest: "Low", status: "Active" },
  { id: "F-1005", name: "Mahesh Yadav", mobile: "98480 23090", village: "Dundigal", mandal: "Quthbullapur", district: "Medchal", crop: "Tomato", interest: "High", status: "Submitted" },
];

export const demos = [
  { id: "D-4101", farmer: "Ravi Kumar", crop: "Paddy", product: "BioRoot Plus", date: "2026-06-01", status: "In Progress" },
  { id: "D-4102", farmer: "Anitha Reddy", crop: "Cotton", product: "Pulse Zinc", date: "2026-06-02", status: "Pending" },
  { id: "D-4103", farmer: "Suresh Naik", crop: "Chilli", product: "GreenShield", date: "2026-06-03", status: "Completed" },
  { id: "D-4104", farmer: "Mahesh Yadav", crop: "Tomato", product: "YieldMax", date: "2026-06-04", status: "Submitted" },
];

export const dealers = [
  { name: "Sri Sai Agro Agencies", location: "Chevella", visitDate: "2026-06-01", status: "Completed" },
  { name: "Kisan Mitra Inputs", location: "Moinabad", visitDate: "2026-06-02", status: "In Progress" },
  { name: "Green Valley Traders", location: "Shadnagar", visitDate: "2026-06-04", status: "Pending" },
  { name: "Agri Care Point", location: "Medchal", visitDate: "2026-06-05", status: "Submitted" },
];

export const attendance = [
  { date: "2026-06-01", checkIn: "08:42 AM", checkOut: "05:36 PM", duration: "8h 54m", status: "Approved" },
  { date: "2026-06-02", checkIn: "08:55 AM", checkOut: "05:18 PM", duration: "8h 23m", status: "Approved" },
  { date: "2026-06-03", checkIn: "09:05 AM", checkOut: "04:45 PM", duration: "7h 40m", status: "Pending" },
  { date: "2026-06-04", checkIn: "08:38 AM", checkOut: "05:50 PM", duration: "9h 12m", status: "Approved" },
];

export const tasks = [
  { name: "Visit paddy demo plot", village: "Narsapur", priority: "High", dueDate: "2026-06-06", status: "In Progress" },
  { name: "Collect farmer feedback", village: "Moinabad", priority: "Medium", dueDate: "2026-06-07", status: "Pending" },
  { name: "Submit dealer stock report", village: "Chevella", priority: "High", dueDate: "2026-06-05", status: "Pending" },
  { name: "Upload chilli issue media", village: "Kothapally", priority: "Low", dueDate: "2026-06-08", status: "Completed" },
];

export const issues = [
  { farmer: "Suresh Naik", crop: "Chilli", type: "Leaf curl", severity: "High", status: "In Progress" },
  { farmer: "Ravi Kumar", crop: "Paddy", type: "Root stress", severity: "Medium", status: "Pending" },
  { farmer: "Mahesh Yadav", crop: "Tomato", type: "Fruit borer", severity: "Critical", status: "Submitted" },
];

export const reports = [
  { id: "R-2201", submittedBy: "Uma Reethika", date: "2026-06-01", status: "Approved" },
  { id: "R-2202", submittedBy: "Arjun Varma", date: "2026-06-02", status: "Pending" },
  { id: "R-2203", submittedBy: "Maya Singh", date: "2026-06-03", status: "Submitted" },
];

export const leaderboard = [
  { rank: 1, intern: "Uma Reethika", farmers: 86, demos: 18, reports: 22, score: 96, badge: "Gold" },
  { rank: 2, intern: "Arjun Varma", farmers: 78, demos: 16, reports: 21, score: 91, badge: "Silver" },
  { rank: 3, intern: "Maya Singh", farmers: 71, demos: 14, reports: 20, score: 86, badge: "Bronze" },
  { rank: 4, intern: "Nikhil Rao", farmers: 65, demos: 11, reports: 18, score: 79, badge: "Rising Star" },
];

export const weeklyRegistrations = [
  { day: "Mon", farmers: 18, demos: 5 },
  { day: "Tue", farmers: 24, demos: 8 },
  { day: "Wed", farmers: 21, demos: 7 },
  { day: "Thu", farmers: 32, demos: 11 },
  { day: "Fri", farmers: 28, demos: 9 },
  { day: "Sat", farmers: 36, demos: 13 },
  { day: "Sun", farmers: 22, demos: 6 },
];

export const demoActivity = [
  { crop: "Paddy", planned: 12, completed: 8 },
  { crop: "Cotton", planned: 9, completed: 6 },
  { crop: "Chilli", planned: 7, completed: 5 },
  { crop: "Maize", planned: 5, completed: 3 },
  { crop: "Tomato", planned: 8, completed: 4 },
];

export const activities = [
  "Ravi Kumar farmer profile approved by Regional Manager",
  "GreenShield application media uploaded for chilli demo",
  "Dealer support request created for Chevella territory",
  "Daily report submitted with competitor pricing notes",
];

export const media = [
  { type: "Farmer", title: "Paddy field visit", linked: "F-1001", uploaded: "Today" },
  { type: "Demo", title: "Before application", linked: "D-4101", uploaded: "Yesterday" },
  { type: "Issue", title: "Leaf curl evidence", linked: "I-301", uploaded: "Jun 3" },
  { type: "Dealer", title: "Shop display", linked: "DV-144", uploaded: "Jun 2" },
];
