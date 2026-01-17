"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { submitFeedback, getFeedback, deleteFeedback } from "@/app/actions/feedback";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, Trash2, User, Clock, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface FeedbackItem {
  id: string;
  message: string;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

export default function FeedbackPage() {
  const { userId, user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      setIsLoading(true);
      const data = await getFeedback();
      setFeedbacks(data as any);
    } catch (error) {
      console.error("Error loading feedback:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !message.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await submitFeedback(userId, message);
      setMessage("");
      toast({
        title: "Feedback enviado!",
        description: "Obrigado por sua sugestão.",
      });
      loadFeedback();
    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description: "Tente novamente em instantes.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFeedback(id);
      setFeedbacks(feedbacks.filter((f) => f.id !== id));
      toast({
        title: "Feedback removido",
      });
    } catch (error) {
      toast({
        title: "Erro ao remover",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/20 rounded-2xl border border-primary/30">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Comunidade & Feedback
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Sua voz ajuda a construir o Polaris. Deixe sugestões ou relate bugs.
          </p>
        </div>

        {/* Form Section */}
        <div className="bg-card/50 border border-white/5 backdrop-blur-xl p-6 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative group">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="No que podemos melhorar?"
                className="w-full min-h-[120px] bg-white/5 border border-white/5 text-white placeholder:text-white/20 rounded-2xl p-4 focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all resize-none"
              />
            </div>
            <div className="flex justify-end">
              <Button 
                disabled={!message.trim() || isSubmitting || !userId}
                className="bg-primary hover:bg-primary-glow text-white font-bold px-8 h-12 rounded-xl shadow-glow-sm transition-all"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Enviar agora
                    <Send className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Feedback List */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 py-6">
            <div className="h-[1px] flex-1 bg-white/5"></div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
              Feedbacks Recentes
            </span>
            <div className="h-[1px] flex-1 bg-white/5"></div>
          </div>

          <div className="grid gap-4">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 text-primary animate-spin opacity-20" />
              </div>
            ) : feedbacks.length === 0 ? (
              <div className="text-center py-20 bg-card/20 border border-dashed border-white/10 rounded-3xl">
                <p className="text-muted-foreground italic">Nenhum feedback ainda. Seja o primeiro!</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {feedbacks.map((f, index) => (
                  <motion.div
                    key={f.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-card/40 border border-white/5 p-5 rounded-3xl hover:border-white/10 transition-all hover:bg-card/60 backdrop-blur-sm relative"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
                        {f.profiles?.avatar_url ? (
                          <img src={f.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-white">
                            {f.profiles?.full_name || "Usuário Anônimo"}
                          </h4>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(new Date(f.created_at), { addSuffix: true, locale: ptBR })}
                          </span>
                        </div>
                        <p className="text-white/80 leading-relaxed">
                          {f.message}
                        </p>
                      </div>

                      {userId === f.user_id && (
                        <button
                          onClick={() => handleDelete(f.id)}
                          className="absolute top-4 right-4 p-2 text-white/20 hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
