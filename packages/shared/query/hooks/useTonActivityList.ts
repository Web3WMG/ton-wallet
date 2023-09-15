import { useExternalState } from '../../hooks/useExternalState';
import { tk } from '../../tonkeeper';
import { useEffect } from 'react';

export const useTonActivityList = () => {
  const state = useExternalState(tk.wallet?.tonActivityList.state);

  useEffect(() => {
    tk.wallet.tonActivityList.load();
  }, []);

  return {
    loadMore: () => tk.wallet?.tonActivityList.loadMore(),
    reload: () => tk.wallet?.tonActivityList.reload(),
    isReloading: state.isReloading,
    isLoading: state.isLoading,
    sections: state.sections,
    hasMore: state.hasMore,
  };
};
