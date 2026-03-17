"use client";

import { useState, type ChangeEvent, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Loader2,
  AlertCircle,
  RefreshCcw,
  Sparkles,
  Copy,
  Check,
  ShieldAlert,
  Zap,
  ChevronRight,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError(null);
    } else {
      setError("Please upload a valid PDF file.");
    }
  };

  const startReview = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/review", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process review.");
      }

      setSummary(data.summary);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const reset = () => {
    setFile(null);
    setPreviewUrl(null);
    setSummary(null);
    setError(null);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#020617] font-sans text-slate-200 selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Premium Background Effects */}
      <div className="pointer-events-none absolute -top-48 -left-48 h-[600px] w-[600px] rounded-full bg-emerald-600/10 blur-[120px] animate-pulse" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/5 blur-[160px]" />
      <div className="pointer-events-none absolute -bottom-48 -right-48 h-[600px] w-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />

      {/* Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.15]" />

      <main className="relative z-10 flex min-h-screen flex-col items-center px-6 py-8 md:px-12">
        {/* Navigation / Header */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 flex w-full max-w-7xl items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-xl bg-emerald-500/20" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                <ShieldAlert className="text-white" size={20} />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                RESUME<span className="text-emerald-500">DESTROYER</span>
              </h1>
              <p className="text-[10px] font-medium tracking-[0.2em] text-slate-500 uppercase">
                Dream Job Gatekeeper v2.4
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-6 text-sm font-medium text-slate-400 md:flex">
            <button
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="hover:text-emerald-400 cursor-pointer transition-colors"
            >
              BRUTAL ANALYSIS
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="hover:text-emerald-400 cursor-pointer transition-colors"
            >
              ATS OPTIMIZATION
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="hover:text-emerald-400 cursor-pointer transition-colors"
            >
              STRATEGIC REBUILD
            </button>
          </div>
        </motion.nav>

        <AnimatePresence mode="wait">
          {!file ? (
            /* Premium Upload View */
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex w-full max-w-4xl flex-col items-center"
            >
              <div className="mb-12 text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400"
                >
                  <Zap size={14} fill="currentColor" />
                  POWERED BY LLAMA-3.3-70B
                </motion.div>
                <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-white md:text-6xl">
                  Is your resume{" "}
                  <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent italic pr-2">
                    good enough?
                  </span>
                </h2>
                <p className="mx-auto max-w-lg text-lg text-slate-400">
                  Most resumes get 6 seconds. The Resume Destroyer gives you
                  zero sugarcoating. Upload your PDF for a ruthless teardown.
                </p>
              </div>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative w-full cursor-pointer overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/40 p-1 bg-gradient-to-b from-slate-800/50 to-transparent backdrop-blur-3xl transition-all hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10"
              >
                <div className="flex flex-col items-center rounded-[1.8rem] border border-dashed border-slate-700 bg-slate-900/50 p-16 transition-colors group-hover:bg-slate-900/80">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 blur-2xl group-hover:bg-emerald-500/20 transition-all" />
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-800 ring-1 ring-slate-700 transition-all group-hover:-translate-y-2 group-hover:rotate-3 group-hover:scale-110">
                      <Upload className="text-emerald-400" size={40} />
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="mb-2 text-2xl font-bold text-white">
                      Drop your resume here
                    </h3>
                    <p className="text-slate-500">
                      Supports PDF format up to 10MB
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={handleFileUpload}
                  />

                  <div className="mt-8 flex items-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-black transition-all hover:scale-105 active:scale-95">
                    Select Document
                    <ChevronRight size={18} />
                  </div>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 flex items-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-6 py-3 text-rose-400"
                >
                  <AlertCircle size={20} />
                  <span className="font-medium">{error}</span>
                </motion.div>
              )}

              {/* Features Section */}
              <div
                id="features"
                className="mt-24 grid w-full grid-cols-1 gap-8 md:grid-cols-3"
              >
                {[
                  {
                    title: "Brutal Analysis",
                    desc: "Zero sugarcoating. We expose every fluff, cliché, and formatting disaster that kills your chances.",
                    icon: <ShieldAlert size={20} />,
                    color: "emerald",
                  },
                  {
                    title: "ATS Optimized",
                    desc: "Engineered to bypass the digital gatekeepers and get your resume into the hands of real humans.",
                    icon: <Zap size={20} />,
                    color: "blue",
                  },
                  {
                    title: "Strategic Rebuild",
                    desc: "PAR-formatted bullets that scream impact and result-oriented accomplishments for top-tier roles.",
                    icon: <Sparkles size={20} />,
                    color: "indigo",
                  },
                ].map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8 backdrop-blur-xl transition-all hover:border-emerald-500/30 group"
                  >
                    <div
                      className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-emerald-400 group-hover:scale-110 transition-transform`}
                    >
                      {f.icon}
                    </div>
                    <h4 className="mb-2 text-lg font-bold text-white uppercase tracking-tight">
                      {f.title}
                    </h4>
                    <p className="text-sm leading-relaxed text-slate-500">
                      {f.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            /* FAANG-Style Analysis View */
            <motion.div
              key="analysis"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex w-full max-w-[1600px] flex-col gap-8 lg:flex-row lg:h-[calc(100vh-180px)]"
            >
              {/* Left Side: Document Control & Preview */}
              <div className="flex flex-col gap-6 lg:w-[45%]">
                <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-xl">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-emerald-400">
                      <FileText size={24} />
                    </div>
                    <div className="max-w-[180px] md:max-w-[280px]">
                      <p className="truncate text-sm font-bold text-white">
                        {file.name}
                      </p>
                      <p className="text-[10px] font-medium text-emerald-500 uppercase tracking-wider">
                        Ready for destruction
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!summary && !isLoading ? (
                      <button
                        onClick={startReview}
                        className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-black transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20"
                      >
                        <Sparkles size={16} />
                        ANALYZE
                      </button>
                    ) : (
                      <button
                        onClick={reset}
                        className="group flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800/50 transition-all hover:border-emerald-500/50 hover:bg-slate-800"
                        title="Start Over"
                      >
                        <RefreshCcw
                          size={18}
                          className="text-slate-400 group-hover:text-emerald-400"
                        />
                      </button>
                    )}
                  </div>
                </div>

                <div className="relative flex-1 overflow-hidden rounded-3xl border border-slate-800 bg-[#0f172a]/80 shadow-2xl">
                  {/* Glass Header for PDF */}
                  <div className="absolute top-0 left-0 right-0 z-10 flex h-10 items-center bg-slate-900/50 px-4 backdrop-blur-md">
                    <div className="flex gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                      <div className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                      <div className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                    </div>
                  </div>
                  {previewUrl && (
                    <iframe
                      src={`${previewUrl}#toolbar=0&navpanes=0`}
                      className="h-full w-full pt-10"
                      title="PDF Preview"
                    />
                  )}
                  {isLoading && (
                    <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
                      <motion.div
                        initial={{ top: "-10%" }}
                        animate={{ top: "110%" }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute h-20 w-full bg-gradient-to-b from-transparent via-emerald-500/40 to-transparent blur-xl"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: AI Destruction Results */}
              <div className="flex flex-col gap-6 lg:w-[55%]">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-3 text-xl font-black italic tracking-tight text-white">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                    DESTRUCTION REPORT
                  </h3>

                  {summary && (
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-1.5 text-xs font-bold transition-all hover:border-emerald-500/50 hover:text-emerald-400"
                    >
                      {copied ? (
                        <>
                          <Check size={14} className="text-emerald-400" />
                          COPIED
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          COPY MD
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div className="relative flex-1 overflow-y-auto rounded-3xl border border-slate-800 bg-[#0f172a]/40 p-8 shadow-2xl backdrop-blur-md">
                  {isLoading ? (
                    <div className="flex h-full flex-col items-center justify-center">
                      <div className="relative mb-8">
                        <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20" />
                        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-slate-900 ring-4 ring-emerald-500/30">
                          <Loader2
                            className="animate-spin text-emerald-400"
                            size={40}
                          />
                        </div>
                      </div>
                      <h4 className="mb-2 text-2xl font-bold text-white">
                        Shredding mediocrity...
                      </h4>
                      <p className="animate-pulse text-sm text-slate-500 font-medium tracking-widest uppercase">
                        Initializing Llama-3.3-70b-Versatile
                      </p>
                    </div>
                  ) : summary ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="prose prose-invert prose-emerald max-w-none prose-headings:font-black prose-headings:italic prose-headings:tracking-tight prose-headings:uppercase prose-p:text-slate-300 prose-p:leading-relaxed prose-li:text-slate-300 prose-strong:text-emerald-400 prose-code:text-emerald-300"
                    >
                      <ReactMarkdown>{summary}</ReactMarkdown>
                    </motion.div>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-900 ring-1 ring-slate-800">
                        <Zap className="text-slate-700" size={32} />
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">
                        Analysis Pending
                      </h4>
                      <p className="max-w-xs text-sm text-slate-500">
                        The Destroyer is waiting. Click &quot;Analyze&quot; to
                        uncover the flaws in your career documentation.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modern Footer */}
      <footer className="relative z-10 w-full border-t border-slate-900 py-8 text-center backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-8 text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase">
            <span>FAANG Standard</span>
            <div className="h-1 w-1 rounded-full bg-slate-800" />
            <span>ATS Optimized</span>
            <div className="h-1 w-1 rounded-full bg-slate-800" />
            <span>Llama 3.3 Engine</span>
          </div>
          <p className="text-[10px] font-medium text-slate-500">
            &copy; 2026 REVIEWER AI. ALL TRUTHS EXPOSED.
          </p>
        </div>
      </footer>
    </div>
  );
}
