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
import { Provider } from 'urql';
import { client } from 'api/urql';
// ----------------------------------------------------------------------

export default function App() {
  return (
    <MotionLazyContainer>
      <ThemeProvider>
        <ThemeSettings>
          <NotistackProvider>
            <Provider value={client}>
              <ProgressBarStyle />
              <ChartStyle />
              <ScrollToTop />
              <Router />
            </Provider>
          </NotistackProvider>
        </ThemeSettings>
      </ThemeProvider>
    </MotionLazyContainer>
  );
}
