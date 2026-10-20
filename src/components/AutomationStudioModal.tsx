import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Send,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  Bot,
  Smartphone,
  CheckCircle2,
  HelpCircle,
  Zap,
  Settings2,
  BookOpen,
  MessageSquare,
  X,
  Clock,
  ShieldCheck
} from "lucide-react";

interface AutomationStatus {
  aiEngine: {
    has9Router: boolean;
    router9BaseUrl: string;
    router9Model: string;
    hasGemini: boolean;
    activeEngine: string;
    status: string;
  };
  whatsappGateway: {
    hasToken: boolean;
    provider: string;
    adminPhone: string;
    mode: string;
    status: string;
  };
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AutomationStudioModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"generator" | "guide">("generator");
  const [status, setStatus] = useState<AutomationStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);

  // Generator states
  const [contentType, setContentType] = useState<"promo" | "tips" | "broadcast" | "custom">("promo");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Santai, bersahabat, sedikit humor mahasiswa, dan persuasif");
  const [customPrompt, setCustomPrompt] = useState("");
  const [targetPhone, setTargetPhone] = useState("6285693009756");

  // Output states
  const [generatedContent, setGeneratedContent] = useState("");
  const [usedEngine, setUsedEngine] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string; directWaLink?: string } | null>(null);

  // Fetch status on open
  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  const fetchStatus = async () => {
    setLoadingStatus(true);
    try {
      const res = await fetch("/api/automation/status");
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
        if (data.whatsappGateway?.adminPhone) {
          setTargetPhone(data.whatsappGateway.adminPhone);
        }
      }
    } catch (e) {
      console.error("Failed to load status:", e);
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setSendResult(null);
    try {
      const res = await fetch("/api/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType,
          topic,
          tone,
          customPrompt
        })
      });

      const data = await res.json();
      if (res.ok && data.content) {
        setGeneratedContent(data.content);
        setUsedEngine(data.engine === "9router" ? `9Router (${data.model})` : `Gemini AI (${data.model})`);
      } else {
        alert(data.error || "Gagal membuat konten.");
      }
    } catch (err: any) {
      alert("Terjadi kesalahan koneksi saat generate konten.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendToWhatsApp = async () => {
    if (!generatedContent.trim()) {
      alert("Konten masih kosong. Silakan klik 'Generate Konten AI' terlebih dahulu!");
      return;
    }

    setIsSending(true);
    setSendResult(null);
    try {
      const res = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: targetPhone,
          message: generatedContent
        })
      });

      const data = await res.json();
      if (data.success) {
        setSendResult({
          success: true,
          message: data.provider === "manual_wa_link"
            ? "Token gateway belum aktif, namun tautan pesan langsung (wa.me) telah disiapkan!"
            : `Pesan berhasil dikirim via ${data.provider.toUpperCase()} ke nomor ${data.targetPhone}!`,
          directWaLink: data.directWaLink
        });
      } else {
        setSendResult({
          success: false,
          message: data.error || "Gagal mengirim melalui WhatsApp Gateway. Silakan periksa token atau gunakan tautan langsung.",
          directWaLink: data.directWaLink
        });
      }
    } catch (err) {
      setSendResult({
        success: false,
        message: "Gagal menghubungkan ke server."
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleCopy = () => {
    if (!generatedContent) return;
    navigator.clipboard.writeText(generatedContent);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const openDirectWhatsApp = () => {
    const cleanPhone = targetPhone.replace(/[^0-9]/g, "");
    const link = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(generatedContent)}`;
    window.open(link, "_blank");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0C0E18] border border-white/15 rounded-2xl shadow-2xl overflow-hidden text-[#ECF0F8]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#111420]/80 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#00E57A]/15 border border-[#00E57A]/30 flex items-center justify-center text-[#00E57A] shadow-[0_0_15px_rgba(0,229,122,0.2)]">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-base sm:text-lg text-white">9Router & WA Auto-Pilot Hub</h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00E57A]/15 text-[#00E57A] border border-[#00E57A]/30">
                    Live
                  </span>
                </div>
                <p className="text-xs text-[#8B94AA]">
                  Buat konten promosi & edukasi otomatis dengan AI lalu kirim instan ke WhatsApp Anda.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[#8B94AA] hover:text-white hover:bg-white/5 transition-colors"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Integration Status Bar */}
          <div className="px-5 py-2.5 bg-[#141829]/60 border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
            <div className="flex flex-wrap items-center gap-4">
              {/* AI Engine Status */}
              <div className="flex items-center gap-1.5">
                <span className="text-[#8B94AA]">AI Router:</span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#111420] border border-white/10 text-white font-mono text-[11px]">
                  <Sparkles className="w-3 h-3 text-[#00E57A]" />
                  {status?.aiEngine?.activeEngine || "Memeriksa AI..."}
                </span>
              </div>

              {/* WhatsApp Gateway Status */}
              <div className="flex items-center gap-1.5">
                <span className="text-[#8B94AA]">WhatsApp Gateway:</span>
                <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[11px] border ${
                  status?.whatsappGateway?.hasToken 
                    ? "bg-[#00E57A]/10 border-[#00E57A]/30 text-[#00E57A]" 
                    : "bg-amber-500/10 border-amber-500/30 text-amber-300"
                }`}>
                  <Smartphone className="w-3 h-3" />
                  {status?.whatsappGateway?.mode || "Direct Link (wa.me)"}
                </span>
              </div>
            </div>

            <button
              onClick={fetchStatus}
              disabled={loadingStatus}
              className="inline-flex items-center gap-1 text-[11px] font-mono text-[#8B94AA] hover:text-[#00E57A] transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${loadingStatus ? "animate-spin" : ""}`} />
              Refresh Status
            </button>
          </div>

          {/* Tabs Navigation */}
          <div className="flex border-b border-white/10 bg-[#0C0E18] px-5 gap-2 shrink-0">
            <button
              onClick={() => setActiveTab("generator")}
              className={`flex items-center gap-2 py-3 px-4 font-mono text-xs border-b-2 transition-all cursor-pointer ${
                activeTab === "generator"
                  ? "border-[#00E57A] text-[#00E57A] font-bold"
                  : "border-transparent text-[#8B94AA] hover:text-white"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Generator & Pengiriman WhatsApp
            </button>
            <button
              onClick={() => setActiveTab("guide")}
              className={`flex items-center gap-2 py-3 px-4 font-mono text-xs border-b-2 transition-all cursor-pointer ${
                activeTab === "guide"
                  ? "border-[#00E57A] text-[#00E57A] font-bold"
                  : "border-transparent text-[#8B94AA] hover:text-white"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Apa yang Harus Anda Siapkan (Panduan)
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {activeTab === "generator" ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Form: Generator Controls */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#8B94AA] mb-2 tracking-wider">
                      1. Pilih Tipe Konten
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "promo", label: "⚡ Promo Tugas", desc: "Diskon & deadline" },
                        { id: "tips", label: "🎓 Tips Skripsi", desc: "Edukasi + softsell" },
                        { id: "broadcast", label: "📢 Broadcast WA", desc: "Sapaan mahasiswa" },
                        { id: "custom", label: "✍️ Custom Prompt", desc: "Bebas sesuai mau" }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setContentType(item.id as any)}
                          className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            contentType === item.id
                              ? "bg-[#00E57A]/10 border-[#00E57A]/40 text-white shadow-[0_0_12px_rgba(0,229,122,0.15)]"
                              : "bg-[#111420] border-white/10 text-[#8B94AA] hover:border-white/20 hover:text-white"
                          }`}
                        >
                          <span className="font-bold text-xs">{item.label}</span>
                          <span className="text-[10px] text-[#8B94AA]">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Topic or Custom Prompt */}
                  {contentType !== "custom" ? (
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#8B94AA] mb-1.5 tracking-wider">
                        2. Topik Spesifik (Opsional)
                      </label>
                      <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder={
                          contentType === "promo"
                            ? "Contoh: Diskon 20% tugas coding & deadline weekend"
                            : contentType === "tips"
                            ? "Contoh: 5 Cara ampuh lolos bab 2 skripsi anti revisi"
                            : "Contoh: Sapaan awal semester & slot bimbingan dibuka"
                        }
                        className="w-full bg-[#111420] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#8B94AA]/40 focus:outline-none focus:border-[#00E57A]/50 transition-colors"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#8B94AA] mb-1.5 tracking-wider">
                        2. Tulis Instruksi Prompt Anda
                      </label>
                      <textarea
                        rows={3}
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="Contoh: Buat konten status WhatsApp yang lucu tentang pusingnya tugas makalah tapi ada solusi kilat dari TugasKu..."
                        className="w-full bg-[#111420] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-[#8B94AA]/40 focus:outline-none focus:border-[#00E57A]/50 transition-colors resize-none"
                      />
                    </div>
                  )}

                  {/* Tone selector */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#8B94AA] mb-1.5 tracking-wider">
                      3. Gaya Bahasa (Tone)
                    </label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full bg-[#111420] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#00E57A]/50 transition-colors"
                    >
                      <option value="Santai, bersahabat, sedikit humor mahasiswa, dan persuasif">
                        😎 Santai & Gaul Mahasiswa (Bestie)
                      </option>
                      <option value="Persuasif, mendesak, ada penawaran promo terbatas (FOMO)">
                        🔥 Persuasif & Promo Mendesak (FOMO)
                      </option>
                      <option value="Edukatif, solutif, profesional, dan tepercaya">
                        🎓 Edukatif & Profesional Akademik
                      </option>
                      <option value="Singkat, to the point, padat informasi">
                        ⚡ Singkat & To-the-point
                      </option>
                    </select>
                  </div>

                  {/* Target Phone */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#8B94AA] mb-1.5 tracking-wider">
                      4. Nomor WhatsApp Tujuan
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={targetPhone}
                        onChange={(e) => setTargetPhone(e.target.value)}
                        placeholder="6285693009756"
                        className="w-full bg-[#111420] border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#00E57A]/50 transition-colors"
                      />
                      <Smartphone className="w-4 h-4 text-[#8B94AA] absolute left-3 top-3" />
                    </div>
                    <span className="text-[10px] text-[#8B94AA] mt-1 block">
                      Gunakan awalan 62 atau 08. Nomor default mengarah ke WhatsApp Admin TugasKu.
                    </span>
                  </div>

                  {/* Submit button */}
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full mt-2 bg-[#00E57A] hover:bg-[#00ca6d] text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-all disabled:opacity-50 hover:shadow-[0_0_20px_rgba(0,229,122,0.25)] cursor-pointer"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        AI Sedang Menulis Konten...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Konten AI Sekarang
                      </>
                    )}
                  </button>
                </div>

                {/* Right Area: Output Preview & Actions */}
                <div className="lg:col-span-7 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono uppercase text-[#8B94AA] tracking-wider flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-[#00E57A]" />
                      Pratinjau Draf Konten WhatsApp
                    </label>
                    {usedEngine && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#8B94AA]">
                        Engine: {usedEngine}
                      </span>
                    )}
                  </div>

                  <div className="relative flex-1 min-h-[260px] bg-[#111420] border border-white/10 rounded-xl p-4 flex flex-col">
                    <textarea
                      value={generatedContent}
                      onChange={(e) => setGeneratedContent(e.target.value)}
                      placeholder="Draf konten otomatis AI akan muncul di sini. Anda juga dapat langsung mengeditnya sebelum dikirim ke WhatsApp..."
                      className="w-full flex-1 bg-transparent text-xs sm:text-sm text-[#ECF0F8] placeholder-[#8B94AA]/40 focus:outline-none resize-none leading-relaxed"
                    />

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-[#8B94AA]">
                      <span>{generatedContent.length} karakter • {generatedContent.split(/\s+/).filter(Boolean).length} kata</span>
                      <button
                        type="button"
                        onClick={handleCopy}
                        disabled={!generatedContent}
                        className="inline-flex items-center gap-1 text-xs text-[#8B94AA] hover:text-[#00E57A] transition-colors cursor-pointer"
                      >
                        {copySuccess ? <Check className="w-3.5 h-3.5 text-[#00E57A]" /> : <Copy className="w-3.5 h-3.5" />}
                        {copySuccess ? "Tersalin!" : "Salin Teks"}
                      </button>
                    </div>
                  </div>

                  {/* Dispatch notification status */}
                  {sendResult && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                        sendResult.success
                          ? "bg-[#00E57A]/10 border-[#00E57A]/30 text-[#00E57A]"
                          : "bg-red-500/10 border-red-500/30 text-red-300"
                      }`}
                    >
                      {sendResult.success ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                      ) : (
                        <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 leading-snug">
                        <p>{sendResult.message}</p>
                        {sendResult.directWaLink && (
                          <a
                            href={sendResult.directWaLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-white font-bold underline mt-1 hover:text-[#00E57A]"
                          >
                            Buka di WhatsApp Web sekarang <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={handleSendToWhatsApp}
                      disabled={isSending || !generatedContent}
                      className="bg-[#111420] hover:bg-[#181C2A] border border-[#00E57A]/40 text-[#00E57A] font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs transition-all disabled:opacity-50 cursor-pointer shadow-[0_0_15px_rgba(0,229,122,0.1)]"
                    >
                      {isSending ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      Kirim via WhatsApp Gateway
                    </button>

                    <button
                      onClick={openDirectWhatsApp}
                      disabled={!generatedContent}
                      className="bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Buka Langsung di WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Guide & What to Prepare */
              <div className="space-y-6 text-xs sm:text-sm text-[#CDD5E0] leading-relaxed">
                <div className="bg-[#111420] border border-white/10 rounded-xl p-5 space-y-4">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#00E57A]" />
                    Daftar Hal yang Perlu Anda Siapkan
                  </h3>
                  <p className="text-xs text-[#8B94AA]">
                    Untuk menjalankan otomatisasi ini secara 100% mandiri hingga WhatsApp Anda, berikut 3 komponen yang Anda siapkan:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-xl bg-[#07080D] border border-white/10 flex flex-col gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#00E57A]/15 text-[#00E57A] font-bold flex items-center justify-center text-xs">
                        1
                      </div>
                      <h4 className="font-bold text-white text-xs">API Key 9Router / AI</h4>
                      <p className="text-[11px] text-[#8B94AA]">
                        Website saat ini sudah langsung bekerja menggunakan <strong>Google Gemini AI</strong>. Jika Anda ingin menggunakan router model lain via 9Router, siapkan API Key dari 9Router.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#07080D] border border-white/10 flex flex-col gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#38BDF8]/15 text-[#38BDF8] font-bold flex items-center justify-center text-xs">
                        2
                      </div>
                      <h4 className="font-bold text-white text-xs">WhatsApp Gateway Token</h4>
                      <p className="text-[11px] text-[#8B94AA]">
                        Daftar akun gratis di <strong>Fonnte (fonnte.com)</strong> atau <strong>Wablas</strong>. Scan QR WhatsApp Anda di dashboard mereka, lalu salin Token yang diberikan.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#07080D] border border-white/10 flex flex-col gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-400/15 text-amber-400 font-bold flex items-center justify-center text-xs">
                        3
                      </div>
                      <h4 className="font-bold text-white text-xs">Nomor WhatsApp Anda</h4>
                      <p className="text-[11px] text-[#8B94AA]">
                        Nomor WhatsApp yang akan menerima konten otomatis setiap hari (contoh: <code>6285693009756</code>).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Steps Accordion / Details */}
                <div className="space-y-4">
                  <div className="bg-[#111420] border border-white/10 rounded-xl p-5 space-y-3">
                    <h4 className="font-bold text-white flex items-center gap-2">
                      <Settings2 className="w-4 h-4 text-[#00E57A]" />
                      Langkah Menaruh Variabel di Vercel:
                    </h4>
                    <p className="text-xs text-[#8B94AA]">
                      Buka Dashboard Vercel Anda &gt; Pilih Project &gt; <strong>Settings</strong> &gt; <strong>Environment Variables</strong>, lalu masukkan:
                    </p>

                    <div className="bg-[#07080D] p-3 rounded-lg font-mono text-[11px] space-y-1 text-[#8B94AA] border border-white/5 select-all overflow-x-auto">
                      <p><span className="text-[#00E57A]">GEMINI_API_KEY</span>=your_gemini_key</p>
                      <p><span className="text-[#00E57A]">WA_GATEWAY_PROVIDER</span>=wablas</p>
                      <p><span className="text-[#00E57A]">WA_GATEWAY_TOKEN</span>=jWrKXJduzb4cY0Ie1vjBcsb8H0H5Vt7RNEhVPHHe2FasanSi6qALGgE</p>
                      <p><span className="text-[#00E57A]">WABLAS_DOMAIN</span>=https://jkt.wablas.com</p>
                      <p><span className="text-[#00E57A]">WA_ADMIN_PHONE</span>=6285693009756</p>
                    </div>
                  </div>

                  <div className="bg-[#111420] border border-white/10 rounded-xl p-5 space-y-3">
                    <h4 className="font-bold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#38BDF8]" />
                      Jadwal Otomatis Setiap Hari (Vercel Cron):
                    </h4>
                    <p className="text-xs text-[#8B94AA]">
                      File <code>vercel.json</code> di proyek ini sudah otomatis dikonfigurasi dengan Cron Job harian:
                    </p>
                    <div className="bg-[#07080D] p-3 rounded-lg font-mono text-[11px] text-[#8B94AA] border border-white/5">
                      <code>
                        Endpoint: <strong>POST /api/content/auto-pilot</strong><br />
                        Jadwal: <strong>Setiap hari jam 08:00 pagi</strong> (0 8 * * *)
                      </code>
                    </div>
                    <p className="text-xs text-[#8B94AA]">
                      Begitu Anda mendeploy ke Vercel dan mengisi <code>WA_GATEWAY_TOKEN</code>, setiap pagi AI akan otomatis meracik materi promosi/tips baru dan mengirimkannya langsung ke WhatsApp Anda!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
