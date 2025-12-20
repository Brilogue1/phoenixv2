import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { IconSymbol } from './ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

interface WeekNavigationProps {
  currentWeek: number;
  weekLabel: string;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export function WeekNavigation({
  currentWeek,
  weekLabel,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}: WeekNavigationProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const primaryColor = useThemeColor({}, 'primary');
  const disabledColor = useThemeColor({}, 'textSecondary');

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onPrevious}
        disabled={!canGoPrevious}
        style={[
          styles.arrow,
          { backgroundColor },
          !canGoPrevious && styles.arrowDisabled,
        ]}
      >
        <IconSymbol
          name="chevron.left"
          size={24}
          color={canGoPrevious ? primaryColor : disabledColor}
        />
      </Pressable>

      <View style={[styles.weekLabel, { backgroundColor, borderColor: primaryColor }]}>
        <ThemedText type="defaultSemiBold" style={{ color: primaryColor }}>
          {weekLabel}
        </ThemedText>
      </View>

      <Pressable
        onPress={onNext}
        disabled={!canGoNext}
        style={[
          styles.arrow,
          { backgroundColor },
          !canGoNext && styles.arrowDisabled,
        ]}
      >
        <IconSymbol
          name="chevron.right"
          size={24}
          color={canGoNext ? primaryColor : disabledColor}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    gap: 12,
  },
  arrow: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  arrowDisabled: {
    opacity: 0.5,
  },
  weekLabel: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 2,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
