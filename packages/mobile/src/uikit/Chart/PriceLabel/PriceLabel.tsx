import React, { useState } from 'react';
import { t } from '$translation';
import { Text } from '$uikit/Text/Text';
import { useChartData } from '@rainbow-me/animated-charts';
import { format, subMonths } from 'date-fns';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';

export const PriceLabel: React.FC = () => {
    const chartData = useChartData();
    const [state, setState] = useState('');

    const formatDateWrapper = (text: string) => {
        if (!text) {
            setState(t('chart.price'));
            return;
        }
        const subbedText = subMonths(new Date(parseInt(text) * 1000), 1);
        setState(format(subbedText, 'ccc, dd MMM H:mm'));
    };

    useAnimatedReaction(() => {
        return chartData?.originalX.value;
    }, (result, previous) => {
        if (result !== previous) {
           runOnJS(formatDateWrapper)(result);
        }
    }, []);

    return (
        <Text variant='label3' color='foregroundSecondary' >
            {state}
        </Text>
    )
}