export type Role = 'client' | 'coach'
export type Question = { id: string; prompt: string; type: 'single' | 'multi' | 'scale' | 'text'; options?: string[]; max?: number; helper?: string; audience?: 'all' | Role }

const q = (id: number, prompt: string, type: Question['type'], options?: string[], extra: Partial<Question> = {}): Question => ({ id: `q${id}`, prompt, type, options, audience: 'all', ...extra })

export const questions: Question[] = [
q(1, 'What is your age group?', 'single', ['Under 18','18–24','25–34','35–44','45+']),
q(2, 'What best describes you?', 'single', ['Gym enthusiast / Fitness enthusiast','Beginner looking to start fitness','Powerlifter / Strength athlete','Competitive athlete','Personal trainer / Fitness coach','Online fitness coach']),
q(3, 'What is your gender?', 'single', ['Male','Female','Non-binary','Prefer not to say']),
q(4, 'How long have you been involved in fitness?', 'single', ['Just starting','Less than 6 months','6 months–1 year','1–3 years','3–5 years','More than 5 years']),
q(5, 'How frequently do you train?', 'single', ['Not currently training','1–2 days/week','3–4 days/week','5–6 days/week','Every day']),
q(6, 'Which best describes your role?', 'single', ['I am a fitness enthusiast / Client','I am a personal trainer / Fitness coach']),
q(7, 'What is your primary fitness goal?', 'single', ['Muscle gain','Fat loss','Strength / Powerlifting','General fitness','Athletic performance','Weight management','Other'], { audience: 'client' }),
q(8, 'How do you currently plan your workouts?', 'single', ['Create my own workout plans','Follow YouTube / Instagram workouts','Use a fitness application',"Follow a personal trainer's program","Don't follow a structured program"], { audience: 'client' }),
q(9, 'How do you currently track your workouts?', 'single', ['Notebook','Excel / Google Sheets','Fitness tracking application','Trainer tracks everything',"Don't track workouts"], { audience: 'client' }),
q(10, 'What are your biggest fitness challenges?', 'multi', ['Creating effective workout plans','Tracking strength progression','Maintaining consistency','Managing nutrition','Understanding exercise technique','Finding professional guidance','Measuring physical progress','Other'], { audience: 'client', max: 3, helper: 'Select up to 3.' }),
q(11, 'Have you ever hired a personal trainer or online coach?', 'single', ['Currently working with one','Previously worked with one','Never hired one','Planning to hire one'], { audience: 'client' }),
q(12, 'How interested would you be in receiving personalized workout programs from a trainer through an app?', 'scale', ['1 — Not interested','2 — Slightly interested','3 — Neutral','4 — Interested','5 — Extremely interested'], { audience: 'client' }),
q(13, 'Which workout tracking features would you use most?', 'multi', ['Sets, reps and weights','Personal record tracking','Strength progression graphs','Workout history','Training volume analytics','Exercise demonstration videos','Workout reminders'], { audience: 'client', max: 3, helper: 'Select up to 3.' }),
q(14, 'How do you currently manage your nutrition?', 'single', ['Track calories and macros using an app',"Follow a trainer's nutrition plan",'Track manually','Follow a general diet without tracking',"Don't manage nutrition"], { audience: 'client' }),
q(15, 'What is your biggest frustration with existing fitness apps?', 'multi', ['Complicated interface','Expensive subscriptions','Limited workout customization','Inaccurate nutrition information','Poor progress analytics','No direct trainer integration',"Haven't used fitness apps",'Other'], { audience: 'client', max: 2, helper: 'Select up to 2.' }),
q(16, 'How much would you consider paying monthly for a premium fitness app, excluding personal coaching fees?', 'single', ['Only interested in free apps','₹99–₹199','₹200–₹399','₹400–₹699','₹700+','Not sure'], { audience: 'client' }),
q(17, 'How long have you been working as a fitness trainer?', 'single', ['Less than 6 months','6 months–1 year','1–3 years','3–5 years','More than 5 years'], { audience: 'coach' }),
q(18, 'How many clients do you currently manage?', 'single', ['0–5','6–15','16–30','31–50','More than 50'], { audience: 'coach' }),
q(19, 'How do you currently deliver workout plans to clients?', 'multi', ['WhatsApp','PDF documents','Excel / Google Sheets','Dedicated coaching applications','Printed workout plans','Verbal instructions','Other'], { audience: 'coach' }),
q(20, 'How do you currently monitor client progress?', 'multi', ['WhatsApp updates','Google Sheets / Excel','Fitness coaching software','Weekly check-in forms','In-person assessments',"Don't systematically track progress"], { audience: 'coach' }),
q(21, 'What is your biggest challenge in managing clients?', 'multi', ['Creating workout programs','Managing multiple clients','Tracking client progress','Nutrition planning','Client communication','Maintaining client consistency','Preparing reports','Other'], { audience: 'coach', max: 3, helper: 'Select up to 3.' }),
q(22, 'How much time do you spend weekly on administrative tasks such as program creation, updates, and tracking?', 'single', ['Less than 2 hours','2–5 hours','6–10 hours','11–20 hours','More than 20 hours'], { audience: 'coach' }),
q(23, 'Which coaching platform features would be most valuable?', 'multi', ['Workout program builder','Client management dashboard','Nutrition plan creation','Automated progress analytics','Professional PDF generation','Exercise video library','Client check-in forms','AI-assisted client summaries'], { audience: 'coach', max: 3, helper: 'Select up to 3.' }),
q(24, 'Would you use AI to assist with client assessments and progress summaries while retaining control over workout and nutrition plans?', 'single', ['Definitely','Probably','Not sure','Probably not','Definitely not'], { audience: 'coach' }),
q(25, 'What would motivate you to switch from your current coaching tools to BarLock?', 'multi', ['Faster program creation','Easier client management','Better progress tracking','Professional PDF generation','Lower subscription costs','Better client experience','Nothing — satisfied with current tools','Other'], { audience: 'coach', max: 2, helper: 'Select up to 2.' }),
q(26, 'How much would you consider paying monthly for a coaching platform that manages your clients, programs, and progress tracking?', 'single', ['Only interested in free tools','₹199–₹499','₹500–₹999','₹1,000–₹1,999','₹2,000–₹3,999','₹4,000+','Not sure'], { audience: 'coach' }),
q(27, 'How appealing is the overall BarLock concept to you?', 'scale', ['1 — Not appealing','2 — Slightly appealing','3 — Neutral','4 — Appealing','5 — Extremely appealing']),
q(28, 'Based on the description, how likely are you to try BarLock when it launches?', 'scale', ['0','1','2','3','4','5','6','7','8','9','10'], { helper: '0 = Extremely unlikely · 10 = Extremely likely' }),
q(29, 'What would be your biggest concern about using BarLock?', 'single', ['Subscription pricing','Data privacy and security','App complexity','Reliability and performance','Lack of useful features','Difficulty switching from existing tools','No major concerns','Other']),
q(30, 'What is one feature or improvement that would make BarLock valuable enough for you to use regularly?', 'text')
]

export const activeQuestions = (role: Role | null) => questions.filter(question => question.audience === 'all' || question.audience === role)
