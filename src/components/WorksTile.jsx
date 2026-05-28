/**
 * WorksTile — list of work cards
 */
import { useState } from 'react';
import BentoTile from './BentoTile';
import WorkModal from './WorkModal';
import { useSound } from '../hooks/useSound';

const WORKS = [
  {
    title: 'Placement Test @ Wall Street English',
    period: '2021 – Present',
    role: 'Lead Product Designer',
    context: 'Global placement test overhaul for student onboarding.',
    outcome: '42% reduction in test abandonment.',
    details: '// Lead for the global placement test overhaul, focused on reducing entry friction and optimizing the student onboarding funnel.',
    impactUser: '<div class="impact-item"><span class="impact-number">42%</span><span class="impact-label">Reduction in test abandonment through gamified interaction design.</span></div><div class="impact-item"><span class="impact-number">65%</span><span class="impact-label">Improvement in proficiency result clarity and user confidence.</span></div>',
    impactBiz: '<div class="impact-item"><span class="impact-number">28%</span><span class="impact-label">Direct increase in course sales by streamlining the path to checkout.</span></div><div class="impact-item"><span class="impact-number">35%</span><span class="impact-label">Boost in lead qualification accuracy for global sales teams.</span></div>',
    stack: 'Figma · Maze · Google Analytics · Hotjar',
    cardTitle: '// placement test @ Wall Street English',
  },
  {
    title: 'Course Product Revamp @ Wall Street English',
    period: '2022 – Present',
    role: 'Lead Product Designer',
    context: 'Core learning experience and design system scalability.',
    outcome: '100% WCAG 2.1 AA compliance achieved.',
    details: '// Spearheaded the complete revamp of the core learning experience, focusing on accessibility, interaction depth, and design system scalability.',
    impactUser: '<div class="impact-item"><span class="impact-number">100%</span><span class="impact-label">WCAG 2.1 AA compliance achieved for global accessibility.</span></div><div class="impact-item"><span class="impact-number">50%</span><span class="impact-label">Increase in daily active engagement through micro-interactions.</span></div>',
    impactBiz: '<div class="impact-item"><span class="impact-number">24%</span><span class="impact-label">YoY retention growth by reducing learning fatigue.</span></div><div class="impact-item"><span class="impact-number">40%</span><span class="impact-label">Faster feature delivery via a robust, tokenized Design System.</span></div>',
    stack: 'Figma · Storybook · Jira · WCAG 2.1',
    cardTitle: '// course product revamp @ Wall Street English',
  },
  {
    title: 'Study Planner @ Wall Street English',
    period: '2022',
    role: 'Senior Product Designer',
    context: 'Personalized study scheduling for student motivation.',
    outcome: '31% boost in overall course completion rates.',
    details: '// Designed a personalized, goal-oriented study planner to help students manage their learning pace and maintain motivation through automated scheduling.',
    impactUser: '<div class="impact-item"><span class="impact-number">52%</span><span class="impact-label">Increase in students consistently reaching their weekly learning goals.</span></div><div class="impact-item"><span class="impact-number">3.5x</span><span class="impact-label">Growth in user-reported organization and learning control scores.</span></div>',
    impactBiz: '<div class="impact-item"><span class="impact-number">31%</span><span class="impact-label">Boost in overall course completion rates across global markets.</span></div><div class="impact-item"><span class="impact-number">19%</span><span class="impact-label">Reduction in student churn rate during the critical first 90 days.</span></div>',
    stack: 'Figma · Hotjar · Mixpanel · Notion',
    cardTitle: '// study planner @ Wall Street English',
  },
  {
    title: 'Online Classroom @ Wall Street English',
    period: '2021 – 2023',
    role: 'Lead Product Designer',
    context: 'Virtual teaching experience replication.',
    outcome: '200% growth in total class bookings.',
    details: '// Reimagined the virtual teaching experience by adding high-fidelity classroom features that replicate the intimacy and efficacy of in-person learning.',
    impactUser: '<div class="impact-item"><span class="impact-number">85%</span><span class="impact-label">Sentiment score on "reproduction of in-person classroom feel."</span></div><div class="impact-item"><span class="impact-number">2.4x</span><span class="impact-label">Increase in student-teacher interaction rate per session.</span></div>',
    impactBiz: '<div class="impact-item"><span class="impact-number">200%</span><span class="impact-label">Growth in total class bookings, effectively doubling the business unit.</span></div><div class="impact-item"><span class="impact-number">45%</span><span class="impact-label">Reduction in teaching overhead via integrated digital materials.</span></div>',
    stack: 'Figma · Zoom SDK · React · WebRTC',
    cardTitle: '// online classroom @ Wall Street English',
  },
  {
    title: 'Product Designer @ Auro24',
    period: '2021',
    role: 'Product Designer',
    context: 'MDM admin dashboard and marketing website MVP.',
    outcome: '92% usability score on the admin dashboard.',
    details: '// Designed the end-to-end MVP for a complex MDM (Mobile Device Management) admin dashboard and high-conversion marketing website.',
    impactUser: '<div class="impact-item"><span class="impact-number">92%</span><span class="impact-label">Usability score on the admin dashboard for complex device management.</span></div><div class="impact-item"><span class="impact-number">75%</span><span class="impact-label">Reduction in device enrollment time for enterprise IT admins.</span></div>',
    impactBiz: '<div class="impact-item"><span class="impact-number">300%</span><span class="impact-label">Increase in brand visibility and lead gen via website revamp.</span></div><div class="impact-item"><span class="impact-number">10+</span><span class="impact-label">Enterprise pre-orders directly attributed to the MVP launch.</span></div>',
    stack: 'Figma · React · Tailwind · Webflow',
    cardTitle: '// product designer @ Auro24',
  },
  {
    title: 'UI/UX Designer @ InstaSafe',
    period: '2019 – 2021',
    role: 'UI/UX Designer',
    context: 'Zero-trust network access (ZTNA) SaaS product.',
    outcome: '45% drop in UI-related support tickets.',
    details: '// Owned the full design lifecycle for a zero-trust network access (ZTNA) SaaS product, simplifying complex security configurations for enterprise administrators.',
    impactUser: '<div class="impact-item"><span class="impact-number">45%</span><span class="impact-label">Drop in support tickets related to UI confusion after dashboard overhaul.</span></div><div class="impact-item"><span class="impact-number">60%</span><span class="impact-label">Reduction in average task completion time for security audits.</span></div>',
    impactBiz: '<div class="impact-item"><span class="impact-number">31%</span><span class="impact-label">Increase in B2B deal close rates through improved product walkthroughs.</span></div><div class="impact-item"><span class="impact-number">Fortune 500</span><span class="impact-label">UX overhaul was instrumental in securing multiple major enterprise contracts.</span></div>',
    stack: 'Figma · Adobe XD · Zeplin · Mixpanel',
    cardTitle: '// ui/ux designer @ InstaSafe',
  },
];

export default function WorksTile() {
  const [selectedWork, setSelectedWork] = useState(null);
  const { playOpen, playClose } = useSound();

  const openWork = (work) => {
    setSelectedWork(work);
    playOpen();
  };

  const closeWork = () => {
    setSelectedWork(null);
    playClose();
  };

  return (
    <>
      <BentoTile id="works-tile" className="span-2">
        <div className="tile-header">my works.log</div>
        <div className="project-grid">
          {WORKS.map((work, i) => (
            <div
              key={i}
              className="work-card"
              role="button"
              tabIndex={0}
              onClick={() => openWork(work)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openWork(work);
                }
              }}
            >
              <div className="work-card-header">
                <span className="work-card-prefix">DIR</span>
                <span className="work-card-title">{work.cardTitle}</span>
              </div>
              
              <div className="work-card-metrics">
                <div className="metric-row">
                  <span className="metric-key">ROLE:</span>
                  <span className="metric-val">{work.role}</span>
                </div>
                <div className="metric-row">
                  <span className="metric-key">CONTEXT:</span>
                  <span className="metric-val">{work.context}</span>
                </div>
                <div className="metric-row">
                  <span className="metric-key">OUTCOME:</span>
                  <span className="metric-val highlight">{work.outcome}</span>
                </div>
              </div>

              <span className="work-card-cta">[ VIEW CASE STUDY → ]</span>
            </div>
          ))}
        </div>
      </BentoTile>

      {selectedWork && (
        <WorkModal work={selectedWork} onClose={closeWork} />
      )}
    </>
  );
}
