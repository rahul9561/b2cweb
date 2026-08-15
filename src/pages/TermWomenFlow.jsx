import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BadgeCheck,
  ChevronDown,
  ChevronRight,
  CircleUserRound,
  CreditCard,
  Download,
  FileText,
  Landmark,
  MapPin,
  Phone,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
  Wallet,
  X,
} from 'lucide-react';
import loanImg from '../assets/images/loan.png';
import './TermWomenFlow.css';

const baseProfile = {
  gender: 'Male',
  name: 'Scsd',
  dob: '01/01/2001',
  mobile: '78*****898',
  email: 'moh***********@gmail.com',
  smoker: 'No',
  income: '8 Lac to 9.9 Lac',
  education: '10th Pass',
  occupation: 'Self Employed',
  city: 'Lucknow',
  pincode: '',
};

const termPlans = [
  {
    id: 'tata',
    logo: 'TATA AIA',
    logoClass: 'logo-tata',
    insurer: 'Tata AIA',
    plan: 'Maha Raksha Supreme Select-S',
    cover: 25,
    coverTill: 60,
    claim: 99.5,
    base: 76973,
    discount: 11,
    tag: 'Lowest Price Guarantee',
    note: 'Income proof not required up to ₹2 Cr',
    benefits: ['2 Free benefits', 'Full refund of premium'],
  },
  {
    id: 'bajaj',
    logo: 'BAJAJ LIFE',
    logoClass: 'logo-bajaj',
    insurer: 'Bajaj Life',
    plan: 'Bajaj Life iSecure II',
    cover: 25,
    coverTill: 60,
    claim: 99.3,
    base: 115050,
    discount: 12,
    tag: 'Lowest Price Guarantee',
    note: 'Income proof not required',
    benefits: ['1 Free Benefit', 'Full refund of premium'],
  },
  {
    id: 'pnb',
    logo: 'pnb MetLife',
    logoClass: 'logo-pnb',
    insurer: 'PNB MetLife',
    plan: 'Saral Jeevan Bima',
    cover: 30,
    coverTill: 62,
    claim: 99.8,
    base: 94120,
    discount: 9,
    tag: 'Great value',
    note: 'Medical tests at home',
    benefits: ['Waiver benefit', 'Monthly payout'],
  },
  {
    id: 'hdfc',
    logo: 'HDFC Life',
    logoClass: 'logo-hdfc',
    insurer: 'HDFC Life',
    plan: 'Click 2 Protect Supreme',
    cover: 40,
    coverTill: 64,
    claim: 99.7,
    base: 128400,
    discount: 8,
    tag: 'Fast issuance',
    note: 'Dedicated claim support',
    benefits: ['3 Free benefits', 'Increasing cover'],
  },
  {
    id: 'icici',
    logo: 'ICICI Prudential',
    logoClass: 'logo-icici',
    insurer: 'ICICI Prudential',
    plan: 'iProtect Smart Plus',
    cover: 45,
    coverTill: 63,
    claim: 99.4,
    base: 136750,
    discount: 10,
    tag: 'Trusted insurer',
    note: 'Video medical available',
    benefits: ['2 Free benefits', 'Life stage benefit'],
  },
  {
    id: 'axis',
    logo: 'AXIS MAX',
    logoClass: 'logo-axis',
    insurer: 'Axis Max Life',
    plan: 'Smart Secure Plus',
    cover: 35,
    coverTill: 61,
    claim: 99.6,
    base: 104900,
    discount: 7,
    tag: 'Popular',
    note: 'Premium holiday option',
    benefits: ['Free benefits', 'Return of premium'],
  },
];

const formatRs = (value) => `₹${Number(value).toLocaleString('en-IN')}`;

function avHome(navigate) {
  navigate('/');
}

function AVHeader({ compact = false }) {
  const navigate = useNavigate();
  return (
    <header className={`tw-header ${compact ? 'tw-header-compact' : ''}`}>
      <button className="tw-brand" onClick={() => avHome(navigate)} aria-label="Go to home">
        <span className="tw-brand-mark">AV</span>
        <span>
          <strong>MANAGEMENT</strong>
          <small>Legal and Financial Solution</small>
        </span>
      </button>
      <div className="tw-header-actions">
        <button type="button"><Download size={16} /> Brochure</button>
        <button type="button"><Download size={16} /> Benefit Illustration</button>
        <button type="button"><Phone size={16} /> Talk to an Expert</button>
      </div>
    </header>
  );
}

function Field({ label, value, onChange, error, placeholder, type = 'text' }) {
  return (
    <div className={`tw-field ${error ? 'tw-field-error' : ''}`}>
      <label className="tw-label">{label}</label>
      <input className="tw-input" type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      {error && <div className="tw-error">{error}</div>}
    </div>
  );
}

function TermLandingPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', dob: '', mobile: '', city: '', income: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Please enter your name';
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(form.dob.trim())) next.dob = 'Use DD/MM/YYYY format';
    if (!/^\d{10}$/.test(form.mobile.trim())) next.mobile = 'Enter a valid 10 digit mobile number';
    if (!form.city.trim()) next.city = 'Please enter your city';
    if (!form.income) next.income = 'Please select annual income';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const viewPlans = () => {
    if (!validate()) return;
    navigate('/term-insurance-women/quotes', { state: { profile: { ...baseProfile, ...form, mobile: maskMobile(form.mobile) } } });
  };

  return (
    <div className="tw-page">
      <AVHeader compact />
      <main className="tw-landing">
        <div className="tw-landing-main">
          <section className="tw-hero-card">
            <div className="tw-hero-orb" />
            <div className="tw-hero-img-wrap">
              <img className="tw-woman-img" src={loanImg} alt="Term insurance for women" />
              <div className="tw-float-badge tw-float-badge-top">₹1 Cr+ Life cover</div>
              <div className="tw-float-badge tw-float-badge-bottom">0% GST for women</div>
            </div>
          </section>
          <section>
            <div className="tw-landing-copy">
              <h1>Term insurance that <span>protects what matters to you</span></h1>
              <p>Get high cover at low premium with dedicated claim support from AV Management.</p>
            </div>
            <div className="tw-form-card">
              <h2>Get term plans in 60 seconds</h2>
              <Field label="Full name" value={form.name} onChange={(name) => setForm({ ...form, name })} error={errors.name} placeholder="Your name" />
              <Field label="Date of birth" value={form.dob} onChange={(dob) => setForm({ ...form, dob })} error={errors.dob} placeholder="DD/MM/YYYY" />
              <Field label="Mobile number" value={form.mobile} onChange={(mobile) => setForm({ ...form, mobile })} error={errors.mobile} placeholder="10 digit mobile number" />
              <Field label="City" value={form.city} onChange={(city) => setForm({ ...form, city })} error={errors.city} placeholder="Current city" />
              <div className={`tw-field ${errors.income ? 'tw-field-error' : ''}`}>
                <label className="tw-label">Annual income</label>
                <select value={form.income} onChange={(e) => setForm({ ...form, income: e.target.value })}>
                  <option value="">Select income</option>
                  {['25 Lac +', '15 Lac to 24.9 Lac', '10 Lac to 14.9 Lac', '8 Lac to 9.9 Lac', '5 Lac to 7.9 Lac'].map((item) => <option key={item}>{item}</option>)}
                </select>
                {errors.income && <div className="tw-error">{errors.income}</div>}
              </div>
              <button className="tw-btn tw-btn-blue" onClick={viewPlans}>View Plans <ChevronRight size={18} /></button>
            </div>
          </section>
        </div>
        <div className="tw-container">
          <div className="tw-trust-row">
            <div className="tw-trust-item"><strong className="tw-trust-value">99.5%</strong><span className="tw-trust-label">Claims settled</span></div>
            <div className="tw-trust-item"><strong className="tw-trust-value">₹1 Cr+</strong><span className="tw-trust-label">Life cover options</span></div>
            <div className="tw-trust-item"><strong className="tw-trust-value">0%</strong><span className="tw-trust-label">GST offer for women</span></div>
            <div className="tw-trust-item"><strong className="tw-trust-value">24×7</strong><span className="tw-trust-label">Claim support</span></div>
          </div>
        </div>
        <TermInfoSection />
      </main>
    </div>
  );
}
function TermInfoSection({ name = 'Term Insurance for Women' }) {
  const [isDisclaimerOpen, setDisclaimerOpen] = useState(false);

  return (
    <div className="tw-container tw-info-section">
      <h2 className="tw-info-title">Know more about {name}</h2>

      <p className="tw-info-text">
        Review the important plan features, eligibility details and exclusions before purchasing.
        An AV Management expert can help you compare suitable options.
      </p>
      <ul className="tw-info-list">
        <li>Compare benefits and policy wording carefully.</li>
        <li>Choose coverage that matches your needs and budget.</li>
        <li>Read insurer-provided terms before completing a purchase.</li>
      </ul>

      <div className="tw-disclaimer-card">
        <button
          type="button"
          className="tw-disclaimer-toggle"
          onClick={() => setDisclaimerOpen((open) => !open)}
        >
          <span>Disclaimer</span>
          <ChevronDown
            size={18}
            className={`tw-chevron ${isDisclaimerOpen ? 'tw-chevron-open' : ''}`}
          />
        </button>

        {isDisclaimerOpen && (
          <div className="tw-disclaimer-body">
            <p>
              *All savings and online discounts are indicative and subject to insurer approval.
              Final premium depends on your profile, policy term and selected add-ons.
            </p>
            <p>
              *Policy issuance is subject to underwriting and the insurer's final terms and
              conditions. AV Management facilitates the purchase and is not the insurer.
            </p>
            <p>
              *Read the full policy brochure before buying. Benefits, exclusions, sub-limits,
              waiting periods and claim processes vary by plan and insurer.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
function maskMobile(value) {
  return value ? `${value.slice(0, 2)}*****${value.slice(-3)}` : '78*****898';
}

const questionSteps = [
  { key: 'occupation', heading: 'Please choose your occupation type', type: 'tiles', options: ['Salaried', 'Self Employed', 'Student'] },
  { key: 'income', heading: 'Select your annual income', type: 'list', options: ['25 Lac +', '15 Lac to 24.9 Lac', '10 Lac to 14.9 Lac', '8 Lac to 9.9 Lac', '5 Lac to 7.9 Lac', '3 Lac to 4.9 Lac', '2 Lac to 2.9 Lac', 'Less than 2 Lac'] },
  { key: 'education', heading: 'Select Educational Qualification', type: 'list', options: ['Post Graduation', 'Graduation', '12th', '10th and Below'] },
  { key: 'smoker', heading: 'Do you Smoke or Chew tobacco?', type: 'yesno', options: ['Yes', 'No'] },
  { key: 'city', heading: 'Please select your current city', type: 'city', options: ['Lucknow', 'Unnao', 'Kanpur', 'Kanpur Nagar'] },
];

function TermQuestionsModal({ profile, onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    occupation: profile.occupation,
    income: profile.income,
    education: profile.education,
    smoker: profile.smoker,
    city: profile.city,
  });
  const current = questionSteps[step];
  const remaining = 5 - step;

  const choose = (value) => {
    setAnswers((prev) => ({ ...prev, [current.key]: value }));
    if (current.type === 'tiles' || current.type === 'yesno' || current.type === 'city') {
      setTimeout(() => next({ ...answers, [current.key]: value }), 160);
    }
  };
  const next = (forced = answers) => {
    if (step === questionSteps.length - 1) onComplete(forced);
    else setStep(step + 1);
  };

  return (
    <div className="tw-overlay">
      <div className="tw-qmodal">
        <p className="tw-qtop">Just answer {remaining} simple question{remaining > 1 ? 's' : ''} to get more accurate quotes</p>
        <h2>{current.heading}</h2>
        {current.type === 'tiles' && (
          <div className="tw-qtiles">
            {current.options.map((o) => <button key={o} onClick={() => choose(o)} className={answers[current.key] === o ? 'active' : ''}>{o}</button>)}
          </div>
        )}
        {current.type === 'list' && (
          <div className="tw-radio-list">
            {current.options.map((o) => (
              <button key={o} onClick={() => choose(o)} className={answers[current.key] === o ? 'active' : ''}>
                <span className="tw-radio-dot" /> {o}
              </button>
            ))}
          </div>
        )}
        {current.type === 'yesno' && (
          <>
            <div className="tw-note">Select <b>'No'</b> if you haven't smoked or chewed tobacco in the last 12 months</div>
            <div className="tw-yesno">{current.options.map((o) => <button key={o} onClick={() => choose(o)}>{o}</button>)}</div>
          </>
        )}
        {current.type === 'city' && (
          <div className="tw-city-step">
            <label><MapPin size={18} /><input placeholder="Enter Your City" value={answers.city || ''} onChange={(e) => setAnswers({ ...answers, city: e.target.value })} /></label>
            <small>Popular Cities</small>
            <div>{current.options.map((o) => <button key={o} onClick={() => choose(o)}>{o}</button>)}</div>
          </div>
        )}
        <div className="tw-qfooter">
          {step > 0 ? <button className="tw-ghost" onClick={() => setStep(step - 1)}><ArrowLeft size={16} /> Previous</button> : <span />}
          <div className="tw-dots">{questionSteps.map((_, i) => <i key={i} className={i === step ? 'active' : ''} />)}</div>
          {(current.type === 'list' || current.type === 'city') && <button className="tw-ghost" onClick={() => next()}>Next <ChevronRight size={16} /></button>}
        </div>
      </div>
    </div>
  );
}

function TermQuotesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(location.state?.profile || baseProfile);
  const [showQuestions, setShowQuestions] = useState(!location.state?.questionDone);
  const [filterModal, setFilterModal] = useState(false);
  const [filterTab, setFilterTab] = useState('Sort');
  const [editProfile, setEditProfile] = useState(false);
  const [lifeCover, setLifeCover] = useState('25 L');
  const [coverTill, setCoverTill] = useState('60 Yrs of age');
  const [payMode, setPayMode] = useState('Yearly');
  const [payTerm, setPayTerm] = useState('1 yr');
  const [sortBy, setSortBy] = useState('Popularity');
  const [planType, setPlanType] = useState('All');
  const [payout, setPayout] = useState('Lumpsum Payout');
  const [insurer, setInsurer] = useState('All');
  const [premiumType, setPremiumType] = useState('Regular Pay');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);

  const filteredPlans = useMemo(() => {
    let list = termPlans.map((plan) => ({ ...plan, price: calcPremium(plan, lifeCover, coverTill, payMode, payTerm, profile, premiumType, payout) }));
    if (insurer !== 'All') list = list.filter((p) => p.insurer === insurer);
    const benefits = (p) => p.benefits.join(' ').toLowerCase();
    if (planType === 'Return of Premium Plans') list = list.filter((p) => benefits(p).includes('refund') || benefits(p).includes('return'));
    if (planType === 'Return of Premium Plans (>2 times)') list = list.filter((p) => benefits(p).includes('refund'));
    if (planType === 'Increasing Cover plans') list = list.filter((p) => benefits(p).includes('increasing') || benefits(p).includes('stage') || benefits(p).includes('life stage'));
    if (planType === 'Get Coverage Upto 100 Years') list = list.filter((p) => p.coverTill >= 100);
    if (sortBy.includes('Low to High')) list.sort((a, b) => a.price - b.price);
    if (sortBy.includes('High to Low')) list.sort((a, b) => b.price - a.price);
    if (sortBy.includes('Claim')) list.sort((a, b) => b.claim - a.claim);
    return list;
  }, [lifeCover, coverTill, payMode, payTerm, sortBy, planType, insurer, premiumType, payout, profile]);

  const completeQuestions = (answers) => {
    setProfile((prev) => ({ ...prev, ...answers }));
    setShowQuestions(false);
  };

  return (
    <div className="tw-page tw-quotes">
      <AVHeader compact />
      <section className="tw-quote-head">
        <div className="tw-gst">GST Bachat Utsav <s>18% GST</s> <b>Now 0%</b></div>
        <button className="tw-compare"><ShieldCheck size={18} /> Compare Plans</button>
        <button className="tw-profile-pill" onClick={() => setEditProfile(true)}>
          <CircleUserRound size={20} /> {profile.gender} | 25 yrs | {profile.smoker === 'No' ? 'Non-smoker' : 'Smoker'} | {profile.income} | Edit <ChevronDown size={14} />
        </button>
      </section>
      <section className="tw-filterbar">
        <button className="tw-filter-main" onClick={() => setFilterModal(true)}><SlidersHorizontal size={18} /> Sort/Filter</button>
        <Dropdown label="Life cover" value={lifeCover} open={openDropdown === 'life'} setOpen={() => setOpenDropdown(openDropdown === 'life' ? null : 'life')} items={['25 L', '30 L', '35 L', '40 L', '45 L']} extra="Enter custom" onSelect={setLifeCover} />
        <Dropdown label="Cover till" value={coverTill} open={openDropdown === 'cover'} setOpen={() => setOpenDropdown(openDropdown === 'cover' ? null : 'cover')} items={['60 Yrs of age', '61 Yrs', '62 Yrs', '63 Yrs', '64 Yrs']} extra="Switch to Whole Life" onSelect={setCoverTill} />
        <div className="tw-toggle">
          <button className={payMode === 'Monthly' ? 'active' : ''} onClick={() => setPayMode('Monthly')}>Monthly</button>
          <button className={payMode === 'Yearly' ? 'active' : ''} onClick={() => setPayMode('Yearly')}>Yearly</button>
          <small>Save 5%** on Yearly</small>
        </div>
        <Dropdown label="Pay Term" value={payTerm} open={openDropdown === 'pay'} setOpen={() => setOpenDropdown(openDropdown === 'pay' ? null : 'pay')} items={['1 yr', '5 yrs', '10 yrs', '15 yrs']} onSelect={setPayTerm} />
      </section>
      <main className={`tw-quote-layout ${showQuestions ? 'tw-blur' : ''}`}>
        <section>
          <div className="tw-plan-tabs"><b>RECOMMENDED</b><span>Special Plans for {profile.occupation} Customers</span><span>All Plans</span></div>
          {filteredPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onBuy={() => navigate(`/term-insurance-women/details?plan=${plan.id}`, { state: { profile, plan, lifeCover, coverTill, payMode, payTerm } })} />
          ))}
          <div className="tw-disclaimer">
            <button className={disclaimerOpen ? 'tw-open' : ''} onClick={() => setDisclaimerOpen(!disclaimerOpen)}>Disclaimers <ChevronDown size={18} /></button>
            <div className={`tw-disclaimer-content ${disclaimerOpen ? 'tw-show' : ''}`}>
              <p>++By choosing annual premium payment mode, you can save upto 5%.</p>
              <p>*Availability of non-medical and tele-medical underwriting are subject to disclosures made in the proposal form.</p>
              <p>The policy must be in force on the date of death, with all premiums fully paid, except for the exclusions mentioned in policy terms.</p>
            </div>
          </div>
        </section>
        <aside className="tw-right-rail">
          <button className="tw-advisor"><Phone /> Need Help? Talk to our Advisor</button>
          <InfoCard title="Why Term Insurance?" text="High coverage at Low premium" />
          <InfoCard title="Why AV Management?" text="Free dedicated claim assistance" open />
          <InfoCard title="Why Buy Now?" text="Lock in your premiums for a lifetime before they increase." />
        </aside>
      </main>
      {showQuestions && <TermQuestionsModal profile={profile} onComplete={completeQuestions} />}
      {filterModal && (
        <FilterModal
          tab={filterTab}
          setTab={setFilterTab}
          values={{ sortBy, planType, payout, insurer, premiumType }}
          setters={{ setSortBy, setPlanType, setPayout, setInsurer, setPremiumType }}
          onClose={() => setFilterModal(false)}
        />
      )}
      {editProfile && <EditProfileDrawer profile={profile} onClose={() => setEditProfile(false)} onSave={(next) => { setProfile(next); setEditProfile(false); }} />}
    </div>
  );
}

function calcPremium(plan, lifeCover, coverTill, payMode, payTerm, profile, premiumType = 'Regular Pay', payout = 'Lumpsum Payout') {
  const cover = parseInt(lifeCover, 10) || 25;
  const age = parseInt(coverTill, 10) || 60;
  const term = parseInt(payTerm, 10) || 1;
  const smokeFactor = profile.smoker === 'Yes' ? 1.18 : 1;
  const monthly = payMode === 'Monthly' ? 0.092 : 1;
  const payTypeFactor = premiumType === 'Single Pay' ? 0.84 : premiumType === 'Limited Pay' ? 0.92 : 1;
  const payoutFactor = payout === 'Monthly income' ? 1.12 : payout === 'Lumpsum amount + Monthly income' ? 1.2 : 1;
  return Math.round(plan.base * (cover / 25) * (age / 60) * (term === 1 ? 1 : 0.85) * smokeFactor * monthly * payTypeFactor * payoutFactor);
}

function Dropdown({ label, value, open, setOpen, items, extra, onSelect }) {
  return (
    <div className="tw-dropdown">
      <button onClick={setOpen}>{label && <small>{label}</small>}<b>{value}</b><ChevronDown size={15} /></button>
      {open && <div className="tw-menu">
        {items.map((item) => <button key={item} onClick={() => { onSelect(item); setOpen(); }}>{item}</button>)}
        {extra && <button className="tw-menu-extra" onClick={setOpen}>{extra}</button>}
      </div>}
    </div>
  );
}

function PlanCard({ plan, onBuy }) {
  return (
    <article className="tw-plan-card">
      <div className="tw-plan-logo-col">
        <div className={`tw-insurer-logo ${plan.logoClass}`}>{plan.logo}</div>
        <small>{plan.plan}</small>
        <span>{plan.tag}</span>
      </div>
      <div className="tw-plan-mid">
        <div><small>Life cover</small><b>₹{plan.cover} Lac</b></div>
        <div><small>Cover till age</small><b>{plan.coverTill} Yrs</b></div>
        <div><small>Claim settled</small><b>{plan.claim}% <BadgeCheck size={14} /></b></div>
        <div className="tw-benefits">
          {plan.benefits.map((b) => <button key={b}>{b} <ChevronDown size={12} /></button>)}
        </div>
      </div>
      <div className="tw-plan-buy">
        <button className="tw-heart">♡</button>
        <div className="tw-save">Online Saving <b>₹{Math.round(plan.price * plan.discount / 1000) * 10}</b></div>
        <button className="tw-price" onClick={onBuy}>{formatRs(plan.price)} <small>{plan.price > 10000 ? '(1st yr)' : '/month'}</small> <ChevronRight size={20} /></button>
      </div>
      <div className="tw-discount-strip">{plan.discount}% discount included <a>See how</a></div>
      <div className="tw-income-strip">{plan.note} <span>i</span></div>
    </article>
  );
}

function InfoCard({ title, text, open }) {
  return (
    <div className={`tw-info-card ${open ? 'open' : ''}`}>
      <h3><ShieldCheck size={18} /> {title} <ChevronDown size={16} /></h3>
      {open && <p>{text}</p>}
    </div>
  );
}

function FilterModal({ tab, setTab, values, setters, onClose }) {
  const options = {
    Sort: ['Popularity', 'Premium in 1st year : Low to High', 'Premium in 1st year : High to Low', 'Premium from 2nd year onwards : Low to High', 'Premium from 2nd year onwards : High to Low', 'Claim Settlement Ratio : High to Low'],
    'Plan type': ['Return of Premium Plans', 'Return of Premium Plans (>2 times)', 'Increasing Cover plans', 'Get Coverage Upto 100 Years'],
    'Payout options': ['Lumpsum Payout', 'Monthly income', 'Lumpsum amount + Monthly income'],
    Insurer: ['All', 'Tata AIA', 'Bajaj Life', 'PNB MetLife', 'HDFC Life', 'ICICI Prudential', 'Axis Max Life'],
    'Premium pay type': ['Regular Pay', 'Limited Pay', 'Single Pay'],
  };
  const keyMap = { Sort: 'sortBy', 'Plan type': 'planType', 'Payout options': 'payout', Insurer: 'insurer', 'Premium pay type': 'premiumType' };
  const setterMap = { Sort: setters.setSortBy, 'Plan type': setters.setPlanType, 'Payout options': setters.setPayout, Insurer: setters.setInsurer, 'Premium pay type': setters.setPremiumType };
  return (
    <div className="tw-overlay">
      <div className="tw-filter-modal">
        <header><h3>Sort/Filter</h3><button onClick={onClose}><X /></button></header>
        <div className="tw-filter-body">
          <nav>{Object.keys(options).map((t) => <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>{t}<small>{t === 'Sort' ? values.sortBy : ''}</small></button>)}</nav>
          <section>
            {tab === 'Payout options' && <h4>In your absence, your family will receive the cover amount as</h4>}
            {tab === 'Premium pay type' && <h4>How do you wish to pay?</h4>}
            {options[tab].map((opt) => (
              <button className={`tw-filter-option ${values[keyMap[tab]] === opt ? 'active' : ''}`} key={opt} onClick={() => setterMap[tab](opt)}>
                <span className="tw-radio-dot" />
                <span>
                  <b>{opt}</b>
                  {tab === 'Plan type' && <small>Plans that combine investment and insurance benefits for protection.</small>}
                  {tab === 'Premium pay type' && opt === 'Limited Pay' && <em>Save upto 56%</em>}
                </span>
              </button>
            ))}
          </section>
        </div>
        <footer><button onClick={() => window.location.reload()}>Clear all</button><button onClick={onClose}>Apply</button></footer>
      </div>
    </div>
  );
}

function EditProfileDrawer({ profile, onClose, onSave }) {
  const [draft, setDraft] = useState(profile);
  return (
    <div className="tw-drawer-wrap">
      <div className="tw-dim" onClick={onClose} />
      <aside className="tw-edit-drawer">
        <header><button onClick={onClose}><ArrowLeft /></button><h3>Edit Profile</h3></header>
        <div className="tw-edit-scroll">
          <div className="tw-gender-row">
            {['Male', 'Female'].map((g) => <button key={g} className={draft.gender === g ? 'active' : ''} onClick={() => setDraft({ ...draft, gender: g })}><UserRound size={18} /> {g}</button>)}
          </div>
          {[
            ['Your Name', 'name'],
            ['Date of Birth', 'dob'],
            ['Annual Income', 'income'],
            ['Educational Qualification', 'education'],
            ['Your City', 'city'],
            ['Pin Code', 'pincode'],
          ].map(([label, key]) => (
            <label className="tw-edit-field" key={key}><span>{label}</span><input value={draft[key]} placeholder={`Please Enter ${label}`} onChange={(e) => setDraft({ ...draft, [key]: e.target.value })} /></label>
          ))}
          <label className="tw-edit-field"><span>Do you smoke or chew tobacco?</span><select value={draft.smoker} onChange={(e) => setDraft({ ...draft, smoker: e.target.value })}><option>No</option><option>Yes</option></select></label>
          <div className="tw-gender-row">
            {['Salaried', 'Self Employed'].map((o) => <button key={o} className={draft.occupation === o ? 'active' : ''} onClick={() => setDraft({ ...draft, occupation: o })}>{o}</button>)}
          </div>
        </div>
        <footer><button className="tw-primary" onClick={() => onSave(draft)}>Save</button></footer>
      </aside>
    </div>
  );
}

function TermDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = location.state?.profile || baseProfile;
  const plan = location.state?.plan || termPlans[0];
  const [tab, setTab] = useState('details');
  const [detailStep, setDetailStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({ pincode: '', city: '', nationality: 'Resident Indian', existing: '', marital: '', feet: '', inch: '', weight: '', health: '' });
  const [knowPlan, setKnowPlan] = useState(false);
  const total = tab === 'upgrade' || tab === 'riders' ? 147902 : 76973;

  const proceed = () => {
    if (tab === 'details') {
      if (detailStep === 0) {
        const next = {};
        if (!/^\d{6}$/.test(form.pincode.trim())) next.pincode = 'The Pincode field is required (6 digits).';
        if (!form.city.trim()) next.city = 'The City field is required.';
        if (!form.existing) next.existing = 'Please select an option';
        setErrors(next);
        if (Object.keys(next).length) return;
        setDetailStep(1);
        return;
      }
      if (detailStep === 1) {
        const next = {};
        if (!form.marital.trim()) next.marital = 'Please enter your marital status';
        if (!form.weight.trim()) next.weight = 'Weight is required';
        if (!form.health) next.health = 'Please select an option';
        setErrors(next);
        if (Object.keys(next).length) return;
        setDetailStep(2);
        setTab('upgrade');
        return;
      }
    }
    navigate('/term-insurance-women/review', { state: { profile, plan, total } });
  };

  return (
    <div className="tw-page tw-detail">
      <AVHeader compact />
      <div className="tw-detail-profile">
        <span>{profile.gender}</span><span>DOB : {profile.dob}</span><span>{profile.smoker === 'No' ? 'Non Smoker' : 'Smoker'}</span><span>{profile.mobile}</span><button onClick={() => navigate('/term-insurance-women/quotes')}>EDIT</button>
        <button className="tw-know-btn" onClick={() => setKnowPlan(true)}><FileText size={16} /> Know Your Plan in 2 mins</button>
      </div>
      <main className="tw-detail-layout">
        <aside className="tw-product-side">
          <div className={`tw-insurer-logo ${plan.logoClass}`}>{plan.logo}</div>
          <b>{plan.plan}</b>
          {['Life Cover|₹25 Lacs', 'Cover till age|60 Years', 'Pay For|One Time', 'Mode of premium payment|One Time'].map((row) => {
            const [a, b] = row.split('|');
            return <div className="tw-product-row" key={a}><small>{a}</small><strong>{b}</strong><ChevronDown size={16} /></div>;
          })}
          <h4>AV Management Advantage</h4>
          <button className="tw-adv blue">100% GENUINE CLAIMS ASSURANCE <ChevronDown size={14} /></button>
          <button className="tw-adv gold">AV Management Lowest Price Guarantee <ChevronDown size={14} /></button>
          <button className="tw-adv pale">We are Partner in Excellence for Tata AIA Life <ChevronDown size={14} /></button>
          <div className="tw-mini-stats"><span>99.45%<small>claim settlement ratio</small></span><span>30 Days<small>Easy Refund Policy #</small></span></div>
        </aside>
        <section className="tw-detail-main">
          <div className="tw-detail-tabs"><button onClick={() => setTab('details')} className={tab === 'details' ? 'active' : ''}>Your Details</button><button onClick={() => setTab('upgrade')} className={tab === 'upgrade' ? 'active' : ''}>Upgrade Your Plan</button><button onClick={() => setTab('riders')} className={tab === 'riders' ? 'active' : ''}>Add-On Riders</button></div>
          {tab === 'details' && (
            <div className="tw-form-panel">
              {detailStep === 0 ? (
                <>
                  <InputLine label="Pincode" value={form.pincode} onChange={(v) => setForm({ ...form, pincode: v, city: v === '110059' ? 'DELHI NCR (DELHI)' : form.city })} error={errors.pincode} help="Please enter the Pincode of your current residential address" />
                  <InputLine label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} error={errors.city} help="Please enter the City of your current residential address" />
                  <InputLine label="Nationality" value={form.nationality} onChange={(v) => setForm({ ...form, nationality: v })} disabled />
                  <div className="tw-question-line"><p>Does any of your family member is existing customer of TATA AIA Life Insurance?</p><button className={form.existing === 'Yes' ? 'active' : ''} onClick={() => setForm({ ...form, existing: 'Yes' })}>Yes</button><button className={form.existing === 'No' ? 'active' : ''} onClick={() => setForm({ ...form, existing: 'No' })}>No</button>{errors.existing && <em>{errors.existing}</em>}</div>
                </>
              ) : (
                <>
                  <InputLine label="Marital Status" value={form.marital} onChange={(v) => setForm({ ...form, marital: v })} error={errors.marital} placeholder="e.g. Married / Single" />
                  <div className="tw-three"><InputLine label="Height In Feet" value={form.feet} onChange={(v) => setForm({ ...form, feet: v })} /><InputLine label="Height In Inch" value={form.inch} onChange={(v) => setForm({ ...form, inch: v })} /><InputLine label="Weight in Kg" value={form.weight} onChange={(v) => setForm({ ...form, weight: v })} error={errors.weight} /></div>
                  <div className="tw-question-line"><p>Are you diabetic or suffering from any heart problem?</p><button className={form.health === 'Yes' ? 'active' : ''} onClick={() => setForm({ ...form, health: 'Yes' })}>Yes</button><button className={form.health === 'No' ? 'active' : ''} onClick={() => setForm({ ...form, health: 'No' })}>No</button>{errors.health && <em>{errors.health}</em>}</div>
                </>
              )}
            </div>
          )}
          {tab === 'upgrade' && (
            <div className="tw-upgrade-card">
              <h3>Benefit Payout to Nominee</h3>
              <p>In my absence my family will get</p>
              <label><input type="radio" defaultChecked /> ₹ 50 Lacs in a single instalment <b>Most Popular</b></label>
              <div><span>Price</span><strong>{formatRs(147902)} One Time</strong></div>
            </div>
          )}
          {tab === 'riders' && <div className="tw-rider-empty"><h3>Add-On Riders not available</h3><p>Please click on review details below to Proceed</p></div>}
          <div className="tw-detail-bottom">
            <span>Congratulations!! You've received a discount of <b>1%</b> on 1<sup>st</sup> yr premium</span>
            <strong>Total Premium {formatRs(total)} <small>One Time</small></strong>
            <button onClick={proceed}>{tab === 'details' ? 'PROCEED' : 'REVIEW DETAILS'} <ChevronRight size={18} /></button>
          </div>
        </section>
      </main>
      {knowPlan && <KnowPlanModal onClose={() => setKnowPlan(false)} />}
    </div>
  );
}

function InputLine({ label, value, onChange, error, help, disabled }) {
  return (
    <label className={`tw-line-input ${error ? 'error' : ''}`}>
      <span>{label}</span>
      <input value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} />
      {error && <em>{error}</em>}
      {help && <small>{help}</small>}
    </label>
  );
}

function KnowPlanModal({ onClose }) {
  const [step, setStep] = useState(0);
  const labels = ['Plan Features', 'Free Benefits', 'Paid Benefits(4)', 'About Insurer'];
  const paid = ['Accidental Death Benefit', 'Accidental Total and Permanent Disability Benefit', 'Critical Illness Benefit', 'HospiCash Benefit'];
  return (
    <div className="tw-overlay">
      <div className="tw-know-modal">
        <header>
          {step > 0 ? <button onClick={() => setStep(step - 1)}><ArrowLeft /></button> : <span />}
          <button><Download size={16} /> Download Brochure</button>
          <button onClick={onClose}><X /></button>
        </header>
        <div className="tw-progress-tabs">{labels.map((l, i) => <button key={l} className={i <= step ? 'done' : ''} onClick={() => setStep(i)}><i />{l}</button>)}</div>
        <section className="tw-know-content">
          {step === 0 && <><h2>Your Plan</h2><p>In case of death anytime before age of <b>60 years</b>, your nominee will get a sum of <b>₹25 Lacs</b></p><h3>Inclusions</h3><p>Death due to any cause (e.g. natural, accidental, murder, illnesses, calamities, Covid-19)</p><h3>Exclusions</h3><p>Suicide during first year</p></>}
          {step === 1 && <><h2>Free Benefits</h2><h3>Early payout on Terminal illness</h3><p>50% of life cover will be paid out immediately and the remaining 50% on death.</p><h3>Waiver of premium cover</h3><p>Future premiums can be waived off on eligible terminal illness claim.</p><h3>Tax Benefits</h3><p>All premiums paid upto 1.5 Lac a year are exempted from tax under section 80C.</p><h3>Zero Commission</h3><p>We charge no commission from you, when you buy from us.</p></>}
          {step === 2 && <><h4>Paid Benefit <span>{Math.min(4, step + 1)} OF 4</span></h4><h2>{paid[0]}</h2><p>The insured amount under this benefit option will be payable in the event of death due to an accident within the benefit option term.</p>{paid.slice(1).map((p) => <h3 key={p}>{p}</h3>)}</>}
          {step === 3 && <><h2>About Insurer</h2><p>We combine Tata Group's unrivalled brand strength and leadership position in India, and AIA's expertise and presence across the Asia-Pacific region.</p><div className="tw-credential"><b>STRONG CREDENTIALS</b><span>LARGEST NON-BANK PROMOTED INSURER WITH PROTECTION LEADERSHIP</span></div></>}
        </section>
        <footer><button onClick={step === 3 ? onClose : () => setStep(step + 1)}>{step === 3 ? 'DONE' : 'Proceed'}</button></footer>
      </div>
    </div>
  );
}

function TermReviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = location.state?.profile || baseProfile;
  const plan = location.state?.plan || termPlans[0];
  const total = location.state?.total || 147902;
  const [declareOpen, setDeclareOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(true);
  return (
    <div className="tw-page tw-review">
      <AVHeader compact />
      <main className="tw-review-card">
        <header><div className={`tw-insurer-logo ${plan.logoClass}`}>{plan.logo}</div><b>{plan.plan}</b></header>
        <h2>Review below details before proceeding</h2>
        <p>These cannot be changed at a later stage</p>
        <div className="tw-review-grid">
          <ReviewBox label="Name" value={profile.name} /><ReviewBox label="Date of Birth" value={profile.dob} /><ReviewBox label="Email" value={profile.email} /><ReviewBox label="Mobile Number" value={profile.mobile} />
        </div>
        <button className="tw-accordion" onClick={() => setAddOpen(!addOpen)}>Additional Details <ChevronDown /></button>
        {addOpen && <div className="tw-accordion-body">Life cover ₹{plan.cover} Lacs, cover till {plan.coverTill} years, one time premium, benefit payout to nominee, {profile.smoker === 'No' ? 'non-smoker' : 'smoker'}.</div>}
        <button className="tw-accordion" onClick={() => setDeclareOpen(!declareOpen)}>Declarations <ChevronDown /></button>
        {declareOpen && <div className="tw-accordion-body">I/We have read and understood all declarations and product terms.</div>}
        <label className="tw-confirm"><input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} /> I/We confirm that I/we have read and understood the declarations</label>
        <footer><strong>Total Premium {formatRs(total)} <small>single</small></strong><button onClick={() => navigate('/term-insurance-women/details')}>EDIT DETAILS</button><button disabled={!confirmed} onClick={() => navigate('/term-insurance-women/payment', { state: { total, profile, plan } })}>CHECKOUT</button></footer>
      </main>
    </div>
  );
}

function ReviewBox({ label, value }) {
  return <div className="tw-review-box"><small>{label}</small><b>{value}</b></div>;
}

function TermPaymentPage() {
  const location = useLocation();
  const plan = location.state?.plan || termPlans[0];
  const total = location.state?.total || 147902;
  const [mode, setMode] = useState('NetBanking');
  const [paid, setPaid] = useState(false);
  const modes = ['NetBanking', 'UPI', 'Credit Card', 'Debit Card', 'Wallet'];
  const payNow = () => setPaid(true);
  return (
    <div className="tw-page tw-payment">
      <AVHeader compact />
      <main className="tw-pay-layout">
        <section className="tw-pay-main">
          <div className="tw-pay-step"><span className={paid ? '' : 'done'}>Payment Mode</span><span className={paid ? 'done' : ''}>Payment Complete</span></div>
          {paid ? (
            <div className="tw-pay-success">
              <b>✓</b>
              <h2>Payment Successful!</h2>
              <p>Your policy proposal has been submitted successfully. Our advisor will call you shortly for verification.</p>
              <button onClick={() => window.open('https://policybazaar.com', '_blank')}>Download Receipt</button>
            </div>
          ) : (
            <div className="tw-pay-box">
              <nav>{modes.map((m) => <button key={m} className={mode === m ? 'active' : ''} onClick={() => setMode(m)}>{modeIcon(m)} {m}</button>)}</nav>
              <div className="tw-pay-content">
                <div className="tw-alert">Canara Bank, Bank of India are currently facing some technical issues.</div>
                {mode === 'NetBanking' && <BankPanel onPay={payNow} />}
                {mode === 'UPI' && <UPIPanel onPay={payNow} />}
                {(mode === 'Credit Card' || mode === 'Debit Card') && <CardPanel mode={mode} onPay={payNow} />}
                {mode === 'Wallet' && <WalletPanel onPay={payNow} />}
              </div>
            </div>
          )}
          <div className="tw-pay-links">Privacy Policy | Terms & Conditions | FAQ <b>PCI DSS Certified</b></div>
        </section>
        <aside className="tw-pay-summary">
          <div className="tw-order"><small>Order Number</small><b>PB177625073</b></div>
          <div className="tw-order-plan"><div className={`tw-insurer-logo ${plan.logoClass}`}>{plan.logo}</div><small>Premium</small><b>{formatRs(total)}.00</b><p>Plan Name: <strong>{plan.plan}</strong></p><hr /><p>Total Premium <strong>{formatRs(total)}.00</strong></p></div>
          <div className="tw-pay-frequency"><b>Pay frequency</b><strong>SINGLE</strong></div>
          <div className="tw-plan-details"><h3>Plan Details</h3><p><span>Insurer</span><b>{plan.insurer.toUpperCase()}</b></p><p><span>Plan</span><b>{plan.plan}</b></p><p><span>Policy Type</span><b>TermLife</b></p><p><span>Life Cover</span><b>₹{plan.cover} Lacs</b></p><p><span>Order No.</span><b>PB177625073</b></p></div>
        </aside>
      </main>
    </div>
  );
}

function modeIcon(mode) {
  if (mode === 'NetBanking') return <Landmark size={21} />;
  if (mode === 'Wallet') return <Wallet size={21} />;
  if (mode === 'UPI') return <span className="tw-upi">UPI</span>;
  return <CreditCard size={21} />;
}

function BankPanel({ onPay }) {
  const banks = ['HDFC', 'ICICI', 'SBI', 'Kotak Mahindra', 'Punjab National Bank', 'Bank of Baroda'];
  const [sel, setSel] = useState('HDFC');
  return <><h3>Select your Bank</h3><div className="tw-bank-grid">{banks.map((b) => <button key={b} className={`tw-bank${sel === b ? ' active' : ''}`} onClick={() => setSel(b)}><span>{b.slice(0, 2)}</span>{b}{sel === b && ' ✓'}</button>)}</div><select value={sel} onChange={(e) => setSel(e.target.value)}><option>Select Another Bank</option>{banks.map((b) => <option key={b}>{b}</option>)}</select><button className="tw-pay-now" onClick={onPay}>Pay Now</button></>;
}

function UPIPanel({ onPay }) {
  const [vpa, setVpa] = useState('');
  return <><h3>Pay using UPI</h3><div className="tw-upi-panel"><div className="tw-qr">QR<br /><button>View</button></div><div><input placeholder="mobilenumber@upi" value={vpa} onChange={(e) => setVpa(e.target.value)} /><button disabled={!vpa} onClick={onPay}>Verify & Pay</button><ol><li>Enter your registered VPA</li><li>Receive payment request on payment app</li><li>Authorize payment request</li></ol></div></div><div className="tw-alert">Transaction confirmation for UPI takes longer than other payment modes.</div></>;
}

function CardPanel({ mode, onPay }) {
  return <><h3>Enter your {mode} details</h3><input placeholder={`${mode} Number`} /><input placeholder="Enter Your Name" /><div className="tw-card-row"><input placeholder="Expiry Month & Year" /><input placeholder="CVV" /></div><button className="tw-pay-now" onClick={onPay}>Pay Now</button></>;
}

function WalletPanel({ onPay }) {
  const wallets = ['PhonePe', 'airtel', 'JioMoney', 'freecharge', 'PAYZAPP', 'OLAMONEY', 'MobiKwik', 'paytm', 'oxigen', 'amazon pay'];
  const [sel, setSel] = useState('');
  return <><h3>Select Wallet app</h3><div className="tw-wallet-grid">{wallets.map((w) => <button key={w} className={sel === w ? 'active' : ''} onClick={() => setSel(w)}><span>{w[0]}</span>{w}{sel === w && ' ✓'}</button>)}</div><button className="tw-pay-now" disabled={!sel} onClick={onPay}>Pay now</button><p className="tw-please">Please note: wallets cannot be used for transactions more than Rs. 1,00,000 per month.</p></>;
}

export default function TermWomenFlow() {
  const { pathname } = useLocation();
  if (pathname.includes('/quotes')) return <TermQuotesPage />;
  if (pathname.includes('/details')) return <TermDetailPage />;
  if (pathname.includes('/review')) return <TermReviewPage />;
  if (pathname.includes('/payment')) return <TermPaymentPage />;
  return <TermLandingPage />;
}
