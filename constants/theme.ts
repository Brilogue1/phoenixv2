/**
 * Phoenix DM App Theme Colors
 * Black background with light blue accents matching the Phoenix logo
 */

const tintColorLight = '#8AB4F8'; // Phoenix blue
const tintColorDark = '#8AB4F8'; // Phoenix blue

export const Colors = {
  light: {
    text: '#FFFFFF',
    background: '#000000',
    tint: tintColorLight,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#FFFFFF',
    background: '#000000',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

// Phoenix DM Color Palette
export const PhoenixColors = {
  // Primary
  phoenixBlue: '#8AB4F8',
  phoenixBlueDark: '#6B94D8',
  phoenixBlueLight: '#AAC4F8',
  
  // Background
  black: '#000000',
  darkGray: '#0A0A0A',
  gray: '#1A1A1A',
  lightGray: '#2A2A2A',
  
  // Text
  white: '#FFFFFF',
  lightText: '#E0E0E0',
  mutedText: '#9BA1A6',
  
  // Status
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
  
  // Overlays
  overlay: 'rgba(0, 0, 0, 0.7)',
  cardBackground: 'rgba(26, 26, 26, 0.8)',
  cardBorder: 'rgba(138, 180, 248, 0.2)',
};
