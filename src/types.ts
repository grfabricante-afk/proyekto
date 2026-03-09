export type VAStatus = 'unplaced' | 'placed';
export type ProgramStep = 'entry' | 'baseline' | 'pathway-selection' | 'right-skill-intro' | 'assessment' | 'assignment' | 'upskilling' | 'application' | 'vetting' | 'certification' | 'placement' | 'kpi' | 'profile';

export type PathwayType = 'upskill' | 'right-skill';

export interface Skill { name: string; description: string; }
export interface Module { 
  id: string; 
  title: string; 
  duration: string; 
  daysToComplete: number;
  topics: string[]; 
  learningObjectives: string[];
}

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
  assessmentFeedback: Record<string, string> | null;
  selectedPathway: PathwayType | null;
  averageScore: number | null;
  assignedTrack: Track | null;
  recommendedTrackId: string | null;
  selectedUpskillRoleId: string | null;
  completedModules: string[];
  completedTopics: string[];
  assignedAt: string | null;
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
  
  // Additional Medical Terminology
  { id: 51, category: 'medical-terminology', text: 'What does the suffix "-ectomy" mean?', options: ['Inflammation', 'Surgical removal', 'Incision into', 'Study of'], correctAnswer: 'Surgical removal', insight: 'Examples include appendectomy and tonsillectomy.' },
  { id: 52, category: 'medical-terminology', text: 'What is the medical term for "low blood sugar"?', options: ['Hyperglycemia', 'Hypoglycemia', 'Hypertension', 'Hypotension'], correctAnswer: 'Hypoglycemia', insight: 'Hypo- means low; glyc- refers to sugar.' },
  { id: 53, category: 'medical-terminology', text: 'What does "Stat" mean in a medical context?', options: ['Slowly', 'Standard', 'Immediately', 'Stable'], correctAnswer: 'Immediately', insight: 'Derived from the Latin "statim".' },
  { id: 54, category: 'medical-terminology', text: 'What is the term for "inflammation of the liver"?', options: ['Nephritis', 'Hepatitis', 'Gastritis', 'Colitis'], correctAnswer: 'Hepatitis', insight: 'Hepat- refers to the liver; -itis means inflammation.' },
  { id: 55, category: 'medical-terminology', text: 'What does the prefix "Tachy-" mean?', options: ['Slow', 'Fast', 'Large', 'Small'], correctAnswer: 'Fast', insight: 'Think "Tachycardia" (fast heart rate).' },
  { id: 56, category: 'medical-terminology', text: 'What is the medical term for "difficulty swallowing"?', options: ['Dysphasia', 'Dysphagia', 'Dyspnea', 'Dyspepsia'], correctAnswer: 'Dysphagia', insight: 'Dys- means difficult; -phagia refers to eating or swallowing.' },
  { id: 57, category: 'medical-terminology', text: 'What does "QID" mean on a prescription?', options: ['Every day', 'Twice a day', 'Three times a day', 'Four times a day'], correctAnswer: 'Four times a day', insight: 'From the Latin "quater in die".' },
  { id: 58, category: 'medical-terminology', text: 'What is the term for "a record of the electrical activity of the heart"?', options: ['Electroencephalogram', 'Electromyogram', 'Electrocardiogram', 'Echocardiogram'], correctAnswer: 'Electrocardiogram', insight: 'Commonly known as an EKG or ECG.' },
  { id: 59, category: 'medical-terminology', text: 'What does the prefix "Myo-" refer to?', options: ['Bone', 'Nerve', 'Muscle', 'Skin'], correctAnswer: 'Muscle', insight: 'Myocardium is the heart muscle.' },
  { id: 60, category: 'medical-terminology', text: 'What is the medical term for "nosebleed"?', options: ['Hemoptysis', 'Hematemesis', 'Epistaxis', 'Hematuria'], correctAnswer: 'Epistaxis', insight: 'Epistaxis can be caused by trauma or dry air.' },

  // Additional HIPAA Compliance
  { id: 61, category: 'hipaa-compliance', text: 'Scenario: A patient\'s spouse calls asking for lab results. What is the correct action?', options: ['Give the results immediately', 'Ask the spouse to call back later', 'Verify authorization on file before releasing', 'Tell them to ask the patient'], correctAnswer: 'Verify authorization on file before releasing', insight: 'PHI can only be shared with authorized individuals.' },
  { id: 62, category: 'hipaa-compliance', text: 'Which of the following is NOT considered PHI?', options: ['Patient name', 'Social Security Number', 'Aggregated, de-identified statistics', 'Home address'], correctAnswer: 'Aggregated, de-identified statistics', insight: 'De-identified data is no longer subject to HIPAA rules.' },
  { id: 63, category: 'hipaa-compliance', text: 'What is the purpose of the HIPAA Security Rule?', options: ['To protect paper records', 'To protect electronic PHI', 'To set billing rates', 'To hire new staff'], correctAnswer: 'To protect electronic PHI', insight: 'The Security Rule focuses specifically on ePHI.' },
  { id: 64, category: 'hipaa-compliance', text: 'Scenario: You find a printed patient record left on a public printer. What should you do?', options: ['Leave it there', 'Throw it in the trash', 'Secure the record and report the incident', 'Read it to see who it belongs to'], correctAnswer: 'Secure the record and report the incident', insight: 'Protecting PHI is everyone\'s responsibility.' },
  { id: 65, category: 'hipaa-compliance', text: 'What does the "Right to Amend" allow a patient to do?', options: ['Delete their records', 'Request a correction to their medical record', 'Change their doctor', 'Refuse treatment'], correctAnswer: 'Request a correction to their medical record', insight: 'Patients can request changes if they believe info is inaccurate.' },
  { id: 66, category: 'hipaa-compliance', text: 'Who is responsible for HIPAA compliance in a medical office?', options: ['Only the doctor', 'Only the office manager', 'All employees and business associates', 'Only the IT department'], correctAnswer: 'All employees and business associates', insight: 'Compliance is a team effort.' },
  { id: 67, category: 'hipaa-compliance', text: 'What is a "Privacy Notice"?', options: ['A bill for services', 'A document explaining how PHI is used and shared', 'A list of office hours', 'A patient satisfaction survey'], correctAnswer: 'A document explaining how PHI is used and shared', insight: 'Patients must be given a Notice of Privacy Practices (NPP).' },
  { id: 68, category: 'hipaa-compliance', text: 'Scenario: An insurance company calls for records of a patient not covered by them. What is the first step?', options: ['Send the records immediately', 'Confirm the patient\'s identity and the validity of the request', 'Hang up', 'Ask the patient for permission'], correctAnswer: 'Confirm the patient\'s identity and the validity of the request', insight: 'Always verify the "need to know" before sharing PHI.' },
  { id: 69, category: 'hipaa-compliance', text: 'What is the "Breach Notification Rule"?', options: ['Requirement to notify patients of office closures', 'Requirement to notify patients and HHS of a PHI breach', 'Requirement to notify staff of new policies', 'Requirement to notify insurance of new rates'], correctAnswer: 'Requirement to notify patients and HHS of a PHI breach', insight: 'Breaches must be reported within specific timeframes.' },
  { id: 70, category: 'hipaa-compliance', text: 'Which of the following is a technical safeguard?', options: ['Locking doors', 'Employee background checks', 'Unique user IDs and automatic log-offs', 'Fire extinguishers'], correctAnswer: 'Unique user IDs and automatic log-offs', insight: 'Technical safeguards protect access to ePHI.' },

  // Additional Patient Communication
  { id: 71, category: 'patient-communication', text: 'Scenario: A patient is confused about their follow-up instructions. What is the most effective approach?', options: ['Repeat the instructions louder', 'Give them a long brochure', 'Use the Teach-Back method', 'Tell them to call back later'], correctAnswer: 'Use the Teach-Back method', insight: 'Teach-back ensures the patient truly understands.' },
  { id: 72, category: 'patient-communication', text: 'What is "Non-verbal communication"?', options: ['Speaking clearly', 'Writing notes', 'Body language, facial expressions, and tone of voice', 'Using a translator'], correctAnswer: 'Body language, facial expressions, and tone of voice', insight: 'Non-verbal cues often convey more than words.' },
  { id: 73, category: 'patient-communication', text: 'How should you address an elderly patient?', options: ['Use their first name', 'Use "Honey" or "Sweetie"', 'Use their formal title and last name unless invited otherwise', 'Speak very loudly'], correctAnswer: 'Use their formal title and last name unless invited otherwise', insight: 'Formal address shows respect.' },
  { id: 74, category: 'patient-communication', text: 'Scenario: A patient is crying after receiving bad news. What is the most appropriate response?', options: ['Tell them to stop crying', 'Leave the room immediately', 'Offer support and listen without interrupting', 'Start talking about the bill'], correctAnswer: 'Offer support and listen without interrupting', insight: 'Empathy and presence are key in difficult moments.' },
  { id: 75, category: 'patient-communication', text: 'What is the goal of "Patient-Centered Communication"?', options: ['To save time', 'To follow the doctor\'s orders only', 'To involve the patient in their own care decisions', 'To increase billing'], correctAnswer: 'To involve the patient in their own care decisions', insight: 'Patient involvement improves adherence and outcomes.' },
  { id: 76, category: 'patient-communication', text: 'How can you ensure a patient understands a complex procedure?', options: ['Use medical jargon', 'Use simple analogies and visual aids', 'Speak very fast', 'Tell them to look it up online'], correctAnswer: 'Use simple analogies and visual aids', insight: 'Visuals bridge the gap in understanding.' },
  { id: 77, category: 'patient-communication', text: 'Scenario: A patient is late for their appointment and is very stressed. How do you handle this?', options: ['Scold them for being late', 'Tell them they can\'t be seen', 'Acknowledge their stress and explain the next steps calmly', 'Ignore them'], correctAnswer: 'Acknowledge their stress and explain the next steps calmly', insight: 'De-escalation starts with acknowledging the patient\'s state.' },
  { id: 78, category: 'patient-communication', text: 'What is "Cultural Competence" in healthcare?', options: ['Speaking many languages', 'Understanding and respecting diverse patient backgrounds', 'Traveling to different countries', 'Hiring diverse staff only'], correctAnswer: 'Understanding and respecting diverse patient backgrounds', insight: 'Cultural competence reduces health disparities.' },
  { id: 79, category: 'patient-communication', text: 'Why is it important to avoid medical jargon with patients?', options: ['It makes you look too smart', 'It can lead to misunderstandings and anxiety', 'It is against the law', 'It takes too much time'], correctAnswer: 'It can lead to misunderstandings and anxiety', insight: 'Clear communication is essential for safety.' },
  { id: 80, category: 'patient-communication', text: 'What is the best way to confirm a patient\'s preferred method of contact?', options: ['Guess based on their age', 'Ask the patient directly during registration', 'Check their social media', 'Call them on all numbers'], correctAnswer: 'Ask the patient directly during registration', insight: 'Respecting preferences improves engagement.' },

  // Additional Dental Billing/Admin
  { id: 81, category: 'dental-billing', text: 'What is the purpose of a "Pre-determination" in dental insurance?', options: ['To guarantee payment', 'To estimate coverage before a procedure', 'To schedule the appointment', 'To bill the patient'], correctAnswer: 'To estimate coverage before a procedure', insight: 'Pre-determinations help patients plan for costs.' },
  { id: 82, category: 'dental-billing', text: 'Which tooth numbering system is most common in the US?', options: ['FDI World Dental Federation', 'Palmer Notation Method', 'Universal Numbering System', 'ISO System'], correctAnswer: 'Universal Numbering System', insight: 'Uses 1-32 for permanent teeth.' },
  { id: 83, category: 'dental-billing', text: 'What does "Prophylaxis" mean in a dental context?', options: ['Filling a cavity', 'Professional cleaning', 'Extracting a tooth', 'Root canal'], correctAnswer: 'Professional cleaning', insight: 'D1110 is the adult prophylaxis code.' },
  { id: 84, category: 'dental-billing', text: 'Scenario: A patient needs a crown but their insurance has reached its annual maximum. What should you do?', options: ['Tell them they can\'t have the crown', 'Explain the situation and discuss payment options', 'Bill the insurance anyway', 'Wait until next year'], correctAnswer: 'Explain the situation and discuss payment options', insight: 'Financial transparency is crucial.' },
  { id: 85, category: 'dental-billing', text: 'What is "Scaling and Root Planing"?', options: ['Whitening treatment', 'A deep cleaning for periodontal disease', 'Polishing the teeth', 'Applying fluoride'], correctAnswer: 'A deep cleaning for periodontal disease', insight: 'D4341/D4342 codes are used for this.' },
  { id: 86, category: 'dental-billing', text: 'What is the difference between a "Deductible" and a "Co-pay"?', options: ['They are the same', 'Deductible is paid before insurance starts; Co-pay is a fixed fee per visit', 'Co-pay is paid before insurance starts; Deductible is a fixed fee', 'Insurance pays the deductible'], correctAnswer: 'Deductible is paid before insurance starts; Co-pay is a fixed fee per visit', insight: 'Understanding these terms is key for patient education.' },
  { id: 87, category: 'dental-billing', text: 'What is a "Dental Narrative"?', options: ['A story for children', 'A written explanation justifying the medical necessity of a procedure', 'A list of office policies', 'A patient\'s review'], correctAnswer: 'A written explanation justifying the medical necessity of a procedure', insight: 'Narratives are often required for complex claims.' },
  { id: 88, category: 'dental-billing', text: 'Which code category is used for "Diagnostic" dental services?', options: ['D0100-D0999', 'D1000-D1999', 'D2000-D2999', 'D7000-D7999'], correctAnswer: 'D0100-D0999', insight: 'Diagnostic codes include exams and X-rays.' },
  { id: 89, category: 'dental-billing', text: 'What is "Assignment of Benefits"?', options: ['Assigning a doctor to a patient', 'Patient authorizes insurance to pay the provider directly', 'Assigning a task to a staff member', 'Changing insurance plans'], correctAnswer: 'Patient authorizes insurance to pay the provider directly', insight: 'This simplifies the payment process for patients.' },
  { id: 90, category: 'dental-billing', text: 'Scenario: A dental claim is denied due to "missing radiographs". What is the next step?', options: ['Call the patient', 'Attach the required X-rays and resubmit the claim', 'Write off the balance', 'Ignore the denial'], correctAnswer: 'Attach the required X-rays and resubmit the claim', insight: 'Follow-up on denials is essential for revenue.' },

  // Additional EHR/Medical Admin
  { id: 91, category: 'ehr-navigation', text: 'What is the primary benefit of an Integrated EHR system?', options: ['It is cheaper', 'Seamless data sharing between departments', 'It requires no training', 'It replaces all staff'], correctAnswer: 'Seamless data sharing between departments', insight: 'Integration improves care coordination.' },
  { id: 92, category: 'ehr-navigation', text: 'What does "Interoperability" mean in healthcare IT?', options: ['The ability to use the internet', 'The ability of different systems to exchange and use information', 'Using only one software', 'Hiring IT experts'], correctAnswer: 'The ability of different systems to exchange and use information', insight: 'Interoperability is a major goal of modern healthcare.' },
  { id: 93, category: 'ehr-navigation', text: 'Scenario: You notice a duplicate patient record in the system. What should you do?', options: ['Delete one immediately', 'Ignore it', 'Flag the records for merging according to office policy', 'Ask the patient which one they want'], correctAnswer: 'Flag the records for merging according to office policy', insight: 'Merging ensures a complete and accurate patient history.' },
  { id: 94, category: 'ehr-navigation', text: 'What is a "Patient Portal"?', options: ['A physical door in the clinic', 'A secure online website that gives patients 24-hour access to personal health information', 'A social media page', 'A billing system'], correctAnswer: 'A secure online website that gives patients 24-hour access to personal health information', insight: 'Portals empower patients to manage their health.' },
  { id: 95, category: 'ehr-navigation', text: 'What is the purpose of "Clinical Decision Support" (CDS) in an EHR?', options: ['To make decisions for the doctor', 'To provide providers with knowledge and person-specific information to enhance health and healthcare', 'To schedule meetings', 'To track staff hours'], correctAnswer: 'To provide providers with knowledge and person-specific information to enhance health and healthcare', insight: 'CDS tools include alerts, reminders, and guidelines.' },
  { id: 96, category: 'ehr-navigation', text: 'Scenario: A provider asks you to "scribe" a visit. What is your primary responsibility?', options: ['Performing the physical exam', 'Accurately documenting the encounter in real-time', 'Prescribing medications', 'Billing the patient'], correctAnswer: 'Accurately documenting the encounter in real-time', insight: 'Scribes allow providers to focus more on the patient.' },
  { id: 97, category: 'ehr-navigation', text: 'What is "Meaningful Use" (now Promoting Interoperability)?', options: ['Using the EHR for personal tasks', 'A set of standards defined by CMS for the use of EHRs', 'Hiring more staff', 'Buying new computers'], correctAnswer: 'A set of standards defined by CMS for the use of EHRs', insight: 'Incentivizes the effective use of EHR technology.' },
  { id: 98, category: 'ehr-navigation', text: 'How do you handle a system downtime in a medical office?', options: ['Go home', 'Panic', 'Follow the established manual backup procedures', 'Wait for it to fix itself'], correctAnswer: 'Follow the established manual backup procedures', insight: 'Downtime protocols ensure continuity of care.' },
  { id: 99, category: 'ehr-navigation', text: 'What is the "EHR Audit Trail"?', options: ['A path in the office', 'A log that tracks every access and change made to a patient record', 'A list of patient complaints', 'A financial report'], correctAnswer: 'A log that tracks every access and change made to a patient record', insight: 'Audit trails are essential for security and compliance.' },
  { id: 100, category: 'ehr-navigation', text: 'Scenario: A patient wants to see their "Vitals" from the last visit. Where do you look?', options: ['The Billing tab', 'The Vitals or Flowsheet section of the EHR', 'The Social History', 'The Insurance tab'], correctAnswer: 'The Vitals or Flowsheet section of the EHR', insight: 'Vitals are typically recorded in a dedicated section.' },
  
  // Advanced Medical Terminology
  { id: 101, category: 'medical-terminology', text: 'What does the term "Oliguria" mean?', options: ['Excessive urination', 'Painful urination', 'Low urine output', 'Blood in the urine'], correctAnswer: 'Low urine output', insight: 'Oligo- means scanty or few; -uria refers to urine.' },
  { id: 102, category: 'medical-terminology', text: 'True or False: "Paresthesia" refers to an abnormal sensation, such as tingling or prickling, often described as "pins and needles".', options: ['True', 'False'], correctAnswer: 'True', insight: 'Paresthesia is often caused by pressure on or damage to peripheral nerves.' },
  { id: 103, category: 'medical-terminology', text: 'What is the medical term for the "surgical repair of a joint"?', options: ['Arthrodesis', 'Arthroplasty', 'Arthroscopy', 'Arthrotomy'], correctAnswer: 'Arthroplasty', insight: '-plasty means surgical repair; arthro- refers to a joint.' },
  { id: 104, category: 'medical-terminology', text: 'True or False: "Hematopoiesis" is the medical term for the process of blood cell formation.', options: ['True', 'False'], correctAnswer: 'True', insight: 'This process primarily occurs in the red bone marrow.' },

  // Insurance Claim Follow-up
  { id: 105, category: 'insurance-follow-up', text: 'What is the first step when a claim is denied for "Timely Filing"?', options: ['Write off the balance', 'Appeal the claim immediately', 'Verify the date of service and the payer\'s specific filing deadline', 'Bill the patient'], correctAnswer: 'Verify the date of service and the payer\'s specific filing deadline', insight: 'Timely filing limits vary significantly by insurance payer.' },
  { id: 106, category: 'insurance-follow-up', text: 'True or False: An "Explanation of Benefits" (EOB) is a legal document that serves as a bill the patient must pay to the provider.', options: ['True', 'False'], correctAnswer: 'False', insight: 'An EOB explains what the insurance covered and what the patient *may* owe, but it is not a bill itself.' },
  { id: 107, category: 'insurance-follow-up', text: 'What is the primary purpose of an "Aging Report" in medical billing?', options: ['To track the age of the patients', 'To track unpaid claims by the number of days they have been outstanding', 'To list the expiration dates of medications', 'To schedule follow-up appointments'], correctAnswer: 'To track unpaid claims by the number of days they have been outstanding', insight: 'Aging reports help prioritize follow-up efforts on older, unpaid claims.' },

  // Patient Portal Management
  { id: 108, category: 'ehr-navigation', text: 'True or False: Patients can typically use a secure patient portal to request prescription refills from their healthcare provider.', options: ['True', 'False'], correctAnswer: 'True', insight: 'Refill requests via portals improve efficiency and reduce phone volume.' },
  { id: 109, category: 'ehr-navigation', text: 'What is a common security measure used by patient portals to ensure HIPAA-compliant access?', options: ['Publicly sharing passwords', 'Two-factor authentication (2FA)', 'Allowing anyone with the patient\'s name to log in', 'Storing passwords in plain text'], correctAnswer: 'Two-factor authentication (2FA)', insight: '2FA adds an extra layer of security beyond just a password.' },
  { id: 110, category: 'ehr-navigation', text: 'True or False: A HIPAA-compliant patient portal should allow patients to view and download their own lab results and clinical summaries.', options: ['True', 'False'], correctAnswer: 'True', insight: 'The HIPAA Privacy Rule gives patients the right to access their own health information.' },

  // Hybrid & Advanced Scenarios
  { id: 111, category: 'hybrid-skills', text: 'A Medical Receptionist is asked to explain a "Co-insurance" percentage to a patient. What is the best definition?', options: ['A fixed dollar amount per visit', 'The percentage of costs the patient pays after the deductible is met', 'The total amount the insurance pays', 'A monthly premium'], correctAnswer: 'The percentage of costs the patient pays after the deductible is met', insight: 'Hybrid VAs must understand basic billing terms to assist patients at the front desk.' },
  { id: 112, category: 'hybrid-skills', text: 'When a Medical Biller notices a "Missing Modifier" denial, which clinical document is most helpful to review?', options: ['Patient Registration Form', 'Provider\'s Operative or Progress Note', 'Insurance Card Copy', 'Appointment Calendar'], correctAnswer: 'Provider\'s Operative or Progress Note', insight: 'Billers with clinical documentation review skills can resolve denials faster.' },
  { id: 113, category: 'hybrid-skills', text: 'A Medical Administrative Assistant is coordinating a Telehealth visit. What is a "Virtual Check-in"?', options: ['A 2-hour long video call', 'A brief communication to determine if a full visit is needed', 'A physical exam done over the phone', 'A billing audit'], correctAnswer: 'A brief communication to determine if a full visit is needed', insight: 'Virtual check-ins are specific billable services with unique requirements.' },
  { id: 114, category: 'hybrid-skills', text: 'What is "Remote Patient Monitoring" (RPM)?', options: ['Watching patients through a security camera', 'Using digital devices to collect and transmit health data to providers', 'Calling patients every day to chat', 'A type of health insurance'], correctAnswer: 'Using digital devices to collect and transmit health data to providers', insight: 'RPM is a growing field requiring both clinical and technical coordination.' },
  { id: 115, category: 'hybrid-skills', text: 'In a "Hybrid VA" model, why might a Scribe also need to understand ICD-10 coding?', options: ['To perform surgery', 'To ensure the clinical narrative supports the assigned diagnosis codes', 'To bill the patient directly', 'To manage the office payroll'], correctAnswer: 'To ensure the clinical narrative supports the assigned diagnosis codes', insight: 'Scribes who understand coding help prevent "Downcoding" and denials.' },
  { id: 116, category: 'hybrid-skills', text: 'What does "Coordination of Benefits" (COB) determine?', options: ['Which doctor the patient sees', 'Which insurance payer is primary and which is secondary', 'The patient\'s blood type', 'The office holiday schedule'], correctAnswer: 'Which insurance payer is primary and which is secondary', insight: 'COB is critical for patients with multiple insurance plans.' },
  { id: 117, category: 'hybrid-skills', text: 'A Health Educator is asked to track "Patient Adherence". What does this mean?', options: ['How fast the patient walks', 'The extent to which a patient follows medical advice or treatment plans', 'The patient\'s credit score', 'The number of referrals sent'], correctAnswer: 'The extent to which a patient follows medical advice or treatment plans', insight: 'Adherence is a key metric for evaluating health education effectiveness.' },
  { id: 118, category: 'hybrid-skills', text: 'What is a "Clean Claim" in medical billing?', options: ['A claim printed on white paper', 'A claim with no errors that can be processed without additional info', 'A claim for a physical exam', 'A claim that has been paid in full'], correctAnswer: 'A claim with no errors that can be processed without additional info', insight: 'High clean claim rates are the goal of efficient RCM teams.' },
  { id: 119, category: 'hybrid-skills', text: 'Why is "Medical Necessity" important for insurance coverage?', options: ['It determines if the doctor is nice', 'It ensures services are reasonable and necessary for the diagnosis', 'It is a type of medical degree', 'It tracks the patient\'s age'], correctAnswer: 'It ensures services are reasonable and necessary for the diagnosis', insight: 'Insurance only pays for services they deem medically necessary.' },
  { id: 120, category: 'hybrid-skills', text: 'What is the purpose of a "Physician Query" in medical coding?', options: ['To ask the doctor for a lunch break', 'To clarify ambiguous or incomplete documentation', 'To tell the doctor what codes to use', 'To complain about the EHR'], correctAnswer: 'To clarify ambiguous or incomplete documentation', insight: 'Queries are a formal process to ensure documentation supports coding.' }
];

export const TRACKS: Track[] = [
  {
    id: 'medical-receptionist',
    name: 'Medical Receptionist',
    pathway: 'Administrative',
    description: 'First point of contact managing front desk operations, patient flow, and office efficiency.',
    assignmentCriteria: 'High scores in Call Handling, Scheduling, and Patient Intake.',
    skills: [
      { name: 'Patient Intake/Registration', description: 'Collect personal, medical, and insurance information, and ensure all required forms and consent documents are completed accurately and securely.' },
      { name: 'Appointment Scheduling', description: 'Coordinate new, follow-up, and recurring appointments based on provider availability and patient needs while minimizing conflicts and ensuring efficient time management.' },
      { name: 'Call Handling', description: 'Answer incoming calls promptly, provide information, direct calls to the appropriate staff, take messages, and ensure all inquiries are addressed professionally.' },
      { name: 'Insurance Verification', description: 'Confirm patient insurance eligibility and coverage details before appointments or procedures.' },
      { name: 'Medical Records Management', description: 'Maintain, update, and retrieve patient health records in compliance with HIPAA regulations, ensuring accuracy, confidentiality, and easy access for authorized personnel.' },
      { name: 'Payment Collection', description: 'Collect co-pays, deductibles, and outstanding balances at the time of service, issue receipts, and provide basic billing support or escalate as needed.' },
      { name: 'Referral Management', description: 'Process incoming and outgoing referrals by coordinating with referring offices, ensuring required documentation is gathered, and scheduling specialty appointments as needed.' },
      { name: 'Follow-up Calls', description: 'Contact patients post-visit to confirm upcoming appointments, relay provider instructions, check on patient progress, or follow up on outstanding documents or balances.' }
    ],
    curriculum: [
      { 
        id: 'mr-1', 
        title: 'Front-Desk Excellence', 
        duration: '10h', 
        daysToComplete: 7, 
        topics: ['Greeting Protocols', 'Privacy (HIPAA)', 'De-escalation', 'Phone Etiquette', 'Patient Registration', 'Demographic Entry', 'Consent Forms', 'Waitlist Management', 'Check-in/Check-out', 'Co-pay Collection'],
        learningObjectives: [
          'Master professional greeting and phone etiquette protocols.',
          'Ensure 100% HIPAA compliance during patient registration.',
          'Effectively de-escalate difficult patient interactions.',
          'Accurately manage patient check-in and check-out workflows.'
        ]
      },
      { 
        id: 'mr-2', 
        title: 'Scheduling Systems', 
        duration: '12h', 
        daysToComplete: 10, 
        topics: ['EHR Calendar Sync', 'Provider Templates', 'Telehealth Setup', 'Appointment Reminders', 'No-show Policies', 'Emergency Squeezing', 'Referral Tracking', 'Multi-site Scheduling', 'Time Zone Management', 'Patient Portals'],
        learningObjectives: [
          'Optimize provider schedules using EHR templates.',
          'Manage complex multi-site and time-zone sensitive scheduling.',
          'Implement effective no-show and appointment reminder strategies.',
          'Support telehealth setup and patient portal onboarding.'
        ]
      },
      {
        id: 'mr-3',
        title: 'Insurance & Financial Coordination',
        duration: '8h',
        daysToComplete: 5,
        topics: ['Eligibility Verification', 'Prior Authorizations', 'Deductible Tracking', 'Secondary Insurance', 'Financial Counseling Basics'],
        learningObjectives: [
          'Perform real-time insurance eligibility verification.',
          'Understand the prior authorization lifecycle.',
          'Communicate financial responsibilities to patients clearly.'
        ]
      },
      {
        id: 'mr-4',
        title: 'Telehealth & Virtual Care Coordination',
        duration: '8h',
        daysToComplete: 5,
        topics: ['Virtual Check-in', 'Platform Troubleshooting', 'Digital Consent', 'Remote Patient Monitoring Basics', 'Telehealth Billing Rules'],
        learningObjectives: [
          'Coordinate seamless virtual patient check-in experiences.',
          'Troubleshoot common technical issues with telehealth platforms.',
          'Manage digital consent and remote patient monitoring workflows.'
        ]
      },
      {
        id: 'mr-5',
        title: 'Patient Experience & Conflict Resolution',
        duration: '6h',
        daysToComplete: 3,
        topics: ['Empathy in Healthcare', 'Managing Wait Times', 'Handling Difficult Conversations', 'Service Recovery', 'Patient Satisfaction Surveys'],
        learningObjectives: [
          'Apply empathy-driven communication in high-stress healthcare environments.',
          'Execute service recovery protocols when patient expectations are not met.',
          'Analyze patient satisfaction data to improve front-desk operations.'
        ]
      },
      {
        id: 'mr-6',
        title: 'Hybrid Coordination Essentials',
        duration: '8h',
        daysToComplete: 5,
        topics: ['Basic Medical Coding for Receptionists', 'Billing Workflow Integration', 'Clinical Triage Basics', 'Inter-departmental Communication', 'Hybrid VA Productivity Tools'],
        learningObjectives: [
          'Understand how front-desk data impacts the billing and coding cycle.',
          'Perform basic clinical triage to direct urgent patient needs.',
          'Master cross-functional communication tools for hybrid teams.'
        ]
      }
    ]
  },
  {
    id: 'medical-biller',
    name: 'Medical Biller',
    pathway: 'Revenue Cycle',
    description: 'Processing claims, managing denials, and ensuring timely reimbursement for healthcare facilities.',
    assignmentCriteria: 'High scores in Claims Processing, Denial Management, and RCM.',
    skills: [
      { name: 'Claims Processing', description: 'Review and prepare medical claims by verifying coding accuracy, ensuring necessary documentation, and checking for compliance with insurance requirements.' },
      { name: 'Claims Submission', description: 'Submit claims to insurance companies electronically or by paper, ensuring timely and accurate delivery based on payer guidelines.' },
      { name: 'Denial Management', description: 'Investigate denied or rejected claims, identify root causes, correct errors, and resubmit or appeal to recover reimbursement.' },
      { name: 'Payment Posting', description: 'Enter insurance and patient payments into billing systems, reconcile Explanation of Benefits (EOBs), and resolve any payment discrepancies.' },
      { name: 'Insurance Verification', description: 'Confirm patients\' insurance eligibility, benefits, and authorization requirements before services are rendered to prevent claim issues.' },
      { name: 'Billing Inquiries', description: 'Respond to patient and payer questions regarding charges, statements, balances, and coverage in a professional and timely manner.' },
      { name: 'Account Management', description: 'Maintain accurate patient billing records, track outstanding balances, and initiate collections or payment plans as needed.' },
      { name: 'Revenue Cycle Management', description: 'Oversee the full financial process from patient intake to final payment, ensuring a steady flow of income and reduced accounts receivable.' }
    ],
    curriculum: [
      { 
        id: 'mb-1', 
        title: 'RCM Ecosystem', 
        duration: '15h', 
        daysToComplete: 10, 
        topics: ['Claim Lifecycle', 'Clearinghouses', 'ERA/EOB Analysis', 'Payer Rules', 'Credentialing Basics', 'Fee Schedules', 'Patient Statements', 'Aging Reports', 'Write-off Policies', 'Audit Trails'],
        learningObjectives: [
          'Map the entire lifecycle of a medical claim.',
          'Analyze ERA and EOB documents for payment accuracy.',
          'Manage accounts receivable through aging reports and follow-up.',
          'Understand payer-specific rules and fee schedules.'
        ]
      },
      { 
        id: 'mb-2', 
        title: 'Denial Mastery', 
        duration: '20h', 
        daysToComplete: 14, 
        topics: ['Root Cause Analysis', 'Appeal Letter Writing', 'Payer Policy Research', 'Timely Filing Limits', 'COB Issues', 'Medical Necessity Appeals', 'Level 1 vs Level 2 Appeals', 'Tracking Denial Trends', 'Payer Portals', 'Re-billing Protocols'],
        learningObjectives: [
          'Identify root causes of claim denials using data analysis.',
          'Draft persuasive and clinically-supported appeal letters.',
          'Navigate payer portals for real-time claim status and policy research.',
          'Execute effective re-billing protocols within timely filing limits.'
        ]
      },
      {
        id: 'mb-3',
        title: 'Advanced Billing Compliance',
        duration: '10h',
        daysToComplete: 7,
        topics: ['Fraud & Abuse Prevention', 'OIG Work Plan', 'Compliance Programs', 'Internal Auditing', 'Refunds & Overpayments'],
        learningObjectives: [
          'Implement internal auditing processes to ensure billing compliance.',
          'Recognize and prevent potential fraud and abuse scenarios.',
          'Manage overpayments and refunds according to federal guidelines.'
        ]
      },
      {
        id: 'mb-4',
        title: 'Payer-Specific Billing (Medicare/Medicaid/Private)',
        duration: '12h',
        daysToComplete: 10,
        topics: ['Medicare Parts A-D', 'Medicaid Managed Care', 'Blue Cross Blue Shield Rules', 'Worker\'s Comp Billing', 'Personal Injury Claims'],
        learningObjectives: [
          'Navigate the specific billing requirements for federal and state programs.',
          'Master the nuances of private payer rules and commercial insurance.',
          'Manage complex billing scenarios for Worker\'s Comp and Personal Injury.'
        ]
      },
      {
        id: 'mb-5',
        title: 'RCM Analytics & Reporting',
        duration: '10h',
        daysToComplete: 7,
        topics: ['KPI Tracking', 'Net Collection Ratio', 'Days in AR', 'Denial Rate Analysis', 'Financial Forecasting'],
        learningObjectives: [
          'Calculate and interpret key performance indicators (KPIs) for RCM.',
          'Develop financial reports to track practice health and collection efficiency.',
          'Use data analytics to forecast revenue and identify process bottlenecks.'
        ]
      },
      {
        id: 'mb-6',
        title: 'Hybrid Billing & Coding Integration',
        duration: '12h',
        daysToComplete: 10,
        topics: ['Coding for Billers', 'Clinical Documentation Improvement (CDI) for RCM', 'Audit Defense Strategies', 'Telehealth Billing Nuances', 'Multi-Specialty Billing Challenges'],
        learningObjectives: [
          'Identify coding errors that lead to billing denials.',
          'Collaborate with coders on CDI initiatives to improve clean claim rates.',
          'Navigate the complexities of multi-specialty and telehealth billing.'
        ]
      }
    ]
  },
  {
    id: 'medical-admin-assistant',
    name: 'Medical Administrative Assistant',
    pathway: 'Administrative',
    description: 'A versatile hybrid role blending front-desk, secretarial, and coordination duties.',
    assignmentCriteria: 'Balanced scores in Coordination, Records Management, and EA Support.',
    skills: [
      { name: 'Appointment Scheduling', description: 'Book, reschedule, and confirm patient appointments while managing provider calendars efficiently.' },
      { name: 'Insurance Verification', description: 'Confirm patients’ insurance eligibility and benefits prior to appointments to ensure proper coverage and billing.' },
      { name: 'Records Management', description: 'Maintain, update, and organize patient medical records in compliance with HIPAA and facility standards.' },
      { name: 'Front Office Coordination', description: 'Coordinate communication between patients and providers by relaying messages, sharing updates, and confirming information. Work directly with providers to manage schedules, prepare necessary documentation, and follow up on action items, while also handling appointment reminders and patient inquiries.' },
      { name: 'Billing Support', description: 'Assist with collecting co-pays, generating invoices, and preparing documentation for insurance claims.' },
      { name: 'Patient Correspondence', description: 'Handle referrals, send appointment reminders, manage lab orders, and communicate provider instructions.' },
      { name: 'Prior Authorization', description: 'Verify insurance coverage, prepare and submit prior authorization requests to payers, track approval status, and communicate outcomes to the provider or patient to prevent delays in care. Maintain accurate records of requests and approvals for compliance and billing purposes.' },
      { name: 'EA Support', description: 'Manage calendars, coordinate meetings, and track deadlines. Oversee email and document management, organize digital files, compile reports, and prepare agendas or minutes. Support project coordination, follow up on tasks, and liaise with teams and external contacts to keep workflows on track.' }
    ],
    curriculum: [
      { 
        id: 'maa-1', 
        title: 'The Hybrid VA', 
        duration: '15h', 
        daysToComplete: 10, 
        topics: ['Multitasking', 'Cross-dept Sync', 'Conflict Resolution', 'Medical Secretary Duties', 'Transcription Basics', 'Insurance Coordination', 'Patient Advocacy', 'Office Supply Management', 'Staff Scheduling', 'Facility Compliance'],
        learningObjectives: [
          'Balance diverse administrative and clinical support tasks efficiently.',
          'Coordinate communication across multiple healthcare departments.',
          'Apply conflict resolution techniques in a professional setting.',
          'Master medical transcription and documentation basics.'
        ]
      },
      { 
        id: 'maa-2', 
        title: 'Advanced Admin Ops', 
        duration: '12h', 
        daysToComplete: 10, 
        topics: ['Budgeting', 'Vendor Management', 'Credentialing Support', 'Meeting Minutes', 'Legal Documentation', 'Policy Drafting', 'Quality Assurance', 'Internal Audits', 'HR Support', 'Onboarding VAs'],
        learningObjectives: [
          'Support executive functions including budgeting and vendor management.',
          'Draft professional medical policies and legal documentation.',
          'Manage the credentialing process for new healthcare providers.',
          'Execute quality assurance and internal audit protocols.'
        ]
      },
      {
        id: 'maa-3',
        title: 'Hybrid Clinical & Admin Synergy',
        duration: '15h',
        daysToComplete: 14,
        topics: ['Medical Scribe Basics for MAAs', 'Clinical Workflow Mapping', 'Patient Care Coordination', 'Health Tech Stack Management', 'Advanced Patient Advocacy'],
        learningObjectives: [
          'Bridge the gap between administrative tasks and clinical documentation.',
          'Map and optimize end-to-end patient care workflows.',
          'Manage complex health technology stacks for virtual practices.'
        ]
      }
    ]
  },
  {
    id: 'medical-coder',
    name: 'Medical Coder',
    pathway: 'Revenue Cycle',
    description: 'Reviewing clinical documentation and assigning standardized codes for billing and compliance.',
    assignmentCriteria: 'Expertise in ICD/CPT Coding and Clinical Documentation Review.',
    skills: [
      { name: 'Clinical Documentation Review', description: 'Analyze provider notes, operative reports, and diagnostic findings for code assignment.' },
      { name: 'ICD/CPT Coding', description: 'Translate diagnoses, procedures, and services into standardized medical codes (ICD-10, CPT, HCPCS).' },
      { name: 'Coding Accuracy Compliance', description: 'Verify correct code usage based on payer guidelines, NCCI edits, and medical necessity.' },
      { name: 'Billing Collaboration', description: 'Collaborate with billing staff to ensure proper claim creation and reimbursement.' },
      { name: 'Denial Management', description: 'Investigate, correct, and resubmit coding-related denials to optimize revenue cycle performance.' },
      { name: 'Specialty & HCC Coding', description: 'Apply coding for complex areas such as surgery, oncology, or HCC risk adjustment models.' },
      { name: 'Provider CDI Training', description: 'Train clinicians on documentation best practices to support accurate coding and reimbursement.' },
      { name: 'Code Update Monitoring', description: 'Monitor and apply annual updates to ICD-10-CM, CPT, and payer-specific coding guidelines.' }
    ],
    curriculum: [
      { 
        id: 'mc-1', 
        title: 'Advanced ICD-10', 
        duration: '25h', 
        daysToComplete: 21, 
        topics: ['General Guidelines', 'Infectious Diseases', 'Neoplasms', 'Endocrine Systems', 'Mental Disorders', 'Nervous Systems', 'Circulatory Systems', 'Respiratory Systems', 'Digestive Systems', 'Skin & Subcutaneous'],
        learningObjectives: [
          'Apply complex ICD-10 coding guidelines across multiple body systems.',
          'Ensure coding accuracy for chronic and infectious disease states.',
          'Master neoplasms and endocrine system coding requirements.',
          'Navigate the ICD-10-CM alphabetical index and tabular list with precision.'
        ]
      },
      { 
        id: 'mc-2', 
        title: 'Procedural Coding', 
        duration: '30h', 
        daysToComplete: 30, 
        topics: ['CPT Modifiers', 'Surgical Coding', 'E&M Levels', 'Radiology Coding', 'Pathology/Lab', 'Medicine Section', 'HCPCS Level II', 'Anesthesia Coding', 'NCCI Edits', 'Global Packages'],
        learningObjectives: [
          'Master CPT modifier application to ensure maximum reimbursement.',
          'Accurately assign E&M levels based on clinical documentation.',
          'Navigate NCCI edits and global surgical package rules.',
          'Code complex surgical and diagnostic procedures with high accuracy.'
        ]
      },
      {
        id: 'mc-3',
        title: 'Risk Adjustment & HCC',
        duration: '15h',
        daysToComplete: 14,
        topics: ['HCC Models', 'Risk Scores', 'Documentation Gaps', 'MEAT Criteria', 'Annual Wellness Visits'],
        learningObjectives: [
          'Understand Hierarchical Condition Category (HCC) models and risk scoring.',
          'Identify documentation gaps that impact risk adjustment.',
          'Apply MEAT criteria (Monitor, Evaluate, Assess, Treat) for HCC coding.'
        ]
      },
      {
        id: 'mc-4',
        title: 'Specialty Coding (Cardiology & Orthopedics)',
        duration: '20h',
        daysToComplete: 14,
        topics: ['Cardiac Catheterization', 'EP Studies', 'Joint Replacements', 'Spine Surgery', 'Fracture Care Coding'],
        learningObjectives: [
          'Master the complex coding requirements for interventional cardiology.',
          'Accurately code orthopedic surgical procedures and fracture care.',
          'Understand specialty-specific documentation requirements for high-value claims.'
        ]
      },
      {
        id: 'mc-5',
        title: 'Coding Audits & Compliance',
        duration: '15h',
        daysToComplete: 14,
        topics: ['Internal Audit Workflows', 'External Audit Defense', 'RAC Audits', 'UPIC Audits', 'Compliance Reporting'],
        learningObjectives: [
          'Conduct internal coding audits to identify and correct systemic errors.',
          'Prepare documentation and rationales for external audit defense.',
          'Implement compliance monitoring programs to mitigate legal and financial risk.'
        ]
      },
      {
        id: 'mc-6',
        title: 'Hybrid Coding & Clinical Scribing',
        duration: '12h',
        daysToComplete: 10,
        topics: ['Real-time Coding during Scribing', 'Clinical Narrative Analysis', 'Physician Query Optimization', 'Coding for Value-Based Care', 'AI in Medical Coding'],
        learningObjectives: [
          'Apply coding knowledge during real-time clinical documentation.',
          'Optimize physician queries to improve documentation specificity.',
          'Understand the impact of coding on value-based care models.'
        ]
      }
    ]
  },
  {
    id: 'medical-scribe',
    name: 'Medical Scribe',
    pathway: 'Clinical',
    description: 'Documentation specialist entering real-time notes into the EHR to improve clinical efficiency.',
    assignmentCriteria: 'High scores in Live Scribing and Assessment & Plan Recording.',
    skills: [
      { name: 'Live Scribe', description: 'Provide real-time documentation support during patient encounters via phone or video, accurately capturing provider–patient interactions directly into the EMR/EHR. Document in SOAP (Subjective, Objective, Assessment, Plan) format when required, ensuring clarity, completeness, and compliance with medical documentation standards.' },
      { name: 'Patient History Entry', description: 'Accurately enter the patient\'s chief complaint, history of present illness (HPI), past medical history, medications, allergies, and family/social history.' },
      { name: 'Transcribing', description: 'Convert recorded provider notes, dictations, and meeting audio into accurate written medical documentation. Apply proper medical terminology and formatting, including SOAP note structure, while maintaining confidentiality and data accuracy.' },
      { name: 'Assessment & Plan Recording', description: 'Record the physician’s diagnoses, treatment plans, follow-up instructions, and referrals.' },
      { name: 'Order Entry Assistance', description: 'Assist by inputting orders for labs, imaging, prescriptions, or consults under direct supervision (note: scribes don’t submit orders independently).' },
      { name: 'EHR Template Management', description: 'Help maintain and customize chart templates or note formats to streamline provider documentation.' },
      { name: 'Clinical Alert Monitoring', description: 'Watch for flags such as medication interactions, missing documentation, or incomplete fields, and alert the provider when needed.' },
      { name: 'Pre/Post Charting', description: 'Assist with pre-visit preparation by reviewing patient records and entering relevant details into the EMR/EHR prior to appointments. After visits, complete or organize provider notes in SOAP format, update charts with test results, and enter coding information for billing and follow-up care.' },
      { name: 'Workflow Support', description: 'Work closely with the provider to maintain pace during rounds or high-volume clinic days and reduce charting time after hours.' }
    ],
    curriculum: [
      { 
        id: 'ms-1', 
        title: 'Charting Excellence', 
        duration: '40h', 
        daysToComplete: 45, 
        topics: ['HPI Construction', 'Physical Exam Findings', 'Assessment & Plan', 'Medical Terminology', 'Anatomy & Physiology', 'Pharmacology Basics', 'Lab Interpretation', 'Imaging Results', 'Clinical Decision Making', 'Surgical Notes'],
        learningObjectives: [
          'Construct high-quality History of Present Illness (HPI) narratives.',
          'Accurately record physical exam findings in real-time.',
          'Translate complex clinical encounters into structured Assessment & Plan notes.',
          'Interpret lab and imaging results for accurate documentation.'
        ]
      },
      { 
        id: 'ms-2', 
        title: 'EHR Optimization', 
        duration: '15h', 
        daysToComplete: 10, 
        topics: ['SmartPhrases', 'Macros', 'Order Entry', 'Clinical Alerts', 'Meaningful Use', 'Quality Metrics', 'Patient History', 'Family/Social History', 'Review of Systems', 'Physical Exam Templates'],
        learningObjectives: [
          'Develop and manage custom SmartPhrases and macros to increase efficiency.',
          'Navigate order entry systems under provider supervision.',
          'Ensure all quality metrics and meaningful use requirements are documented.',
          'Optimize EHR templates for specific provider workflows.'
        ]
      },
      {
        id: 'ms-3',
        title: 'Hybrid Scribe & Patient Educator',
        duration: '10h',
        daysToComplete: 7,
        topics: ['Patient Education Documentation', 'Translating Clinical Plans for Patients', 'Health Coaching Basics', 'Remote Patient Monitoring Data Entry', 'Preventive Care Reminders'],
        learningObjectives: [
          'Document patient education sessions accurately in the EHR.',
          'Translate complex clinical plans into patient-friendly summaries.',
          'Support remote patient monitoring and preventive care workflows.'
        ]
      }
    ]
  },
  {
    id: 'health-educator',
    name: 'Health Educator',
    pathway: 'Clinical',
    description: 'Remote patient education, administrative coordination, and communication support.',
    assignmentCriteria: 'Strong scores in Patient Education and Content Creation.',
    skills: [
      { name: 'Patient Education Support', description: 'Guide patients or clients through lifestyle adjustments, preventive health practices, or treatment plan instructions using structured teaching techniques (e.g., teach-back method).' },
      { name: 'Educational Content Creation', description: 'Develop patient-facing materials such as brochures, infographics, presentations, and online health modules based on verified clinical guidelines (CDC, WHO, DOH).' },
      { name: 'Follow-Up Communication', description: 'Conduct reminders, post-consultation check-ins, and feedback calls/messages to reinforce adherence and gather patient insights.' },
      { name: 'Call/Message Handling', description: 'Manage inbound/outbound communication, answer non-emergency health inquiries, and triage messages and escalate to the appropriate provider when needed.' },
      { name: 'Administrative Assistance', description: 'Support general office tasks such as email handling, calendar management, record updates, and coordination of health education activities.' },
      { name: 'Scheduling & Coordination', description: 'Arrange webinars, workshops, and one-on-one education sessions; coordinate logistics between patients, providers, and external partners.' },
      { name: 'Data Entry & Documentation', description: 'Accurately enter education records, health logs, and session notes into EMRs, spreadsheets, or other tracking systems, while maintaining privacy and compliance.' },
      { name: 'Clinical Content Research & Validation', description: 'Review and validate health information against trusted sources (peer-reviewed journals, government health advisories, WHO/CDC guidance) to support accurate education.' },
      { name: 'Program Evaluation & Reporting', description: 'Track attendance, outcomes, and patient satisfaction; generate reports to evaluate program effectiveness and suggest improvements.' },
      { name: 'Health Screening Tool Administration', description: 'Support clinicians by administering standardized questionnaires or tools remotely (e.g., BMI, lifestyle risk assessments, depression screenings), then recording results for review.' }
    ],
    curriculum: [
      { 
        id: 'he-1', 
        title: 'Patient Advocacy', 
        duration: '12h', 
        daysToComplete: 10, 
        topics: ['Empathy', 'Health Literacy', 'Chronic Disease Management', 'Preventive Care', 'Nutrition Basics', 'Exercise Guidance', 'Mental Health Support', 'Community Resources', 'Support Groups', 'Patient Portals'],
        learningObjectives: [
          'Apply empathy and active listening in patient education sessions.',
          'Translate complex medical info into patient-friendly language.',
          'Support patients in managing chronic conditions through education.',
          'Connect patients with relevant community and mental health resources.'
        ]
      },
      {
        id: 'he-2',
        title: 'Health Content Strategy',
        duration: '10h',
        daysToComplete: 7,
        topics: ['Visual Communication', 'Infographic Design', 'Webinar Hosting', 'Social Media for Health', 'Evidence-Based Research'],
        learningObjectives: [
          'Design effective health education materials and infographics.',
          'Host engaging remote health education webinars.',
          'Leverage social media for public health awareness and education.'
        ]
      },
      {
        id: 'he-3',
        title: 'Hybrid Health Educator & Admin Support',
        duration: '8h',
        daysToComplete: 5,
        topics: ['Care Coordination Admin', 'Referral Tracking for Educators', 'Patient Portal Management', 'Health Program Marketing', 'Outcome Data Analysis'],
        learningObjectives: [
          'Manage the administrative side of health education programs.',
          'Track referrals and patient engagement using portal data.',
          'Analyze program outcomes to demonstrate clinical value.'
        ]
      }
    ]
  },
  {
    id: 'dental-biller',
    name: 'Dental Biller',
    pathway: 'Revenue Cycle',
    description: 'Managing financial and insurance aspects of dental care using CDT coding.',
    assignmentCriteria: 'High scores in CDT Coding and Dental Record Keeping.',
    skills: [
      { name: 'Insurance Verification', description: 'Confirm dental insurance eligibility, coverage details, and plan limitations before treatment.' },
      { name: 'Code Entry (CDT)', description: 'Accurately assign CDT (Current Dental Terminology) codes based on documented procedures.' },
      { name: 'Claim Submission', description: 'Prepare and send insurance claims electronically or manually for timely reimbursement.' },
      { name: 'Claim Tracking', description: 'Monitor outstanding claims, follow up on delays, and resubmit as needed.' },
      { name: 'Denial Management', description: 'Investigate rejected claims, correct errors, and file appeals to secure payment.' },
      { name: 'Payment Posting', description: 'Apply insurance payments to patient accounts and reconcile Explanation of Benefits (EOBs).' },
      { name: 'Patient Billing', description: 'Generate patient statements and collect co-pays, deductibles, or uncovered balances.' },
      { name: 'Billing Inquiries', description: 'Respond to patient or insurance questions regarding charges, coverage, or payments.' },
      { name: 'Record Keeping', description: 'Ensure accurate documentation of transactions in the dental billing software.' },
      { name: 'Code Updates', description: 'Keep current with CDT code updates and insurance guidelines to ensure compliance.' }
    ],
    curriculum: [
      { 
        id: 'db-1', 
        title: 'Dental RCM', 
        duration: '15h', 
        daysToComplete: 10, 
        topics: ['CDT Basics', 'Dental Payers', 'Pre-determinations', 'Radiograph Attachment', 'Narrative Writing', 'Dental Terminology', 'Tooth Numbering Systems', 'Surface Coding', 'Ortho Billing', 'Periodontal Charting'],
        learningObjectives: [
          'Master CDT coding and tooth numbering systems.',
          'Manage dental pre-determinations and radiograph attachments.',
          'Write effective clinical narratives for dental claim support.',
          'Navigate complex ortho and periodontal billing scenarios.'
        ]
      },
      {
        id: 'db-2',
        title: 'Advanced Dental Claims',
        duration: '10h',
        daysToComplete: 7,
        topics: ['Coordination of Benefits', 'Medicaid Dental', 'Oral Surgery Billing', 'Dental-Medical Cross-coding'],
        learningObjectives: [
          'Manage complex coordination of benefits for dental claims.',
          'Understand Medicaid-specific dental billing requirements.',
          'Execute dental-to-medical cross-coding for relevant procedures.'
        ]
      },
      {
        id: 'db-3',
        title: 'Hybrid Dental Billing & Front-Office',
        duration: '10h',
        daysToComplete: 7,
        topics: ['Treatment Planning for Billers', 'Dental Insurance Counseling', 'Collections for Dental VAs', 'Dental Software Integration', 'Recall System Optimization'],
        learningObjectives: [
          'Integrate billing knowledge into patient treatment planning.',
          'Provide expert insurance counseling to dental patients.',
          'Optimize dental recall systems to improve practice revenue.'
        ]
      }
    ]
  },
  {
    id: 'dental-receptionist',
    name: 'Dental Receptionist',
    pathway: 'Administrative',
    description: 'Front-line representative managing dental office operations and patient coordination.',
    assignmentCriteria: 'High scores in Dental Front Desk and Treatment Estimates.',
    skills: [
      { name: 'Front Desk (Virtual)', description: 'Serve as the first point of contact for patients via phone, email, or chat. Handle appointment scheduling, rescheduling, and cancellations; confirm patient details; send reminders for upcoming visits; and provide information on office hours, procedures, and payment policies.' },
      { name: 'Insurance Verification', description: 'Confirm patient eligibility, coverage, and any pre-authorization requirements before treatment.' },
      { name: 'Payment Processing', description: 'Collect co-pays and balances, process credit card transactions, and provide receipts.' },
      { name: 'Manage Treatment Estimates', description: 'Generate and explain treatment plans, including cost estimates and insurance coverage.' },
      { name: 'Record Management', description: 'Enter and maintain accurate patient data in the dental practice management system (e.g., Dentrix, Eaglesoft).' },
      { name: 'Team Coordination', description: 'Communicate patient needs, updates, or special instructions to the dental hygienist or dentist.' },
      { name: 'Patient Follow-up', description: 'Call or message patients for recall visits, post-op check-ins, or outstanding paperwork or balances.' }
    ],
    curriculum: [
      { 
        id: 'dr-1', 
        title: 'Dental Front-Office', 
        duration: '12h', 
        daysToComplete: 10, 
        topics: ['Dental Terminology', 'Recall Systems', 'Treatment Presentation', 'Financial Arrangements', 'Dental Insurance Basics', 'Hygiene Scheduling', 'Lab Tracking', 'Patient Communication', 'Dental Software Mastery', 'Emergency Triage'],
        learningObjectives: [
          'Master dental-specific terminology and recall systems.',
          'Effectively present treatment plans and financial arrangements.',
          'Optimize hygiene schedules for maximum practice efficiency.',
          'Manage lab tracking and dental emergency triage protocols.'
        ]
      },
      {
        id: 'dr-2',
        title: 'Hybrid Dental Receptionist & Billing Support',
        duration: '10h',
        daysToComplete: 7,
        topics: ['Basic Dental Coding (CDT) for Receptionists', 'Insurance Verification Mastery', 'Dental Claim Follow-up Basics', 'Patient Ledger Management', 'Virtual Dental Office Workflows'],
        learningObjectives: [
          'Understand CDT coding basics to support accurate billing.',
          'Perform expert-level dental insurance verification.',
          'Manage patient ledgers and virtual office workflows efficiently.'
        ]
      }
    ]
  }
];
