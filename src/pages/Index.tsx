import { useState, useEffect } from "react";
import { Upload, FileText, History, LogIn, User as UserIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";

const Index = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      toast({
        title: "שגיאה בהתחברות",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "שגיאה בהתנתקות",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleFileDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "נדרשת התחברות",
        description: "אנא התחבר כדי להעלות קבצים",
        variant: "destructive",
      });
      return;
    }
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles);
    toast({
      title: "קבצים הועלו בהצלחה",
      description: `${droppedFiles.length} קבצים נוספו לניתוח`,
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      toast({
        title: "נדרשת התחברות",
        description: "אנא התחבר כדי להעלות קבצים",
        variant: "destructive",
      });
      return;
    }
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
      toast({
        title: "קבצים נבחרו בהצלחה",
        description: `${selectedFiles.length} קבצים נוספו לניתוח`,
      });
    }
  };

  const handleAnalyze = async () => {
    if (!user) {
      toast({
        title: "נדרשת התחברות",
        description: "אנא התחבר כדי לנתח קבצים",
        variant: "destructive",
      });
      return;
    }
    setAnalyzing(true);
    // Here you'll integrate with your analysis system
    toast({
      title: "ניתוח מסמכים",
      description: "המסמכים נשלחו לניתוח",
    });
    setTimeout(() => setAnalyzing(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12 fade-in">
          <div className="flex justify-end mb-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  שלום, {user.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <UserIcon size={16} />
                  התנתק
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleLogin}
                className="flex items-center gap-2"
                variant="outline"
                size="sm"
              >
                <LogIn size={16} />
                התחבר עם Google
              </Button>
            )}
          </div>
          <h1 className="text-4xl font-bold mb-4">מערכת ניתוח מסמכים</h1>
          <p className="text-muted-foreground">העלו מסמכים לניתוח מתקדם</p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-card p-8 slide-up">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="border-2 border-dashed border-primary/20 rounded-xl p-8 text-center hover:border-primary/50 transition-colors"
            >
              <Upload className="mx-auto mb-4 text-primary/60" size={40} />
              <h2 className="text-xl font-semibold mb-2">העלאת מסמכים</h2>
              <p className="text-sm text-muted-foreground mb-4">
                {user
                  ? "גררו קבצים לכאן או לחצו לבחירה"
                  : "אנא התחברו כדי להעלות קבצים"}
              </p>
              {user && (
                <>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-lg cursor-pointer hover:bg-primary/90 transition-colors"
                  >
                    בחירת קבצים
                  </label>
                </>
              )}
            </div>

            {files.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">קבצים שנבחרו:</h3>
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-2 bg-background/50 p-2 rounded-lg"
                    >
                      <FileText className="text-primary" size={20} />
                      <span>{file.name}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="w-full mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {analyzing ? "מנתח..." : "התחל ניתוח"}
                </button>
              </div>
            )}
          </div>

          <div className="glass-card p-8 slide-up">
            <div className="text-center">
              <History className="mx-auto mb-4 text-primary/60" size={40} />
              <h2 className="text-xl font-semibold mb-4">היסטוריית ניתוחים</h2>
              {user ? (
                <p className="text-muted-foreground">
                  כאן תוכלו לראות את היסטוריית הניתוחים שלכם
                </p>
              ) : (
                <p className="text-muted-foreground">
                  אנא התחברו כדי לראות את היסטוריית הניתוחים שלכם
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
