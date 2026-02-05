'use client';

import { useMemo, useState } from 'react';

type FaqItem = {
  question: string;
  answer: string;
};

type TimelineSegment = {
  label: string;
  startHour: number;
  endHour: number;
  description: string;
};

const circadianTimeline: TimelineSegment[] = [
  {
    label: 'Daylight alertness',
    startHour: 7,
    endHour: 18,
    description:
      "Light suppresses melatonin; bright morning exposure keeps the circadian clock aligned and supports alertness."
  },
  {
    label: 'Dim-light transition',
    startHour: 18,
    endHour: 21,
    description:
      "Melatonin production ramps up as light levels fall; avoid blue-light-heavy screens to let the signal rise."
  },
  {
    label: 'Melatonin surge',
    startHour: 21,
    endHour: 2,
    description:
      "Peak secretion supports sleep onset and deep sleep consolidation; the window shifts if your schedule changes."
  },
  {
    label: 'Early morning taper',
    startHour: 2,
    endHour: 7,
    description:
      "Levels decline as the brain prepares the cortisol awakening response around sunrise."
  }
];

const quickFacts = [
  {
    label: 'Biological origin',
    value: 'Pineal gland hormone derived from serotonin',
    detail: 'Synthesized after dark when the suprachiasmatic nucleus relays “night” signals.'
  },
  {
    label: 'Half-life',
    value: '30–60 minutes',
    detail: 'Explains why fast-release supplements impact sleep onset more than sleep duration.'
  },
  {
    label: 'Peak levels',
    value: 'Between 2–4 a.m.',
    detail: 'Assuming a typical 10 p.m. bedtime and consistent light-dark cues.'
  }
];

const practicalGuidelines = [
  {
    title: 'Sleep onset support',
    dose: '0.3–1 mg 60 minutes before bed',
    insight: 'Low doses mimic physiological levels and help reduce sleep latency.'
  },
  {
    title: 'Jet lag realignment',
    dose: '0.5–3 mg at target bedtime in destination time zone',
    insight:
      'Begin the night you travel east; combine with bright light exposure at the new morning for best effect.'
  },
  {
    title: 'Shift work transition',
    dose: '1–3 mg several hours before desired sleep',
    insight:
      'Use blackout curtains and minimize caffeine 6 hours prior to daytime sleep to reinforce the new schedule.'
  }
];

const faqItems: FaqItem[] = [
  {
    question: 'Is melatonin a sleeping pill?',
    answer:
      'Melatonin signals that it is night-time; it nudges your circadian clock and reduces time-to-sleep, but it does not sedate the nervous system like hypnotic medications.'
  },
  {
    question: 'Can I take melatonin every night?',
    answer:
      'Clinical data suggests low doses are safe for short-term nightly use. For long-term reliance, focus on light hygiene and consistent bedtimes, and speak with a healthcare professional.'
  },
  {
    question: 'What are common side effects?',
    answer:
      'Morning grogginess, vivid dreams, and headaches occur in a minority of users, typically when the dose is higher than necessary.'
  },
  {
    question: 'Does melatonin interact with other medications?',
    answer:
      'Yes. It can potentiate sedatives, impact blood thinners, and alter glucose regulation. Always review your regimen with a clinician before adding melatonin.'
  }
];

function useActiveSegment(hour: number) {
  return useMemo(() => {
    const normalizedHour = ((hour % 24) + 24) % 24;
    return circadianTimeline.find(
      (segment) =>
        normalizedHour >= segment.startHour &&
        (segment.endHour > segment.startHour
          ? normalizedHour < segment.endHour
          : normalizedHour < segment.endHour + 24)
    );
  }, [hour]);
}

function TimingVisualizer() {
  const [hour, setHour] = useState(22);
  const activeSegment = useActiveSegment(hour);

  return (
    <section>
      <h2>Circadian Timing</h2>
      <p>
        Use the slider to explore how melatonin levels ebb and flow across a 24-hour period.
        Aligning light exposure with your biological night keeps the hormone&apos;s rhythm on track.
      </p>
      <div style={{ marginTop: '1.5rem' }}>
        <label htmlFor="hour-slider" style={{ display: 'block', fontWeight: 600 }}>
          Selected hour: <span className="highlight">{hour}:00</span>
        </label>
        <input
          id="hour-slider"
          type="range"
          min={0}
          max={23}
          value={hour}
          onChange={(event) => setHour(Number(event.target.value))}
          style={{ width: '100%', marginTop: '0.75rem' }}
        />
      </div>
      <div className="timing-bar" role="presentation">
        {Array.from({ length: 24 }, (_, index) => {
          const isActive =
            activeSegment &&
            ((index >= activeSegment.startHour && index < activeSegment.endHour) ||
              (activeSegment.endHour < activeSegment.startHour &&
                (index >= activeSegment.startHour || index < activeSegment.endHour)));
          return (
            <div
              key={index}
              className={`timing-segment${isActive ? ' active' : ''}`}
              aria-hidden
            />
          );
        })}
      </div>
      {activeSegment ? (
        <div style={{ marginTop: '1.25rem' }}>
          <strong>{activeSegment.label}</strong>
          <p>{activeSegment.description}</p>
        </div>
      ) : null}
    </section>
  );
}

function QuickFacts() {
  return (
    <section>
      <h2>Melatonin in a Nutshell</h2>
      <div className="metric-grid">
        {quickFacts.map((fact) => (
          <article key={fact.label} className="metric-card">
            <p className="metric-value">{fact.value}</p>
            <p style={{ fontWeight: 600 }}>{fact.label}</p>
            <p>{fact.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SupplementGuidelines() {
  return (
    <section>
      <h2>Evidence-Based Supplement Strategies</h2>
      <div className="tag-grid">
        {practicalGuidelines.map((guideline) => (
          <article key={guideline.title} className="tag-card">
            <h3 style={{ marginBottom: '0.35rem' }}>{guideline.title}</h3>
            <p className="highlight">{guideline.dose}</p>
            <p>{guideline.insight}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section>
      <h2>Frequently Asked Questions</h2>
      <div className="accordion">
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={item.question}>
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
              >
                <span>{item.question}</span>
                <span aria-hidden>{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen ? <p>{item.answer}</p> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main>
      <header style={{ marginBottom: '2.5rem' }}>
        <p className="highlight">Hormone Deep Dive</p>
        <h1 style={{ fontSize: '2.75rem', marginBottom: '0.5rem' }}>Melatonin, Explained</h1>
        <p>
          Melatonin is a night-time messenger that synchronizes sleep, metabolism, and immune activity. Below is a concise tour of how it is produced, why it matters, and how to work with it safely.
        </p>
      </header>

      <QuickFacts />

      <section>
        <h2>How the Body Produces Melatonin</h2>
        <p>
          Light-sensitive ganglion cells in the retina report nightfall to the suprachiasmatic nucleus (SCN) in the hypothalamus.
          The SCN signals the pineal gland via the sympathetic nervous system to convert serotonin into melatonin.
        </p>
        <p>
          Production rises about two hours before habitual bedtime if evening light is dim. Blue-rich light, caffeine, and irregular schedules delay the signal, shifting the circadian clock later.
        </p>
        <ul>
          <li>Bright morning light anchors the SCN and sets the 24-hour timer.</li>
          <li>Dim evenings protect melatonin synthesis by reducing retinal stimulation.</li>
          <li>Meal timing, exercise, and social cues fine-tune the rhythm.</li>
        </ul>
      </section>

      <TimingVisualizer />

      <section>
        <h2>What Melatonin Does</h2>
        <p>
          Melatonin receptors (MT1 and MT2) are distributed throughout the brain and peripheral organs. Activation of MT1 promotes sleep onset, while MT2 resets the circadian clock.
        </p>
        <p>
          Research also links physiological night-time melatonin to antioxidant activity, immune modulation, and gut motility regulation. These actions are still being mapped in humans, so supplementation should focus on circadian alignment rather than pharmacological doses.
        </p>
        <ol>
          <li>Sleep: lowers sleep latency and improves perceived sleep quality when taken before bed.</li>
          <li>Circadian phase shifting: useful for jet lag, shift work, and delayed sleep phase syndrome.</li>
          <li>Antioxidant signaling: scavenges free radicals in laboratory models; clinical impact remains under investigation.</li>
        </ol>
      </section>

      <SupplementGuidelines />

      <section>
        <h2>Safety and Best Practices</h2>
        <p>
          Start with the lowest effective dose. More is not necessarily better; megadoses can disrupt your temperature rhythm and cause morning grogginess.
        </p>
        <p>
          Consult a clinician if you are pregnant, breastfeeding, have epilepsy, diabetes, autoimmune conditions, or take blood thinners. Melatonin can interact with immunosuppressants and antihypertensive drugs.
        </p>
        <ul>
          <li>Quality matters: look for third-party testing (USP, NSF, or Informed Choice).</li>
          <li>Be consistent: take it at the same time nightly to avoid confusing your circadian clock.</li>
          <li>Combine with behavior: maintain a wind-down routine, cool bedroom, and reduced evening screen time.</li>
        </ul>
      </section>

      <FaqAccordion />

      <section>
        <h2>Further Reading</h2>
        <p>
          Explore primary sources and clinical guidelines for deeper insight into melatonin&apos;s mechanisms and therapeutic uses.
        </p>
        <ul>
          <li>
            Arendt J. Melatonin: characteristics, concerns, and prospects. <span className="highlight">Journal of Biological Rhythms</span> (2020).
          </li>
          <li>
            Auld F. et al. Evidence for the efficacy of melatonin in insomnia: systematic review. <span className="highlight">Sleep Medicine Reviews</span> (2017).
          </li>
          <li>
            Sack R.L. Clinical practice guideline for the treatment of circadian rhythm sleep disorders. <span className="highlight">Journal of Clinical Sleep Medicine</span> (2007).
          </li>
        </ul>
      </section>

      <footer>
        This educational resource is not medical advice. Partner with a licensed professional for personal recommendations.
      </footer>
    </main>
  );
}
