import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-accent to-primary p-4">
      <div className="w-full max-width-md">
        <div className="bg-card rounded-lg shadow-2xl p-8 border border-border">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Douanes</h1>
            <p className="text-muted-foreground mt-2 text-center">
              Système de Répartition de Contentieux
            </p>
          </div>

          <SupabaseAuth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "hsl(213 94% 32%)",
                    brandAccent: "hsl(189 85% 45%)",
                  },
                },
              },
            }}
            localization={{
              variables: {
                sign_in: {
                  email_label: "Adresse e-mail",
                  password_label: "Mot de passe",
                  button_label: "Se connecter",
                  loading_button_label: "Connexion en cours...",
                  social_provider_text: "Se connecter avec {{provider}}",
                  link_text: "Vous avez déjà un compte ? Connectez-vous",
                },
                sign_up: {
                  email_label: "Adresse e-mail",
                  password_label: "Mot de passe",
                  button_label: "S'inscrire",
                  loading_button_label: "Inscription en cours...",
                  social_provider_text: "S'inscrire avec {{provider}}",
                  link_text: "Vous n'avez pas de compte ? Inscrivez-vous",
                },
              },
            }}
            providers={[]}
            redirectTo={`${window.location.origin}/`}
          />
        </div>

        <p className="text-center mt-6 text-sm text-white/80">
          Ministère des Finances - Direction Générale des Douanes
        </p>
      </div>
    </div>
  );
};

export default Auth;
