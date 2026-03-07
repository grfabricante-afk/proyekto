export type VAStatus = 'unplaced' | 'placed';
export type ProgramStep = 'entry' | 'baseline' | 'assessment' | 'assignment' | 'upskilling' | 'application' | 'vetting' | 'certification' | 'placement' | 'kpi' | 'profile';

export interface Skill { name: string; description: string; }
export interface Module { id: string; title: string; duration: string; topics: string[]; }

export interface Track {
  id: string;
  name: string;
  pathway: 'Administrative' | 'Revenue Cycle' | 'Clinical' | 'Specialized';
  description: string;
  skills: Skill[];
  curriculum: Module[];
  assignmentCriteria: string;
}

export interface UserState {
  status: VAStatus | null;
  currentStep: ProgramStep;
  baselineRoles: { role: string; experience: string }[];
  baselineSkills: { skill: string; experience: string }[];
  baselineRole: string | null; // Keep for backward compatibility/simplicity if needed
  experienceLevel: string | null; // Keep for backward compatibility
  assessmentResults: Record<string, number> | null;
  averageScore: number | null;
  assignedTrack: Track | null;
  recommendedTrackId: string | null;
  completedModules: string[];
  completedTopics: string[];
}

export const BASELINE_ROLES = [
  'Medical Receptionist',
  'Medical Biller',
  'Medical Administrative Assistant',
  'Medical Coder',
  'Medical Scribe',
  'Health Educator',
  'Dental Biller',
  'Dental Receptionist',
  'General Virtual Assistant',
  'Other Professional'
];

export const BASELINE_SKILLS = [
  // Medical Receptionist
  'Patient Intake/Registration',
  'Appointment Scheduling',
  'Call Handling',
  'Insurance Verification',
  'Medical Records Management',
  'Payment Collection',
  'Referral Management',
  'Follow-up Calls',
  // Medical Biller
  'Claims Processing',
  'Claims Submission',
  'Denial Management',
  'Payment Posting',
  'Billing Inquiries',
  'Account Management',
  'Revenue Cycle Management',
  // Medical Admin Assistant
  'Front Office Coordination',
  'Billing Support',
  'Patient Correspondence',
  'Prior Authorization',
  'EA Support',
  // Medical Coder
  'Clinical Documentation Review',
  'ICD/CPT Coding',
  'Coding Accuracy Compliance',
  'Billing Collaboration',
  'Specialty & HCC Coding',
  'Provider CDI Training',
  'Code Update Monitoring',
  // Medical Scribe
  'Live Scribing',
  'Patient History Entry',
  'Transcribing',
  'Assessment & Plan Recording',
  'Order Entry Assistance',
  'EHR Template Management',
  'Clinical Alert Monitoring',
  'Pre/Post Charting',
  'Workflow Support',
  // Health Educator
  'Patient Education Support',
  'Educational Content Creation',
  'Follow-Up Communication',
  'Call/Message Handling',
  'Administrative Assistance',
  'Scheduling & Coordination',
  'Data Entry & Documentation',
  'Clinical Content Research & Validation',
  'Program Evaluation & Reporting',
  'Health Screening Tool Administration',
  // Dental Biller
  'Code Entry (CDT)',
  'Claim Tracking',
  'Patient Billing',
  'Record Keeping',
  'Code Updates',
  // Dental Receptionist
  'Front Desk (Virtual)',
  'Payment Processing',
  'Manage Treatment Estimates',
  'Record Management',
  'Team Coordination'
];

export const EXPERIENCE_LEVELS = [
  '< 1 Year',
  '1-2 Years',
  '3-5 Years',
  '5+ Years'
];

export const ASSESSMENT_QUESTIONS = [
  // Dental Billing Codes
  { id: 1, category: 'dental-billing', text: 'What is the CDT code for a periodic oral evaluation?', options: ['D0120', 'D0150', 'D1110', 'D0210'], correctAnswer: 'D0120', insight: 'D0120 is for established patients, while D0150 is for new patients.' },
  { id: 2, category: 'dental-billing', text: 'Which code is used for a comprehensive oral evaluation?', options: ['D0120', 'D0150', 'D0140', 'D0180'], correctAnswer: 'D0150', insight: 'Comprehensive evaluations (D0150) are typically done for new patients or those with significant changes.' },
  { id: 3, category: 'dental-billing', text: 'What does the code D1110 represent?', options: ['Prophylaxis - Child', 'Prophylaxis - Adult', 'Scaling and Root Planing', 'Fluoride Treatment'], correctAnswer: 'Prophylaxis - Adult', insight: 'D1110 is the standard code for an adult cleaning.' },
  { id: 4, category: 'dental-billing', text: 'Which code is used for a bitewing - single film?', options: ['D0270', 'D0272', 'D0274', 'D0210'], correctAnswer: 'D0270', insight: 'Bitewings are essential for detecting interproximal decay.' },
  { id: 5, category: 'dental-billing', text: 'What is the code for a resin-based composite - one surface, posterior?', options: ['D2330', 'D2391', 'D2392', 'D2140'], correctAnswer: 'D2391', insight: 'D2391 is a common restorative code in modern dentistry.' },
  { id: 6, category: 'dental-billing', text: 'Which code is used for a surgical removal of erupted tooth?', options: ['D7140', 'D7210', 'D7220', 'D7250'], correctAnswer: 'D7140', insight: 'D7140 is for simple extractions; D7210 involves bone removal or sectioning.' },
  { id: 7, category: 'dental-billing', text: 'What does D4341 represent?', options: ['Gingivitis treatment', 'Periodontal scaling and root planing - 4+ teeth', 'Localized delivery of antimicrobial agents', 'Full mouth debridement'], correctAnswer: 'Periodontal scaling and root planing - 4+ teeth', insight: 'D4341 is a deep cleaning code for patients with periodontal disease.' },
  { id: 8, category: 'dental-billing', text: 'Which code is used for a molar endodontic therapy?', options: ['D3310', 'D3320', 'D3330', 'D3348'], correctAnswer: 'D3330', insight: 'Molar root canals (D3330) are more complex due to multiple canals.' },
  { id: 9, category: 'dental-billing', text: 'What is the code for a porcelain fused to high noble metal crown?', options: ['D2740', 'D2750', 'D2790', 'D2950'], correctAnswer: 'D2750', insight: 'D2750 is a standard crown code for PFM restorations.' },
  { id: 10, category: 'dental-billing', text: 'Which code is used for a complete denture - maxillary?', options: ['D5110', 'D5120', 'D5211', 'D5213'], correctAnswer: 'D5110', insight: 'Maxillary (upper) and Mandibular (lower) dentures have distinct codes.' },

  // EHR Navigation
  { id: 11, category: 'ehr-navigation', text: 'Where would you typically find a patient\'s historical lab results in an EHR?', options: ['Billing tab', 'Results/Labs tab', 'Demographics', 'Insurance tab'], correctAnswer: 'Results/Labs tab', insight: 'Centralized lab results are key for clinical decision support.' },
  { id: 12, category: 'ehr-navigation', text: 'What is the purpose of a "SmartPhrase" or "Dot Phrase"?', options: ['To encrypt data', 'To quickly insert templated text', 'To bill insurance', 'To schedule appointments'], correctAnswer: 'To quickly insert templated text', insight: 'Dot phrases significantly reduce documentation time for common scenarios.' },
  { id: 13, category: 'ehr-navigation', text: 'How do you ensure a note is legally finalized in most EHRs?', options: ['Save as draft', 'Sign the note', 'Print to PDF', 'Email to provider'], correctAnswer: 'Sign the note', insight: 'Signing a note locks it for legal and billing purposes.' },
  { id: 14, category: 'ehr-navigation', text: 'Where do you document a patient\'s current medications?', options: ['Social History', 'Medication List/Reconciliation', 'Chief Complaint', 'Physical Exam'], correctAnswer: 'Medication List/Reconciliation', insight: 'Medication reconciliation is critical for preventing drug interactions.' },
  { id: 15, category: 'ehr-navigation', text: 'What is the "Chief Complaint" section used for?', options: ['Patient feedback', 'Primary reason for the visit', 'Insurance grievances', 'Billing errors'], correctAnswer: 'Primary reason for the visit', insight: 'The CC should be documented in the patient\'s own words.' },
  { id: 16, category: 'ehr-navigation', text: 'How do you track a referral\'s status in the EHR?', options: ['Check the calendar', 'Referral Management module', 'Call the specialist', 'Ask the patient'], correctAnswer: 'Referral Management module', insight: 'Referral tracking ensures continuity of care and prevents leakage.' },
  { id: 17, category: 'ehr-navigation', text: 'Where would you look to see if a prior authorization has been approved?', options: ['Vitals tab', 'Authorization/Insurance tab', 'Problem List', 'Allergies'], correctAnswer: 'Authorization/Insurance tab', insight: 'Always verify authorizations before high-cost procedures.' },
  { id: 18, category: 'ehr-navigation', text: 'What is the "Problem List" in an EHR?', options: ['List of software bugs', 'Active and past medical conditions', 'Patient complaints about staff', 'Unpaid balances'], correctAnswer: 'Active and past medical conditions', insight: 'The Problem List provides a snapshot of the patient\'s health status.' },
  { id: 19, category: 'ehr-navigation', text: 'How do you send a secure message to a provider within the EHR?', options: ['Standard email', 'In-basket/Messaging system', 'Text message', 'Fax'], correctAnswer: 'In-basket/Messaging system', insight: 'Internal EHR messaging is HIPAA-compliant, unlike standard email.' },
  { id: 20, category: 'ehr-navigation', text: 'What does "CPOE" stand for?', options: ['Clinical Patient Office Entry', 'Computerized Physician Order Entry', 'Centralized Provider Online Exchange', 'Certified Patient Operations Expert'], correctAnswer: 'Computerized Physician Order Entry', insight: 'CPOE reduces errors by eliminating handwritten orders.' },

  // HIPAA Compliance
  { id: 21, category: 'hipaa-compliance', text: 'What does PHI stand for?', options: ['Private Health Information', 'Protected Health Information', 'Personal Healthcare Index', 'Public Health Initiative'], correctAnswer: 'Protected Health Information', insight: 'PHI includes any information that can identify a patient.' },
  { id: 22, category: 'hipaa-compliance', text: 'Under the HIPAA Privacy Rule, what is the "Minimum Necessary" standard?', options: ['Minimum pay for staff', 'Accessing only the info needed for a job', 'Minimum number of patients', 'Minimum security software'], correctAnswer: 'Accessing only the info needed for a job', insight: 'Minimum Necessary prevents over-exposure of sensitive data.' },
  { id: 23, category: 'hipaa-compliance', text: 'Which of the following is an example of a physical safeguard?', options: ['Password policy', 'Locking file cabinets', 'Data encryption', 'Employee training'], correctAnswer: 'Locking file cabinets', insight: 'Physical safeguards protect the actual hardware and paper records.' },
  { id: 24, category: 'hipaa-compliance', text: 'When is a signed authorization NOT required to release PHI?', options: ['For marketing', 'For Treatment, Payment, or Operations (TPO)', 'For research', 'For employer requests'], correctAnswer: 'For Treatment, Payment, or Operations (TPO)', insight: 'TPO allows for the basic functions of a healthcare practice.' },
  { id: 25, category: 'hipaa-compliance', text: 'What is the maximum fine for a "willful neglect" HIPAA violation?', options: ['$1,000', '$10,000', '$50,000 per violation', '$100,000'], correctAnswer: '$50,000 per violation', insight: 'Fines are tiered based on the level of negligence.' },
  { id: 26, category: 'hipaa-compliance', text: 'How long do you have to notify individuals of a PHI breach?', options: ['30 days', '60 days', '90 days', '1 year'], correctAnswer: '60 days', insight: 'The 60-day rule is a strict federal deadline.' },
  { id: 27, category: 'hipaa-compliance', text: 'Which of the following is NOT a HIPAA identifier?', options: ['Social Security Number', 'Favorite color', 'IP address', 'Full face photo'], correctAnswer: 'Favorite color', insight: 'There are 18 specific identifiers defined by HIPAA.' },
  { id: 28, category: 'hipaa-compliance', text: 'What is the purpose of a Business Associate Agreement (BAA)?', options: ['To hire new staff', 'To ensure vendors comply with HIPAA', 'To set billing rates', 'To schedule meetings'], correctAnswer: 'To ensure vendors comply with HIPAA', insight: 'BAAs extend HIPAA protections to third-party vendors.' },
  { id: 29, category: 'hipaa-compliance', text: 'Can a patient request a copy of their own medical records under HIPAA?', options: ['No, never', 'Yes, with some exceptions', 'Only if they pay in full', 'Only if the doctor agrees'], correctAnswer: 'Yes, with some exceptions', insight: 'Patients have a legal right to access their own data.' },
  { id: 30, category: 'hipaa-compliance', text: 'What is "De-identification" of PHI?', options: ['Deleting the records', 'Removing all identifiers', 'Changing the patient\'s name', 'Moving records to the cloud'], correctAnswer: 'Removing all identifiers', insight: 'De-identified data is no longer subject to HIPAA rules.' },

  // Patient Communication
  { id: 31, category: 'patient-communication', text: 'What is the "Teach-Back" method?', options: ['Teaching the patient to use the EHR', 'Asking the patient to explain info back', 'Giving the patient a textbook', 'A test for medical students'], correctAnswer: 'Asking the patient to explain info back', insight: 'Teach-back is the gold standard for verifying patient understanding.' },
  { id: 32, category: 'patient-communication', text: 'How should you handle a patient who is speaking a different language?', options: ['Use Google Translate', 'Use a certified medical interpreter', 'Ask their child to translate', 'Speak louder in English'], correctAnswer: 'Use a certified medical interpreter', insight: 'Certified interpreters ensure clinical accuracy and legal safety.' },
  { id: 33, category: 'patient-communication', text: 'What is an example of an open-ended question?', options: ['"Are you in pain?"', '"Can you describe the pain you\'re feeling?"', '"Is today your birthday?"', '"Do you have insurance?"'], correctAnswer: '"Can you describe the pain you\'re feeling?"', insight: 'Open-ended questions encourage the patient to provide more detail.' },
  { id: 34, category: 'patient-communication', text: 'How do you demonstrate active listening?', options: ['Checking your watch', 'Summarizing what the patient said', 'Interrupting to save time', 'Looking at the computer screen'], correctAnswer: 'Summarizing what the patient said', insight: 'Summarizing shows the patient you truly heard them.' },
  { id: 35, category: 'patient-communication', text: 'What is the best way to communicate with a patient with low health literacy?', options: ['Use medical jargon', 'Use simple language and visual aids', 'Give them a long brochure', 'Speak very slowly'], correctAnswer: 'Use simple language and visual aids', insight: 'Visual aids can bridge the gap in understanding complex concepts.' },
  { id: 36, category: 'patient-communication', text: 'How should you respond to an angry patient on the phone?', options: ['Hang up', 'Remain calm and acknowledge their frustration', 'Argue back', 'Put them on hold indefinitely'], correctAnswer: 'Remain calm and acknowledge their frustration', insight: 'De-escalation starts with empathy and calm professional tone.' },
  { id: 37, category: 'patient-communication', text: 'What is "Empathy" in a clinical setting?', options: ['Feeling sorry for the patient', 'Understanding and sharing the patient\'s feelings', 'Giving the patient money', 'Agreeing with everything they say'], correctAnswer: 'Understanding and sharing the patient\'s feelings', insight: 'Empathy builds trust and improves patient outcomes.' },
  { id: 38, category: 'patient-communication', text: 'Why confirm a patient\'s identity using two identifiers?', options: ['To save time', 'To prevent medical errors and protect privacy', 'Because the software requires it', 'To check their credit score'], correctAnswer: 'To prevent medical errors and protect privacy', insight: 'Identity verification is the first line of defense in patient safety.' },
  { id: 39, category: 'patient-communication', text: 'How do you handle a patient hesitant to share sensitive info?', options: ['Force them to answer', 'Build rapport and ensure confidentiality', 'Tell their family', 'Skip those questions'], correctAnswer: 'Build rapport and ensure confidentiality', insight: 'Rapport is essential for gathering accurate sensitive history.' },
  { id: 40, category: 'patient-communication', text: 'What is the purpose of a "Warm Handoff"?', options: ['Giving the patient a blanket', 'Introducing the patient to the next provider', 'Heating up medical supplies', 'A fast discharge process'], correctAnswer: 'Introducing the patient to the next provider', insight: 'Warm handoffs reduce patient anxiety during transitions of care.' },

  // Medical Terminology
  { id: 41, category: 'medical-terminology', text: 'What does the prefix "Brady-" mean?', options: ['Fast', 'Slow', 'Large', 'Small'], correctAnswer: 'Slow', insight: 'Think "Bradycardia" (slow heart rate).' },
  { id: 42, category: 'medical-terminology', text: 'What is the medical term for "high blood pressure"?', options: ['Hypotension', 'Hypertension', 'Hyperglycemia', 'Tachycardia'], correctAnswer: 'Hypertension', insight: 'Hyper- means high; Tension refers to pressure.' },
  { id: 43, category: 'medical-terminology', text: 'What does the suffix "-itis" indicate?', options: ['Pain', 'Inflammation', 'Removal', 'Growth'], correctAnswer: 'Inflammation', insight: 'Examples include Arthritis, Tonsillitis, and Gastritis.' },
  { id: 44, category: 'medical-terminology', text: 'What is the anatomical term for the "kneecap"?', options: ['Scapula', 'Patella', 'Tibia', 'Femur'], correctAnswer: 'Patella', insight: 'The Patella is a sesamoid bone that protects the knee joint.' },
  { id: 45, category: 'medical-terminology', text: 'What does "NPO" stand for in medical orders?', options: ['New Patient Only', 'Nothing by mouth', 'No Pain Observed', 'Next Provider On-call'], correctAnswer: 'Nothing by mouth', insight: 'NPO is from the Latin "Nil Per Os".' },
  { id: 46, category: 'medical-terminology', text: 'What is the medical term for "shortness of breath"?', options: ['Apnea', 'Dyspnea', 'Bradypnea', 'Orthopnea'], correctAnswer: 'Dyspnea', insight: 'Dys- means difficult or painful; -pnea means breathing.' },
  { id: 47, category: 'medical-terminology', text: 'What does the root "Cardio-" refer to?', options: ['Lungs', 'Heart', 'Brain', 'Liver'], correctAnswer: 'Heart', insight: 'Cardiology is the study of the heart.' },
  { id: 48, category: 'medical-terminology', text: 'What is the term for a "bruise"?', options: ['Abrasion', 'Contusion', 'Laceration', 'Incision'], correctAnswer: 'Contusion', insight: 'A contusion is caused by blunt force trauma.' },
  { id: 49, category: 'medical-terminology', text: 'What does "PRN" mean on a prescription?', options: ['Take every morning', 'As needed', 'Before meals', 'After meals'], correctAnswer: 'As needed', insight: 'PRN is from the Latin "Pro Re Nata".' },
  { id: 50, category: 'medical-terminology', text: 'What is the medical term for "fainting"?', options: ['Vertigo', 'Syncope', 'Seizure', 'Stroke'], correctAnswer: 'Syncope', insight: 'Syncope is a temporary loss of consciousness due to low blood flow.' },
];

export const TRACKS: Track[] = [
  {
    id: 'medical-receptionist',
    name: 'Medical Receptionist',
    pathway: 'Administrative',
    description: 'First point of contact managing front desk operations, patient flow, and office efficiency.',
    assignmentCriteria: 'High scores in Call Handling, Scheduling, and Patient Intake.',
    skills: [
      { name: 'Patient Intake/Registration', description: 'Collect personal, medical, and insurance information accurately.' },
      { name: 'Appointment Scheduling', description: 'Coordinate appointments based on provider availability.' },
      { name: 'Call Handling', description: 'Manage incoming inquiries and direct calls professionally.' },
      { name: 'Insurance Verification', description: 'Confirm patient eligibility and coverage details.' },
      { name: 'Medical Records Management', description: 'Maintain patient health records in compliance with HIPAA.' },
      { name: 'Payment Collection', description: 'Collect co-pays and deductibles at time of service.' },
      { name: 'Referral Management', description: 'Process incoming and outgoing referrals with specialty offices.' },
      { name: 'Follow-up Calls', description: 'Contact patients post-visit for instructions or progress checks.' }
    ],
    curriculum: [
      { id: 'mr-1', title: 'Front-Desk Excellence', duration: '10h', topics: ['Greeting Protocols', 'Privacy (HIPAA)', 'De-escalation', 'Phone Etiquette', 'Patient Registration', 'Demographic Entry', 'Consent Forms', 'Waitlist Management', 'Check-in/Check-out', 'Co-pay Collection'] },
      { id: 'mr-2', title: 'Scheduling Systems', duration: '12h', topics: ['EHR Calendar Sync', 'Provider Templates', 'Telehealth Setup', 'Appointment Reminders', 'No-show Policies', 'Emergency Squeezing', 'Referral Tracking', 'Multi-site Scheduling', 'Time Zone Management', 'Patient Portals'] }
    ]
  },
  {
    id: 'medical-biller',
    name: 'Medical Biller',
    pathway: 'Revenue Cycle',
    description: 'Processing claims, managing denials, and ensuring timely reimbursement for healthcare facilities.',
    assignmentCriteria: 'High scores in Claims Processing, Denial Management, and RCM.',
    skills: [
      { name: 'Claims Processing', description: 'Review and prepare medical claims for coding accuracy.' },
      { name: 'Claims Submission', description: 'Submit claims electronically or by paper per payer guidelines.' },
      { name: 'Denial Management', description: 'Investigate rejected claims and identify root causes.' },
      { name: 'Payment Posting', description: 'Enter insurance and patient payments into billing systems.' },
      { name: 'Insurance Verification', description: 'Confirm eligibility and authorization before services.' },
      { name: 'Billing Inquiries', description: 'Respond to patient and payer questions regarding charges.' },
      { name: 'Account Management', description: 'Maintain accurate patient billing records and collections.' },
      { name: 'Revenue Cycle Management', description: 'Oversee the full financial process from intake to final payment.' }
    ],
    curriculum: [
      { id: 'mb-1', title: 'RCM Ecosystem', duration: '15h', topics: ['Claim Lifecycle', 'Clearinghouses', 'ERA/EOB Analysis', 'Payer Rules', 'Credentialing Basics', 'Fee Schedules', 'Patient Statements', 'Aging Reports', 'Write-off Policies', 'Audit Trails'] },
      { id: 'mb-2', title: 'Denial Mastery', duration: '20h', topics: ['Root Cause Analysis', 'Appeal Letter Writing', 'Payer Policy Research', 'Timely Filing Limits', 'COB Issues', 'Medical Necessity Appeals', 'Level 1 vs Level 2 Appeals', 'Tracking Denial Trends', 'Payer Portals', 'Re-billing Protocols'] }
    ]
  },
  {
    id: 'medical-admin-assistant',
    name: 'Medical Administrative Assistant',
    pathway: 'Administrative',
    description: 'A versatile hybrid role blending front-desk, secretarial, and coordination duties.',
    assignmentCriteria: 'Balanced scores in Coordination, Records Management, and EA Support.',
    skills: [
      { name: 'Appointment Scheduling', description: 'Manage provider calendars and patient bookings.' },
      { name: 'Insurance Verification', description: 'Confirm eligibility and benefits prior to appointments.' },
      { name: 'Records Management', description: 'Organize patient medical records per HIPAA standards.' },
      { name: 'Front Office Coordination', description: 'Coordinate communication between patients and providers.' },
      { name: 'Billing Support', description: 'Assist with co-pays, invoices, and claim documentation.' },
      { name: 'Patient Correspondence', description: 'Handle referrals, reminders, and lab order communications.' },
      { name: 'Prior Authorization', description: 'Prepare and submit authorization requests to payers.' },
      { name: 'EA Support', description: 'Manage executive calendars, meetings, and project coordination.' }
    ],
    curriculum: [
      { id: 'maa-1', title: 'The Hybrid VA', duration: '15h', topics: ['Multitasking', 'Cross-dept Sync', 'Conflict Resolution', 'Medical Secretary Duties', 'Transcription Basics', 'Insurance Coordination', 'Patient Advocacy', 'Office Supply Management', 'Staff Scheduling', 'Facility Compliance'] },
      { id: 'maa-2', title: 'Advanced Admin Ops', duration: '12h', topics: ['Budgeting', 'Vendor Management', 'Credentialing Support', 'Meeting Minutes', 'Legal Documentation', 'Policy Drafting', 'Quality Assurance', 'Internal Audits', 'HR Support', 'Onboarding VAs'] }
    ]
  },
  {
    id: 'medical-coder',
    name: 'Medical Coder',
    pathway: 'Revenue Cycle',
    description: 'Reviewing clinical documentation and assigning standardized codes for billing and compliance.',
    assignmentCriteria: 'Expertise in ICD/CPT Coding and Clinical Documentation Review.',
    skills: [
      { name: 'Clinical Documentation Review', description: 'Analyze provider notes and diagnostic findings for coding.' },
      { name: 'ICD/CPT Coding', description: 'Translate services into standardized medical codes.' },
      { name: 'Coding Accuracy Compliance', description: 'Verify correct code usage based on payer guidelines.' },
      { name: 'Billing Collaboration', description: 'Work with billing staff to ensure proper claim creation.' },
      { name: 'Denial Management', description: 'Investigate and resubmit coding-related denials.' },
      { name: 'Specialty & HCC Coding', description: 'Apply coding for complex areas like surgery or risk adjustment.' },
      { name: 'Provider CDI Training', description: 'Train clinicians on documentation best practices.' },
      { name: 'Code Update Monitoring', description: 'Monitor annual updates to ICD-10-CM and CPT guidelines.' }
    ],
    curriculum: [
      { id: 'mc-1', title: 'Advanced ICD-10', duration: '25h', topics: ['General Guidelines', 'Infectious Diseases', 'Neoplasms', 'Endocrine Systems', 'Mental Disorders', 'Nervous Systems', 'Circulatory Systems', 'Respiratory Systems', 'Digestive Systems', 'Skin & Subcutaneous'] },
      { id: 'mc-2', title: 'Procedural Coding', duration: '30h', topics: ['CPT Modifiers', 'Surgical Coding', 'E&M Levels', 'Radiology Coding', 'Pathology/Lab', 'Medicine Section', 'HCPCS Level II', 'Anesthesia Coding', 'NCCI Edits', 'Global Packages'] }
    ]
  },
  {
    id: 'medical-scribe',
    name: 'Medical Scribe',
    pathway: 'Clinical',
    description: 'Documentation specialist entering real-time notes into the EHR to improve clinical efficiency.',
    assignmentCriteria: 'High scores in Live Scribing and Assessment & Plan Recording.',
    skills: [
      { name: 'Live Scribing', description: 'Provide real-time documentation during patient encounters.' },
      { name: 'Patient History Entry', description: 'Enter chief complaints, HPI, and medical history.' },
      { name: 'Transcribing', description: 'Convert recorded dictations into formal medical documentation.' },
      { name: 'Assessment & Plan Recording', description: 'Record diagnoses, treatment plans, and follow-up instructions.' },
      { name: 'Order Entry Assistance', description: 'Input orders for labs and imaging under provider supervision.' },
      { name: 'EHR Template Management', description: 'Maintain and customize chart templates for providers.' },
      { name: 'Clinical Alert Monitoring', description: 'Watch for flags like medication interactions in the EHR.' },
      { name: 'Pre/Post Charting', description: 'Prepare records before visits and organize notes after.' },
      { name: 'Workflow Support', description: 'Maintain pace during high-volume clinic days.' }
    ],
    curriculum: [
      { id: 'ms-1', title: 'Charting Excellence', duration: '40h', topics: ['HPI Construction', 'Physical Exam Findings', 'Assessment & Plan', 'Medical Terminology', 'Anatomy & Physiology', 'Pharmacology Basics', 'Lab Interpretation', 'Imaging Results', 'Clinical Decision Making', 'Surgical Notes'] },
      { id: 'ms-2', title: 'EHR Optimization', duration: '15h', topics: ['SmartPhrases', 'Macros', 'Order Entry', 'Clinical Alerts', 'Meaningful Use', 'Quality Metrics', 'Patient History', 'Family/Social History', 'Review of Systems', 'Physical Exam Templates'] }
    ]
  },
  {
    id: 'health-educator',
    name: 'Health Educator',
    pathway: 'Clinical',
    description: 'Remote patient education, administrative coordination, and communication support.',
    assignmentCriteria: 'Strong scores in Patient Education and Content Creation.',
    skills: [
      { name: 'Patient Education Support', description: 'Guide patients through lifestyle and treatment instructions.' },
      { name: 'Educational Content Creation', description: 'Develop brochures, infographics, and health modules.' },
      { name: 'Follow-Up Communication', description: 'Conduct check-ins to reinforce adherence and gather insights.' },
      { name: 'Call/Message Handling', description: 'Manage inquiries and triage messages for providers.' },
      { name: 'Administrative Assistance', description: 'Support email, calendar, and record updates.' },
      { name: 'Scheduling & Coordination', description: 'Arrange webinars and one-on-one education sessions.' },
      { name: 'Data Entry & Documentation', description: 'Enter education records and session notes into EMRs.' },
      { name: 'Clinical Content Research & Validation', description: 'Review health info against trusted clinical sources.' },
      { name: 'Program Evaluation & Reporting', description: 'Track outcomes and patient satisfaction for reporting.' },
      { name: 'Health Screening Tool Administration', description: 'Administer standardized questionnaires remotely.' }
    ],
    curriculum: [
      { id: 'he-1', title: 'Patient Advocacy', duration: '12h', topics: ['Empathy', 'Health Literacy', 'Chronic Disease Management', 'Preventive Care', 'Nutrition Basics', 'Exercise Guidance', 'Mental Health Support', 'Community Resources', 'Support Groups', 'Patient Portals'] }
    ]
  },
  {
    id: 'dental-biller',
    name: 'Dental Biller',
    pathway: 'Revenue Cycle',
    description: 'Managing financial and insurance aspects of dental care using CDT coding.',
    assignmentCriteria: 'High scores in CDT Coding and Dental Record Keeping.',
    skills: [
      { name: 'Insurance Verification', description: 'Confirm dental eligibility and plan limitations.' },
      { name: 'Code Entry (CDT)', description: 'Assign CDT codes based on documented dental procedures.' },
      { name: 'Claim Submission', description: 'Prepare and send dental claims for reimbursement.' },
      { name: 'Claim Tracking', description: 'Monitor outstanding claims and follow up on delays.' },
      { name: 'Denial Management', description: 'Investigate rejected dental claims and file appeals.' },
      { name: 'Payment Posting', description: 'Apply insurance payments and reconcile dental EOBs.' },
      { name: 'Patient Billing', description: 'Generate statements and collect uncovered dental balances.' },
      { name: 'Billing Inquiries', description: 'Answer patient questions regarding dental charges.' },
      { name: 'Record Keeping', description: 'Ensure accurate transaction documentation in dental software.' },
      { name: 'Code Updates', description: 'Keep current with annual CDT code updates.' }
    ],
    curriculum: [
      { id: 'db-1', title: 'Dental RCM', duration: '15h', topics: ['CDT Basics', 'Dental Payers', 'Pre-determinations', 'Radiograph Attachment', 'Narrative Writing', 'Dental Terminology', 'Tooth Numbering Systems', 'Surface Coding', 'Ortho Billing', 'Periodontal Charting'] }
    ]
  },
  {
    id: 'dental-receptionist',
    name: 'Dental Receptionist',
    pathway: 'Administrative',
    description: 'Front-line representative managing dental office operations and patient coordination.',
    assignmentCriteria: 'High scores in Dental Front Desk and Treatment Estimates.',
    skills: [
      { name: 'Front Desk (Virtual)', description: 'Handle dental scheduling, intake, and patient reminders.' },
      { name: 'Insurance Verification', description: 'Confirm dental eligibility and pre-authorization needs.' },
      { name: 'Payment Processing', description: 'Collect dental co-pays and process transactions.' },
      { name: 'Manage Treatment Estimates', description: 'Generate and explain dental treatment cost estimates.' },
      { name: 'Record Management', description: 'Maintain accurate patient data in dental practice systems.' },
      { name: 'Team Coordination', description: 'Communicate patient needs to hygienists and dentists.' },
      { name: 'Patient Follow-up', description: 'Call patients for recall visits or post-op check-ins.' }
    ],
    curriculum: [
      { id: 'dr-1', title: 'Dental Front-Office', duration: '12h', topics: ['Dental Terminology', 'Recall Systems', 'Treatment Presentation', 'Financial Arrangements', 'Dental Insurance Basics', 'Hygiene Scheduling', 'Lab Tracking', 'Patient Communication', 'Dental Software Mastery', 'Emergency Triage'] }
    ]
  }
];
