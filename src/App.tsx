import { useState, useEffect, useCallback } from 'react';
import { Navbar, type View } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HomeView } from '@/views/HomeView';
import { PredictView } from '@/views/PredictView';
import { DashboardView } from '@/views/DashboardView';
import { supabase } from '@/lib/supabase';
import type { SavedPrediction } from '@/lib/types';

function App() {
  const [view, setView] = useState<View>('home');
  const [history, setHistory] = useState<SavedPrediction[]>([]);

  const loadHistory = useCallback(async () => {
    const { data, error } = await supabase
      .from('flight_predictions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    if (!error && data) {
      setHistory(data as SavedPrediction[]);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return (
    <div className="flex min-h-screen flex-col bg-ink-950">
      <Navbar view={view} onNavigate={setView} />
      <main className="flex-1">
        {view === 'home' && <HomeView onNavigate={setView} />}
        {view === 'predict' && (
          <PredictView history={history} onPredictionSaved={loadHistory} />
        )}
        {view === 'dashboard' && <DashboardView history={history} />}
      </main>
      <Footer />
    </div>
  );
}

export default App;
