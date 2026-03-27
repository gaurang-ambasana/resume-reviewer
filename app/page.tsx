"use client";

import {
  type ChangeEvent,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { PDFParse } from "pdf-parse";
import {
  AlertCircle,
  Check,
  Copy,
  FileText,
  Loader2,
  RefreshCcw,
  ShieldAlert,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const PDF_WORKER_URL =
  "https://cdn.jsdelivr.net/npm/pdf-parse@2.4.5/dist/pdf-parse/web/pdf.worker.min.mjs";
const LOADING_MESSAGES = [
  "Reading the resume like a hiring manager on a deadline.",
  "Checking whether the story feels credible and competitive.",
  "Looking for weak claims, missing proof, and vague positioning.",
  "Rebuilding the strongest angle for the role this resume suggests.",
  "Calibrating what level of opportunity this profile can realistically target.",
];

type AnalysisState = {
  file: File | null;
  previewUrl: string | null;
  summary: string | null;
  error: string | null;
  isLoading: boolean;
  copied: boolean;
};

const initialState: AnalysisState = {
  file: null,
  previewUrl: null,
  summary: null,
  error: null,
  isLoading: false,
  copied: false,
};

PDFParse.setWorker(PDF_WORKER_URL);

export default function Home() {
  const [state, setState] = useState<AnalysisState>(initialState);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (state.previewUrl) {
        URL.revokeObjectURL(state.previewUrl);
      }
      if (copyTimerRef.current) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, [state.previewUrl]);

  useEffect(() => {
    if (!state.isLoading) {
      setLoadingMessageIndex(0);
      return;
    }

    const intervalId = window.setInterval(() => {
      setLoadingMessageIndex((current) =>
        current === LOADING_MESSAGES.length - 1 ? 0 : current + 1,
      );
    }, 2200);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [state.isLoading]);

  const setError = (message: string | null) => {
    setState((current) => ({ ...current, error: message }));
  };

  const clearPreviewUrl = (previewUrl: string | null) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      event.target.value = "";
      setError("Please upload a valid PDF file.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      event.target.value = "";
      setError("Please upload a PDF smaller than 10MB.");
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(selectedFile);

    setState((current) => {
      clearPreviewUrl(current.previewUrl);

      return {
        ...current,
        file: selectedFile,
        previewUrl: nextPreviewUrl,
        summary: null,
        error: null,
      };
    });
  };

  const extractResumeText = async (file: File) => {
    const parser = new PDFParse({
      data: new Uint8Array(await file.arrayBuffer()),
    });

    try {
      const result = await parser.getText();
      const text = result.text.trim();

      if (!text) {
        throw new Error(
          "We could not extract any text from this PDF. Try a text-based PDF instead of a scanned image.",
        );
      }

      return text;
    } finally {
      await parser.destroy();
    }
  };

  const requestReview = async (resumeText: string) => {
    const response = await fetch("/api/review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resumeText,
      }),
    });

    const data = (await response.json()) as {
      error?: string;
      summary?: string;
    };

    if (!response.ok) {
      throw new Error(data.error || "Failed to generate the review.");
    }

    return data.summary || "No summary generated.";
  };

  const startReview = async () => {
    if (!state.file) {
      setError("Please choose a PDF first.");
      return;
    }

    setState((current) => ({
      ...current,
      isLoading: true,
      error: null,
      summary: null,
    }));

    try {
      const resumeText = await extractResumeText(state.file);
      const summary = await requestReview(resumeText);

      setState((current) => ({
        ...current,
        summary,
      }));
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setState((current) => ({
        ...current,
        isLoading: false,
      }));
    }
  };

  const copyToClipboard = async () => {
    if (!state.summary) {
      return;
    }

    try {
      await navigator.clipboard.writeText(state.summary);
      setState((current) => ({ ...current, copied: true }));

      if (copyTimerRef.current) {
        window.clearTimeout(copyTimerRef.current);
      }

      copyTimerRef.current = window.setTimeout(() => {
        setState((current) => ({ ...current, copied: false }));
      }, 2000);
    } catch {
      setError(
        "Clipboard access failed. You can still select and copy the text manually.",
      );
    }
  };

  const reset = () => {
    setState((current) => {
      clearPreviewUrl(current.previewUrl);

      return {
        ...current,
        file: null,
        previewUrl: null,
        summary: null,
        error: null,
        copied: false,
        isLoading: false,
      };
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
        <div className="bg-grid absolute inset-0 opacity-40" />
        <div className="bg-vignette absolute inset-0" />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 md:px-10">
        <header className="mb-10 flex flex-col gap-6 rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
              <ShieldAlert size={16} />
              Instant Resume Feedback
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
                Resume Destroyer
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                Upload your resume and get direct, practical feedback on what is
                weak, what is missing, and how to improve it fast.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100 md:max-w-sm">
            <p className="font-semibold uppercase tracking-[0.2em] text-amber-200">
              Before You Start
            </p>
            <p className="mt-2 leading-6">
              Best results come from a clear, text-based resume. Scanned image
              resumes may produce weaker feedback.
            </p>
          </div>
        </header>

        <section className="grid flex-1 gap-8 lg:grid-cols-[1.05fr_1.2fr]">
          <div className="space-y-6 rounded-[2rem] border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-slate-950/30">
            <div className="space-y-3">
              <h2 className="flex items-center gap-3 text-xl font-bold text-white">
                <Zap className="text-emerald-400" size={20} />
                Upload And Analyze
              </h2>
              <p className="text-sm leading-6 text-slate-400">
                Choose your resume, start the review, and get a sharp breakdown
                with stronger rewrites and clearer next steps.
              </p>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full flex-col items-center justify-center gap-4 rounded-[2rem] border border-dashed border-slate-700 bg-slate-950/60 px-6 py-10 text-center transition hover:border-emerald-400 hover:bg-slate-950"
            >
              <div className="rounded-3xl bg-emerald-500/10 p-5 text-emerald-300">
                <Upload size={28} />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-bold text-white">
                  {state.file ? state.file.name : "Choose Your Resume"}
                </p>
                <p className="text-sm text-slate-400">PDF format, up to 10MB</p>
              </div>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={handleFileUpload}
            />

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={startReview}
                disabled={state.isLoading}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
              >
                {state.isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Sparkles size={18} />
                )}
                {state.isLoading ? "Reviewing" : "Run Review"}
              </button>

              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 px-5 py-3 font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
              >
                <RefreshCcw size={18} />
                Reset
              </button>
            </div>

            {state.error && (
              <div className="flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <p className="leading-6">{state.error}</p>
              </div>
            )}

            {state.previewUrl && (
              <div className="overflow-hidden rounded-[1.5rem] border border-slate-800 bg-slate-950">
                <div className="flex items-center gap-3 border-b border-slate-800 px-4 py-3 text-sm text-slate-400">
                  <FileText size={16} />
                  Resume Preview
                </div>
                <iframe
                  src={`${state.previewUrl}#toolbar=0&navpanes=0`}
                  title="Resume Preview"
                  className="h-[28rem] w-full"
                />
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-slate-950/30">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Review Output</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Your feedback appears here once the review is complete.
                </p>
              </div>

              <button
                type="button"
                onClick={copyToClipboard}
                disabled={!state.summary}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-emerald-400 hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {state.copied ? <Check size={16} /> : <Copy size={16} />}
                {state.copied ? "Copied" : "Copy"}
              </button>
            </div>

            <div className="flex min-h-[32rem] items-center justify-center rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-6">
              {state.isLoading ? (
                <div className="text-center">
                  <Loader2
                    className="mx-auto mb-4 animate-spin text-emerald-400"
                    size={36}
                  />
                  <p className="text-lg font-semibold text-white">
                    Building your review...
                  </p>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-slate-400 transition-all duration-500">
                    {LOADING_MESSAGES[loadingMessageIndex]}
                  </p>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    This can take a little longer for larger resumes.
                  </p>
                </div>
              ) : state.summary ? (
                <div className="prose prose-invert prose-emerald max-h-[32rem] w-full overflow-y-auto prose-headings:font-bold prose-p:text-slate-300 prose-li:text-slate-300">
                  <ReactMarkdown>{state.summary}</ReactMarkdown>
                </div>
              ) : (
                <EmptyState>
                  Upload your resume and start the review to see your feedback
                  here.
                </EmptyState>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-md text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-slate-500">
        <FileText size={28} />
      </div>
      <p className="text-base leading-7 text-slate-400">{children}</p>
    </div>
  );
}
