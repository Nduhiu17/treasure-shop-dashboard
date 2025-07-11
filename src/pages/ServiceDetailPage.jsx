import React from "react";
import LandingNavbar from "../components/LandingNavbar";
import LandingFooter from "../components/LandingFooter";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthProvider";
import OrderPriceCalculator from "../components/OrderPriceCalculator";

const SERVICE_DETAILS = {
  "argumentative-essay": {
    title: "Argumentative Essay",
    description: "Get a compelling, well-structured argumentative essay from our expert writers. We help you present your case with clarity, evidence, and persuasive logic.",
    guarantees: ["Original research", "Clear thesis", "Strong arguments", "Proper citations"],
    reviews: [
      { name: "Alice", rating: 5, text: "My argumentative essay was top-notch!" },
      { name: "Bob", rating: 4, text: "Great structure and evidence." },
    ],
  },
  "article": {
    title: "Article Writing",
    description: "Professional articles for blogs, journals, and websites. Well-researched, engaging, and tailored to your audience.",
    guarantees: ["SEO optimized", "Engaging content", "Thorough research", "Timely delivery"],
    reviews: [
      { name: "Sophie", rating: 5, text: "My blog traffic increased thanks to their articles!" },
      { name: "Mike", rating: 4, text: "Very readable and well-structured." },
    ],
  },
  "assignment": {
    title: "Assignment Help",
    description: "Get expert help with any assignment, any subject. We ensure clarity, accuracy, and academic integrity.",
    guarantees: ["Accurate solutions", "Subject expertise", "Plagiarism-free", "Confidentiality"],
    reviews: [
      { name: "Priya", rating: 5, text: "Saved me during finals week!" },
      { name: "Tom", rating: 4, text: "Quick turnaround and clear explanations." },
    ],
  },
  "book-report-review": {
    title: "Book Report/Review",
    description: "Insightful book reports and reviews that analyze themes, characters, and context. Impress your teachers with depth and clarity.",
    guarantees: ["Critical analysis", "Original insights", "Proper formatting", "On-time delivery"],
    reviews: [
      { name: "Emma", rating: 5, text: "My teacher loved my book review!" },
      { name: "Lucas", rating: 4, text: "Very detailed and thoughtful." },
    ],
  },
  "case-study": {
    title: "Case Study",
    description: "Comprehensive case studies with real-world analysis and actionable recommendations. Perfect for business, law, and more.",
    guarantees: ["In-depth research", "Practical solutions", "Clear structure", "Confidentiality"],
    reviews: [
      { name: "Olivia", rating: 5, text: "The case study was exactly what I needed for my MBA." },
      { name: "Ethan", rating: 4, text: "Well-organized and insightful." },
    ],
  },
  "coursework": {
    title: "Coursework Assistance",
    description: "Stay on top of your coursework with expert help. We cover all subjects and academic levels.",
    guarantees: ["Comprehensive coverage", "Deadline adherence", "Original work", "24/7 support"],
    reviews: [
      { name: "Mia", rating: 5, text: "Helped me manage a heavy workload!" },
      { name: "Noah", rating: 4, text: "Consistent quality every time." },
    ],
  },
  "cover-letter-writing": {
    title: "Cover Letter Writing",
    description: "Stand out in your job search with a custom cover letter that highlights your strengths and fits your target role.",
    guarantees: ["Personalized content", "Professional tone", "ATS-friendly", "Fast delivery"],
    reviews: [
      { name: "Ava", rating: 5, text: "Landed my dream job!" },
      { name: "James", rating: 4, text: "Very professional and effective." },
    ],
  },
  "discussion-board-post": {
    title: "Discussion Board Post",
    description: "Engaging, thoughtful posts for online classes. We help you participate meaningfully and earn top marks.",
    guarantees: ["Relevant content", "Academic tone", "Timely submission", "Originality"],
    reviews: [
      { name: "Ella", rating: 5, text: "My professor always highlights my posts now!" },
      { name: "Benjamin", rating: 4, text: "Great for online courses." },
    ],
  },
  "dissertation": {
    title: "Dissertation Writing",
    description: "Full dissertation support: topic selection, research, writing, and editing. Work with PhD experts in your field.",
    guarantees: ["PhD-level writers", "Original research", "Comprehensive support", "Confidentiality"],
    reviews: [
      { name: "Charlotte", rating: 5, text: "Couldn’t have finished my PhD without them!" },
      { name: "Henry", rating: 4, text: "Very thorough and responsive." },
    ],
  },
  "homework": {
    title: "Homework Help",
    description: "Quick, reliable homework help for any subject. Get step-by-step solutions and explanations.",
    guarantees: ["Accurate answers", "Fast turnaround", "All subjects", "Confidential"],
    reviews: [
      { name: "Grace", rating: 5, text: "Always on time and correct!" },
      { name: "Jack", rating: 4, text: "Great for last-minute help." },
    ],
  },
  "lab-report": {
    title: "Lab Report",
    description: "Detailed lab reports with clear methodology, results, and analysis. Perfect for science and engineering courses.",
    guarantees: ["Accurate data", "Clear visuals", "Proper formatting", "Original work"],
    reviews: [
      { name: "Zoe", rating: 5, text: "My lab grades improved a lot!" },
      { name: "Leo", rating: 4, text: "Very clear and well-organized." },
    ],
  },
  "math-problems": {
    title: "Math Problems",
    description: "Get step-by-step solutions to math problems, from algebra to advanced calculus. Explanations included!",
    guarantees: ["Step-by-step solutions", "All levels", "Accurate answers", "Fast delivery"],
    reviews: [
      { name: "Lily", rating: 5, text: "Math finally makes sense!" },
      { name: "William", rating: 4, text: "Quick and correct every time." },
    ],
  },
  "movie-review": {
    title: "Movie Review",
    description: "Insightful movie reviews for assignments or publications. We analyze themes, direction, and impact.",
    guarantees: ["Critical analysis", "Original writing", "Engaging style", "On-time delivery"],
    reviews: [
      { name: "Sofia", rating: 5, text: "My review was published in the school paper!" },
      { name: "Mason", rating: 4, text: "Very thoughtful and well-written." },
    ],
  },
  "nursing-paper": {
    title: "Nursing Paper",
    description: "Expert help with nursing essays, case studies, and research. Written by healthcare professionals.",
    guarantees: ["Healthcare experts", "Evidence-based", "Confidential", "Plagiarism-free"],
    reviews: [
      { name: "Harper", rating: 5, text: "Perfect for my BSN program!" },
      { name: "Logan", rating: 4, text: "Very knowledgeable writers." },
    ],
  },
  "personal-statement": {
    title: "Personal Statement",
    description: "Stand out in your college or grad school application with a compelling, authentic personal statement.",
    guarantees: ["Personalized story", "Admissions expertise", "Original writing", "Fast turnaround"],
    reviews: [
      { name: "Amelia", rating: 5, text: "Got into my top choice!" },
      { name: "Elijah", rating: 4, text: "Very helpful feedback and edits." },
    ],
  },
  "powerpoint-presentation": {
    title: "PowerPoint Presentation",
    description: "Visually stunning presentations with clear content and professional design. Impress your audience every time.",
    guarantees: ["Custom design", "Clear visuals", "Engaging slides", "On-time delivery"],
    reviews: [
      { name: "Mila", rating: 5, text: "My professor loved my slides!" },
      { name: "Carter", rating: 4, text: "Looked very professional." },
    ],
  },
  "proofreading": {
    title: "Proofreading",
    description: "Meticulous proofreading for grammar, style, and clarity. Perfect for essays, theses, and business documents.",
    guarantees: ["Grammar perfection", "Clarity", "Fast turnaround", "Confidentiality"],
    reviews: [
      { name: "Layla", rating: 5, text: "No more red marks from my professor!" },
      { name: "Sebastian", rating: 4, text: "Very thorough and quick." },
    ],
  },
  "research-paper": {
    title: "Research Paper",
    description: "In-depth research papers with credible sources and clear arguments. Any subject, any level.",
    guarantees: ["Credible sources", "Original analysis", "Proper citations", "Deadline guarantee"],
    reviews: [
      { name: "Chloe", rating: 5, text: "My research paper got an A!" },
      { name: "Aiden", rating: 4, text: "Very detailed and well-cited." },
    ],
  },
  "research-proposal": {
    title: "Research Proposal",
    description: "Get your research proposal approved with a clear, persuasive, and well-structured document.",
    guarantees: ["Clear objectives", "Persuasive writing", "Proper format", "Fast delivery"],
    reviews: [
      { name: "Penelope", rating: 5, text: "My proposal was accepted on the first try!" },
      { name: "David", rating: 4, text: "Very convincing and well-organized." },
    ],
  },
  "resume": {
    title: "Resume Writing",
    description: "Land more interviews with a professionally written resume tailored to your goals and industry.",
    guarantees: ["ATS-optimized", "Custom layout", "Industry expertise", "Fast turnaround"],
    reviews: [
      { name: "Aria", rating: 5, text: "Got more callbacks instantly!" },
      { name: "Matthew", rating: 4, text: "Very polished and effective." },
    ],
  },
  "term-paper": {
    title: "Term Paper",
    description: "Comprehensive term papers with original research and clear arguments. Delivered on time, every time.",
    guarantees: ["Original research", "Clear structure", "Proper citations", "Deadline guarantee"],
    reviews: [
      { name: "Scarlett", rating: 5, text: "Best term paper I’ve ever submitted!" },
      { name: "Daniel", rating: 4, text: "Very thorough and well-written." },
    ],
  },
};


export default function ServiceDetailPage() {
  const { user, logout } = useAuth();
  const { serviceSlug } = useParams();
  // const [createOrderModalOpen, setCreateOrderModalOpen] = useState(false); // No longer used
  const [showCalculator] = React.useState(true); // always true, no inline order form anymore
  const navigate = useNavigate();
  const service = SERVICE_DETAILS[serviceSlug] || {
    title: serviceSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    description: "Detailed information about this service will be available soon.",
    guarantees: [],
    reviews: [],
  };

  // Handler for OrderPriceCalculator "Proceed to details"
  const handleCalculatorProceed = (selections) => {
    if (user) {
      navigate("/order/new", { state: { calculatorSelections: selections } });
    }
  };

  // (Legacy) After order creation, go to payment step and show calculator again (no longer used)
  // (removed all legacy state and handlers for order form/payment)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-fuchsia-100 via-cyan-100 to-blue-100 overflow-x-hidden">
      <LandingNavbar user={user} onLogout={logout} />
      <main className="flex-1 px-4 py-12 max-w-3xl mx-auto animate-fade-in">
        {/* HERO SECTION */}
        <section className="mb-10 text-center relative">
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="w-full h-40 bg-gradient-to-r from-fuchsia-300 via-cyan-200 to-blue-200 blur-2xl opacity-60 animate-gradient-x" />
          </div>
          <h1 className="relative z-10 text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 via-cyan-600 to-blue-700 mb-4 drop-shadow-lg">
            {service.title}
          </h1>
          <p className="relative z-10 text-lg sm:text-xl text-blue-900 max-w-2xl mx-auto mb-6">
            {service.description}
          </p>
        </section>

        {/* GUARANTEES SECTION */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-cyan-700 mb-4 text-center">What We Guarantee</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {service.guarantees.length ? service.guarantees.map((g, i) => (
              <li key={i} className="bg-white/90 rounded-2xl shadow-lg p-5 border-t-4 border-cyan-200 text-blue-900 text-base flex items-center gap-3">
                <svg className="w-6 h-6 text-fuchsia-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
                <span>{g}</span>
              </li>
            )) : <li className="bg-white/90 rounded-2xl shadow-lg p-5 border-t-4 border-cyan-200 text-blue-900 text-base flex items-center gap-3">Quality, originality, and on-time delivery.</li>}
          </ul>
        </section>

        {/* CUSTOMER REVIEWS SECTION */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-fuchsia-700 mb-4 text-center">Customer Reviews</h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            {service.reviews.length ? service.reviews.map((r, i) => (
              <div key={i} className="bg-white/90 rounded-2xl shadow-lg p-5 border-t-4 border-fuchsia-200">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-blue-900">{r.name}</span>
                  <span className="text-yellow-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                </div>
                <div className="text-blue-900">"{r.text}"</div>
              </div>
            )) : <div className="text-blue-700">No reviews yet for this service.</div>}
          </div>
        </section>

        {/* ORDER PRICE CALCULATOR - Modern placement */}
        {showCalculator && (
          <div className="w-full flex flex-col items-center mt-8 mb-6 px-2 sm:px-4 animate-fade-in-up">
            <div className="shadow-2xl rounded-2xl sm:rounded-3xl bg-gradient-to-br from-fuchsia-50 via-cyan-50 to-blue-50 border border-blue-100 p-4 sm:p-6 md:p-8 w-full max-w-xs sm:max-w-md relative overflow-hidden">
              <h3 className="text-lg sm:text-xl font-bold text-fuchsia-700 mb-4 text-center flex items-center justify-center gap-2">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-500 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" /></svg>
                Get an Instant Price Quote
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-fuchsia-500 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" /><path d="M8 12h8M12 8v8" /></svg>
              </h3>
              <OrderPriceCalculator onProceed={handleCalculatorProceed} />
              <div className="mt-5 sm:mt-6 grid grid-cols-1 gap-2 sm:gap-3 text-blue-900 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-fuchsia-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2l4-4" /><circle cx="12" cy="12" r="10" /></svg>
                  <span>No hidden fees – what you see is what you pay.</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" /><path d="M8 12h8M12 8v8" /></svg>
                  <span>Instant calculation – get your quote in seconds.</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" /></svg>
                  <span>Secure & confidential – your data is always protected.</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                  <span>24/7 support – help is always available.</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                  <span>Instant order confirmation & progress tracking.</span>
                </div>
              </div>
            </div>
            <button
              className="mt-6 sm:mt-8 bg-gradient-to-r from-fuchsia-500 via-cyan-500 to-blue-500 text-white font-bold shadow-lg hover:from-fuchsia-600 hover:to-blue-700 px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-lg rounded-2xl transition-all duration-200 flex items-center gap-2 sm:gap-3 w-full max-w-xs sm:max-w-md"
              onClick={() => {
                if (user) {
                  navigate('/order/new');
                } else {
                  navigate('/login?redirect=/order/new');
                }
              }}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" /></svg>
              Order Now
            </button>
          </div>
        )}

        {/* HOW IT WORKS SECTION */}
        <section className="mb-14 animate-fade-in-up">
          <h2 className="text-2xl font-bold text-cyan-700 mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="bg-white/90 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border-t-4 border-fuchsia-200">
              <svg className="w-10 h-10 text-fuchsia-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 12l2 2 4-4" /></svg>
              <div className="font-bold text-blue-900 mb-1">1. Fill Out the Calculator</div>
              <div className="text-blue-700 text-sm">Choose your service, deadline, and details to get an instant quote.</div>
            </div>
            <div className="bg-white/90 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border-t-4 border-cyan-200">
              <svg className="w-10 h-10 text-cyan-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" /><path d="M8 12h8M12 8v8" /></svg>
              <div className="font-bold text-blue-900 mb-1">2. Place Your Order</div>
              <div className="text-blue-700 text-sm">Proceed to the order form and provide your assignment instructions.</div>
            </div>
            <div className="bg-white/90 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border-t-4 border-blue-200">
              <svg className="w-10 h-10 text-blue-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
              <div className="font-bold text-blue-900 mb-1">3. Get Your Paper</div>
              <div className="text-blue-700 text-sm">Relax while an expert completes your order. Download your finished work on time.</div>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US SECTION */}
        <section className="mb-20 animate-fade-in-up">
          <h2 className="text-2xl font-bold text-fuchsia-700 mb-8 text-center">Why Choose Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-white/90 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border-t-4 border-fuchsia-400">
              <svg className="w-10 h-10 text-fuchsia-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
              <div className="font-bold text-blue-900 mb-1">Expert Writers</div>
              <div className="text-blue-700 text-sm">All assignments are handled by qualified, experienced professionals.</div>
            </div>
            <div className="bg-white/90 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border-t-4 border-cyan-400">
              <svg className="w-10 h-10 text-cyan-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2l4-4" /><circle cx="12" cy="12" r="10" /></svg>
              <div className="font-bold text-blue-900 mb-1">Plagiarism-Free</div>
              <div className="text-blue-700 text-sm">Every order is original and checked for plagiarism before delivery.</div>
            </div>
            <div className="bg-white/90 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border-t-4 border-blue-400">
              <svg className="w-10 h-10 text-blue-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" /></svg>
              <div className="font-bold text-blue-900 mb-1">On-Time Delivery</div>
              <div className="text-blue-700 text-sm">We guarantee your paper will be delivered by your deadline, every time.</div>
            </div>
            <div className="bg-white/90 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border-t-4 border-yellow-400">
              <svg className="w-10 h-10 text-yellow-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
              <div className="font-bold text-blue-900 mb-1">24/7 Support</div>
              <div className="text-blue-700 text-sm">Our support team is always available to help you with any questions.</div>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
