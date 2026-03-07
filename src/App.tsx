import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  onSnapshot,
  getDocFromServer
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { 
  UserPlus, 
  UserCheck, 
  User,
  ClipboardCheck, 
  Target, 
  BookOpen, 
  Briefcase, 
  Award, 
  BarChart3, 
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  Stethoscope,
  Activity,
  HeartPulse,
  FileText,
  Calendar,
  ShieldCheck,
  Video,
  FileCheck,
  Building2,
  Search,
  Info,
  X,
  Zap,
  TrendingUp,
  Map
} from 'lucide-react';
import { cn } from './lib/utils';
import { VAStatus, ProgramStep, UserState, TRACKS, Track, Skill, ASSESSMENT_QUESTIONS, BASELINE_ROLES, BASELINE_SKILLS, EXPERIENCE_LEVELS } from './types';

const SkillModal = ({ skill, onClose }: { skill: Skill; onClose: () => void }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm"
    onClick={onClose}
  >
    <motion.div 
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
          <Zap className="w-6 h-6" />
        </div>
        <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
          <X className="w-5 h-5 text-zinc-400" />
        </button>
      </div>
      <h3 className="text-2xl font-bold mb-2">{skill.name}</h3>
      <p className="text-zinc-500 leading-relaxed mb-6">{skill.description}</p>
      <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
        <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Upskilling Goal</h4>
        <p className="text-sm font-medium text-zinc-700">Master this skill to increase your billable rate by up to 15%.</p>
      </div>
    </motion.div>
  </motion.div>
);

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-6">
          <div className="max-w-md w-full glass-card p-10 rounded-[2.5rem] text-center space-y-6">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
              <Activity className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900">Something went wrong</h2>
            <p className="text-zinc-500 text-sm">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

function AppContent() {
  const [state, setState] = useState<UserState>({
    status: null,
    currentStep: 'entry',
    baselineRoles: [],
    baselineSkills: [],
    baselineRole: null,
    experienceLevel: null,
    assessmentResults: null,
    averageScore: null,
    assignedTrack: null,
    recommendedTrackId: null,
    completedModules: [],
    completedTopics: [],
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [baselineSubStep, setBaselineSubStep] = useState<'roles' | 'skills'>('roles');

  // Test Connection
  useEffect(() => {
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();
  }, []);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsLoggedIn(!!u);
      setIsAuthReady(true);
    });
    return unsubscribe;
  }, []);

  // Firestore Listener
  useEffect(() => {
    if (!user) return;
    
    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setState(prev => ({
          ...prev,
          ...data,
          assignedTrack: TRACKS.find(t => t.id === data.assignedTrackId) || prev.assignedTrack
        }));
      }
    }, (error) => {
      handleFirestoreError(error, 'get', `users/${user.uid}`);
    });
    
    return unsubscribe;
  }, [user]);

  const handleFirestoreError = (error: any, operationType: string, path: string | null) => {
    const errInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified,
        isAnonymous: auth.currentUser?.isAnonymous,
        tenantId: auth.currentUser?.tenantId,
        providerInfo: auth.currentUser?.providerData.map(provider => ({
          providerId: provider.providerId,
          displayName: provider.displayName,
          email: provider.email,
          photoUrl: provider.photoURL
        })) || []
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  };

  const saveState = async (newState: UserState) => {
    if (!user) return;
    try {
      const { assignedTrack, ...rest } = newState;
      await setDoc(doc(db, 'users', user.uid), {
        ...rest,
        assignedTrackId: assignedTrack?.id || null,
        uid: user.uid,
        email: user.email,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, 'write', `users/${user.uid}`);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setShowLoginModal(false);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      resetApp();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const steps: { id: ProgramStep; label: string; icon: any }[] = [
    { id: 'entry', label: 'Discovery', icon: Search },
    { id: 'baseline', label: 'Baseline', icon: User },
    { id: 'assessment', label: 'Diagnostic', icon: ClipboardCheck },
    { id: 'assignment', label: 'Mapping', icon: Map },
    { id: 'upskilling', label: 'Specialization', icon: BookOpen },
    { id: 'application', label: 'Simulation', icon: Briefcase },
    { id: 'vetting', label: 'Vetting', icon: ShieldCheck },
    { id: 'certification', label: 'Credentialing', icon: Award },
    { id: 'placement', label: 'Placement', icon: UserPlus },
    { id: 'kpi', label: 'Growth', icon: BarChart3 },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === state.currentStep);

  const getTier = (score: number | null) => {
    if (score === null) return null;
    if (score < 70) return { name: 'Tier 1', label: 'Entry', color: 'bg-zinc-100 text-zinc-700', border: 'border-zinc-200' };
    if (score < 85) return { name: 'Tier 2', label: 'Specialist', color: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-200' };
    return { name: 'Tier 3', label: 'Expert', color: 'bg-indigo-100 text-indigo-700', border: 'border-indigo-200' };
  };

  const getTieredRate = (score: number | null) => {
    if (score === null) return "$8-10/hr";
    if (score < 70) return "$8-10/hr";
    if (score < 85) return "$12-15/hr";
    return "$18-25/hr";
  };

  const handleStatusSelect = (status: VAStatus) => {
    const newState = { ...state, status, currentStep: 'baseline' as ProgramStep };
    setState(newState);
    saveState(newState);
  };

  const handleBaselineSubmit = () => {
    // Basic track assignment based on selected roles
    let assignedTrackId = 'medical-receptionist';
    
    if (state.baselineRoles.some(r => r.role === 'Medical Biller')) assignedTrackId = 'medical-biller';
    else if (state.baselineRoles.some(r => r.role === 'Medical Coder')) assignedTrackId = 'medical-coder';
    else if (state.baselineRoles.some(r => r.role === 'Medical Scribe')) assignedTrackId = 'medical-scribe';
    else if (state.baselineRoles.some(r => r.role === 'Health Educator')) assignedTrackId = 'health-educator';
    else if (state.baselineRoles.some(r => r.role === 'Dental Biller')) assignedTrackId = 'dental-biller';
    else if (state.baselineRoles.some(r => r.role === 'Dental Receptionist')) assignedTrackId = 'dental-receptionist';
    else if (state.baselineRoles.some(r => r.role === 'Medical Administrative Assistant')) assignedTrackId = 'medical-admin-assistant';

    const track = TRACKS.find(t => t.id === assignedTrackId) || TRACKS[0];

    const newState = { 
      ...state, 
      currentStep: 'assessment' as ProgramStep,
      assignedTrack: track
    };
    setState(newState);
    saveState(newState);
  };

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showInsight, setShowInsight] = useState(false);

  const handleAnswer = (questionId: number, option: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
    setShowInsight(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setShowInsight(false);
    } else {
      handleAssessmentComplete();
    }
  };

  const handleAssessmentComplete = () => {
    // Calculate results based on answers
    const results: Record<string, number> = {};
    const categoryTotals: Record<string, number> = {};

    ASSESSMENT_QUESTIONS.forEach(q => {
      if (!results[q.category]) {
        results[q.category] = 0;
        categoryTotals[q.category] = 0;
      }
      categoryTotals[q.category] += 10; // Each question is worth 10 points
      if (answers[q.id] === q.correctAnswer) {
        results[q.category] += 10;
      }
    });

    // Convert to percentages
    const finalResults: Record<string, number> = {};
    let totalScore = 0;
    const categories = Object.keys(results);
    categories.forEach(cat => {
      finalResults[cat] = Math.round((results[cat] / categoryTotals[cat]) * 100);
      totalScore += finalResults[cat];
    });

    const averageScore = Math.round(totalScore / categories.length);

    // 10x Right-skilling logic: Identify the best aptitude match
    const categoryMap: Record<string, string[]> = {
      'dental-billing': ['dental-biller'],
      'ehr-navigation': ['medical-scribe', 'medical-admin-assistant'],
      'hipaa-compliance': ['medical-receptionist', 'dental-receptionist'],
      'patient-communication': ['health-educator', 'medical-receptionist'],
      'medical-terminology': ['medical-coder', 'medical-scribe'],
    };

    const highestCategory = Object.entries(finalResults).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    const possibleTracks = categoryMap[highestCategory] || ['medical-receptionist'];
    const recommendedId = possibleTracks[Math.floor(Math.random() * possibleTracks.length)];

    const newState = { 
      ...state, 
      assessmentResults: finalResults, 
      averageScore,
      currentStep: 'assignment' as ProgramStep,
      recommendedTrackId: recommendedId
    };
    setState(newState);
    saveState(newState);
  };

  const toggleTopic = (topic: string, moduleId: string) => {
    setState(prev => {
      const isCompleted = prev.completedTopics.includes(topic);
      const newTopics = isCompleted 
        ? prev.completedTopics.filter(t => t !== topic)
        : [...prev.completedTopics, topic];
      
      // Check if all topics in module are completed
      const module = prev.assignedTrack?.curriculum.find(m => m.id === moduleId);
      const allCompleted = module?.topics.every(t => newTopics.includes(t));
      
      const newModules = allCompleted 
        ? [...prev.completedModules.filter(id => id !== moduleId), moduleId]
        : prev.completedModules.filter(id => id !== moduleId);

      const newState = { ...prev, completedTopics: newTopics, completedModules: newModules };
      saveState(newState);
      return newState;
    });
  };

  const nextStep = () => {
    const nextIdx = currentStepIndex + 1;
    if (nextIdx < steps.length) {
      const newState = { ...state, currentStep: steps[nextIdx].id };
      setState(newState);
      saveState(newState);
    }
  };

  const resetApp = () => {
    setState({
      status: null,
      currentStep: 'entry',
      baselineRoles: [],
      baselineSkills: [],
      baselineRole: null,
      experienceLevel: null,
      assessmentResults: null,
      averageScore: null,
      assignedTrack: null,
      recommendedTrackId: null,
      completedModules: [],
      completedTopics: [],
    });
    setCurrentQuestionIdx(0);
    setAnswers({});
    setShowInsight(false);
    setBaselineSubStep('roles');
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Initializing Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 py-4 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={resetApp}
          >
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center group-hover:bg-zinc-900 transition-colors">
              <Stethoscope className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight group-hover:text-emerald-600 transition-colors">Healthcare VA Upskill</h1>
              <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider">Medical & Dental Specialist Path</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={resetApp}
              className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors hidden sm:block"
            >
              Home
            </button>
            <button 
              onClick={() => {
                if (isLoggedIn) {
                  setState(prev => ({ ...prev, currentStep: 'profile' }));
                } else {
                  setShowLoginModal(true);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 rounded-full transition-all group"
            >
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <User className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-600">{isLoggedIn ? 'Profile' : 'Login'}</span>
            </button>
            {state.status && (
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider",
                state.status === 'placed' ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
              )}>
                {state.status === 'placed' ? 'Placed VA' : 'Unplaced VA'}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-zinc-200 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between min-w-[800px]">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = state.currentStep === step.id;
              const isCompleted = currentStepIndex > idx;
              
              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center gap-2 group">
                    <div className={cn(
                      "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                      isActive ? "border-indigo-600 bg-indigo-50 text-indigo-600 scale-110 shadow-lg shadow-indigo-100" : 
                      isCompleted ? "border-emerald-500 bg-emerald-50 text-emerald-500" : 
                      "border-zinc-200 text-zinc-400"
                    )}>
                      {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className={cn(
                      "text-[10px] uppercase font-bold tracking-widest",
                      isActive ? "text-indigo-600" : isCompleted ? "text-emerald-600" : "text-zinc-400"
                    )}>
                      {step.label}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={cn(
                      "flex-1 h-[2px] mx-4 transition-colors duration-500",
                      currentStepIndex > idx ? "bg-emerald-500" : "bg-zinc-200"
                    )} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-12">
        <AnimatePresence mode="wait">
          {state.currentStep === 'entry' && (
            <motion.div 
              key="entry"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-6xl font-bold tracking-tighter text-zinc-900 leading-[0.9]">
                  From General VA to <span className="text-emerald-600">Healthcare Specialist.</span>
                </h2>
                <p className="text-zinc-500 max-w-2xl mx-auto text-xl">
                  Our diagnostic-first approach removes bias and maps your natural aptitudes to high-ticket healthcare specializations.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <button 
                  onClick={() => handleStatusSelect('unplaced')}
                  className="group p-10 glass-card rounded-[2.5rem] text-left hover:border-emerald-500 transition-all hover:shadow-2xl hover:shadow-emerald-500/10 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <UserPlus className="w-32 h-32" />
                  </div>
                  <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <UserPlus className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">New to Healthcare</h3>
                  <p className="text-zinc-500 leading-relaxed">
                    You're a general VA looking to enter the healthcare space. We'll identify your baseline and map your first specialization.
                  </p>
                  <div className="mt-8 flex items-center gap-2 text-emerald-600 font-bold">
                    Start Diagnostic <ArrowRight className="w-5 h-5" />
                  </div>
                </button>

                <button 
                  onClick={() => handleStatusSelect('placed')}
                  className="group p-10 glass-card rounded-[2.5rem] text-left hover:border-blue-500 transition-all hover:shadow-2xl hover:shadow-blue-500/10 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <TrendingUp className="w-32 h-32" />
                  </div>
                  <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Existing Specialist</h3>
                  <p className="text-zinc-500 leading-relaxed">
                    You're already working in healthcare but want to "Up-Skill" into a Senior or SME role to increase your billable rate.
                  </p>
                  <div className="mt-8 flex items-center gap-2 text-blue-600 font-bold">
                    Map Growth Path <ArrowRight className="w-5 h-5" />
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {state.currentStep === 'baseline' && (
            <motion.div 
              key="baseline"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="max-w-3xl mx-auto space-y-12"
            >
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-600 rounded-full text-xs font-bold uppercase tracking-widest">
                  <User className="w-4 h-4" /> Professional Baseline
                </div>
                <h2 className="text-5xl font-bold tracking-tight text-zinc-900">Establish Your Starting Point</h2>
                <p className="text-zinc-500 text-lg">
                  {baselineSubStep === 'roles' 
                    ? "First, let's identify your previous professional roles and how long you've served in them."
                    : "Next, tell us about your core healthcare competencies and your proficiency level in each."}
                </p>
                
                <div className="flex justify-center gap-2 mt-4">
                  <div className={cn("h-1.5 w-12 rounded-full transition-all", baselineSubStep === 'roles' ? "bg-emerald-600" : "bg-emerald-200")} />
                  <div className={cn("h-1.5 w-12 rounded-full transition-all", baselineSubStep === 'skills' ? "bg-emerald-600" : "bg-emerald-200")} />
                </div>
              </div>

              <div className="glass-card rounded-3xl p-10 space-y-12 shadow-xl shadow-zinc-200/50">
                <AnimatePresence mode="wait">
                  {baselineSubStep === 'roles' ? (
                    <motion.div 
                      key="roles-substep"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-8"
                    >
                      <div className="flex justify-between items-end">
                        <h3 className="text-xl font-bold text-zinc-900">Select your previous roles</h3>
                        <span className="text-xs text-zinc-400 font-medium">{state.baselineRoles.length} selected</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {BASELINE_ROLES.map((role) => {
                          const isSelected = state.baselineRoles.some(r => r.role === role);
                          return (
                            <div key={role} className="space-y-2">
                              <button 
                                onClick={() => {
                                  setState(prev => {
                                    const exists = prev.baselineRoles.some(r => r.role === role);
                                    if (exists) {
                                      return { ...prev, baselineRoles: prev.baselineRoles.filter(r => r.role !== role) };
                                    } else {
                                      return { ...prev, baselineRoles: [...prev.baselineRoles, { role, experience: EXPERIENCE_LEVELS[0] }] };
                                    }
                                  });
                                }}
                                className={cn(
                                  "w-full p-4 rounded-xl border text-left transition-all flex justify-between items-center",
                                  isSelected 
                                    ? "border-emerald-600 bg-emerald-50 text-emerald-700 font-bold" 
                                    : "border-zinc-200 hover:border-zinc-400 text-zinc-600"
                                )}
                              >
                                <span className="text-sm">{role}</span>
                                {isSelected && <CheckCircle2 className="w-4 h-4" />}
                              </button>
                              
                              {isSelected && (
                                <div className="px-2 pb-2">
                                  <p className="text-[10px] uppercase font-bold text-zinc-400 mb-2 tracking-widest">Experience Level</p>
                                  <div className="flex flex-wrap gap-2">
                                    {EXPERIENCE_LEVELS.map(exp => (
                                      <button
                                        key={exp}
                                        onClick={() => {
                                          setState(prev => ({
                                            ...prev,
                                            baselineRoles: prev.baselineRoles.map(r => r.role === role ? { ...r, experience: exp } : r)
                                          }));
                                        }}
                                        className={cn(
                                          "px-2 py-1 rounded-md text-[10px] font-bold border transition-all",
                                          state.baselineRoles.find(r => r.role === role)?.experience === exp
                                            ? "bg-emerald-600 border-emerald-600 text-white"
                                            : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-400"
                                        )}
                                      >
                                        {exp}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      
                      <button 
                        disabled={state.baselineRoles.length === 0}
                        onClick={() => setBaselineSubStep('skills')}
                        className="w-full py-5 bg-zinc-900 text-white rounded-2xl font-bold text-lg hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        Next: Identify Skills <ArrowRight className="w-5 h-5" />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="skills-substep"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div className="flex justify-between items-end">
                        <h3 className="text-xl font-bold text-zinc-900">Core Skills & Competencies</h3>
                        <span className="text-xs text-zinc-400 font-medium">{state.baselineSkills.length} selected</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {BASELINE_SKILLS.map((skill) => {
                          const isSelected = state.baselineSkills.some(s => s.skill === skill);
                          return (
                            <div key={skill} className="space-y-2">
                              <button 
                                onClick={() => {
                                  setState(prev => {
                                    const exists = prev.baselineSkills.some(s => s.skill === skill);
                                    if (exists) {
                                      return { ...prev, baselineSkills: prev.baselineSkills.filter(s => s.skill !== skill) };
                                    } else {
                                      return { ...prev, baselineSkills: [...prev.baselineSkills, { skill, experience: EXPERIENCE_LEVELS[0] }] };
                                    }
                                  });
                                }}
                                className={cn(
                                  "w-full p-4 rounded-xl border text-left transition-all flex justify-between items-center",
                                  isSelected 
                                    ? "border-indigo-600 bg-indigo-50 text-indigo-700 font-bold" 
                                    : "border-zinc-200 hover:border-zinc-400 text-zinc-600"
                                )}
                              >
                                <span className="text-sm">{skill}</span>
                                {isSelected && <CheckCircle2 className="w-4 h-4" />}
                              </button>
                              
                              {isSelected && (
                                <div className="px-2 pb-2">
                                  <p className="text-[10px] uppercase font-bold text-zinc-400 mb-2 tracking-widest">Proficiency</p>
                                  <div className="flex flex-wrap gap-2">
                                    {EXPERIENCE_LEVELS.map(exp => (
                                      <button
                                        key={exp}
                                        onClick={() => {
                                          setState(prev => ({
                                            ...prev,
                                            baselineSkills: prev.baselineSkills.map(s => s.skill === skill ? { ...s, experience: exp } : s)
                                          }));
                                        }}
                                        className={cn(
                                          "px-2 py-1 rounded-md text-[10px] font-bold border transition-all",
                                          state.baselineSkills.find(s => s.skill === skill)?.experience === exp
                                            ? "bg-indigo-600 border-indigo-600 text-white"
                                            : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-400"
                                        )}
                                      >
                                        {exp}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="flex gap-4">
                        <button 
                          onClick={() => setBaselineSubStep('roles')}
                          className="flex-1 py-5 bg-zinc-100 text-zinc-600 rounded-2xl font-bold text-lg hover:bg-zinc-200 transition-all"
                        >
                          Back to Roles
                        </button>
                        <button 
                          disabled={state.baselineSkills.length === 0}
                          onClick={handleBaselineSubmit}
                          className="flex-[2] py-5 bg-zinc-900 text-white rounded-2xl font-bold text-lg hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          Proceed to Diagnostic <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {state.currentStep === 'assessment' && (
            <motion.div 
              key="assessment"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-3xl mx-auto space-y-12"
            >
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold">Capability Assessment</h2>
                  <p className="text-zinc-500 text-sm">Step {currentQuestionIdx + 1} of {ASSESSMENT_QUESTIONS.length}</p>
                </div>
                <div className="flex gap-1">
                  {ASSESSMENT_QUESTIONS.map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "h-1.5 w-8 rounded-full transition-all duration-300",
                        i === currentQuestionIdx ? "bg-emerald-600 w-12" : 
                        i < currentQuestionIdx ? "bg-emerald-200" : "bg-zinc-200"
                      )} 
                    />
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-3xl p-10 space-y-8 shadow-xl shadow-zinc-200/50">
                <div className="space-y-6">
                  <div className="inline-block px-3 py-1 bg-zinc-100 text-zinc-500 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {ASSESSMENT_QUESTIONS[currentQuestionIdx].category} domain
                  </div>
                  <h3 className="text-2xl font-bold leading-tight">
                    {ASSESSMENT_QUESTIONS[currentQuestionIdx].text}
                  </h3>
                  <div className="grid gap-4">
                    {ASSESSMENT_QUESTIONS[currentQuestionIdx].options.map((opt, i) => {
                      const isSelected = answers[ASSESSMENT_QUESTIONS[currentQuestionIdx].id] === opt;
                      return (
                        <button 
                          key={i} 
                          disabled={showInsight}
                          onClick={() => handleAnswer(ASSESSMENT_QUESTIONS[currentQuestionIdx].id, opt)}
                          className={cn(
                            "w-full p-6 text-left rounded-2xl border transition-all group flex justify-between items-center",
                            isSelected ? "border-emerald-600 bg-emerald-50" : 
                            showInsight ? "border-zinc-100 opacity-50" : "border-zinc-200 hover:border-emerald-600 hover:bg-emerald-50"
                          )}
                        >
                          <span className={cn("font-medium", isSelected ? "text-emerald-700" : "text-zinc-700")}>{opt}</span>
                          <div className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                            isSelected ? "border-emerald-600 bg-emerald-600 text-white" : "border-zinc-200"
                          )}>
                            {isSelected ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {showInsight && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl space-y-3"
                    >
                      <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest">
                        <Info className="w-4 h-4" /> Domain Insight
                      </div>
                      <p className="text-zinc-700 leading-relaxed">
                        {ASSESSMENT_QUESTIONS[currentQuestionIdx].insight}
                      </p>
                      <button 
                        onClick={nextQuestion}
                        className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                      >
                        {currentQuestionIdx === ASSESSMENT_QUESTIONS.length - 1 ? 'Finish Assessment' : 'Next Question'} <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {state.currentStep === 'assignment' && (
            <motion.div 
              key="assignment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-5xl mx-auto space-y-12"
            >
              <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-widest">
                  <TrendingUp className="w-4 h-4" /> Diagnostic Complete
                </div>
                <h2 className="text-5xl font-bold tracking-tight text-zinc-900">Choose Your Upskill Pathway</h2>
                <p className="text-zinc-500 text-xl max-w-2xl mx-auto leading-relaxed">
                  Based on your diagnostic results and professional baseline, we've identified two potential paths for your growth.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Option 1: Right-Skilling (Recommended) */}
                {(() => {
                  const recommendedTrack = TRACKS.find(t => t.id === state.recommendedTrackId) || TRACKS[0];
                  const highestCat = Object.entries(state.assessmentResults || {}).reduce((a, b) => a[1] > b[1] ? a : b, ['N/A', 0])[0];
                  
                  return (
                    <motion.div 
                      whileHover={{ y: -5 }}
                      className="p-8 glass-card rounded-3xl border-2 border-emerald-500/30 bg-emerald-50/30 flex flex-col h-full relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-4">
                        <div className="bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                          Recommended Path
                        </div>
                      </div>
                      
                      <div className="space-y-6 flex-grow">
                        <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                          <Zap className="text-white w-7 h-7" />
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="text-3xl font-bold text-zinc-900">Right-Skill: {recommendedTrack.name}</h3>
                          <p className="text-zinc-600 leading-relaxed">
                            This path leverages your high aptitude in <span className="font-bold text-emerald-700">{highestCat.replace('-', ' ')}</span>. It's designed to transition you into a role where your natural strengths will shine.
                          </p>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Key Skills You'll Master</h4>
                          <div className="flex flex-wrap gap-2">
                            {recommendedTrack.skills.slice(0, 4).map(s => (
                              <span key={s.name} className="px-3 py-1 bg-white border border-emerald-100 rounded-full text-xs font-medium text-emerald-700">
                                {s.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          const newState = { ...state, assignedTrack: recommendedTrack, currentStep: 'upskilling' as ProgramStep };
                          setState(newState);
                          saveState(newState);
                        }}
                        className="mt-10 w-full py-5 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                      >
                        Start Right-Skilling <ArrowRight className="w-5 h-5" />
                      </button>
                    </motion.div>
                  );
                })()}

                {/* Option 2: Up-Skilling (Baseline Based) */}
                {(() => {
                  // Find a track that matches their baseline roles, or default to first role
                  const baselineRoleName = state.baselineRoles[0]?.role || 'Medical Receptionist';
                  const upskillTrack = TRACKS.find(t => t.name === baselineRoleName) || TRACKS[0];
                  
                  return (
                    <motion.div 
                      whileHover={{ y: -5 }}
                      className="p-8 glass-card rounded-3xl border border-zinc-200 flex flex-col h-full"
                    >
                      <div className="space-y-6 flex-grow">
                        <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center shadow-lg">
                          <TrendingUp className="text-white w-7 h-7" />
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="text-3xl font-bold text-zinc-900">Up-Skill: {upskillTrack.name}</h3>
                          <p className="text-zinc-600 leading-relaxed">
                            Double down on your existing experience as a <span className="font-bold text-zinc-900">{baselineRoleName}</span>. This path focuses on mastering advanced modules and closing specific skill gaps identified in your diagnostic.
                          </p>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Advanced Mastery Areas</h4>
                          <div className="flex flex-wrap gap-2">
                            {upskillTrack.curriculum.map(m => (
                              <span key={m.id} className="px-3 py-1 bg-zinc-100 border border-zinc-200 rounded-full text-xs font-medium text-zinc-600">
                                {m.title}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          const newState = { ...state, assignedTrack: upskillTrack, currentStep: 'upskilling' as ProgramStep };
                          setState(newState);
                          saveState(newState);
                        }}
                        className="mt-10 w-full py-5 bg-zinc-900 text-white rounded-2xl font-bold text-lg hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                      >
                        Start Up-Skilling <ArrowRight className="w-5 h-5" />
                      </button>
                    </motion.div>
                  );
                })()}
              </div>

              {/* Detailed Results Breakdown */}
              <div className="p-10 glass-card rounded-3xl border border-zinc-200">
                <h3 className="text-2xl font-bold mb-8">Diagnostic Profile</h3>
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    {Object.entries(state.assessmentResults || {}).map(([key, val]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                          <span className="text-zinc-500">{key.replace('-', ' ')}</span>
                          <span className="text-zinc-900">{val}%</span>
                        </div>
                        <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${val}%` }}
                            className={cn(
                              "h-full rounded-full",
                              val >= 70 ? "bg-emerald-500" : val >= 40 ? "bg-amber-500" : "bg-rose-500"
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-zinc-50 rounded-2xl p-6 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Baseline Summary</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest mb-1">Roles & Experience</p>
                        <div className="flex flex-wrap gap-2">
                          {state.baselineRoles.map(r => (
                            <span key={r.role} className="px-2 py-1 bg-white border border-zinc-200 rounded text-[10px] font-bold">
                              {r.role} ({r.experience})
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest mb-1">Top Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {state.baselineSkills.map(s => (
                            <span key={s.skill} className="px-2 py-1 bg-white border border-zinc-200 rounded text-[10px] font-bold">
                              {s.skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {state.currentStep === 'upskilling' && state.assignedTrack && (
            <motion.div 
              key="upskilling"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    <BookOpen className="w-3 h-3" /> Up-Skilling Path
                  </div>
                  <h2 className="text-4xl font-bold">Curriculum Roadmap</h2>
                  <p className="text-zinc-500 text-lg">Mastering the {state.assignedTrack.name} specialization.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Overall Progress</span>
                    <div className="text-3xl font-bold text-indigo-600">
                      {Math.round((state.completedTopics.length / state.assignedTrack.curriculum.reduce((acc, m) => acc + m.topics.length, 0)) * 100)}%
                    </div>
                  </div>
                  <div className="w-16 h-16 rounded-full border-4 border-zinc-100 border-t-indigo-600 flex items-center justify-center font-bold text-xs">
                    {state.completedModules.length}/{state.assignedTrack.curriculum.length}
                  </div>
                </div>
              </div>

              <div className="grid gap-8">
                {/* Resource Library Section */}
                <div className="glass-card p-8 rounded-3xl border-dashed border-zinc-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-zinc-100 rounded-lg">
                      <BookOpen className="w-5 h-5 text-zinc-500" />
                    </div>
                    <h3 className="text-xl font-bold">Specialist Resource Library</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { title: 'HIPAA Compliance Guide', type: 'PDF' },
                      { title: 'EHR Workflow Templates', type: 'DOC' },
                      { title: 'Medical Coding Cheat Sheet', type: 'XLS' },
                      { title: 'Patient Communication Scripts', type: 'VIDEO' }
                    ].map((res, i) => (
                      <div key={i} className="p-4 bg-white rounded-2xl border border-zinc-100 flex flex-col gap-2 hover:border-indigo-500 transition-all cursor-pointer group">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{res.type}</span>
                        <span className="text-sm font-bold text-zinc-700 group-hover:text-indigo-600">{res.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {state.assignedTrack.curriculum.map((module, i) => {
                  const moduleTopicsCount = module.topics.length;
                  const completedInModule = module.topics.filter(t => state.completedTopics.includes(t)).length;
                  const moduleProgress = Math.round((completedInModule / moduleTopicsCount) * 100);
                  const isModuleCompleted = state.completedModules.includes(module.id);
                  const isCurrentModule = i === state.completedModules.length;

                  return (
                    <div key={module.id} className="relative pl-12 group">
                      {i < state.assignedTrack.curriculum.length - 1 && (
                        <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-zinc-100 group-hover:bg-indigo-200 transition-colors" />
                      )}
                      <div className={cn(
                        "absolute left-0 top-0 w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 transition-all",
                        isModuleCompleted ? "bg-emerald-500 border-emerald-500 text-white" :
                        isCurrentModule ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200" : 
                        "bg-white border-zinc-200 text-zinc-300"
                      )}>
                        {isModuleCompleted ? <CheckCircle2 className="w-5 h-5" /> : 
                         isCurrentModule ? <Zap className="w-5 h-5" /> : 
                         <ShieldCheck className="w-5 h-5" />}
                      </div>
                      
                      <div className={cn(
                        "p-8 glass-card rounded-3xl transition-all",
                        isCurrentModule ? "border-indigo-500/30 shadow-xl shadow-indigo-500/5" : 
                        isModuleCompleted ? "border-emerald-500/20" : "opacity-70"
                      )}>
                        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-2xl font-bold">{module.title}</h3>
                              {isModuleCompleted && (
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold uppercase">Completed</span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 uppercase tracking-widest mb-4">
                              <span>{module.duration}</span>
                              <span>•</span>
                              <span>{moduleTopicsCount} Lessons</span>
                            </div>
                            
                            {/* Module Progress Bar */}
                            <div className="space-y-2">
                              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                <span>Module Progress</span>
                                <span>{moduleProgress}%</span>
                              </div>
                              <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${moduleProgress}%` }}
                                  className={cn("h-full transition-all", isModuleCompleted ? "bg-emerald-500" : "bg-indigo-600")}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {module.topics.map((topic, j) => {
                            const isTopicCompleted = state.completedTopics.includes(topic);
                            return (
                              <button 
                                key={j} 
                                onClick={() => toggleTopic(topic, module.id)}
                                className={cn(
                                  "flex items-center gap-3 p-4 rounded-2xl border transition-all text-left",
                                  isTopicCompleted ? "bg-emerald-50 border-emerald-200" : "bg-zinc-50 border-zinc-100 hover:border-indigo-200"
                                )}
                              >
                                <div className={cn(
                                  "w-6 h-6 rounded-lg border flex items-center justify-center text-[10px] font-bold transition-all",
                                  isTopicCompleted ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-zinc-200 text-zinc-400"
                                )}>
                                  {isTopicCompleted ? <CheckCircle2 className="w-3 h-3" /> : j + 1}
                                </div>
                                <span className={cn("text-sm font-medium transition-all", isTopicCompleted ? "text-emerald-700" : "text-zinc-600")}>
                                  {topic}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {state.completedModules.length === state.assignedTrack.curriculum.length && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center pt-8"
                >
                  <button 
                    onClick={nextStep}
                    className="bg-zinc-900 text-white px-12 py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 flex items-center gap-3"
                  >
                    Proceed to Simulation Phase <ArrowRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {state.currentStep === 'application' && (
            <motion.div 
              key="application"
              className="max-w-3xl mx-auto space-y-8"
            >
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold">Practical Application</h2>
                <p className="text-zinc-500">Apply your new skills in a simulated real-world project environment.</p>
              </div>

              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="bg-zinc-900 p-4 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-zinc-400 text-xs font-mono ml-4">Project_Simulation_v1.0</span>
                </div>
                <div className="p-8 space-y-6">
                  <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 font-mono text-sm">
                    <p className="text-emerald-600 font-bold mb-2">// Clinical Case Simulation</p>
                    <p className="text-zinc-600">A patient calls with a complex insurance denial for a recent specialist referral. You must verify the CPT codes, check the prior authorization status in the EHR, and draft a professional appeal letter to the carrier.</p>
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-zinc-700">Submit Documentation or Appeal Draft</label>
                    <div className="border-2 border-dashed border-zinc-200 rounded-xl p-12 text-center hover:border-emerald-600 transition-colors cursor-pointer">
                      <p className="text-zinc-400 text-sm">Upload your medical documentation or appeal letters here</p>
                    </div>
                  </div>
                  <button 
                    onClick={nextStep}
                    className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold"
                  >
                    Submit for Clinical Review
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {state.currentStep === 'vetting' && (
            <motion.div 
              key="vetting"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold">Vetting & Interview</h2>
                <p className="text-zinc-500">Final verification of your specialized skills through a mock interview and technical review.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-card p-6 rounded-2xl space-y-4">
                  <h3 className="font-bold flex items-center gap-2">
                    <Video className="w-4 h-4 text-blue-600" /> Mock Interview
                  </h3>
                  <p className="text-sm text-zinc-500">Practice responding to common healthcare client questions regarding HIPAA, EHR workflows, and patient communication.</p>
                  <button className="w-full py-3 rounded-xl border border-blue-200 text-blue-600 font-bold text-sm hover:bg-blue-50 transition-colors">
                    Start Mock Session
                  </button>
                </div>
                <div className="glass-card p-6 rounded-2xl space-y-4">
                  <h3 className="font-bold flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-600" /> Technical Review
                  </h3>
                  <p className="text-sm text-zinc-500">A senior specialist will review your simulation project and provide a detailed feedback report.</p>
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700">Project Score: 94%</span>
                    <span className="text-[10px] text-emerald-600 uppercase font-bold">Passed</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={nextStep}
                className="w-full bg-zinc-900 text-white py-4 rounded-xl font-bold hover:bg-zinc-800 transition-all"
              >
                Proceed to Credentialing
              </button>
            </motion.div>
          )}

          {state.currentStep === 'certification' && (
            <motion.div 
              key="certification"
              className="text-center space-y-12 py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12 }}
                className="w-48 h-48 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-2xl relative"
              >
                <Award className="text-white w-24 h-24" />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 border-4 border-dashed border-white/30 rounded-full"
                />
              </motion.div>

              <div className="space-y-4">
                <h2 className="text-5xl font-bold tracking-tight">Certified Specialist</h2>
                <p className="text-zinc-500 text-xl max-w-xl mx-auto">
                  Congratulations! You have successfully completed the {state.assignedTrack?.name} track.
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <div className="p-6 glass-card rounded-2xl flex flex-col items-center gap-2 min-w-[200px]">
                  <span className="text-xs font-mono text-zinc-400 uppercase">Status</span>
                  <span className="text-lg font-bold text-emerald-600">Active</span>
                </div>
                <div className="p-6 glass-card rounded-2xl flex flex-col items-center gap-2 min-w-[200px]">
                  <span className="text-xs font-mono text-zinc-400 uppercase">Next Step</span>
                  <span className="text-lg font-bold">
                    {state.status === 'unplaced' ? 'Placement Pool' : 'Role Expansion'}
                  </span>
                </div>
              </div>

              <button 
                onClick={nextStep}
                className="bg-zinc-900 text-white px-12 py-4 rounded-xl font-bold hover:bg-zinc-800 transition-all"
              >
                View Placement Opportunities
              </button>
            </motion.div>
          )}

          {state.currentStep === 'placement' && (
            <motion.div 
              key="placement"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold">Specialist Placement Pool</h2>
                <p className="text-zinc-500">Your profile is now live in our premium specialist pool. Matching you with high-ticket healthcare clients.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  <div className="glass-card p-8 rounded-3xl border-2 border-emerald-500/20">
                    <div className="flex justify-between items-start mb-8">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-zinc-100 rounded-2xl flex items-center justify-center">
                          <UserPlus className="w-10 h-10 text-zinc-400" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">Healthcare Specialist Profile</h3>
                          <p className="text-zinc-500">Verified {state.assignedTrack?.name}</p>
                          <div className="flex gap-2 mt-2">
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold uppercase tracking-widest">HIPAA Certified</span>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold uppercase tracking-widest">EHR Expert</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-zinc-900">{getTieredRate(state.averageScore)}</div>
                        <div className="text-xs text-zinc-400">Tiered Specialist Rate</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Verified Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {state.assignedTrack?.skills.map((s, i) => (
                            <span key={i} className="px-3 py-1 bg-zinc-50 border border-zinc-100 rounded-full text-xs font-medium text-zinc-600">
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Training Completion</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span>Diagnostic Score</span>
                            <span>{state.averageScore}%</span>
                          </div>
                          <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${state.averageScore}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { client: "Modern Orthopedics", role: state.assignedTrack?.name || "Medical Scribe", rate: "$12-15/hr", match: Math.min(99, (state.averageScore || 0) + 5) },
                      { client: "Coastal Dental Group", role: state.assignedTrack?.name || "Dental Biller", rate: "$14-18/hr", match: Math.min(99, (state.averageScore || 0) + 2) }
                    ].map((job, i) => (
                      <div key={i} className="glass-card p-6 rounded-2xl space-y-4 border-emerald-100 bg-emerald-50/30">
                        <div className="flex justify-between items-start">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <Building2 className="w-5 h-5 text-zinc-400" />
                          </div>
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold uppercase">
                            {job.match}% Match
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-zinc-900">{job.client}</h4>
                          <p className="text-xs text-zinc-500">{job.role}</p>
                        </div>
                        <div className="pt-4 border-t border-zinc-100 flex justify-between items-center">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Tiered Rate</span>
                            <span className="text-sm font-bold text-zinc-700">{job.rate}</span>
                          </div>
                          <button className="text-xs font-bold text-emerald-600 hover:underline">Apply Now</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-zinc-900 rounded-3xl text-white space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                        <UserCheck className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold">Placement Agent</h4>
                        <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Online Now</p>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      "Your profile is looking great! I've shortlisted you for 3 premium clients looking for {state.assignedTrack?.name}s. Would you like to schedule a discovery call?"
                    </p>
                    <button className="w-full py-4 bg-white text-zinc-900 rounded-2xl font-bold text-sm hover:bg-zinc-100 transition-all">
                      Chat with Agent
                    </button>
                  </div>
                  
                  <div className="p-8 glass-card rounded-3xl space-y-6 border-indigo-100 bg-indigo-50/10">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Next Career Milestone</h4>
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-[10px] font-bold uppercase">Locked</span>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                        <Award className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xl font-bold text-zinc-900">Senior {state.assignedTrack?.name || 'Specialist'}</p>
                        <p className="text-sm text-zinc-500 italic">Role Expansion & Rate Increase</p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-indigo-100">
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Experience Required</p>
                          <p className="text-sm font-bold text-zinc-700">6 Months Active Placement</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Est. Rate</p>
                          <p className="text-sm font-bold text-emerald-600">$22-28/hr</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase">
                          <span>Progress to Eligibility</span>
                          <span>0%</span>
                        </div>
                        <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-600 w-0" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                          <div className="w-1 h-1 rounded-full bg-indigo-400" />
                          <span>Advanced Revenue Cycle Certification</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                          <div className="w-1 h-1 rounded-full bg-indigo-400" />
                          <span>95%+ Client Satisfaction Rating</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button 
                  onClick={nextStep}
                  className="bg-zinc-900 text-white px-12 py-4 rounded-xl font-bold hover:bg-zinc-800 transition-all"
                >
                  Enter Performance Dashboard
                </button>
              </div>
            </motion.div>
          )}

          {state.currentStep === 'kpi' && (
            <motion.div 
              key="kpi"
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">KPI Tracking</h2>
                <div className="flex gap-2">
                  {['Weekly', 'Monthly', 'Quarterly'].map(t => (
                    <button key={t} className="px-4 py-2 text-xs font-bold uppercase tracking-widest border border-zinc-200 rounded-lg hover:bg-white transition-colors">
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { label: 'Task Accuracy', value: `${Math.min(99.9, (state.averageScore || 0) + 10.5).toFixed(1)}%`, trend: '+2.1%', icon: CheckCircle2 },
                  { label: 'Response Time', value: `${Math.max(5, 20 - Math.floor((state.averageScore || 0) / 10))}m`, trend: '-5m', icon: Target },
                  { label: 'Client Satisfaction', value: `${(3.5 + ((state.averageScore || 0) / 100) * 1.5).toFixed(1)}/5`, trend: '+0.2', icon: Award },
                ].map((stat, i) => (
                  <div key={i} className="p-6 glass-card rounded-2xl space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="p-2 bg-zinc-50 rounded-lg">
                        <stat.icon className="w-5 h-5 text-indigo-600" />
                      </div>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                        {stat.trend}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="glass-card rounded-2xl p-8">
                <h3 className="text-lg font-bold mb-6">Skill Growth Over Time</h3>
                <div className="h-64 w-full flex items-end gap-4">
                  {[40, 65, 55, 80, 75, 95].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        className="w-full bg-indigo-600/20 border-t-2 border-indigo-600 rounded-t-lg relative group"
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 text-white text-[10px] px-2 py-1 rounded">
                          {h}%
                        </div>
                      </motion.div>
                      <span className="text-[10px] font-mono text-zinc-400 uppercase">Month {i+1}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center pt-8">
                <button 
                  onClick={resetApp}
                  className="text-zinc-400 hover:text-zinc-900 text-sm font-bold uppercase tracking-widest transition-colors"
                >
                  Restart Program Simulation
                </button>
              </div>
            </motion.div>
          )}
          {state.currentStep === 'profile' && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="flex justify-between items-end">
                <div className="space-y-4">
                  <h2 className="text-4xl font-bold tracking-tight text-zinc-900">VA Professional Profile</h2>
                  <p className="text-zinc-500 text-lg">Track your career progression and skill mastery.</p>
                </div>
                {getTier(state.averageScore) && (
                  <div className={cn("px-6 py-3 rounded-2xl border-2 flex flex-col items-center", getTier(state.averageScore)?.color, getTier(state.averageScore)?.border)}>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Proficiency</span>
                    <span className="text-xl font-black uppercase tracking-tighter">{getTier(state.averageScore)?.name}</span>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                  <div className="glass-card rounded-[2.5rem] p-10 space-y-8">
                    <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-bold">Skill Assessments</h3>
                      <BarChart3 className="w-6 h-6 text-zinc-300" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6">
                      {Object.entries(state.assessmentResults || {}).map(([key, val]) => {
                        const score = val as number;
                        return (
                          <div key={key} className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100 space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">{key.replace('-', ' ')}</span>
                              <span className={cn("text-lg font-bold", score >= 80 ? "text-emerald-600" : score >= 60 ? "text-indigo-600" : "text-zinc-600")}>{score}%</span>
                            </div>
                            <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${score}%` }}
                                className={cn("h-full", score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-indigo-500" : "bg-zinc-400")}
                              />
                            </div>
                          </div>
                        );
                      })}
                      {!state.assessmentResults && (
                        <div className="sm:col-span-2 p-12 text-center border-2 border-dashed border-zinc-200 rounded-3xl">
                          <ClipboardCheck className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
                          <p className="text-zinc-400 font-medium">No assessment data found. Complete the diagnostic to see your results.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="glass-card rounded-[2.5rem] p-10 space-y-8">
                    <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-bold">Completed Modules</h3>
                      <BookOpen className="w-6 h-6 text-zinc-300" />
                    </div>
                    <div className="space-y-4">
                      {state.assignedTrack?.curriculum.map(module => {
                        const isCompleted = state.completedModules.includes(module.id);
                        return (
                          <div key={module.id} className={cn("p-6 rounded-3xl border transition-all", isCompleted ? "bg-emerald-50 border-emerald-100" : "bg-zinc-50 border-zinc-100")}>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-4">
                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isCompleted ? "bg-emerald-500 text-white" : "bg-zinc-200 text-zinc-400")}>
                                  {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <BookOpen className="w-5 h-5" />}
                                </div>
                                <div>
                                  <h4 className="font-bold text-zinc-900">{module.title}</h4>
                                  <p className="text-xs text-zinc-500">{module.duration} • {module.topics.length} Topics</p>
                                </div>
                              </div>
                              {isCompleted && <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-white px-3 py-1 rounded-full shadow-sm">Completed</span>}
                            </div>
                          </div>
                        );
                      })}
                      {!state.assignedTrack && (
                        <div className="p-12 text-center border-2 border-dashed border-zinc-200 rounded-3xl">
                          <Map className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
                          <p className="text-zinc-400 font-medium">Select a career track to see your curriculum.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="glass-card rounded-[2.5rem] p-8 space-y-6">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Account Status</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                          <User className="w-5 h-5 text-zinc-400" />
                        </div>
                        <div>
                          <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest leading-none">Logged in as</p>
                          <p className="text-sm font-bold text-zinc-900">{user?.email || 'Guest'}</p>
                        </div>
                      </div>
                      <button className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold text-sm hover:bg-zinc-800 transition-all">
                        Edit Profile
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="w-full py-4 bg-white text-red-600 border border-red-100 rounded-2xl font-bold text-sm hover:bg-red-50 transition-all"
                      >
                        Logout
                      </button>
                    </div>
                  </div>

                  <div className="glass-card rounded-[2.5rem] p-8 space-y-6 bg-indigo-600 text-white">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xl font-bold">Next Milestone</h4>
                      <p className="text-indigo-100 text-sm leading-relaxed">Complete 2 more modules to unlock the "Senior Specialist" certification and increase your tiered rate.</p>
                    </div>
                    <div className="pt-4">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                        <span>Progress</span>
                        <span>65%</span>
                      </div>
                      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white w-[65%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showLoginModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl space-y-8"
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <button onClick={() => setShowLoginModal(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-bold">Welcome Back</h3>
                <p className="text-zinc-500">Log in to your VA profile to continue your upskilling journey.</p>
              </div>
              <div className="space-y-4">
                <button 
                  onClick={handleGoogleLogin}
                  className="w-full py-5 bg-white border border-zinc-200 text-zinc-900 rounded-2xl font-bold text-lg hover:bg-zinc-50 transition-all shadow-sm flex items-center justify-center gap-3"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
                  Continue with Google
                </button>
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-100"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-zinc-400 font-bold tracking-widest">Or email</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="name@example.com"
                    className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
                <button 
                  onClick={() => {
                    setIsLoggedIn(true);
                    setShowLoginModal(false);
                    setState(prev => ({ ...prev, currentStep: 'profile' }));
                  }}
                  className="w-full py-5 bg-zinc-900 text-white rounded-2xl font-bold text-lg hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
                >
                  Log In
                </button>
                <div className="text-center">
                  <button className="text-sm font-bold text-emerald-600 hover:underline">Forgot password?</button>
                </div>
              </div>
              <div className="pt-6 border-t border-zinc-100 text-center">
                <p className="text-sm text-zinc-500">Don't have an account? <button className="text-emerald-600 font-bold hover:underline">Sign up</button></p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedSkill && (
          <SkillModal skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-400 text-xs font-mono">© 2026 VA UPSKILL & RIGHT-SKILL PROGRAM. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            <a href="#" className="text-zinc-400 hover:text-zinc-900 text-xs font-bold uppercase tracking-widest">Support</a>
            <a href="#" className="text-zinc-400 hover:text-zinc-900 text-xs font-bold uppercase tracking-widest">Privacy</a>
            <a href="#" className="text-zinc-400 hover:text-zinc-900 text-xs font-bold uppercase tracking-widest">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
