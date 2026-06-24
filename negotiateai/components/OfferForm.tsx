"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  ExternalLink,
  FileCheck,
  KeyRound,
  Mail,
  Sparkles,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AnalyzingChart } from "@/components/AnalyzingChart";
import { RESULT_STORAGE_KEY } from "@/lib/storage";

type Fields = {
  jobTitle: string;
  companyName: string;
  salary: string;
  city: string;
  yearsOfExperience: string;
  notes: string;
};

const EMPTY: Fields = {
  jobTitle: "",
  companyName: "",
  salary: "",
  city: "",
  yearsOfExperience: "",
  notes: "",
};

const DATA_STEPS = 3; // steps that fill the progress bar
const UNLOCK_STEP = 4;

const BOOSTY_URL =
  process.env.NEXT_PUBLIC_BOOSTY_URL || "https://boosty.to";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

const slide = {
  enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
};

export function OfferForm() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0 = intro, 1..3 = data, 4 = unlock
  const [dir, setDir] = useState(1);
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [file, setFile] = useState<File | null>(null);
  const [code, setCode] = useState("");
  const [stepError, setStepError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set =
    (key: keyof Fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFields((f) => ({ ...f, [key]: e.target.value }));

  function goTo(next: number, direction: number) {
    setDir(direction);
    setStepError(null);
    setError(null);
    setStep(next);
  }

  function validateStep(s: number): string | null {
    if (s === 1 && (!fields.jobTitle.trim() || !fields.companyName.trim()))
      return "Please fill in the job title and company.";
    if (
      s === 2 &&
      (!fields.salary.trim() ||
        !fields.yearsOfExperience.trim() ||
        !fields.city.trim())
    )
      return "Please fill in salary, experience and city.";
    return null;
  }

  function next() {
    const err = validateStep(step);
    if (err) return setStepError(err);
    goTo(step + 1, 1);
  }

  async function handleAnalyze() {
    if (!code.trim()) {
      setError("Please enter your access code.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      let pdfBase64: string | undefined;
      if (file) {
        if (file.type !== "application/pdf")
          throw new Error("Please upload a PDF file.");
        if (file.size > 8 * 1024 * 1024)
          throw new Error("PDF is too large (max 8MB).");
        pdfBase64 = await fileToBase64(file);
      }

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: fields.jobTitle.trim(),
          companyName: fields.companyName.trim(),
          salary: fields.salary.trim(),
          city: fields.city.trim(),
          yearsOfExperience: fields.yearsOfExperience.trim(),
          notes: fields.notes.trim(),
          pdfBase64,
          code: code.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      sessionStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(data));
      router.push("/result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  const progress = Math.min(step, DATA_STEPS);

  // Full-card analyzing state.
  if (submitting) {
    return (
      <Card className="mx-auto max-w-xl overflow-hidden">
        <CardContent className="p-6 sm:p-8">
          <AnalyzingChart />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-xl overflow-hidden">
      <CardContent className="p-6 sm:p-8">
        {step > 0 && (
          <div className="mb-7">
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {step <= DATA_STEPS ? `Step ${step} of ${DATA_STEPS}` : "Last step"}
              </span>
              <span>{Math.round((progress / DATA_STEPS) * 100)}% there</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={false}
                animate={{ width: `${(progress / DATA_STEPS) * 100}%` }}
                transition={{ type: "spring", stiffness: 180, damping: 24 }}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: "easeInOut" }}
          >
            {step === 0 && (
              <div className="space-y-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight">
                    Ready to find your real market rate?
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Answer a few quick questions. Takes about 60 seconds.
                  </p>
                </div>
                <div className="space-y-3 text-left">
                  {[
                    { Icon: Clock, text: "60 seconds, 3 short steps" },
                    {
                      Icon: FileCheck,
                      text: "Market range + exact counter-offer number",
                    },
                    { Icon: Mail, text: "A ready-to-send negotiation email" },
                  ].map(({ Icon, text }) => (
                    <div key={text} className="flex items-center gap-3 text-sm">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      {text}
                    </div>
                  ))}
                </div>
                <Button
                  size="lg"
                  className="w-full text-base"
                  onClick={() => goTo(1, 1)}
                >
                  Let&apos;s go <ArrowRight />
                </Button>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <StepHeading title="Tell us about the role" subtitle="The basics first." />
                <Field label="Job Title" htmlFor="jobTitle">
                  <Input
                    id="jobTitle"
                    autoFocus
                    value={fields.jobTitle}
                    onChange={set("jobTitle")}
                    placeholder="Senior Software Engineer"
                  />
                </Field>
                <Field label="Company Name" htmlFor="companyName">
                  <Input
                    id="companyName"
                    value={fields.companyName}
                    onChange={set("companyName")}
                    placeholder="Acme Inc."
                  />
                </Field>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <StepHeading
                  title="The numbers"
                  subtitle="This is how we find your market rate."
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Offered Base Salary (USD)" htmlFor="salary">
                    <Input
                      id="salary"
                      type="number"
                      min={0}
                      autoFocus
                      value={fields.salary}
                      onChange={set("salary")}
                      placeholder="140000"
                    />
                  </Field>
                  <Field label="Years of Experience" htmlFor="yearsOfExperience">
                    <Input
                      id="yearsOfExperience"
                      type="number"
                      min={0}
                      max={60}
                      value={fields.yearsOfExperience}
                      onChange={set("yearsOfExperience")}
                      placeholder="6"
                    />
                  </Field>
                </div>
                <Field label="City / Metro Area" htmlFor="city">
                  <Input
                    id="city"
                    value={fields.city}
                    onChange={set("city")}
                    placeholder="San Francisco, CA"
                  />
                </Field>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <StepHeading
                  title="Anything else? (optional)"
                  subtitle="Add your offer letter for bonus, equity & benefits context."
                />
                <div className="space-y-2">
                  <Label htmlFor="offerLetter">Upload Offer Letter (PDF)</Label>
                  <label
                    htmlFor="offerLetter"
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-input bg-background px-3 py-3 text-sm text-muted-foreground transition-colors hover:border-primary/40"
                  >
                    <Upload className="h-4 w-4" />
                    <span className="truncate">
                      {file?.name ?? "Drop a PDF to extract bonus, equity & benefits"}
                    </span>
                  </label>
                  <input
                    id="offerLetter"
                    type="file"
                    accept="application/pdf,.pdf"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </div>
                <Field label="Additional Notes" htmlFor="notes">
                  <Textarea
                    id="notes"
                    rows={3}
                    value={fields.notes}
                    onChange={set("notes")}
                    placeholder='e.g. "They said the salary is fixed and non-negotiable."'
                  />
                </Field>
              </div>
            )}

            {step === UNLOCK_STEP && (
              <div className="space-y-5">
                <div className="space-y-1 text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <KeyRound className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight">
                    One payment, instant access
                  </h3>
                </div>

                <ol className="space-y-3">
                  {[
                    {
                      n: "1",
                      text: "Click the button below — pay $9 on Boosty (card, Apple Pay, etc.)",
                    },
                    {
                      n: "2",
                      text: "Boosty instantly reveals your access code inside the post",
                    },
                    {
                      n: "3",
                      text: "Copy the code and paste it here — your analysis appears in seconds",
                    },
                  ].map(({ n, text }) => (
                    <li key={n} className="flex gap-3 text-sm">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                        {n}
                      </span>
                      <span className="text-muted-foreground">{text}</span>
                    </li>
                  ))}
                </ol>

                <a
                  href={BOOSTY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/[0.08] px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/[0.14]"
                >
                  Pay $9 and get my code on Boosty{" "}
                  <ExternalLink className="h-4 w-4" />
                </a>

                <Field label="Paste your access code" htmlFor="code">
                  <Input
                    id="code"
                    autoFocus
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAnalyze();
                    }}
                    placeholder="NEGO-XXXXXXXX-XXXXXXXX"
                    className="text-center font-mono tracking-wider"
                    autoCapitalize="characters"
                    spellCheck={false}
                  />
                </Field>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {stepError && step > 0 && step <= DATA_STEPS && (
          <p className="mt-4 text-sm text-destructive">{stepError}</p>
        )}
        {error && (
          <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        {step > 0 && (
          <div className="mt-7 flex items-center gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={() => goTo(step - 1, -1)}
              className="shrink-0"
            >
              <ArrowLeft />
            </Button>

            {step < DATA_STEPS ? (
              <Button size="lg" className="flex-1 text-base" onClick={next}>
                Continue <ArrowRight />
              </Button>
            ) : step === DATA_STEPS ? (
              <Button size="lg" className="flex-1 text-base" onClick={next}>
                Continue to unlock <ArrowRight />
              </Button>
            ) : (
              <Button
                size="lg"
                className="flex-1 text-base"
                onClick={handleAnalyze}
              >
                Unlock &amp; Analyze <ArrowRight />
              </Button>
            )}
          </div>
        )}

        {step > 0 && (
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Paid once via Boosty · No account · We don&apos;t store your offer
            details.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function StepHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="space-y-1">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
