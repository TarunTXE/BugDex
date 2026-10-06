import React, { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, AlertCircle, RefreshCw, MapPin, X, Check, Image as ImageIcon, Zap } from 'lucide-react';
import { analyzeBug } from '../services/gemini';
import { playSound } from '../utils/audio';

const SAMPLE_TEST_PHOTOS = [
  {
    name: 'Monarch Butterfly',
    hint: 'Lepidoptera',
    url: 'https://images.unsplash.com/photo-1559253664-ca249d4608c6?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Seven-Spotted Ladybug',
    hint: 'Coleoptera',
    url: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Praying Mantis',
    hint: 'Mantodea',
    url: 'https://images.unsplash.com/photo-1549480017-d76466a4b7e8?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Honey Bee',
    hint: 'Hymenoptera',
    url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Atlas Moth',
    hint: 'Saturniidae',
    url: 'https://images.unsplash.com/photo-1533048324814-79b0a31982f1?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Living Room Chair',
    hint: 'Non-Insect Test',
    url: 'https://images.unsplash.com/photo-1580481077195-c228a306f690?w=800&auto=format&fit=crop&q=80',
  },
];

const LOCATION_OPTIONS = [
  'Backyard Garden',
  'College Campus',
  'City Park',
  'Forest Trail',
  'Home Balcony',
  'Wetland / Pond',
  'Wild Meadow',
  'Field Edge',
];

export default function Scanner({ onBugAnalyzed }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [mimeType, setMimeType] = useState('image/jpeg');
  const [location, setLocation] = useState('Backyard Garden');
  const [customLocation, setCustomLocation] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanStepText, setScanStepText] = useState('Analyzing insect with Gemini...');
  const [errorMsg, setErrorMsg] = useState(null);
  const [isNotInsect, setIsNotInsect] = useState(false);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setIsNotInsect(false);
    setMimeType(file.type || 'image/jpeg');

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target.result);
      playSound('click');
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample) => {
    setErrorMsg(null);
    setIsNotInsect(false);
    setSelectedImage(sample.url);
    playSound('click');
  };

  const startScan = async () => {
    if (!selectedImage) return;

    playSound('scan_start');
    setIsAnalyzing(true);
    setErrorMsg(null);
    setIsNotInsect(false);

    setScanStepText('Analyzing insect morphology & anatomy...');
    const stepTimer1 = setTimeout(() => {
      setScanStepText('Matching taxonomic order & species traits...');
    }, 600);
    const stepTimer2 = setTimeout(() => {
      setScanStepText('Extracting field facts & safety profile...');
    }, 1200);

    try {
      const result = await analyzeBug(selectedImage, mimeType);

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsAnalyzing(false);

      if (!result.success) {
        playSound('error');
        setErrorMsg(result.error || 'Failed to analyze the image.');
        return;
      }

      const bugData = result.data;

      if (!bugData || bugData.is_insect === false) {
        playSound('error');
        setIsNotInsect(true);
        return;
      }

      // Success!
      playSound('discovery');
      const finalLoc = customLocation.trim() || location;
      onBugAnalyzed(bugData, finalLoc, selectedImage);
    } catch (err) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsAnalyzing(false);
      playSound('error');
      setErrorMsg('An unexpected error occurred during analysis. Please try again.');
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setErrorMsg(null);
    setIsNotInsect(false);
    playSound('click');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-28 pt-2">
      
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-nature-900/80 border border-nature-600/40 text-nature-300 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-nature-400" />
          <span>Multimodal Insect Scanner</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
          AI Bug Scanner
        </h2>
        <p className="text-xs sm:text-sm text-emerald-100/60 mt-1 max-w-sm mx-auto">
          Photograph any insect outdoors. Gemini will identify the species, taxonomy, and safety profile.
        </p>
      </div>

      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {/* Scanner Viewfinder / Dropzone */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-nature-600/40 shadow-2xl">
        
        {selectedImage ? (
          /* Image Preview & Scanning HUD */
          <div className="relative aspect-[4/3] bg-nature-950 flex items-center justify-center overflow-hidden">
            <img
              src={selectedImage}
              alt="Bug to analyze"
              className={`w-full h-full object-cover transition-all ${
                isAnalyzing ? 'brightness-75 scale-105 duration-1000' : ''
              }`}
            />

            {/* Clear Image Button */}
            {!isAnalyzing && (
              <button
                onClick={clearImage}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-all z-20"
                aria-label="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Viewfinder Target Reticle */}
            <div className="absolute inset-6 pointer-events-none border border-nature-400/30 rounded-2xl flex items-center justify-center">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-nature-400" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-nature-400" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-nature-400" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-nature-400" />
              
              <div className="w-16 h-16 rounded-full border border-nature-400/40 animate-pulse flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-nature-400" />
              </div>
            </div>

            {/* Scanning Laser HUD when analyzing */}
            {isAnalyzing && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="scan-laser-beam absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-nature-300 to-transparent shadow-[0_0_15px_#48cf90]" />
                <div className="absolute inset-0 bg-nature-500/10 backdrop-blur-[1px]" />
                <div className="absolute bottom-4 inset-x-4 glass-panel p-3 rounded-xl text-center border border-nature-400/40">
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-nature-300 animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{scanStepText}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Empty State / Photo Launchers */
          <div className="p-8 sm:p-10 text-center">
            <div className="w-20 h-20 rounded-3xl bg-nature-900/90 border border-nature-600/50 mx-auto flex items-center justify-center mb-5 shadow-lg shadow-nature-500/20">
              <Camera className="w-9 h-9 text-nature-300 animate-pulse-slow" />
            </div>

            <h3 className="text-lg font-bold text-white mb-2">Capture or Upload Bug</h3>
            <p className="text-xs text-emerald-100/60 max-w-xs mx-auto mb-6">
              Get as close and clear as safely possible for the most accurate AI taxonomy analysis.
            </p>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-sm mx-auto">
              <button
                onClick={() => {
                  playSound('click');
                  cameraInputRef.current?.click();
                }}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-nature-500 to-emerald-400 text-nature-950 font-bold text-xs tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-nature-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                <Camera className="w-4 h-4" />
                <span>Open Camera</span>
              </button>

              <button
                onClick={() => {
                  playSound('click');
                  fileInputRef.current?.click();
                }}
                className="py-3 px-4 rounded-xl glass-panel border border-nature-600/40 text-emerald-200 font-bold text-xs flex items-center justify-center gap-2 hover:bg-nature-800/80 hover:text-white transition-all"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Photo</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Non-Insect Error Banner */}
      {isNotInsect && (
        <div className="glass-panel p-4 rounded-2xl border border-amber-500/50 bg-amber-950/40 text-left animate-fadeIn">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-200">No Insect Detected</h4>
              <p className="text-xs text-amber-100/70 mt-1 leading-relaxed">
                Gemini couldn't identify an insect or arthropod in this image. Make sure the subject is centered and well-lit, then try scanning again.
              </p>
              <button
                onClick={() => {
                  clearImage();
                  cameraInputRef.current?.click();
                }}
                className="mt-3 px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition-colors"
              >
                Try Another Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* General Error Banner */}
      {errorMsg && (
        <div className="glass-panel p-4 rounded-2xl border border-red-500/50 bg-red-950/40 text-left animate-fadeIn">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-red-200">Scanner Notice</h4>
              <p className="text-xs text-red-100/70 mt-1">{errorMsg}</p>
            </div>
          </div>
        </div>
      )}

      {/* Location Selector */}
      <div className="glass-panel p-4 rounded-2xl border border-nature-700/50 text-left">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-nature-400" />
          <label className="text-xs font-bold text-white uppercase tracking-wider">
            Discovery Location (Optional)
          </label>
        </div>

        <p className="text-[11px] text-emerald-100/60 mb-3">
          BugDex never requires precise GPS. Choose a general environment tag:
        </p>

        <div className="flex flex-wrap gap-1.5">
          {LOCATION_OPTIONS.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => {
                playSound('click');
                setLocation(loc);
                setCustomLocation('');
              }}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                location === loc && !customLocation
                  ? 'bg-nature-500 text-nature-950 shadow-md shadow-nature-500/20'
                  : 'bg-nature-900/60 border border-nature-700/40 text-emerald-200/80 hover:bg-nature-800 hover:text-white'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Scan Trigger Button */}
      {selectedImage && !isAnalyzing && (
        <button
          onClick={startScan}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-nature-500 via-nature-400 to-emerald-400 text-nature-950 font-black text-base tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-nature-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Sparkles className="w-5 h-5 text-nature-950" />
          <span>IDENTIFY</span>
        </button>
      )}

      {/* Quick Test Samples */}
      <div className="glass-panel-subtle p-4 rounded-2xl border border-nature-800 text-left">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-nature-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" /> Indoor Test Specimens
          </span>
          <span className="text-[10px] text-emerald-200/50">Tap specimen to test scanner</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {SAMPLE_TEST_PHOTOS.map((sample, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelectSample(sample)}
              className="flex items-center gap-2 p-2 rounded-xl bg-nature-900/60 border border-nature-700/40 hover:border-nature-500/60 hover:bg-nature-800/80 text-left transition-all group"
            >
              <img
                src={sample.url}
                alt={sample.name}
                className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
              />
              <div className="overflow-hidden">
                <span className="text-xs font-bold text-white block truncate group-hover:text-nature-300">
                  {sample.name}
                </span>
                <span className="text-[9px] text-emerald-200/50 block truncate">
                  {sample.hint}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
