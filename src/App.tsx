import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import AppRouter from './routes/AppRouter';
import { useAppSelector } from './store/hooks';

// We create an internal component to have access to Redux context
const AppWrapper = () => {
  const theme = useAppSelector((state) => state.app.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return <AppRouter />;
};

function App() {
  return (
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  );
}

export default App;
