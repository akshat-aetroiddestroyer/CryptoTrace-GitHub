import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useGetCryptoTraceStatus, useHealthCheck } from '@workspace/api-client-react';
import { CryptoShell } from '@/components/CryptoShell';
import { Dashboard } from '@/pages/Dashboard';
import { Safety } from '@/pages/Safety';
import { Registry } from '@/pages/Registry';
import { Alerts } from '@/pages/Alerts';
import { VoiceIntake } from '@/pages/VoiceIntake';
import { SafetyCheck } from '@/pages/SafetyCheck';
import { EvidenceVault } from '@/pages/EvidenceVault';
import { BrowserExtension } from '@/pages/BrowserExtension';
import { About } from '@/pages/About';
import NotFound from '@/pages/not-found';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Router() {
  const status = useGetCryptoTraceStatus();
  const health = useHealthCheck();

  return (
    <RoutedErrorBoundary>
      <CryptoShell status={status.data} health={health.data} statusLoading={status.isLoading}>
        <Switch>
          <Route path="/" component={() => <Dashboard status={status.data} />} />
          <Route path="/about" component={About} />
          <Route path="/alerts" component={Alerts} />
          <Route path="/registry" component={Registry} />
          <Route path="/safety-check" component={SafetyCheck} />
          <Route path="/extension" component={BrowserExtension} />
          <Route path="/voice" component={VoiceIntake} />
          <Route path="/evidence" component={EvidenceVault} />
          <Route path="/safety" component={Safety} />
          <Route component={NotFound} />
        </Switch>
      </CryptoShell>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
