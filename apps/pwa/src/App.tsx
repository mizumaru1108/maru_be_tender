// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
// import Settings from './components/settings';
import ThemeSettings from 'components/settings';
import MotionLazyContainer from './components/animate/MotionLazyContainer';
import { ChartStyle } from './components/chart';
import NotistackProvider from './components/NotistackProvider';
import { ProgressBarStyle } from './components/ProgressBar';
import ScrollToTop from './components/ScrollToTop';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <MotionLazyContainer>
      <ThemeProvider>
        <ThemeSettings>
          <NotistackProvider>
            <ProgressBarStyle />
            <ChartStyle />
            <ScrollToTop />
            <Router />
          </NotistackProvider>
        </ThemeSettings>
      </ThemeProvider>
    </MotionLazyContainer>
  );
}
