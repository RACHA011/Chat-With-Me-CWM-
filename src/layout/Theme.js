export const lightTheme = {
  colors: {
    // Primary Colors
    primary: '#007AFF', // Main blue color for buttons, links, etc.
    primaryDark: '#0063CC', // Darker blue for pressed states or hover effects
    disabled: '#A7C7E7',

    // Secondary Colors
    secondary: '#34C759', // Green for success, confirmations, or positive actions
    accent: '#5856D6', // Purple for accents, highlights, or secondary actions

    // Background Colors
    background: '#FFFFFF', // White background for screens and containers
    backgroundbg: '#E8F5E9',
    receiverbg: '#FFFFFF',
    senderbg: '#DCF8C6',
    selectbg: '#F0FFFF',
    timestampbg: '#757575',
    surface: '#F5F5F5', // Light gray for cards, modals, or elevated surfaces
    headerBg: '#FFFFFF', // Background color for headers or navigation bars

    // Text Colors
    textPrimary: '#1C1C1E', // Primary text color for most content
    textSecondary: '#666666', // Secondary text color for subtitles or less important text
    messagecolor: '#000000', 
    textInverse: '#FFFFFF', // Text color for dark backgrounds (e.g., buttons)

    // Status Colors
    success: '#34C759', // Green for success messages or indicators
    warning: '#FF9500', // Orange for warnings or alerts
    error: '#FF3B30', // Red for errors or critical messages

    // UI Elements
    border: '#E0E0E0', // Light border color for dividers or outlines
    shadow: '#000000', // Shadow color for drop shadows
    inputBg: '#F0F0F0', // Background color for input fields
    placeholder: '#999999', // Placeholder text color for inputs
  },
  spacing: {
    xs: 4, // Extra small spacing (e.g., padding between icons and text)
    sm: 8, // Small spacing (e.g., padding inside buttons)
    md: 16, // Medium spacing (e.g., margin between sections)
    lg: 24, // Large spacing (e.g., padding around cards)
    xl: 32, // Extra large spacing (e.g., margin between major sections)
  },
  fonts: {
    regular: 'System', // Default font for most text
    medium: 'System-Medium', // Medium weight font for subtitles or emphasis
    bold: 'System-Bold', // Bold font for headings or important text
    semiBold: 'System-Semibold', // Semi-bold font for secondary headings
  },
};

export const darkTheme = {
  colors: {
    // Primary Colors
    primary: '#0A84FF', // Brighter blue for better visibility in dark mode
    primaryDark: '#007AFF', // Original blue for contrast in dark mode
    disabled: '#4A708B',

    // Secondary Colors
    secondary: '#30D158', // Brighter green for better visibility in dark mode
    accent: '#5E5CE6', // Brighter purple for better visibility in dark mode

    // Background Colors
    background: '#1C1C1E', // Black background for dark mode
    backgroundbg: '#121212',
    receiverbg: '#2E2E2E',
    senderbg: '#1B5E20',
    selectbg: '#2A3B3C',
    timestampbg: '#A0A0A0',
    surface: '#1C1C1E', // Dark gray for cards, modals, or elevated surfaces
    headerBg: '#1C1C1E', // Dark background for headers or navigation bars

    // Text Colors
    textPrimary: '#FFFFFF', // White text for better contrast in dark mode
    textSecondary: '#8E8E93', // Gray text for subtitles or less important text
    messagecolor: '#E0E0E0', 
    textInverse: '#1C1C1E', // Dark text for light surfaces (e.g., buttons)

    // Status Colors (consistent with light theme for familiarity)
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',

    // UI Elements
    border: '#2C2C2E', // Dark border color for dividers or outlines
    shadow: '#FFFFFF', // Light shadow for better visibility in dark mode
    inputBg: '#2C2C2E', // Dark background for input fields
    placeholder: '#686868', // Dark placeholder text color for inputs
  },
  spacing: { ...lightTheme.spacing }, // Same spacing values as light theme
  fonts: { ...lightTheme.fonts }, // Same font stack as light theme
};

// Common component styles that work with both themes
export const commonStyles = {
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // For Android shadow
  },
  card: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: 'surface', // Dynamically set by theme
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'primary', // Dynamically set by theme
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'textInverse', // Dynamically set by theme
  },
  // Add more common styles as needed
};
