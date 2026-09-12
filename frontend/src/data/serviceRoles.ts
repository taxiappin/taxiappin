export interface RoleToolShortcut {
  name: string;
  tabKey: string;
  icon: string;
  desc: string;
}

export interface RoleKPI {
  metric: string;
  target: string;
  period: string;
}

export interface ServiceRoleDef {
  id: string;
  name: string;
  category: 'Executive' | 'Operations' | 'Trust & Safety' | 'Support' | 'Finance' | 'Fleet & Growth' | 'Custom' | string;
  tagline: string;
  description: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  iconName: string;
  defaultHub: string;
  responsibilities: string[];
  permittedActions: string[];
  restrictedActions: string[];
  primaryTools: RoleToolShortcut[];
  kpis: RoleKPI[];
  sopWorkflow: string[];
  isCustom?: boolean;
}

export const SERVICE_ROLES: ServiceRoleDef[] = [
  {
    id: 'Super Admin',
    name: 'Super Admin',
    category: 'Executive',
    tagline: 'Full platform sovereignty, system tools & technical config',
    description: 'Unrestricted master access across all modules, API keys, database console, microservice flags, and administrative privileges.',
    badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    badgeText: 'text-emerald-700 dark:text-emerald-400',
    badgeBorder: 'border-emerald-200 dark:border-emerald-800',
    iconName: 'ShieldAlert',
    defaultHub: 'National Platform (All Hubs)',
    responsibilities: [
      'Maintain full platform sovereignty, cloud cluster settings, and high-availability database integrity.',
      'Control microservice feature flags, maintenance switchover, and live system pipelines.',
      'Provision, suspend, and audit administrative staff roles, permissions, and security matrices.',
      'Manage global third-party API integrations (Payment gateways, SMS providers, Google Maps API).'
    ],
    permittedActions: [
      'Full create, read, update, and delete (CRUD) sovereignty on all database collections.',
      'Configure platform commission splits, surge pricing algorithms, and tax parameters.',
      'Force override ride states, manual driver dispatches, and emergency bypass protocol.',
      'Export financial audits, telemetry audit trails, and raw system debug logs.'
    ],
    restrictedActions: [
      'None. Unrestricted master root clearance across all platform environments.'
    ],
    primaryTools: [
      { name: 'Microservices & Flags', tabKey: 'platform_control', icon: 'Cpu', desc: 'Toggle platform capabilities & pipeline flags' },
      { name: 'Database Console', tabKey: 'database', icon: 'Database', desc: 'Direct access to Firestore and collection schemas' },
      { name: 'Role & User Matrix', tabKey: 'user_types', icon: 'ShieldAlert', desc: 'Audit clearance matrices and admin operators' }
    ],
    kpis: [
      { metric: 'Platform Uptime', target: '99.99%', period: 'Monthly SLA' },
      { metric: 'Cluster Response Latency', target: '< 45ms', period: 'Real-time p95' },
      { metric: 'Security Audit Pass Rate', target: '100%', period: 'Quarterly' }
    ],
    sopWorkflow: [
      'Perform morning platform health audits and check database replication telemetry.',
      'Review any critical system alerts, failed webhook deliveries, or API rate limit spikes.',
      'Approve staff role elevation requests and verify active operator sessions.',
      'Ensure nightly encrypted backups are verified and sync status is normal.'
    ]
  },
  {
    id: 'City Ops & Dispatcher',
    name: 'City Ops & Dispatcher',
    category: 'Operations',
    tagline: 'Live trip dispatch, driver allocation & city heatmaps',
    description: 'Controls real-time booking requests, manual driver dispatching, zone tariffs, and city-level fleet navigation telemetry.',
    badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    badgeText: 'text-blue-700 dark:text-blue-400',
    badgeBorder: 'border-blue-200 dark:border-blue-800',
    iconName: 'Navigation',
    defaultHub: 'Mumbai Central Hub',
    responsibilities: [
      'Monitor live booking queues, unassigned ride requests, and auto-dispatch algorithms.',
      'Perform manual driver reassignment for high-priority VIP or delayed pickups.',
      'Analyze city geofence supply-demand heatmaps and manage local surge multiplier triggers.',
      'Oversee active ride routes, heavy traffic bottlenecks, and driver idle durations.'
    ],
    permittedActions: [
      'Broadcast instant ride dispatch orders to nearby idle drivers within geofenced hubs.',
      'Reassign, cancel, or modify route destinations on active in-transit rides with rider consent.',
      'Access driver live telemetry GPS tracks, speed logs, and turn-by-turn routing.',
      'View city-level ride volume analytics and peak-hour heatmaps.'
    ],
    restrictedActions: [
      'Cannot alter base system pricing models, company commission splits, or banking credentials.',
      'Cannot modify developer API keys, database indexes, or root server configurations.',
      'Cannot view driver bank account numbers or execute wallet payout withdrawals.'
    ],
    primaryTools: [
      { name: 'Live Trips Dispatch', tabKey: 'rides', icon: 'Navigation', desc: 'Real-time dispatch monitor & trip re-routing' },
      { name: 'Driver Registry', tabKey: 'drivers', icon: 'Car', desc: 'Driver fleet status, availability & vehicle info' },
      { name: 'Operational Heatmap', tabKey: 'dashboard', icon: 'Activity', desc: 'Demand density & geofence telemetry' }
    ],
    kpis: [
      { metric: 'Avg Dispatch Latency', target: '< 15 sec', period: 'Daily' },
      { metric: 'Pickup ETA Accuracy', target: '> 94%', period: 'Weekly' },
      { metric: 'Driver Idle Time', target: '< 8 mins', period: 'Peak Hours' }
    ],
    sopWorkflow: [
      'Open live city dispatch telemetry radar and verify driver online density in key hubs.',
      'Monitor pending booking requests exceeding 45 seconds for manual allocation.',
      'Track peak morning/evening demand surges and balance geofence fleet allocations.',
      'Log trip exception incidents and coordinate with Safety & SOS desk if anomalies occur.'
    ]
  },
  {
    id: 'KYC & Verification Officer',
    name: 'KYC & Verification Officer',
    category: 'Trust & Safety',
    tagline: 'Driver onboarding KYC, license & vehicle audit',
    description: 'Reviews driver KYC documents (Driving License, RC, Vehicle Insurance, Police Verification) and conducts vehicle clearance audits.',
    badgeBg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
    badgeText: 'text-teal-700 dark:text-teal-400',
    badgeBorder: 'border-teal-200 dark:border-teal-800',
    iconName: 'ShieldCheck',
    defaultHub: 'National Verification Desk',
    responsibilities: [
      'Validate government identities (Aadhaar, PAN, Driving License) for driver applicants.',
      'Inspect Vehicle Registration Certificates (RC), Commercial Permits, and Fitness Certificates.',
      'Verify Comprehensive Vehicle Insurance policies and ensure pollution under control (PUC) validity.',
      'Audit background check and police verification certificates prior to driver platform activation.'
    ],
    permittedActions: [
      'Approve, reject, or request document re-upload on driver KYC verification queues.',
      'Activate qualified driver accounts to allow live trip acceptance on consumer apps.',
      'Suspend driver onboarding profiles failing background or criminal history checks.',
      'Add regulatory audit notes and set annual document expiration renewal reminders.'
    ],
    restrictedActions: [
      'Cannot execute financial transactions, adjust ride fares, or issue wallet refunds.',
      'Cannot access platform API credentials, server settings, or global promo codes.',
      'Cannot dispatch rides or alter live in-transit trip routes.'
    ],
    primaryTools: [
      { name: 'Driver Verification Queue', tabKey: 'verification', icon: 'ShieldCheck', desc: 'Document audit, OCR inspection & approval' },
      { name: 'Fleet Drivers Registry', tabKey: 'drivers', icon: 'Users', desc: 'Driver profiles, compliance badges & licenses' },
      { name: 'Vehicle Asset Inspector', tabKey: 'fleets', icon: 'Truck', desc: 'Commercial fitness & insurance expiration audit' }
    ],
    kpis: [
      { metric: 'KYC Review Turnaround', target: '< 12 mins', period: 'Per Application' },
      { metric: 'Compliance Audit Rate', target: '100%', period: 'Before Activation' },
      { metric: 'Document Fraud Catch', target: '0% False Pass', period: 'Monthly Audit' }
    ],
    sopWorkflow: [
      'Review pending KYC verification queues in chronological submission order.',
      'Perform dual-layer cross check on Driving License numbers with National Transport database.',
      'Verify clear photo matches against government ID and vehicle registration details.',
      'Grant verified badge on successful audit or notify driver with exact reason for re-upload.'
    ]
  },
  {
    id: 'Safety & SOS Officer',
    name: 'Safety & SOS Officer',
    category: 'Trust & Safety',
    tagline: '24/7 SOS panic alerts, route deviations & emergency response',
    description: 'Monitors real-time panic alarms, anomalous route deviations, passenger/driver audio streaming, and coordinates emergency incident response.',
    badgeBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    badgeText: 'text-rose-700 dark:text-rose-400',
    badgeBorder: 'border-rose-200 dark:border-rose-800',
    iconName: 'AlertTriangle',
    defaultHub: '24/7 Safety Command Center',
    responsibilities: [
      'Monitor 24/7 emergency panic alarms triggered by passengers or drivers in real-time.',
      'Investigate critical route deviations (cabs moving >2km off designated GPS path).',
      'Access emergency live cabin audio snippets and coordinates for rapid triage.',
      'Dispatch emergency first-responder teams and coordinate with local police helpline desks.'
    ],
    permittedActions: [
      'Immediate priority override on any in-transit ride to initiate live security tracking.',
      'Trigger automated emergency SMS alerts to rider designated emergency contacts.',
      'Execute immediate temporary account suspension for unsafe or aggressive drivers.',
      'Log official incident forensic reports and securely export trip GPS telemetry.'
    ],
    restrictedActions: [
      'Cannot alter financial ledgers, tax invoices, or driver bank payout accounts.',
      'Cannot modify marketing campaigns, referral rewards, or system feature flags.'
    ],
    primaryTools: [
      { name: 'SOS Emergency Desk', tabKey: 'sos', icon: 'AlertTriangle', desc: 'Live panic alert triage & police liaison' },
      { name: 'Live Trip Telemetry', tabKey: 'rides', icon: 'Navigation', desc: 'Real-time GPS tracking & deviation alerts' },
      { name: 'In-Trip Security Chats', tabKey: 'chats', icon: 'MessageSquare', desc: 'Live passenger/driver conversation audits' }
    ],
    kpis: [
      { metric: 'SOS Response Time', target: '< 25 sec', period: 'Emergency SLA' },
      { metric: 'Incident Resolution Rate', target: '100%', period: 'Same Day' },
      { metric: 'False Positive Filter', target: '< 3 mins', period: 'Verification' }
    ],
    sopWorkflow: [
      'Maintain active monitoring on the 24/7 SOS Panic Radar with audio alarm enabled.',
      'Upon trigger, immediately ring rider and driver simultaneously on recorded line.',
      'If unresponsive or distress confirmed, ping nearest patrol unit with live GPS coordinates.',
      'Notify local emergency contacts and archive complete audit log for legal compliance.'
    ]
  },
  {
    id: 'Customer Support',
    name: 'Customer Support',
    category: 'Support',
    tagline: 'Rider & driver helpdesk, lost items & dispute refunds',
    description: 'Resolves passenger and driver support tickets, live chat inquiries, fare recalculations, and feedback ratings moderation.',
    badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    badgeText: 'text-amber-700 dark:text-amber-400',
    badgeBorder: 'border-amber-200 dark:border-amber-800',
    iconName: 'Headphones',
    defaultHub: 'Central Customer Helpdesk',
    responsibilities: [
      'Resolve incoming customer and driver support tickets across email, chat, and phone channels.',
      'Investigate lost item reports and coordinate safe return between rider and driver.',
      'Review fare calculation disputes (e.g. incorrect tolls, detour excess distance).',
      'Moderate low ratings and driver feedback to ensure service quality standards.'
    ],
    permittedActions: [
      'Issue ride credits, promotional compensation coupons, and dispute wallet refunds up to ₹500.',
      'Update rider contact details, email addresses, and support ticket statuses.',
      'Facilitate secure masked communication between riders and drivers for lost item recovery.',
      'Respond to in-app feedback reviews and update commuter ticket notes.'
    ],
    restrictedActions: [
      'Cannot execute arbitrary large bank payouts or alter system core tariff formulas.',
      'Cannot edit developer source code, modify microservice settings, or delete system logs.',
      'Cannot alter driver KYC verification status without Tier-2 supervisor sign-off.'
    ],
    primaryTools: [
      { name: 'Support Tickets Desk', tabKey: 'tickets', icon: 'Headphones', desc: 'Omnichannel ticket queue & resolution' },
      { name: 'Commuter Reviews', tabKey: 'reviews', icon: 'Star', desc: 'Ratings moderation & driver feedback audit' },
      { name: 'Rider Accounts', tabKey: 'riders', icon: 'Users', desc: 'Customer ride history & wallet credit assist' }
    ],
    kpis: [
      { metric: 'First Response Time', target: '< 3 mins', period: 'Live Chat' },
      { metric: 'Ticket CSAT Score', target: '> 4.8 / 5', period: 'Monthly' },
      { metric: 'One-Contact Resolution', target: '> 82%', period: 'Weekly' }
    ],
    sopWorkflow: [
      'Triage high-priority tickets: billing anomalies, lost belongings, and driver misconduct.',
      'Cross-check actual GPS route distance vs estimated fare when reviewing fare disputes.',
      'Apply compensatory coupon or wallet credit according to standard refund tier guidelines.',
      'Follow up with rider within 24 hours to confirm resolution and close ticket.'
    ]
  },
  {
    id: 'Finance & Accounts',
    name: 'Finance & Accounts',
    category: 'Finance',
    tagline: 'Tariffs, surge pricing, driver payouts & tax compliance',
    description: 'Manages base tariffs, per-km rates, waiting charges, driver withdrawal payouts, GST/VAT invoices, and platform commission audits.',
    badgeBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    badgeText: 'text-indigo-700 dark:text-indigo-400',
    badgeBorder: 'border-indigo-200 dark:border-indigo-800',
    iconName: 'IndianRupee',
    defaultHub: 'Treasury & Revenue Division',
    responsibilities: [
      'Oversee platform revenue streams, driver commission splits, and net take-rate analytics.',
      'Audit and execute automated driver weekly/daily wallet withdrawal payouts.',
      'Configure city-level base fares, per-minute wait time fees, and distance tier pricing.',
      'Generate GST-compliant tax invoices, TDS reconciliation reports, and annual fiscal audits.'
    ],
    permittedActions: [
      'Approve driver payout batches to integrated banking gateways (IMPS/NEFT/UPI).',
      'Adjust base fares, night surge multipliers, and minimum booking fares per vehicle class.',
      'Export detailed transaction ledgers, platform revenue reports, and tax declarations.',
      'Audit promotional coupon discount expenditures and marketing campaign ROI.'
    ],
    restrictedActions: [
      'Cannot modify live driver routes, dispatch cars, or alter safety SOS alerts.',
      'Cannot alter developer API secrets, database architectures, or server configurations.'
    ],
    primaryTools: [
      { name: 'Revenue & Tariffs', tabKey: 'revenue', icon: 'IndianRupee', desc: 'Pricing controls, take rates & financial telemetry' },
      { name: 'Promo & Subscriptions', tabKey: 'promotions', icon: 'Tag', desc: 'Discounts, coupon budgets & loyalty campaigns' },
      { name: 'Fleet Earnings Overview', tabKey: 'fleets', icon: 'TrendingUp', desc: 'Aggregated vendor revenues & commission splits' }
    ],
    kpis: [
      { metric: 'Payout Reconciliation', target: '100% Match', period: 'Daily' },
      { metric: 'TDS & Tax Compliance', target: 'Zero Delay', period: 'Monthly' },
      { metric: 'Payment Gateway Success', target: '> 99.2%', period: 'Real-time' }
    ],
    sopWorkflow: [
      'Run daily reconciliation between payment gateway settlement batches and trip ledgers.',
      'Review pending driver withdrawal requests and execute approved batch bank transfers.',
      'Verify dynamic surge pricing yield across top city zones to optimize platform margin.',
      'Generate weekly management profit & loss summary and archive monthly GST filings.'
    ]
  },
  {
    id: 'Fleet Vendor',
    name: 'Fleet Vendor',
    category: 'Fleet & Growth',
    tagline: 'Multi-vehicle fleet assets, assigned drivers & fleet earnings',
    description: 'Transporter portal to manage company-owned vehicle fleets, assign contracted drivers, and review aggregated fleet earnings.',
    badgeBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
    badgeText: 'text-cyan-700 dark:text-cyan-400',
    badgeBorder: 'border-cyan-200 dark:border-cyan-800',
    iconName: 'Truck',
    defaultHub: 'Star Cabs Fleet Hub (35 Cabs)',
    responsibilities: [
      'Manage corporate fleet inventory: Sedans, SUVs, Prime EVs, and Auto Rickshaws.',
      'Assign company-employed drivers to active vehicle shifts and track shift handovers.',
      'Monitor vehicle maintenance schedules, odometer logs, and insurance renewal dates.',
      'Track aggregated fleet gross revenues, driver commission shares, and fuel expense margins.'
    ],
    permittedActions: [
      'Register new commercial vehicles and link contracted driver profiles to specific cabs.',
      'View real-time telematics and live tracking for all vehicles owned within their fleet.',
      'Download aggregate fleet earnings statements, daily trip summaries, and payout receipts.',
      'Schedule routine maintenance downtime and mark vehicles temporarily out-of-service.'
    ],
    restrictedActions: [
      'Cannot view or interact with vehicles, drivers, or earnings belonging to competitor fleets.',
      'Cannot alter global platform pricing, commission terms, or core database records.',
      'Cannot access customer full personal profiles or private payment methods.'
    ],
    primaryTools: [
      { name: 'Fleet Asset Manager', tabKey: 'fleets', icon: 'Truck', desc: 'Manage owned vehicles, maintenance & driver shifts' },
      { name: 'Fleet Drivers Roster', tabKey: 'drivers', icon: 'Users', desc: 'Contracted drivers linked to vendor fleet' },
      { name: 'Fleet Revenue Share', tabKey: 'revenue', icon: 'IndianRupee', desc: 'Consolidated vendor gross earnings & payouts' }
    ],
    kpis: [
      { metric: 'Fleet Utilization Rate', target: '> 88%', period: 'Weekly' },
      { metric: 'Vehicle Uptime', target: '> 96%', period: 'Monthly' },
      { metric: 'Driver Shift Compliance', target: '> 95%', period: 'Daily' }
    ],
    sopWorkflow: [
      'Check daily morning fleet readiness: vehicle battery/fuel levels and driver check-ins.',
      'Assign incoming replacement drivers to cabs undergoing shift rotation.',
      'Review pending vehicle fitness and insurance renewals expiring within 30 days.',
      'Audit daily gross earnings and reconcile driver daily cash collections.'
    ]
  },
  {
    id: 'Marketing & Growth',
    name: 'Marketing & Growth',
    category: 'Fleet & Growth',
    tagline: 'Coupons, referral campaigns, banners, SEO & translations',
    description: 'Creates marketing coupons, referral milestone rewards, top banners, promotional marquees, landing page content, and SEO metadata.',
    badgeBg: 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400',
    badgeText: 'text-fuchsia-700 dark:text-fuchsia-400',
    badgeBorder: 'border-fuchsia-200 dark:border-fuchsia-800',
    iconName: 'Sparkles',
    defaultHub: 'Growth & Acquisition Desk',
    responsibilities: [
      'Design and deploy promo coupon codes (percentage discount, flat off, ride passes).',
      'Configure viral referral programs (e.g. ₹100 for inviting a friend after first ride).',
      'Manage promotional marketing banners, app marquees, and announcements.',
      'Maintain public landing page copy, SEO metadata, and multilingual app translations.'
    ],
    permittedActions: [
      'Create, activate, and deactivate coupon codes with budget and usage limits.',
      'Configure referral reward milestone rules for both riders and newly onboarded drivers.',
      'Publish landing page hero copy, feature highlights, and app download banners.',
      'Manage multi-language translation strings and localized marketing assets.'
    ],
    restrictedActions: [
      'Cannot execute direct bank withdrawals or modify financial treasury accounts.',
      'Cannot access raw database queries, user passwords, or developer API tokens.',
      'Cannot override live ride dispatching or safety emergency workflows.'
    ],
    primaryTools: [
      { name: 'Promotions & Coupons', tabKey: 'promotions', icon: 'Sparkles', desc: 'Promo codes, referral schemes & discounts' },
      { name: 'Marketing Banners', tabKey: 'banners', icon: 'Image', desc: 'App marquee banners & seasonal promotions' },
      { name: 'Landing Page & SEO', tabKey: 'landing_cms', icon: 'Globe', desc: 'Public website CMS & meta tags' }
    ],
    kpis: [
      { metric: 'CAC (Customer Acquisition)', target: '< ₹85', period: 'Blended' },
      { metric: 'Coupon Redemption ROI', target: '> 3.5x', period: 'Per Campaign' },
      { metric: 'Referral Conversion Rate', target: '> 28%', period: 'Monthly' }
    ],
    sopWorkflow: [
      'Review active promo coupon redemption velocity and budget burn rates.',
      'Launch seasonal weekend discount campaigns with geofenced push notification banners.',
      'Track referral link signups and verify first-ride completion conversions.',
      'A/B test landing page hero headline variations to improve app store install rates.'
    ]
  },
  {
    id: 'Admin',
    name: 'Admin',
    category: 'Operations',
    tagline: 'General operations & regional management',
    description: 'Standard operational administrator role with broad access across trips, riders, drivers, and communications.',
    badgeBg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
    badgeText: 'text-slate-700 dark:text-slate-400',
    badgeBorder: 'border-slate-200 dark:border-slate-800',
    iconName: 'Users',
    defaultHub: 'Delhi NCR Hub',
    responsibilities: [
      'Supervise regional operations across rider accounts, drivers, and daily rides.',
      'Coordinate between Dispatch, Support, and KYC teams for escalated issues.',
      'Oversee general platform health and verify shift handover logs.',
      'Ensure standard operational service levels are met across the regional hub.'
    ],
    permittedActions: [
      'Broad access across trips, customer accounts, driver registry, and communications.',
      'Approve routine operator requests and update operational notes.',
      'View all operational dashboards, dispatch monitors, and customer feedback.',
      'Export operational activity reports for management review.'
    ],
    restrictedActions: [
      'Cannot modify developer cloud configs, raw database schemas, or API master keys.',
      'Cannot alter core system financial commission architecture without Super Admin sign-off.'
    ],
    primaryTools: [
      { name: 'Operations Overview', tabKey: 'dashboard', icon: 'Activity', desc: 'Regional operations KPI dashboard' },
      { name: 'Trips Monitor', tabKey: 'rides', icon: 'Navigation', desc: 'Regional trip execution & monitoring' },
      { name: 'Driver Fleet', tabKey: 'drivers', icon: 'Car', desc: 'Regional driver roster & availability' }
    ],
    kpis: [
      { metric: 'Regional Service SLA', target: '> 96%', period: 'Monthly' },
      { metric: 'Escalation Resolution', target: '< 2 hrs', period: 'Daily' },
      { metric: 'Driver Retention', target: '> 91%', period: 'Quarterly' }
    ],
    sopWorkflow: [
      'Review daily regional operational dashboard metrics and team shifts.',
      'Conduct midday sync with dispatchers to address any localized vehicle shortages.',
      'Review escalated customer or driver cases with support leads.',
      'Submit end-of-day operational summary report to platform management.'
    ]
  }
];

export interface StaffUserProfile {
  id: string;
  name: string;
  role: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  hub: string;
  avatar?: string;
  active: boolean;
  createdAt: string;
  lastLogin?: string;
}

export const DEFAULT_STAFF_PROFILES: StaffUserProfile[] = [
  {
    id: 'usr-1',
    name: 'Rahul Sharma',
    role: 'Super Admin',
    username: 'super_admin',
    password: 'password123',
    email: 'rahul.sharma@taxicluster.com',
    phone: '+91 98765 43210',
    hub: 'National Platform (All Hubs)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    active: true,
    createdAt: '2025-01-15'
  },
  {
    id: 'usr-2',
    name: 'Rajesh Rao',
    role: 'City Ops & Dispatcher',
    username: 'dispatcher_raj',
    password: 'dispatch123',
    email: 'rajesh.rao@taxicluster.com',
    phone: '+91 98200 11223',
    hub: 'Mumbai Central Hub',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    active: true,
    createdAt: '2025-02-10'
  },
  {
    id: 'usr-3',
    name: 'Neha Gupta',
    role: 'KYC & Verification Officer',
    username: 'kyc_neha',
    password: 'kyc123',
    email: 'neha.gupta@taxicluster.com',
    phone: '+91 98111 55667',
    hub: 'National Verification Desk',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    active: true,
    createdAt: '2025-03-01'
  },
  {
    id: 'usr-4',
    name: 'Vikram Malhotra',
    role: 'Safety & SOS Officer',
    username: 'safety_vikram',
    password: 'safety123',
    email: 'vikram.m@taxicluster.com',
    phone: '+91 96666 55555',
    hub: '24/7 Safety Command Center',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    active: true,
    createdAt: '2025-03-15'
  },
  {
    id: 'usr-5',
    name: 'Sanya Sen',
    role: 'Customer Support',
    username: 'support_sanya',
    password: 'support123',
    email: 'sanya.sen@taxicluster.com',
    phone: '+91 97777 66666',
    hub: 'Central Customer Helpdesk',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    active: true,
    createdAt: '2025-04-12'
  },
  {
    id: 'usr-6',
    name: 'Priya Patel',
    role: 'Finance & Accounts',
    username: 'finance_priya',
    password: 'finance123',
    email: 'priya.patel@taxicluster.com',
    phone: '+91 99123 45678',
    hub: 'Treasury & Revenue Division',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=200',
    active: true,
    createdAt: '2025-05-01'
  },
  {
    id: 'usr-7',
    name: 'Harpreet Singh',
    role: 'Fleet Vendor',
    username: 'fleet_singh',
    password: 'fleet123',
    email: 'harpreet.singh@starcabs.com',
    phone: '+91 98450 77889',
    hub: 'Star Cabs Fleet Hub (35 Cabs)',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    active: true,
    createdAt: '2025-05-20'
  },
  {
    id: 'usr-8',
    name: 'Kavita Reddy',
    role: 'Marketing & Growth',
    username: 'growth_kavita',
    password: 'growth123',
    email: 'kavita.reddy@taxicluster.com',
    phone: '+91 98200 44556',
    hub: 'Growth & Acquisition Desk',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    active: true,
    createdAt: '2025-06-10'
  }
];

export const DEFAULT_PERMISSION_MATRIX: Record<string, Record<string, string>> = {
  'Dashboard & Analytics': {
    'Super Admin': 'Full',
    'City Ops & Dispatcher': 'City-only',
    'KYC & Verification Officer': 'View',
    'Safety & SOS Officer': 'View',
    'Customer Support': 'View',
    'Finance & Accounts': 'Full',
    'Fleet Vendor': 'City-only',
    'Marketing & Growth': 'View',
    'Admin': 'Full'
  },
  'Riders Accounts': {
    'Super Admin': 'Full',
    'City Ops & Dispatcher': 'City-only',
    'KYC & Verification Officer': 'View',
    'Safety & SOS Officer': 'View',
    'Customer Support': 'View/Approve',
    'Finance & Accounts': 'No',
    'Fleet Vendor': 'No',
    'Marketing & Growth': 'View',
    'Admin': 'Full'
  },
  'Drivers Fleet Registry': {
    'Super Admin': 'Full',
    'City Ops & Dispatcher': 'Full',
    'KYC & Verification Officer': 'View/Approve',
    'Safety & SOS Officer': 'View',
    'Customer Support': 'View',
    'Finance & Accounts': 'View',
    'Fleet Vendor': 'City-only',
    'Marketing & Growth': 'No',
    'Admin': 'Full'
  },
  'Rides & Trips Dispatch': {
    'Super Admin': 'Full',
    'City Ops & Dispatcher': 'Full',
    'KYC & Verification Officer': 'View',
    'Safety & SOS Officer': 'Monitor',
    'Customer Support': 'View',
    'Finance & Accounts': 'View',
    'Fleet Vendor': 'City-only',
    'Marketing & Growth': 'No',
    'Admin': 'Full'
  },
  'KYC Verification Checks': {
    'Super Admin': 'Full',
    'City Ops & Dispatcher': 'View',
    'KYC & Verification Officer': 'Full',
    'Safety & SOS Officer': 'View',
    'Customer Support': 'View',
    'Finance & Accounts': 'No',
    'Fleet Vendor': 'City-only',
    'Marketing & Growth': 'No',
    'Admin': 'Full'
  },
  'Safety & SOS Emergency Desk': {
    'Super Admin': 'Full',
    'City Ops & Dispatcher': 'View',
    'KYC & Verification Officer': 'No',
    'Safety & SOS Officer': 'Full',
    'Customer Support': 'View/Approve',
    'Finance & Accounts': 'No',
    'Fleet Vendor': 'No',
    'Marketing & Growth': 'No',
    'Admin': 'Full'
  },
  'In-Trip & Support Chats': {
    'Super Admin': 'Full',
    'City Ops & Dispatcher': 'View',
    'KYC & Verification Officer': 'No',
    'Safety & SOS Officer': 'Full',
    'Customer Support': 'Full',
    'Finance & Accounts': 'No',
    'Fleet Vendor': 'No',
    'Marketing & Growth': 'No',
    'Admin': 'Full'
  },
  'Revenue & Price Control': {
    'Super Admin': 'Full',
    'City Ops & Dispatcher': 'No',
    'KYC & Verification Officer': 'No',
    'Safety & SOS Officer': 'No',
    'Customer Support': 'No',
    'Finance & Accounts': 'Full',
    'Fleet Vendor': 'City-only',
    'Marketing & Growth': 'View',
    'Admin': 'View'
  },
  'Vehicle Fleet Assets': {
    'Super Admin': 'Full',
    'City Ops & Dispatcher': 'City-only',
    'KYC & Verification Officer': 'View/Approve',
    'Safety & SOS Officer': 'View',
    'Customer Support': 'View',
    'Finance & Accounts': 'View',
    'Fleet Vendor': 'Full',
    'Marketing & Growth': 'No',
    'Admin': 'Full'
  },
  'Support Tickets & Helpdesk': {
    'Super Admin': 'Full',
    'City Ops & Dispatcher': 'View',
    'KYC & Verification Officer': 'No',
    'Safety & SOS Officer': 'View',
    'Customer Support': 'Full',
    'Finance & Accounts': 'View',
    'Fleet Vendor': 'No',
    'Marketing & Growth': 'No',
    'Admin': 'Full'
  },
  'Commuter Reviews & Ratings': {
    'Super Admin': 'Full',
    'City Ops & Dispatcher': 'View',
    'KYC & Verification Officer': 'No',
    'Safety & SOS Officer': 'View',
    'Customer Support': 'Full',
    'Finance & Accounts': 'No',
    'Fleet Vendor': 'View',
    'Marketing & Growth': 'View',
    'Admin': 'Full'
  },
  'Promo Coupons & Subscriptions': {
    'Super Admin': 'Full',
    'City Ops & Dispatcher': 'No',
    'KYC & Verification Officer': 'No',
    'Safety & SOS Officer': 'No',
    'Customer Support': 'View',
    'Finance & Accounts': 'Full',
    'Fleet Vendor': 'No',
    'Marketing & Growth': 'Full',
    'Admin': 'Full'
  },
  'Referral & Invite System': {
    'Super Admin': 'Full',
    'City Ops & Dispatcher': 'No',
    'KYC & Verification Officer': 'No',
    'Safety & SOS Officer': 'No',
    'Customer Support': 'View',
    'Finance & Accounts': 'View',
    'Fleet Vendor': 'No',
    'Marketing & Growth': 'Full',
    'Admin': 'Full'
  },
  'Marketing Banners & Marquee': {
    'Super Admin': 'Full',
    'City Ops & Dispatcher': 'No',
    'KYC & Verification Officer': 'No',
    'Safety & SOS Officer': 'No',
    'Customer Support': 'No',
    'Finance & Accounts': 'No',
    'Fleet Vendor': 'No',
    'Marketing & Growth': 'Full',
    'Admin': 'Full'
  },
  'Landing Page & SEO': {
    'Super Admin': 'Full',
    'City Ops & Dispatcher': 'No',
    'KYC & Verification Officer': 'No',
    'Safety & SOS Officer': 'No',
    'Customer Support': 'No',
    'Finance & Accounts': 'No',
    'Fleet Vendor': 'No',
    'Marketing & Growth': 'Full',
    'Admin': 'Full'
  },
  'Languages & Translations': {
    'Super Admin': 'Full',
    'City Ops & Dispatcher': 'No',
    'KYC & Verification Officer': 'No',
    'Safety & SOS Officer': 'No',
    'Customer Support': 'View',
    'Finance & Accounts': 'No',
    'Fleet Vendor': 'No',
    'Marketing & Growth': 'Full',
    'Admin': 'Full'
  },
  'Database & System Logs': {
    'Super Admin': 'Full',
    'City Ops & Dispatcher': 'No',
    'KYC & Verification Officer': 'No',
    'Safety & SOS Officer': 'No',
    'Customer Support': 'No',
    'Finance & Accounts': 'No',
    'Fleet Vendor': 'No',
    'Marketing & Growth': 'No',
    'Admin': 'No'
  },
  'Platform Feature Control': {
    'Super Admin': 'Full',
    'City Ops & Dispatcher': 'No',
    'KYC & Verification Officer': 'No',
    'Safety & SOS Officer': 'No',
    'Customer Support': 'No',
    'Finance & Accounts': 'No',
    'Fleet Vendor': 'No',
    'Marketing & Growth': 'No',
    'Admin': 'No'
  }
};

export interface ModuleDefinition {
  id: string;
  name: string;
  category: 'Core Operations' | 'Trust & Safety' | 'Finance & Plans' | 'Marketing & Content' | 'System & Settings';
  icon: string;
  description: string;
  tabKeys: string[];
}

export const PLATFORM_MODULES: ModuleDefinition[] = [
  {
    id: 'dashboard',
    name: 'Dashboard & Analytics',
    category: 'Core Operations',
    icon: 'LayoutDashboard',
    description: 'System-wide telemetry, live revenue graphs, and operational metrics.',
    tabKeys: ['dashboard', 'analytics']
  },
  {
    id: 'riders',
    name: 'Riders Accounts',
    category: 'Core Operations',
    icon: 'Users',
    description: 'Passenger profiles, trip histories, commuter wallets, and account statuses.',
    tabKeys: ['riders']
  },
  {
    id: 'drivers',
    name: 'Drivers Fleet Registry',
    category: 'Core Operations',
    icon: 'Car',
    description: 'Driver profiles, duty states, assigned vehicles, and performance records.',
    tabKeys: ['drivers']
  },
  {
    id: 'rides',
    name: 'Rides & Trips Dispatch',
    category: 'Core Operations',
    icon: 'Navigation',
    description: 'Live trip execution radar, manual ride assignment, and active journey tracking.',
    tabKeys: ['rides', 'trips']
  },
  {
    id: 'verification',
    name: 'KYC Verification Checks',
    category: 'Trust & Safety',
    icon: 'ShieldCheck',
    description: 'Driver license, RC, insurance, background check audits, and onboarding approval.',
    tabKeys: ['verification']
  },
  {
    id: 'sos',
    name: 'Safety & SOS Emergency Desk',
    category: 'Trust & Safety',
    icon: 'AlertTriangle',
    description: '24/7 passenger/driver emergency panic triggers and route deviation alerts.',
    tabKeys: ['sos', 'sos_alerts']
  },
  {
    id: 'chats',
    name: 'In-Trip & Support Chats',
    category: 'Trust & Safety',
    icon: 'MessageSquare',
    description: 'Live messaging audits between riders, drivers, and support operators.',
    tabKeys: ['trip_chats', 'chats', 'support_chat']
  },
  {
    id: 'revenue',
    name: 'Revenue & Price Control',
    category: 'Finance & Plans',
    icon: 'IndianRupee',
    description: 'Base pricing, surge multipliers, commissions, driver payouts, and tax ledgers.',
    tabKeys: ['revenue', 'price_control', 'wallet', 'driver_earnings']
  },
  {
    id: 'fleets',
    name: 'Vehicle Fleet Assets',
    category: 'Core Operations',
    icon: 'Truck',
    description: 'Commercial vehicle inventory, maintenance schedules, and transporter fleets.',
    tabKeys: ['fleets', 'vehicles']
  },
  {
    id: 'subscriptions',
    name: 'Plans & Subscribers',
    category: 'Finance & Plans',
    icon: 'Crown',
    description: 'Driver subscription plans, recurring passes, and active subscriber rosters.',
    tabKeys: ['subscriptions', 'subscribers']
  },
  {
    id: 'support_ticket',
    name: 'Support Tickets & Helpdesk',
    category: 'Trust & Safety',
    icon: 'Headphones',
    description: 'Omnichannel customer and driver support ticket queues and resolution SLAs.',
    tabKeys: ['support_ticket', 'tickets', 'knowledge_bases', 'faqs']
  },
  {
    id: 'reviews',
    name: 'Commuter Reviews & Ratings',
    category: 'Trust & Safety',
    icon: 'Star',
    description: 'Passenger feedback, driver rating moderation, and service quality logs.',
    tabKeys: ['reviews']
  },
  {
    id: 'promotions',
    name: 'Promo Coupons & Subscriptions',
    category: 'Marketing & Content',
    icon: 'Tag',
    description: 'Discount codes, promotional campaigns, ride passes, and marketing budgets.',
    tabKeys: ['promotions', 'coupons']
  },
  {
    id: 'refer_invite',
    name: 'Referral & Invite System',
    category: 'Marketing & Content',
    icon: 'UserPlus',
    description: 'Viral referral milestone rules, invite links, and commission rewards.',
    tabKeys: ['refer_invite']
  },
  {
    id: 'banners',
    name: 'Marketing Banners & Marquee',
    category: 'Marketing & Content',
    icon: 'ImageIcon',
    description: 'In-app promotional banners, top marquee messages, and ad networks.',
    tabKeys: ['banners', 'marquee', 'ads_networks', 'events', 'push_notifications', 'notify_templates', 'onboardings', 'pwa']
  },
  {
    id: 'landing_page',
    name: 'Landing Page & SEO',
    category: 'Marketing & Content',
    icon: 'Globe',
    description: 'Public web portal CMS, SEO meta tags, blogs, and marketing pages.',
    tabKeys: ['landing_page', 'seo_dashboard', 'blogs', 'pages', 'media']
  },
  {
    id: 'languages_translations',
    name: 'Languages & Translations',
    category: 'Marketing & Content',
    icon: 'Languages',
    description: 'Multi-lingual localization keys, dialect overrides, and regional terms.',
    tabKeys: ['languages_translations']
  },
  {
    id: 'database',
    name: 'Database & System Logs',
    category: 'System & Settings',
    icon: 'Database',
    description: 'Direct database console, cluster backups, real-time error logs, and telemetry.',
    tabKeys: ['database', 'system_tools', 'errors_log', 'vps_suite', 'app_flows', 'id_schema']
  },
  {
    id: 'features',
    name: 'Platform Feature Control',
    category: 'System & Settings',
    icon: 'Settings',
    description: 'Microservice toggles, RBAC matrix, map providers, and mail keys.',
    tabKeys: ['features', 'user_types', 'general_settings', 'maps_settings', 'mail_settings', 'login_settings', 'services', 'style_guide']
  }
];

export const TAB_TO_MODULE_MAP: Record<string, string> = {
  dashboard: 'Dashboard & Analytics',
  analytics: 'Dashboard & Analytics',
  riders: 'Riders Accounts',
  drivers: 'Drivers Fleet Registry',
  rides: 'Rides & Trips Dispatch',
  trips: 'Rides & Trips Dispatch',
  verification: 'KYC Verification Checks',
  sos: 'Safety & SOS Emergency Desk',
  sos_alerts: 'Safety & SOS Emergency Desk',
  trip_chats: 'In-Trip & Support Chats',
  chats: 'In-Trip & Support Chats',
  support_chat: 'In-Trip & Support Chats',
  revenue: 'Revenue & Price Control',
  price_control: 'Revenue & Price Control',
  wallet: 'Revenue & Price Control',
  driver_earnings: 'Revenue & Price Control',
  fleets: 'Vehicle Fleet Assets',
  vehicles: 'Vehicle Fleet Assets',
  subscriptions: 'Promo Coupons & Subscriptions',
  subscribers: 'Promo Coupons & Subscriptions',
  support_ticket: 'Support Tickets & Helpdesk',
  tickets: 'Support Tickets & Helpdesk',
  knowledge_bases: 'Support Tickets & Helpdesk',
  faqs: 'Support Tickets & Helpdesk',
  reviews: 'Commuter Reviews & Ratings',
  promotions: 'Promo Coupons & Subscriptions',
  coupons: 'Promo Coupons & Subscriptions',
  refer_invite: 'Referral & Invite System',
  banners: 'Marketing Banners & Marquee',
  marquee: 'Marketing Banners & Marquee',
  ads_networks: 'Marketing Banners & Marquee',
  events: 'Marketing Banners & Marquee',
  push_notifications: 'Marketing Banners & Marquee',
  notify_templates: 'Marketing Banners & Marquee',
  onboardings: 'Marketing Banners & Marquee',
  pwa: 'Marketing Banners & Marquee',
  landing_page: 'Landing Page & SEO',
  seo_dashboard: 'Landing Page & SEO',
  blogs: 'Landing Page & SEO',
  pages: 'Landing Page & SEO',
  media: 'Landing Page & SEO',
  languages_translations: 'Languages & Translations',
  database: 'Database & System Logs',
  system_tools: 'Database & System Logs',
  errors_log: 'Database & System Logs',
  vps_suite: 'Database & System Logs',
  github_sync: 'Database & System Logs',
  app_flows: 'Database & System Logs',
  installation: 'Database & System Logs',
  vps_preview: 'Database & System Logs',
  id_schema: 'Database & System Logs',
  services: 'Platform Feature Control',
  features: 'Platform Feature Control',
  user_types: 'Platform Feature Control',
  general_settings: 'Platform Feature Control',
  maps_settings: 'Platform Feature Control',
  mail_settings: 'Platform Feature Control',
  login_settings: 'Platform Feature Control',
  style_guide: 'Platform Feature Control'
};

export const CLEARANCE_LEVELS = [
  { key: 'Full', label: 'Full Access', color: 'bg-slate-900 text-white border-slate-900', desc: 'Unrestricted create, edit, delete, and control privileges' },
  { key: 'City-only', label: 'City Hub Scoped', color: 'bg-blue-100 text-blue-800 border-blue-300', desc: 'Restricted strictly to the operator\'s assigned regional hub' },
  { key: 'View/Approve', label: 'View & Approve', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', desc: 'Can view records and approve/reject pending queue submissions' },
  { key: 'Monitor', label: 'Real-time Monitor', color: 'bg-indigo-100 text-indigo-800 border-indigo-300', desc: 'Live telematics streaming and radar tracking only' },
  { key: 'View', label: 'View Only (Read)', color: 'bg-slate-100 text-slate-700 border-slate-300', desc: 'Read-only inspection access without alteration rights' },
  { key: 'No', label: 'No Access', color: 'bg-rose-50 text-rose-700 border-rose-200', desc: 'Completely hidden and access restricted for this role' }
];

export const ROLE_PRESETS: Record<string, { label: string; description: string; icon: string; clearances: Record<string, string> }> = {
  'full_sovereign': {
    label: 'Full Platform Sovereignty',
    description: 'Unrestricted master root clearance across all modules and settings.',
    icon: 'Crown',
    clearances: {
      'Dashboard & Analytics': 'Full',
      'Riders Accounts': 'Full',
      'Drivers Fleet Registry': 'Full',
      'Rides & Trips Dispatch': 'Full',
      'KYC Verification Checks': 'Full',
      'Safety & SOS Emergency Desk': 'Full',
      'In-Trip & Support Chats': 'Full',
      'Revenue & Price Control': 'Full',
      'Vehicle Fleet Assets': 'Full',
      'Support Tickets & Helpdesk': 'Full',
      'Commuter Reviews & Ratings': 'Full',
      'Promo Coupons & Subscriptions': 'Full',
      'Referral & Invite System': 'Full',
      'Marketing Banners & Marquee': 'Full',
      'Landing Page & SEO': 'Full',
      'Languages & Translations': 'Full',
      'Database & System Logs': 'Full',
      'Platform Feature Control': 'Full'
    }
  },
  'operations_dispatcher': {
    label: 'Operations & City Dispatch',
    description: 'Live trip dispatch, driver fleet tracking, and city hub management.',
    icon: 'Navigation',
    clearances: {
      'Dashboard & Analytics': 'City-only',
      'Riders Accounts': 'City-only',
      'Drivers Fleet Registry': 'Full',
      'Rides & Trips Dispatch': 'Full',
      'KYC Verification Checks': 'View',
      'Safety & SOS Emergency Desk': 'View',
      'In-Trip & Support Chats': 'View',
      'Revenue & Price Control': 'No',
      'Vehicle Fleet Assets': 'City-only',
      'Support Tickets & Helpdesk': 'View',
      'Commuter Reviews & Ratings': 'View',
      'Promo Coupons & Subscriptions': 'No',
      'Referral & Invite System': 'No',
      'Marketing Banners & Marquee': 'No',
      'Landing Page & SEO': 'No',
      'Languages & Translations': 'No',
      'Database & System Logs': 'No',
      'Platform Feature Control': 'No'
    }
  },
  'trust_kyc_safety': {
    label: 'Trust, KYC & Safety Desk',
    description: 'Driver document verification, safety alerts, and panic incident response.',
    icon: 'ShieldCheck',
    clearances: {
      'Dashboard & Analytics': 'View',
      'Riders Accounts': 'View',
      'Drivers Fleet Registry': 'View/Approve',
      'Rides & Trips Dispatch': 'Monitor',
      'KYC Verification Checks': 'Full',
      'Safety & SOS Emergency Desk': 'Full',
      'In-Trip & Support Chats': 'Full',
      'Revenue & Price Control': 'No',
      'Vehicle Fleet Assets': 'View/Approve',
      'Support Tickets & Helpdesk': 'View',
      'Commuter Reviews & Ratings': 'View',
      'Promo Coupons & Subscriptions': 'No',
      'Referral & Invite System': 'No',
      'Marketing Banners & Marquee': 'No',
      'Landing Page & SEO': 'No',
      'Languages & Translations': 'No',
      'Database & System Logs': 'No',
      'Platform Feature Control': 'No'
    }
  },
  'customer_support_care': {
    label: 'Customer Support & Helpdesk',
    description: 'Ticket queues, commuter chats, lost items, and rating moderation.',
    icon: 'Headphones',
    clearances: {
      'Dashboard & Analytics': 'View',
      'Riders Accounts': 'View/Approve',
      'Drivers Fleet Registry': 'View',
      'Rides & Trips Dispatch': 'View',
      'KYC Verification Checks': 'No',
      'Safety & SOS Emergency Desk': 'View/Approve',
      'In-Trip & Support Chats': 'Full',
      'Revenue & Price Control': 'No',
      'Vehicle Fleet Assets': 'View',
      'Support Tickets & Helpdesk': 'Full',
      'Commuter Reviews & Ratings': 'Full',
      'Promo Coupons & Subscriptions': 'View',
      'Referral & Invite System': 'View',
      'Marketing Banners & Marquee': 'No',
      'Landing Page & SEO': 'No',
      'Languages & Translations': 'View',
      'Database & System Logs': 'No',
      'Platform Feature Control': 'No'
    }
  },
  'finance_accounting': {
    label: 'Finance, Payouts & Tariffs',
    description: 'Tariffs, surge pricing yield, driver wallet payouts, and tax compliance.',
    icon: 'IndianRupee',
    clearances: {
      'Dashboard & Analytics': 'Full',
      'Riders Accounts': 'No',
      'Drivers Fleet Registry': 'View',
      'Rides & Trips Dispatch': 'View',
      'KYC Verification Checks': 'No',
      'Safety & SOS Emergency Desk': 'No',
      'In-Trip & Support Chats': 'No',
      'Revenue & Price Control': 'Full',
      'Vehicle Fleet Assets': 'View',
      'Support Tickets & Helpdesk': 'View',
      'Commuter Reviews & Ratings': 'No',
      'Promo Coupons & Subscriptions': 'Full',
      'Referral & Invite System': 'View',
      'Marketing Banners & Marquee': 'No',
      'Landing Page & SEO': 'No',
      'Languages & Translations': 'No',
      'Database & System Logs': 'No',
      'Platform Feature Control': 'No'
    }
  },
  'marketing_growth': {
    label: 'Marketing, Growth & CMS',
    description: 'Coupons, referrals, banners, SEO metadata, landing page, and languages.',
    icon: 'Sparkles',
    clearances: {
      'Dashboard & Analytics': 'View',
      'Riders Accounts': 'View',
      'Drivers Fleet Registry': 'No',
      'Rides & Trips Dispatch': 'No',
      'KYC Verification Checks': 'No',
      'Safety & SOS Emergency Desk': 'No',
      'In-Trip & Support Chats': 'No',
      'Revenue & Price Control': 'View',
      'Vehicle Fleet Assets': 'No',
      'Support Tickets & Helpdesk': 'No',
      'Commuter Reviews & Ratings': 'View',
      'Promo Coupons & Subscriptions': 'Full',
      'Referral & Invite System': 'Full',
      'Marketing Banners & Marquee': 'Full',
      'Landing Page & SEO': 'Full',
      'Languages & Translations': 'Full',
      'Database & System Logs': 'No',
      'Platform Feature Control': 'No'
    }
  },
  'read_only_auditor': {
    label: 'Read-Only Auditor / Observer',
    description: 'Full inspection visibility across operational records without modification.',
    icon: 'Eye',
    clearances: {
      'Dashboard & Analytics': 'View',
      'Riders Accounts': 'View',
      'Drivers Fleet Registry': 'View',
      'Rides & Trips Dispatch': 'View',
      'KYC Verification Checks': 'View',
      'Safety & SOS Emergency Desk': 'View',
      'In-Trip & Support Chats': 'View',
      'Revenue & Price Control': 'View',
      'Vehicle Fleet Assets': 'View',
      'Support Tickets & Helpdesk': 'View',
      'Commuter Reviews & Ratings': 'View',
      'Promo Coupons & Subscriptions': 'View',
      'Referral & Invite System': 'View',
      'Marketing Banners & Marquee': 'View',
      'Landing Page & SEO': 'View',
      'Languages & Translations': 'View',
      'Database & System Logs': 'No',
      'Platform Feature Control': 'No'
    }
  },
  'custom_blank': {
    label: 'Minimal / Custom Role',
    description: 'Start with clean slate and explicitly toggle required module permissions.',
    icon: 'Sliders',
    clearances: {
      'Dashboard & Analytics': 'View',
      'Riders Accounts': 'No',
      'Drivers Fleet Registry': 'No',
      'Rides & Trips Dispatch': 'No',
      'KYC Verification Checks': 'No',
      'Safety & SOS Emergency Desk': 'No',
      'In-Trip & Support Chats': 'No',
      'Revenue & Price Control': 'No',
      'Vehicle Fleet Assets': 'No',
      'Support Tickets & Helpdesk': 'No',
      'Commuter Reviews & Ratings': 'No',
      'Promo Coupons & Subscriptions': 'No',
      'Referral & Invite System': 'No',
      'Marketing Banners & Marquee': 'No',
      'Landing Page & SEO': 'No',
      'Languages & Translations': 'No',
      'Database & System Logs': 'No',
      'Platform Feature Control': 'No'
    }
  }
};

export const getRoleClearanceForTab = (
  tabId: string, 
  role: string, 
  matrix: Record<string, Record<string, string>>
): string => {
  if (role === 'Super Admin') return 'Full';
  const moduleName = TAB_TO_MODULE_MAP[tabId];
  if (!moduleName) return 'Full';
  const clearance = matrix[moduleName]?.[role];
  if (clearance !== undefined) return clearance;
  return 'No';
};

export const isTabAllowedForRole = (
  tabId: string, 
  role: string, 
  matrix: Record<string, Record<string, string>>
): boolean => {
  if (role === 'Super Admin') return true;
  const clearance = getRoleClearanceForTab(tabId, role, matrix);
  return clearance !== 'No';
};

export const getInitialTabForRole = (
  role: string, 
  matrix: Record<string, Record<string, string>>
): string => {
  if (role === 'Super Admin') return 'dashboard';
  
  // Specific role logical default landing tabs
  if (role === 'KYC & Verification Officer' && isTabAllowedForRole('verification', role, matrix)) return 'verification';
  if (role === 'Safety & SOS Officer' && isTabAllowedForRole('sos_alerts', role, matrix)) return 'sos_alerts';
  if (role === 'City Ops & Dispatcher' && isTabAllowedForRole('rides', role, matrix)) return 'rides';
  if (role === 'Customer Support' && isTabAllowedForRole('support_ticket', role, matrix)) return 'support_ticket';
  if (role === 'Finance & Accounts' && isTabAllowedForRole('revenue', role, matrix)) return 'revenue';
  if (role === 'Fleet Vendor' && isTabAllowedForRole('fleets', role, matrix)) return 'fleets';
  if (role === 'Marketing & Growth' && isTabAllowedForRole('promotions', role, matrix)) return 'promotions';

  // Check if dashboard is allowed
  if (isTabAllowedForRole('dashboard', role, matrix)) return 'dashboard';

  // Otherwise find the first allowed module from platform modules
  for (const mod of PLATFORM_MODULES) {
    for (const tabKey of mod.tabKeys) {
      if (isTabAllowedForRole(tabKey, role, matrix)) return tabKey;
    }
  }

  return 'dashboard';
};

