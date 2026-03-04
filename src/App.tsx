import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
import { VAStatus, ProgramStep, UserState, TRACKS, Track, Skill, ASSESSMENT_QUESTIONS } from './types';

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

export default function App() {
  const [state, setState] = useState<UserState>({
    status: null,
    currentStep: 'entry',
    baselineRole: null,
    experienceLevel: null,
    assessmentResults: null,
    averageScore: null,
    assignedTrack: null,
    completedModules: [],
    completedTopics: [],
  });

  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

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

  const handleStatusSelect = (status: VAStatus) => {
    setState(prev => ({ ...prev, status, currentStep: 'baseline' }));
  };

  const handleBaselineSubmit = (role: string, exp: string) => {
    setState(prev => ({ 
      ...prev, 
      baselineRole: role, 
      experienceLevel: exp, 
      currentStep: 'assessment' 
    }));
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

    // 10x Right-skilling logic: Refined Pathways
    const categoryMap: Record<string, string[]> = {
      'dental-billing': ['dental-biller'],
      'ehr-navigation': ['medical-scribe', 'medical-admin-assistant'],
      'hipaa-compliance': ['medical-receptionist', 'dental-receptionist'],
      'patient-communication': ['health-educator', 'medical-receptionist'],
      'medical-terminology': ['medical-coder', 'medical-scribe'],
    };

    const highestCategory = Object.entries(finalResults).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    const possibleTracks = categoryMap[highestCategory] || ['medical-receptionist'];
    const assignedId = possibleTracks[Math.floor(Math.random() * possibleTracks.length)];
    const assigned = TRACKS.find(t => t.id === assignedId) || TRACKS[0];

    setState(prev => ({ 
      ...prev, 
      assessmentResults: finalResults, 
      averageScore,
      currentStep: 'assignment',
      assignedTrack: assigned
    }));
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

      return { ...prev, completedTopics: newTopics, completedModules: newModules };
    });
  };

  const nextStep = () => {
    const nextIdx = currentStepIndex + 1;
    if (nextIdx < steps.length) {
      setState(prev => ({ ...prev, currentStep: steps[nextIdx].id }));
    }
  };

  const resetApp = () => {
    setState({
      status: null,
      currentStep: 'entry',
      baselineRole: null,
      experienceLevel: null,
      assessmentResults: null,
      averageScore: null,
      assignedTrack: null,
      completedModules: [],
      completedTopics: [],
    });
    setCurrentQuestionIdx(0);
    setAnswers({});
    setShowInsight(false);
  };

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

              {/* Step by Step Process */}
              <div className="grid grid-cols-3 md:grid-cols-9 gap-2">
                {steps.map((step, i) => (
                  <div key={step.id} className="p-3 glass-card rounded-xl text-center space-y-1 border-dashed border-zinc-200">
                    <div className="w-6 h-6 bg-zinc-100 rounded-full flex items-center justify-center mx-auto text-[10px] font-bold text-zinc-400">
                      {i + 1}
                    </div>
                    <p className="text-[8px] font-bold uppercase tracking-tighter text-zinc-500 truncate">{step.label}</p>
                  </div>
                ))}
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
              className="max-w-2xl mx-auto space-y-12"
            >
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-600 rounded-full text-xs font-bold uppercase tracking-widest">
                  <User className="w-4 h-4" /> Professional Baseline
                </div>
                <h2 className="text-5xl font-bold tracking-tight text-zinc-900">Establish Your Starting Point</h2>
                <p className="text-zinc-500 text-lg">
                  To provide the most accurate diagnostic, we need to understand your current professional context.
                </p>
              </div>

              <div className="glass-card rounded-3xl p-10 space-y-10 shadow-xl shadow-zinc-200/50">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-zinc-900">What is your current role?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      'General Virtual Assistant',
                      'Customer Support Representative',
                      'Administrative Assistant',
                      'Medical Receptionist',
                      'Dental Front Office',
                      'Other Professional'
                    ].map((role) => (
                      <button 
                        key={role}
                        onClick={() => setState(prev => ({ ...prev, baselineRole: role }))}
                        className={cn(
                          "p-4 rounded-xl border text-left transition-all",
                          state.baselineRole === role 
                            ? "border-emerald-600 bg-emerald-50 text-emerald-700 font-bold" 
                            : "border-zinc-200 hover:border-zinc-400 text-zinc-600"
                        )}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-zinc-900">Total professional experience?</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      '0-1 Year',
                      '1-3 Years',
                      '3-5 Years',
                      '5+ Years'
                    ].map((exp) => (
                      <button 
                        key={exp}
                        onClick={() => setState(prev => ({ ...prev, experienceLevel: exp }))}
                        className={cn(
                          "p-4 rounded-xl border text-center transition-all",
                          state.experienceLevel === exp 
                            ? "border-emerald-600 bg-emerald-50 text-emerald-700 font-bold" 
                            : "border-zinc-200 hover:border-zinc-400 text-zinc-600"
                        )}
                      >
                        {exp}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  disabled={!state.baselineRole || !state.experienceLevel}
                  onClick={() => handleBaselineSubmit(state.baselineRole!, state.experienceLevel!)}
                  className="w-full py-5 bg-zinc-900 text-white rounded-2xl font-bold text-lg hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Proceed to Diagnostic <ArrowRight className="w-5 h-5" />
                </button>
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

          {state.currentStep === 'assignment' && state.assignedTrack && (
            <motion.div 
              key="assignment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-4xl mx-auto space-y-12"
            >
              <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-widest">
                  <TrendingUp className="w-4 h-4" /> Right-Skilling Match Found
                </div>
                <h2 className="text-5xl font-bold tracking-tight">Your Career Pathway</h2>
                <p className="text-zinc-500 text-xl max-w-2xl mx-auto">
                  Based on your unique profile, we've mapped you to the <span className="text-zinc-900 font-bold">{state.assignedTrack.pathway}</span> pathway.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                  <div className="p-8 glass-card rounded-3xl border-2 border-emerald-500/20 shadow-xl shadow-emerald-500/5">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                        <Activity className="text-white w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold">{state.assignedTrack.name}</h3>
                        <p className="text-zinc-500">{state.assignedTrack.description}</p>
                      </div>
                    </div>

                    {/* Competency Insights */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Highest Competency</div>
                        <div className="text-lg font-bold text-zinc-900">
                          {Object.entries(state.assessmentResults || {}).reduce((a, b) => a[1] > b[1] ? a : b)[0].replace('-', ' ')}
                        </div>
                      </div>
                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                        <div className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Growth Opportunity</div>
                        <div className="text-lg font-bold text-zinc-900">
                          {Object.entries(state.assessmentResults || {}).reduce((a, b) => a[1] < b[1] ? a : b)[0].replace('-', ' ')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Core Skills to Master</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {state.assignedTrack.skills.map((skill, i) => (
                          <button 
                            key={i} 
                            onClick={() => setSelectedSkill(skill)}
                            className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100 hover:border-emerald-500 hover:bg-white transition-all group"
                          >
                            <span className="font-bold text-zinc-700">{skill.name}</span>
                            <Info className="w-4 h-4 text-zinc-300 group-hover:text-emerald-500" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-8 glass-card rounded-3xl bg-zinc-900 text-white">
                    <h4 className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">Pathway Selection Logic</h4>
                    <p className="text-lg leading-relaxed text-zinc-300 italic mb-6">
                      "We've assigned you to the <span className="text-white font-bold">{state.assignedTrack.name}</span> track because you demonstrated exceptional aptitude in <span className="text-emerald-400 font-bold">{Object.entries(state.assessmentResults || {}).reduce((a, b) => a[1] > b[1] ? a : b)[0].replace('-', ' ')}</span> ({Object.entries(state.assessmentResults || {}).reduce((a, b) => a[1] > b[1] ? a : b)[1]}%). This role leverages your natural strengths while providing a structured path to master your growth area: <span className="text-amber-400 font-bold">{Object.entries(state.assessmentResults || {}).reduce((a, b) => a[1] < b[1] ? a : b)[0].replace('-', ' ')}</span>."
                    </p>
                    <div className="pt-6 border-t border-white/10 space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Skill Gap Analysis</h4>
                      <div className="space-y-3">
                        {['Advanced EHR Workflow', 'Specialized Medical Terminology', 'Complex Insurance Appeals'].map((gap, i) => (
                          <div key={i} className="flex items-center gap-3 text-sm text-zinc-400">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {gap}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-white rounded-3xl border border-zinc-200 shadow-sm space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">User Baseline</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 text-zinc-500" />
                        </div>
                        <div>
                          <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest leading-none">Current Role</p>
                          <p className="text-sm font-bold text-zinc-900">{state.baselineRole}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center">
                          <Briefcase className="w-4 h-4 text-zinc-500" />
                        </div>
                        <div>
                          <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest leading-none">Experience</p>
                          <p className="text-sm font-bold text-zinc-900">{state.experienceLevel}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white rounded-3xl border border-zinc-200 shadow-sm">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6">Assessment Profile</h4>
                    <div className="space-y-6">
                      {Object.entries(state.assessmentResults || {}).map(([key, val]) => (
                        <div key={key} className="space-y-2">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                            <span className="text-zinc-500">{key.replace('-', ' ')}</span>
                            <span className="text-zinc-900">{val}%</span>
                          </div>
                          <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${val}%` }}
                              className="h-full bg-emerald-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <button 
                    onClick={nextStep}
                    className="w-full bg-emerald-600 text-white py-6 rounded-3xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                  >
                    Enter Up-Skilling Phase <ArrowRight className="w-5 h-5" />
                  </button>
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
                        <div className="text-2xl font-bold text-zinc-900">$15.00/hr</div>
                        <div className="text-xs text-zinc-400">Target Specialist Rate</div>
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
                          <span className="text-sm font-bold text-zinc-700">{job.rate}</span>
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
        </AnimatePresence>
      </main>

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
