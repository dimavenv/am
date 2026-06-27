import type { ReactNode } from "react";
import Link from "next/link";

/**
 * The content layer that wraps the tool. Each post targets one of the narrow
 * "salary negotiation email" keywords and ends with the tool as its natural CTA.
 * Posts are authored as semantic JSX and styled by the `.article` rules in
 * globals.css, so the body stays clean (just headings, paragraphs, lists, and
 * <blockquote> for copy-paste templates).
 *
 * To add a post: add a PostMeta entry to POSTS and a body to POST_BODIES.
 */

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO published date
  updated?: string; // ISO last-updated date
  keywords: string[];
  readingMinutes: number;
  faqs: { q: string; a: string }[];
};

export const POSTS: PostMeta[] = [
  {
    slug: "salary-negotiation-email-templates",
    title: "Salary Negotiation Email Templates: 9 Real Examples for 2026",
    description:
      "Nine copy-paste salary negotiation email templates with real numbers — counter a job offer, ask for a raise, or negotiate when the salary is 'non-negotiable'.",
    date: "2026-06-28",
    updated: "2026-06-28",
    keywords: [
      "salary negotiation email template",
      "salary negotiation email templates",
      "salary negotiation email sample",
      "how to negotiate salary in email",
      "salary negotiation email after job offer",
    ],
    readingMinutes: 9,
    faqs: [
      {
        q: "How do you politely ask for a higher salary in an email?",
        a: "Thank them for the offer, restate your enthusiasm for the role, give a specific number backed by market data, and keep it to a few short paragraphs. Example: 'Thank you for the offer to join Acme as a Senior Software Engineer. Based on market rates for this role in Austin and my 6 years of experience, I was hoping we could land base salary at $150,000. I'm confident I can deliver real value and would be thrilled to accept.'",
      },
      {
        q: "Is it better to negotiate salary by email or phone?",
        a: "Email is usually better for the actual ask. It lets you edit before sending, creates a paper trail, anchors a specific number in writing, and gives the recruiter time to take your request to the hiring manager instead of reacting on the spot.",
      },
      {
        q: "How much higher should I counter a salary offer?",
        a: "A common range is 10–20% above the initial offer, anchored to a real market range rather than a round number. If the offer is $120,000 and the market range for your role and city is $130,000–$150,000, countering at $145,000 leaves room to settle around the midpoint.",
      },
    ],
  },
  {
    slug: "how-to-counter-a-lowball-job-offer",
    title: "How to Counter a Lowball Job Offer (Email Script + Examples)",
    description:
      "A step-by-step guide to countering a lowball job offer by email — how to spot a below-market offer, what to say, and a copy-paste script with real dollar figures.",
    date: "2026-06-28",
    updated: "2026-06-28",
    keywords: [
      "how to counter a lowball job offer",
      "lowball job offer",
      "counter offer salary email",
      "respond to low salary offer",
    ],
    readingMinutes: 8,
    faqs: [
      {
        q: "What is considered a lowball job offer?",
        a: "An offer is 'lowball' when the base salary sits clearly below the market range for that role, city, and experience level — often 10% or more under the midpoint. The fix is to compare the number against a real range before reacting, not to rely on gut feel.",
      },
      {
        q: "Should you accept a lowball offer and negotiate later?",
        a: "It's almost always easier to negotiate before you sign than after. Once you accept in writing, your leverage drops sharply. Counter politely first; you can still accept the original number if they hold firm.",
      },
      {
        q: "Will I lose the offer if I counter a lowball salary?",
        a: "Rescinding an offer over a polite, market-backed counter is rare — companies expect candidates to negotiate. The risk is far lower than the upside, and a respectful, evidence-based email keeps the relationship positive.",
      },
    ],
  },
  {
    slug: "negotiate-salary-when-non-negotiable",
    title: "How to Negotiate When the Salary Is “Non-Negotiable”",
    description:
      "“The salary is fixed” rarely means the whole offer is. A guide to negotiating total compensation when the base is non-negotiable — with a copy-paste email.",
    date: "2026-06-28",
    updated: "2026-06-28",
    keywords: [
      "salary non negotiable",
      "negotiate when salary is non-negotiable",
      "salary is fixed how to negotiate",
      "negotiate benefits instead of salary",
    ],
    readingMinutes: 7,
    faqs: [
      {
        q: "What do you say when the salary is non-negotiable?",
        a: "Acknowledge the constraint, restate your interest, and pivot to the parts of the offer that usually do flex: a signing bonus, extra PTO, a faster review cycle, a title bump, remote/flex work, or a professional-development budget. Example: 'I understand the base is set. Since that's fixed, would a $10,000 signing bonus or an extra week of PTO be possible?'",
      },
      {
        q: "Is salary ever really non-negotiable?",
        a: "Sometimes the base truly is locked — public-sector bands, fixed pay scales, or strict leveling. But even then the total package usually has movable parts. 'Non-negotiable' almost always refers to base salary only, not bonus, equity, start date, title, or benefits.",
      },
      {
        q: "What can I ask for instead of a higher salary?",
        a: "Common wins include a signing bonus, additional PTO, a guaranteed early performance/comp review, equity or a larger equity grant, a higher title, remote or flexible hours, relocation support, and a learning/development budget.",
      },
    ],
  },
  {
    slug: "total-compensation-negotiation",
    title: "Total Compensation: How to Negotiate Beyond Base Salary",
    description:
      "Base salary is one number in a much bigger package. Learn how to value and negotiate total compensation — bonus, equity, PTO, and remote flexibility — with examples.",
    date: "2026-06-28",
    updated: "2026-06-28",
    keywords: [
      "total compensation negotiation",
      "negotiate beyond base salary",
      "signing bonus negotiation",
      "equity negotiation job offer",
    ],
    readingMinutes: 8,
    faqs: [
      {
        q: "What is included in total compensation?",
        a: "Total compensation is everything you're paid, not just base salary: annual bonus, signing bonus, equity (RSUs or options), 401(k) match, health benefits, PTO, remote/flex arrangements, and perks like a learning budget. Two offers with the same base can differ by tens of thousands once you add it all up.",
      },
      {
        q: "Should I negotiate base salary or a signing bonus?",
        a: "Base salary compounds — it raises future raises, bonuses, and your next offer — so prioritize it. But a signing bonus is often the easiest lever when the base band is capped, and it's real money in year one. Ask for base first, then fall back to a signing bonus.",
      },
      {
        q: "How do you negotiate equity in a job offer?",
        a: "Treat equity as a number, not a mystery: ask for the strike price, vesting schedule, and the company's current 409A or preferred valuation so you can estimate its value. Then negotiate the size of the grant the same way you'd negotiate base — with a specific ask and a market comparison.",
      },
    ],
  },
];

export function getPost(slug: string): PostMeta | undefined {
  return POSTS.find((p) => p.slug === slug);
}

// ─── CTA reused at the end of every post ───────────────────────────────────

function ToolCTA() {
  return (
    <aside className="not-prose my-8 rounded-xl border border-primary/30 bg-primary/[0.07] p-6">
      <p className="text-base font-semibold text-foreground">
        Don&apos;t want to write it yourself?
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Paste your offer into NegotiateAI and get your market rate, an exact
        counter-offer number, and a ready-to-send negotiation email in 60
        seconds — for $9, no account.
      </p>
      <Link
        href="/#analyze"
        className="mt-4 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium !text-primary-foreground no-underline transition-colors hover:bg-primary/90 hover:!text-primary-foreground"
      >
        Analyze my offer — $9
      </Link>
    </aside>
  );
}

// ─── Post bodies ───────────────────────────────────────────────────────────

const POST_BODIES: Record<string, ReactNode> = {
  "salary-negotiation-email-templates": (
    <>
      <p>
        A salary negotiation email does something a phone call can&apos;t: it
        anchors a specific number in writing, gives the recruiter time to take
        your ask to the hiring manager, and lets you edit every word before you
        hit send. Below are nine templates for the situations that actually come
        up — each one built around a <strong>specific number tied to a market
        range</strong>, because that&apos;s what separates a counter that lands
        from one that gets ignored.
      </p>

      <h2>The anatomy of an email that gets a yes</h2>
      <p>Every strong negotiation email does four things, in order:</p>
      <ol>
        <li>
          <strong>Open with genuine enthusiasm.</strong> You want the role; say
          so. It reframes the ask as &quot;let&apos;s make this work&quot;
          rather than &quot;this isn&apos;t enough.&quot;
        </li>
        <li>
          <strong>Give one specific number.</strong> Not a range, not
          &quot;more.&quot; A single figure anchored to market data.
        </li>
        <li>
          <strong>Justify it in one line.</strong> Market rate, competing offer,
          a scarce skill — one concrete reason.
        </li>
        <li>
          <strong>Close warmly and leave the door open.</strong> Make it easy to
          say yes and easy to keep talking.
        </li>
      </ol>

      <h2>1. Counter a job offer (the everyday case)</h2>
      <blockquote>
        Subject: Re: Offer for Senior Software Engineer
        <br />
        <br />
        Hi [Recruiter],
        <br />
        <br />
        Thank you for the offer to join [Company] as a Senior Software Engineer
        — I&apos;m genuinely excited about [specific team/project]. After looking
        at market rates for this role in [City] and weighing my [6 years of
        experience / specialty], I was hoping we could bring the base salary to
        <strong> $150,000</strong> (the offer came in at $135,000). I&apos;m
        confident I can deliver real value here and would be thrilled to start on
        a number that works for both of us.
        <br />
        <br />
        Best,
        <br />
        [Your name]
      </blockquote>

      <h2>2. When the salary is &quot;non-negotiable&quot;</h2>
      <p>
        &quot;The budget is fixed&quot; rarely means the whole offer is fixed.
        Pivot to total compensation:
      </p>
      <blockquote>
        Hi [Recruiter],
        <br />
        <br />
        I completely understand the base is set. I&apos;m still very excited
        about the role. Since the salary is fixed, would any of these have room:
        a <strong>$10,000 signing bonus</strong>, an extra week of PTO, a
        six-month compensation review, or a remote/flex arrangement? Any one of
        those would make this an easy yes for me.
        <br />
        <br />
        Best,
        <br />
        [Your name]
      </blockquote>

      <h2>3. You have a competing offer</h2>
      <blockquote>
        Hi [Recruiter],
        <br />
        <br />
        [Company] is my top choice — I&apos;d rather be here than anywhere else.
        To be transparent, I have another offer at <strong>$165,000</strong>. I
        don&apos;t want to make this about a bidding war, but if you could get
        close to that number I&apos;d sign today.
        <br />
        <br />
        Best,
        <br />
        [Your name]
      </blockquote>

      <h2>4. Asking for a raise at your current job</h2>
      <blockquote>
        Hi [Manager],
        <br />
        <br />
        I&apos;d like to set up 30 minutes to talk about my compensation. Over
        the past year I&apos;ve [led project X, exceeded targets by Y%, taken on
        Z]. Based on those contributions and market data for similar roles, an
        adjustment to <strong>$135,000</strong> feels appropriate. I&apos;m
        committed to keeping this momentum going. Do you have time this week or
        next?
        <br />
        <br />
        Thanks,
        <br />
        [Your name]
      </blockquote>

      <h2>5. Negotiating a promotion raise</h2>
      <blockquote>
        Hi [Manager],
        <br />
        <br />
        Thank you for the promotion to [new title] — I&apos;m excited to step
        up. The new responsibilities put me squarely in the [Senior] band, where
        market rates run <strong>$140,000–$160,000</strong>. Could we set the new
        base at <strong>$150,000</strong> to match the scope of the role?
        <br />
        <br />
        Best,
        <br />
        [Your name]
      </blockquote>

      <h2>6–9: quick-fire variations</h2>
      <p>
        The same skeleton flexes to almost any moment. Swap the number and the
        one-line justification:
      </p>
      <ul>
        <li>
          <strong>Entry-level / first offer:</strong> lean on the published
          range for the role and city rather than your (thin) track record.
        </li>
        <li>
          <strong>Internal transfer:</strong> anchor to what the role pays
          externally, not your current band.
        </li>
        <li>
          <strong>Contract-to-hire conversion:</strong> price the certainty and
          ramp time you&apos;re saving them.
        </li>
        <li>
          <strong>After a verbal offer:</strong> get the number in writing
          first, then counter by email.
        </li>
      </ul>

      <h2>The one thing every template needs: a real number</h2>
      <p>
        Notice that each template above has a concrete figure, not a bracket. The
        hard part isn&apos;t the wording — it&apos;s knowing whether $150,000 is
        ambitious or conservative for <em>your</em> role, city, and experience.
        Guess too low and you leave money on the table; too high and you look
        uncalibrated. That&apos;s the exact gap{" "}
        <Link href="/#analyze">NegotiateAI</Link> fills: it estimates your market
        range, picks the counter number, and writes the email around it.
      </p>

      <ToolCTA />

      <p>
        Related reading:{" "}
        <Link href="/blog/how-to-counter-a-lowball-job-offer">
          how to counter a lowball job offer
        </Link>{" "}
        and{" "}
        <Link href="/blog/negotiate-salary-when-non-negotiable">
          negotiating when the salary is &quot;non-negotiable&quot;
        </Link>
        .
      </p>
    </>
  ),

  "how-to-counter-a-lowball-job-offer": (
    <>
      <p>
        A lowball offer feels personal, but it&apos;s usually just an opening
        number — and opening numbers are meant to move. The goal of this guide is
        simple: help you tell whether an offer is actually below market, then
        give you the exact email to push it up without risking the offer.
      </p>

      <h2>Step 1: Decide if it&apos;s really a lowball</h2>
      <p>
        &quot;Lowball&quot; isn&apos;t a feeling — it&apos;s a number sitting
        below the market range for your role, city, and experience. Before you
        react, pin down that range. A Senior Product Manager in New York might
        see a market band of <strong>$160,000–$190,000</strong>; an offer of
        $145,000 is a clear lowball. The same $145,000 for a mid-level PM in a
        lower-cost metro might be strong. Context is everything.
      </p>

      <h2>Step 2: Don&apos;t accept on the spot</h2>
      <p>
        Your leverage is highest in the window between offer and signature. A
        warm &quot;thank you, I&apos;d like a day to review the details&quot;
        buys you time to research and draft — and signals, gently, that
        you&apos;re evaluating, not desperate.
      </p>

      <h2>Step 3: Send the counter email</h2>
      <p>Here&apos;s the script. Specific number, one justification, warm close:</p>
      <blockquote>
        Subject: Re: Offer — [Role]
        <br />
        <br />
        Hi [Recruiter],
        <br />
        <br />
        Thank you so much for the offer to join [Company] as a [Role]. I&apos;m
        excited about [specific project/team] and can see myself doing great work
        with you.
        <br />
        <br />
        I did want to discuss the base. Based on market data for [Role] in [City]
        at my experience level, the range runs{" "}
        <strong>$160,000–$190,000</strong>, so I was hoping we could meet at{" "}
        <strong>$180,000</strong>. With my background in [specialty], I&apos;m
        confident I&apos;ll more than justify it. If we can get there, I&apos;m
        ready to sign.
        <br />
        <br />
        Best,
        <br />
        [Your name]
      </blockquote>

      <h2>Step 4: Handle the pushback</h2>
      <ul>
        <li>
          <strong>&quot;That&apos;s above our band.&quot;</strong> → Pivot to
          total comp: signing bonus, equity, PTO, an early review.
        </li>
        <li>
          <strong>&quot;Can you share that market data?&quot;</strong> → Name
          your sources and the range; specificity reads as preparation.
        </li>
        <li>
          <strong>&quot;This is our best and final.&quot;</strong> → Decide your
          walk-away number in advance so you&apos;re never negotiating against
          yourself in the moment.
        </li>
      </ul>

      <h2>The shortcut</h2>
      <p>
        Steps 1 and 3 are where people stall — what&apos;s the real range, and
        what exact number do I ask for?{" "}
        <Link href="/#analyze">NegotiateAI</Link> does both: paste the offer and
        it returns your market range, a specific counter-offer figure, and a
        finished email you can send as-is.
      </p>

      <ToolCTA />

      <p>
        Related reading:{" "}
        <Link href="/blog/salary-negotiation-email-templates">
          9 salary negotiation email templates
        </Link>{" "}
        and{" "}
        <Link href="/blog/total-compensation-negotiation">
          how to negotiate total compensation
        </Link>
        .
      </p>
    </>
  ),

  "negotiate-salary-when-non-negotiable": (
    <>
      <p>
        &quot;The salary is non-negotiable&quot; is one of the most common lines
        in hiring — and one of the most misunderstood. It almost never means the
        whole offer is fixed. It means the <em>base</em> is fixed. And the base is
        only one of a dozen things you can negotiate. This guide shows you how to
        pivot gracefully and walk away with more, even when the number itself
        won&apos;t move.
      </p>

      <h2>Why &quot;non-negotiable&quot; usually isn&apos;t</h2>
      <p>
        Recruiters say it for real reasons: rigid pay bands, internal equity
        (paying you more than a peer causes problems), or simple anchoring to keep
        you from pushing. But pay bands govern <strong>base salary</strong>, not
        signing bonuses, equity, start dates, titles, or PTO. Those usually come
        from different budgets and different approvers — which is exactly why
        they&apos;re easier to move.
      </p>

      <h2>Step 1: Accept the constraint out loud</h2>
      <p>
        Don&apos;t argue the band. Arguing makes the recruiter defensive. Instead,
        acknowledge it — that earns goodwill and frees you to redirect:
      </p>
      <blockquote>
        &quot;Totally understand the base is fixed — I appreciate you being
        straight with me. I&apos;m still really excited about the role.&quot;
      </blockquote>

      <h2>Step 2: Pivot to the movable parts</h2>
      <p>Here&apos;s the full menu of what usually flexes, roughly in order of how often it works:</p>
      <ul>
        <li>
          <strong>Signing bonus</strong> — the single easiest lever; one-time
          cash that doesn&apos;t touch the band. $5,000–$20,000 is common.
        </li>
        <li>
          <strong>Extra PTO</strong> — a week of vacation is real money and costs
          them little.
        </li>
        <li>
          <strong>An early comp review</strong> — a guaranteed raise conversation
          at 6 months instead of 12.
        </li>
        <li>
          <strong>Equity</strong> — a larger grant, when the company offers it.
        </li>
        <li>
          <strong>Title</strong> — a bump that boosts both this role and your next
          offer.
        </li>
        <li>
          <strong>Remote / flexible hours</strong> and a{" "}
          <strong>learning budget</strong> — low-cost yeses that improve your
          day-to-day.
        </li>
      </ul>

      <h2>Step 3: Send the email</h2>
      <p>Pick two or three asks, not all of them. A focused ask is easier to grant:</p>
      <blockquote>
        Subject: Re: Offer — [Role]
        <br />
        <br />
        Hi [Recruiter],
        <br />
        <br />
        Thank you again for the offer — I&apos;m excited to join [Company]. I
        understand the base salary is fixed, and that&apos;s completely fine.
        <br />
        <br />
        Since the base is set, I wanted to ask about a couple of other pieces: would
        a <strong>$12,000 signing bonus</strong> and an{" "}
        <strong>extra week of PTO</strong> be possible? Either one would make this
        an easy yes, and I&apos;d be ready to sign right away.
        <br />
        <br />
        Best,
        <br />
        [Your name]
      </blockquote>

      <h2>If everything is truly locked</h2>
      <p>
        Occasionally the whole package is fixed — common in government, education,
        or strict pay scales. Then your negotiation is about <em>information</em>:
        ask about the raise timeline, promotion path, and review criteria so you
        know exactly when the number <em>can</em> move. Get the answer in writing.
      </p>

      <p>
        Not sure which asks are realistic for your role and level?{" "}
        <Link href="/#analyze">NegotiateAI</Link> reads your offer and tells you
        where the leverage is — then writes the email for you.
      </p>

      <ToolCTA />

      <p>
        Related reading:{" "}
        <Link href="/blog/total-compensation-negotiation">
          how to negotiate total compensation
        </Link>{" "}
        and{" "}
        <Link href="/blog/salary-negotiation-email-templates">
          9 salary negotiation email templates
        </Link>
        .
      </p>
    </>
  ),

  "total-compensation-negotiation": (
    <>
      <p>
        Two offers with the same $140,000 base can be $40,000 apart once you add
        everything up. Base salary is the headline, but total compensation — bonus,
        equity, benefits, time, and flexibility — is the real number you&apos;re
        negotiating. Here&apos;s how to see the whole package and move the parts
        that matter.
      </p>

      <h2>What &quot;total comp&quot; actually includes</h2>
      <ul>
        <li>
          <strong>Base salary</strong> — the number that compounds into future
          raises and your next offer. Most important.
        </li>
        <li>
          <strong>Annual bonus</strong> — usually a % of base; ask whether
          it&apos;s a target or a guarantee.
        </li>
        <li>
          <strong>Signing bonus</strong> — one-time cash, often the easiest lever.
        </li>
        <li>
          <strong>Equity</strong> — RSUs or options; can dwarf salary at a
          high-growth company, or be worth little. Know the difference.
        </li>
        <li>
          <strong>Benefits &amp; retirement</strong> — 401(k) match, health
          coverage quality, HSA contributions.
        </li>
        <li>
          <strong>Time &amp; flexibility</strong> — PTO, remote work, hours. Hard
          to price, easy to undervalue.
        </li>
      </ul>

      <h2>Put a number on each line</h2>
      <p>
        You can&apos;t negotiate what you can&apos;t measure. Convert every piece
        into an annual dollar figure so you can compare offers honestly. A quick
        example for a $140,000 base offer:
      </p>
      <blockquote>
        Base: $140,000
        <br />
        Bonus (15% target): $21,000
        <br />
        Equity ($120,000 over 4 years): $30,000/yr
        <br />
        401(k) match (4%): $5,600
        <br />
        Signing bonus: $15,000 (year one)
        <br />
        <strong>Year-one total: ~$211,600</strong>
      </blockquote>

      <h2>Negotiate base first — then everything else</h2>
      <p>
        Because base compounds, push it before anything else. When the base
        won&apos;t move, that&apos;s your cue to work down the list — signing
        bonus, then equity, then PTO. A template:
      </p>
      <blockquote>
        Hi [Recruiter],
        <br />
        <br />
        Thank you for the offer — I&apos;m excited about [Company]. I&apos;d love to
        get the base to <strong>$155,000</strong> to match the market for this
        role. If the base is capped, could we close the gap with a larger{" "}
        <strong>signing bonus</strong> or an increased{" "}
        <strong>equity grant</strong> instead? I&apos;m flexible on how we get
        there.
        <br />
        <br />
        Best,
        <br />
        [Your name]
      </blockquote>

      <h2>Don&apos;t forget the equity questions</h2>
      <p>
        Equity is where people leave the most value on the table because they
        don&apos;t ask. Before you value an offer, get: the{" "}
        <strong>number of shares/units</strong>, the{" "}
        <strong>vesting schedule</strong> (typically 4 years, 1-year cliff), the{" "}
        <strong>strike price</strong> for options, and the company&apos;s{" "}
        <strong>current valuation</strong>. Without those, the equity line is a
        guess.
      </p>

      <p>
        <Link href="/#analyze">NegotiateAI</Link> factors total compensation into
        its analysis — not just base — so the counter-offer and email it writes
        reflect the whole package, not one line of it.
      </p>

      <ToolCTA />

      <p>
        Related reading:{" "}
        <Link href="/blog/negotiate-salary-when-non-negotiable">
          negotiating when the salary is &quot;non-negotiable&quot;
        </Link>{" "}
        and{" "}
        <Link href="/blog/how-to-counter-a-lowball-job-offer">
          how to counter a lowball job offer
        </Link>
        .
      </p>
    </>
  ),
};

export function getPostBody(slug: string): ReactNode | undefined {
  return POST_BODIES[slug];
}
