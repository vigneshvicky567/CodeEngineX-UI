import React, { createContext, useContext, useState, useMemo } from 'react';

const ThemeContext = createContext();

const lightColors = {
    primary: '#3C2CDA',
    primaryHover: '#2A1F9E',
    primaryCTA: '#1D86FF',
    secondaryAccent: '#14CBDE',
    primaryGradient: 'linear-gradient(135deg, #3C2CDA 0%, #1D86FF 100%)',

    textPrimary: '#040D43',
    textSecondary: '#4B5563',
    textMuted: '#6B7280',
    textInverse: '#FFFFFF',

    background: '#F9FAFB',
    surface: '#FFFFFF',
    surfaceAlt: '#F3F4F6',
    surfaceHover: '#E5E7EB',
    editorBg: '#FFFFFF',
    cardBg: '#FFFFFF',

    // Borders & UI
    borderLight: '#E5E7EB',
    borderMedium: '#D1D5DB',
    borderDark: '#9CA3AF',
    borderAccent: '#3C2CDA',

    // Status
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#3B82F6',

    // Specialized components
    topBarBg: '#FFFFFF',
    topBarText: '#040D43',
    topBarBorder: '#E5E7EB',

    consoleBg: '#F9FAFB',
    consoleText: '#1F2937',
    terminalHeader: '#F3F4F6',

    dropdownBg: '#FFFFFF',
    dropdownText: '#1F2937',
    dropdownHover: '#F3F4F6',

    // Tags
    tagEasyBg: '#D1FAE5',
    tagEasyText: '#065F46',
    tagMediumBg: '#FEF3C7',
    tagMediumText: '#92400E',
    tagHardBg: '#FEE2E2',
    tagHardText: '#991B1B',

    // Effects
    shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    glassBg: 'rgba(255, 255, 255, 0.7)',
    glassBorder: 'rgba(255, 255, 255, 0.3)',
};

const darkColors = {
    primary: '#6366F1',
    primaryHover: '#818CF8',
    primaryCTA: '#3B82F6',
    secondaryAccent: '#22D3EE',
    primaryGradient: 'linear-gradient(135deg, #6366F1 0%, #3B82F6 100%)',

    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    textInverse: '#0F172A',

    background: '#020617', // Near black for premium depth
    surface: '#0F172A',
    surfaceAlt: '#1E293B',
    surfaceHover: '#334155',
    editorBg: '#020617',
    cardBg: '#0F172A',

    // Borders & UI
    borderLight: '#1E293B',
    borderMedium: '#334155',
    borderDark: '#475569',
    borderAccent: '#6366F1',

    // Status
    error: '#F87171',
    success: '#34D399',
    warning: '#FBBF24',
    info: '#60A5FA',

    // Specialized components
    topBarBg: '#0F172A',
    topBarText: '#F8FAFC',
    topBarBorder: '#1E293B',

    consoleBg: '#020617',
    consoleText: '#E2E8F0',
    terminalHeader: '#0F172A',

    dropdownBg: '#1E293B',
    dropdownText: '#F1F5F9',
    dropdownHover: '#334155',

    // Tags
    tagEasyBg: '#064E3B',
    tagEasyText: '#6EE7B7',
    tagMediumBg: '#78350F',
    tagMediumText: '#FDE68A',
    tagHardBg: '#7F1D1D',
    tagHardText: '#FCA5A5',

    // Effects
    shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    shadowLg: '0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    glassBg: 'rgba(15, 23, 42, 0.7)',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
};

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(true);
    const toggleTheme = () => setIsDark(prev => !prev);

    const theme = useMemo(() => ({
        isDark,
        colors: isDark ? darkColors : lightColors,
        toggleTheme,
    }), [isDark]);

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
