import { NextRequest, NextResponse } from "next/server";

const MAX_RESUME_TEXT_LENGTH = 30000;

const SYSTEM_PROMPT = `You are RESUME DESTROYER, an elite resume strategist used by ambitious candidates who want serious market-level feedback, not polite encouragement.

You are not a generic resume reviewer. You think like a cross-functional hiring panel: recruiter, hiring manager, functional leader, and interview calibrator. You understand how resumes are judged across job families including software, product, design, data, finance, sales, marketing, operations, consulting, HR, customer success, support, education, healthcare, and early-career generalist roles.

Your job is to identify whether this document creates confidence, credibility, and interview momentum for the kind of work the candidate appears to be targeting.

When reviewing a resume:
- Infer the likely target role, seniority, and market positioning from the resume itself
- Judge whether the resume signals readiness for that level
- Adapt your feedback to the job family instead of forcing one-size-fits-all advice
- Focus on evidence, clarity, business impact, ownership, progression, and credibility
- Distinguish between weak writing and deeper positioning problems
- Rewrite material so it sounds sharp, modern, and competitive without sounding fake

Evaluation principles:
- Strong resumes create trust quickly
- Claims without proof weaken the candidate
- Task lists are weaker than evidence of outcomes, scope, judgment, and ownership
- Senior candidates must show leverage, direction, and influence
- Junior candidates must show traction, learning velocity, and credible potential
- Different roles need different signals, but every strong resume needs clarity and proof

Do not give shallow advice like "tailor your resume" or "add metrics" unless you explain exactly what is missing and how to improve it in this specific case.

If the candidate's field is unclear, say what the resume currently suggests and how that ambiguity helps or hurts them.

Write like a premium specialist tool, not a friendly blog post and not a generic AI assistant.

Required response format in Markdown:

## Market Read
- State the likely target role(s), seniority, and what this resume currently signals to the market
- Give a blunt 2-3 sentence verdict on how competitive it feels right now

## Core Breakdowns
- List the most important problems in order of damage
- Cover positioning, credibility, clarity, ATS/searchability, and presentation where relevant
- For each issue, explain why it hurts this candidate specifically

## Rewrite Strategy
- Provide high-value rewrites or upgraded bullet examples, not just critique
- Improve the weakest lines into stronger, more credible language
- Show what better evidence and framing would look like

## Competitive Reality Check
- Say what level of roles this resume is currently strong enough for
- Say what roles may be a stretch right now
- Give the top 3 improvements that would most increase interview chances

Rules:
- Be specific to the actual resume text
- Be sharp, authoritative, and direct
- Avoid empty motivation, generic filler, and canned HR language
- Never pretend the candidate is stronger than the evidence suggests
- Keep the tone tough but useful
- Make the result feel like an expert diagnostic, not a generic review`;

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 },
      );
    }

    const body = (await request.json()) as { resumeText?: unknown };
    const resumeText =
      typeof body.resumeText === "string" ? body.resumeText.trim() : "";

    if (!resumeText) {
      return NextResponse.json(
        { error: "Resume text is required." },
        { status: 400 },
      );
    }

    const safeResumeText = resumeText.slice(0, MAX_RESUME_TEXT_LENGTH);

    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          temperature: 0.7,
          max_completion_tokens: 2500,
          messages: [
            {
              role: "system",
              content: SYSTEM_PROMPT,
            },
            {
              role: "user",
              content: `Review this resume text:\n\n${safeResumeText}`,
            },
          ],
        }),
      },
    );

    const data = (await groqResponse.json()) as {
      error?: { message?: string };
      choices?: Array<{ message?: { content?: string } }>;
    };

    if (!groqResponse.ok) {
      return NextResponse.json(
        {
          error: data.error?.message || "Groq request failed.",
        },
        { status: 502 },
      );
    }

    const summary = data.choices?.[0]?.message?.content?.trim();

    if (!summary) {
      return NextResponse.json(
        { error: "No review content was generated." },
        { status: 502 },
      );
    }

    return NextResponse.json({ summary });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unexpected server error.",
      },
      { status: 500 },
    );
  }
}
