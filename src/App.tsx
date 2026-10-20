import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, 
  X, 
  Send, 
  AlertTriangle, 
  Trash2, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  MessageCircle, 
  Sparkles,
  RefreshCw,
  Terminal,
  ExternalLink,
  Shield,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Settings,
  Star,
  Quote,
  ArrowLeft,
  ArrowRight,
  LayoutGrid,
  Sliders,
  Calculator,
  Search,
  BookOpen,
  Calendar,
  Mail,
  Share2,
  Twitter,
  Linkedin,
  CreditCard,
  Printer,
  Eye,
  Bookmark,
  Percent,
  GraduationCap,
  Award,
  BarChart3,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Brain,
  Timer,
  Copy,
  Music,
  Youtube,
  Disc,
  Volume2,
  VolumeX,
  Mic,
  Palette,
  GripVertical,
  Sun,
  Moon,
  Bot
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Message, ServiceItem, FAQItem, TestimonialItem, AcademicTip, BookedTask } from "./types";
import { ConfettiExplosion } from "./components/ConfettiExplosion";
import { AutomationStudioModal } from "./components/AutomationStudioModal";

// Testimonials Data
const testimonialsData: TestimonialItem[] = [
  {
    id: "t1",
    name: "Reza F.",
    major: "Informatika",
    university: "Univ. Mercu Buana",
    service: "Coding Project / App",
    rating: 5,
    comment: "Gila keren banget! Tugas web programming dapet nilai A sempurna. Pengerjaan rapi, source code bersih, dan ramah banget pas diajarin cara running manual-nya via Zoom. Sangat recommended buat yang lagi stuck tugas coding!",
    date: "Kemarin",
    helpfulCount: 42
  },
  {
    id: "t2",
    name: "Aisyah N.",
    major: "Akuntansi",
    university: "Univ. Indonesia",
    service: "Skripsi Bab 1-5 Lengkap",
    rating: 5,
    comment: "Sangat membantu buat skripsi saya yang sempat stuck berbulan-bulan. Tim bimbingannya responsif banget, kalau ada revisi dosen malam-malam langsung dibantu benerin. Selesai tepat waktu dan akhirnya lolos sidang skripsi!",
    date: "3 hari yang lalu",
    helpfulCount: 35
  },
  {
    id: "t3",
    name: "Dimas S.",
    major: "Manajemen",
    university: "Univ. Diponegoro",
    service: "Makalah & Esai",
    rating: 5,
    comment: "Ngerjain makalah dan PPT di sini bener-bener satset langsung beres. Harganya bersahabat buat kantong mahasiswa, referensi jurnal yang dipakai kredibel dan originalitasnya tinggi (bebas plagiarisme turnitin). Makasih min!",
    date: "1 minggu yang lalu",
    helpfulCount: 28
  },
  {
    id: "t4",
    name: "Indah P.",
    major: "Biologi",
    university: "Univ. Padjadjaran",
    service: "Laporan Praktikum",
    rating: 5,
    comment: "Laporan praktikum biologi saya dapet nilai tertinggi di kelas! Pembahasannya mendalam banget sampai didukung studi literatur terbaru. Gak nyesel sama sekali, bakal langganan terus nih buat semester depan.",
    date: "2 minggu yang lalu",
    helpfulCount: 19
  },
  {
    id: "t5",
    name: "Farhan W.",
    major: "Sistem Informasi",
    university: "Univ. Bina Nusantara",
    service: "UI/UX Design Figma",
    rating: 5,
    comment: "Desain Figma UI/UX untuk tugas akhir kelompok kami dapet pujian dari dosen penguji karena estetik dan interaktif. Prototyping-nya rapi banget dan mudah dipahami. CS-nya juga sabar nerima masukan revisi kelompok.",
    date: "3 minggu yang lalu",
    helpfulCount: 24
  }
];

export default function App() {
  // Navigation states
  const [activeTab, setActiveTab] = useState<"konsultasi" | "order">("konsultasi");

  // Form states - Konsultasi
  const [cNama, setCNama] = useState("");
  const [cTxt, setCTxt] = useState("");

  // Form states - Order
  const [oNama, setONama] = useState("");
  const [oSvc, setOSvc] = useState("");
  const [oDetail, setODetail] = useState("");
  const [oDl, setODl] = useState("");

  // UI state feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // FAQ Accordion states
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [highlightedFaq, setHighlightedFaq] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["Proses Pengerjaan", "Pembayaran", "Keamanan"]);
  const [activeFaqCategory, setActiveFaqCategory] = useState<string>("Semua");
  const [faqTone, setFaqTone] = useState<"formal" | "bestie">("formal");

  // FAQ Feedback state
  const [faqHelpfulVotes, setFaqHelpfulVotes] = useState<{ [key: string]: number }>({
    "Berapa lama pengerjaan tugas?": 42,
    "Apakah data dan identitas saya aman?": 128,
    "Apakah ada garansi revisi?": 85,
    "Bagaimana mekanisme pembayarannya?": 64,
    "Apakah hasilnya murni original dan bebas plagiat?": 97,
    "Bisa pesan jika tgl deadline besok pagi (rush order)?": 53,
    "Apakah ada biaya tambahan di tengah proses pengerjaan?": 31,
    "Bagaimana jika tugas gagal diselesaikan atau tidak sesuai kesepakatan?": 76,
    "Apakah akun kampus atau e-learning saya aman jika pengerjaan membutuhkan login?": 110,
  });
  const [userFaqFeedback, setUserFaqFeedback] = useState<{ [key: string]: 'up' | 'down' | null }>({});
  const [faqSearchQuery, setFaqSearchQuery] = useState("");
  const [expandedAnswerTexts, setExpandedAnswerTexts] = useState<{ [key: string]: boolean }>({});
  const [faqLimit, setFaqLimit] = useState(10);
  const [focusFaq, setFocusFaq] = useState<FAQItem | null>(null);
  const [isFaqLoading, setIsFaqLoading] = useState<boolean>(true);
  const [loadedFaqAnswers, setLoadedFaqAnswers] = useState<{ [key: string]: boolean }>({});

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Tips state
  const [selectedTip, setSelectedTip] = useState<AcademicTip | null>(null);
  const [localTipLikes, setLocalTipLikes] = useState<{ [key: string]: number }>({});
  const [likedTips, setLikedTips] = useState<string[]>([]);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  // Testimonials states
  const [testimonialMode, setTestimonialMode] = useState<"slide" | "grid">("slide");
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [localHelpfulVotes, setLocalHelpfulVotes] = useState<{ [key: string]: number }>({});
  const [helpfulVoted, setHelpfulVoted] = useState<string[]>([]);

  // Price Estimator Calculator states
  const [calcService, setCalcService] = useState<string>("1");
  const [calcDifficulty, setCalcDifficulty] = useState<"mudah" | "sedang" | "sulit" | "sangat_sulit">("sedang");
  const [calcDeadline, setCalcDeadline] = useState<"cepat" | "normal" | "santai">("normal");
  const [calcVolume, setCalcVolume] = useState<number>(5);

  // New Upgrade States: Promo Code and Bookmark Systems
  const [promoCodeInput, setPromoCodeInput] = useState<string>("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  const [bookmarkedTips, setBookmarkedTips] = useState<string[]>([]);
  const [activeTipsTab, setActiveTipsTab] = useState<"all" | "saved">("all");

  // Target Akademik Widget States
  const [targetGrade, setTargetGrade] = useState<string>("A");
  const [targetSemester, setTargetSemester] = useState<string>("Semester Ganjil 2026/2027");
  const [bookedTasks, setBookedTasks] = useState<BookedTask[]>([
    { id: "task-1", name: "Esai Etika & Filsafat Ilmu", subject: "Filsafat", status: "completed", grade: "A", deadline: "2026-06-25" },
    { id: "task-2", name: "Laporan Praktikum Basis Data", subject: "Teknologi Informasi", status: "processing", grade: null, deadline: "2026-06-29" },
    { id: "task-3", name: "Analisis Jurnal Sistem Cerdas", subject: "Kecerdasan Buatan", status: "pending", grade: null, deadline: "2026-07-03" }
  ]);
  const [draggedTaskIndex, setDraggedTaskIndex] = useState<number | null>(null);
  const [newWidgetTaskName, setNewWidgetTaskName] = useState("");
  const [newWidgetTaskSubject, setNewWidgetTaskSubject] = useState("");
  const [newWidgetTaskDeadline, setNewWidgetTaskDeadline] = useState("");
  const [isAddingWidgetTask, setIsAddingWidgetTask] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<BookedTask | null>(null);
  const [confettiActive, setConfettiActive] = useState(false);
  const [taskSearchQuery, setTaskSearchQuery] = useState("");
  const [isAutomationOpen, setIsAutomationOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("tugas-theme");
    return (saved === "light" || saved === "dark") ? saved : "dark";
  });

  useEffect(() => {
    localStorage.setItem("tugas-theme", theme);
    if (theme === "light") {
      document.body.classList.add("light");
    } else {
      document.body.classList.remove("light");
    }
  }, [theme]);

  const filteredBookedTasks = bookedTasks.filter(task => {
    if (!taskSearchQuery.trim()) return true;
    const query = taskSearchQuery.toLowerCase();
    return (
      task.name.toLowerCase().includes(query) ||
      task.subject.toLowerCase().includes(query)
    );
  });

  // --- Niraa AI Study Hub States ---
  const [studyHubTab, setStudyHubTab] = useState<"topic" | "gpa" | "pomodoro" | "planner" | "flashcards">("topic");
  
  // Topic Generator
  const [topicMajor, setTopicMajor] = useState<string>("Teknik Informatika");
  const [topicType, setTopicType] = useState<string>("Skripsi / Tugas Akhir");
  const [topicKeyword, setTopicKeyword] = useState<string>("");
  const [topicResult, setTopicResult] = useState<string>("");
  const [isGeneratingTopic, setIsGeneratingTopic] = useState<boolean>(false);

  // AI Flashcards States
  const [flashcardSubject, setFlashcardSubject] = useState<string>("");
  const [flashcardMaterial, setFlashcardMaterial] = useState<string>("");
  const [flashcards, setFlashcards] = useState<{ id: string; question: string; answer: string; mastered?: boolean }[]>([
    { id: "fc-init-1", question: "Apa perbedaan utama antara Client-Server dan Peer-to-Peer?", answer: "Client-Server bergantung pada server pusat untuk data; sedangkan Peer-to-Peer (P2P) mendistribusikan data secara merata ke seluruh node kakk.", mastered: false },
    { id: "fc-init-2", question: "Apa itu teknik 'Active Recall' dalam belajar?", answer: "Metode menguji ingatan secara aktif melalui pertanyaan (seperti flashcard), bukan sekadar membaca ulang materi, agar sinapsis otak makin kuat kakk! 🧠", mastered: false },
    { id: "fc-init-3", question: "Bagaimana cara memilih model Gemini yang tepat untuk belajarku kakk?", answer: "Gunakan Gemini 3.5 Flash untuk respons yang sangat cepat, cerdas, kreatif, dan asyik untuk menemani belajar harianmu kakk! ✨", mastered: false }
  ]);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState<boolean>(false);

  // AI Study Planner States
  const [plannerSubject, setPlannerSubject] = useState<string>("");
  const [plannerGoal, setPlannerGoal] = useState<string>("Belajar Ujian Akhir Semester (UAS)");
  const [plannerDuration, setPlannerDuration] = useState<string>("7");
  const [plannerResult, setPlannerResult] = useState<string>("");
  const [isGeneratingPlanner, setIsGeneratingPlanner] = useState<boolean>(false);

  // Platform Changelog Active Tab State
  const [changelogActiveTab, setChangelogActiveTab] = useState<"logs" | "roadmap" | "wishlist">("logs");

  // Platform Changelog Wishlist States
  const [wishlistTitle, setWishlistTitle] = useState("");
  const [wishlistCategory, setWishlistCategory] = useState("Fitur Baru");
  const [wishlistItems, setWishlistItems] = useState([
    { id: "wish-1", title: "Integrasi AI Flashcards otomatis dari materi slide kuliah kakk 📚", category: "Peralatan Belajar", votes: 142, voted: false },
    { id: "wish-2", title: "Grup belajar peer-to-peer real-time sesama mahasiswa TugasKu 🌐", category: "Sosial & Kolaborasi", votes: 98, voted: false },
    { id: "wish-3", title: "Koneksi Google Calendar untuk notifikasi otomatis tenggat waktu tugas 📅", category: "Integrasi", votes: 75, voted: false },
    { id: "wish-4", title: "Mode Gelap Malam Otomatis berbasis sensor waktu / lokasi 🌙", category: "UI & Desain", votes: 44, voted: false }
  ]);
  
  // GPA Planner
  const [gpaCurrent, setGpaCurrent] = useState<string>("3.20");
  const [gpaTarget, setGpaTarget] = useState<string>("3.50");
  const [gpaSksPrev, setGpaSksPrev] = useState<string>("60");
  const [gpaSksCurrent, setGpaSksCurrent] = useState<string>("18");
  const [gpaCourses, setGpaCourses] = useState<{ id: string; name: string; sks: number; grade: string }[]>([
    { id: "1", name: "Matematika Diskrit", sks: 3, grade: "A" },
    { id: "2", name: "Pemrograman Web", sks: 4, grade: "A" },
    { id: "3", name: "Struktur Data", sks: 3, grade: "B" },
    { id: "4", name: "Bahasa Inggris Teknis", sks: 2, grade: "A" },
  ]);
  const [newCourseName, setNewCourseName] = useState<string>("");
  const [newCourseSks, setNewCourseSks] = useState<number>(3);
  const [newCourseGrade, setNewCourseGrade] = useState<string>("A");
  
  // Pomodoro Timer
  const [pomoMode, setPomoMode] = useState<"work" | "short" | "long">("work");
  const [pomoSeconds, setPomoSeconds] = useState<number>(25 * 60);
  const [isPomoRunning, setIsPomoRunning] = useState<boolean>(false);

  // Pomodoro timer effect
  useEffect(() => {
    let interval: any = null;
    if (isPomoRunning && pomoSeconds > 0) {
      interval = setInterval(() => {
        setPomoSeconds((prev) => prev - 1);
      }, 1000);
    } else if (pomoSeconds === 0) {
      setIsPomoRunning(false);
      if (pomoMode === "work") {
        showToast("Sesi belajar selesai! Waktunya istirahat, bestie! ☕🌸");
        setPomoMode("short");
        setPomoSeconds(5 * 60);
      } else {
        showToast("Istirahat selesai! Yuk mulai fokus lagi belajar! 🔥💻");
        setPomoMode("work");
        setPomoSeconds(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isPomoRunning, pomoSeconds, pomoMode]);

  // Trigger confetti automatically when progress is 100%
  useEffect(() => {
    const total = bookedTasks.length;
    if (total === 0) return;
    const completed = bookedTasks.filter(t => t.status === "completed").length;
    const processing = bookedTasks.filter(t => t.status === "processing").length;
    const percent = Math.round(((completed * 100) + (processing * 50)) / (total * 100) * 100);

    if (percent === 100) {
      setConfettiActive(true);
      // Turn off confetti after a delay so it can be re-triggered
      const timer = setTimeout(() => {
        setConfettiActive(false);
      }, 4500);
      return () => clearTimeout(timer);
    } else {
      setConfettiActive(false);
    }
  }, [bookedTasks]);

  // FAQ Visual Analytics States
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [faqViews, setFaqViews] = useState<{ [key: string]: number }>({
    "Berapa lama pengerjaan tugas?": 245,
    "Apakah data dan identitas saya aman?": 482,
    "Apakah ada garansi revisi?": 320,
    "Bagaimana mekanisme pembayarannya?": 395,
    "Apakah hasilnya murni original dan bebas plagiat?": 412,
    "Bisa pesan jika tgl deadline besok pagi (rush order)?": 289,
    "Apakah ada biaya tambahan di tengah proses pengerjaan?": 198,
    "Bagaimana jika tugas gagal diselesaikan atau tidak sesuai kesepakatan?": 354,
    "Apakah akun kampus atau e-learning saya aman jika pengerjaan membutuhkan login?": 267,
    "Apakah ada diskon jika memesan beberapa tugas sekaligus?": 213,
    "Bagaimana cara memantau progres pengerjaan tugas saya?": 185,
    "Apakah TugasKu menerima pengerjaan tugas dalam bahasa Inggris?": 150
  });

  // Service base price map
  const serviceBasePrices: { [key: string]: number } = {
    "1": 50000,   // Makalah & Esai
    "2": 75000,   // Laporan Praktikum
    "3": 100000,  // Presentasi & PPT
    "4": 250000,  // Proposal Seminar
    "5": 500000,  // Skripsi Bab 1-5 Lengkap
    "6": 350000,  // Landing Page / Website
    "7": 400000,  // UI/UX Design Figma
    "8": 500000,  // Coding Project / App
  };

  // Helper to calculate dynamic estimate before discounts
  const getRawCalculatorEstimate = () => {
    const basePrice = serviceBasePrices[calcService] || 50000;
    
    // Difficulty multiplier
    const difficultyMult = {
      mudah: 0.85,
      sedang: 1.0,
      sulit: 1.25,
      sangat_sulit: 1.5
    }[calcDifficulty];

    // Deadline multiplier
    const deadlineMult = {
      cepat: 1.3,
      normal: 1.0,
      santai: 0.9
    }[calcDeadline];

    // Volume factor
    const volumeMult = 1 + (calcVolume - 1) * 0.12;

    const estimatedPrice = Math.round(basePrice * difficultyMult * deadlineMult * volumeMult);

    // Rounded to nearest thousand
    return Math.ceil(estimatedPrice / 1000) * 1000;
  };

  // Helper to calculate dynamic estimate (with any applied promo code)
  const getCalculatorEstimate = () => {
    const rawPrice = getRawCalculatorEstimate();
    if (!appliedPromo) return rawPrice;

    const discountFactor = {
      NIRAABESTIE: 0.85,
      SKRIPSION: 0.80,
      MAHASISWABARU: 0.90
    }[appliedPromo.toUpperCase()] || 1.0;

    const discounted = Math.round(rawPrice * discountFactor);

    // Rounded to nearest thousand
    return Math.ceil(discounted / 1000) * 1000;
  };

  const getCustomEstimateForDeadline = (deadlineType: "santai" | "normal" | "cepat") => {
    const basePrice = serviceBasePrices[calcService] || 50000;
    const difficultyMult = {
      mudah: 0.85,
      sedang: 1.0,
      sulit: 1.25,
      sangat_sulit: 1.5
    }[calcDifficulty];
    const deadlineMult = {
      cepat: 1.3,
      normal: 1.0,
      santai: 0.9
    }[deadlineType];
    const volumeMult = 1 + (calcVolume - 1) * 0.12;
    const estimatedPrice = Math.round(basePrice * difficultyMult * deadlineMult * volumeMult);
    return Math.ceil(estimatedPrice / 1000) * 1000;
  };

  const getVolumeLabel = () => {
    if (["1", "2", "4"].includes(calcService)) return "Jumlah Halaman";
    if (calcService === "3") return "Jumlah Slide";
    if (calcService === "5") return "Jumlah Bab";
    if (["6", "7", "8"].includes(calcService)) return "Halaman / Fitur Utama";
    return "Volume / Unit";
  };

  // Chatbot states
  const [chatOpen, setChatOpen] = useState(false);
  const [chatResponseStyle, setChatResponseStyle] = useState<"bestie" | "professional">("bestie");
  const [aiModel, setAiModel] = useState<string>("gemini-3.5-flash");
  const [voiceMode, setVoiceMode] = useState<"off" | "local" | "gemini">("local");
  const [voiceRate, setVoiceRate] = useState<number>(1.05);
  const [voicePitch, setVoicePitch] = useState<number>(1.0);
  const [autoReadNotif, setAutoReadNotif] = useState<boolean>(true);
  const [showVoiceSettings, setShowVoiceSettings] = useState<boolean>(false);
  const [geminiVoice, setGeminiVoice] = useState<string>("Kore");
  const [localVoiceURI, setLocalVoiceURI] = useState<string>("");
  const [availableLocalVoices, setAvailableLocalVoices] = useState<any[]>([]);
  const [playingMessageIndex, setPlayingMessageIndex] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hai kak! Aku **Niraaa** dari TugasKu, Virtual Bestie-mu yang paling asyik! 🥳✨\n\nDi sini kakak bebas mau curhat penderitaan tugas, ngobrol santai, nanya-nanya harga, nggosipin dosen killer, atau bercanda juga boleeeh bangeet wkwk 🤣. Tenang aja, aku nggak bakal maksa kakak langsung order kok. Yuk, mau curhat atau tanya apa hari ini? 🙈"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [chatNotif, setChatNotif] = useState(true);

  // API Gateway Live Tracer State (100% Free & Self-Hosted Metrics)
  const [gatewayOpen, setGatewayOpen] = useState(false);
  const [gatewayStats, setGatewayStats] = useState({
    totalRequests: 0,
    blockedRequests: 0,
    averageLatencyMs: 250,
    circuitBreakerState: "CLOSED",
    activeRateLimits: 0,
    uptime: 0,
    status: "HEALTHY"
  });

  const msgsEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const WHATSAPP_NUMBER = "6285693009756";

  // Auto scroll to chat bottom safely
  useEffect(() => {
    try {
      if (msgsEndRef.current) {
        msgsEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } catch (e) {
      console.warn("Smooth scroll not supported or blocked in iframe context:", e);
    }
  }, [messages, isTyping]);

  // Load metrics from Free API Gateway actively and clean up properly
  useEffect(() => {
    let active = true;
    const fetchGatewayStats = async () => {
      try {
        const res = await fetch("/api/gateway/stats");
        if (res.ok) {
          const data = await res.json();
          if (active) {
            setGatewayStats(data);
          }
        }
      } catch (err) {
        console.warn("API Gateway stats not loaded yet:", err);
      }
    };
    fetchGatewayStats();
    // Poll stats every 5 seconds to provide ultra low latency feedback
    const interval = setInterval(fetchGatewayStats, 5000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [chatOpen, isTyping]);

  // Show notification badge
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!chatOpen) setChatNotif(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, [chatOpen]);

  // Testimonials Auto-Slide logic
  useEffect(() => {
    if (testimonialMode !== "slide") return;
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) => 
        prevIndex === testimonialsData.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonialMode, testimonialsData.length]);

  // Simulate initial FAQ loading state on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFaqLoading(false);
    }, 1100); // 1.1 seconds realistic initial load
    return () => clearTimeout(timer);
  }, []);

  // Simulate quick FAQ loading on category changes
  useEffect(() => {
    setIsFaqLoading(true);
    const timer = setTimeout(() => {
      setIsFaqLoading(false);
    }, 550); // 550ms quick loading transition
    return () => clearTimeout(timer);
  }, [activeFaqCategory]);

  // Simulate quick FAQ loading on search queries
  useEffect(() => {
    if (faqSearchQuery) {
      setIsFaqLoading(true);
      const timer = setTimeout(() => {
        setIsFaqLoading(false);
      }, 450); // 450ms search debounce-like loading feedback
      return () => clearTimeout(timer);
    }
  }, [faqSearchQuery]);

  // Automatically trigger lazy loading of FAQ answer when expanded
  useEffect(() => {
    if (expandedFaq && !loadedFaqAnswers[expandedFaq]) {
      const timer = setTimeout(() => {
        setLoadedFaqAnswers(prev => ({ ...prev, [expandedFaq]: true }));
      }, 650); // 650ms answer preparing loading state
      return () => clearTimeout(timer);
    }
  }, [expandedFaq, loadedFaqAnswers]);

  // Handle FAQ item click/expand toggle safely
  const handleFaqExpand = (question: string) => {
    const isExpanding = expandedFaq !== question;
    setExpandedFaq(isExpanding ? question : null);
    if (isExpanding) {
      setFaqViews(prev => ({
        ...prev,
        [question]: (prev[question] || 0) + 1
      }));
    }
  };

  // Helper: Open WhatsApp safely
  const openWhatsApp = (msg: string) => {
    try {
      const encoded = encodeURIComponent(msg);
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
      const newTab = window.open(url, "_blank", "noopener,noreferrer");
      if (!newTab || newTab.closed || typeof newTab.closed === "undefined") {
        console.warn("Pop-up blocked or failed to open; falling back to direct redirect.");
        window.location.href = url;
      }
    } catch (e) {
      console.error("Failed to open WhatsApp popup safely:", e);
      try {
        const encoded = encodeURIComponent(msg);
        window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
      } catch (err) {
        console.error("All fallback navigation directions failed.", err);
      }
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handlePrintFaq = () => {
    if (finalFaqs.length === 0) {
      showToast("Tidak ada pertanyaan untuk dicetak.");
      return;
    }

    const categories = ["Proses Pengerjaan", "Pembayaran", "Keamanan"];
    let faqsByCatHtml = "";

    categories.forEach(cat => {
      const faqsInCat = finalFaqs.filter(f => f.category === cat);
      if (faqsInCat.length > 0) {
        faqsByCatHtml += `
          <div class="faq-category">
            <div class="category-title">${cat}</div>
            ${faqsInCat.map(f => `
              <div class="faq-item">
                <div class="question">Q: ${f.question}</div>
                <div class="answer">${f.answer}</div>
              </div>
            `).join('')}
          </div>
        `;
      }
    });

    const printHtml = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FAQ TugasKu - Versi Cetak</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          body {
            font-family: 'Inter', sans-serif;
            color: #0f172a;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background-color: #ffffff;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .header {
            border-bottom: 2px solid #00E57A;
            padding-bottom: 20px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .brand {
            font-size: 24px;
            font-weight: 700;
            color: #0f172a;
          }
          .brand span {
            color: #00E57A;
          }
          .subtitle {
            font-size: 13px;
            color: #64748b;
            margin-top: 4px;
          }
          .print-btn {
            background-color: #00E57A;
            color: #ffffff;
            border: none;
            padding: 10px 18px;
            font-family: inherit;
            font-weight: 600;
            font-size: 13px;
            border-radius: 8px;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s ease;
            box-shadow: 0 4px 12px rgba(0, 229, 122, 0.2);
          }
          .print-btn:hover {
            background-color: #00ca6d;
            transform: translateY(-1px);
            box-shadow: 0 6px 16px rgba(0, 229, 122, 0.3);
          }
          .faq-category {
            margin-top: 25px;
            margin-bottom: 15px;
          }
          .category-title {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #00ca6d;
            background: rgba(0, 229, 122, 0.08);
            padding: 6px 12px;
            border-radius: 6px;
            display: inline-block;
            margin-bottom: 15px;
          }
          .faq-item {
            margin-bottom: 20px;
            page-break-inside: avoid;
          }
          .question {
            font-size: 15px;
            font-weight: 600;
            color: #0f172a;
            margin-bottom: 6px;
            display: flex;
            gap: 6px;
          }
          .answer {
            font-size: 14px;
            color: #475569;
            line-height: 1.6;
            padding-left: 14px;
            border-left: 3px solid #00E57A;
            margin-left: 4px;
          }
          .footer {
            margin-top: 50px;
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
            font-size: 11px;
            color: #94a3b8;
            display: flex;
            justify-content: space-between;
          }
          @media print {
            body {
              padding: 0;
            }
            .print-btn {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">Tugas<span>Ku</span></div>
            <div class="subtitle">Daftar Tanya Jawab Umum (FAQ) Resmi • ${finalFaqs.length} Item</div>
          </div>
          <button class="print-btn" onclick="window.print()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            Cetak Dokumen
          </button>
        </div>

        ${faqsByCatHtml}

        <div class="footer">
          <div>Dokumen resmi TugasKu • Dicetak pada ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          <div>TugasKu Akademik & Digital Services</div>
        </div>
      </body>
      </html>
    `;

    try {
      const blob = new Blob([printHtml], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const printWindow = window.open(url, "_blank");
      if (printWindow) {
        showToast("Halaman cetak FAQ berhasil dibuka di tab baru! 🖨️");
      } else {
        showToast("Gagal membuka tab baru. Pastikan pop-up blocker Anda dinonaktifkan. ⚠️");
      }
    } catch (err) {
      console.error("Error printing FAQ:", err);
      showToast("Gagal menyiapkan dokumen cetak. Silakan coba lagi.");
    }
  };

  const handleLikeTip = (tipId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (likedTips.includes(tipId)) {
      showToast("Anda sudah menyukai tips ini! 😊");
      return;
    }
    setLikedTips([...likedTips, tipId]);
    setLocalTipLikes(prev => ({
      ...prev,
      [tipId]: (prev[tipId] || 0) + 1
    }));
    showToast("Terima kasih! Dukungan Anda terhadap tips Niraa AI telah tercatat. ❤️");
  };

  const handleToggleBookmarkTip = (tipId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (bookmarkedTips.includes(tipId)) {
      setBookmarkedTips(bookmarkedTips.filter(id => id !== tipId));
      showToast("Tips dihapus dari daftar simpanan Anda. 📥");
    } else {
      setBookmarkedTips([...bookmarkedTips, tipId]);
      showToast("Tips berhasil disimpan! Anda bisa membacanya kapan saja di tab 'Disimpan'. 💾❤️");
    }
  };

  const handleHelpfulVote = (testimonialId: string) => {
    if (helpfulVoted.includes(testimonialId)) {
      setHelpfulVoted(helpfulVoted.filter(id => id !== testimonialId));
      setLocalHelpfulVotes(prev => ({
        ...prev,
        [testimonialId]: (prev[testimonialId] || 0) - 1
      }));
      showToast("Batal menyukai ulasan ini.");
    } else {
      setHelpfulVoted([...helpfulVoted, testimonialId]);
      setLocalHelpfulVotes(prev => ({
        ...prev,
        [testimonialId]: (prev[testimonialId] || 0) + 1
      }));
      showToast("Terima kasih! Dukungan Anda membantu calon pengguna lain. 👍");
    }
  };

  const handleFaqFeedback = (question: string, choice: 'up' | 'down') => {
    const currentChoice = userFaqFeedback[question] || null;

    if (choice === 'up') {
      if (currentChoice === 'up') {
        // Cancel upvote
        setUserFaqFeedback(prev => ({ ...prev, [question]: null }));
        setFaqHelpfulVotes(prev => ({
          ...prev,
          [question]: Math.max(0, (prev[question] || 0) - 1)
        }));
        showToast("Batal menyukai jawaban ini. ↩️");
      } else {
        // Was down or null -> now up
        const wasDown = currentChoice === 'down';
        setUserFaqFeedback(prev => ({ ...prev, [question]: 'up' }));
        setFaqHelpfulVotes(prev => ({
          ...prev,
          [question]: (prev[question] || 0) + 1
        }));
        showToast("Terima kasih! Jawaban dinilai membantu. 👍");
      }
    } else {
      if (currentChoice === 'down') {
        // Cancel downvote
        setUserFaqFeedback(prev => ({ ...prev, [question]: null }));
        showToast("Batal memberikan penilaian negatif. ↩️");
      } else {
        // Was up or null -> now down
        const wasUp = currentChoice === 'up';
        setUserFaqFeedback(prev => ({ ...prev, [question]: 'down' }));
        if (wasUp) {
          setFaqHelpfulVotes(prev => ({
            ...prev,
            [question]: Math.max(0, (prev[question] || 0) - 1)
          }));
        }
        showToast("Masukan dicatat. Terima kasih atas umpan balik Anda! 📝");
      }
    }
  };
  
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      showToast("Mohon masukkan alamat email Anda.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail.trim())) {
      showToast("Format email tidak valid. Silakan periksa kembali.");
      return;
    }
    setNewsletterLoading(true);
    setTimeout(() => {
      setNewsletterLoading(false);
      setNewsletterSubscribed(true);
      showToast("Berhasil berlangganan! Selamat bergabung dengan komunitas belajar Niraa AI. 🚀");
    }, 1200);
  };

  // Google/Apple Calendar ICS File Exporter
  const handleExportICS = () => {
    if (bookedTasks.length === 0) {
      showToast("Belum ada tugas akademik untuk diekspor kakk! 📅");
      return;
    }

    let icsContent = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//TugasKu//Niraa AI Study Companion//EN\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\n";

    bookedTasks.forEach((task) => {
      const id = task.id;
      const title = `[TugasKu] ${task.name} (${task.subject})`;
      const description = `Tugas akademik Anda terpantau di Dashboard TugasKu kakk.\n\nMata Kuliah: ${task.subject}\nStatus: ${task.status === "completed" ? "Selesai" : task.status === "processing" ? "Proses" : "Belum Dikerjakan"}\n\nSemangat belajarnya, kakk! Niraa selalu menemani perjalanan suksesmu! 🌸`;
      
      // Use the specified deadline date or default to 3 days from now
      let deadlineDateStr = task.deadline || "";
      if (!deadlineDateStr) {
        const d = new Date();
        d.setDate(d.getDate() + 3);
        deadlineDateStr = d.toISOString().split("T")[0];
      }

      // Format YYYYMMDD
      const cleanDate = deadlineDateStr.replace(/-/g, "");
      // Event start (e.g. 09:00 AM) and end (e.g. 10:00 AM) in UTC
      const dtStart = `${cleanDate}T020000Z`; // 9:00 AM WIB (UTC+7) is 02:00 AM UTC
      const dtEnd = `${cleanDate}T030000Z`;

      icsContent += "BEGIN:VEVENT\r\n";
      icsContent += `UID:${id}@tugasku.co.id\r\n`;
      icsContent += `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z\r\n`;
      icsContent += `DTSTART:${dtStart}\r\n`;
      icsContent += `DTEND:${dtEnd}\r\n`;
      icsContent += `SUMMARY:${title}\r\n`;
      icsContent += `DESCRIPTION:${description.replace(/\n/g, "\\n")}\r\n`;
      icsContent += "STATUS:CONFIRMED\r\n";
      icsContent += "SEQUENCE:0\r\n";
      icsContent += "BEGIN:VALARM\r\n";
      icsContent += "TRIGGER:-PT12H\r\n"; // Alarm 12 hours before
      icsContent += "ACTION:DISPLAY\r\n";
      icsContent += "DESCRIPTION:Pengingat Tenggat Waktu TugasKu kakk\r\n";
      icsContent += "END:VALARM\r\n";
      icsContent += "END:VEVENT\r\n";
    });

    icsContent += "END:VCALENDAR\r\n";

    try {
      const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Tenggat_Waktu_TugasKu_${targetSemester.replace(/[\s\/]/g, "_")}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast("Berhasil mengekspor kalender! Silakan impor file .ics ini langsung ke Google Calendar atau Apple Calendar kakak! 📅✨");
    } catch (err) {
      console.error(err);
      showToast("Gagal memproses file ekspor kalender kakk.");
    }
  };

  // Feature Wishlist Handlers
  const handleWishlistVote = (id: string) => {
    setWishlistItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const alreadyVoted = item.voted;
          showToast(
            alreadyVoted
              ? "Batal memberikan suara untuk fitur ini. 🗳️"
              : "Terima kasih! Suara kamu berhasil dicatat untuk fitur ini kakk! 🗳️✨"
          );
          return {
            ...item,
            votes: alreadyVoted ? item.votes - 1 : item.votes + 1,
            voted: !alreadyVoted
          };
        }
        return item;
      })
    );
  };

  const handleAddWishlistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishlistTitle.trim()) {
      showToast("Tulis ide fitur yang ingin kamu usulkan ya, kakk! 💡");
      return;
    }
    const newItem = {
      id: `wish-${Date.now()}`,
      title: wishlistTitle.trim(),
      category: wishlistCategory,
      votes: 1,
      voted: true
    };
    setWishlistItems(prev => [newItem, ...prev]);
    setWishlistTitle("");
    showToast("Usulan fiturmumu sukses dikirim! Terima kasih ya bestie sudah bantu TugasKu berkembang! 🌸✨");
  };

  // Form Submission - Konsultasi
  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cNama.trim().length < 3) {
      showToast("Mohon masukkan nama lengkap Anda (minimal 3 karakter).");
      return;
    }
    if (cTxt.trim().length < 10) {
      showToast("Mohon jelaskan secara detail kebutuhan Anda (minimal 10 karakter).");
      return;
    }
    const template = `Halo Admin TugasKu 👋\n\nNama: ${cNama.trim()}\nKebutuhan Konsultasi: ${cTxt.trim()}`;
    openWhatsApp(template);
    showToast("Pesan konsultasi disiapkan! Mengarahkan ke WhatsApp...");
    setCNama("");
    setCTxt("");
  };

  // Form Submission - Order
  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (oNama.trim().length < 3) {
      showToast("Mohon masukkan nama lengkap Anda (minimal 3 karakter).");
      return;
    }
    if (!oSvc) {
      showToast("Mohon pilih jenis layanan terlebih dahulu.");
      return;
    }
    if (oDetail.trim().length < 15) {
      showToast("Mohon jelaskan spesifikasi detail tugas Anda (minimal 15 karakter).");
      return;
    }
    if (!oDl) {
      showToast("Mohon tentukan tanggal deadline pengumpulan tugas.");
      return;
    }

    const formattedDate = new Date(oDl).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    const template = `Halo Admin TugasKu 👋\n\n*PESANAN BARU*\nNama: ${oNama.trim()}\nLayanan: ${oSvc}\nDetail Tugas: ${oDetail.trim()}\nDeadline: ${formattedDate}`;
    
    // Add to Booked Tasks list
    const newTask: BookedTask = {
      id: "booked-" + Date.now(),
      name: oDetail.trim().substring(0, 32) + (oDetail.trim().length > 32 ? "..." : ""),
      subject: oSvc || "Tugas Akademik",
      status: "pending"
    };
    setBookedTasks(prev => [...prev, newTask]);

    openWhatsApp(template);
    showToast("Form pesanan siap! Mengarahkan ke WhatsApp...");
    setONama("");
    setOSvc("");
    setODetail("");
    setODl("");
  };

  // Coupon Handlers
  const handleApplyPromo = () => {
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) {
      setPromoError("Ketik kode promo dulu ya bestie! 💖");
      return;
    }

    const validCodes = ["NIRAABESTIE", "SKRIPSION", "MAHASISWABARU"];
    if (validCodes.includes(code)) {
      setAppliedPromo(code);
      setPromoError(null);
      
      const percent = code === "SKRIPSION" ? 20 : code === "NIRAABESTIE" ? 15 : 10;
      showToast(`Yeay! Kupon ${code} terpasang, dapet potongan ${percent}%! 🥳✨`);
    } else {
      setPromoError("Aduh bestie, kupon itu gak valid nih... Coba pakai kupon 'NIRAABESTIE' ya! 💖");
      showToast("Kupon tidak ditemukan 😭");
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCodeInput("");
    setPromoError(null);
    showToast("Kupon dilepas, harga kembali normal. 🌸");
  };

  // Calculator WhatsApp Submit
  const handleCalculatorWA = () => {
    const selectedSvcObj = servicesData.find(s => s.id === calcService);
    const svcName = selectedSvcObj ? selectedSvcObj.name : "Tugas Akademik";
    const difficultyLabel = {
      mudah: "Mudah (Ketikan Biasa / Rangkuman)",
      sedang: "Sedang (Analisis Standar / Studi Kasus)",
      sulit: "Sulit (Full Riset / Komprehensif)",
      sangat_sulit: "Sangat Sulit (Analisis Data / Coding)"
    }[calcDifficulty];
    const deadlineLabel = {
      cepat: "Cepat (1-2 Hari / Rush Order)",
      normal: "Normal (3-6 Hari)",
      santai: "Santai (>7 Hari)"
    }[calcDeadline];
    
    const rawPrice = getRawCalculatorEstimate();
    const finalPrice = getCalculatorEstimate();
    const formattedPrice = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(finalPrice);

    let promoDetails = "";
    if (appliedPromo) {
      const discountPercent = appliedPromo === "SKRIPSION" ? 20 : appliedPromo === "NIRAABESTIE" ? 15 : 10;
      const discountAmount = rawPrice - finalPrice;
      const formattedRaw = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(rawPrice);
      const formattedDiscount = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(discountAmount);
      
      promoDetails = `\n- *Kupon Promo*: ${appliedPromo} (-${discountPercent}%)\n- *Tarif Awal*: ~${formattedRaw}\n- *Potongan*: -${formattedDiscount}`;
    }

    const template = `Halo Admin TugasKu 👋\n\nSaya ingin memesan / konsultasi tugas dengan estimasi dari kalkulator:\n\n- *Layanan*: ${svcName}\n- *${getVolumeLabel()}*: ${calcVolume}\n- *Tingkat Kesulitan*: ${difficultyLabel}\n- *Deadline*: ${deadlineLabel}${promoDetails}\n- *Estimasi Tarif Akhir*: ~${formattedPrice}\n\nApakah bisa langsung dikerjakan oleh tim akademisi kakak? Terima kasih! 😊`;
    
    // Add to Booked Tasks list
    const newTask: BookedTask = {
      id: "calc-" + Date.now(),
      name: `Kalkulator: ${svcName} (${calcVolume} ${getVolumeLabel()})`,
      subject: svcName,
      status: "pending"
    };
    setBookedTasks(prev => [...prev, newTask]);

    openWhatsApp(template);
    showToast("Estimasi disiapkan! Mengarahkan ke WhatsApp...");
  };

  // FAQ Items Data
  const CASUAL_FAQ_ANSWERS: { [question: string]: string } = {
    "Berapa lama pengerjaan tugas?": "Tergantung tingkat kerumitan sih bestie! Biasanya tugas kuliah harian kelar 1-3 hari aja. Kalau skripsi atau tugas akhir yang butuh riset mendalam sekitar 7-21 hari. Tapi tenang aja, sebelum tim gerak, kita bakal sepakati deadline-nya biar kamu gak panik pas submit! 😉✨",
    "Apakah data dan identitas saya aman?": "Aman parah, no debat! Identitas kamu, judul tugas, sampai nama kampus bakal kita kunci rapat-rapat. Gak bakal ada yang bocor ke luar. Keamanan privasimu itu prioritas utama kita, bestie! 🔒🤫",
    "Apakah ada garansi revisi?": "Ada dong! Kamu dapet revisi gratis tanpa batas sampai hasilnya bener-bener pas di hati. Pokoknya kita tanggung jawab penuh sampai kamu dapet nilai yang memuaskan dan senyum lebar! 💖🔥",
    "Bagaimana mekanisme pembayarannya?": "Santuy, bisa dicicil kok! Kamu cukup bayar DP dulu mulai dari 50% lewat transfer bank atau e-wallet pilihanmu. Sisa pelunasannya nanti dikirim pas tugasnya udah beres dikerjakan dan kamu cek sendiri hasilnya. 💸🙌",
    "Apakah hasilnya murni original dan bebas plagiat?": "Orisinalitas anti plagiat itu janji suci kita! Semua tugas dibikin bener-bener dari nol oleh tim akademisi profesional kami, terus divalidasi ketat dulu biar gak ada plagiarisme. No copy-paste club! 📝💯",
    "Bisa pesan jika tgl deadline besok pagi (rush order)?": "Bisa banget, bestie! Kita punya tim gercep khusus 'Rush Order' buat penyelamatan darurat. Langsung chat WhatsApp sekarang juga, kirim detail tugasnya, dan biar kami yang begadang beresin semuanya! ⚡🏃‍♂️",
    "Apakah ada biaya tambahan di tengah proses pengerjaan?": "Nggak ada drama biaya tambahan tiba-tiba kok! Tarif yang disepakati di awal itu udah ALL-IN dan bersifat final. Kecuali kalau di tengah jalan kamu nambah request materi baru yang beda banget dari instruksi awal ya. 🤝",
    "Bagaimana jika tugas gagal diselesaikan atau tidak sesuai kesepakatan?": "Tenang, uangmu aman! Kalau tim kami terbukti gagal total beresin tugas sesuai kesepakatan dan deadline, atau setelah direvisi berkali-kali tetep gak sesuai, kami siap balikin dana kamu (refund). No tipu-tipu! 👍",
    "Apakah akun kampus atau e-learning saya aman jika pengerjaan membutuhkan login?": "Aman kok! Login kamu cuma bakal dipakai sama satu spesialis tepercaya yang megang tugasmu, dan dilindungi enkripsi. Tapi biar makin tenang, kamu bisa ganti password sementara sebelum dan sesudah pengerjaan kelar ya! 🎓🔑",
    "Apakah ada diskon jika memesan beberapa tugas sekaligus?": "Ada banget, yuk borong! Kita ada diskon bulk order sampai 15% buat kamu yang percayain banyak tugas sekaligus ke TugasKu. Pas banget buat patungan atau paket hemat akhir semester! 🤩🎉",
    "Bagaimana cara memantau progres pengerjaan tugas saya?": "Gampang banget, tinggal colek admin kita di WhatsApp aja! Kamu bisa nanya progres kapan aja dan tim kami dengan senang hati bakal spill draf berjalan biar kamu bisa tidur nyenyak. 📱💤",
    "Apakah TugasKu menerima pengerjaan tugas dalam bahasa Inggris?": "Yes, of course! Tim kita isinya akademisi bilingual keren yang fasih banget nulis karya ilmiah pakai bahasa Inggris atau bikin project coding berstandar internasional. English task? Easy peasy! 🇬🇧🎓"
  };

  const baseFaqData: FAQItem[] = [
    {
      question: "Berapa lama pengerjaan tugas?",
      answer: "Tergantung jenis dan tingkat kesulitannya. Tugas kuliah biasa diselesaikan dalam waktu 1–3 hari, sedangkan skripsi/tugas akhir berkisar 7–21 hari. Kami akan mengonfirmasi estimasi deadline sebelum pengerjaan dimulai agar Anda tetap aman.",
      category: "Proses Pengerjaan"
    },
    {
      question: "Apakah data dan identitas saya aman?",
      answer: "100% aman dan dirahasiakan rapat-rapat. TugasKu menjamin kerahasiaan identitas klien, judul tugas, dan universitas asal Anda. Tidak ada data yang dibagikan ke pihak luar.",
      category: "Keamanan"
    },
    {
      question: "Apakah ada garansi revisi?",
      answer: "Ya, revisi gratis tanpa batas sampai hasil tugas benar-benar sesuai dengan instruksi yang disepakati dari awal. Kami tidak akan melepas tanggung jawab sebelum Anda puas dengan hasilnya.",
      category: "Proses Pengerjaan"
    },
    {
      question: "Bagaimana mekanisme pembayarannya?",
      answer: "Pembayaran dapat dicicil (DP mulai dari 50% di awal) melalui transfer bank atau e-wallet setelah biaya disepakati. Pelunasan dilakukan setelah tugas selesai dikerjakan dan diverifikasi.",
      category: "Pembayaran"
    },
    {
      question: "Apakah hasilnya murni original dan bebas plagiat?",
      answer: "Sangat dijamin. Setiap materi makalah, project coding, atau skripsi dihasilkan dari nol secara orisinal oleh tim kami yang profesional dan divalidasi kualitasnya sebelum dikirim.",
      category: "Keamanan"
    },
    {
      question: "Bisa pesan jika tgl deadline besok pagi (rush order)?",
      answer: "Bisa kak! Kami memiliki opsi 'Rush Order' untuk penanganan prioritas super cepat. Silakan hubungi kami via WhatsApp secepatnya dengan menyertakan instruksi tugas.",
      category: "Proses Pengerjaan"
    },
    {
      question: "Apakah ada biaya tambahan di tengah proses pengerjaan?",
      answer: "Tidak ada biaya tersembunyi. Semua tarif yang disepakati di awal bersifat final, kecuali jika ada permintaan tambahan materi atau perubahan instruksi yang signifikan di tengah jalan.",
      category: "Pembayaran"
    },
    {
      question: "Bagaimana jika tugas gagal diselesaikan atau tidak sesuai kesepakatan?",
      answer: "Kami menawarkan garansi pengembalian dana (refund) jika tim kami terbukti gagal menyerahkan tugas sesuai spesifikasi dan batas waktu yang disepakati, atau setelah revisi maksimal tetap tidak memenuhi kriteria awal.",
      category: "Pembayaran"
    },
    {
      question: "Apakah akun kampus atau e-learning saya aman jika pengerjaan membutuhkan login?",
      answer: "Tentu saja. Akses login Anda hanya digunakan oleh satu spesialis yang ditugaskan dan dilindungi enkripsi. Kami sangat menyarankan Anda mengganti password sementara sebelum dan sesudah pengerjaan demi kenyamanan bersama.",
      category: "Keamanan"
    },
    {
      question: "Apakah ada diskon jika memesan beberapa tugas sekaligus?",
      answer: "Ya, tentu saja! Kami menyediakan diskon paket pengerjaan atau diskon bulk order hingga 15% jika Anda mempercayakan beberapa tugas sekaligus ke TugasKu. Hubungi admin kami untuk harga paket spesial.",
      category: "Pembayaran"
    },
    {
      question: "Bagaimana cara memantau progres pengerjaan tugas saya?",
      answer: "Anda dapat memantau progres pengerjaan kapan saja secara real-time melalui admin WhatsApp kami. Tim kami akan dengan senang hati mengirimkan draf berjalan jika Anda memintanya.",
      category: "Proses Pengerjaan"
    },
    {
      question: "Apakah TugasKu menerima pengerjaan tugas dalam bahasa Inggris?",
      answer: "Ya, kami memiliki tim spesialis bahasa dan akademisi bilingual yang fasih dalam penulisan ilmiah bahasa Inggris maupun pengerjaan coding dengan dokumentasi bahasa Inggris standar internasional.",
      category: "Proses Pengerjaan"
    }
  ];

  const faqData: FAQItem[] = baseFaqData.map((item) => ({
    ...item,
    answer: faqTone === "bestie" ? (CASUAL_FAQ_ANSWERS[item.question] || item.answer) : item.answer
  }));

  // Pricing Data
  const servicesData: ServiceItem[] = [
    { id: "1", name: "Makalah & Esai", priceFrom: "Rp50.000", category: "akademik", estimation: "1 - 2 Hari", complexity: 40, difficultyLabel: "Mudah - Sedang" },
    { id: "2", name: "Laporan Praktikum", priceFrom: "Rp75.000", category: "akademik", estimation: "1 - 3 Hari", complexity: 55, difficultyLabel: "Sedang" },
    { id: "3", name: "Presentasi & PPT", priceFrom: "Rp100.000", category: "akademik", estimation: "1 - 2 Hari", complexity: 30, difficultyLabel: "Mudah" },
    { id: "4", name: "Proposal Seminar", priceFrom: "Rp250.000", category: "tugas akhir", estimation: "3 - 7 Hari", complexity: 75, difficultyLabel: "Tinggi" },
    { id: "5", name: "Skripsi Bab 1-5 Lengkap", priceFrom: "Rp500.000", category: "tugas akhir", estimation: "7 - 21 Hari", complexity: 95, difficultyLabel: "Sangat Tinggi" },
    { id: "6", name: "Landing Page / Website", priceFrom: "Rp350.000", category: "digital", estimation: "3 - 7 Hari", complexity: 70, difficultyLabel: "Sedang - Tinggi" },
    { id: "7", name: "UI/UX Design Figma", priceFrom: "Rp400.000", category: "digital", estimation: "3 - 7 Hari", complexity: 65, difficultyLabel: "Sedang" },
    { id: "8", name: "Coding Project / App", priceFrom: "Rp500.000", category: "digital", estimation: "5 - 14 Hari", complexity: 90, difficultyLabel: "Sangat Tinggi" },
  ];

  // Filtered Services and FAQs based on real-time search query
  const filteredServices = servicesData.filter(svc => 
    svc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (svc.difficultyLabel && svc.difficultyLabel.toLowerCase().includes(searchQuery.toLowerCase())) ||
    svc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFaqs = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const finalFaqs = filteredFaqs.filter(faq =>
    faq.question.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(faqSearchQuery.toLowerCase())
  );

  const displayedFaqs = finalFaqs.slice(0, faqLimit);

  // FAQ Top 5 questions for visual analytics dashboard
  const topFaqs = [...faqData]
    .map(faq => ({
      ...faq,
      views: faqViews[faq.question] || 0,
      likes: faqHelpfulVotes[faq.question] || 0
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const maxViews = Math.max(...topFaqs.map(f => f.views), 1);

  // Tips Akademik Data
  const academicTipsData: AcademicTip[] = [
    {
      id: "tip-1",
      title: "Teknik Pomodoro 2.0: Cara Fokus Tanpa Burnout",
      category: "Metode Belajar",
      summary: "Modifikasi teknik Pomodoro klasik agar sesuai dengan tingkat kesulitan tugas modern Anda.",
      content: "Teknik Pomodoro klasik (25 menit belajar, 5 menit istirahat) terkadang terlalu singkat untuk tugas rumit seperti menulis skripsi atau coding. Cobalah Pomodoro 2.0: Blok waktu 50 menit dengan fokus penuh, diikuti istirahat 10 menit. Niraa AI merekomendasikan metode ini untuk tugas berkategori 'Sangat Tinggi' untuk menjaga konsentrasi mendalam (deep work) tanpa merusak kesehatan mental Anda.",
      author: "Niraa AI",
      readTime: "3 Menit",
      date: "24 Juni 2026",
      likes: 142,
      tags: ["Fokus", "Produktivitas", "Skripsi"]
    },
    {
      id: "tip-2",
      title: "Seni Menulis Pendahuluan Makalah yang Memikat",
      category: "Penulisan Ilmiah",
      summary: "Langkah mudah menyusun Bab 1 agar dosen pembimbing langsung terkesan dengan argumen Anda.",
      content: "Pendahuluan (Bab 1) adalah wajah dari riset Anda. Mulailah dengan 'Hook' yang kuat—bisa berupa data statistik terbaru atau fenomena nyata. Lanjutkan dengan identifikasi kesenjangan riset (research gap), lalu rumuskan solusi orisinal Anda. Niraa AI menyarankan agar Anda mengalirkan alur latar belakang dari umum ke khusus menggunakan struktur piramida terbalik agar pembaca mudah memahami esensi penelitian.",
      author: "Niraa AI",
      readTime: "4 Menit",
      date: "20 Juni 2026",
      likes: 98,
      tags: ["Akademik", "Makalah", "Tips Menulis"]
    },
    {
      id: "tip-3",
      title: "Cara Efektif Membaca Jurnal Internasional Q1/Q2",
      category: "Riset",
      summary: "Strategi membaca kritis (critical reading) tanpa perlu menerjemahkan setiap kata secara harfiah.",
      content: "Membaca jurnal internasional seringkali melelahkan. Gunakan metode 'Three-Pass Approach'. Pertama, baca judul, abstrak, dan kesimpulan untuk mengerti gambaran besar. Kedua, telusuri diagram, grafik, dan metodologi utama. Ketiga, baca detail teori jika memang relevan dengan tugas Anda. Tips dari Niraa AI: fokus pada apa yang ingin Anda cari dari jurnal tersebut, bukan menghafal isinya!",
      author: "Niraa AI",
      readTime: "5 Menit",
      date: "15 Juni 2026",
      likes: 215,
      tags: ["Riset", "Jurnal", "Belajar Efektif"]
    }
  ];

  const filteredTips = academicTipsData.filter(tip =>
    tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tip.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tip.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tip.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tip.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const displayedTips = filteredTips.filter(tip => {
    if (activeTipsTab === "saved") {
      return bookmarkedTips.includes(tip.id);
    }
    return true;
  });

  // Quick Chat Suggestion Send
  const handleQuickReply = (text: string, userFacingPrompt: string) => {
    handleBotResponse(userFacingPrompt);
  };

  // Clean chat log
  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Halo kak! Riwayat percakapan telah dibersihkan. Ada yang bisa Niraaa bantu lagi? 😊"
      }
    ]);
    setStreamError(null);
    handleStopSpeaking();
  };

  // --- Niraa Voice (TTS & STT) Integration ---
  
  // Speech Recognition (Speech-to-Text) initialization
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = "id-ID";

        rec.onstart = () => {
          setIsListening(true);
        };

        rec.onresult = (event: any) => {
          const resultText = event.results[0][0].transcript;
          if (resultText) {
            setInputMessage(prev => {
              const base = prev.trim();
              return base ? `${base} ${resultText}` : resultText;
            });
            showToast("Suara berhasil direkam! 🎙️✨");
          }
        };

        rec.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
          if (event.error === "not-allowed") {
            showToast("Akses mikrofon ditolak kakk. Cek izin browser ya! 🔒");
          } else {
            showToast("Gagal mendeteksi suara kakk. Silakan coba lagi!");
          }
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Browser SpeechSynthesis Voices initialization
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableLocalVoices(voices);
        if (voices.length > 0) {
          // If no voice is selected yet, choose a default Indonesian or fallback
          const defaultIdVoice = voices.find(v => v.lang.startsWith("id") || v.lang.includes("ID"));
          if (defaultIdVoice) {
            setLocalVoiceURI(prev => prev || defaultIdVoice.voiceURI);
          } else {
            setLocalVoiceURI(prev => prev || voices[0].voiceURI);
          }
        }
      };
      
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      showToast("Browser kakak tidak mendukung fitur rekaman suara ini. 😢");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      handleStopSpeaking();
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn("Speech recognition start failed:", err);
      }
    }
  };

  const handleStopSpeaking = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlayingMessageIndex(null);
  };

  const handleSpeakMessage = async (text: string, msgIndex: number) => {
    if (playingMessageIndex === msgIndex) {
      handleStopSpeaking();
      return;
    }

    handleStopSpeaking();
    setPlayingMessageIndex(msgIndex);

    const cleanText = text
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, "")
      .replace(/https?:\/\/\S+/g, "")
      .trim();

    if (!cleanText) {
      setPlayingMessageIndex(null);
      return;
    }

    if (voiceMode === "local") {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        showToast("TTS lokal tidak didukung. Beralih ke Gemini TTS...");
        await speakWithGemini(cleanText, msgIndex);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const voices = window.speechSynthesis.getVoices();
      let matchedVoice = null;
      if (localVoiceURI) {
        matchedVoice = voices.find(v => v.voiceURI === localVoiceURI);
      }
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      } else {
        const idVoice = voices.find(v => v.lang.startsWith("id") || v.lang.includes("ID"));
        if (idVoice) {
          utterance.voice = idVoice;
        } else {
          const idVoiceLoose = voices.find(v => v.lang.includes("id") || v.lang.includes("ID"));
          if (idVoiceLoose) utterance.voice = idVoiceLoose;
        }
      }
      utterance.rate = voiceRate;
      utterance.pitch = voicePitch;

      utterance.onend = () => {
        setPlayingMessageIndex(null);
      };

      utterance.onerror = () => {
        setPlayingMessageIndex(null);
      };

      window.speechSynthesis.speak(utterance);
    } else if (voiceMode === "gemini") {
      await speakWithGemini(cleanText, msgIndex);
    }
  };

  const speakWithGemini = async (cleanText: string, msgIndex: number) => {
    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: cleanText, voice: geminiVoice })
      });

      if (!response.ok) {
        throw new Error("Gagal memperoleh respon dari API TTS.");
      }

      const data = await response.json();
      if (!data.audio) {
        throw new Error("Suara tidak ditemukan.");
      }

      const mimeType = data.mimeType || "audio/mp3";
      const byteCharacters = atob(data.audio);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      const audioUrl = URL.createObjectURL(blob);

      const audio = new Audio(audioUrl);
      audio.playbackRate = voiceRate; // Set speaking rate (speed)
      audioRef.current = audio;
      
      audio.onended = () => {
        setPlayingMessageIndex(null);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setPlayingMessageIndex(null);
        URL.revokeObjectURL(audioUrl);
        showToast("Gagal memutar audio Gemini TTS.");
      };

      await audio.play();
    } catch (err) {
      console.error("Gemini TTS error:", err);
      setPlayingMessageIndex(null);
      showToast("Koneksi Gemini TTS sibuk, dialihkan ke asisten lokal...");
      if (typeof window !== "undefined" && window.speechSynthesis) {
        setPlayingMessageIndex(msgIndex);
        const utterance = new SpeechSynthesisUtterance(cleanText);
        const voices = window.speechSynthesis.getVoices();
        const idVoice = voices.find(v => v.lang.startsWith("id") || v.lang.includes("ID"));
        if (idVoice) utterance.voice = idVoice;
        utterance.rate = voiceRate;
        utterance.pitch = voicePitch;
        utterance.onend = () => setPlayingMessageIndex(null);
        utterance.onerror = () => setPlayingMessageIndex(null);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  // AI Stream Response Processing
  const handleBotResponse = async (userText: string) => {
    if (!userText.trim()) return;

    // Reset previous errors before generating a new stream
    setStreamError(null);

    // 1. Add user's message to state
    const newUserMessage: Message = { role: "user", content: userText };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInputMessage("");

    // Reset textarea auto-height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // 2. Insert placeholder for stream content and show loading spinner
    setIsTyping(true);
    const placeholderMessageIndex = updatedMessages.length;
    
    // Add temporary assistant placeholder
    setMessages([...updatedMessages, { role: "assistant", content: "" }]);

    try {
      // Direct stream API fetch
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: updatedMessages,
          responseStyle: chatResponseStyle,
          preferredModel: aiModel
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Koneksi bermasalah (Status ${response.status})`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Gagal menginisialisasi pembaca aliran data (Stream Reader).");
      }

      const decoder = new TextDecoder("utf-8");
      let accumulativeText = "";
      let leftover = "";

      // Disable spinner as soon as streaming transmission is open
      setIsTyping(false);

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          // Process any remaining leftover text
          if (leftover.trim()) {
            const cleanLine = leftover.trim();
            if (cleanLine.startsWith("data: ")) {
              const dataStr = cleanLine.slice(6);
              if (dataStr !== "[DONE]") {
                try {
                  const parsed = JSON.parse(dataStr);
                  if (parsed.error) throw new Error(parsed.error);
                  if (parsed.text) accumulativeText += parsed.text;
                } catch (e) {}
              }
            }
          }
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const combined = leftover + chunk;
        const lines = combined.split("\n");
        
        // The last element is either empty (if combined ends with \n)
        // or a partial line (if it doesn't). We pop it to leftover.
        leftover = lines.pop() || "";

        for (const line of lines) {
          const cleanLine = line.trim();
          if (cleanLine.startsWith("data: ")) {
            const dataStr = cleanLine.slice(6);
            if (dataStr === "[DONE]") {
              continue;
            }

            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.error) {
                throw new Error(parsed.error);
              }
              if (parsed.text) {
                accumulativeText += parsed.text;
                // Live update the streamed text to our placeholder message instantly!
                setMessages(prev => {
                  const cloned = [...prev];
                  if (cloned[placeholderMessageIndex]) {
                    cloned[placeholderMessageIndex] = {
                      role: "assistant",
                      content: accumulativeText
                    };
                  }
                  return cloned;
                });
              }
            } catch (jsonErr: any) {
              // Ignore standard parse fails for non-JSON SSE strings, except actual stream errors
              if (line.includes("error")) {
                throw new Error(jsonErr.message || "Terdapat kegagalan data di tengah streaming.");
              }
            }
          }
        }
      }

      if (voiceMode !== "off" && autoReadNotif && accumulativeText.trim()) {
        handleSpeakMessage(accumulativeText, placeholderMessageIndex);
      }

    } catch (err: any) {
      console.error("Chat streaming failure:", err);
      setIsTyping(false);
      setStreamError(err.message || "Ugh, ada kendala koneksi nih kak. Silakan coba sesaat lagi.");

      // Remove placeholder or convert it to error message
      setMessages(prev => {
        const filtered = [...prev];
        // If placeholder has no text, remove it. Otherwise leave what was streamed but append notice
        const lastMsg = filtered[placeholderMessageIndex];
        if (lastMsg && lastMsg.content === "") {
          filtered.splice(placeholderMessageIndex, 1);
        } else if (lastMsg) {
          lastMsg.content += "\n\n*(Aliran konten terputus karena gangguan sinyal)*";
          lastMsg.isError = true;
        }
        return filtered;
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputMessage.trim()) {
        handleBotResponse(inputMessage);
      }
    }
  };

  // Render markdown tags perfectly (bold markers, newline)
  const formatMessageText = (txt: string) => {
    if (!txt || typeof txt !== "string") {
      return null;
    }
    // Split by ** markers
    const parts = txt.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={idx} className="font-extrabold text-white">{part.slice(2, -2)}</strong>;
      }
      // Split by \n for multi-line support
      const subLines = part.split("\n");
      return subLines.map((line, lineIdx) => (
        <React.Fragment key={`${idx}-${lineIdx}`}>
          {line}
          {lineIdx < subLines.length - 1 && <br />}
        </React.Fragment>
      ));
    });
  };

  // Select an item from real-time search suggestion to automatically scroll and focus it
  const handleSelectSearchItem = (type: "service" | "faq" | "tip", item: any) => {
    if (type === "service") {
      const el = document.getElementById("pricing");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else if (type === "faq") {
      setExpandedFaq(item.question);
      setHighlightedFaq(item.question);
      if (item.category && !expandedCategories.includes(item.category)) {
        setExpandedCategories([...expandedCategories, item.category]);
      }
      const el = document.getElementById("faq");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      setTimeout(() => {
        setHighlightedFaq(null);
      }, 4000);
    } else if (type === "tip") {
      const el = document.getElementById("tips-akademik");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="relative min-h-screen font-sans overflow-x-hidden selection:bg-[#00E57A]/30 selection:text-white">
      {/* Background Decorative Grid */}
      <div className="grid-tex absolute inset-0 pointer-events-none" />
      <div id="hero-bg-glow" className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#00E57A]/5 to-[#38BDF8]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 h-20 border-b border-white/5 backdrop-blur-xl bg-[#07080D]/80 z-40 px-6 sm:px-12 flex items-center justify-between gap-4">
        <a href="#" className="flex flex-col items-start leading-none group shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="font-display font-black text-xl sm:text-2xl tracking-tight text-white">
              Tugas<span className="text-[#00E57A]">Ku</span>
            </span>
          </div>
          <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-[#8B94AA] font-bold mt-1">
            Academic Services
          </span>
          <span className="w-5 h-0.5 bg-[#00E57A] rounded-full shadow-[0_0_8px_#00E57A] mt-1 transition-all duration-300 group-hover:w-16" />
        </a>

        {/* Real-time Search Bar Widget */}
        <div className="relative flex-1 max-w-[140px] xs:max-w-[200px] sm:max-w-xs md:max-w-md mx-2 sm:mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8B94AA]" />
            <input
              type="text"
              placeholder="Cari layanan / FAQ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111420]/90 border border-white/10 rounded-full pl-9 pr-8 py-1.5 sm:py-2 text-xs text-white placeholder-[#8B94AA]/60 focus:outline-none focus:border-[#00E57A] transition-all font-medium"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B94AA] hover:text-white transition-colors"
                title="Bersihkan pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete dropdown suggestion overlay */}
          <AnimatePresence>
            {searchQuery.trim().length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-[#111420] border border-white/10 rounded-2xl shadow-2xl p-4 max-h-[300px] overflow-y-auto z-50 divide-y divide-white/5"
              >
                {/* Services Section */}
                <div className="pb-3">
                  <div className="text-[10px] font-mono text-[#8B94AA] uppercase tracking-wider mb-2 text-left">Layanan ({filteredServices.length})</div>
                  {filteredServices.length > 0 ? (
                    <div className="space-y-1">
                      {filteredServices.slice(0, 3).map((svc) => (
                        <button
                          key={svc.id}
                          onClick={() => {
                            handleSelectSearchItem("service", svc);
                            setSearchQuery("");
                          }}
                          className="w-full text-left p-2 hover:bg-white/[0.03] rounded-lg transition-colors flex items-center justify-between text-xs"
                        >
                          <span className="text-white font-medium truncate">{svc.name}</span>
                          <span className="text-[#00E57A] font-mono shrink-0 ml-2">{svc.priceFrom}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[11px] text-[#8B94AA]/50 text-left pl-2">Tidak ada layanan yang cocok</div>
                  )}
                </div>

                {/* FAQ Section */}
                <div className="py-3">
                  <div className="text-[10px] font-mono text-[#8B94AA] uppercase tracking-wider mb-2 text-left">Pertanyaan Umum ({filteredFaqs.length})</div>
                  {filteredFaqs.length > 0 ? (
                    <div className="space-y-1">
                      {filteredFaqs.slice(0, 3).map((faq) => (
                        <button
                          key={faq.question}
                          onClick={() => {
                            handleSelectSearchItem("faq", faq);
                            setSearchQuery("");
                          }}
                          className="w-full text-left p-2 hover:bg-white/[0.03] rounded-lg transition-colors text-xs text-white/90 truncate block"
                        >
                          ? {faq.question}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[11px] text-[#8B94AA]/50 text-left pl-2">Tidak ada FAQ yang cocok</div>
                  )}
                </div>

                {/* Tips Akademik Section */}
                <div className="pt-3">
                  <div className="text-[10px] font-mono text-[#8B94AA] uppercase tracking-wider mb-2 text-left">Tips Akademik ({filteredTips.length})</div>
                  {filteredTips.length > 0 ? (
                    <div className="space-y-1">
                      {filteredTips.slice(0, 3).map((tip) => (
                        <button
                          key={tip.id}
                          onClick={() => {
                            handleSelectSearchItem("tip", tip);
                            setSearchQuery("");
                          }}
                          className="w-full text-left p-2 hover:bg-white/[0.03] rounded-lg transition-colors text-xs text-white/90 truncate block"
                        >
                          📚 {tip.title}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[11px] text-[#8B94AA]/50 text-left pl-2">Tidak ada tips yang cocok</div>
                  )}
                </div>

                {/* View results indicator */}
                <div className="pt-2 text-[9px] text-[#8B94AA] font-mono text-center">
                  Scroll ke bawah untuk melihat hasil lengkap terfilter.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Global Theme Toggle Button */}
        <button
          onClick={() => setTheme(prev => prev === "dark" ? "light" : "dark")}
          className="p-2 sm:p-2.5 rounded-full border border-white/10 bg-[#111420]/80 text-[#8B94AA] hover:text-white hover:border-white/20 transition-all active:scale-95 flex items-center justify-center shrink-0 cursor-pointer shadow-md"
          title={theme === "dark" ? "Aktifkan Mode Terang ☀️" : "Aktifkan Mode Gelap 🌙"}
        >
          {theme === "dark" ? (
            <Sun className="w-4.5 h-4.5 text-[#00E57A]" />
          ) : (
            <Moon className="w-4.5 h-4.5 text-[#38BDF8]" />
          )}
        </button>

        {/* 9Router & WA Auto-Pilot Launcher */}
        <button
          onClick={() => setIsAutomationOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full border border-[#00E57A]/40 bg-[#00E57A]/10 hover:bg-[#00E57A]/20 text-[#00E57A] transition-all text-xs font-mono font-bold active:scale-95 shadow-[0_0_15px_rgba(0,229,122,0.15)] shrink-0 cursor-pointer"
          title="Buka 9Router & WhatsApp Auto-Pilot Studio"
        >
          <Bot className="w-3.5 h-3.5 text-[#00E57A]" />
          <span className="hidden sm:inline">AI Auto-Pilot</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00E57A] animate-pulse" />
        </button>

        <nav className="hidden md:flex items-center gap-8 shrink-0">
          <a href="#layanan" className="font-mono text-xs text-[#8B94AA] hover:text-white transition-colors uppercase tracking-wider">layanan</a>
          <a href="#pricing" className="font-mono text-xs text-[#8B94AA] hover:text-white transition-colors uppercase tracking-wider">harga</a>
          <a href="#tips-akademik" className="font-mono text-xs text-[#8B94AA] hover:text-white transition-colors uppercase tracking-wider">tips</a>
          <a href="#faq" className="font-mono text-xs text-[#8B94AA] hover:text-white transition-colors uppercase tracking-wider">faq</a>
          <a href="#form-section" className="font-mono text-xs text-[#07080D] bg-[#00E57A] hover:bg-[#00ca6d] px-4 py-2.5 rounded-md font-bold tracking-wider hover:shadow-[0_0_25px_rgba(0,229,122,0.25)] transition-all">
            order.now()
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative pt-36 pb-24 md:pt-44 px-6 sm:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        <div className="lg:col-span-7 flex flex-col items-start gap-6">
          <div className="inline-flex items-center gap-2 bg-[#00E57A]/10 border border-[#00E57A]/20 rounded-full px-4 py-1.5 font-mono text-xs text-[#00E57A]">
            <span className="w-2 h-2 rounded-full bg-[#00E57A] animate-ping" />
            <span>Tersedia + Respons Cepat &lt; 1 Jam</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight leading-[1.05] text-left">
            Tugas beres.<br />
            <span className="text-[#00E57A] drop-shadow-[0_0_15px_rgba(0,229,122,0.15)]">Nilai bagus.</span><br />
            <span className="text-[#8B94AA]">Deadline aman.</span>
          </h1>
          <p className="text-[#8B94AA] text-base sm:text-lg max-w-lg leading-relaxed text-left">
            Joki profesional untuk tugas kuliah, skripsi, dan project digital. Dikerjakan dengan riset mendalam, orisinal, tepat waktu, dan bergaransi nilai memuaskan.
          </p>
          <div className="flex flex-wrap gap-4 w-full sm:w-auto">
            <motion.a 
              href="#form-section" 
              className="relative flex-1 sm:flex-initial text-center bg-[#00E57A] text-black font-bold tracking-tight px-8 py-3.5 rounded-lg hover:bg-[#00ca6d] transition-colors overflow-hidden"
              animate={{
                boxShadow: [
                  "0 0 15px rgba(0, 229, 122, 0.25)",
                  "0 0 30px rgba(0, 229, 122, 0.55)",
                  "0 0 15px rgba(0, 229, 122, 0.25)"
                ]
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 0 35px rgba(0, 229, 122, 0.7)"
              }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Subtle shining light ray effect across the button */}
              <motion.span 
                className="absolute top-0 bottom-0 w-[40%] bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 pointer-events-none filter blur-[2px]"
                animate={{
                  left: ["-100%", "200%"]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 1.8,
                  ease: "easeInOut"
                }}
              />
              <span className="relative z-10">
                Buat Pesanan &rarr;
              </span>
            </motion.a>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" className="flex-1 sm:flex-initial text-center border border-white/10 text-white font-medium hover:border-[#00e57a] hover:text-[#00e57a] px-8 py-3.5 rounded-lg transition-colors">
              Konsultasi Gratis
            </a>
          </div>

          <div className="border-t border-white/5 pt-6 mt-4 w-full grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#8B94AA]">
              <span className="text-[#00E57A] font-bold">✓</span> Revisi Gratis
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#8B94AA]">
              <span className="text-[#00E57A] font-bold">✓</span> Privasi Terjaga
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#8B94AA]">
              <span className="text-[#00E57A] font-bold">✓</span> Anti-Plagiasi
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#8B94AA]">
              <span className="text-[#00E57A] font-bold">✓</span> Sistem DP
            </div>
          </div>
        </div>

        {/* Hero Interactive Widgets Stack (Authentic Logo + Daemon Terminal) */}
        <div className="lg:col-span-5 w-full flex flex-col gap-6">
          {/* Authentic Logo Brand Board */}
          <div className="relative bg-[#050508] border border-white/5 rounded-xl p-10 overflow-hidden shadow-2xl flex flex-col items-center justify-center min-h-[170px]">
            {/* Background glowing spot */}
            <div className="absolute inset-0 bg-radial-gradient from-[#00E57A]/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="flex flex-col items-center select-none">
              <span className="font-display font-black text-4xl sm:text-5xl tracking-tight text-white drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)]">
                Tugas<span className="text-[#00E57A]">Ku</span>
              </span>
              <span className="text-xs sm:text-[13px] font-mono uppercase tracking-[0.24em] text-zinc-400 font-bold mt-2">
                Academic Services
              </span>
              <span className="w-10 h-1 bg-[#00E57A] rounded-full shadow-[0_0_12px_#00E57A] mt-3" />
            </div>
          </div>

          {/* Hero Interactive Terminal Widget */}
          <div className="w-full">
            <div className="bg-[#0C0E18] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
              <div className="bg-[#111420] px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                  <span className="w-3 h-3 rounded-full bg-[#28C840]" />
                </div>
                <div className="font-mono text-[10px] text-white/30 flex items-center gap-1.5">
                  <Terminal className="w-3 h-3" /> tugasku_daemon — live
                </div>
              </div>
              <div className="p-6 font-mono text-xs sm:text-sm text-left leading-relaxed text-white space-y-3">
                <div>
                  <span className="text-[#8B94AA]">$</span> <span className="text-[#00E57A]">tugasku</span> check --rates
                </div>
              <div className="text-[#8B94AA] pl-3 py-1 border-l border-white/5 space-y-1.5">
                <div>&gt; active_jobs:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#38BDF8]">42</span></div>
                <div>&gt; delivery_rate:&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#00E57A]">100% On-Time</span></div>
                <div>&gt; response_time:&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#38BDF8]">&lt; 20 Mins</span></div>
                <div>&gt; revisi_unlimited:&nbsp;&nbsp;<span className="text-[#F5C842]">True</span></div>
                <div>&gt; privasi_klien:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#00E57A]">Secured & Encrypted</span></div>
                <div>&gt; database_years:&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-white">3+ Years active</span></div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[#8B94AA]">$</span>
                <span className="w-2 h-4 bg-[#00E57A] inline-block animate-[pulse_1s_infinite]" />
              </div>
            </div>
          </div>

          {/* Target Akademik & Progress Tracker Widget */}
          <div className="bg-[#0C0E18] border border-white/10 rounded-xl overflow-hidden shadow-2xl p-5 text-left relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-radial-gradient from-[#00E57A]/5 via-transparent to-transparent pointer-events-none" />
            
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#00E57A]/10 border border-[#00E57A]/20 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-[#00E57A]" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-white leading-tight">Target Akademik</h3>
                  <span className="text-[9px] font-mono text-[#8B94AA] uppercase tracking-wider">Semester Goal & Planner</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-[#111420] border border-white/5 px-2.5 py-1 rounded-md">
                <Award className="w-3 h-3 text-[#F5C842]" />
                <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">IPK Goal</span>
              </div>
            </div>

            {/* Target Settings */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[9px] font-mono text-[#8B94AA] uppercase tracking-wider mb-1.5 text-left">Target Nilai</label>
                <div className="flex bg-[#111420] p-1 rounded-lg border border-white/5">
                  {["A", "A-", "B+", "B"].map((grade) => (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => {
                        setTargetGrade(grade);
                        showToast(`Target nilai semester diset ke ${grade}! Semangat, kamu pasti bisa! 💪✨`);
                      }}
                      className={`flex-1 text-center py-1 text-xs font-bold font-mono rounded-md transition-all ${
                        targetGrade === grade
                          ? "bg-[#00E57A]/10 border border-[#00E57A]/20 text-[#00E57A]"
                          : "text-[#8B94AA] hover:text-white hover:bg-white/[0.02]"
                      }`}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-mono text-[#8B94AA] uppercase tracking-wider mb-1.5 text-left">Semester</label>
                <input
                  type="text"
                  value={targetSemester}
                  onChange={(e) => setTargetSemester(e.target.value)}
                  placeholder="Semester Ganjil"
                  className="w-full bg-[#111420] border border-white/5 rounded-lg px-2.5 py-1 text-xs text-white font-medium focus:outline-none focus:border-[#00E57A]"
                />
              </div>
            </div>

            {/* Progress Calculation */}
            {(() => {
              const totalTasks = bookedTasks.length;
              const completedTasksCount = bookedTasks.filter(t => t.status === "completed").length;
              const processingTasksCount = bookedTasks.filter(t => t.status === "processing").length;
              
              const progressPercent = totalTasks > 0 
                ? Math.round(((completedTasksCount * 100) + (processingTasksCount * 50)) / (totalTasks * 100) * 100) 
                : 0;

              return (
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-end text-xs font-mono">
                    <span className="text-[#8B94AA]">Capaian Belajar</span>
                    <span className="text-[#00E57A] font-bold">{progressPercent}%</span>
                  </div>
                  
                  {/* Glowing Progress Bar */}
                  <div className="h-2.5 bg-[#111420] border border-white/5 rounded-full overflow-hidden relative shadow-inner">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-[#00E57A] via-[#00E57A] to-[#38BDF8] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>

                  <AnimatePresence>
                    {confettiActive && <ConfettiExplosion />}
                  </AnimatePresence>

                  <div className="flex justify-between items-center text-[10px] font-mono text-[#8B94AA] leading-none">
                    <span>{completedTasksCount} dari {totalTasks} tugas selesai</span>
                    {progressPercent >= 80 ? (
                      <span className="text-[#00E57A] font-bold">✨ SANGAT BAGUS!</span>
                    ) : progressPercent >= 50 ? (
                      <span className="text-[#38BDF8]">📈 SEDANG BERJUANG</span>
                    ) : (
                      <span className="text-[#F5C842]">🔥 AYOK MULAI JOKI!</span>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Task list */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[9px] font-mono text-[#444D62] uppercase tracking-wider text-left">Daftar Tugas Akademik</label>
                {bookedTasks.length > 0 && (
                  <span className="text-[9px] font-mono text-[#8B94AA]">
                    {filteredBookedTasks.length} dari {bookedTasks.length} tugas
                  </span>
                )}
              </div>

              {/* Local Search Filter Input */}
              {bookedTasks.length > 0 && (
                <div className="relative mb-2">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#8B94AA]/60" />
                  <input
                    type="text"
                    value={taskSearchQuery}
                    onChange={(e) => setTaskSearchQuery(e.target.value)}
                    placeholder="Cari nama tugas atau matkul..."
                    className="w-full bg-[#111420]/80 border border-white/5 rounded-lg pl-7.5 pr-7 py-1 text-[11px] text-white placeholder-[#8B94AA]/40 focus:outline-none focus:border-[#00E57A]/40 focus:bg-[#111420] transition-all"
                  />
                  {taskSearchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setTaskSearchQuery("");
                        showToast("Pencarian tugas dibersihkan 🧹");
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8B94AA]/60 hover:text-white p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}

              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {filteredBookedTasks.length === 0 ? (
                  <div className="text-center py-4 border border-dashed border-white/5 rounded-lg bg-[#111420]/40">
                    <p className="text-[10px] text-[#8B94AA] font-mono">
                      {bookedTasks.length === 0 
                        ? "Belum ada tugas yang masuk daftar pantau." 
                        : "Tidak ada tugas yang cocok dengan pencarian."}
                    </p>
                    <p className="text-[9px] text-[#8B94AA]/60 font-mono mt-0.5">
                      {bookedTasks.length === 0 
                        ? "Buat pesanan joki atau kalkulasi harga untuk menambahkan tugas!" 
                        : "Coba kata kunci pencarian yang lain ya kakk!"}
                    </p>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {filteredBookedTasks.map((task) => {
                      const originalIndex = bookedTasks.findIndex(t => t.id === task.id);
                      const isDraggingThis = draggedTaskIndex === originalIndex;
                      return (
                        <motion.div 
                          key={task.id} 
                          initial={{ opacity: 0, y: 25, scale: 0.95 }}
                          animate={{ 
                            opacity: isDraggingThis ? 0.4 : 1, 
                            scale: isDraggingThis 
                              ? 1.02 
                              : task.status === "completed" 
                              ? [1, 1.06, 0.97, 1.03, 1] 
                              : 1,
                            rotate: task.status === "completed" ? [0, -2, 2, -1.5, 1.5, 0] : 0,
                            y: 0 
                          }}
                          whileHover={{ 
                            scale: isDraggingThis ? 1.02 : 1.02,
                            y: isDraggingThis ? 0 : -1,
                            transition: { duration: 0.2 }
                          }}
                          exit={{ opacity: 0, scale: 0.95, y: -15 }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 320, 
                            damping: 22,
                            rotate: { duration: 0.5 },
                            scale: task.status === "completed" ? { duration: 0.5 } : { type: "spring", stiffness: 320, damping: 22 }
                          }}
                          layout
                          draggable={!taskSearchQuery}
                          onDragStart={(e) => {
                            if (taskSearchQuery) return;
                            setDraggedTaskIndex(originalIndex);
                            e.dataTransfer.effectAllowed = "move";
                          }}
                          onDragEnd={() => {
                            setDraggedTaskIndex(null);
                            showToast("Urutan tugas akademik diperbarui! 📋✨");
                          }}
                          onDragOver={(e) => e.preventDefault()}
                          onDragEnter={(e) => {
                            e.preventDefault();
                            if (taskSearchQuery) return;
                            if (draggedTaskIndex !== null && draggedTaskIndex !== originalIndex) {
                              const newTasks = [...bookedTasks];
                              const draggedItem = newTasks[draggedTaskIndex];
                              newTasks.splice(draggedTaskIndex, 1);
                              newTasks.splice(originalIndex, 0, draggedItem);
                              setDraggedTaskIndex(originalIndex);
                              setBookedTasks(newTasks);
                            }
                          }}
                          className={`flex items-center justify-between gap-2.5 bg-[#111420]/60 hover:bg-[#111420] border rounded-lg p-2.5 transition-all duration-200 ${
                            isDraggingThis 
                              ? "border-[#00E57A]/50 bg-[#111420]/90 shadow-[0_4px_12px_rgba(0,229,122,0.15)] z-20" 
                              : "border-white/5 hover:border-[#00E57A]/30 hover:shadow-[0_4px_12px_rgba(0,229,122,0.06)]"
                          }`}
                        >
                          {/* Drag Grip Handle */}
                          {!taskSearchQuery ? (
                            <div className="cursor-grab active:cursor-grabbing text-white/20 hover:text-[#00E57A]/80 p-0.5 transition-colors shrink-0" title="Geser untuk mengurutkan">
                              <GripVertical className="w-3.5 h-3.5" />
                            </div>
                          ) : (
                            <div className="text-white/10 p-0.5 shrink-0" title="Pengurutan nonaktif saat mencari">
                              <Search className="w-3 h-3" />
                            </div>
                          )}

                          <div className="min-w-0 flex-1 text-left">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="text-[10px] font-bold text-white font-sans truncate block">{task.name}</span>
                            </div>
                            <span className="text-[9px] font-mono text-[#8B94AA] truncate block">
                              {task.subject} {task.deadline && ` • Due: ${task.deadline}`}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Interactive Status Selector */}
                            <select
                              value={task.status}
                              onChange={(e) => {
                                const newStatus = e.target.value as "pending" | "processing" | "completed";
                                setBookedTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
                                showToast(`Status tugas diubah ke '${newStatus === 'completed' ? 'Selesai' : newStatus === 'processing' ? 'Proses' : 'Belum Dikerjakan'}'! 🎉`);
                              }}
                              className={`text-[9px] font-mono font-bold bg-[#07080D] border rounded px-1.5 py-0.5 focus:outline-none transition-colors cursor-pointer ${
                                task.status === "completed" 
                                  ? "border-[#00E57A]/30 text-[#00E57A]" 
                                  : task.status === "processing"
                                  ? "border-[#38BDF8]/30 text-[#38BDF8]"
                                  : "border-white/10 text-[#8B94AA]"
                              }`}
                            >
                              <option value="pending" className="bg-[#0C0E18]">Antrean</option>
                              <option value="processing" className="bg-[#0C0E18]">Diproses</option>
                              <option value="completed" className="bg-[#0C0E18]">Selesai</option>
                            </select>

                            {/* Manual delete for cleaning list */}
                            <button
                              type="button"
                              onClick={() => {
                                setTaskToDelete(task);
                              }}
                              className="text-[#8B94AA] hover:text-red-400 p-1 rounded-md hover:bg-white/5 transition-all cursor-pointer"
                              title="Hapus tugas"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>
            </div>

            {/* Quick manual task insertion inside widget */}
            {isAddingWidgetTask ? (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-[#111420] border border-white/10 rounded-lg p-3 space-y-2.5"
              >
                <div className="space-y-1.5 text-left">
                  <label className="block text-[8px] font-mono text-[#8B94AA] uppercase tracking-wider">Nama Tugas / Bab</label>
                  <input
                    type="text"
                    value={newWidgetTaskName}
                    onChange={(e) => setNewWidgetTaskName(e.target.value)}
                    placeholder="Contoh: Bab 3 Metodologi Penelitian"
                    className="w-full bg-[#07080D] border border-white/5 rounded-md px-2 py-1.5 text-[11px] text-white focus:outline-none focus:border-[#00E57A]"
                  />
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="block text-[8px] font-mono text-[#8B94AA] uppercase tracking-wider">Mata Kuliah</label>
                  <input
                    type="text"
                    value={newWidgetTaskSubject}
                    onChange={(e) => setNewWidgetTaskSubject(e.target.value)}
                    placeholder="Contoh: Metodologi Kuantitatif"
                    className="w-full bg-[#07080D] border border-white/5 rounded-md px-2 py-1.5 text-[11px] text-white focus:outline-none focus:border-[#00E57A]"
                  />
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="block text-[8px] font-mono text-[#8B94AA] uppercase tracking-wider">Tenggat Waktu (Deadline)</label>
                  <input
                    type="date"
                    value={newWidgetTaskDeadline}
                    onChange={(e) => setNewWidgetTaskDeadline(e.target.value)}
                    className="w-full bg-[#07080D] border border-white/5 rounded-md px-2 py-1.5 text-[11px] text-white focus:outline-none focus:border-[#00E57A] cursor-pointer"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingWidgetTask(false);
                      setNewWidgetTaskName("");
                      setNewWidgetTaskSubject("");
                      setNewWidgetTaskDeadline("");
                    }}
                    className="text-[10px] text-[#8B94AA] hover:text-white px-2 py-1"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const name = newWidgetTaskName.trim();
                      const subject = newWidgetTaskSubject.trim() || "Tugas Mandiri";
                      if (!name) {
                        showToast("Ketik nama tugasnya dulu ya bestie! 💖");
                        return;
                      }
                      
                      // Default deadline if none specified is 7 days from now
                      let finalDeadline = newWidgetTaskDeadline;
                      if (!finalDeadline) {
                        const defaultDate = new Date();
                        defaultDate.setDate(defaultDate.getDate() + 7);
                        finalDeadline = defaultDate.toISOString().split("T")[0];
                      }

                      const newTask: BookedTask = {
                        id: "manual-" + Date.now(),
                        name: name,
                        subject: subject,
                        status: "pending",
                        deadline: finalDeadline
                      };
                      setBookedTasks(prev => [...prev, newTask]);
                      showToast(`Tugas '${name}' berhasil ditambahkan ke rencana semester! 📚🚀`);
                      setNewWidgetTaskName("");
                      setNewWidgetTaskSubject("");
                      setNewWidgetTaskDeadline("");
                      setIsAddingWidgetTask(false);
                    }}
                    className="bg-[#00E57A] text-black font-semibold text-[10px] px-3 py-1 rounded-md hover:bg-[#00ca6d]"
                  >
                    Simpan Tugas
                  </button>
                </div>
              </motion.div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingWidgetTask(true)}
                className="w-full py-2 bg-white/[0.02] hover:bg-white/[0.04] border border-dashed border-white/10 hover:border-white/20 text-[#8B94AA] hover:text-white rounded-lg flex items-center justify-center gap-1.5 font-mono text-[10px] uppercase tracking-wider transition-all"
              >
                <span className="text-[#00E57A] font-bold text-xs leading-none">+</span> Tambah Tugas Mandiri
              </button>
            )}

            {/* Calendar Integration Integration Sync panel */}
            <div className="mt-4 pt-3.5 border-t border-white/5 flex items-center justify-between gap-3 text-left">
              <div className="flex flex-col">
                <span className="text-[8px] font-mono text-[#8B94AA] uppercase tracking-wider">Sinkronisasi Kalender</span>
                <span className="text-[10px] text-white/50 leading-tight">Ekspor deadline ke Google Calendar kakk!</span>
              </div>
              <button
                type="button"
                onClick={handleExportICS}
                className="px-3 py-1.5 bg-[#00E57A]/10 border border-[#00E57A]/20 hover:bg-[#00E57A]/20 text-[#00E57A] rounded-lg font-mono text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all hover:scale-[1.01]"
              >
                <Calendar className="w-3 h-3" />
                <span>Ekspor .ICS</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* Ribbon Marquee */}
      <div className="border-y border-white/5 py-4 bg-[#0C0E18] overflow-hidden whitespace-nowrap mask-gradient w-full">
        <div className="flex gap-16 animate-[marquee_30s_linear_infinite] w-max">
          {[1, 2].map((group) => (
            <div key={group} className="flex gap-16 text-[#8B94AA] font-mono text-xs tracking-[0.15em] uppercase">
              <span><strong className="text-[#00E57A]">✦</strong> Tugas Akademik</span>
              <span><strong className="text-[#00E57A]">✦</strong> Skripsi & Tugas Akhir</span>
              <span><strong className="text-[#00E57A]">✦</strong> Project digital</span>
              <span><strong className="text-[#00E57A]">✦</strong> Website & coding</span>
              <span><strong className="text-[#00E57A]">✦</strong> Laporan Praktikum</span>
              <span><strong className="text-[#00E57A]">✦</strong> Presentasi PPT</span>
              <span><strong className="text-[#00E57A]">✦</strong> Desain Figma UI/UX</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Counter Section */}
      <section className="border-b border-white/5 bg-[#0C0E18]/50">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="font-display text-4xl font-extrabold text-[#00E57A]">500+</div>
            <div className="font-mono text-[10px] text-[#444D62] uppercase tracking-wider mt-1">Proyek Selesai</div>
          </div>
          <div className="text-center">
            <div className="font-display text-4xl font-extrabold text-[#F5C842]">100%</div>
            <div className="font-mono text-[10px] text-[#444D62] uppercase tracking-wider mt-1">Selesai On-time</div>
          </div>
          <div className="text-center">
            <div className="font-display text-4xl font-extrabold text-[#38BDF8]">&lt; 1 Jam</div>
            <div className="font-mono text-[10px] text-[#444D62] uppercase tracking-wider mt-1">Rata-rata respons</div>
          </div>
          <div className="text-center">
            <div className="font-display text-4xl font-extrabold text-white">3+ Tahun</div>
            <div className="font-mono text-[10px] text-[#444D62] uppercase tracking-wider mt-1">Pengalaman Layanan</div>
          </div>
        </div>
      </section>

      {/* Layanan */}
      <section id="layanan" className="max-w-7xl mx-auto px-6 py-24 sm:py-32">
        <div className="flex flex-col items-start gap-2 mb-16">
          <div className="font-mono text-xs text-[#00E57A] tracking-widest uppercase">// layanan utama</div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight">
            Apa yang bisa<br />kami selesaikan?
          </h2>
          <p className="text-[#8B94AA] text-sm mt-2 max-w-md text-left">
            Semua dikerjakan dari nol oleh tim spesialis yang handal di bidang akademik, fungsional, dan pemrograman digital.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-[#0C0E18] border border-white/5 rounded-2xl p-8 flex flex-col justify-between hover:border-[#00e57a]/20 hover:-translate-y-1 transition-all group">
            <div>
              <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-6">01 — AKADEMIK</div>
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-2xl mb-6">📄</div>
              <h3 className="font-display text-xl font-bold tracking-tight text-white mb-3">Tugas Akademik</h3>
              <p className="text-[#8B94AA] text-sm leading-relaxed mb-6">
                Pembuatan makalah komprehensif, esai argumentatif, artikel penelitian, laporan praktikum laboratorium, dan slide materi presentasi yang rapi.
              </p>
            </div>
            <div>
              <div className="text-xs text-[#444D62] uppercase font-mono tracking-widest mb-1">Mulai Dari</div>
              <div className="font-display text-2xl font-extrabold text-[#00E57A] mb-4">Rp50.000</div>
              <ul className="text-xs font-mono text-[#8B94AA]/80 space-y-2 border-t border-white/5 pt-4">
                <li className="flex items-center gap-2">🕹 Makalah & Esai</li>
                <li className="flex items-center gap-2">🕹 Laporan Praktikum</li>
                <li className="flex items-center gap-2">🕹 Visual Presentasi & PPT</li>
              </ul>
            </div>
          </div>

          {/* Card 2 Featured */}
          <div className="bg-gradient-to-b from-[#0C0E18] to-[#121829] border border-[#00E57A]/25 rounded-2xl p-8 flex flex-col justify-between hover:border-[#00e57a]/50 hover:-translate-y-1 transition-all relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-[#F5C842] text-[#1a0f00] font-mono text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Terpopuler
            </div>
            <div>
              <div className="font-mono text-[10px] text-[#F5C842] uppercase tracking-widest mb-6">02 — TUGAS AKHIR</div>
              <div className="w-12 h-12 bg-[#00E57A]/10 rounded-xl flex items-center justify-center text-2xl mb-6">🎓</div>
              <h3 className="font-display text-xl font-bold tracking-tight text-white mb-3">Skripsi & Thesis</h3>
              <p className="text-[#8B94AA] text-sm leading-relaxed mb-6">
                Pendampingan pembuatan skripsi penuh dari Bab 1 hingga Bab 5, proposal seminar, analisis data, revisi sepuasnya tanpa biaya tambahan sampai sidang kelulusan.
              </p>
            </div>
            <div>
              <div className="text-xs text-[#444D62] uppercase font-mono tracking-widest mb-1">Mulai Dari</div>
              <div className="font-display text-2xl font-extrabold text-[#00E57A] mb-4">Rp250.000</div>
              <ul className="text-xs font-mono text-[#8B94AA]/80 space-y-2 border-t border-white/5 pt-4">
                <li className="flex items-center gap-2">🛡 Bab 1–5 Lengkap</li>
                <li className="flex items-center gap-2">🛡 Pendampingan Sidang</li>
                <li className="flex items-center gap-2">🛡 Bebas Revisi Sepuasnya</li>
              </ul>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#0C0E18] border border-white/5 rounded-2xl p-8 flex flex-col justify-between hover:border-[#00e57a]/20 hover:-translate-y-1 transition-all group">
            <div>
              <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-6">03 — DIGITAL</div>
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-2xl mb-6">💻</div>
              <h3 className="font-display text-xl font-bold tracking-tight text-white mb-3">Digital Project</h3>
              <p className="text-[#8B94AA] text-sm leading-relaxed mb-6">
                Rancangan website responsif, landing page interaktif, coding program, aplikasi mobile sederhana, figma UI/UX, database terstruktur, dan dokumentasi source code.
              </p>
            </div>
            <div>
              <div className="text-xs text-[#444D62] uppercase font-mono tracking-widest mb-1">Mulai Dari</div>
              <div className="font-display text-2xl font-extrabold text-[#00E57A] mb-4">Rp350.000</div>
              <ul className="text-xs font-mono text-[#8B94AA]/80 space-y-2 border-t border-white/5 pt-4">
                <li className="flex items-center gap-2">⚙ Web & Landing Page</li>
                <li className="flex items-center gap-2">⚙ UI/UX Design Figma</li>
                <li className="flex items-center gap-2">⚙ Kode & Debug Program</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tables */}
      <section id="pricing" className="bg-[#0C0E18] border-y border-white/5 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-start gap-2 mb-16">
            <div className="font-mono text-xs text-[#00E57A] tracking-widest uppercase">// tarif transparan</div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight">
              Daftar Harga & Tarif
            </h2>
            <p className="text-[#8B94AA] text-sm mt-1 max-w-md text-left">
              Harga adil berdasarkan tingkat kompleksitas riset dan waktu deadline yang Anda tentukan. Konsultasikan rincian tugas untuk penawaran terbaik.
            </p>
              {/* Left Column: Pricing tables or cards list */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-8">
              {searchQuery && (
                <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-xl px-5 py-3 text-xs animate-fadeIn">
                  <div className="text-[#8B94AA] text-left">
                    Menampilkan <span className="text-[#00E57A] font-bold">{filteredServices.length}</span> layanan untuk pencarian "<span className="text-white font-semibold">{searchQuery}</span>"
                  </div>
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="text-[#00E57A] hover:underline font-mono text-[10px] uppercase font-bold shrink-0 ml-4"
                  >
                    Reset
                  </button>
                </div>
              )}

              {filteredServices.length === 0 ? (
                <div className="bg-[#111420] border border-white/5 rounded-2xl p-10 text-center space-y-4">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-xl mx-auto">🔍</div>
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-white text-base">Layanan Tidak Ditemukan</h4>
                    <p className="text-xs text-[#8B94AA] max-w-sm mx-auto leading-relaxed">
                      Kami tidak dapat menemukan layanan dengan kata kunci tersebut. Silakan ketik kata kunci lain atau tanyakan langsung pada Admin kami.
                    </p>
                  </div>
                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={() => setSearchQuery("")}
                      className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-mono text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-xl font-bold transition-all"
                    >
                      Reset Filter
                    </button>
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}`}
                      target="_blank"
                      className="bg-[#00E57A]/10 border border-[#00E57A]/20 hover:bg-[#00E57A]/20 text-[#00E57A] font-mono text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-xl font-bold transition-all"
                    >
                      Tanya Admin
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  <div className="hidden sm:block overflow-hidden border border-white/5 rounded-xl">
                    <table className="w-full text-left font-sans text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-[#111420] border-b border-white/10">
                          <th className="p-4 font-mono uppercase tracking-wider text-xs font-bold text-[#8B94AA]">Jenis Layanan</th>
                          <th className="p-4 font-mono uppercase tracking-wider text-xs font-bold text-[#8B94AA]">Estimasi Tarif</th>
                          <th className="p-4 font-mono uppercase tracking-wider text-xs font-bold text-[#8B94AA]">Kategori</th>
                          <th className="p-4 font-mono uppercase tracking-wider text-xs font-bold text-[#8B94AA]">Lama Pengerjaan</th>
                          <th className="p-4 font-mono uppercase tracking-wider text-xs font-bold text-[#8B94AA] text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredServices.map((svc) => (
                          <tr key={svc.id} className="hover:bg-white/[0.02] transition-colors group/row">
                            <td className="p-4 text-left">
                              <div className="font-display font-bold text-white text-base">{svc.name}</div>
                              {/* Technical Complexity Progress Bar */}
                              <div className="mt-2.5 max-w-[220px] space-y-1">
                                <div className="flex justify-between items-center text-[10px] font-mono">
                                  <span className="text-[#8B94AA]">Kerumitan Teknis</span>
                                  <span className="text-[#00E57A] font-bold">{svc.difficultyLabel}</span>
                                </div>
                                <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                                  <div 
                                    className="bg-gradient-to-r from-[#00E57A] to-[#38BDF8] h-full rounded-full transition-all duration-500" 
                                    style={{ width: `${svc.complexity}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="p-4 font-mono text-[#00E57A] text-sm font-semibold">{svc.priceFrom}</td>
                            <td className="p-4">
                              <span className={`inline-block text-[9px] font-bold font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                                svc.category === "akademik" 
                                ? "border-[#38BDF8]/20 text-[#38BDF8] bg-[#38BDF8]/5" 
                                : svc.category === "tugas akhir"
                                ? "border-[#F5C842]/20 text-[#F5C842] bg-[#F5C842]/5"
                                : "border-[#00E57A]/20 text-[#00E57A] bg-[#00E57A]/5"
                              }`}>
                                {svc.category}
                              </span>
                            </td>
                            <td className="p-4 font-mono text-[#8B94AA] text-xs">{svc.estimation}</td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => {
                                  const msg = `Halo Admin TugasKu 👋 Saya tertarik untuk konsultasi mengenai layanan: *${svc.name}* (Kategori: ${svc.category.toUpperCase()}). Bagaimana prosedur pemesanannya?`;
                                  openWhatsApp(msg);
                                  showToast(`Membuka WhatsApp untuk layanan ${svc.name}... 💬`);
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00E57A]/10 hover:bg-[#00E57A]/20 border border-[#00E57A]/20 text-[#00E57A] font-mono text-[10px] font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,229,122,0.05)] hover:scale-[1.03]"
                              >
                                <MessageCircle className="w-3.5 h-3.5 fill-[#00E57A]/10 shrink-0" />
                                <span>Tanya Admin</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Desktop/Mobile Card Fallback for Tables */}
                  <div className="sm:hidden space-y-4">
                    {filteredServices.map((svc) => (
                      <div key={svc.id} className="bg-[#111420] border border-white/5 rounded-xl p-5 space-y-4 text-left animate-fadeIn">
                        <div className="flex justify-between items-start gap-2">
                          <div className="space-y-1.5 flex-1">
                            <span className="font-display font-extrabold text-white text-base block">{svc.name}</span>
                            {/* Mobile Technical Complexity Progress Bar */}
                            <div className="w-full max-w-[180px] space-y-1 mt-1">
                              <div className="flex justify-between items-center text-[9px] font-mono">
                                <span className="text-[#8B94AA]">Kerumitan:</span>
                                <span className="text-[#00E57A] font-bold">{svc.difficultyLabel}</span>
                              </div>
                              <div className="w-full bg-white/[0.06] h-1 rounded-full overflow-hidden">
                                <div 
                                  className="bg-gradient-to-r from-[#00E57A] to-[#38BDF8] h-full rounded-full" 
                                  style={{ width: `${svc.complexity}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          <span className={`text-[8px] font-bold font-mono uppercase px-2 py-0.5 rounded-full border shrink-0 ${
                            svc.category === 'akademik' ? 'border-[#38BDF8]/20 text-[#38BDF8]' : svc.category === 'tugas akhir' ? 'border-[#F5C842]/20 text-[#F5C842]' : 'border-[#00E57A]/20 text-[#00E57A]'
                          }`}>
                            {svc.category}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs pt-2 border-t border-white/[0.03] gap-2">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-[#8B94AA]">Mulai: <b className="text-[#00E57A] font-mono">{svc.priceFrom}</b></span>
                            <span className="text-[10px] text-[#8B94AA] font-mono mt-0.5">{svc.estimation}</span>
                          </div>
                          <button
                            onClick={() => {
                              const msg = `Halo Admin TugasKu 👋 Saya tertarik untuk konsultasi mengenai layanan: *${svc.name}* (Kategori: ${svc.category.toUpperCase()}). Bagaimana prosedur pemesanannya?`;
                              openWhatsApp(msg);
                              showToast(`Membuka WhatsApp untuk layanan ${svc.name}... 💬`);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#00E57A]/10 hover:bg-[#00E57A]/20 border border-[#00E57A]/20 text-[#00E57A] font-mono text-[9px] font-bold uppercase tracking-wider transition-all shadow-[0_0_10px_rgba(0,229,122,0.05)] active:scale-95 shrink-0"
                          >
                            <MessageCircle className="w-3 h-3 fill-[#00E57A]/10 shrink-0" />
                            <span>Tanya Admin</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Right Column: Interactive Price Calculator Widget */}
            <div className="lg:col-span-5 xl:col-span-4 bg-[#111420] border border-white/5 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#00E57A]/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-2 mb-6">
                <Calculator className="w-5 h-5 text-[#00E57A]" />
                <h3 className="font-display font-bold text-white text-lg">Kalkulator Estimasi</h3>
              </div>

              <div className="space-y-5">
                {/* 1. Pilih Layanan */}
                <div>
                  <label className="block text-xs font-mono text-[#8B94AA] uppercase tracking-wider mb-2 text-left">1. Jenis Layanan</label>
                  <select
                    value={calcService}
                    onChange={(e) => {
                      setCalcService(e.target.value);
                      // Reset Volume to reasonable defaults based on category
                      if (["1", "2"].includes(e.target.value)) {
                        setCalcVolume(5); // default pages
                      } else if (e.target.value === "3") {
                        setCalcVolume(10); // default slides
                      } else if (e.target.value === "5") {
                        setCalcVolume(3); // default bab
                      } else {
                        setCalcVolume(1); // default features/pages
                      }
                    }}
                    className="w-full bg-[#0C0E18] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00E57A] transition-all cursor-pointer font-medium"
                  >
                    {servicesData.map((svc) => (
                      <option key={svc.id} value={svc.id} className="bg-[#111420]">
                        {svc.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Volume Slider / Input */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-mono text-[#8B94AA] uppercase tracking-wider text-left">2. {getVolumeLabel()}</label>
                    <span className="font-mono text-sm text-[#00E57A] font-bold bg-[#00E57A]/10 border border-[#00E57A]/20 px-2 py-0.5 rounded-lg">
                      {calcVolume} {calcService === "3" ? "Slide" : calcService === "5" ? "Bab" : "Halaman"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max={calcService === "5" ? "5" : calcService === "3" ? "30" : "40"}
                    value={calcVolume}
                    onChange={(e) => setCalcVolume(parseInt(e.target.value))}
                    className="w-full h-1 bg-[#0C0E18] rounded-lg appearance-none cursor-pointer accent-[#00E57A]"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-[#8B94AA]/60 mt-1">
                    <span>1</span>
                    <span>{calcService === "5" ? "5" : calcService === "3" ? "30" : "40"}</span>
                  </div>
                </div>

                {/* 3. Tingkat Kesulitan */}
                <div>
                  <label className="block text-xs font-mono text-[#8B94AA] uppercase tracking-wider mb-2 text-left">3. Tingkat Kesulitan</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: "mudah", label: "Mudah", desc: "Tugas Standar" },
                      { key: "sedang", label: "Sedang", desc: "Analisis Dasar" },
                      { key: "sulit", label: "Sulit", desc: "Riset/Koding" },
                      { key: "sangat_sulit", label: "Advanced", desc: "Tingkat Tinggi" }
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setCalcDifficulty(opt.key as any)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          calcDifficulty === opt.key
                            ? "bg-[#00E57A]/5 border-[#00E57A] text-white"
                            : "bg-[#0C0E18] border-white/5 text-[#8B94AA] hover:border-white/10"
                        }`}
                      >
                        <div className="text-xs font-bold font-display">{opt.label}</div>
                        <div className="text-[9px] font-mono opacity-80 mt-0.5">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Prioritas Deadline */}
                <div>
                  <label className="block text-xs font-mono text-[#8B94AA] uppercase tracking-wider mb-2 text-left">4. Prioritas Deadline</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: "santai", label: "Santai", info: "> 7 Hari" },
                      { key: "normal", label: "Normal", info: "3-6 Hari" },
                      { key: "cepat", label: "Rush Order", info: "1-2 Hari" }
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setCalcDeadline(opt.key as any)}
                        className={`py-2 px-1 rounded-xl border text-center transition-all ${
                          calcDeadline === opt.key
                            ? "bg-[#38BDF8]/5 border-[#38BDF8] text-white"
                            : "bg-[#0C0E18] border-white/5 text-[#8B94AA] hover:border-white/10"
                        }`}
                      >
                        <div className="text-xs font-bold font-display">{opt.label}</div>
                        <div className="text-[9px] font-mono opacity-80 mt-0.5">{opt.info}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Perbandingan Opsi Pengiriman Table */}
                <div className="mt-4 border border-white/5 rounded-xl overflow-hidden bg-[#0C0E18] text-left">
                  <div className="bg-white/[0.02] border-b border-white/5 px-4 py-2 flex items-center justify-between">
                    <span className="text-[9px] font-mono text-[#8B94AA] uppercase tracking-wider">Perbandingan Pengiriman</span>
                    <span className="text-[8px] bg-[#00E57A]/10 text-[#00E57A] border border-[#00E57A]/20 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-tight">Live Calc</span>
                  </div>
                  <table className="w-full text-left font-sans text-xs">
                    <thead>
                      <tr className="bg-white/[0.01] border-b border-white/5">
                        <th className="p-2.5 font-mono text-[8px] uppercase font-bold text-[#8B94AA]">Jenis</th>
                        <th className="p-2.5 font-mono text-[8px] uppercase font-bold text-[#8B94AA]">Durasi</th>
                        <th className="p-2.5 font-mono text-[8px] uppercase font-bold text-[#8B94AA] text-right">Estimasi Tarif</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr 
                        onClick={() => setCalcDeadline("normal")}
                        className={`cursor-pointer hover:bg-white/[0.02] transition-colors ${calcDeadline === "normal" ? "bg-[#38BDF8]/5 text-white" : "text-[#8B94AA]"}`}
                      >
                        <td className="p-2.5 flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${calcDeadline === "normal" ? "bg-[#38BDF8]" : "bg-[#8B94AA]/40"}`}></span>
                          <span className={`font-semibold ${calcDeadline === "normal" ? "text-white" : "text-white/80"}`}>Standard</span>
                        </td>
                        <td className="p-2.5 font-mono text-[10px]">3-6 Hari</td>
                        <td className={`p-2.5 font-mono font-bold text-[10px] text-right ${calcDeadline === "normal" ? "text-[#38BDF8]" : "text-white/90"}`}>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0
                          }).format(getCustomEstimateForDeadline("normal"))}
                        </td>
                      </tr>
                      <tr 
                        onClick={() => setCalcDeadline("cepat")}
                        className={`cursor-pointer hover:bg-white/[0.02] transition-colors ${calcDeadline === "cepat" ? "bg-[#00E57A]/5 text-white" : "text-[#8B94AA]"}`}
                      >
                        <td className="p-2.5 flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${calcDeadline === "cepat" ? "bg-[#00E57A]" : "bg-[#8B94AA]/40"}`}></span>
                          <span className={`font-semibold ${calcDeadline === "cepat" ? "text-[#00E57A]" : "text-white/80"}`}>Rush Order ⚡</span>
                        </td>
                        <td className="p-2.5 font-mono text-[10px]">1-2 Hari</td>
                        <td className={`p-2.5 font-mono font-bold text-[10px] text-right ${calcDeadline === "cepat" ? "text-[#00E57A]" : "text-white/90"}`}>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0
                          }).format(getCustomEstimateForDeadline("cepat"))}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 5. Kode Promo / Kupon */}
                <div className="pt-2 border-t border-white/5">
                  <label className="block text-xs font-mono text-[#8B94AA] uppercase tracking-wider mb-2 text-left">5. Kode Promo / Kupon</label>
                  {!appliedPromo ? (
                    <div className="space-y-1.5 text-left">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Contoh: NIRAABESTIE"
                          value={promoCodeInput}
                          onChange={(e) => {
                            setPromoCodeInput(e.target.value);
                            setPromoError(null);
                          }}
                          className="flex-1 bg-[#0C0E18] border border-white/10 rounded-xl px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-[#00E57A] font-mono"
                        />
                        <button
                          type="button"
                          onClick={handleApplyPromo}
                          className="bg-[#00E57A]/10 hover:bg-[#00E57A]/20 border border-[#00E57A]/20 text-[#00E57A] font-mono text-xs px-4 py-2 rounded-xl font-bold transition-all"
                        >
                          Gunakan
                        </button>
                      </div>
                      <div className="flex flex-col gap-1 mt-1 text-[10px] text-[#8B94AA] font-mono">
                        <span>💡 Gunakan <span className="text-[#00E57A] font-bold">NIRAABESTIE</span> (Diskon 15%) atau <span className="text-[#00E57A] font-bold">SKRIPSION</span> (Diskon 20%)</span>
                      </div>
                      {promoError && (
                        <p className="text-[10px] text-red-400 mt-1 font-mono leading-tight">{promoError}</p>
                      )}
                    </div>
                  ) : (
                    <div className="bg-[#00E57A]/5 border border-[#00E57A]/20 rounded-xl p-3 flex items-center justify-between text-left">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#00E57A]/10 border border-[#00E57A]/20 flex items-center justify-center">
                          <Percent className="w-3.5 h-3.5 text-[#00E57A]" />
                        </div>
                        <div>
                          <span className="text-[10px] text-[#8B94AA] block font-mono">KUPON TERPASANG</span>
                          <span className="text-xs font-bold text-white font-mono">
                            {appliedPromo} (-{appliedPromo === "SKRIPSION" ? "20" : appliedPromo === "NIRAABESTIE" ? "15" : "10"}%)
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemovePromo}
                        className="text-[#8B94AA] hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all"
                        title="Hapus kupon"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Total Estimate display */}
                <div className="bg-[#0C0E18] border border-white/5 rounded-2xl p-5 text-center mt-6 relative overflow-hidden text-left">
                  {appliedPromo ? (
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center text-xs font-mono text-[#8B94AA]">
                        <span>Tarif Standar</span>
                        <span className="line-through">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0
                          }).format(getRawCalculatorEstimate())}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-mono text-[#00E57A]">
                        <span>Potongan Kupon</span>
                        <span>
                          -{new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0
                          }).format(getRawCalculatorEstimate() - getCalculatorEstimate())}
                        </span>
                      </div>
                      <div className="border-t border-white/5 pt-2 flex justify-between items-end">
                        <div>
                          <span className="text-[10px] font-mono text-[#8B94AA] uppercase tracking-widest block mb-0.5">ESTIMASI TOTAL TARIF</span>
                          <span className="text-xl sm:text-2xl font-display font-extrabold text-[#00E57A] tracking-tight">
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              maximumFractionDigits: 0
                            }).format(getCalculatorEstimate())}
                          </span>
                        </div>
                        <span className="text-[9px] bg-[#00E57A]/10 text-[#00E57A] border border-[#00E57A]/20 px-2 py-0.5 rounded-md font-mono font-bold animate-pulse">HEMAT!</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-[10px] font-mono text-[#8B94AA] uppercase tracking-widest mb-1">
                        Estimasi Total Tarif
                      </div>
                      <div className="font-display text-2xl sm:text-3xl font-extrabold text-[#00E57A] tracking-tight">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0
                        }).format(getCalculatorEstimate())}
                      </div>
                    </div>
                  )}
                  <p className="text-[9px] text-[#8B94AA]/60 mt-2 font-mono italic text-center block">
                    *Tarif final dapat disesuaikan kembali via WhatsApp chat.
                  </p>
                </div>

                {/* Submit button */}
                <button
                  onClick={handleCalculatorWA}
                  className="w-full bg-[#00E57A] text-black font-display font-extrabold text-sm py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#00c96a] active:scale-95 transition-all shadow-[0_0_20px_rgba(0,229,122,0.15)]"
                >
                  <MessageCircle className="w-4 h-4 fill-black" />
                  <span>Klaim Kupon & Pesan Sekarang</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonial" className="bg-[#0C0E18]/40 border-b border-white/5 py-24 relative overflow-hidden">
        {/* Background decorative spot lights */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-[#00E57A]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[#38BDF8]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="flex flex-col items-start gap-2">
              <div className="font-mono text-xs text-[#00E57A] tracking-widest uppercase">// ulasan tepercaya</div>
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight">
                Ulasan Puas Mahasiswa
              </h2>
              <p className="text-[#8B94AA] text-sm mt-1 max-w-md text-left">
                Ribuan mahasiswa dari berbagai kampus ternama di Indonesia telah membuktikan kualitas layanan pengerjaan cepat dan bebas plagiat dari TugasKu.
              </p>
            </div>

            {/* Layout Toggle Switcher */}
            <div className="flex items-center bg-[#07080D] p-1 border border-white/5 rounded-xl self-start md:self-auto">
              <button
                onClick={() => setTestimonialMode("slide")}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-medium rounded-lg transition-all ${
                  testimonialMode === "slide"
                    ? "bg-[#1E2333] text-[#00E57A] shadow-inner"
                    : "text-[#8B94AA] hover:text-white"
                }`}
                title="Tampilan Slide"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Slide Otomatis</span>
              </button>
              <button
                onClick={() => setTestimonialMode("grid")}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-medium rounded-lg transition-all ${
                  testimonialMode === "grid"
                    ? "bg-[#1E2333] text-[#00E57A] shadow-inner"
                    : "text-[#8B94AA] hover:text-white"
                }`}
                title="Tampilan Grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid Ulasan</span>
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {testimonialMode === "slide" ? (
              /* Auto-sliding Carousel */
              <motion.div
                key="carousel"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="relative max-w-4xl mx-auto"
              >
                {/* Main Card View */}
                <div className="bg-gradient-to-b from-[#111420] to-[#0C0E18] border border-white/5 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
                  {/* Big quotation mark */}
                  <div className="absolute top-6 right-8 text-[#00E57A]/10 pointer-events-none">
                    <Quote className="w-24 h-24 stroke-[1.5]" />
                  </div>

                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonialsData[currentTestimonialIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-[#F5C842] fill-[#F5C842]" />
                    ))}
                  </div>

                  {/* Testimonial text with animation */}
                  <div className="min-h-[140px] flex items-center mb-8">
                    <p className="text-white text-lg sm:text-xl font-display font-medium leading-relaxed text-left italic">
                      "{testimonialsData[currentTestimonialIndex].comment}"
                    </p>
                  </div>

                  {/* Client Info Block */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-t border-white/5 pt-8">
                    <div className="flex items-center gap-4">
                      {/* Avatar initials fallback */}
                      <div className="w-12 h-12 rounded-full bg-[#00E57A]/10 border border-[#00E57A]/20 flex items-center justify-center font-display font-bold text-lg text-[#00E57A] shrink-0">
                        {testimonialsData[currentTestimonialIndex].name.charAt(0)}
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <h4 className="font-display font-bold text-white text-base">
                            {testimonialsData[currentTestimonialIndex].name}
                          </h4>
                          <span className="bg-[#00E57A]/10 text-[#00E57A] border border-[#00E57A]/20 font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00E57A] animate-pulse" /> Terverifikasi
                          </span>
                        </div>
                        <p className="text-xs text-[#8B94AA] font-mono mt-0.5">
                          {testimonialsData[currentTestimonialIndex].major} &bull; {testimonialsData[currentTestimonialIndex].university}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end gap-3.5">
                      <div className="flex flex-col items-start sm:items-end">
                        <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
                          Layanan Dipesan
                        </div>
                        <div className="text-xs text-[#38BDF8] font-mono font-semibold mt-1">
                          {testimonialsData[currentTestimonialIndex].service}
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono mt-0.5">
                          {testimonialsData[currentTestimonialIndex].date}
                        </span>
                      </div>
                      <button
                        onClick={() => handleHelpfulVote(testimonialsData[currentTestimonialIndex].id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-[10px] font-bold uppercase transition-all duration-300 ${
                          helpfulVoted.includes(testimonialsData[currentTestimonialIndex].id)
                            ? "bg-[#00E57A]/10 border-[#00E57A]/30 text-[#00E57A] shadow-[0_0_15px_rgba(0,229,122,0.1)]"
                            : "bg-white/5 border-white/5 text-[#8B94AA] hover:border-white/10 hover:text-white"
                        }`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${helpfulVoted.includes(testimonialsData[currentTestimonialIndex].id) ? "fill-[#00E57A]/20" : ""}`} />
                        <span>Membantu ({ (testimonialsData[currentTestimonialIndex].helpfulCount || 0) + (localHelpfulVotes[testimonialsData[currentTestimonialIndex].id] || 0) })</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Left/Right manual slide buttons */}
                <div className="flex justify-between items-center mt-8 px-4">
                  <div className="flex items-center gap-1.5">
                    {testimonialsData.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentTestimonialIndex(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          currentTestimonialIndex === idx 
                            ? "w-8 bg-[#00E57A]" 
                            : "w-2 bg-[#8B94AA]/20 hover:bg-[#8B94AA]/40"
                        }`}
                        title={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => 
                        setCurrentTestimonialIndex((prev) => prev === 0 ? testimonialsData.length - 1 : prev - 1)
                      }
                      className="w-10 h-10 rounded-xl bg-[#111420] border border-white/5 flex items-center justify-center text-white hover:text-[#00E57A] hover:border-[#00E57A]/30 transition-colors"
                      title="Sebelumnya"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => 
                        setCurrentTestimonialIndex((prev) => prev === testimonialsData.length - 1 ? 0 : prev + 1)
                      }
                      className="w-10 h-10 rounded-xl bg-[#111420] border border-white/5 flex items-center justify-center text-white hover:text-[#00E57A] hover:border-[#00E57A]/30 transition-colors"
                      title="Berikutnya"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Bento Grid View of all testimonials */
              <motion.div
                key="grid"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {testimonialsData.map((testi) => (
                  <div
                    key={testi.id}
                    className="bg-[#111420] border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-[#00e57a]/20 hover:-translate-y-1 transition-all group"
                  >
                    <div>
                      {/* Rating & Date */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-0.5">
                          {[...Array(testi.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-[#F5C842] fill-[#F5C842]" />
                          ))}
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {testi.date}
                        </span>
                      </div>

                      {/* Comment */}
                      <p className="text-white/90 text-sm leading-relaxed text-left mb-6 font-medium italic">
                        "{testi.comment}"
                      </p>
                    </div>

                    {/* Author footer */}
                    <div className="border-t border-white/5 pt-4 mt-auto">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#00E57A]/10 border border-[#00E57A]/20 flex items-center justify-center font-display font-bold text-sm text-[#00E57A] shrink-0">
                          {testi.name.charAt(0)}
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-display font-bold text-white text-xs">
                              {testi.name}
                            </h4>
                            <span className="bg-[#00E57A]/10 text-[#00E57A] border border-[#00E57A]/10 font-mono text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full">
                              ✓ Verified
                            </span>
                          </div>
                          <p className="text-[10px] text-[#8B94AA] font-mono leading-none mt-0.5">
                            {testi.major} &bull; {testi.university}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-white/[0.02] flex items-center justify-between text-[10px] font-mono">
                        <span className="text-zinc-500 uppercase tracking-wider">Layanan</span>
                        <span className="text-[#38BDF8] font-semibold">{testi.service}</span>
                      </div>

                      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-zinc-500">Ulasan ini membantu?</span>
                        <button
                          onClick={() => handleHelpfulVote(testi.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono text-[9px] font-bold uppercase transition-all duration-300 ${
                            helpfulVoted.includes(testi.id)
                              ? "bg-[#00E57A]/10 border-[#00E57A]/30 text-[#00E57A]"
                              : "bg-white/5 border-white/5 text-[#8B94AA] hover:border-white/10 hover:text-white"
                          }`}
                        >
                          <ThumbsUp className={`w-3 h-3 ${helpfulVoted.includes(testi.id) ? "fill-[#00E57A]/20" : ""}`} />
                          <span>Ya ({ (testi.helpfulCount || 0) + (localHelpfulVotes[testi.id] || 0) })</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Social Proof Stats footer */}
          <div className="mt-16 pt-8 border-t border-white/5 flex flex-wrap justify-center items-center gap-8 text-center sm:text-left">
            <div className="flex items-center gap-2 font-mono text-xs text-[#8B94AA]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00E57A]" />
              <span>98.6% Mahasiswa Puas</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#8B94AA]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" />
              <span>Dikerjakan Akademisi Profesional</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#8B94AA]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F5C842]" />
              <span>Orisinalitas & Bebas Turnitin</span>
            </div>
          </div>

        </div>
      </section>

      {/* Tips Akademik Section */}
      <section id="tips-akademik" className="bg-[#0C0E18] border-y border-white/5 py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="flex flex-col items-start gap-2 text-left">
              <div className="font-mono text-xs text-[#00E57A] tracking-widest uppercase">// TIPS BELAJAR NIRAA AI</div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Tips & Wawasan Akademik
              </h2>
              <p className="text-[#8B94AA] text-sm mt-1 max-w-xl">
                Artikel ringkas, panduan menulis ilmiah, dan metode belajar efektif mingguan dari tim akademisi Niraa AI untuk mendongkrak performa kuliah Anda.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 shrink-0">
              {/* Tabs for All vs Bookmarked Tips */}
              <div className="flex items-center bg-[#07080D] p-1 border border-white/5 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveTipsTab("all")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-medium rounded-lg transition-all ${
                    activeTipsTab === "all"
                      ? "bg-[#1E2333] text-[#00E57A] shadow-inner font-bold"
                      : "text-[#8B94AA] hover:text-white"
                  }`}
                >
                  Semua Tips
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTipsTab("saved")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-medium rounded-lg transition-all ${
                    activeTipsTab === "saved"
                      ? "bg-[#1E2333] text-[#00E57A] shadow-inner font-bold"
                      : "text-[#8B94AA] hover:text-white"
                  }`}
                >
                  <span>Disimpan</span>
                  {bookmarkedTips.length > 0 && (
                    <span className="bg-[#00E57A] text-black text-[9px] font-extrabold px-1.5 py-0.5 rounded-full font-sans leading-none min-w-[15px] text-center">
                      {bookmarkedTips.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Quick Filter Status if Searching */}
              {searchQuery && (
                <div className="bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2 text-xs text-[#8B94AA] font-mono">
                  Pencarian: <span className="text-[#00E57A] font-bold">{filteredTips.length}</span> hasil
                </div>
              )}
            </div>
          </div>

          {displayedTips.length === 0 ? (
            activeTipsTab === "saved" && bookmarkedTips.length === 0 ? (
              <div className="bg-[#111420] border border-white/5 rounded-2xl p-12 text-center max-w-md mx-auto space-y-4 animate-fadeIn">
                <div className="w-12 h-12 bg-[#00E57A]/10 border border-[#00E57A]/20 rounded-xl flex items-center justify-center text-xl mx-auto text-[#00E57A]">💾</div>
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-white text-base">Belum Ada Tips Disimpan</h4>
                  <p className="text-xs text-[#8B94AA] leading-relaxed">
                    Belum ada tips yang kamu simpan nih, bestie. Klik tombol bookmark <Bookmark className="inline w-3 h-3 text-[#00E57A] fill-[#00E57A]/10 align-middle" /> di setiap tips akademik yang menurutmu menarik untuk dibaca lagi nanti! 💖
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTipsTab("all")}
                  className="bg-[#00E57A]/10 border border-[#00E57A]/20 hover:bg-[#00E57A]/20 text-[#00E57A] font-mono text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-xl font-bold transition-all"
                >
                  Lihat Semua Tips
                </button>
              </div>
            ) : (
              <div className="bg-[#111420] border border-white/5 rounded-2xl p-12 text-center max-w-md mx-auto space-y-4">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-xl mx-auto">📚</div>
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-white text-base">Tips Tidak Ditemukan</h4>
                  <p className="text-xs text-[#8B94AA] leading-relaxed">
                    Kami tidak menemukan tips belajar dengan kata kunci tersebut. Coba cari dengan kata kunci lain.
                  </p>
                </div>
                <button
                  onClick={() => setSearchQuery("")}
                  className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-mono text-[10px] uppercase tracking-wider px-4 py-2 rounded-lg font-bold transition-all"
                >
                  Reset Pencarian
                </button>
              </div>
            )
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {displayedTips.map((tip) => {
                const totalLikes = tip.likes + (localTipLikes[tip.id] || 0);
                const hasLiked = likedTips.includes(tip.id);
                const isBookmarked = bookmarkedTips.includes(tip.id);

                return (
                  <div 
                    key={tip.id} 
                    className="bg-[#111420] border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-[#00E57A]/30 transition-all duration-300 group cursor-pointer"
                    onClick={() => setSelectedTip(tip)}
                  >
                    <div className="space-y-4">
                      {/* Badge and reading time */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#38BDF8]/20 text-[#38BDF8] bg-[#38BDF8]/5">
                          {tip.category}
                        </span>
                        <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#8B94AA]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{tip.readTime}</span>
                        </div>
                      </div>

                      {/* Title & Summary */}
                      <div className="space-y-2 text-left">
                        <h3 className="font-display font-bold text-white text-lg leading-snug group-hover:text-[#00E57A] transition-colors line-clamp-2">
                          {tip.title}
                        </h3>
                        <p className="text-xs text-[#8B94AA] leading-relaxed line-clamp-3">
                          {tip.summary}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
                      {/* Author & Date */}
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#00E57A]/10 border border-[#00E57A]/20 flex items-center justify-center text-[10px] text-[#00E57A] font-bold font-mono">
                          N
                        </div>
                        <div className="text-left leading-none">
                          <span className="text-[10px] font-bold text-white block">{tip.author}</span>
                          <span className="text-[8px] font-mono text-[#8B94AA]">{tip.date}</span>
                        </div>
                      </div>

                      {/* Interactive Likes & Bookmark buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleLikeTip(tip.id, e)}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border font-mono text-[10px] transition-all duration-300 ${
                            hasLiked 
                              ? "bg-red-500/10 border-red-500/20 text-red-400" 
                              : "bg-white/[0.02] border-white/5 text-[#8B94AA] hover:border-white/10 hover:text-white"
                          }`}
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? "fill-red-400 stroke-red-400" : ""}`} />
                          <span>{totalLikes}</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleToggleBookmarkTip(tip.id, e)}
                          className={`flex items-center justify-center p-2 rounded-xl border transition-all duration-300 ${
                            isBookmarked 
                              ? "bg-[#00E57A]/10 border-[#00E57A]/20 text-[#00E57A]" 
                              : "bg-white/[0.02] border-white/5 text-[#8B94AA] hover:border-white/10 hover:text-white"
                          }`}
                          title={isBookmarked ? "Hapus dari simpanan" : "Simpan tips"}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-[#00E57A]" : ""}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick learning motivation banner from Niraa AI */}
          <div className="mt-16 bg-gradient-to-r from-[#111420] via-[#111420]/80 to-[#111420] border border-white/5 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00E57A]" />
                <span className="font-mono text-xs text-[#00E57A] uppercase tracking-wider font-bold">Rekomendasi Niraa AI</span>
              </div>
              <h4 className="font-display font-bold text-white text-base">Butuh bimbingan khusus atau kustomisasi tugas akhir?</h4>
              <p className="text-xs text-[#8B94AA] max-w-xl">
                Niraa AI dapat menyesuaikan tingkat kerumitan, referensi, dan gaya penulisan agar sejalan dengan arahan dosen pembimbing Anda secara instan.
              </p>
            </div>
            <a
              href="#form-section"
              className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-mono text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl font-bold transition-all whitespace-nowrap"
            >
              Konsultasi Instan
            </a>
          </div>

          {/* Newsletter Subscription Card */}
          <div className="mt-12 bg-gradient-to-br from-[#111420] to-[#161a29] border border-white/5 rounded-2xl p-8 sm:p-10 relative overflow-hidden text-left">
            {/* Ambient background blur */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#00E57A]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#38BDF8]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 md:max-w-md">
                <div className="inline-flex items-center gap-2 bg-[#00E57A]/10 border border-[#00E57A]/20 px-3 py-1 rounded-full text-[10px] font-mono font-bold text-[#00E57A] uppercase tracking-wider">
                  <Mail className="w-3 h-3" />
                  <span>NEWSLETTER NIRAA AI</span>
                </div>
                <h3 className="font-display font-bold text-white text-xl sm:text-2xl tracking-tight">
                  Dapatkan Tips Belajar Terbaik Setiap Minggu!
                </h3>
                <p className="text-xs text-[#8B94AA] leading-relaxed">
                  Bergabunglah dengan ribuan mahasiswa lainnya yang menerima rangkuman metode belajar, rekomendasi jurnal ilmiah, dan promosi khusus tugas akademik langsung di inbox email Anda.
                </p>
              </div>

              <div className="w-full md:max-w-sm">
                {newsletterSubscribed ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#00E57A]/10 border border-[#00E57A]/20 rounded-xl p-6 text-center space-y-2"
                  >
                    <div className="w-10 h-10 bg-[#00E57A]/20 rounded-full flex items-center justify-center text-lg mx-auto text-[#00E57A]">
                      ✓
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-display font-bold text-white text-sm">Terima Kasih Telah Berlangganan!</h4>
                      <p className="text-[11px] text-[#8B94AA] leading-relaxed">
                        Email Anda <span className="text-white font-mono font-semibold">{newsletterEmail}</span> telah terdaftar. Bersiaplah untuk tips akademik eksklusif minggu ini!
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        setNewsletterSubscribed(false);
                        setNewsletterEmail("");
                      }}
                      className="text-[10px] font-mono text-[#00E57A] hover:underline uppercase font-bold mt-2"
                    >
                      Daftarkan Email Lain
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8B94AA]">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        placeholder="Masukkan alamat email aktif Anda..."
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        className="w-full bg-[#07080D] border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-xs text-white placeholder-[#8B94AA]/60 focus:border-[#00E57A] focus:ring-1 focus:ring-[#00E57A] outline-none transition-all"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={newsletterLoading}
                      className="w-full bg-[#00E57A] text-black hover:bg-[#00ca6d] disabled:opacity-50 font-display font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(0,229,122,0.15)] flex items-center justify-center gap-2"
                    >
                      {newsletterLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          <span>Mendaftarkan...</span>
                        </>
                      ) : (
                        <span>Berlangganan Sekarang</span>
                      )}
                    </button>
                    <p className="text-[10px] text-center text-[#8B94AA]/60 leading-none">
                      🔒 Privasi terjaga 100%. Unsubscribe kapan saja dengan satu klik.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Tip Reader Modal Pop-up */}
      <AnimatePresence>
        {selectedTip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#07080D]/90 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedTip(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#111420] border border-white/10 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative light flare */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E57A]/5 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <span className="inline-block text-[10px] font-bold font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#38BDF8]/20 text-[#38BDF8] bg-[#38BDF8]/5">
                      {selectedTip.category}
                    </span>
                    <h3 className="font-display font-extrabold text-white text-xl sm:text-2xl leading-tight">
                      {selectedTip.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedTip(null)}
                    className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#8B94AA] py-3 border-y border-white/5">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{selectedTip.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{selectedTip.readTime} Baca</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{selectedTip.likes + (localTipLikes[selectedTip.id] || 0)} Menyukai</span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <p className="text-sm sm:text-base text-white/95 leading-relaxed font-sans whitespace-pre-line">
                    {selectedTip.content}
                  </p>
                </div>

                {/* Social Media Sharing Widget */}
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#00E57A]/10 border border-[#00E57A]/20 flex items-center justify-center text-[#00E57A] shrink-0">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-bold text-white leading-none">Bagikan Artikel Ini</h4>
                      <p className="text-[10px] text-[#8B94AA] mt-1">Sebarkan wawasan akademik ke rekan kuliah Anda!</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                    {/* WhatsApp */}
                    <button
                      onClick={() => {
                        const text = `*${selectedTip.title}*\n\n${selectedTip.summary}\n\nBaca selengkapnya tips akademik bermanfaat dari Niraa AI di: ${window.location.href}`;
                        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
                        showToast("Membuka WhatsApp untuk berbagi...");
                      }}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 text-[#25D366] rounded-xl text-[10px] font-mono font-bold transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-[#25D366]/10" />
                      <span>WhatsApp</span>
                    </button>
                    {/* Twitter */}
                    <button
                      onClick={() => {
                        const text = `Tips Belajar Seru: "${selectedTip.title}" - ${selectedTip.summary} via Niraa AI ✨`;
                        const url = window.location.href;
                        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
                        showToast("Membuka Twitter/X untuk berbagi...");
                      }}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 border border-[#1DA1F2]/20 text-[#1DA1F2] rounded-xl text-[10px] font-mono font-bold transition-all"
                    >
                      <Twitter className="w-3.5 h-3.5 fill-[#1DA1F2]/10" />
                      <span>Twitter</span>
                    </button>
                    {/* LinkedIn */}
                    <button
                      onClick={() => {
                        const url = window.location.href;
                        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
                        showToast("Membuka LinkedIn untuk berbagi...");
                      }}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border border-[#0A66C2]/20 text-[#0A66C2] rounded-xl text-[10px] font-mono font-bold transition-all"
                    >
                      <Linkedin className="w-3.5 h-3.5 fill-[#0A66C2]/10" />
                      <span>LinkedIn</span>
                    </button>
                    {/* Copy Link */}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        showToast("Tautan artikel berhasil disalin ke clipboard! 📋");
                      }}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-[#00E57A]/10 hover:bg-[#00E57A]/20 border border-[#00E57A]/20 text-[#00E57A] rounded-xl text-[10px] font-mono font-bold transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Salin</span>
                    </button>
                  </div>
                </div>

                {/* Tags and Close panel */}
                <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTip.tags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] font-mono text-[#8B94AA] bg-white/[0.02] px-2.5 py-1 rounded-lg border border-white/5">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => handleLikeTip(selectedTip.id, e)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border font-mono text-xs transition-all duration-300 ${
                        likedTips.includes(selectedTip.id) 
                          ? "bg-red-500/10 border-red-500/20 text-red-400" 
                          : "bg-white/[0.02] border-white/5 text-[#8B94AA] hover:border-white/10 hover:text-white"
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${likedTips.includes(selectedTip.id) ? "fill-red-400 stroke-red-400" : ""}`} />
                      <span>Suka</span>
                    </button>
                    <button
                      onClick={() => handleToggleBookmarkTip(selectedTip.id)}
                      className={`flex items-center justify-center p-2.5 rounded-xl border transition-all duration-300 ${
                        bookmarkedTips.includes(selectedTip.id) 
                          ? "bg-[#00E57A]/10 border-[#00E57A]/20 text-[#00E57A]" 
                          : "bg-white/[0.02] border-white/5 text-[#8B94AA] hover:border-white/10 hover:text-white"
                      }`}
                      title={bookmarkedTips.includes(selectedTip.id) ? "Hapus dari simpanan" : "Simpan tips"}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${bookmarkedTips.includes(selectedTip.id) ? "fill-[#00E57A]" : ""}`} />
                    </button>
                    <button
                      onClick={() => setSelectedTip(null)}
                      className="bg-[#00E57A] text-black font-display font-bold text-xs px-5 py-3 rounded-xl hover:bg-[#00ca6d] transition-all"
                    >
                      Selesai Membaca
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAQ Focus Mode Reader Modal Pop-up */}
      <AnimatePresence>
        {focusFaq && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#07080D]/95 backdrop-blur-lg z-50 flex items-center justify-center p-4 sm:p-6"
            onClick={() => setFocusFaq(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-[#111420] border border-white/10 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glowing Ambient Radial Effects */}
              <div className="absolute -top-10 -right-10 w-44 h-44 bg-[#00E57A]/10 rounded-full blur-[60px] pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-blue-500/5 rounded-full blur-[60px] pointer-events-none" />

              <div className="flex flex-col gap-6">
                {/* Header Row */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E57A] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E57A]"></span>
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#00E57A] bg-[#00E57A]/5 px-2.5 py-1 rounded-lg border border-[#00E57A]/10">
                      FAQ • {focusFaq.category}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setFocusFaq(null);
                      showToast("Mode Baca Fokus ditutup.");
                    }}
                    className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-all hover:scale-105 active:scale-95"
                    title="Tutup Mode Baca"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Question */}
                <div className="space-y-2">
                  <div className="font-mono text-[10px] text-[#8B94AA] uppercase tracking-widest">// pertanyaan fokus</div>
                  <h3 className="font-display font-extrabold text-white text-lg sm:text-2xl leading-snug tracking-tight">
                    {focusFaq.question}
                  </h3>
                </div>

                {/* Elegant Divider */}
                <div className="h-px bg-gradient-to-r from-[#00E57A]/30 via-white/5 to-transparent" />

                {/* Answer Content */}
                <div className="space-y-3 py-2">
                  <div className="font-mono text-[10px] text-[#8B94AA] uppercase tracking-widest">// jawaban detail</div>
                  <div className="pl-5 border-l-4 border-[#00E57A] bg-white/[0.01] p-4 sm:p-5 rounded-r-2xl border border-white/5">
                    <p className="text-sm sm:text-base text-white/90 leading-relaxed font-sans whitespace-pre-line">
                      {focusFaq.answer}
                    </p>
                  </div>
                </div>

                {/* Footer Controls & Helpful Indicator */}
                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#8B94AA]">
                    <BookOpen className="w-4 h-4 text-[#00E57A]" />
                    <span>Mode Baca Fokus Aktif</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => {
                        handleFaqFeedback(focusFaq.question, 'up');
                      }}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-[11px] font-mono font-bold uppercase transition-all duration-300 ${
                        userFaqFeedback[focusFaq.question] === 'up'
                          ? "bg-[#00E57A]/10 border-[#00E57A]/30 text-[#00E57A] shadow-[0_0_10px_rgba(0,229,122,0.05)]"
                          : "bg-white/[0.02] border-white/5 text-[#8B94AA] hover:border-white/10 hover:text-white"
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${userFaqFeedback[focusFaq.question] === 'up' ? 'fill-[#00E57A]/20' : ''}`} />
                      <span>Ya, Membantu</span>
                    </button>
                    <button
                      onClick={() => {
                        setFocusFaq(null);
                        showToast("Kembali ke daftar FAQ.");
                      }}
                      className="bg-[#00E57A] text-black font-display font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-[#00ca6d] transition-all shadow-[0_4px_15px_rgba(0,229,122,0.2)] hover:shadow-[0_6px_20px_rgba(0,229,122,0.3)] hover:scale-[1.02] active:scale-95"
                    >
                      Selesai Membaca
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Target Akademik Task Delete Confirmation Modal */}
      <AnimatePresence>
        {taskToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#07080D]/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setTaskToDelete(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-[#111420] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative light flare */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />

              <div className="flex flex-col gap-4">
                {/* Header Row */}
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-white text-lg tracking-tight">
                      Hapus Target Akademik?
                    </h3>
                    <p className="text-[11px] font-mono text-[#8B94AA]">
                      Tindakan ini tidak dapat dibatalkan
                    </p>
                  </div>
                </div>

                {/* Task Details Info Box */}
                <div className="bg-[#07080D]/60 border border-white/5 rounded-xl p-4 space-y-1">
                  <div className="text-[10px] font-mono text-[#8B94AA] uppercase tracking-wider">// Rincian Tugas</div>
                  <div className="font-sans font-bold text-white text-sm">
                    {taskToDelete.name}
                  </div>
                  <div className="text-xs text-[#8B94AA]">
                    Mata Kuliah: <span className="text-[#38BDF8] font-semibold">{taskToDelete.subject}</span>
                  </div>
                </div>

                <p className="text-xs text-white/75 leading-relaxed">
                  Apakah kakak yakin ingin menghapus tugas ini dari target akademik? Kamu harus menambahkannya secara manual jika berubah pikiran nanti, kakk.
                </p>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setTaskToDelete(null)}
                    className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-[#8B94AA] hover:text-white hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBookedTasks(prev => prev.filter(t => t.id !== taskToDelete.id));
                      setTaskToDelete(null);
                      showToast("Tugas berhasil dihapus dari target akademik. 🗑️");
                    }}
                    className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-display font-bold text-xs hover:bg-red-600 transition-all shadow-[0_4px_15px_rgba(239,68,68,0.2)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.3)] hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Sekarang</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Niraa AI Study Hub Helper Functions */}
      {(() => {
        // We declare helper functions inline or locally to avoid scope polluting and keep it modular.
        const calculateRequiredGpa = () => {
          const curGpa = parseFloat(gpaCurrent) || 0;
          const tgtGpa = parseFloat(gpaTarget) || 0;
          const prevSks = parseInt(gpaSksPrev) || 0;
          const curSks = parseInt(gpaSksCurrent) || 1;
          
          const prevPoints = curGpa * prevSks;
          const totalSks = prevSks + curSks;
          const targetPoints = tgtGpa * totalSks;
          const requiredPoints = targetPoints - prevPoints;
          const reqGpa = requiredPoints / curSks;
          
          return reqGpa;
        };

        const calculateSimulatedSemesterGpa = () => {
          let totalSks = 0;
          let totalPoints = 0;
          gpaCourses.forEach((c) => {
            let gradeVal = 4;
            if (c.grade === "A") gradeVal = 4;
            else if (c.grade === "B") gradeVal = 3;
            else if (c.grade === "C") gradeVal = 2;
            else if (c.grade === "D") gradeVal = 1;
            else if (c.grade === "E") gradeVal = 0;
            
            totalSks += c.sks;
            totalPoints += c.sks * gradeVal;
          });
          
          return totalSks > 0 ? totalPoints / totalSks : 0;
        };

        const formatTime = (secs: number) => {
          const m = Math.floor(secs / 60).toString().padStart(2, "0");
          const s = (secs % 60).toString().padStart(2, "0");
          return `${m}:${s}`;
        };

        const handleGenerateTopic = async () => {
          if (!topicKeyword.trim()) {
            showToast("Tulis kata kunci terlebih dahulu ya, bestie! 📝");
            return;
          }
          
          setIsGeneratingTopic(true);
          setTopicResult("");
          
          const promptMessage = {
            role: "user",
            content: `Halo Niraaa! Tolong buatkan 3 rekomendasi judul akademis/tugas yang sangat menarik, kreatif, orisinal, dan relevan di Indonesia saat ini.
            Jurusan/Kategori: ${topicMajor}
            Jenis Tugas: ${topicType}
            Fokus Kata Kunci: ${topicKeyword}
            
            Untuk setiap rekomendasi judul, berikan penjelasan singkat (2-3 kalimat) mengenai:
            1. Latar belakang/Permasalahan (Research Gap)
            2. Metode singkat yang direkomendasikan
            3. Nilai keunggulan judul ini dibanding riset umum.
            
            Sajikan hasilnya dengan gaya bahasa "Bestie" santai yang sangat asyik, kreatif, dan gunakan format markdown list yang rapi dengan emoji lucu. Pastikan informatif dan profesional secara konten akademis, tapi asyik dibaca!`
          };

          try {
            const response = await fetch("/api/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                messages: [promptMessage],
                preferredModel: aiModel
              })
            });

            if (!response.ok) {
              throw new Error("Gagal terhubung dengan server Niraa AI.");
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error("Gagal membaca aliran data.");

            const decoder = new TextDecoder("utf-8");
            let accumulativeText = "";
            let leftover = "";

            while (true) {
              const { value, done } = await reader.read();
              if (done) break;

              const chunk = decoder.decode(value, { stream: true });
              const combined = leftover + chunk;
              const lines = combined.split("\n");
              leftover = lines.pop() || "";

              for (const line of lines) {
                const cleanLine = line.trim();
                if (cleanLine.startsWith("data: ")) {
                  const dataStr = cleanLine.slice(6);
                  if (dataStr === "[DONE]") continue;

                  try {
                    const parsed = JSON.parse(dataStr);
                    if (parsed.error) throw new Error(parsed.error);
                    if (parsed.text) {
                      accumulativeText += parsed.text;
                      setTopicResult(accumulativeText);
                    }
                  } catch (e) {}
                }
              }
            }
            showToast("Rekomendasi judul berhasil di-generate! 🚀✨");
          } catch (err: any) {
            console.error(err);
            let fallbackText = `### ✨ Aduh Bestie, Maaf Sinyal AI-ku Sedang Padat! Tapi Niraaa Punya Rekomendasi Cadangan Buat Kamu Nih:

1. **"Analisis Penerapan Metode Heuristic Evaluation pada Interface Platform TugasKu untuk Meningkatkan Kepuasan Pengguna"**
   * **Latar Belakang:** Seringkali platform digital akademis terlalu membingungkan bagi mahasiswa tingkat awal.
   * **Metode:** Kualitatif dengan uji usability heuristic (Jacob Nielsen).
   * **Keunggulan:** Sangat praktis dan mudah diimplementasikan sebagai karya ilmiah.

2. **"Efektivitas Model Belajar Mandiri Menggunakan Asisten Virtual Berbasis Kecerdasan Buatan (AI) di Era Generative AI"**
   * **Latar Belakang:** Banyak mahasiswa bingung memanfaatkan AI secara etis dan produktif untuk kuliah harian.
   * **Metode:** Deskriptif kuantitatif dengan survei mahasiswa.
   * **Keunggulan:** Topik kekinian yang sangat disukai oleh dosen milenial!

3. **"Pengaruh Manajemen Waktu dan Dukungan Akademik Eksternal Jasa Joki Profesional Terhadap Stress Level Mahasiswa Akhir"**
   * **Latar Belakang:** Tingkat stres pengerjaan tugas harian dan skripsi sering memicu kecemasan berlebih.
   * **Metode:** Regresi linear berganda.
   * **Keunggulan:** Menyoroti solusi modern mahasiswa saat menghadapi tumpukan tugas.

*💡 Mau ide judul yang lebih kustom? Hubungi WhatsApp Admin kita langsung ya, atau ketik kata kunci lain dan coba generate ulang! Niraaa siap dampingi!*`;
            setTopicResult(fallbackText);
            showToast("Niraa AI menyajikan rekomendasi cadangan terbaik! 📚✨");
          } finally {
            setIsGeneratingTopic(false);
          }
        };

        const handleGeneratePlanner = async () => {
          if (!plannerSubject.trim()) {
            showToast("Tulis mata kuliah atau materi yang ingin dipelajari ya, kakk! 📚");
            return;
          }
          
          setIsGeneratingPlanner(true);
          setPlannerResult("");
          
          const promptMessage = {
            role: "user",
            content: `Halo Niraaa! Tolong buatkan rencana belajar (study plan) terperinci dan sangat efektif untuk mempersiapkan diri menghadapi tantangan akademis ini:
            Materi / Mata Kuliah: ${plannerSubject}
            Tujuan Belajar: ${plannerGoal}
            Durasi Waktu: ${plannerDuration} Hari
            
            Berikan rencana harian (Day-by-Day breakdown) yang taktis, mulai dari jam belajar ideal, topik harian, rekomendasi metode belajar (misal: active recall, Feynman technique), dan cara beristirahat yang sehat (Pomodoro preset).
            
            Sajikan hasilnya dengan gaya bahasa "Supportive Bestie" yang super ramah, penuh semangat, memotivasi, dan gunakan format markdown list yang rapi dengan emoji yang ceria dan asyik dibaca!`
          };

          try {
            const response = await fetch("/api/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                messages: [promptMessage],
                preferredModel: aiModel
              })
            });

            if (!response.ok) {
              throw new Error("Gagal terhubung dengan server Niraa AI.");
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error("Gagal membaca aliran data.");

            const decoder = new TextDecoder("utf-8");
            let accumulativeText = "";
            let leftover = "";

            while (true) {
              const { value, done } = await reader.read();
              if (done) break;

              const chunk = decoder.decode(value, { stream: true });
              const combined = leftover + chunk;
              const lines = combined.split("\n");
              leftover = lines.pop() || "";

              for (const line of lines) {
                const cleanLine = line.trim();
                if (cleanLine.startsWith("data: ")) {
                  const dataStr = cleanLine.slice(6);
                  if (dataStr === "[DONE]") continue;

                  try {
                    const parsed = JSON.parse(dataStr);
                    const text = parsed.choices?.[0]?.delta?.content || "";
                    accumulativeText += text;
                    setPlannerResult(accumulativeText);
                  } catch (e) {
                    // Ignore parsing errors for empty/malformed lines
                  }
                }
              }
            }
          } catch (err) {
            console.error("Study Planner Error:", err);
            const fallbackText = `### 📅 **Rencana Belajar ${plannerDuration} Hari: ${plannerSubject}** 🚀

Aduh maaf ya kakk, server AI Niraa lagi sibuk berat, tapi tenang! Ini rekomendasi jadwal kilat dari Niraa buat tembus nilai maksimal:

*   **Hari 1-2: Kuasai Pondasi Dasar** 🧱
    *   *Fokus:* Review materi kuliah awal, buat rangkuman ringkas 1 lembar. Gunakan teknik active recall.
    *   *Tips:* Jauhkan handphone saat jam fokus 50 menit!
*   **Hari 3-4: Bedah Studi Kasus & Rumus Utama** 🧠
    *   *Fokus:* Kerjakan soal latihan tahun lalu atau contoh kasus di slide dosen.
    *   *Niraa Support:* Bingung sama pembahasannya? Langsung order jasa TugasKu aja, biar tutor kita kupas tuntas!
*   **Hari 5-6: Simulasi Ujian Mandiri** ⏱️
    *   *Fokus:* Set timer Pomodoro 50 menit, kerjakan soal tanpa melihat catatan.
*   **Hari 7: Review Santai & Istirahat Cukup** 🍃
    *   *Fokus:* Baca ringkasan cepat, pastikan tidur 7-8 jam sebelum hari-H ujian!

*Semangat terus ya bestie! Kamu pasti bisa melibas ujian ini dengan hasil yang luar biasa! Niraa selalu mendukungmu!* 🌸🔥`;
            setPlannerResult(fallbackText);
            showToast("Niraa AI menyajikan rencana belajar alternatif terbaik! 📅✨");
          } finally {
            setIsGeneratingPlanner(false);
          }
        };

        const handleGenerateFlashcards = async () => {
          if (!flashcardSubject.trim()) {
            showToast("Tulis nama mata kuliah atau topik belajarmu dulu kakk! 📚");
            return;
          }

          setIsGeneratingFlashcards(true);
          try {
            const response = await fetch("/api/flashcards", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                subject: flashcardSubject.trim(),
                material: flashcardMaterial.trim(),
                preferredModel: aiModel
              })
            });

            if (!response.ok) {
              throw new Error("Respon server bermasalah.");
            }

            const data = await response.json();
            if (data.flashcards && data.flashcards.length > 0) {
              setFlashcards(data.flashcards.map((fc: any) => ({ ...fc, mastered: false })));
              setCurrentFlashcardIndex(0);
              setIsFlipped(false);
              showToast(`Hore! Niraa AI berhasil meracik ${data.flashcards.length} kartu flashcard untukmu! 🧠✨`);
            } else {
              throw new Error("Daftar flashcards kosong.");
            }
          } catch (err: any) {
            console.error(err);
            // Fallback flashcards on failure
            const fallbackFlashcards = [
              { id: "fail-fc-1", question: `Jelaskan konsep dasar dari ${flashcardSubject}?`, answer: `Konsep dasar ${flashcardSubject} berfokus pada pemahaman elemen-elemen fundamental dan bagaimana mereka saling berinteraksi secara sistematis kakk. ✨`, mastered: false },
              { id: "fail-fc-2", question: "Mengapa materi ini sangat krusial dalam ujian?", answer: "Karena materi ini menguji logika analitis dasar yang sering keluar sebagai poin utama dengan bobot nilai besar kakk! 💡", mastered: false },
              { id: "fail-fc-3", question: "Bagaimana cara belajar paling efektif untuk materi ini?", answer: "Gunakan Active Recall untuk menguji ingatan secara berkala dan Spaced Repetition untuk review berjangka waktu kakk! 🧠", mastered: false }
            ];
            setFlashcards(fallbackFlashcards);
            setCurrentFlashcardIndex(0);
            setIsFlipped(false);
            showToast("Niraa meracik flashcards dasar alternatif untuk membantumu belajar kakk! 📚❤️");
          } finally {
            setIsGeneratingFlashcards(false);
          }
        };

        return (
          <section id="study-hub" className="max-w-7xl mx-auto px-6 py-24 sm:py-32 border-t border-white/5 relative overflow-hidden">
            {/* Glowing Ambient Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00E57A]/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="flex flex-col items-center gap-2 text-center mb-16 relative z-10">
              <div className="font-mono text-xs text-[#00E57A] tracking-widest uppercase flex items-center gap-1.5 justify-center">
                <Brain className="w-3.5 h-3.5 text-[#00E57A] animate-pulse" />
                // Pusat Alat Akademis Niraa AI
              </div>
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight">
                Niraa AI Study Companion Hub
              </h2>
              <p className="text-[#8B94AA] text-sm mt-2 max-w-xl mx-auto leading-relaxed">
                Gunakan asisten pintar dan kalkulator akademis terintegrasi kami untuk mendongkrak produktivitas kuliah, merencanakan target nilai, dan berdiskusi ide riset.
              </p>

              {/* Interactive Navigation Tabs */}
              <div className="mt-8 bg-[#0C0E18]/80 border border-white/10 p-1 rounded-2xl flex flex-wrap lg:flex-nowrap gap-1 relative max-w-4xl w-full backdrop-blur-xl">
                <button
                  onClick={() => {
                    setStudyHubTab("topic");
                    showToast("Membuka Generator Topik AI! 💡");
                  }}
                  className={`flex-1 relative py-2.5 text-xs font-display font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                    studyHubTab === "topic" ? "text-black font-bold" : "text-[#8B94AA] hover:text-white"
                  }`}
                >
                  {studyHubTab === "topic" && (
                    <motion.span
                      layoutId="activeStudyHubTab"
                      className="absolute inset-0 bg-[#00E57A] rounded-xl"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                  <Brain className="w-3.5 h-3.5 relative z-10" />
                  <span className="relative z-10">Ide Topik AI</span>
                </button>

                <button
                  onClick={() => {
                    setStudyHubTab("gpa");
                    showToast("Membuka Perencana Target IPK! 📊");
                  }}
                  className={`flex-1 relative py-2.5 text-xs font-display font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                    studyHubTab === "gpa" ? "text-black font-bold" : "text-[#8B94AA] hover:text-white"
                  }`}
                >
                  {studyHubTab === "gpa" && (
                    <motion.span
                      layoutId="activeStudyHubTab"
                      className="absolute inset-0 bg-[#00E57A] rounded-xl"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                  <GraduationCap className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Target IPK</span>
                </button>

                <button
                  onClick={() => {
                    setStudyHubTab("pomodoro");
                    showToast("Membuka Timer Belajar Pomodoro! ⏱️");
                  }}
                  className={`flex-1 relative py-2.5 text-xs font-display font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                    studyHubTab === "pomodoro" ? "text-black font-bold" : "text-[#8B94AA] hover:text-white"
                  }`}
                >
                  {studyHubTab === "pomodoro" && (
                    <motion.span
                      layoutId="activeStudyHubTab"
                      className="absolute inset-0 bg-[#00E57A] rounded-xl"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                  <Timer className="w-3.5 h-3.5 relative z-10" />
                  <span className="relative z-10">Pomodoro Focus</span>
                </button>

                <button
                  onClick={() => {
                    setStudyHubTab("planner");
                    showToast("Membuka Rencana Belajar AI! 📅");
                  }}
                  className={`flex-1 relative py-2.5 text-xs font-display font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                    studyHubTab === "planner" ? "text-black font-bold" : "text-[#8B94AA] hover:text-white"
                  }`}
                >
                  {studyHubTab === "planner" && (
                    <motion.span
                      layoutId="activeStudyHubTab"
                      className="absolute inset-0 bg-[#00E57A] rounded-xl"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                  <Calendar className="w-3.5 h-3.5 relative z-10" />
                  <span className="relative z-10">Rencana Belajar AI</span>
                </button>

                <button
                  onClick={() => {
                    setStudyHubTab("flashcards");
                    showToast("Membuka Kartu Flashcard AI! 📚");
                  }}
                  className={`flex-1 relative py-2.5 text-xs font-display font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                    studyHubTab === "flashcards" ? "text-black font-bold" : "text-[#8B94AA] hover:text-white"
                  }`}
                >
                  {studyHubTab === "flashcards" && (
                    <motion.span
                      layoutId="activeStudyHubTab"
                      className="absolute inset-0 bg-[#00E57A] rounded-xl"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                  <BookOpen className="w-3.5 h-3.5 relative z-10" />
                  <span className="relative z-10">Flashcards AI</span>
                </button>
              </div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto">
              <AnimatePresence mode="wait">
                {studyHubTab === "topic" && (
                  <motion.div
                    key="tab-topic"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
                  >
                    {/* Topic Input Panel */}
                    <div className="lg:col-span-5 bg-[#111420] border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E57A]/5 rounded-full blur-3xl pointer-events-none" />
                      <div>
                        <h3 className="font-display font-bold text-white text-xl mb-2 text-left">Generator Topik & Judul AI</h3>
                        <p className="text-xs text-[#8B94AA] text-left mb-6 leading-relaxed">
                          Lupa cari judul skripsi atau makalah? Pilih jurusan dan ketik kata kunci, biar Niraa AI merumuskan ide riset terbaik yang anti-plagiat dan langsung disukai dosen!
                        </p>

                        <div className="space-y-4">
                          {/* Major Select */}
                          <div>
                            <label className="block text-[10px] font-mono text-[#8B94AA] uppercase tracking-wider mb-1.5 text-left">Pilih Jurusan / Bidang</label>
                            <select
                              value={topicMajor}
                              onChange={(e) => setTopicMajor(e.target.value)}
                              className="w-full bg-[#0C0E18] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00E57A] transition-all cursor-pointer font-medium"
                            >
                              <option value="Teknik Informatika / Sistem Informasi">Teknik Informatika / Sistem Informasi</option>
                              <option value="Manajemen / Akuntansi / Bisnis">Manajemen / Akuntansi / Bisnis</option>
                              <option value="Hukum & Politik">Hukum & Politik</option>
                              <option value="Psikologi & Hubungan Internasional">Psikologi & Hubungan Internasional</option>
                              <option value="Kedokteran, Kesehatan & Farmasi">Kedokteran, Kesehatan & Farmasi</option>
                              <option value="Sastra, Komunikasi & Pendidikan">Sastra, Komunikasi & Pendidikan</option>
                            </select>
                          </div>

                          {/* Assignment Type Select */}
                          <div>
                            <label className="block text-[10px] font-mono text-[#8B94AA] uppercase tracking-wider mb-1.5 text-left">Jenis Tugas / Karya Ilmiah</label>
                            <select
                              value={topicType}
                              onChange={(e) => setTopicType(e.target.value)}
                              className="w-full bg-[#0C0E18] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00E57A] transition-all cursor-pointer font-medium"
                            >
                              <option value="Skripsi / Tugas Akhir">Skripsi / Tugas Akhir</option>
                              <option value="Proposal Penelitian / Metodologi">Proposal Penelitian / Metodologi</option>
                              <option value="Makalah, Paper, atau Esai Akademik">Makalah, Paper, atau Esai Akademik</option>
                              <option value="Project Digital (Aplikasi, Website, Desain Figma)">Project Digital (Aplikasi, Website, Desain Figma)</option>
                            </select>
                          </div>

                          {/* Keyword Input */}
                          <div>
                            <label className="block text-[10px] font-mono text-[#8B94AA] uppercase tracking-wider mb-1.5 text-left">Kata Kunci / Fokus Spesifik</label>
                            <input
                              type="text"
                              value={topicKeyword}
                              onChange={(e) => setTopicKeyword(e.target.value)}
                              placeholder="Misal: Kecerdasan Buatan, UMKM, Kesehatan Mental, E-commerce"
                              className="w-full bg-[#0C0E18] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#00E57A] transition-all font-medium text-left"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-8">
                        <button
                          onClick={handleGenerateTopic}
                          disabled={isGeneratingTopic}
                          className={`w-full py-3.5 rounded-2xl font-display font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
                            isGeneratingTopic
                              ? "bg-white/5 border border-white/10 text-[#8B94AA] cursor-not-allowed"
                              : "bg-[#00E57A] text-black hover:bg-[#00ca6d] shadow-[0_4px_20px_rgba(0,229,122,0.2)] hover:shadow-[0_6px_25px_rgba(0,229,122,0.3)] hover:scale-[1.01] active:scale-95"
                          }`}
                        >
                          {isGeneratingTopic ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Sedang Merumuskan Ide...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              <span>Generate Ide dengan Niraa AI ✨</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Topic Output Panel */}
                    <div className="lg:col-span-7 bg-[#0C0E18]/60 border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl relative min-h-[400px]">
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                      
                      <div className="w-full h-full flex flex-col">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                          <span className="text-[10px] font-mono text-[#8B94AA] uppercase tracking-wider">Hasil Rekomendasi Ide Judul</span>
                          <span className="text-[9px] bg-[#00E57A]/10 text-[#00E57A] border border-[#00E57A]/20 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-tight">AI Generated</span>
                        </div>

                        <div className="flex-1 overflow-y-auto max-h-[360px] text-left">
                          {topicResult ? (
                            <div className="space-y-4 text-sm text-[#CDD5E0] leading-relaxed select-text pr-2 scrollbar-thin">
                              {topicResult.split("\n\n").map((para, idx) => {
                                // Check if it's a list item (starts with 1., 2., 3., etc)
                                const isListItem = /^\d+\.\s+\*\*/.test(para.trim()) || para.trim().startsWith("1.") || para.trim().startsWith("2.") || para.trim().startsWith("3.");
                                if (isListItem) {
                                  return (
                                    <div key={idx} className="bg-white/[0.01] border border-white/5 hover:border-[#00E57A]/30 p-4 rounded-2xl transition-all duration-300">
                                      {para.split("\n").map((line, lidx) => {
                                        // Highlight the Title line
                                        if (line.trim().includes("**") || line.trim().startsWith("1.") || line.trim().startsWith("2.") || line.trim().startsWith("3.")) {
                                          return (
                                            <h4 key={lidx} className="text-white font-display font-bold text-sm sm:text-base mb-2 flex items-center gap-2">
                                              <span className="w-1.5 h-1.5 rounded-full bg-[#00E57A]" />
                                              {line.replace(/\*\*/g, "").trim()}
                                            </h4>
                                          );
                                        }
                                        return <p key={lidx} className="text-xs text-[#8B94AA] mt-1 pl-3.5">{line.trim()}</p>;
                                      })}
                                      <div className="mt-3 pl-3.5 flex items-center gap-3">
                                        <button
                                          onClick={() => {
                                            navigator.clipboard.writeText(para.replace(/\*\*/g, "").trim());
                                            showToast("Salin ide judul sukses! 📋✨");
                                          }}
                                          className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase text-[#8B94AA] hover:text-[#00E57A] transition-colors cursor-pointer"
                                        >
                                          <Copy className="w-3 h-3" />
                                          Salin Ide
                                        </button>
                                        <button
                                          onClick={() => {
                                            // Autofill order form
                                            setONama(topicMajor);
                                            setOSvc(topicType.includes("Skripsi") ? "5" : topicType.includes("Project") ? "6" : "1");
                                            setODetail(`Ingin memesan pembuatan tugas dengan draf judul: "${para.split("\n")[0].replace(/\*\*/g, "").trim()}" - Fokus topik: ${topicKeyword}`);
                                            showToast("Form pemesanan di bawah berhasil di-isi otomatis! Silakan sesuaikan kembali 📝🚀");
                                            const formElem = document.getElementById("form-section");
                                            if (formElem) formElem.scrollIntoView({ behavior: "smooth" });
                                          }}
                                          className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase text-[#00E57A] hover:text-white transition-colors cursor-pointer"
                                        >
                                          <Send className="w-3 h-3" />
                                          Pesan Tugas Ini
                                        </button>
                                      </div>
                                    </div>
                                  );
                                }
                                return <p key={idx} className="text-xs text-[#8B94AA] whitespace-pre-wrap">{para}</p>;
                              })}
                            </div>
                          ) : isGeneratingTopic ? (
                            <div className="h-full flex flex-col items-center justify-center py-12 gap-4 text-center animate-pulse">
                              <div className="p-4 bg-[#00E57A]/10 border border-[#00E57A]/20 rounded-full">
                                <Brain className="w-8 h-8 text-[#00E57A] animate-spin" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-white">Niraa AI sedang meracik ide riset terbaik...</p>
                                <p className="text-xs text-[#8B94AA] mt-1">Kami menganalisis topik terbaru untuk karya ilmiah orisinal.</p>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center py-12 gap-3 text-center">
                              <Brain className="w-12 h-12 text-[#8B94AA]/30" />
                              <div>
                                <p className="text-xs font-mono uppercase tracking-wider text-[#8B94AA]">Belum ada hasil</p>
                                <p className="text-xs text-[#8B94AA]/60 mt-1 max-w-xs mx-auto">
                                  Silakan tentukan jurusan dan fokus topik di sebelah kiri, lalu klik tombol "Generate Ide" untuk memulai.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {studyHubTab === "gpa" && (
                  <motion.div
                    key="tab-gpa"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
                  >
                    {/* GPA Target Calculator Column */}
                    <div className="lg:col-span-5 bg-[#111420] border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                      <div>
                        <h3 className="font-display font-bold text-white text-xl mb-1 text-left">Kalkulator Target IPK</h3>
                        <p className="text-xs text-[#8B94AA] text-left mb-6 leading-relaxed">
                          Kalkulasikan berapa IP Semester minimal yang harus kamu raih di semester ini untuk mencapai target IPK impianmu!
                        </p>

                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                            {/* Current GPA */}
                            <div>
                              <label className="block text-[10px] font-mono text-[#8B94AA] uppercase tracking-wider mb-1 text-left">IPK Saat Ini</label>
                              <input
                                type="text"
                                value={gpaCurrent}
                                onChange={(e) => setGpaCurrent(e.target.value)}
                                className="w-full bg-[#0C0E18] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#00E57A] transition-all font-medium text-left"
                              />
                            </div>

                            {/* Target GPA */}
                            <div>
                              <label className="block text-[10px] font-mono text-[#8B94AA] uppercase tracking-wider mb-1 text-left">Target IPK Akhir</label>
                              <input
                                type="text"
                                value={gpaTarget}
                                onChange={(e) => setGpaTarget(e.target.value)}
                                className="w-full bg-[#0C0E18] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#00E57A] transition-all font-medium text-left"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            {/* Cumulative SKS */}
                            <div>
                              <label className="block text-[10px] font-mono text-[#8B94AA] uppercase tracking-wider mb-1 text-left">SKS Kumulatif Sblm</label>
                              <input
                                type="text"
                                value={gpaSksPrev}
                                onChange={(e) => setGpaSksPrev(e.target.value)}
                                className="w-full bg-[#0C0E18] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#00E57A] transition-all font-medium text-left"
                              />
                            </div>

                            {/* Current Semester SKS */}
                            <div>
                              <label className="block text-[10px] font-mono text-[#8B94AA] uppercase tracking-wider mb-1 text-left">SKS Semester Ini</label>
                              <input
                                type="text"
                                value={gpaSksCurrent}
                                onChange={(e) => setGpaSksCurrent(e.target.value)}
                                className="w-full bg-[#0C0E18] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#00E57A] transition-all font-medium text-left"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Results Panel */}
                      <div className="mt-8 border border-white/5 rounded-2xl p-4 bg-[#0C0E18] text-left">
                        <span className="text-[9px] font-mono text-[#8B94AA] uppercase tracking-wider block mb-2">Estimasi Analisis Target</span>
                        {(() => {
                          const reqGpa = calculateRequiredGpa();
                          if (reqGpa > 4.0) {
                            return (
                              <div className="space-y-2">
                                <div className="text-sm sm:text-base font-display font-extrabold text-[#FF5F57] flex items-center gap-1.5 leading-none">
                                  Tidak Realistis (IP Semester: {reqGpa.toFixed(2)}) 🥺
                                </div>
                                <p className="text-[11px] text-[#8B94AA] leading-normal">
                                  SKS sekarang terlalu sedikit dibanding SKS lama untuk menaikkan IPK setinggi itu, bestie. Sesuaikan kembali target IPK-mu atau hubungi WhatsApp Admin TugasKu untuk konsultasi perbaikan IPK via paket joki semester aman!
                                </p>
                              </div>
                            );
                          } else if (reqGpa < 0) {
                            return (
                              <div className="space-y-2">
                                <div className="text-sm sm:text-base font-display font-extrabold text-[#00E57A] flex items-center gap-1.5 leading-none">
                                  Target Aman Terkendali! 🎉🏆
                                </div>
                                <p className="text-[11px] text-[#8B94AA] leading-normal">
                                  Bahkan jika IP Semester kamu saat ini adalah 0.00 sekalipun, target IPK kamu sudah terlewati karena nilai kumulatif lamamu luar biasa bagus! Pertahankan terus prestasimu ya!
                                </p>
                              </div>
                            );
                          } else {
                            return (
                              <div className="space-y-2">
                                <div className="text-xs font-semibold text-[#8B94AA]">Kamu butuh IP Semester ini minimal:</div>
                                <div className="text-2xl sm:text-3xl font-display font-black text-[#00E57A] flex items-baseline gap-1">
                                  {reqGpa.toFixed(2)}
                                  <span className="text-xs font-mono text-[#8B94AA] font-normal"> / 4.00</span>
                                </div>
                                <p className="text-[11px] text-[#8B94AA] leading-normal">
                                  {reqGpa <= 3.0 
                                    ? "Sangat mudah diraih! Pertahankan performa belajarmu secara stabil! 😉🚀"
                                    : reqGpa <= 3.5
                                    ? "Cukup menantang namun realistis! Maksimalkan tugas harianmu! 🔥✨"
                                    : "Butuh perjuangan super keras! Jika ada tugas berat yang mengancam nilai, serahkan langsung ke TugasKu biar aman dapat nilai A!"
                                  }
                                </p>
                              </div>
                            );
                          }
                        })()}
                      </div>
                    </div>

                    {/* Grade Simulator List Column */}
                    <div className="lg:col-span-7 bg-[#0C0E18]/60 border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl text-left">
                      <div className="w-full">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                          <div>
                            <h4 className="font-display font-bold text-white text-base sm:text-lg">Simulasi Nilai Kuliah Semester Ini</h4>
                            <p className="text-[11px] text-[#8B94AA] mt-0.5">Sajikan mata kuliah semester ini dan pantau IP Semester simulasi secara langsung!</p>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] font-mono uppercase text-[#8B94AA]">Simulasi IP Semester</div>
                            <div className="text-xl sm:text-2xl font-display font-black text-[#38BDF8]">
                              {calculateSimulatedSemesterGpa().toFixed(2)}
                            </div>
                          </div>
                        </div>

                        {/* Form to Add Class */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 mb-4 bg-white/[0.01] border border-white/5 p-3 rounded-2xl items-end">
                          <div className="sm:col-span-5">
                            <label className="block text-[8px] font-mono text-[#8B94AA] uppercase tracking-wider mb-1">Nama Mata Kuliah</label>
                            <input
                              type="text"
                              value={newCourseName}
                              onChange={(e) => setNewCourseName(e.target.value)}
                              placeholder="Contoh: Pemrograman Java"
                              className="w-full bg-[#0C0E18] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#38BDF8] transition-all font-medium text-left"
                            />
                          </div>
                          <div className="sm:col-span-3">
                            <label className="block text-[8px] font-mono text-[#8B94AA] uppercase tracking-wider mb-1">Bobot SKS</label>
                            <select
                              value={newCourseSks}
                              onChange={(e) => setNewCourseSks(parseInt(e.target.value))}
                              className="w-full bg-[#0C0E18] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#38BDF8] transition-all cursor-pointer font-medium"
                            >
                              <option value="1">1 SKS</option>
                              <option value="2">2 SKS</option>
                              <option value="3">3 SKS</option>
                              <option value="4">4 SKS</option>
                              <option value="6">6 SKS (Skripsi)</option>
                            </select>
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-[8px] font-mono text-[#8B94AA] uppercase tracking-wider mb-1">Target Nilai</label>
                            <select
                              value={newCourseGrade}
                              onChange={(e) => setNewCourseGrade(e.target.value)}
                              className="w-full bg-[#0C0E18] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#38BDF8] transition-all cursor-pointer font-medium"
                            >
                              <option value="A">A (4.00)</option>
                              <option value="B">B (3.00)</option>
                              <option value="C">C (2.00)</option>
                              <option value="D">D (1.00)</option>
                              <option value="E">E (0.00)</option>
                            </select>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (!newCourseName.trim()) {
                                showToast("Isi nama mata kuliah dulu kakk! 🏫");
                                return;
                              }
                              const newCourse = {
                                id: Date.now().toString(),
                                name: newCourseName,
                                sks: newCourseSks,
                                grade: newCourseGrade
                              };
                              setGpaCourses([...gpaCourses, newCourse]);
                              setNewCourseName("");
                              showToast(`Mata kuliah ${newCourseName} berhasil ditambahkan! 📚`);
                            }}
                            className="sm:col-span-2 w-full py-2 bg-[#38BDF8] hover:bg-[#0284c7] text-black font-display font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Tambah</span>
                          </button>
                        </div>

                        {/* Courses List scrollable */}
                        <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1 scrollbar-thin">
                          {gpaCourses.map((course) => (
                            <div
                              key={course.id}
                              className="flex items-center justify-between bg-[#111420]/80 border border-white/[0.03] hover:border-white/10 px-4 py-2.5 rounded-xl transition-all"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-md font-mono text-[#8B94AA]">
                                  {course.sks} SKS
                                </span>
                                <span className="text-xs font-semibold text-white">{course.name}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`text-xs font-mono font-black px-2.5 py-0.5 rounded-lg border ${
                                  course.grade === "A"
                                    ? "bg-[#00E57A]/10 border-[#00E57A]/20 text-[#00E57A]"
                                    : course.grade === "B"
                                    ? "bg-[#38BDF8]/10 border-[#38BDF8]/20 text-[#38BDF8]"
                                    : "bg-[#FF5F57]/10 border-[#FF5F57]/20 text-[#FF5F57]"
                                }`}>
                                  Nilai: {course.grade}
                                </span>
                                <button
                                  onClick={() => {
                                    setGpaCourses(gpaCourses.filter((c) => c.id !== course.id));
                                    showToast(`Menghapus ${course.name} dari list.`);
                                  }}
                                  className="p-1 hover:bg-white/5 rounded-lg text-[#FF5F57]/60 hover:text-[#FF5F57] transition-all cursor-pointer"
                                  title="Hapus Matkul"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 border-t border-white/5 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                        <span className="text-[11px] text-[#8B94AA] flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#00E57A]" />
                          {calculateSimulatedSemesterGpa() >= calculateRequiredGpa()
                            ? "Simulasi kamu SUDAH memenuhi syarat target! 🎉 Mantap, pertahankan terus!"
                            : "Aduh, simulasimu masih di bawah syarat target. Butuh bantuan tugas agar nilai A terjamin?"
                          }
                        </span>
                        {calculateSimulatedSemesterGpa() < calculateRequiredGpa() && (
                          <button
                            onClick={() => {
                              const formElem = document.getElementById("form-section");
                              if (formElem) formElem.scrollIntoView({ behavior: "smooth" });
                              setONama("Bimbingan IPK");
                              setODetail("Tolong bimbing pengerjaan tugas-tugas saya semester ini agar IPK saya bisa menembus target!");
                              showToast("Menyiapkan pendaftaran bimbingan akademis! 🎓🚀");
                            }}
                            className="bg-[#00E57A]/15 border border-[#00E57A]/30 text-[#00E57A] font-display font-bold text-[10px] px-3.5 py-1.5 rounded-xl hover:bg-[#00E57A] hover:text-black transition-all text-center cursor-pointer"
                          >
                            Pesan Jasa TugasKu Now 🚀
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {studyHubTab === "pomodoro" && (
                  <motion.div
                    key="tab-pomodoro"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
                  >
                    {/* Countdown Timer Column */}
                    <div className="lg:col-span-5 bg-[#111420] border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-between shadow-2xl relative">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E57A]/5 rounded-full blur-3xl pointer-events-none" />
                      
                      <div className="w-full text-center">
                        <h3 className="font-display font-bold text-white text-xl mb-1">Pomodoro Focus Timer</h3>
                        <p className="text-xs text-[#8B94AA] leading-relaxed max-w-xs mx-auto mb-6">
                          Bagi waktu belajarmu dalam blok fokus 25 menit. Niraa AI menjamin produktivitasmu meningkat tajam!
                        </p>
                      </div>

                      {/* Digital Circular Timer Display */}
                      <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                        {/* Background Circle Track */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                          <circle
                            cx="96"
                            cy="96"
                            r="80"
                            className="stroke-white/[0.03] fill-none"
                            strokeWidth="8"
                          />
                          {/* Active countdown circle */}
                          <motion.circle
                            cx="96"
                            cy="96"
                            r="80"
                            className="stroke-[#00E57A] fill-none"
                            strokeWidth="8"
                            strokeDasharray={2 * Math.PI * 80}
                            animate={{
                              strokeDashoffset: (2 * Math.PI * 80) * (1 - pomoSeconds / (pomoMode === "work" ? 25 * 60 : pomoMode === "short" ? 5 * 60 : 15 * 60))
                            }}
                            transition={{ duration: 1, ease: "linear" }}
                            strokeLinecap="round"
                          />
                        </svg>

                        {/* Timer Digits */}
                        <div className="text-center">
                          <div className="text-3xl sm:text-4xl font-mono font-black text-white leading-none tracking-tight">
                            {formatTime(pomoSeconds)}
                          </div>
                          <div className="text-[9px] font-mono uppercase tracking-widest text-[#8B94AA] mt-1">
                            {pomoMode === "work" ? "💻 Fokus Kerja" : pomoMode === "short" ? "☕ Break Singkat" : "🍃 Break Panjang"}
                          </div>
                        </div>
                      </div>

                      {/* Control Buttons */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setIsPomoRunning(!isPomoRunning);
                            showToast(isPomoRunning ? "Timer di-pause ⏱️" : "Fokus belajar dimulai! Tetap produktif ya bestie! 🔥");
                          }}
                          className="flex h-11 px-6 items-center gap-2 bg-[#00E57A] hover:bg-[#00ca6d] text-black font-display font-bold text-xs rounded-xl shadow-[0_4px_15px_rgba(0,229,122,0.2)] hover:scale-105 transition-all cursor-pointer"
                        >
                          {isPomoRunning ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black" />}
                          <span>{isPomoRunning ? "Pause" : "Mulai"}</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsPomoRunning(false);
                            setPomoSeconds(pomoMode === "work" ? 25 * 60 : pomoMode === "short" ? 5 * 60 : 15 * 60);
                            showToast("Timer direset.");
                          }}
                          className="p-3 bg-white/5 border border-white/10 text-[#8B94AA] hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                          title="Reset Timer"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Mode Selector and Ambient visual room */}
                    <div className="lg:col-span-7 bg-[#0C0E18]/60 border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl text-left relative overflow-hidden">
                      {/* Visual ambient simulator particles based on lofi option */}
                      <div className="absolute inset-0 pointer-events-none opacity-40">
                        {pomoMode === "work" && isPomoRunning && (
                          <div className="absolute inset-0 bg-radial-gradient from-emerald-500/5 to-transparent animate-pulse" />
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-display font-bold text-white text-base sm:text-lg mb-2">Konfigurasi Alur Belajar & Suasana</h4>
                        <p className="text-xs text-[#8B94AA] mb-6">
                          Atur interval timer dan pilih musik visual untuk merangsang gelombang otak alfa agar belajar terasa nyaman dan menyenangkan.
                        </p>

                        {/* Quick Interval Setters */}
                        <div className="mb-6">
                          <span className="block text-[10px] font-mono text-[#8B94AA] uppercase tracking-wider mb-2">Preset Waktu Pomodoro</span>
                          <div className="grid grid-cols-3 gap-2">
                            <button
                              onClick={() => {
                                setPomoMode("work");
                                setPomoSeconds(25 * 60);
                                setIsPomoRunning(false);
                                showToast("Preset diubah ke Fokus Belajar (25 Menit) 💻");
                              }}
                              className={`py-2.5 rounded-xl border font-display font-bold text-xs transition-all cursor-pointer ${
                                pomoMode === "work"
                                  ? "bg-[#00E57A]/10 border-[#00E57A]/30 text-[#00E57A]"
                                  : "bg-[#0C0E18] border-white/5 text-[#8B94AA] hover:border-white/10"
                              }`}
                            >
                              Fokus (25m)
                            </button>
                            <button
                              onClick={() => {
                                setPomoMode("short");
                                setPomoSeconds(5 * 60);
                                setIsPomoRunning(false);
                                showToast("Preset diubah ke Istirahat Singkat (5 Menit) ☕");
                              }}
                              className={`py-2.5 rounded-xl border font-display font-bold text-xs transition-all cursor-pointer ${
                                pomoMode === "short"
                                  ? "bg-[#38BDF8]/10 border-[#38BDF8]/30 text-[#38BDF8]"
                                  : "bg-[#0C0E18] border-white/5 text-[#8B94AA] hover:border-white/10"
                              }`}
                            >
                              Break Singkat (5m)
                            </button>
                            <button
                              onClick={() => {
                                setPomoMode("long");
                                setPomoSeconds(15 * 60);
                                setIsPomoRunning(false);
                                showToast("Preset diubah ke Istirahat Panjang (15 Menit) 🍃");
                              }}
                              className={`py-2.5 rounded-xl border font-display font-bold text-xs transition-all cursor-pointer ${
                                pomoMode === "long"
                                  ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                                  : "bg-[#0C0E18] border-white/5 text-[#8B94AA] hover:border-white/10"
                              }`}
                            >
                              Break Lama (15m)
                            </button>
                          </div>
                        </div>

                        {/* Elegant Live Visualizer Waveform for Pomodoro Timer */}
                        <div className="mt-6 border border-white/5 bg-[#0C0E18] p-4 rounded-2xl flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-end gap-0.5 h-6 w-10">
                              {/* CSS animated bars using Framer Motion to simulate focus wave */}
                              {[1, 2, 3, 4, 5, 6, 7, 8].map((bar) => (
                                <motion.span
                                  key={bar}
                                  className="bg-[#00E57A]/80 w-0.5 rounded-full"
                                  style={{ transformOrigin: "bottom" }}
                                  animate={isPomoRunning ? {
                                    height: ["20%", "100%", "20%"]
                                  } : { height: "20%" }}
                                  transition={{
                                    duration: 0.4 + bar * 0.1,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                  }}
                                />
                              ))}
                            </div>
                            <div className="text-left">
                              <div className="text-[10px] font-mono text-[#8B94AA] uppercase">Pulsasi Gelombang Fokus</div>
                              <div className="text-xs font-bold text-white">
                                {isPomoRunning
                                  ? "Mode Fokus Aktif (Gelombang Otak Alfa Terjaga)"
                                  : "Timer Sedang Dijeda"}
                              </div>
                            </div>
                          </div>
                          <span className="text-[9px] font-mono text-[#8B94AA]">
                            {isPomoRunning ? "FOCUS • RUNNING" : "FOCUS • STANDBY"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {studyHubTab === "planner" && (
                  <motion.div
                    key="tab-planner"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
                  >
                    {/* Planner Input Panel */}
                    <div className="lg:col-span-5 bg-[#111420] border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden text-left">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E57A]/5 rounded-full blur-3xl pointer-events-none" />
                      <div>
                        <h3 className="font-display font-bold text-white text-xl mb-2">Asisten Rencana Belajar AI</h3>
                        <p className="text-xs text-[#8B94AA] mb-6 leading-relaxed">
                          Punya sisa waktu dikit buat ujian atau nyusun bab skripsi? Niraa AI siap menyusun study schedule yang super taktis dan realistis khusus buat kamu, bestie!
                        </p>

                        <div className="space-y-4">
                          {/* Subject Input */}
                          <div>
                            <label className="block text-[10px] font-mono text-[#8B94AA] uppercase tracking-wider mb-1.5">Mata Kuliah / Topik Pembelajaran</label>
                            <input
                              type="text"
                              value={plannerSubject}
                              onChange={(e) => setPlannerSubject(e.target.value)}
                              placeholder="Misal: Algoritma & Struktur Data, Teori Sastra, Kimia Dasar"
                              className="w-full bg-[#0C0E18] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#00E57A] transition-all font-medium text-left"
                            />
                          </div>

                          {/* Goal Select */}
                          <div>
                            <label className="block text-[10px] font-mono text-[#8B94AA] uppercase tracking-wider mb-1.5">Target / Tujuan Akhir Belajar</label>
                            <select
                              value={plannerGoal}
                              onChange={(e) => setPlannerGoal(e.target.value)}
                              className="w-full bg-[#0C0E18] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00E57A] transition-all cursor-pointer font-medium"
                            >
                              <option value="Belajar Ujian Akhir Semester (UAS)">Belajar Ujian Akhir Semester (UAS)</option>
                              <option value="Belajar Ujian Tengah Semester (UTS)">Belajar Ujian Tengah Semester (UTS)</option>
                              <option value="Menyusun Kerangka Bab Skripsi / Paper Ilmiah">Menyusun Kerangka Bab Skripsi / Paper Ilmiah</option>
                              <option value="Memahami Jurnal & Literatur Asing">Memahami Jurnal & Literatur Asing</option>
                              <option value="Mempersiapkan Presentasi Sidang Tugas Akhir">Mempersiapkan Presentasi Sidang Tugas Akhir</option>
                            </select>
                          </div>

                          {/* Duration Select */}
                          <div>
                            <label className="block text-[10px] font-mono text-[#8B94AA] uppercase tracking-wider mb-1.5">Durasi Waktu Belajar (Sisa Hari)</label>
                            <select
                              value={plannerDuration}
                              onChange={(e) => setPlannerDuration(e.target.value)}
                              className="w-full bg-[#0C0E18] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00E57A] transition-all cursor-pointer font-medium"
                            >
                              <option value="3">3 Hari (SKS Kilat / Darurat 🚨)</option>
                              <option value="5">5 Hari (Fokus Intensif ⏳)</option>
                              <option value="7">7 Hari (Satu Minggu Maksimal 📅)</option>
                              <option value="14">14 Hari (Perencanaan Matang 🍃)</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8">
                        <button
                          onClick={handleGeneratePlanner}
                          disabled={isGeneratingPlanner}
                          className={`w-full py-3.5 rounded-2xl font-display font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
                            isGeneratingPlanner
                              ? "bg-white/5 border border-white/10 text-[#8B94AA] cursor-not-allowed"
                              : "bg-[#00E57A] text-black hover:bg-[#00ca6d] shadow-[0_4px_20px_rgba(0,229,122,0.2)] hover:shadow-[0_6px_25px_rgba(0,229,122,0.3)] hover:scale-[1.01] active:scale-95"
                          }`}
                        >
                          {isGeneratingPlanner ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Sedang Menyusun Jadwal...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              <span>Susun Jadwal AI Planner ✨</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Planner Output Panel */}
                    <div className="lg:col-span-7 bg-[#0C0E18]/60 border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl relative min-h-[400px] text-left">
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                      
                      <div className="w-full h-full flex flex-col">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                          <span className="text-[10px] font-mono text-[#8B94AA] uppercase tracking-wider">Hasil Rekomendasi Rencana Belajar</span>
                          <span className="text-[9px] bg-[#00E57A]/10 text-[#00E57A] border border-[#00E57A]/20 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-tight">Active Planner</span>
                        </div>

                        <div className="flex-1 overflow-y-auto max-h-[360px] text-left">
                          {plannerResult ? (
                            <div className="space-y-4 text-xs text-[#CDD5E0] leading-relaxed select-text pr-2 scrollbar-thin whitespace-pre-line">
                              {plannerResult}
                            </div>
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                              <Calendar className="w-10 h-10 text-white/20 mb-3 animate-pulse" />
                              <h4 className="font-display font-bold text-white text-sm mb-1">Belum Ada Rencana Belajar</h4>
                              <p className="text-xs text-[#8B94AA] max-w-sm leading-relaxed">
                                Masukkan nama mata kuliah dan pilih target belajarmu di sebelah kiri, lalu biarkan Niraa AI meracik strategi belajar harian terbaik khusus untukmu!
                              </p>
                            </div>
                          )}
                        </div>

                        {plannerResult && (
                          <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                            <span className="text-[9px] font-mono text-[#8B94AA]">
                              Tips: Pastikan gunakan Pomodoro Focus Timer saat mengeksekusi rencana ini!
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(plannerResult);
                                  showToast("Rencana belajar berhasil disalin! 📋✨");
                                }}
                                className="px-3 py-1.5 bg-white/5 border border-white/10 hover:border-white/20 text-white font-mono text-[9px] font-bold uppercase rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Copy className="w-3 h-3" />
                                Salin Jadwal
                              </button>
                              <button
                                onClick={() => {
                                  setCNama("");
                                  setCTxt(`Halo Admin TugasKu 👋 Saya baru saja merancang jadwal belajar menggunakan Rencana Belajar AI Niraa untuk mata kuliah *${plannerSubject}* dengan target *${plannerGoal}* selama *${plannerDuration} hari*. Saya ingin konsultasi gratis/order tutor pendamping untuk membahas bab-bab materi ini agar lebih paham kakk. Mohon infonya!`);
                                  showToast("Teks konsultasi berhasil di-isi otomatis! Silakan kirim formulir di bawah ini 🚀");
                                  const formElem = document.getElementById("form-section");
                                  if (formElem) formElem.scrollIntoView({ behavior: "smooth" });
                                }}
                                className="px-3 py-1.5 bg-[#00E57A]/10 border border-[#00E57A]/20 hover:bg-[#00E57A]/20 text-[#00E57A] font-mono text-[9px] font-bold uppercase rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <MessageSquare className="w-3 h-3" />
                                Konsultasikan Jasa Tutor
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {studyHubTab === "flashcards" && (
                  <motion.div
                    key="tab-flashcards"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
                  >
                    {/* Left Panel: Generator */}
                    <div className="lg:col-span-5 bg-[#111420] border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden text-left animate-fadeIn">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E57A]/5 rounded-full blur-3xl pointer-events-none" />
                      <div>
                        <h3 className="font-display font-bold text-white text-xl mb-2">Penyusun Flashcard AI</h3>
                        <p className="text-xs text-[#8B94AA] mb-6 leading-relaxed">
                          Uji daya ingatmu dengan teknik <strong>Active Recall</strong>! Tulis nama mata kuliah dan masukkan catatan ringkas, biar Niraa AI meracik deretan kartu flashcard pintar otomatis kakk!
                        </p>

                        <div className="space-y-4">
                          {/* Subject */}
                          <div>
                            <label className="block text-[10px] font-mono text-[#8B94AA] uppercase tracking-wider mb-1.5">Mata Kuliah / Topik</label>
                            <input
                              type="text"
                              value={flashcardSubject}
                              onChange={(e) => setFlashcardSubject(e.target.value)}
                              placeholder="Misal: Sistem Operasi, Farmakologi, Akuntansi Dasar"
                              className="w-full bg-[#0C0E18] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#00E57A] transition-all font-medium text-left"
                            />
                          </div>

                          {/* Material Catatan */}
                          <div>
                            <label className="block text-[10px] font-mono text-[#8B94AA] uppercase tracking-wider mb-1.5">Catatan Bab / Ringkasan Materi (Opsional)</label>
                            <textarea
                              value={flashcardMaterial}
                              onChange={(e) => setFlashcardMaterial(e.target.value)}
                              placeholder="Tempel atau ketik ringkasan slide dosen di sini untuk membuat pertanyaan flashcard yang lebih spesifik kakk..."
                              className="w-full bg-[#0C0E18] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#00E57A] transition-all font-medium text-left h-32 resize-none scrollbar-thin"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-8">
                        <button
                          onClick={handleGenerateFlashcards}
                          disabled={isGeneratingFlashcards}
                          className={`w-full py-3.5 rounded-2xl font-display font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
                            isGeneratingFlashcards
                              ? "bg-white/5 border border-white/10 text-[#8B94AA] cursor-not-allowed"
                              : "bg-[#00E57A] text-black hover:bg-[#00ca6d] shadow-[0_4px_20px_rgba(0,229,122,0.2)] hover:shadow-[0_6px_25px_rgba(0,229,122,0.3)] hover:scale-[1.01] active:scale-95"
                          }`}
                        >
                          {isGeneratingFlashcards ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Sedang Meracik Flashcards...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              <span>Racik Flashcards AI ✨</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Right Panel: Interactive Flashcard Arena */}
                    <div className="lg:col-span-7 bg-[#0C0E18]/60 border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl relative min-h-[420px] text-left">
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                      
                      <div className="w-full h-full flex flex-col justify-between">
                        {/* Header Stats */}
                        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-mono text-[#8B94AA] uppercase tracking-wider">Active Study Session</span>
                            <span className="text-[11px] font-sans font-bold text-white">
                              Kartu {flashcards.length > 0 ? currentFlashcardIndex + 1 : 0} dari {flashcards.length}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            {/* Progress stats */}
                            <div className="text-right">
                              <span className="text-[9px] font-mono text-[#8B94AA]">PAHAM: </span>
                              <span className="text-xs font-mono font-bold text-[#00E57A]">
                                {flashcards.filter(f => f.mastered).length}
                              </span>
                            </div>
                            <span className="text-[9px] bg-[#00E57A]/10 text-[#00E57A] border border-[#00E57A]/20 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-tight">Active Recall 🧠</span>
                          </div>
                        </div>

                        {/* ProgressBar */}
                        {flashcards.length > 0 && (
                          <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mb-6">
                            <div 
                              className="bg-[#00E57A] h-full transition-all duration-300"
                              style={{ width: `${((currentFlashcardIndex + 1) / flashcards.length) * 100}%` }}
                            />
                          </div>
                        )}

                        {/* 3D Flippable Card Stage */}
                        <div className="flex-1 flex items-center justify-center py-4 perspective-[1000px]">
                          {flashcards.length > 0 ? (
                            <div className="relative w-full max-w-md h-56 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
                              <motion.div
                                className="w-full h-full relative"
                                style={{ transformStyle: "preserve-3d" }}
                                animate={{ rotateY: isFlipped ? 180 : 0 }}
                                transition={{ duration: 0.6, ease: "easeInOut" }}
                              >
                                {/* Front Side (Question) */}
                                <div 
                                  className={`absolute inset-0 w-full h-full bg-[#111420] border-2 ${
                                    flashcards[currentFlashcardIndex]?.mastered ? "border-[#00E57A]/40" : "border-white/10"
                                  } rounded-2xl p-6 flex flex-col justify-between shadow-2xl backface-hidden`}
                                >
                                  <div className="flex justify-between items-start">
                                    <span className="text-[10px] font-mono text-[#00E57A] font-bold uppercase tracking-widest">// PERTANYAAN</span>
                                    {flashcards[currentFlashcardIndex]?.mastered && (
                                      <span className="text-[9px] bg-[#00E57A]/10 text-[#00E57A] px-2 py-0.5 rounded-full font-sans font-bold">Kuasai! ✓</span>
                                    )}
                                  </div>
                                  <div className="text-center font-sans font-extrabold text-white text-base sm:text-sm leading-relaxed px-4 my-auto select-text" onClick={(e) => e.stopPropagation()}>
                                    {flashcards[currentFlashcardIndex]?.question}
                                  </div>
                                  <div className="text-center text-[9.5px] font-mono text-[#8B94AA] animate-pulse">
                                    Klik kartu untuk membalik & melihat jawaban 🔄
                                  </div>
                                </div>

                                {/* Back Side (Answer) */}
                                <div 
                                  className="absolute inset-0 w-full h-full bg-[#181C2A] border-2 border-[#00E57A]/30 rounded-2xl p-6 flex flex-col justify-between shadow-2xl backface-hidden"
                                  style={{ transform: "rotateY(180deg)" }}
                                >
                                  <div className="flex justify-between items-start">
                                    <span className="text-[10px] font-mono text-[#00E57A] font-bold uppercase tracking-widest">// JAWABAN NIRAA AI</span>
                                    <span className="text-[9px] bg-blue-500/10 text-[#38BDF8] px-2 py-0.5 rounded-full font-sans font-bold">Terverifikasi AI</span>
                                  </div>
                                  <div className="text-center font-sans font-medium text-[#ECF0F8] text-xs leading-relaxed px-4 my-auto select-text overflow-y-auto max-h-32 scrollbar-thin" onClick={(e) => e.stopPropagation()}>
                                    {flashcards[currentFlashcardIndex]?.answer}
                                  </div>
                                  <div className="text-center text-[9.5px] font-mono text-[#8B94AA]">
                                    Klik kembali untuk melihat pertanyaan 🔄
                                  </div>
                                </div>
                              </motion.div>
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <BookOpen className="w-12 h-12 text-white/15 mx-auto mb-3 animate-bounce" />
                              <p className="text-xs text-[#8B94AA]">Belum ada Flashcards aktif kakk. Racik topiknya di panel sebelah kiri yuk!</p>
                            </div>
                          )}
                        </div>

                        {/* Controls beneath the Card */}
                        {flashcards.length > 0 && (
                          <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  if (currentFlashcardIndex > 0) {
                                    setCurrentFlashcardIndex(prev => prev - 1);
                                    setIsFlipped(false);
                                  } else {
                                    showToast("Ini adalah kartu pertama kakk! ✨");
                                  }
                                }}
                                className="p-2.5 bg-white/5 border border-white/10 hover:border-white/20 text-white rounded-xl transition-all cursor-pointer"
                                title="Kartu Sebelumnya"
                              >
                                <ArrowLeft className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (currentFlashcardIndex < flashcards.length - 1) {
                                    setCurrentFlashcardIndex(prev => prev + 1);
                                    setIsFlipped(false);
                                  } else {
                                    showToast("Kakak telah menyelesaikan tumpukan flashcards! Sempurna! 🎉");
                                  }
                                }}
                                className="p-2.5 bg-white/5 border border-white/10 hover:border-white/20 text-white rounded-xl transition-all cursor-pointer"
                                title="Kartu Selanjutnya"
                              >
                                <ArrowRight className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setFlashcards(prev => prev.map(f => ({ ...f, mastered: false })));
                                  setCurrentFlashcardIndex(0);
                                  setIsFlipped(false);
                                  showToast("Sesi belajar direset! Mari mulai berlatih kembali kakk. ⚙️🔄");
                                }}
                                className="px-3.5 py-2.5 bg-white/5 border border-white/10 hover:border-white/20 text-[#8B94AA] hover:text-white font-mono text-[10px] font-bold uppercase rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                                title="Ulangi Sesi"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Reset</span>
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  // Mark as NOT mastered
                                  const updated = [...flashcards];
                                  updated[currentFlashcardIndex].mastered = false;
                                  setFlashcards(updated);
                                  showToast("Kartu ditandai untuk dipelajari lagi kakk. 📚⏳");
                                  
                                  // Auto go next
                                  if (currentFlashcardIndex < flashcards.length - 1) {
                                    setTimeout(() => {
                                      setCurrentFlashcardIndex(prev => prev + 1);
                                      setIsFlipped(false);
                                    }, 400);
                                  }
                                }}
                                className="px-4 py-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 font-sans text-[11px] font-extrabold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Belum Paham</span>
                              </button>
                              <button
                                onClick={() => {
                                  // Mark as mastered
                                  const updated = [...flashcards];
                                  updated[currentFlashcardIndex].mastered = true;
                                  setFlashcards(updated);
                                  showToast("Luar biasa! Satu konsep berhasil dikuasai kakk! 🧠🔥");
                                  
                                  // If all mastered, trigger celebratory confetti
                                  const allMastered = updated.every(f => f.mastered);
                                  if (allMastered) {
                                    setConfettiActive(true);
                                    setTimeout(() => setConfettiActive(false), 5000);
                                    showToast("DAHSYAT! Kakak menguasai seluruh materi ini! Nilai A siap di tangan! 👑🎓✨");
                                  }

                                  // Auto go next
                                  if (currentFlashcardIndex < flashcards.length - 1) {
                                    setTimeout(() => {
                                      setCurrentFlashcardIndex(prev => prev + 1);
                                      setIsFlipped(false);
                                    }, 400);
                                  }
                                }}
                                className="px-4 py-2 bg-[#00E57A]/15 border border-[#00E57A]/30 hover:bg-[#00E57A]/25 text-[#00E57A] font-sans text-[11px] font-extrabold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-[0_2px_10px_rgba(0,229,122,0.1)]"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Paham kakk!</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        );
      })()}

      {/* Pusat Pembaruan & Riwayat Rilis */}
      <section id="pembaruan" className="max-w-7xl mx-auto px-6 py-24 sm:py-32 border-t border-white/5 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-[#00E57A]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-0 right-10 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="flex flex-col items-center gap-2 mb-10 text-center">
            <div className="font-mono text-xs text-[#00E57A] tracking-widest uppercase">// riwayat & arah pengembangan</div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Pusat Pembaruan & Peta Jalan
            </h2>
            <p className="text-[#8B94AA] text-sm mt-1 max-w-xl mx-auto">
              Pantau log pembaruan terkini TugasKu, lihat masa depan pengembangan aplikasi, serta suarakan ide fiturmumu langsung kakk!
            </p>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex justify-center p-1 bg-white/[0.02] border border-white/5 rounded-2xl max-w-md mx-auto mb-8">
            <button
              onClick={() => {
                setChangelogActiveTab("logs");
                showToast("Membuka Log Rilis Aplikasi 📋");
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                changelogActiveTab === "logs"
                  ? "bg-[#00E57A]/15 text-[#00E57A] border border-[#00E57A]/25"
                  : "text-[#8B94AA] hover:text-white"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Log Rilis</span>
            </button>
            <button
              onClick={() => {
                setChangelogActiveTab("roadmap");
                showToast("Membuka Peta Jalan Pengembangan 2026 🚀");
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                changelogActiveTab === "roadmap"
                  ? "bg-[#00E57A]/15 text-[#00E57A] border border-[#00E57A]/25"
                  : "text-[#8B94AA] hover:text-white"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Peta Jalan</span>
            </button>
            <button
              onClick={() => {
                setChangelogActiveTab("wishlist");
                showToast("Membuka Usulan Fitur Baru Mahasiswa 💡");
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                changelogActiveTab === "wishlist"
                  ? "bg-[#00E57A]/15 text-[#00E57A] border border-[#00E57A]/25"
                  : "text-[#8B94AA] hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Saran Fitur</span>
            </button>
          </div>

          {/* Main Interactive Container */}
          <AnimatePresence mode="wait">
            {changelogActiveTab === "logs" && (
              <motion.div
                key="logs-panel"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="bg-[#0C0E18]/60 border border-white/5 rounded-3xl p-6 sm:p-8 text-left shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                  <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#00E57A]" />
                    Riwayat Pembaruan Terkini (Changelog)
                  </h3>
                  <span className="text-[9px] bg-[#00E57A]/10 text-[#00E57A] border border-[#00E57A]/25 px-2.5 py-0.5 rounded-full font-mono font-extrabold">v2.6 Stable</span>
                </div>

                {/* Timeline vertical list */}
                <div className="space-y-8 relative border-l border-white/10 pl-6 ml-3">
                  {/* Version 2.6 */}
                  <div className="relative">
                    <span className="absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#00E57A]/20 border border-[#00E57A]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#00E57A]" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display font-extrabold text-white text-sm">Rilis Versi 2.6 (Juni 2026)</span>
                        <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-black bg-[#00E57A] px-1.5 py-0.5 rounded">TERBARU</span>
                      </div>
                      <p className="text-xs text-[#8B94AA] mt-1 leading-relaxed">
                        Pembaruan antarmuka peta jalan terpadu & integrasi asisten yang diselaraskan secara optimal:
                      </p>
                      <ul className="mt-2.5 space-y-1.5 text-xs text-[#CDD5E0] list-disc list-inside">
                        <li><strong className="text-white">Roadmap & Wishlist Hub:</strong> Konsol interaktif baru untuk memantau pengerjaan fitur masa depan dan memberikan voting saran secara langsung!</li>
                        <li><strong className="text-white">Penyelarasan Model Pintar:</strong> Penyederhanaan opsi model kecerdasan buatan Niraa demi menjamin kecepatan respons instan yang bebas kegagalan limit bagi kakak.</li>
                        <li><strong className="text-white">Penyelarasan Konten Edukatif:</strong> Pembaruan deck flashcard default yang disesuaikan secara harmonis dengan seluruh fitur platform.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Version 2.5 */}
                  <div className="relative animate-fadeIn">
                    <span className="absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white/10 border border-white/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#8B94AA]" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display font-bold text-white/80 text-sm">Rilis Versi 2.5 (Juni 2026)</span>
                        <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-[#8B94AA] bg-white/5 px-1.5 py-0.5 rounded">Fitur Sosial AI</span>
                      </div>
                      <p className="text-xs text-[#8B94AA] mt-1 leading-relaxed">
                        Pembaruan asisten belajar paling ambisius untuk memaksimalkan kenyamanan belajarmu kakk:
                      </p>
                      <ul className="mt-2.5 space-y-1.5 text-xs text-white/70 list-disc list-inside">
                        <li><strong className="text-white/90">Niraa Chat Persona Switcher:</strong> Ubah gaya respons asisten AI secara dinamis dari <span className="text-[#00E57A]">"Supportive Bestie"</span> yang asyik ke <span className="text-blue-400">"Professional Consultant"</span> yang formal kakk!</li>
                        <li><strong className="text-white/90">Asisten Rencana Belajar AI:</strong> Susun jadwal dan breakdown belajar harian untuk mata kuliah apa saja, terintegrasi tombol konsultasi otomatis.</li>
                        <li><strong className="text-white/90">Drag & Drop Tugas Akademik:</strong> Atur prioritas tugas secara manual dengan menggeser (drag-and-drop) item tugas secara interaktif! 📋✨</li>
                        <li><strong className="text-white/90">Animasi Milestone Selesai:</strong> Efek getar halus (shake) dan pantulan bounce meriah saat status tugas diubah ke "Selesai" untuk mengapresiasi pencapaianmu.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Version 2.4 */}
                  <div className="relative">
                    <span className="absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white/10 border border-white/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#8B94AA]" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display font-bold text-white/80 text-sm">Rilis Versi 2.4 (Mei 2026)</span>
                        <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-[#8B94AA] bg-white/5 px-1.5 py-0.5 rounded">Kalkulator & Flashcard</span>
                      </div>
                      <p className="text-xs text-[#8B94AA] mt-1 leading-relaxed">
                        Sistem simulasi target akademik & pembelajaran aktif:
                      </p>
                      <ul className="mt-2 space-y-1.5 text-xs text-white/70 list-disc list-inside">
                        <li><strong className="text-white/90">Perencana Target IPK & Kalkulator SKS:</strong> Simulasi pencapaian target kelulusan dan nilai mata kuliah secara interaktif.</li>
                        <li><strong className="text-white/90">Kuis Kartu Flash AI (Active Recall):</strong> Belajar kilat menguji daya ingat menggunakan sistem flashcard interaktif bertenaga kecerdasan buatan.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 text-[10px] text-[#8B94AA]">
                  *Kami terus memperbarui TugasKu setiap minggu berdasarkan feedback langsung dari ribuan mahasiswa pengguna aktif se-Indonesia!
                </div>
              </motion.div>
            )}

            {changelogActiveTab === "roadmap" && (
              <motion.div
                key="roadmap-panel"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="bg-[#0C0E18]/60 border border-white/5 rounded-3xl p-6 sm:p-8 text-left shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                  <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#00E57A]" />
                    Peta Jalan Rilis Fitur Mendatang (Roadmap 2026)
                  </h3>
                  <span className="text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/25 px-2.5 py-0.5 rounded-full font-mono font-bold">Rencana Kuartal II</span>
                </div>

                <p className="text-xs text-[#8B94AA] mb-6">
                  Berikut adalah rencana penambahan fitur utama yang sedang dalam proses pengembangan oleh tim developer TugasKu kakk. Berikan suaramu agar pengerjaannya dipercepat!
                </p>

                {/* Roadmap Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Roadmap Item 1 */}
                  <div className="bg-[#121626]/80 border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-[#00E57A]/20 transition-all duration-300">
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-[9px] font-mono font-bold bg-[#00E57A]/10 text-[#00E57A] px-2 py-0.5 rounded">Dalam Pengerjaan</span>
                        <span className="text-[10px] font-mono text-[#8B94AA]">Q2 2026</span>
                      </div>
                      <h4 className="font-sans font-bold text-white text-xs mb-1.5">Materi PDF to Flashcard AI</h4>
                      <p className="text-[11px] text-[#8B94AA] leading-relaxed">
                        Upload berkas slide kuliah atau rangkuman PDF kakk untuk diracik jadi set flashcard otomatis dalam 3 detik!
                      </p>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-[9px] font-mono text-[#8B94AA] mb-1">
                        <span>Penyelesaian</span>
                        <span className="text-white font-bold">85%</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-[#00E57A] h-full rounded-full" style={{ width: "85%" }} />
                      </div>
                      <button 
                        onClick={() => {
                          showToast("Dukungan tercatat! Tim developer akan fokus mempercepat rilis fitur PDF-to-Flashcard ini kakk! 🚀");
                        }}
                        className="w-full mt-3 py-1.5 bg-white/5 hover:bg-[#00E57A]/10 hover:text-[#00E57A] text-[#8B94AA] border border-white/5 hover:border-[#00E57A]/20 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                      >
                        🔥 Dukung & Percepat
                      </button>
                    </div>
                  </div>

                  {/* Roadmap Item 2 */}
                  <div className="bg-[#121626]/80 border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-blue-400/20 transition-all duration-300">
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-[9px] font-mono font-bold bg-blue-400/10 text-blue-400 px-2 py-0.5 rounded">Perencanaan</span>
                        <span className="text-[10px] font-mono text-[#8B94AA]">Q2 2026</span>
                      </div>
                      <h4 className="font-sans font-bold text-white text-xs mb-1.5">Notifikasi Deadline Integrasi</h4>
                      <p className="text-[11px] text-[#8B94AA] leading-relaxed">
                        Koneksi otomatis ke Google Calendar dan WhatsApp bot pengingat pribadi agar tidak ada tugas terlewat.
                      </p>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-[9px] font-mono text-[#8B94AA] mb-1">
                        <span>Penyelesaian</span>
                        <span className="text-white font-bold">40%</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-blue-400 h-full rounded-full" style={{ width: "40%" }} />
                      </div>
                      <button 
                        onClick={() => {
                          showToast("Dukungan tercatat! Pengingat tenggat waktu akan diprioritaskan selanjutnya 📅✨");
                        }}
                        className="w-full mt-3 py-1.5 bg-white/5 hover:bg-blue-400/10 hover:text-blue-400 text-[#8B94AA] border border-white/5 hover:border-blue-400/20 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                      >
                        🔥 Dukung & Percepat
                      </button>
                    </div>
                  </div>

                  {/* Roadmap Item 3 */}
                  <div className="bg-[#121626]/80 border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-purple-400/20 transition-all duration-300">
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-[9px] font-mono font-bold bg-purple-400/10 text-purple-400 px-2 py-0.5 rounded">Riset Komunitas</span>
                        <span className="text-[10px] font-mono text-[#8B94AA]">Q3 2026</span>
                      </div>
                      <h4 className="font-sans font-bold text-white text-xs mb-1.5">Peer-to-Peer Study Lounge</h4>
                      <p className="text-[11px] text-[#8B94AA] leading-relaxed">
                        Lounge virtual interaktif tempat sesama mahasiswa se-Indonesia berkumpul, belajar bareng, dan berkolaborasi.
                      </p>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-[9px] font-mono text-[#8B94AA] mb-1">
                        <span>Penyelesaian</span>
                        <span className="text-white font-bold">15%</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-purple-400 h-full rounded-full" style={{ width: "15%" }} />
                      </div>
                      <button 
                        onClick={() => {
                          showToast("Suara tercatat! Ruang belajar komunitas virtual akan disiapkan risetnya kakk! 🌐🎓");
                        }}
                        className="w-full mt-3 py-1.5 bg-white/5 hover:bg-purple-400/10 hover:text-purple-400 text-[#8B94AA] border border-white/5 hover:border-purple-400/20 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                      >
                        🔥 Dukung & Percepat
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {changelogActiveTab === "wishlist" && (
              <motion.div
                key="wishlist-panel"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left"
              >
                {/* Voting Backlog List */}
                <div className="lg:col-span-7 bg-[#0C0E18]/60 border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                      <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#00E57A]" />
                        Backlog Usulan & Voting Mahasiswa
                      </h3>
                      <span className="text-[9px] bg-white/5 text-[#8B94AA] border border-white/10 px-2 py-0.5 rounded font-mono font-bold">Real-time Feed</span>
                    </div>

                    <p className="text-[11px] text-[#8B94AA] mb-4">
                      Suarakan fitur impianmu! Berikan suara (upvote) pada ide-ide fitur dari mahasiswa lain agar diimplementasikan secepatnya kakk.
                    </p>

                    {/* Wishlist Items List */}
                    <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                      {wishlistItems.map((item) => (
                        <div
                          key={item.id}
                          className="bg-[#121626]/60 border border-white/5 rounded-xl p-3.5 flex items-center justify-between gap-3 hover:border-white/10 transition-colors"
                        >
                          <div className="space-y-1">
                            <span className="text-[8px] font-mono font-semibold text-[#00E57A] bg-[#00E57A]/10 px-1.5 py-0.5 rounded-full">
                              {item.category}
                            </span>
                            <h4 className="text-xs text-white font-medium leading-normal pr-2">
                              {item.title}
                            </h4>
                          </div>

                          <button
                            onClick={() => {
                              handleWishlistVote(item.id);
                              if (!item.voted) {
                                setConfettiActive(true);
                                setTimeout(() => setConfettiActive(false), 2000);
                              }
                            }}
                            className={`flex flex-col items-center justify-center p-2 rounded-xl border min-w-[50px] transition-all duration-300 cursor-pointer ${
                              item.voted
                                ? "bg-[#00E57A]/10 border-[#00E57A]/30 text-[#00E57A] scale-105"
                                : "bg-white/[0.02] border-white/5 text-[#8B94AA] hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            <ThumbsUp className={`w-3.5 h-3.5 mb-1 ${item.voted ? "fill-[#00E57A]" : ""}`} />
                            <span className="text-[10px] font-mono font-bold">{item.votes}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 text-[9px] text-[#8B94AA]">
                    *Ide dengan suara upvote terbanyak akan langsung masuk ke tahap pengerjaan utama.
                  </div>
                </div>

                {/* Submit New Idea Form */}
                <div className="lg:col-span-5 bg-[#0C0E18]/60 border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                  <form onSubmit={handleAddWishlistItem} className="space-y-4">
                    <div className="border-b border-white/5 pb-3">
                      <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-[#00E57A]" />
                        Usulkan Fitur Baru
                      </h3>
                      <p className="text-[11px] text-[#8B94AA] mt-1">
                        Punya saran fitur hebat? Tuliskan ide brilianmu di bawah ini kakk, kami akan mewujudkannya!
                      </p>
                    </div>

                    {/* Category Selector */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-[#8B94AA] uppercase tracking-wider">Kategori Usulan</label>
                      <select
                        value={wishlistCategory}
                        onChange={(e) => setWishlistCategory(e.target.value)}
                        className="w-full bg-[#121626]/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#00E57A] focus:outline-none cursor-pointer font-sans"
                      >
                        <option value="Fitur Baru">Fitur Baru (General)</option>
                        <option value="Peralatan Belajar">Peralatan Belajar</option>
                        <option value="UI & Desain">UI & Desain Antarmuka</option>
                        <option value="Integrasi">Integrasi Eksternal</option>
                        <option value="Sosial & Kolaborasi">Sosial & Kolaborasi</option>
                      </select>
                    </div>

                    {/* Title Input */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-[#8B94AA] uppercase tracking-wider">Ide Fitur Akademik</label>
                      <textarea
                        value={wishlistTitle}
                        onChange={(e) => setWishlistTitle(e.target.value)}
                        placeholder="Contoh: Tambahin widget timer pomodoro yang bisa dikoneksikan ke Spotify dong kakk..."
                        rows={3}
                        className="w-full bg-[#121626]/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/25 focus:border-[#00E57A] focus:outline-none resize-none font-sans"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#00E57A] hover:bg-[#00E57A]/90 text-black font-sans font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_20px_rgba(0,229,122,0.25)] cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim Ide Terbaikmu!</span>
                    </button>
                  </form>

                  <div className="mt-4 pt-3 border-t border-white/5 text-[9px] text-[#8B94AA] leading-relaxed">
                    💡 Berikan kontribusimu demi asisten belajar TugasKu yang paling pengertian untuk seluruh mahasiswa Indonesia!
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-24 sm:py-32">
        <div className="flex flex-col items-center gap-2 text-center mb-16">
          <div className="font-mono text-xs text-[#00E57A] tracking-widest uppercase">// tanya-jawab</div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
            Yang Sering Ditanyakan
          </h2>
          <p className="text-[#8B94AA] text-sm mt-1 max-w-sm">
            Temukan jawaban cepat atas pertanyaan mendasar seputar alur transaksi jasa di TugasKu.
          </p>

          {/* Credibility Stats Badge */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs animate-fadeIn">
            <div className="flex items-center gap-2 bg-[#00E57A]/10 border border-[#00E57A]/20 px-4 py-2 rounded-2xl shadow-[0_0_20px_rgba(0,229,122,0.05)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E57A] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E57A]"></span>
              </span>
              <span className="font-mono font-bold text-[#00E57A] uppercase tracking-wider text-[11px]">
                {faqData.length} Pertanyaan Terjawab Aktif
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 px-4 py-2 rounded-2xl text-[#8B94AA]">
              <span className="font-sans font-semibold text-white">99.8%</span>
              <span className="font-mono text-[10px] uppercase tracking-wider">Kepuasan Transaksi</span>
            </div>
            
            <button
              onClick={() => {
                setAnalyticsOpen(!analyticsOpen);
                showToast(!analyticsOpen ? "Membuka analisis pertanyaan terpopuler! 📊✨" : "Dashboard analisis ditutup 📊");
              }}
              className={`flex items-center gap-2 border px-4 py-2 rounded-2xl cursor-pointer text-xs font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                analyticsOpen 
                  ? "bg-[#00E57A]/10 border-[#00E57A]/30 text-[#00E57A] shadow-[0_0_15px_rgba(0,229,122,0.1)]" 
                  : "bg-white/[0.02] border border-white/5 text-[#8B94AA] hover:border-white/10 hover:text-white"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{analyticsOpen ? "Sembunyikan Analisis" : "Lihat Analisis FAQ"}</span>
            </button>
          </div>

          {/* Quick Filter Badges in Header */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8B94AA] mr-1">Filter Kategori:</span>
            {["Semua", "Proses Pengerjaan", "Pembayaran", "Keamanan"].map((categoryName) => {
              const isActive = activeFaqCategory === categoryName;
              return (
                <button
                  key={categoryName}
                  onClick={() => {
                    setActiveFaqCategory(categoryName);
                    setExpandedFaq(null);
                    showToast(`Kategori FAQ disaring: ${categoryName} 🔍`);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                    isActive
                      ? "bg-[#00E57A]/15 border-[#00E57A]/35 text-[#00E57A] shadow-[0_0_15px_rgba(0,229,122,0.1)] font-semibold"
                      : "bg-white/[0.02] border-white/5 text-[#8B94AA] hover:border-white/10 hover:text-white"
                  }`}
                >
                  {categoryName === "Pembayaran" && <CreditCard className="w-3 h-3" />}
                  {categoryName === "Proses Pengerjaan" && <Clock className="w-3 h-3" />}
                  {categoryName === "Keamanan" && <Shield className="w-3 h-3" />}
                  <span>{categoryName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tone Switch Toggle */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 bg-white/[0.01] border border-white/5 px-5 py-3 rounded-2xl max-w-md mx-auto mb-10">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#8B94AA] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#00E57A]" />
            Gaya Bahasa Nira:
          </span>
          <div className="bg-[#0C0E18]/80 border border-white/10 p-0.5 rounded-xl flex items-center relative w-full sm:w-auto">
            <button
              onClick={() => {
                setFaqTone("formal");
                showToast("Gaya bahasa diubah ke Formal! 👔");
              }}
              className={`relative px-4 py-1.5 text-xs font-display font-semibold rounded-lg flex-1 sm:flex-none transition-colors duration-300 flex items-center justify-center gap-1.5 ${
                faqTone === "formal" ? "text-black font-bold" : "text-[#8B94AA] hover:text-white"
              }`}
            >
              {faqTone === "formal" && (
                <motion.span
                  layoutId="activeFaqToneTab"
                  className="absolute inset-0 bg-[#00E57A] rounded-lg"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
              <span className="relative z-10">Formal 👔</span>
            </button>

            <button
              onClick={() => {
                setFaqTone("bestie");
                showToast("Gaya bahasa diubah ke Bestie! 💬✨");
              }}
              className={`relative px-4 py-1.5 text-xs font-display font-semibold rounded-lg flex-1 sm:flex-none transition-colors duration-300 flex items-center justify-center gap-1.5 ${
                faqTone === "bestie" ? "text-black font-bold" : "text-[#8B94AA] hover:text-white"
              }`}
            >
              {faqTone === "bestie" && (
                <motion.span
                  layoutId="activeFaqToneTab"
                  className="absolute inset-0 bg-[#00E57A] rounded-lg"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
              <span className="relative z-10">Bestie 💬</span>
            </button>
          </div>
        </div>

        {/* FAQ Quick Filter Tab Bar */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="bg-[#0C0E18]/60 border border-white/5 p-1 rounded-2xl flex flex-col sm:flex-row gap-1 relative backdrop-blur-xl shadow-2xl">
            {["Semua", "Proses Pengerjaan", "Pembayaran", "Keamanan"].map((categoryName) => {
              const isActive = activeFaqCategory === categoryName;
              return (
                <button
                  key={categoryName}
                  onClick={() => {
                    setActiveFaqCategory(categoryName);
                    setExpandedFaq(null);
                    showToast(`Menampilkan FAQ: ${categoryName} 🔍`);
                  }}
                  className={`relative flex-1 py-3 px-4 text-xs font-display font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors duration-300 ${
                    isActive ? "text-[#00E57A]" : "text-[#8B94AA] hover:text-white"
                  }`}
                >
                  {/* Sliding active background indicator */}
                  {isActive && (
                    <motion.span
                      layoutId="activeFaqTab"
                      className="absolute inset-0 bg-[#00E57A]/[0.08] border border-[#00E57A]/20 rounded-xl shadow-[0_0_15px_rgba(0,229,122,0.05)]"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                  
                  {/* Icon & Label */}
                  <span className="relative z-10 flex items-center gap-2">
                    {categoryName === "Pembayaran" && <CreditCard className={`w-3.5 h-3.5 ${isActive ? "text-[#00E57A]" : "text-[#8B94AA]"}`} />}
                    {categoryName === "Proses Pengerjaan" && <Clock className={`w-3.5 h-3.5 ${isActive ? "text-[#00E57A]" : "text-[#8B94AA]"}`} />}
                    {categoryName === "Keamanan" && <Shield className={`w-3.5 h-3.5 ${isActive ? "text-[#00E57A]" : "text-[#8B94AA]"}`} />}
                    <span>{categoryName}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search within FAQ (Internal) */}
        <div className="max-w-2xl mx-auto mb-10 animate-fadeIn" id="faq-search-container">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B94AA] pointer-events-none" />
            <input
              type="text"
              id="search-within-faq"
              value={faqSearchQuery}
              onChange={(e) => setFaqSearchQuery(e.target.value)}
              placeholder="Cari pertanyaan atau jawaban spesifik di sini..."
              className="w-full bg-[#111420]/90 border border-white/10 focus:border-[#00E57A] focus:ring-1 focus:ring-[#00E57A]/20 rounded-full pl-11 pr-10 py-3 text-sm text-white placeholder-[#8B94AA]/60 outline-none transition-all font-medium shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
            />
            {faqSearchQuery && (
              <button
                onClick={() => {
                  setFaqSearchQuery("");
                  showToast("Pencarian internal FAQ direset. 🧹");
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B94AA] hover:text-white transition-colors"
                title="Bersihkan pencarian"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Visual Analytics Dashboard for FAQs */}
        <AnimatePresence>
          {analyticsOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8 max-w-2xl mx-auto"
            >
              <div className="bg-[#0C0E18] border border-[#00E57A]/20 rounded-2xl p-5 sm:p-6 text-left relative shadow-2xl">
                {/* subtle decorative background gradient */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-radial-gradient from-[#00E57A]/5 to-transparent pointer-events-none rounded-full blur-2xl" />
                
                <div className="flex items-center justify-between mb-5 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#00E57A]/10 border border-[#00E57A]/20 flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-[#00E57A]" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-sm text-white leading-tight">Tren Minat Pengunjung</h3>
                      <span className="text-[9px] font-mono text-[#8B94AA] uppercase tracking-wider">Statistik Top 5 Pertanyaan Terpopuler</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      // simulate bulk random traffic
                      const simulated = { ...faqViews };
                      faqData.forEach(f => {
                        simulated[f.question] = (simulated[f.question] || 0) + Math.floor(Math.random() * 25) + 5;
                      });
                      setFaqViews(simulated);
                      showToast("Simulasi traffic berhasil masuk! 📊🚀");
                    }}
                    className="bg-[#00E57A]/10 border border-[#00E57A]/20 hover:bg-[#00E57A]/20 text-[#00E57A] font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer"
                    title="Simulasikan traffic pengunjung tambahan secara acak"
                  >
                    Simulasi Traffic
                  </button>
                </div>

                {/* Bar Chart list */}
                <div className="space-y-4">
                  {topFaqs.map((faq, index) => {
                    const pct = (faq.views / maxViews) * 100;
                    return (
                      <div key={faq.question} className="space-y-1.5">
                        <div className="flex justify-between items-start gap-4 text-xs font-medium">
                          <span className="text-white font-sans line-clamp-1 flex-1">
                            <span className="text-[#00E57A] font-bold font-mono mr-1.5">{index + 1}.</span>
                            {faq.question}
                          </span>
                          <div className="flex items-center gap-3 shrink-0 text-[10px] font-mono text-[#8B94AA]">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3 text-[#38BDF8]" />
                              <span>{faq.views} views</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="w-3 h-3 text-[#00E57A]" />
                              <span>{faq.likes}</span>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2.5 bg-[#111420] border border-white/5 rounded-full overflow-hidden relative">
                            <motion.div
                              className="h-full bg-gradient-to-r from-[#00E57A] via-[#00E57A] to-[#38BDF8] rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                            />
                          </div>
                          
                          {/* Inline view stimulator */}
                          <button
                            onClick={() => {
                              setFaqViews(prev => ({
                                ...prev,
                                [faq.question]: (prev[faq.question] || 0) + 12
                              }));
                              showToast(`+12 views disimulasikan untuk pertanyaan ke-${index + 1}! 📈`);
                            }}
                            className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/5 hover:border-[#00E57A]/20 hover:text-[#00E57A] transition-all text-[#8B94AA] cursor-pointer"
                            title="Klik untuk mensimulasikan kunjungan pada pertanyaan ini"
                          >
                            +12 View
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Mini Insights Grid */}
                <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-white/5">
                  <div className="bg-[#111420]/60 p-2.5 border border-white/5 rounded-xl">
                    <span className="text-[8px] font-mono text-[#8B94AA] block uppercase tracking-wider mb-0.5">TERPOPULER 🔥</span>
                    <span className="text-[10px] font-bold text-white line-clamp-1">{topFaqs[0]?.question || "-"}</span>
                  </div>
                  <div className="bg-[#111420]/60 p-2.5 border border-white/5 rounded-xl text-center">
                    <span className="text-[8px] font-mono text-[#8B94AA] block uppercase tracking-wider mb-0.5">TOTAL MINAT BACA</span>
                    <span className="text-xs font-extrabold font-mono text-[#00E57A]">
                      {(Object.values(faqViews) as number[]).reduce((a, b) => a + b, 0)} kali
                    </span>
                  </div>
                  <div className="bg-[#111420]/60 p-2.5 border border-[#4a90e2]/10 rounded-xl text-center">
                    <span className="text-[8px] font-mono text-[#8B94AA] block uppercase tracking-wider mb-0.5">ENGAGEMENT RATE</span>
                    <span className="text-xs font-extrabold font-mono text-[#38BDF8]">
                      {Math.round(((Object.values(faqHelpfulVotes) as number[]).reduce((a, b) => a + b, 0) / (Object.values(faqViews) as number[]).reduce((a, b) => a + b, 1)) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Expand / Collapse Control Bar */}
        {finalFaqs.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/5">
            <div className="text-[10px] font-mono text-[#8B94AA] uppercase tracking-wider">
              {searchQuery || faqSearchQuery ? "Hasil Pencarian" : `Kategori: ${activeFaqCategory}`}
            </div>
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={() => {
                  setExpandedCategories(["Proses Pengerjaan", "Pembayaran", "Keamanan"]);
                  showToast("Semua kategori FAQ telah dibuka. 📂");
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-wider bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.08] text-[#8B94AA] hover:text-white rounded-xl transition-all duration-300"
              >
                <ChevronDown className="w-3.5 h-3.5 text-[#00E57A]" />
                <span>Buka Semua</span>
              </button>
              <button
                onClick={() => {
                  setExpandedCategories([]);
                  showToast("Semua kategori FAQ telah ditutup. 📁");
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-wider bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.08] text-[#8B94AA] hover:text-white rounded-xl transition-all duration-300"
              >
                <ChevronUp className="w-3.5 h-3.5 text-rose-400" />
                <span>Tutup Semua</span>
              </button>
              <button
                onClick={handlePrintFaq}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-wider bg-[#00E57A]/10 border border-[#00E57A]/20 hover:border-[#00E57A]/30 hover:bg-[#00E57A]/20 text-[#00E57A] rounded-xl transition-all duration-300"
                title="Cetak FAQ / Simpan sebagai PDF"
              >
                <Printer className="w-3.5 h-3.5 text-[#00E57A]" />
                <span>Cetak FAQ</span>
              </button>
            </div>
          </div>
        )}

        {searchQuery && filteredFaqs.length > 0 && (
          <div className="mb-3 text-xs text-[#8B94AA] text-left animate-fadeIn">
            Pencarian Global: Menyaring <span className="text-[#00E57A] font-bold">{filteredFaqs.length}</span> tanya-jawab untuk "<span className="text-white font-semibold">{searchQuery}</span>"
          </div>
        )}

        {faqSearchQuery && finalFaqs.length > 0 && (
          <div className="mb-6 text-xs text-[#8B94AA] text-left animate-fadeIn">
            Pencarian Internal FAQ: Menampilkan <span className="text-[#00E57A] font-bold">{finalFaqs.length}</span> tanya-jawab yang cocok
          </div>
        )}

        {isFaqLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((groupIndex) => (
              <div
                key={groupIndex}
                className="bg-[#111420]/40 border border-white/5 rounded-2xl overflow-hidden animate-pulse"
              >
                {/* Category Header Skeleton */}
                <div className="w-full flex items-center justify-between p-5 bg-[#111420] border-b border-white/5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 shrink-0 animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 w-40 bg-white/10 rounded-md animate-pulse" />
                      <div className="h-3 w-20 bg-white/5 rounded-md animate-pulse" />
                    </div>
                  </div>
                  <div className="h-8 w-24 bg-white/5 rounded-xl border border-white/10 animate-pulse" />
                </div>

                {/* Question Row Skeletons */}
                <div className="divide-y divide-white/5 bg-[#0C0E18]/40">
                  {[1, 2].map((itemIndex) => (
                    <div key={itemIndex} className="p-6 flex items-center justify-between">
                      <div className="h-4 w-2/3 bg-white/10 rounded-md animate-pulse" />
                      <div className="h-5 w-5 bg-white/5 rounded-full animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : finalFaqs.length === 0 ? (
          <div className="bg-[#0C0E18] border border-white/5 rounded-2xl p-10 text-center space-y-4 animate-fadeIn">
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-xl mx-auto">❓</div>
            <div className="space-y-1">
              <h4 className="font-display font-bold text-white text-base">FAQ Tidak Ditemukan</h4>
              <p className="text-xs text-[#8B94AA] max-w-sm mx-auto leading-relaxed">
                Kami tidak menemukan tanya-jawab dengan kata kunci tersebut. Silakan bersihkan filter pencarian atau hubungi admin kami secara langsung.
              </p>
            </div>
            <div className="flex justify-center pt-2 gap-3">
              {faqSearchQuery && (
                <button
                  onClick={() => {
                    setFaqSearchQuery("");
                    showToast("Pencarian internal dibersihkan! 🧹");
                  }}
                  className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-mono text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-xl font-bold transition-all"
                >
                  Reset Cari Internal
                </button>
              )}
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    showToast("Pencarian global dibersihkan! 🧹");
                  }}
                  className="bg-[#00E57A]/10 border border-[#00E57A]/20 hover:bg-[#00E57A]/20 text-[#00E57A] font-mono text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-xl font-bold transition-all"
                >
                  Reset Cari Global
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {["Proses Pengerjaan", "Pembayaran", "Keamanan"]
              .filter((cat) => {
                const hasMatches = displayedFaqs.some((faq) => faq.category === cat);
                if (searchQuery || faqSearchQuery) return hasMatches;
                return activeFaqCategory === "Semua" || activeFaqCategory === cat;
              })
              .map((cat) => {
                const faqsInCat = displayedFaqs.filter((faq) => faq.category === cat);
                if (faqsInCat.length === 0) return null;

                const isCatExpanded = expandedCategories.includes(cat);
                const CatIcon = cat === "Pembayaran" ? CreditCard : cat === "Proses Pengerjaan" ? Clock : Shield;
                const catColor = cat === "Pembayaran" ? "text-[#00E57A]" : cat === "Proses Pengerjaan" ? "text-[#38BDF8]" : "text-amber-400";
                const catBg = cat === "Pembayaran" ? "bg-[#00E57A]/5" : cat === "Proses Pengerjaan" ? "bg-[#38BDF8]/5" : "bg-amber-400/5";
                const catBorder = cat === "Pembayaran" ? "border-[#00E57A]/15" : cat === "Proses Pengerjaan" ? "border-[#38BDF8]/15" : "border-amber-400/15";

                return (
                  <div 
                    key={cat} 
                    className="bg-[#111420]/60 border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/10"
                  >
                     {/* Collapsible Category Header Card */}
                     <div className="w-full flex items-center justify-between p-5 bg-[#111420] border-b border-white/5">
                       <button
                         onClick={() => {
                           if (isCatExpanded) {
                             setExpandedCategories(expandedCategories.filter((c) => c !== cat));
                           } else {
                             setExpandedCategories([...expandedCategories, cat]);
                           }
                         }}
                         className="flex-1 flex items-center gap-3.5 text-left focus:outline-none"
                       >
                         <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${catBg} ${catColor} border ${catBorder} shrink-0`}>
                           <CatIcon className="w-4 h-4" />
                         </div>
                         <div>
                           <h3 className="font-display font-bold text-white text-sm sm:text-base tracking-tight">{cat}</h3>
                           <p className="text-[10px] font-mono text-[#8B94AA] mt-0.5">{faqsInCat.length} Pertanyaan</p>
                         </div>
                       </button>

                       <div className="flex items-center gap-2.5 shrink-0 ml-4">
                         <button
                           onClick={(e) => {
                             e.stopPropagation();
                             const msg = `Halo Admin TugasKu 👋 Saya ingin bertanya lebih lanjut mengenai FAQ kategori *${cat.toUpperCase()}*. Bagaimana rincian ketentuannya?`;
                             openWhatsApp(msg);
                             showToast(`Membuka WhatsApp untuk kategori ${cat}... 💬`);
                           }}
                           className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00E57A]/10 hover:bg-[#00E57A]/20 border border-[#00E57A]/20 text-[#00E57A] font-mono text-[10px] font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,229,122,0.05)] hover:scale-[1.03] active:scale-95"
                         >
                           <MessageCircle className="w-3.5 h-3.5 fill-[#00E57A]/10 shrink-0" />
                           <span className="hidden sm:inline">Tanya Admin</span>
                           <span className="sm:hidden">Tanya</span>
                         </button>

                         <button
                           onClick={() => {
                             if (isCatExpanded) {
                               setExpandedCategories(expandedCategories.filter((c) => c !== cat));
                             } else {
                               setExpandedCategories([...expandedCategories, cat]);
                             }
                           }}
                           className="text-[#8B94AA] bg-white/5 hover:bg-white/10 p-1.5 rounded-lg border border-white/5 transition-all"
                         >
                           <motion.div
                             animate={{ rotate: isCatExpanded ? 180 : 0 }}
                             transition={{ duration: 0.3 }}
                           >
                             <ChevronDown className="w-4 h-4" />
                           </motion.div>
                         </button>
                       </div>
                     </div>

                    {/* Collapsible Category Questions */}
                    <AnimatePresence initial={false}>
                      {isCatExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="divide-y divide-white/5 bg-[#0C0E18]/40">
                            {faqsInCat.map((faq) => {
                              const isFaqExpanded = expandedFaq === faq.question;
                              const isHighlighted = highlightedFaq === faq.question;
                              return (
                                <motion.div
                                  key={faq.question}
                                  animate={
                                    isHighlighted
                                      ? {
                                          backgroundColor: ["rgba(0, 229, 122, 0)", "rgba(0, 229, 122, 0.06)", "rgba(0, 229, 122, 0)"],
                                          borderColor: ["rgba(255, 255, 255, 0.05)", "rgba(0, 229, 122, 0.3)", "rgba(255, 255, 255, 0.05)"],
                                        }
                                      : isFaqExpanded
                                      ? {
                                          borderColor: ["rgba(0, 229, 122, 0.2)", "rgba(0, 229, 122, 0.5)", "rgba(0, 229, 122, 0.2)"],
                                          backgroundColor: "rgba(0, 229, 122, 0.025)",
                                          boxShadow: [
                                            "0 0 15px rgba(0, 229, 122, 0.05), inset 0 0 10px rgba(0, 229, 122, 0.01)",
                                            "0 0 35px rgba(0, 229, 122, 0.22), inset 0 0 20px rgba(0, 229, 122, 0.08)",
                                            "0 0 15px rgba(0, 229, 122, 0.05), inset 0 0 10px rgba(0, 229, 122, 0.01)"
                                          ],
                                        }
                                      : {
                                          borderColor: "rgba(255, 255, 255, 0.05)",
                                          backgroundColor: "rgba(0, 0, 0, 0)",
                                          boxShadow: "0 0 0px rgba(0, 0, 0, 0)",
                                        }
                                  }
                                  transition={
                                    isHighlighted
                                      ? {
                                          duration: 1.5,
                                          repeat: Infinity,
                                          ease: "easeInOut"
                                        }
                                      : isFaqExpanded
                                      ? {
                                          duration: 3,
                                          repeat: Infinity,
                                          ease: "easeInOut"
                                        }
                                      : {
                                          duration: 0.4,
                                          ease: "easeOut"
                                        }
                                  }
                                  className={`faq-item border-b border-white/5 last:border-none transition-all duration-300 relative hover:z-10 hover:-translate-y-1 hover:rounded-2xl hover:border-white/10 hover:bg-white/[0.02] hover:shadow-[0_12px_36px_rgba(0,229,122,0.08)] ${
                                    isFaqExpanded
                                      ? "z-10 border-[#00E57A]/35 bg-[#00E57A]/[0.02] shadow-[0_0_25px_rgba(0,229,122,0.12)] rounded-2xl"
                                      : isHighlighted
                                      ? "z-10 shadow-[0_0_20px_rgba(0,229,122,0.1)] rounded-xl bg-[#00E57A]/[0.02]"
                                      : ""
                                  }`}
                                >
                                  <button
                                    onClick={() => handleFaqExpand(faq.question)}
                                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none hover:bg-white/[0.01] transition-colors group"
                                  >
                                    <span className="font-display font-bold text-white sm:text-base tracking-tight group-hover:text-[#00E57A] transition-colors">
                                      {faq.question}
                                    </span>
                                    <motion.div
                                      animate={{ rotate: isFaqExpanded ? 180 : 0 }}
                                      transition={{ duration: 0.3, ease: "easeInOut" }}
                                      className="shrink-0 ml-4"
                                    >
                                      <ChevronDown className={`w-5 h-5 transition-colors duration-300 ${isFaqExpanded ? "text-[#00E57A]" : "text-[#8B94AA]"}`} />
                                    </motion.div>
                                  </button>
                                  <AnimatePresence initial={false}>
                                    {isFaqExpanded && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                      >
                                        <div className="p-6 pt-0 border-t border-white/[0.02] flex flex-col">
                                          {!loadedFaqAnswers[faq.question] ? (
                                            <div className="relative pl-4 border-l-2 border-[#00E57A]/40 py-1.5 space-y-2.5 animate-pulse mt-4 text-left">
                                              <div className="h-3.5 w-full bg-white/10 rounded-md animate-pulse" />
                                              <div className="h-3.5 w-[92%] bg-white/10 rounded-md animate-pulse" />
                                              <div className="h-3.5 w-[65%] bg-white/10 rounded-md animate-pulse" />
                                              <div className="text-[10px] font-mono text-[#8B94AA]/60 flex items-center gap-1.5 pt-1">
                                                <span className="flex h-1.5 w-1.5 relative">
                                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E57A] opacity-75"></span>
                                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00E57A]"></span>
                                                </span>
                                                <span>Menyiapkan jawaban spesialis akademisi...</span>
                                              </div>
                                            </div>
                                          ) : (
                                            <>
                                              <div className="relative mt-4">
                                                <p className={`text-sm text-[#8B94AA] leading-relaxed pl-4 border-l-2 border-[#00E57A] transition-all duration-300 ${
                                                  (!expandedAnswerTexts[faq.question] && faq.answer.length > 130) ? "line-clamp-2" : ""
                                                }`}>
                                                  {faq.answer}
                                                </p>
                                                {faq.answer.length > 130 && (
                                                  <button
                                                    onClick={() => {
                                                      setExpandedAnswerTexts(prev => ({
                                                        ...prev,
                                                        [faq.question]: !prev[faq.question]
                                                      }));
                                                      showToast(expandedAnswerTexts[faq.question] ? "Jawaban disederhanakan." : "Menampilkan jawaban selengkapnya. 📖");
                                                    }}
                                                    className="mt-2.5 ml-4 text-[10px] font-bold text-[#00E57A] hover:text-[#00ca6d] transition-colors focus:outline-none flex items-center gap-1 font-mono uppercase tracking-wider bg-[#00E57A]/5 hover:bg-[#00E57A]/10 px-2.5 py-1 rounded-lg border border-[#00E57A]/10"
                                                  >
                                                    {expandedAnswerTexts[faq.question] ? "Sembunyikan" : "...baca selengkapnya"}
                                                  </button>
                                                )}
                                              </div>
                                              <div className="mt-4 pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs pl-4">
                                                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#8B94AA]">
                                                  <span>Apakah jawaban ini membantu?</span>
                                                  {(faqHelpfulVotes[faq.question] || 0) > 0 && (
                                                    <span className="text-[#00E57A] font-bold">
                                                      • {faqHelpfulVotes[faq.question]} orang terbantu
                                                    </span>
                                                  )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                  <button
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      setFocusFaq(faq);
                                                      showToast("Mode Baca Fokus aktif! 📖");
                                                    }}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/5 bg-white/[0.02] text-[#8B94AA] hover:border-[#00E57A]/30 hover:bg-[#00E57A]/10 hover:text-[#00E57A] transition-all duration-300 text-[10px] font-mono font-bold uppercase tracking-wider"
                                                    title="Buka dalam Mode Baca Fokus"
                                                  >
                                                    <Eye className="w-3 h-3" />
                                                    <span>Mode Baca Fokus</span>
                                                  </button>
                                                  <button
                                                    onClick={() => handleFaqFeedback(faq.question, 'up')}
                                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-mono font-bold uppercase transition-all duration-300 ${
                                                      userFaqFeedback[faq.question] === 'up'
                                                        ? "bg-[#00E57A]/10 border-[#00E57A]/30 text-[#00E57A] shadow-[0_0_10px_rgba(0,229,122,0.05)]"
                                                        : "bg-white/[0.02] border-white/5 text-[#8B94AA] hover:border-white/10 hover:text-white"
                                                    }`}
                                                  >
                                                    <ThumbsUp className={`w-3 h-3 ${userFaqFeedback[faq.question] === 'up' ? 'fill-[#00E57A]/20' : ''}`} />
                                                    <span>Ya</span>
                                                  </button>
                                                  <button
                                                    onClick={() => handleFaqFeedback(faq.question, 'down')}
                                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-mono font-bold uppercase transition-all duration-300 ${
                                                      userFaqFeedback[faq.question] === 'down'
                                                        ? "bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.05)]"
                                                        : "bg-white/[0.02] border-white/5 text-[#8B94AA] hover:border-white/10 hover:text-white"
                                                    }`}
                                                  >
                                                    <ThumbsDown className={`w-3 h-3 ${userFaqFeedback[faq.question] === 'down' ? 'fill-rose-500/20' : ''}`} />
                                                    <span>Tidak</span>
                                                  </button>
                                                </div>
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </motion.div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
          </div>
        )}

        {/* Show More / Show Less Button */}
        {finalFaqs.length > 10 && (
          <div className="flex justify-center mt-8 animate-fadeIn">
            <button
              onClick={() => {
                if (faqLimit === 10) {
                  setFaqLimit(999);
                  showToast("Menampilkan seluruh pertanyaan umum. 📂");
                } else {
                  setFaqLimit(10);
                  showToast("Tampilan pertanyaan disederhanakan. 📁");
                  const faqSec = document.getElementById("faq");
                  if (faqSec) {
                    faqSec.scrollIntoView({ behavior: "smooth" });
                  }
                }
              }}
              className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#00E57A]/30 hover:bg-[#00E57A]/5 text-white font-mono text-[11px] font-bold uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_20px_rgba(0,229,122,0.05)]"
            >
              {faqLimit === 10 ? (
                <>
                  <span>Tampilkan Lebih Banyak ({finalFaqs.length - 10} Lainnya)</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#00E57A]" />
                </>
              ) : (
                <>
                  <span>Sederhanakan Tampilan</span>
                  <ChevronUp className="w-3.5 h-3.5 text-rose-400" />
                </>
              )}
            </button>
          </div>
        )}
      </section>

      {/* Forms Section */}
      <section id="form-section" className="bg-[#0C0E18] border-t border-white/5 py-24">
        <div className="max-w-2xl mx-auto px-6">
          <div className="flex flex-col items-center text-center gap-2 mb-12">
            <div className="font-mono text-xs text-[#00E57A] tracking-widest uppercase">// pendaftaran order</div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight">Siap Mulai? Silakan Daftar</h2>
            <p className="text-[#8B94AA] text-sm max-w-md">
              Gunakan form di bawah ini untuk konsultasi umum secara bebas atau langsung buat spesifikasi pesanan tugas Anda.
            </p>
          </div>

          {/* Form Tabs */}
          <div className="grid grid-cols-2 bg-[#07080D] p-1.5 border border-white/5 rounded-xl mb-8">
            <button
              onClick={() => setActiveTab("konsultasi")}
              className={`py-3 text-sm font-display font-semibold rounded-lg transition-colors ${
                activeTab === "konsultasi"
                  ? "bg-[#1E2333] text-[#00E57A] border border-white/5"
                  : "text-[#8B94AA] hover:text-white"
              }`}
            >
              Konsultasi Gratis
            </button>
            <button
              onClick={() => setActiveTab("order")}
              className={`py-3 text-sm font-display font-semibold rounded-lg transition-colors ${
                activeTab === "order"
                  ? "bg-[#1E2333] text-[#00E57A] border border-white/5"
                  : "text-[#8B94AA] hover:text-white"
              }`}
            >
              Buat Pesanan Baru
            </button>
          </div>

          {activeTab === "konsultasi" ? (
            <form onSubmit={handleConsultSubmit} className="space-y-5 text-left">
              <div>
                <label className="block text-mono uppercase tracking-widest text-[9px] text-[#444D62] font-semibold mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap Anda"
                  value={cNama}
                  onChange={(e) => setCNama(e.target.value)}
                  className="w-full bg-[#07080D] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:border-[#00E57A] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-mono uppercase tracking-widest text-[9px] text-[#444D62] font-semibold mb-2">Pertanyaan / Kebutuhan</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Ceritakan detail tugas atau kendala kuliah yang sedang Anda alami saat ini..."
                  value={cTxt}
                  onChange={(e) => setCTxt(e.target.value)}
                  className="w-full bg-[#07080D] border border-white/10 rounded-lg p-4 text-sm text-white placeholder-white/20 focus:border-[#00E57A] focus:outline-none transition-colors resize-y min-h-[100px]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#00E57A] text-black font-semibold tracking-tight text-sm py-4 rounded-lg hover:bg-[#00ca6d] hover:shadow-[0_0_25px_rgba(0,229,122,0.25)] transition-all flex items-center justify-center gap-2"
              >
                Kirim via WhatsApp <ExternalLink className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleOrderSubmit} className="space-y-5 text-left">
              <div>
                <label className="block text-mono uppercase tracking-widest text-[9px] text-[#444D62] font-semibold mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap Anda"
                  value={oNama}
                  onChange={(e) => setONama(e.target.value)}
                  className="w-full bg-[#07080D] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:border-[#00E57A] focus:outline-none transition-colors"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-mono uppercase tracking-widest text-[9px] text-[#444D62] font-semibold mb-2">Pilih Jasa Joki</label>
                  <select
                    required
                    value={oSvc}
                    onChange={(e) => setOSvc(e.target.value)}
                    className="w-full bg-[#07080D] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-[#00E57A] focus:outline-none transition-colors appearance-none"
                  >
                    <option value="" className="text-white/20">Pilih Layanan...</option>
                    <option value="Jasa Joki Tugas Akademik (Makalah/Esai/PPT)">Tugas Akademik — Mulai Rp50k</option>
                    <option value="Jasa Pembimbingan Skripsi / Thesis / TA">Skripsi & TA — Mulai Rp250k</option>
                    <option value="Jasa Coding Project / Landing Page / Web App">Digital Project — Mulai Rp350k</option>
                  </select>
                </div>
                <div>
                  <label className="block text-mono uppercase tracking-widest text-[9px] text-[#444D62] font-semibold mb-2">Batas Pengumpulan (Deadline)</label>
                  <input
                    type="date"
                    required
                    value={oDl}
                    onChange={(e) => setODl(e.target.value)}
                    className="w-full bg-[#07080D] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-[#00E57A] focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-mono uppercase tracking-widest text-[9px] text-[#444D62] font-semibold mb-2">Spesifikasi Detail Tugas</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Jelaskan secara ringkas instruksi tugas, format pengiriman file, bahasa pemrogaman yang dipakai (bila ada), dan referensi dari universitas..."
                  value={oDetail}
                  onChange={(e) => setODetail(e.target.value)}
                  className="w-full bg-[#07080D] border border-white/10 rounded-lg p-4 text-sm text-white placeholder-white/20 focus:border-[#00E57A] focus:outline-none transition-colors resize-y min-h-[100px]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#00E57A] text-black font-semibold tracking-tight text-sm py-4 rounded-lg hover:bg-[#00ca6d] hover:shadow-[0_0_25px_rgba(0,229,122,0.25)] transition-all flex items-center justify-center gap-2"
              >
                Kirim Pembelian Jasa &rarr;
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 sm:px-12 bg-[#07080D]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start group select-none">
            <span className="font-display font-black text-lg tracking-tight text-white">
              Tugas<span className="text-[#00E57A]">Ku</span>
            </span>
            <span className="text-[8px] font-mono uppercase tracking-[0.18em] text-[#8B94AA] font-bold mt-1">
              Academic Services
            </span>
            <span className="w-4 h-0.5 bg-[#00E57A] rounded-full shadow-[0_0_6px_#00E57A] mt-1" />
          </div>
          <span className="text-xs font-mono text-[#444D62]">&copy; 2026 TugasKu Indonesia. Hak Cipta Dilindungi Undang-Undang.</span>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            className="font-mono text-xs text-[#8B94AA] hover:text-[#00E57A] transition-colors"
          >
            Hubungi WhatsApp: +62 856-9300-9756
          </a>
        </div>
      </footer>

      {/* Floating Widgets Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 items-end select-none">
        
        {/* WhatsApp Floating Button */}
        <div className="flex items-center gap-3 group">
          <span className="hidden sm:inline-block bg-[#050508]/95 border border-[#25D366]/30 text-white px-3 py-1.5 rounded-lg text-xs font-mono font-medium shadow-2xl transition-all duration-300 translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
            Hubungi Admin WA (Respons &lt;1 Jam) 📲
          </span>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            className="w-14 h-14 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-[0_8px_30px_rgba(37,211,102,0.4)] hover:scale-110 active:scale-95 transition-all duration-300"
            title="Hubungi Admin WhatsApp"
          >
            <MessageCircle className="w-7 h-7 fill-white stroke-none" />
          </a>
        </div>

        {/* API Gateway Floating Status Button (Free Sandbox Security Shield) */}
        <div className="flex items-center gap-3 group">
          <span className="hidden sm:inline-block bg-[#050508]/95 border border-[#00E57A]/20 text-[#8B94AA] px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-300 translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
            API Gateway Shield {gatewayStats.status === "HEALTHY" ? "🟢" : "🔴"}
          </span>
          <button
            onClick={() => {
              setGatewayOpen(!gatewayOpen);
              setChatOpen(false); // mutually exclusive helper
            }}
            className={`w-12 h-12 rounded-xl border flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 relative ${
              gatewayOpen 
                ? "bg-[#00E57A]/15 border-[#00E57A] text-[#00E57A]"
                : "bg-gradient-to-tr from-[#0C0E18] to-[#1E2333] border-white/10 text-[#8B94AA] hover:border-[#00E57A]/40 hover:text-[#00E57A]"
            }`}
            title="API Gateway Monitor & Security Panel"
          >
            <Shield className="w-5 h-5" />
            {gatewayStats.circuitBreakerState !== "CLOSED" && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#FF5F57] border-2 border-[#07080D] flex items-center justify-center text-[7px] font-mono font-bold text-white animate-pulse">
                !
              </span>
            )}
          </button>
        </div>

        {/* Chatbot Toggle Button with Notif Badge */}
        <div className="flex items-center gap-3 group">
          {/* Always visible label to emphasize Niraaa AI */}
          <span className="bg-[#050508]/95 border border-[#00E57A]/40 text-[#00E57A] px-3 py-1.5 rounded-lg text-xs font-mono font-medium shadow-2xl transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap animate-pulse hover:animate-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E57A] animate-ping" />
            Chat Niraaa AI Bestie ✨
          </span>
          <button
            onClick={() => {
              setChatOpen(!chatOpen);
              setGatewayOpen(false); // mutually exclusive helper
              setChatNotif(false);
            }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0E1B15] to-[#163524] border border-[#00E57A]/50 text-[#00E57A] flex items-center justify-center shadow-[0_8px_30px_rgba(0,229,122,0.3)] hover:scale-110 active:scale-95 transition-all duration-300 relative"
            title="Tanya AI Asisten TugasKu"
          >
            {chatNotif && !chatOpen && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#FF5F57] border-2 border-[#07080D] flex items-center justify-center text-[8px] font-mono font-bold text-white animate-bounce-short">
                1
              </span>
            )}
            {chatOpen ? <X className="w-7 h-7 text-[#00E57A]" /> : <MessageSquare className="w-7 h-7 text-[#00E57A]" />}
          </button>
        </div>
      </div>

      {/* Stateful Streaming API Gateway Analytics HUD */}
      <AnimatePresence>
        {gatewayOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed bottom-[130px] right-6 z-50 w-full max-w-[380px] bg-[#0C0E18] border border-[#00E57A]/25 rounded-2xl overflow-hidden shadow-2xl flex flex-col font-mono text-[11px]"
          >
            {/* Header */}
            <div className="bg-[#111420] px-5 py-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-[#00E57A]" />
                <div className="text-left">
                  <div className="font-display font-black text-[#ECF0F8] text-sm leading-tight">TK Gateway</div>
                  <div className="text-[9px] text-[#8B94AA] uppercase leading-none tracking-wider mt-0.5">Free API Proxier v1.2</div>
                </div>
              </div>
              <button
                onClick={() => setGatewayOpen(false)}
                className="w-7 h-7 rounded border border-white/5 hover:border-white/20 hover:text-white text-[#8B94AA] transition-colors flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Dashboard Contents */}
            <div className="p-5 space-y-4 text-left">
              {/* Health Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#111420] border border-white/5 p-3 rounded-xl">
                  <div className="text-[9px] text-[#444D62] uppercase font-bold tracking-wider">Gateway Status</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      gatewayStats.status === "HEALTHY" ? "bg-[#00E57A] animate-pulse" : "bg-[#FF5F57]"
                    }`} />
                    <span className={`text-xs font-bold ${
                      gatewayStats.status === "HEALTHY" ? "text-white" : "text-[#FF5F57]"
                    }`}>
                      {gatewayStats.status}
                    </span>
                  </div>
                </div>
                <div className="bg-[#111420] border border-white/5 p-3 rounded-xl">
                  <div className="text-[9px] text-[#444D62] uppercase font-bold tracking-wider">Circuit Breaker</div>
                  <div className="mt-1 flex items-center gap-1 text-xs font-bold text-white">
                    <span className={gatewayStats.circuitBreakerState === "CLOSED" ? "text-[#00E57A]" : "text-[#FF5F57]"}>
                      {gatewayStats.circuitBreakerState}
                    </span>
                  </div>
                </div>
              </div>

              {/* Latency Meter */}
              <div className="bg-[#111420] border border-white/5 p-4 rounded-xl space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-[#444D62] uppercase font-bold tracking-wider">LLM Proxied Latency</span>
                  <span className="text-[10px] text-[#00E57A] font-bold">100% Free / Direct</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">{gatewayStats.averageLatencyMs}</span>
                  <span className="text-[10px] text-[#8B94AA]">ms (sliding avg)</span>
                </div>
                <div className="w-full bg-[#07080D] h-1.5 rounded-full overflow-hidden mt-2 relative">
                  <div 
                    className="bg-gradient-to-r from-[#00E57A] to-[#38BDF8] h-full rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min((gatewayStats.averageLatencyMs / 1000) * 100, 100)}%` }} 
                  />
                </div>
              </div>

              {/* General Telemetries */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#00E57A] rounded-full" />
                    <span className="text-[#8B94AA]">Total API Requests</span>
                  </div>
                  <span className="font-bold text-white">{gatewayStats.totalRequests}</span>
                </div>

                <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#FF5F57] rounded-full" />
                    <span className="text-[#8B94AA]">Blocked Requests (Spam)</span>
                  </div>
                  <span className="font-bold text-[#FF5F57]">{gatewayStats.blockedRequests}</span>
                </div>

                <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#38BDF8] rounded-full" />
                    <span className="text-[#8B94AA]">Uptime (Service Daemon)</span>
                  </div>
                  <span className="text-[#8B94AA]">{gatewayStats.uptime}s</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#F5C842] rounded-full" />
                    <span className="text-[#8B94AA]">Rate Limiter Slots (IP)</span>
                  </div>
                  <span className="font-bold text-white">{gatewayStats.activeRateLimits} client</span>
                </div>
              </div>

              {/* Description explanation of current Gateway features */}
              <div className="text-[10px] text-[#444D62] leading-relaxed border-t border-white/5 pt-3 bg-white/[0.01] p-3 rounded-lg border border-white/5">
                <b className="text-[#8B94AA] block mb-1">🛡️ FITUR API GATEWAY BEBAS BIAYA</b>
                • <b>Rate Limiter</b> membatasi pengirim spam otomatis <br />
                • <b>Circuit Breaker</b> mencegah waktu tunggu lama saat AI API down <br />
                • <b>Self-Hosted Proxy</b> menjaga kerahasiaan kunci server-side secara aman dan permanen tanpa biaya tambahan!
              </div>
            </div>

            {/* Powered footer */}
            <div className="bg-[#111420] py-2 border-t border-white/5 text-[9px] text-[#8B94AA] text-center uppercase tracking-widest">
              Secured under <span className="text-[#00E57A] font-bold">SHA-256 HTTPS Proxy</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stateful Streaming AI Chat Window */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed bottom-[130px] right-6 z-50 w-full max-w-[380px] h-[550px] max-h-[calc(100vh-160px)] bg-[#0C0E18] border border-[#00E57A]/25 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="bg-[#111420] px-5 py-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg border border-[#00E57A]/30 bg-[#00E57A]/5 flex items-center justify-center font-mono text-xs font-bold text-[#00E57A] relative">
                  AI
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#00E57A] border border-[#111420]" />
                </div>
                <div className="text-left">
                  <div className="font-display font-extrabold text-[#ECF0F8] text-sm leading-tight">Niraa</div>
                  <div className="text-[10px] text-[#00E57A] font-mono leading-none tracking-wide">● ONLINE SEKARANG</div>
                </div>
              </div>
              <button
                onClick={handleClearChat}
                className="w-7 h-7 rounded border border-white/5 hover:border-white/20 hover:text-white text-[#8B94AA] transition-colors flex items-center justify-center"
                title="Hapus riwayat obrolan"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Dynamic Response Style Switcher */}
            <div className="bg-[#141829] px-4 py-2 border-b border-white/5 flex items-center justify-between gap-2 shrink-0">
              <span className="text-[10px] font-bold text-[#8B94AA] font-mono uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00E57A] animate-pulse" /> Gaya Respons:
              </span>
              <div className="flex bg-[#0C0E18] border border-white/10 rounded-full p-0.5 relative shrink-0">
                <button
                  onClick={() => {
                    setChatResponseStyle("bestie");
                    showToast("Gaya Niraa diubah ke: Supportive Bestie! 🌸");
                  }}
                  className={`px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase transition-all cursor-pointer ${
                    chatResponseStyle === "bestie"
                      ? "bg-[#00E57A]/15 text-[#00E57A] shadow-[0_0_8px_rgba(0,229,122,0.15)] border border-[#00E57A]/10"
                      : "text-[#8B94AA] hover:text-white border border-transparent"
                  }`}
                >
                  Bestie
                </button>
                <button
                  onClick={() => {
                    setChatResponseStyle("professional");
                    showToast("Gaya Niraa diubah ke: Professional Consultant! 💼");
                  }}
                  className={`px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase transition-all cursor-pointer ${
                    chatResponseStyle === "professional"
                      ? "bg-[#00E57A]/15 text-[#00E57A] shadow-[0_0_8px_rgba(0,229,122,0.15)] border border-[#00E57A]/10"
                      : "text-[#8B94AA] hover:text-white border border-transparent"
                  }`}
                >
                  Pro
                </button>
              </div>
            </div>

            {/* Voice Mode Selector Control Bar */}
            <div className="bg-[#101321] px-4 py-2 border-b border-white/5 flex items-center justify-between gap-2 shrink-0">
              <span className="text-[10px] font-bold text-[#8B94AA] font-mono uppercase tracking-wide flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-[#00E57A]" /> Model Suara AI:
              </span>
              <div className="flex items-center gap-2">
                <div className="flex bg-[#0C0E18] border border-white/10 rounded-full p-0.5 relative shrink-0">
                  <button
                    onClick={() => {
                      setVoiceMode("off");
                      handleStopSpeaking();
                      showToast("Suara asisten dinonaktifkan. 🔇");
                    }}
                    className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase transition-all cursor-pointer ${
                      voiceMode === "off"
                        ? "bg-red-500/15 text-red-400 border border-red-500/10 shadow-[0_0_8px_rgba(239,68,68,0.15)]"
                        : "text-[#8B94AA] hover:text-white border border-transparent"
                    }`}
                    title="Matikan Suara Niraa"
                  >
                    Mute
                  </button>
                  <button
                    onClick={() => {
                      setVoiceMode("local");
                      showToast("Mode Suara Lokal (Instan) Aktif! 🗣️");
                    }}
                    className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase transition-all cursor-pointer ${
                      voiceMode === "local"
                        ? "bg-[#00E57A]/15 text-[#00E57A] shadow-[0_0_8px_rgba(0,229,122,0.15)] border border-[#00E57A]/10"
                        : "text-[#8B94AA] hover:text-white border border-transparent"
                    }`}
                    title="Suara Sintesis Lokal Browser (Cepat & Ringan)"
                  >
                    Lokal
                  </button>
                  <button
                    onClick={() => {
                      setVoiceMode("gemini");
                      showToast("Mode Suara Gemini TTS (Premium) Aktif! 🎧✨");
                    }}
                    className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase transition-all cursor-pointer ${
                      voiceMode === "gemini"
                        ? "bg-[#38BDF8]/15 text-[#38BDF8] shadow-[0_0_8px_rgba(56,189,248,0.15)] border border-[#38BDF8]/10"
                        : "text-[#8B94AA] hover:text-white border border-transparent"
                    }`}
                    title="Suara Natural Gemini 3.1 TTS (Premium)"
                  >
                    Gemini
                  </button>
                </div>

                {/* Voice Settings Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                  className={`p-1 rounded border transition-colors cursor-pointer ${
                    showVoiceSettings 
                      ? "bg-[#00E57A]/15 border-[#00E57A]/30 text-[#00E57A]" 
                      : "bg-[#0C0E18] border-white/10 text-[#8B94AA] hover:text-[#00E57A] hover:border-[#00E57A]/30"
                  }`}
                  title="Pengaturan Suara Tambahan"
                >
                  <Sliders className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Expandable Voice Settings Panel */}
            <AnimatePresence>
              {showVoiceSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden bg-[#0C0E18] border-b border-white/5 text-left"
                >
                  <div className="p-4 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-white uppercase tracking-wider font-sans flex items-center gap-1.5">
                        <Brain className="w-3.5 h-3.5 text-[#00E57A]" />
                        Setelan Model & Suara Niraa AI
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setVoiceRate(1.05);
                          setVoicePitch(1.0);
                          setAutoReadNotif(true);
                          setAiModel("gemini-3.5-flash");
                          setGeminiVoice("Kore");
                          showToast("Pengaturan kecerdasan & suara direset! ⚙️🔄");
                        }}
                        className="text-[9px] font-mono text-white/40 hover:text-[#00E57A] transition-colors cursor-pointer"
                      >
                        Reset Default
                      </button>
                    </div>

                    {/* Model Selector */}
                    <div className="space-y-1.5 pt-0.5 text-left">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-[#8B94AA]">Model Kecerdasan (LLM)</span>
                        <span className="text-[#00E57A] font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-[#00E57A] rounded-full animate-ping" />
                          Aktif
                        </span>
                      </div>
                      <select
                        value={aiModel}
                        onChange={(e) => {
                          setAiModel(e.target.value);
                          const modelFriendlyName = 
                            e.target.value === "gemini-3.5-flash" ? "Gemini 3.5 Flash" : "Gemini 3.1 Lite";
                          showToast(`Model Niraa AI diubah ke: ${modelFriendlyName}! 🧠✨`);
                        }}
                        className="w-full bg-[#181C2A] border border-white/15 rounded-lg px-2.5 py-1.5 text-[11px] text-[#ECF0F8] focus:border-[#00E57A] focus:outline-none cursor-pointer font-sans"
                      >
                        <option value="gemini-3.5-flash">Gemini 3.5 Flash (Cepat & Cerdas - Default)</option>
                        <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite (Sangat Instan & Efisien)</option>
                      </select>
                    </div>

                    {/* Speed/Rate Control */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-[#8B94AA]">Kecepatan Bicara (Speed)</span>
                        <span className="text-[#00E57A] font-bold">{voiceRate.toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="2.0"
                        step="0.05"
                        value={voiceRate}
                        onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
                        className="w-full accent-[#00E57A] h-1 bg-white/10 rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[8px] text-white/30 font-mono">
                        <span>Lambat (0.5x)</span>
                        <span>Normal (1.0x)</span>
                        <span>Cepat (2.0x)</span>
                      </div>
                    </div>

                    {/* Pitch Control */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-[#8B94AA]">Nada Suara (Pitch)</span>
                        <span className="text-[#38BDF8] font-bold">{voicePitch.toFixed(1)}</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="1.5"
                        step="0.1"
                        value={voicePitch}
                        disabled={voiceMode === "gemini"} // Gemini TTS doesn't support simple pitch adjustments
                        onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                        className="w-full accent-[#38BDF8] h-1 bg-white/10 rounded-lg cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      />
                      <div className="flex justify-between text-[8px] text-white/30 font-mono">
                        <span>Bass (0.5)</span>
                        <span className={voiceMode === "gemini" ? "text-yellow-400/70 text-[7.5px]" : ""}>
                          {voiceMode === "gemini" ? "Sintesis Lokal Saja" : "Normal (1.0)"}
                        </span>
                        <span>Treble (1.5)</span>
                      </div>
                    </div>

                    {/* Gemini Character Voice Dropdown */}
                    {voiceMode === "gemini" && (
                      <div className="space-y-1.5 pt-1 border-t border-white/5 text-left">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-[#8B94AA]">Karakter Suara Gemini</span>
                          <span className="text-[#38BDF8] font-bold">Premium</span>
                        </div>
                        <select
                          value={geminiVoice}
                          onChange={(e) => {
                            setGeminiVoice(e.target.value);
                            showToast(`Karakter suara Gemini diubah ke: ${e.target.value}! ✨`);
                          }}
                          className="w-full bg-[#181C2A] border border-white/15 rounded px-2 py-1 text-[11px] text-[#ECF0F8] focus:border-[#38BDF8] focus:outline-none cursor-pointer"
                        >
                          <option value="Kore">Kore (Feminin Ceria - Default)</option>
                          <option value="Zephyr">Zephyr (Feminin Lembut)</option>
                          <option value="Puck">Puck (Maskulin Ramah)</option>
                          <option value="Charon">Charon (Maskulin Berwibawa)</option>
                          <option value="Fenrir">Fenrir (Maskulin Dalam)</option>
                        </select>
                      </div>
                    )}

                    {/* Local Browser Synthesizer Voice Dropdown */}
                    {voiceMode === "local" && (
                      <div className="space-y-1.5 pt-1 border-t border-white/5 text-left">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-[#8B94AA]">Pilihan Suara Sistem (Lokal)</span>
                          <span className="text-[#00E57A] font-bold">Instan</span>
                        </div>
                        {availableLocalVoices.length > 0 ? (
                          <select
                            value={localVoiceURI}
                            onChange={(e) => {
                              setLocalVoiceURI(e.target.value);
                              const voiceObj = availableLocalVoices.find(v => v.voiceURI === e.target.value);
                              showToast(`Suara lokal diubah ke: ${voiceObj ? voiceObj.name : "Kustom"}! 🗣️`);
                            }}
                            className="w-full bg-[#181C2A] border border-white/15 rounded px-2 py-1 text-[11px] text-[#ECF0F8] focus:border-[#00E57A] focus:outline-none cursor-pointer"
                          >
                            {availableLocalVoices.map((v) => (
                              <option key={v.voiceURI} value={v.voiceURI}>
                                {v.name} ({v.lang})
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="text-[10px] text-white/40 font-mono italic">
                            Tidak ada suara sistem tambahan yang terdeteksi browser.
                          </div>
                        )}
                      </div>
                    )}

                    {/* Auto Read Notifications/Messages Toggles */}
                    <div className="flex items-center justify-between pt-1 border-t border-white/5">
                      <div className="flex flex-col text-left">
                        <span className="text-[10px] font-bold text-white">Bacakan Otomatis</span>
                        <span className="text-[8px] text-[#8B94AA] font-mono">Niraa membacakan langsung pesan masuk</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={autoReadNotif}
                          onChange={(e) => {
                            setAutoReadNotif(e.target.checked);
                            showToast(e.target.checked ? "Niraa akan otomatis membacakan respon baru! 🗣️✨" : "Pembacaan otomatis dinonaktifkan. 🔇");
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#00E57A]"></div>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col text-left">
              {messages.map((msg, i) => {
                const isBot = msg.role === "assistant";
                return (
                  <div key={i} className={`flex gap-2 w-full ${isBot ? "" : "flex-row-reverse"}`}>
                    <div className={`w-7 h-7 font-mono text-[9px] font-semibold border rounded flex items-center justify-center shrink-0 self-end ${
                      isBot 
                      ? "border-[#00E57A]/20 bg-[#00E57A]/5 text-[#00E57A]" 
                      : "border-white/10 bg-white/5 text-[#8B94AA]"
                    }`}>
                      {isBot ? "AI" : "ME"}
                    </div>
                    <div className={`p-3 max-w-[75%] rounded-xl text-xs sm:text-[13px] leading-relaxed break-words relative group ${
                      isBot 
                      ? "bg-[#181C2A] border border-white/5 rounded-bl-sm text-[#ECF0F8]" 
                      : "bg-[#00E57A]/10 border border-[#00E57A]/15 rounded-br-sm text-white"
                    }`}>
                      {formatMessageText(msg.content)}
                      
                      {isBot && (
                        <div className="flex justify-end mt-1.5 pt-1.5 border-t border-white/5 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleSpeakMessage(msg.content, i)}
                            className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-mono transition-all cursor-pointer ${
                              playingMessageIndex === i 
                                ? "bg-[#00E57A]/15 text-[#00E57A] font-bold border border-[#00E57A]/20 shadow-[0_0_8px_rgba(0,229,122,0.15)] animate-pulse" 
                                : "text-[#8B94AA] hover:text-[#00E57A] hover:bg-white/5"
                            }`}
                            title={playingMessageIndex === i ? "Matikan suara" : "Dengarkan suara Niraa"}
                          >
                            {playingMessageIndex === i ? (
                              <>
                                <span className="flex gap-0.5 items-center mr-0.5 h-3">
                                  <span className="w-0.5 h-2 bg-[#00E57A] rounded-full animate-[bounce_0.6s_infinite_alternate]" />
                                  <span className="w-0.5 h-3 bg-[#00E57A] rounded-full animate-[bounce_0.6s_infinite_alternate_0.2s]" />
                                  <span className="w-0.5 h-2.5 bg-[#00E57A] rounded-full animate-[bounce_0.6s_infinite_alternate_0.1s]" />
                                </span>
                                <span>BERBICARA...</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3 h-3 text-[#00E57A]" />
                                <span>DENGARKAN</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Streaming loading typing bubbles */}
              {isTyping && (
                <div className="flex gap-2 w-full">
                  <div className="w-7 h-7 font-mono text-[9px] font-semibold border border-[#00E57A]/20 bg-[#00E57A]/5 text-[#00E57A] rounded flex items-center justify-center shrink-0 self-end">
                    AI
                  </div>
                  <div className="bg-[#181C2A] border border-white/5 p-3 rounded-xl rounded-bl-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8B94AA] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8B94AA] animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8B94AA] animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              {/* Live stream errors with recover guidance */}
              {streamError && (
                <div className="border border-[#FF5F57]/30 bg-[#FF5F57]/10 p-4 rounded-xl flex flex-col gap-2 relative">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-[#FF5F57] shrink-0" />
                    <div className="text-xs text-[#FF5F57] leading-relaxed text-left">
                      <b className="block font-bold">Koneksi Terganggu:</b>
                      {streamError}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <button
                      onClick={() => handleBotResponse("Coba kirim ulang pesan sebelumnya.")}
                      className="px-3 py-1.5 bg-[#FF5F57]/20 border border-[#FF5F57]/30 hover:bg-[#FF5F57]/45 rounded text-[10px] text-white font-semibold flex items-center gap-1 transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" /> Coba Lagi
                    </button>
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}`}
                      target="_blank"
                      className="px-3 py-1.5 bg-[#25D366]/20 border border-[#25D366]/40 hover:bg-[#25D366]/40 rounded text-[10px] text-white font-semibold flex items-center gap-1 transition-colors"
                    >
                      Hubungi WA Admin
                    </a>
                  </div>
                </div>
              )}

              <div ref={msgsEndRef} />
            </div>

            {/* Quick replies suggestion chips */}
            {messages.length < 3 && (
              <div className="flex flex-wrap gap-1.5 px-4 pb-3">
                <button
                  onClick={() => handleQuickReply("💰 Berapa harga layanannya?", "💰 Berapa estimasi harga layanannya kak Niraaa?")}
                  className="px-2.5 py-1 text-[10px] font-mono border border-white/5 hover:border-[#00e57a]/20 bg-[#111420] hover:text-[#00E57A] text-[#8B94AA] rounded-full transition-colors whitespace-nowrap"
                >
                  💰 Cek harga
                </button>
                <button
                  onClick={() => handleQuickReply("📝 Bisa bantu bimbingan skripsi?", "📝 Saya butuh bantuan bimbingan skripsi lengkap kak!")}
                  className="px-2.5 py-1 text-[10px] font-mono border border-white/5 hover:border-[#00e57a]/20 bg-[#111420] hover:text-[#00E57A] text-[#8B94AA] rounded-full transition-colors whitespace-nowrap"
                >
                  📝 Bantu skripsi
                </button>
                <button
                  onClick={() => handleQuickReply("💻 Bimbing joki coding / website?", "💻 Kak Niraaa, apakah ada joki project coding / pembuatan website?")}
                  className="px-2.5 py-1 text-[10px] font-mono border border-white/5 hover:border-[#00e57a]/20 bg-[#111420] hover:text-[#00E57A] text-[#8B94AA] rounded-full transition-colors whitespace-nowrap"
                >
                  💻 Project coding
                </button>
                <button
                  onClick={() => handleQuickReply("⚡ Deadline saya mepet, aman?", "⚡ Kalau deadline tugas saya mepet banget, apakah aman dikirim cepat?")}
                  className="px-2.5 py-1 text-[10px] font-mono border border-white/5 hover:border-[#00e57a]/20 bg-[#111420] hover:text-[#00E57A] text-[#8B94AA] rounded-full transition-colors whitespace-nowrap"
                >
                  ⚡ Deadline mepet
                </button>
              </div>
            )}

            {/* CTA action buttons in continuous chat */}
            {messages.length > 5 && (
              <div className="px-4 py-2 border-t border-white/5 bg-[#111420] grid grid-cols-2 gap-2 shrink-0">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  className="py-1.5 bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 rounded text-[10px] font-mono text-[#25D366] text-center font-bold tracking-tight"
                >
                  💬 WhatsApp Deal
                </a>
                <a
                  href="#form-section"
                  onClick={() => setChatOpen(false)}
                  className="py-1.5 bg-[#00E57A]/10 hover:bg-[#00E57A]/20 border border-[#00E57A]/25 rounded text-[10px] font-mono text-[#00E57A] text-center font-bold tracking-tight"
                >
                  📋 Form Order
                </a>
              </div>
            )}

            {/* Input bar */}
            <div className="border-t border-white/5 bg-[#111420] px-4 py-3 flex items-end gap-2 shrink-0">
              <textarea
                ref={textareaRef}
                rows={1}
                value={inputMessage}
                onKeyDown={handleKeyPress}
                onChange={(e) => {
                  setInputMessage(e.target.value);
                  // Auto height adjust
                  e.target.style.height = "auto";
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 90)}px`;
                }}
                placeholder={isListening ? "Mendengarkan suaramu... 🎙️" : "Tanya info layanan TugasKu..."}
                disabled={isListening}
                className={`flex-1 bg-[#07080D]/80 border rounded-lg py-2 px-3 text-xs sm:text-sm text-white placeholder-white/20 focus:outline-none transition-colors resize-none max-h-[90px] overflow-y-auto ${
                  isListening ? "border-[#FF5F57]/50 focus:border-[#FF5F57]/50 animate-pulse bg-red-500/5 text-red-100" : "border-white/10 focus:border-[#00E57A]"
                }`}
              />

              {/* Mic STT Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`w-8 h-8 rounded-lg border transition-all shrink-0 flex items-center justify-center cursor-pointer ${
                  isListening 
                    ? "bg-[#FF5F57] hover:bg-red-600 border-[#FF5F57] text-white animate-pulse shadow-[0_0_12px_rgba(255,95,87,0.4)]" 
                    : "bg-[#181C2A] border-white/10 hover:border-[#00E57A]/50 text-[#8B94AA] hover:text-[#00E57A] hover:bg-[#00E57A]/5"
                }`}
                title={isListening ? "Berhenti mendengarkan" : "Kirim menggunakan Suara (STT)"}
              >
                <Mic className={`w-3.5 h-3.5 ${isListening ? "animate-bounce" : ""}`} />
              </button>

              <button
                onClick={() => {
                  if (inputMessage.trim()) handleBotResponse(inputMessage);
                }}
                disabled={!inputMessage.trim() || isListening}
                className="w-8 h-8 rounded-lg bg-[#00E57A] hover:bg-[#00ca6d] text-black hover:scale-105 active:scale-95 disabled:opacity-40 disabled:scale-100 disabled:pointer-events-none transition-all shrink-0 flex items-center justify-center cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Powered metadata banner */}
            <div className="bg-[#07080D] border-t border-white/5 text-[9px] font-mono text-[#444D62] uppercase tracking-wider py-1.5 shrink-0 text-center">
              Powered by <span className="text-[#00E57A] font-bold">AI</span> · TugasKu Assistant
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 9Router & WhatsApp Automation Studio Modal */}
      <AutomationStudioModal
        isOpen={isAutomationOpen}
        onClose={() => setIsAutomationOpen(false)}
      />

      {/* Styled Notifications Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1E2333] border border-[#00E57A] text-white font-mono text-xs px-5 py-3 rounded-lg shadow-2xl flex items-center gap-2.5"
          >
            <Check className="w-4 h-4 text-[#00E57A] shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
