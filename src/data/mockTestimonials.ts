export interface ClaimHighlight {
  socialPostImage: string | null
  fullQuote: string
  summary: {
    problemFaced: string
    howWeHelped: string
  }
  claimDetails: {
    policy: string
    relationshipManager: string
    dateOfClaim: string
    hospitalName: string
  }
}

export interface Testimonial {
  id: string
  name: string
  ageMasked: string
  age: number
  customerSince: number
  platformIcon: 'facebook' | 'linkedin' | 'twitter' | 'google'
  dateLabel: string
  category: 'all' | 'social' | 'video' | 'events'
  excerpt: string
  claimHighlight?: ClaimHighlight
}

export const mockTestimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Amit Sharma',
    ageMasked: 'A ******',
    age: 34,
    customerSince: 2021,
    platformIcon: 'facebook',
    dateLabel: '15 Mar 2026',
    category: 'social',
    excerpt: 'My father was hospitalized for cardiac surgery. The entire cashless process was smooth and stress-free.',
    claimHighlight: {
      socialPostImage: 'mock',
      fullQuote: 'My father was hospitalized for cardiac surgery at Fortis Escorts, Delhi. The entire cashless process was smooth and stress-free. AV Management\'s relationship manager Amit Kumar guided us through every step — from pre-authorization to final settlement. The claim of ₹4.2 lakhs was approved within 24 hours. I cannot thank the team enough for their support during such a stressful time.',
      summary: {
        problemFaced: 'My 62-year-old father needed emergency cardiac bypass surgery. We were worried about the financial burden and the complexity of the insurance claim process during such a stressful time.',
        howWeHelped: 'Our relationship manager Amit Kumar took charge immediately. He coordinated with the hospital for cashless authorization, handled all the documentation, and ensured the claim was processed within 24 hours. We didn\'t have to pay anything out of pocket.',
      },
      claimDetails: {
        policy: 'Niva Bupa Health Insurance',
        relationshipManager: 'Amit Kumar',
        dateOfClaim: 'March, 2026',
        hospitalName: 'Fortis Escorts Heart Institute, Delhi',
      },
    },
  },
  {
    id: 't2',
    name: 'Priya Verma',
    ageMasked: 'P ******',
    age: 29,
    customerSince: 2022,
    platformIcon: 'linkedin',
    dateLabel: '28 Feb 2026',
    category: 'social',
    excerpt: 'When my daughter needed emergency appendectomy, AV Management made sure we didn\'t worry about bills.',
    claimHighlight: {
      socialPostImage: 'mock',
      fullQuote: 'When my 5-year-old daughter needed an emergency appendectomy at Max Hospital, Saket, I was panicked. But AV Management\'s team was incredible. They arranged everything — from cashless approval to coordinating with the hospital. The claim of ₹1.8 lakhs was settled seamlessly. Their proactive communication kept me informed at every step. I\'m grateful we had the right insurance and the right support.',
      summary: {
        problemFaced: 'My 5-year-old daughter was diagnosed with acute appendicitis and needed immediate surgery. As a single mother, the financial stress was overwhelming, and I had no idea how to navigate the insurance claim process.',
        howWeHelped: 'The AV Management team assigned me a dedicated relationship manager who handled everything remotely. She coordinated with Max Hospital for cashless approval, managed all paperwork, and kept me updated via WhatsApp. The entire claim was settled without me having to visit any office.',
      },
      claimDetails: {
        policy: 'HDFC Ergo Health Suraksha',
        relationshipManager: 'Neha Gupta',
        dateOfClaim: 'February, 2026',
        hospitalName: 'Max Super Speciality Hospital, Saket',
      },
    },
  },
  {
    id: 't3',
    name: 'Rajesh Nair',
    ageMasked: 'R ******',
    age: 45,
    customerSince: 2019,
    platformIcon: 'facebook',
    dateLabel: '10 Jan 2026',
    category: 'social',
    excerpt: 'My knee replacement surgery was fully covered. The cashless facility saved us from a huge financial burden.',
    claimHighlight: {
      socialPostImage: null,
      fullQuote: 'I had been suffering from chronic knee pain for years. When the doctor recommended replacement surgery, I was worried about the cost — it was quoted at ₹3.5 lakhs. But thanks to my health insurance through AV Management and the guidance of RM Suresh Patel, the entire amount was covered under cashless facility at Apollo Hospital, Chennai. The pre-authorization was approved in just 6 hours.',
      summary: {
        problemFaced: 'After years of chronic knee pain, I was advised bilateral knee replacement surgery. The estimated cost of ₹3.5 lakhs was a significant financial concern, and I was unsure if my policy would cover the full amount.',
        howWeHelped: 'My relationship manager Suresh Patel reviewed my policy and confirmed full coverage. He helped me with the pre-authorization paperwork and coordinated with Apollo Hospital. The cashless approval came through in just 6 hours, and the surgery went ahead without any financial worry.',
      },
      claimDetails: {
        policy: 'Star Health Premier Plan',
        relationshipManager: 'Suresh Patel',
        dateOfClaim: 'January, 2026',
        hospitalName: 'Apollo Hospitals, Chennai',
      },
    },
  },
  {
    id: 't4',
    name: 'Deepika Iyer',
    ageMasked: 'D ******',
    age: 31,
    customerSince: 2023,
    platformIcon: 'google',
    dateLabel: '5 Dec 2025',
    category: 'social',
    excerpt: 'Maternity claim was handled beautifully. From hospital admission to discharge, everything was smooth.',
    claimHighlight: {
      socialPostImage: 'mock',
      fullQuote: 'As a first-time mother, I was anxious about the hospital expenses for my delivery. AV Management made the entire maternity claim process seamless. My RM Kavitha Reddy helped with pre-hospitalization documentation, the cashless approval for ₹2.1 lakhs atManipal Hospital was quick, and even the post-delivery follow-up expenses were covered. The team even followed up after delivery to check on us.',
      summary: {
        problemFaced: 'Being a first-time mother, I was worried about the high costs of delivery and post-natal care. My maternity policy had several conditions, and I wasn\'t sure what would be covered.',
        howWeHelped: 'Kavitha from AV Management walked me through my maternity benefits before the delivery. She helped prepare all documentation in advance, got pre-authorization from Manipal Hospital, and ensured both delivery and post-natal expenses were covered under cashless. The personal follow-up after delivery was a wonderful touch.',
      },
      claimDetails: {
        policy: 'CareShield Health Companion',
        relationshipManager: 'Kavitha Reddy',
        dateOfClaim: 'December, 2025',
        hospitalName: 'Manipal Hospital, Bangalore',
      },
    },
  },
  {
    id: 't5',
    name: 'Sanjay Mehta',
    ageMasked: 'S ******',
    age: 52,
    customerSince: 2020,
    platformIcon: 'linkedin',
    dateLabel: '18 Nov 2025',
    category: 'social',
    excerpt: 'My cancer treatment claim across multiple chemotherapy sessions was handled with empathy and efficiency.',
    claimHighlight: {
      socialPostImage: null,
      fullQuote: 'When I was diagnosed with stage 2 colon cancer, my world turned upside down. Beyond the emotional trauma, I was terrified about the financial implications of long-term chemotherapy. AV Management\'s team, led by RM Vikram Joshi, helped me understand that my policy covered the entire treatment — 8 chemotherapy cycles, hospital stays, and medications. They processed each claim promptly and even helped with the paperwork for the restoration benefit when my sum insured was exhausted.',
      summary: {
        problemFaced: 'I was diagnosed with stage 2 colon cancer requiring 8 chemotherapy cycles over 6 months. The treatment cost was estimated at ₹8 lakhs, which exceeded my initial sum insured. I was overwhelmed and didn\'t know if my policy would cover the full treatment.',
        howWeHelped: 'Vikram Joshi from AV Management was my anchor through this difficult time. He explained the restoration benefit in my policy, coordinated with Kokilaben Hospital for each treatment session, and ensured every claim was processed smoothly. When my sum insured was exhausted after the 4th cycle, he immediately triggered the restoration benefit. Every single claim was settled without me having to pay anything.',
      },
      claimDetails: {
        policy: 'Niva Bupa ReAssure 2.0',
        relationshipManager: 'Vikram Joshi',
        dateOfClaim: 'November, 2025',
        hospitalName: 'Kokilaben Dhirubhai Ambani Hospital, Mumbai',
      },
    },
  },
  {
    id: 't6',
    name: 'Kavita Singh',
    ageMasked: 'K ******',
    age: 38,
    customerSince: 2021,
    platformIcon: 'facebook',
    dateLabel: '22 Oct 2025',
    category: 'events',
    excerpt: 'My mother\'s ACL surgery claim was resolved in just 3 days. Outstanding service.',
    claimHighlight: {
      socialPostImage: 'mock',
      fullQuote: 'My mother tore her ACL during a fall at home and needed urgent surgery. We rushed to Medanta Hospital, Gurgaon. AV Management\'s helpline connected me with RM Pradeep Sharma within minutes. He arranged the cashless authorization while we were still in the ER. The surgery cost of ₹2.8 lakhs was fully covered. What impressed me most was the follow-up — Pradeep called every day during my mother\'s recovery to check if we needed anything.',
      summary: {
        problemFaced: 'My 65-year-old mother suffered an ACL tear from a fall at home and needed emergency surgery. We were in panic mode and had no idea how to handle the insurance claim at the hospital.',
        howWeHelped: 'Within minutes of calling the AV Management helpline, RM Pradeep Sharma took over. He coordinated with Medanta\'s insurance desk for cashless authorization while we focused on my mother\'s care. The claim was approved before the surgery. Post-discharge, Pradeep helped with the follow-up claim for physiotherapy sessions too.',
      },
      claimDetails: {
        policy: 'HDFC Ergo Health Suraksha',
        relationshipManager: 'Pradeep Sharma',
        dateOfClaim: 'October, 2025',
        hospitalName: 'Medanta Hospital, Gurgaon',
      },
    },
  },
  {
    id: 't7',
    name: 'Arjun Reddy',
    ageMasked: 'A ******',
    age: 27,
    customerSince: 2024,
    platformIcon: 'twitter',
    dateLabel: '8 Sep 2025',
    category: 'social',
    excerpt: 'Accident claim settled within 48 hours. The team was responsive and professional throughout.',
    claimHighlight: {
      socialPostImage: null,
      fullQuote: 'I met with a road accident and was admitted to Yashoda Hospital with multiple fractures. The treatment cost was significant. AV Management\'s team immediately got into action. RM Ananya Krishnan coordinated with the hospital, and my claim of ₹3.2 lakhs was settled within 48 hours. The speed and professionalism of the team was remarkable. They even helped me claim the accident-related benefits I didn\'t know my policy included.',
      summary: {
        problemFaced: 'I was involved in a serious road accident resulting in multiple fractures requiring surgery. I was in pain and had no idea how to handle the insurance process from the hospital bed.',
        howWeHelped: 'Ananya from AV Management was assigned to my case within hours. She handled everything — from cashless authorization to claiming additional accident benefits I wasn\'t aware of. The entire claim of ₹3.2 lakhs was settled in 48 hours, and she followed up to ensure I knew about the post-hospitalization coverage for my rehabilitation.',
      },
      claimDetails: {
        policy: 'CareShield Health Elite',
        relationshipManager: 'Ananya Krishnan',
        dateOfClaim: 'September, 2025',
        hospitalName: 'Yashoda Hospital, Hyderabad',
      },
    },
  },
  {
    id: 't8',
    name: 'Meera Joshi',
    ageMasked: 'M ******',
    age: 42,
    customerSince: 2018,
    platformIcon: 'linkedin',
    dateLabel: '30 Aug 2025',
    category: 'social',
    excerpt: 'My husband\'s kidney stone surgery was completely cashless. No paperwork stress at all.',
    claimHighlight: {
      socialPostImage: 'mock',
      fullQuote: 'My husband needed surgery for kidney stones at Artemis Hospital, Gurgaon. We were worried about the paperwork, but AV Management made it completely cashless. RM Deepak Malhotra had already reviewed our policy before the surgery and confirmed coverage. The pre-authorization was approved in 4 hours. After the surgery, when we discovered additional complications that increased the bill, Deepak managed the supplementary claim seamlessly.',
      summary: {
        problemFaced: 'My husband was diagnosed with large kidney stones requiring surgical intervention. While we had health insurance, we were concerned about the claim process and potential out-of-pocket expenses for complications.',
        howWeHelped: 'Deepak Malhotra from AV Management reviewed our policy thoroughly before the surgery, identified potential coverage gaps, and ensured we had the right documentation ready. When complications during surgery increased the bill by ₹80,000, he immediately filed a supplementary claim that was approved within a day.',
      },
      claimDetails: {
        policy: 'Star Health Young Promise',
        relationshipManager: 'Deepak Malhotra',
        dateOfClaim: 'August, 2025',
        hospitalName: 'Artemis Hospital, Gurgaon',
      },
    },
  },
  {
    id: 't9',
    name: 'Vikram Patel',
    ageMasked: 'V ******',
    age: 55,
    customerSince: 2017,
    platformIcon: 'google',
    dateLabel: '12 Jul 2025',
    category: 'social',
    excerpt: 'My cardiac angioplasty claim was handled with utmost care. The restoration benefit saved us.',
    claimHighlight: {
      socialPostImage: null,
      fullQuote: 'After my cardiac angioplasty at Narayana Health, Bangalore, I was relieved that the procedure was covered. But when a second procedure was needed within the same year, I was worried my sum insured would be exhausted. AV Management\'s RM Sunita Rao explained that my policy included restoration benefit and helped me claim the full amount for the second procedure too. Two major cardiac procedures in one year, fully covered. That\'s the kind of security you need.',
      summary: {
        problemFaced: 'I needed two cardiac angioplasty procedures within 6 months. After the first procedure consumed most of my sum insured, I was terrified the second one wouldn\'t be covered.',
        howWeHelped: 'Sunita Rao from AV Management had proactively explained the restoration benefit during our annual policy review. When the second procedure was needed, she immediately activated the restoration and coordinated with Narayana Health for cashless approval. Both procedures totaling ₹5.6 lakhs were fully covered.',
      },
      claimDetails: {
        policy: 'TrustCare General Premium',
        relationshipManager: 'Sunita Rao',
        dateOfClaim: 'July, 2025',
        hospitalName: 'Narayana Health City, Bangalore',
      },
    },
  },
  {
    id: 't10',
    name: 'Nisha Agarwal',
    ageMasked: 'N ******',
    age: 36,
    customerSince: 2022,
    platformIcon: 'facebook',
    dateLabel: '25 Jun 2025',
    category: 'events',
    excerpt: 'My child\'s tonsil surgery claim was processed in just one day. Hassle-free experience.',
    claimHighlight: {
      socialPostImage: 'mock',
      fullQuote: 'My 8-year-old son needed tonsil surgery at Fortis Memorial Research Institute, Gurgaon. I was worried about the process with a child patient. AV Management\'s RM Rohit Verma was exceptional — he pre-arranged everything with the hospital, got the cashless approval before we even reached, and the claim of ₹1.2 lakhs was settled on the same day. He even called the next day to check on my son\'s recovery. The personal touch made all the difference.',
      summary: {
        problemFaced: 'My 8-year-old son needed urgent tonsil surgery. As a parent, I was anxious about both the medical procedure and managing insurance paperwork while caring for a sick child.',
        howWeHelped: 'Rohit Verma from AV Management took complete ownership. He coordinated with Fortis Memorial in advance, arranged cashless authorization, and ensured we walked in without any paperwork concerns. The claim was settled the same day. His follow-up call the next day to check on my son showed genuine care beyond just processing claims.',
      },
      claimDetails: {
        policy: 'Wellness Assure Complete Care',
        relationshipManager: 'Rohit Verma',
        dateOfClaim: 'June, 2025',
        hospitalName: 'Fortis Memorial Research Institute, Gurgaon',
      },
    },
  },
]
