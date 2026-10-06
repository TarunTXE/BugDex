import React, { useState, useRef } from 'react';
import { Target, Sparkles, CheckCircle2, Clock, Camera, Upload, AlertCircle, RefreshCw, Award, ArrowRight } from 'lucide-react';
import { verifyQuest } from '../services/gemini';
import { completeQuest } from '../services/storage';
import { playSound } from '../utils/audio';

export default function DailyQuests({ quests, onQuestCompleted, onQuickScan }) {
  const [activeQuestToSubmit, setActiveQuestToSubmit] = useState(null);
  const [submittingImage, setSubmittingImage] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const fileInputRef = useRef(null);

  const handleSelectQuestForPhoto = (quest) => {
    if (quest.completed) return;
    playSound('click');
    setActiveQuestToSubmit(quest);
    setSubmittingImage(null);
    setVerifyResult(null);
    setErrorMsg(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setSubmittingImage(event.target.result);
      // Automatically evaluate image with Gemini
      verifyQuestImage(event.target.result, activeQuestToSubmit);
    };
    reader.readAsDataURL(file);
  };

  const verifyQuestImage = async (imageSrc, quest) => {
    if (!quest) return;
    setIsVerifying(true);
    setErrorMsg(null);
    setVerifyResult(null);
    playSound('scan_start');

    try {
      const res = await verifyQuest(imageSrc, quest.description);
      setIsVerifying(false);

      if (!res.success) {
        playSound('error');
        setErrorMsg(res.error || 'Could not verify quest image.');
        return;
      }

      setVerifyResult(res);

      if (res.completed) {
        playSound('achievement');
        const saveRes = completeQuest(quest.id);
        if (onQuestCompleted) {
          onQuestCompleted(saveRes);
        }
      } else {
        playSound('error');
      }
    } catch (err) {
      setIsVerifying(false);
      playSound('error');
      setErrorMsg('Error verifying quest. Please try again.');
    }
  };

  const completedCount = quests.filter((q) => q.completed).length;

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-28 pt-2 text-left">
      
      {/* Hidden File Input for Quest Photo Submission */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Header Card */}
      <div className="glass-panel p-5 rounded-3xl border border-nature-600/40">
        <div className="flex items-center justify-between mb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-nature-900/80 border border-nature-500/40 text-nature-300 text-xs font-semibold">
            <Target className="w-3.5 h-3.5 text-nature-400" />
            <span>Outdoor Field Expeditions</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-200/70">
            <Clock className="w-3.5 h-3.5 text-nature-400" />
            <span>Resets in 24h</span>
          </div>
        </div>

        <h2 className="text-2xl font-black text-white font-display">
          Daily Field Quests
        </h2>
        <p className="text-xs text-emerald-100/60 mt-1">
          Complete outdoor observational challenges with Gemini AI to earn bonus XP.
        </p>

        {/* Progress bar */}
        <div className="mt-4 pt-3 border-t border-nature-700/50 flex items-center justify-between text-xs">
          <span className="font-semibold text-white">Daily Completion</span>
          <span className="font-bold text-nature-400">{completedCount} of {quests.length} Completed</span>
        </div>
      </div>

      {/* Verification Modal / In-line Drawer when checking photo */}
      {isVerifying && (
        <div className="glass-panel p-6 rounded-3xl border border-nature-400/50 text-center space-y-3 animate-fadeIn">
          <div className="w-12 h-12 rounded-full bg-nature-900 border border-nature-500/40 flex items-center justify-center mx-auto text-nature-300">
            <RefreshCw className="w-6 h-6 animate-spin text-nature-400" />
          </div>
          <h4 className="text-sm font-bold text-white">Gemini Evaluating Quest Photo...</h4>
          <p className="text-xs text-emerald-100/60">
            Checking if your photo satisfies "{activeQuestToSubmit?.title}"
          </p>
        </div>
      )}

      {/* Verification Result Dialog */}
      {verifyResult && !isVerifying && (
        <div 
          className={`glass-panel p-5 rounded-3xl border animate-fadeIn ${
            verifyResult.completed 
              ? 'border-nature-400/60 bg-gradient-to-b from-nature-900/90 to-nature-950' 
              : 'border-amber-500/50 bg-amber-950/40'
          }`}
        >
          <div className="flex items-start gap-3">
            {verifyResult.completed ? (
              <CheckCircle2 className="w-6 h-6 text-nature-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <h4 className="text-sm font-bold text-white">
                {verifyResult.completed ? 'Quest Complete! 🎉' : 'Quest Not Quite Met'}
              </h4>
              <p className="text-xs text-emerald-100/80 mt-1 leading-relaxed">
                {verifyResult.explanation}
              </p>

              {verifyResult.completed && (
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-nature-500/20 border border-nature-400/40 text-nature-300 font-bold text-xs">
                  <Award className="w-4 h-4 text-nature-400" />
                  <span>+{activeQuestToSubmit?.xpReward} XP Earned</span>
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    setVerifyResult(null);
                    setActiveQuestToSubmit(null);
                  }}
                  className="px-4 py-2 rounded-xl glass-panel border border-nature-600 text-xs font-bold text-emerald-200 hover:bg-nature-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quests List */}
      <div className="space-y-3">
        {quests.map((quest) => {
          return (
            <div
              key={quest.id}
              className={`glass-panel p-4 rounded-2xl border transition-all ${
                quest.completed
                  ? 'border-nature-500/40 bg-nature-900/30 opacity-80'
                  : 'border-nature-700/60 hover:border-nature-500/50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-nature-900 border border-nature-700 flex items-center justify-center text-2xl flex-shrink-0">
                    {quest.icon || '🎯'}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white font-display">
                        {quest.title}
                      </h4>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        +{quest.xpReward} XP
                      </span>
                    </div>

                    <p className="text-xs text-emerald-100/70 mt-1 leading-relaxed">
                      {quest.description}
                    </p>

                    {quest.completed && (
                      <div className="flex items-center gap-1.5 mt-2 text-[11px] font-bold text-nature-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed Today</span>
                      </div>
                    )}
                  </div>
                </div>

                {!quest.completed && (
                  <button
                    onClick={() => handleSelectQuestForPhoto(quest)}
                    className="p-2.5 rounded-xl bg-nature-500 text-nature-950 font-bold hover:bg-nature-400 shadow-md shadow-nature-500/20 transition-all flex-shrink-0 flex items-center gap-1.5 text-xs"
                    aria-label="Submit photo for quest"
                  >
                    <Camera className="w-4 h-4" />
                    <span className="hidden sm:inline">Submit Photo</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
