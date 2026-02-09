import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientBackground } from '@/components/gradient-background';
import { ThemedText } from '@/components/themed-text';
import { PhoenixColors } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function CalculatorScreen() {
  const insets = useSafeAreaInsets();
  
  // Calculator state
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [resetDisplay, setResetDisplay] = useState(false);

  const handleNumber = (num: string) => {
    if (resetDisplay) {
      setDisplay(num);
      setResetDisplay(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (resetDisplay) {
      setDisplay('0.');
      setResetDisplay(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperation = (op: string) => {
    if (previousValue !== null && operation !== null && !resetDisplay) {
      handleEquals();
    }
    setPreviousValue(display);
    setOperation(op);
    setResetDisplay(true);
  };

  const handleEquals = () => {
    if (previousValue === null || operation === null) return;

    const prev = parseFloat(previousValue);
    const current = parseFloat(display);
    let result = 0;

    switch (operation) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '×':
        result = prev * current;
        break;
      case '÷':
        result = prev / current;
        break;
      case '%':
        result = (prev * current) / 100;
        break;
    }

    setDisplay(result.toString());
    setPreviousValue(null);
    setOperation(null);
    setResetDisplay(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setResetDisplay(false);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleNegate = () => {
    if (display !== '0') {
      setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display);
    }
  };

  return (
    <GradientBackground>
      <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: Math.max(insets.bottom, 20) },
          ]}
        >
          {/* Header */}
          <ThemedText type="title" style={styles.title}>
            Calculator
          </ThemedText>

          {/* Display */}
          <View style={styles.displayContainer}>
            {operation && previousValue && (
              <Text style={styles.operationText}>
                {previousValue} {operation}
              </Text>
            )}
            <Text style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>
              {display}
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {/* Row 1 */}
            <View style={styles.row}>
              <CalculatorButton label="C" onPress={handleClear} type="function" />
              <CalculatorButton label="⌫" onPress={handleBackspace} type="function" />
              <CalculatorButton label="%" onPress={() => handleOperation('%')} type="function" />
              <CalculatorButton label="÷" onPress={() => handleOperation('÷')} type="operator" />
            </View>

            {/* Row 2 */}
            <View style={styles.row}>
              <CalculatorButton label="7" onPress={() => handleNumber('7')} />
              <CalculatorButton label="8" onPress={() => handleNumber('8')} />
              <CalculatorButton label="9" onPress={() => handleNumber('9')} />
              <CalculatorButton label="×" onPress={() => handleOperation('×')} type="operator" />
            </View>

            {/* Row 3 */}
            <View style={styles.row}>
              <CalculatorButton label="4" onPress={() => handleNumber('4')} />
              <CalculatorButton label="5" onPress={() => handleNumber('5')} />
              <CalculatorButton label="6" onPress={() => handleNumber('6')} />
              <CalculatorButton label="-" onPress={() => handleOperation('-')} type="operator" />
            </View>

            {/* Row 4 */}
            <View style={styles.row}>
              <CalculatorButton label="1" onPress={() => handleNumber('1')} />
              <CalculatorButton label="2" onPress={() => handleNumber('2')} />
              <CalculatorButton label="3" onPress={() => handleNumber('3')} />
              <CalculatorButton label="+" onPress={() => handleOperation('+')} type="operator" />
            </View>

            {/* Row 5 */}
            <View style={styles.row}>
              <CalculatorButton label="+/-" onPress={handleNegate} />
              <CalculatorButton label="0" onPress={() => handleNumber('0')} />
              <CalculatorButton label="." onPress={handleDecimal} />
              <CalculatorButton label="=" onPress={handleEquals} type="equals" />
            </View>
          </View>
        </ScrollView>
      </View>
    </GradientBackground>
  );
}

// Calculator Button Component
interface CalculatorButtonProps {
  label: string;
  onPress: () => void;
  type?: 'number' | 'operator' | 'function' | 'equals';
}

function CalculatorButton({ label, onPress, type = 'number' }: CalculatorButtonProps) {
  const getButtonStyle = () => {
    switch (type) {
      case 'operator':
        return styles.operatorButton;
      case 'function':
        return styles.functionButton;
      case 'equals':
        return styles.equalsButton;
      default:
        return styles.numberButton;
    }
  };

  const getTextStyle = () => {
    switch (type) {
      case 'equals':
        return styles.equalsButtonText;
      default:
        return styles.buttonText;
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        getButtonStyle(),
        pressed && styles.buttonPressed,
      ]}
      onPress={onPress}
    >
      <Text style={getTextStyle()}>{label}</Text>
    </Pressable>
  );
}

const buttonSize = (width - 60) / 4; // 4 buttons with spacing

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    marginBottom: 30,
    color: PhoenixColors.white,
  },
  displayContainer: {
    backgroundColor: PhoenixColors.darkGray,
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    minHeight: 120,
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: PhoenixColors.cardBorder,
  },
  operationText: {
    fontSize: 20,
    color: PhoenixColors.mutedText,
    marginBottom: 8,
    textAlign: 'right',
  },
  displayText: {
    fontSize: 48,
    fontWeight: '300',
    color: PhoenixColors.white,
    textAlign: 'right',
  },
  buttonContainer: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    width: buttonSize,
    height: buttonSize,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  numberButton: {
    backgroundColor: PhoenixColors.gray,
    borderColor: PhoenixColors.cardBorder,
  },
  operatorButton: {
    backgroundColor: PhoenixColors.phoenixBlue,
    borderColor: PhoenixColors.phoenixBlue,
  },
  functionButton: {
    backgroundColor: PhoenixColors.lightGray,
    borderColor: PhoenixColors.cardBorder,
  },
  equalsButton: {
    backgroundColor: PhoenixColors.phoenixBlue,
    borderColor: PhoenixColors.phoenixBlue,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 28,
    color: PhoenixColors.white,
    fontWeight: '400',
  },
  equalsButtonText: {
    fontSize: 32,
    color: PhoenixColors.black,
    fontWeight: '600',
  },
});
