import React, { useState } from "react";
import { Star, CheckCircle2, X, IndianRupee, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface RiderRatingDeliveryModalProps {
  booking: any;
  isOpen?: boolean;
  onClose: () => void;
  onDeliverSuccess?: (bookingId: string, rating: number, comment?: string) => void;
  onSubmitDelivery?: (bookingId: string, rating: number, comment?: string) => void;
}

export const RiderRatingDeliveryModal: React.FC<RiderRatingDeliveryModalProps> = ({
  booking,
  isOpen,
  onClose,
  onDeliverSuccess,
  onSubmitDelivery,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedbackTags, setFeedbackTags] = useState<string[]>(["On Time", "Quiet Ride"]);
  const [comment, setComment] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!booking) return null;

  const rawName = booking.customer?.name || booking.riderName || booking.name || "Passenger";
  const memberName = rawName
    .replace(/\s*\(Rider\)/gi, "")
    .replace(/\s*\(Driver\)/gi, "")
    .replace(/\s*Rider\b/gi, "");

  const receiptId = (booking.id || "1GWOV").slice(-5).toUpperCase();
  const grossFare = booking.price || booking.fare || booking.totalPrice || 150;
  const commission = Math.round(grossFare * 0.1);
  const netEarnings = grossFare - commission;

  const tags = ["Polite Rider", "On Time", "Quiet Ride", "Clean & Tidy"];

  const toggleTag = (tag: string) => {
    if (feedbackTags.includes(tag)) {
      setFeedbackTags(feedbackTags.filter((t) => t !== tag));
    } else {
      setFeedbackTags([...feedbackTags, tag]);
    }
  };

  const handleSubmit = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    setSubmitting(true);
    const fullComment = [...feedbackTags, comment.trim()].filter(Boolean).join(" • ");
    try {
      if (onDeliverSuccess) {
        await onDeliverSuccess(booking.id, rating, fullComment);
      } else if (onSubmitDelivery) {
        await onSubmitDelivery(booking.id, rating, fullComment);
      }
      onClose();
    } catch (err) {
      console.error("Delivery submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const activeStars = hoverRating || rating;

  return (
    <AnimatePresence>
      <div 
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="fixed inset-0 z-[10010] font-sans bg-slate-900/60 dark:bg-[#0c0f14]/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm rounded-[32px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] p-6 flex flex-col gap-3.5 my-auto overflow-hidden relative border bg-white dark:bg-[#14181e] text-slate-900 dark:text-white border-slate-100 dark:border-slate-800"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer transition-colors z-20"
          >
            <X size={15} />
          </button>

          {/* Green Top Circle Icon */}
          <div className="w-13 h-13 bg-emerald-100/80 dark:bg-emerald-950/60 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 shadow-xs shrink-0">
            <IndianRupee className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>

          {/* Header */}
          <div className="text-center flex flex-col items-center gap-0.5 shrink-0 relative z-10">
            <h3 className="text-xl font-black uppercase tracking-tight italic leading-tight text-slate-900 dark:text-white">
              TRIP SETTLEMENT
            </h3>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              PARTNER WALLET SETTLED SUCCESSFULLY
            </p>
          </div>

          {/* Passenger Profile Summary Box */}
          <div className="bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {booking.customer?.avatar ? (
                <img
                  src={booking.customer.avatar}
                  alt={memberName}
                  className="w-11 h-11 rounded-full object-cover shrink-0 border border-white dark:border-slate-700 shadow-2xs"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-amber-400 dark:bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs shrink-0">
                  {memberName?.[0]?.toUpperCase() || "P"}
                </div>
              )}
              <div className="min-w-0">
                <span className="text-[8px] font-black uppercase text-amber-600 dark:text-amber-500 tracking-wider block leading-none mb-1">
                  TRIP PASSENGER
                </span>
                <span className="text-xs font-black text-slate-900 dark:text-white truncate block leading-tight">
                  {memberName}
                </span>
                <span className="text-[9.5px] font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5 leading-none">
                  ★ 4.9 Verified Rider
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[7.5px] font-black uppercase text-slate-400 tracking-wider block mb-0.5">
                RECEIPT ID
              </span>
              <span className="bg-slate-200/80 dark:bg-slate-700/80 text-slate-800 dark:text-slate-200 text-[9.5px] font-mono font-bold px-2 py-0.5 rounded tracking-wider">
                #{receiptId}
              </span>
            </div>
          </div>

          {/* Financial Breakdown Card */}
          <div className="bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-3 flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-black text-[10px] uppercase tracking-widest text-slate-400">GROSS FARE</span>
              <span className="font-mono font-black text-slate-900 dark:text-white">₹{grossFare}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-black text-[10px] uppercase tracking-widest text-slate-400">COMMISSION (10%)</span>
              <span className="font-mono font-black text-rose-500">-₹{commission}</span>
            </div>
            <div className="flex justify-between items-center text-xs border-t border-slate-200/60 dark:border-slate-700/60 pt-1.5">
              <span className="font-black text-[10px] uppercase tracking-widest text-amber-600 dark:text-amber-500">NET EARNINGS</span>
              <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">₹{netEarnings}</span>
            </div>
          </div>

          {/* Star Rating Selector */}
          <div className="text-center flex flex-col items-center gap-1 my-0.5">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setRating(star);
                  }}
                  className="transition-all hover:scale-115 active:scale-90 duration-150 outline-none cursor-pointer p-0.5"
                >
                  <Star
                    size={32}
                    className={`transition-all duration-200 ${
                      star <= activeStars
                        ? "fill-[#FAB818] text-[#FAB818] drop-shadow-[0_0_6px_rgba(250,184,24,0.5)]"
                        : "text-slate-200 dark:text-slate-700 hover:text-amber-400"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-black italic uppercase text-amber-600 dark:text-[#FAB818] tracking-widest">
              {rating === 5
                ? "★★★★★ VERY RESPECTFUL!"
                : rating === 4
                  ? "★★★★ VERY GOOD!"
                  : rating === 3
                    ? "★★★ AVERAGE"
                    : "★★ POOR"}
            </p>
          </div>

          {/* Compliments / Tags */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[8.5px] font-black uppercase tracking-wider pl-0.5 text-slate-400">
              HIGHLIGHT COMPLIMENTS
            </label>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => {
                const isSelected = feedbackTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTag(tag);
                    }}
                    className={`text-[10px] font-bold px-3 py-1 rounded-full transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-[#FAB818] text-slate-950 border-amber-400 font-black"
                        : "bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Comment Input */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[8.5px] font-black uppercase tracking-wider pl-0.5 text-slate-400">
              ADD NOTES (INTERNAL LOG)
            </label>
            <div className="relative flex items-center">
              <MessageSquare className="absolute left-3 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Comment on passenger behavior, delays, etc..."
                className="w-full text-xs pl-8 pr-3 py-2.5 rounded-xl font-sans focus:outline-none focus:ring-2 focus:ring-[#FAB818]/50 border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 border-slate-200 dark:border-slate-800"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-1.5 pt-1">
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-md active:scale-95 duration-150 cursor-pointer border bg-[#FAB818] text-slate-950 border-amber-400 hover:bg-[#FAB818]/90 shadow-[#FAB818]/15"
            >
              {submitting ? "SUBMITTING..." : "SUBMIT & GO ONLINE"}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSubmit(e);
              }}
              className="w-full py-1 text-[10px] font-black uppercase tracking-widest transition-colors text-center cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              SKIP & GO ONLINE
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
