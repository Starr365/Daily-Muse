import { MoodProvider } from './context/MoodContext';
import HomePage from './pages/index';
import './index.css';

function App() {
  return (
    <MoodProvider>
      <HomePage />
    </MoodProvider>
  );
}

export default App;