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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100">
      <LandingNavbar user={user} onLogout={logout} />
      <main className="flex-1 px-4 py-12 max-w-3xl mx-auto animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-4">{service.title}</h1>
        <p className="text-blue-900 mb-6 text-lg">{service.description}</p>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-blue-800 mb-2">What We Guarantee</h2>
          <ul className="list-disc pl-6 text-blue-900">
            {service.guarantees.length ? service.guarantees.map((g, i) => <li key={i}>{g}</li>) : <li>Quality, originality, and on-time delivery.</li>}
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-blue-800 mb-2">Customer Reviews</h2>
          <div className="space-y-4">
            {service.reviews.length ? service.reviews.map((r, i) => (
              <div key={i} className="bg-white rounded-xl shadow p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-blue-900">{r.name}</span>
                  <span className="text-yellow-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                </div>
                <div className="text-blue-900">"{r.text}"</div>
              </div>
            )) : <div className="text-blue-700">No reviews yet for this service.</div>}
          </div>
        </section>
        {/* Order Price Calculator below the Order button, normal flow */}
        {showCalculator && (
          <div className="fixed z-40 right-2 md:right-8 top-1/2 w-[95vw] max-w-xs md:max-w-sm lg:max-w-xs px-2 md:px-0" style={{ transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <div className="pointer-events-auto shadow-2xl rounded-2xl bg-white/95 md:bg-gradient-to-br md:from-blue-50 md:via-white md:to-blue-100 border border-blue-100">
              <OrderPriceCalculator onProceed={handleCalculatorProceed} />
            </div>
          </div>
        )}
      </main>
      <LandingFooter />
    </div>
  );
}
