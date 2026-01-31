import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const EmailCapture = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      // Connects to your backend file at api/subscribe.ts
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        // This catches 400, 405, and 500 errors from your subscribe.ts
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setEmail("");
    } catch (error: any) {
      console.error("Signup error:", error);
      setStatus("error");
      setErrorMessage(error.message || "Failed to join waitlist. Please try again.");
    }
  };

  return (
    <section id="early-access" className="border-t border-border/50 bg-card/30">
      <div className="container mx-auto px-6 py-24 lg:py-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="max-w-lg mx-auto text-center"
        >
          <h2 className="text-display-xs lg:text-display-sm font-semibold text-foreground mb-4">
            Ready to secure your AI?
          </h2>
          <p className="text-muted-foreground text-lg mb-10">
            Join enterprises already on the waitlist for early access.
          </p>

          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-secondary border border-[#AADDEC]/20 rounded-xl p-8"
            >
              <CheckCircle2 className="w-12 h-12 text-[#AADDEC] mx-auto mb-4" />
              <p className="text-foreground font-medium text-lg">You're on the list.</p>
              <p className="text-muted-foreground text-sm mt-2">
                We'll reach out when it's your turn. Check your inbox for a confirmation.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Work email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === "loading"}
                  className="h-14 text-base bg-secondary border-white/10 placeholder:text-muted-foreground/50 
                             focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-[#AADDEC] 
                             transition-colors duration-200"
                />
                
                {status === "error" && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-red-400 text-sm text-left px-1"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={status === "loading"}
                className="w-full h-14 bg-white text-black hover:bg-[#AADDEC] font-bold text-base transition-all duration-300 border-none"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Joining...
                  </>
                ) : (
                  <>
                    Get early access
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground pt-2">
                No spam. Unsubscribe anytime.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default EmailCapture;