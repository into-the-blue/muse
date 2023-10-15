import type { Enhancer } from '@muse/types';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export const safeAreaEnhancer: Enhancer = <P extends JSX.IntrinsicAttributes>(
  App: React.ComponentType<P>
) => {
  const Enhanced = (props: P) => {
    return (
      <SafeAreaProvider>
        <App {...props} />
      </SafeAreaProvider>
    );
  };
  return Enhanced;
};
