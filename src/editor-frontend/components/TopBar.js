import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, useWindowDimensions, Platform, Animated, ScrollView } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const LANGUAGES = [
    { id: 71, name: 'Python 3.8.1', short: 'Python' },
    { id: 50, name: 'C (GCC 9.2.0)', short: 'C' },
    { id: 54, name: 'C++ (GCC 9.2.0)', short: 'C++' },
    { id: 62, name: 'Java (OpenJDK 13)', short: 'Java' },
];

const DIFF_COLOR = {
    easy:   '#10B981',
    medium: '#F59E0B',
    hard:   '#EF4444',
};

export const TopBar = ({
    selectedLanguageItem,
    setSelectedLanguageItem,
    onRun,
    onSubmit,
    onToggleQuestion,
    isQuestionVisible,
    // problem selector
    problemList = [],
    currentProblem,
    onProblemChange,
}) => {
    const { isDark, colors, toggleTheme } = useTheme();
    const { width } = useWindowDimensions();
    const [showLangDropdown, setShowLangDropdown]       = useState(false);
    const [showProblemDropdown, setShowProblemDropdown] = useState(false);
    const langAnim    = useRef(new Animated.Value(0)).current;
    const problemAnim = useRef(new Animated.Value(0)).current;

    const isMobile = width < 500;

    const currentLang = LANGUAGES.find(l => l.id === selectedLanguageItem.id) || LANGUAGES[0];

    useEffect(() => {
        Animated.spring(langAnim, {
            toValue: showLangDropdown ? 1 : 0,
            useNativeDriver: true,
            tension: 40,
            friction: 7,
        }).start();
    }, [showLangDropdown]);

    useEffect(() => {
        Animated.spring(problemAnim, {
            toValue: showProblemDropdown ? 1 : 0,
            useNativeDriver: true,
            tension: 40,
            friction: 7,
        }).start();
    }, [showProblemDropdown]);

    // Close the other dropdown when one opens
    const toggleLang = () => {
        setShowProblemDropdown(false);
        setShowLangDropdown(v => !v);
    };
    const toggleProblem = () => {
        setShowLangDropdown(false);
        setShowProblemDropdown(v => !v);
    };

    return (
        <View style={[styles.container, {
            backgroundColor: colors.topBarBg,
            borderBottomColor: colors.topBarBorder,
            height: isMobile ? 54 : 60,
            paddingHorizontal: isMobile ? 12 : 20,
            ...Platform.select({
                web: { boxShadow: colors.shadowSm },
                default: { elevation: 2 }
            })
        }]}>
            {/* Left: Logo & Context */}
            <View style={[styles.leftActions, { gap: isMobile ? 8 : 12 }]}>
                <View style={[styles.logoBadge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.logoIcon}>⟨/⟩</Text>
                </View>
                {!isMobile && (
                    <>
                        <View style={styles.logoTextContainer}>
                            <Text style={[styles.logoText, { color: colors.textPrimary }]}>CodeLab</Text>
                            <View style={styles.statusBadge}>
                                <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
                                <Text style={[styles.statusText, { color: colors.textMuted }]}>Auto-saved</Text>
                            </View>
                        </View>
                        <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
                    </>
                )}

                <TouchableOpacity
                    style={[styles.navBtn, {
                        backgroundColor: isQuestionVisible ? colors.surfaceAlt : 'transparent',
                        paddingHorizontal: isMobile ? 8 : 12,
                    }]}
                    onPress={onToggleQuestion}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.navBtnText, {
                        color: isQuestionVisible ? colors.primary : colors.textSecondary,
                        fontSize: isMobile ? 12 : 13,
                    }]}>
                        Problem
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Center: Problem Selector + Language Selector */}
            <View style={[styles.centerArea, {
                justifyContent: 'center',
                flexDirection: 'row',
                gap: isMobile ? 6 : 10,
                paddingHorizontal: isMobile ? 4 : 0
            }]}>

                {/* ── Problem selector dropdown ── */}
                {problemList.length > 0 && (
                    <View style={styles.dropdownContainer}>
                        <TouchableOpacity
                            style={[styles.langBtn, {
                                backgroundColor: colors.surfaceAlt,
                                borderColor: showProblemDropdown ? colors.primary : colors.borderLight,
                                paddingHorizontal: isMobile ? 8 : 12,
                                maxWidth: isMobile ? 130 : 220,
                            }]}
                            onPress={toggleProblem}
                            activeOpacity={0.7}
                        >
                            {/* Coloured dot for difficulty */}
                            {currentProblem && (
                                <View style={[styles.diffDot, {
                                    backgroundColor: DIFF_COLOR[currentProblem.difficulty] || '#10B981'
                                }]} />
                            )}
                            <Text
                                numberOfLines={1}
                                style={[styles.langBtnText, {
                                    color: colors.textPrimary,
                                    fontSize: isMobile ? 11 : 13,
                                    flex: 1,
                                }]}
                            >
                                {currentProblem ? currentProblem.title : 'Select Problem'}
                            </Text>
                            <Text style={[styles.chevron, { color: colors.textMuted }]}>
                                {showProblemDropdown ? '▴' : '▾'}
                            </Text>
                        </TouchableOpacity>

                        {showProblemDropdown && (
                            <Animated.View style={[styles.dropdownMenu, styles.problemMenu, {
                                backgroundColor: colors.surface,
                                borderColor: colors.borderMedium,
                                opacity: problemAnim,
                                transform: [{
                                    translateY: problemAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [-10, 0],
                                    })
                                }, {
                                    scale: problemAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.95, 1],
                                    })
                                }]
                            }]}>
                                <ScrollView
                                    style={{ maxHeight: 320 }}
                                    showsVerticalScrollIndicator={false}
                                    keyboardShouldPersistTaps="handled"
                                >
                                    {problemList.map((p, index) => {
                                        const isSelected = currentProblem && currentProblem.id === p.id;
                                        const dotColor = DIFF_COLOR[p.difficulty] || '#10B981';
                                        return (
                                            <TouchableOpacity
                                                key={p.id}
                                                style={[styles.dropdownItem, {
                                                    borderBottomWidth: index < problemList.length - 1 ? 1 : 0,
                                                    borderBottomColor: colors.borderLight,
                                                    backgroundColor: isSelected ? colors.surfaceAlt : 'transparent',
                                                }]}
                                                onPress={() => {
                                                    onProblemChange && onProblemChange(p.id);
                                                    setShowProblemDropdown(false);
                                                }}
                                                activeOpacity={0.7}
                                            >
                                                <View style={styles.dropdownItemLeft}>
                                                    <View style={[styles.diffDot, { backgroundColor: dotColor }]} />
                                                    <View>
                                                        <Text style={[styles.dropdownItemName, {
                                                            color: isSelected ? colors.primary : colors.textPrimary,
                                                            fontWeight: isSelected ? '700' : '500',
                                                        }]}>
                                                            {p.title}
                                                        </Text>
                                                        <Text style={[styles.dropdownItemVersion, { color: dotColor }]}>
                                                            {p.difficulty.charAt(0).toUpperCase() + p.difficulty.slice(1)}
                                                        </Text>
                                                    </View>
                                                </View>
                                                {isSelected && (
                                                    <Text style={{ color: colors.primary, fontSize: 13 }}>✓</Text>
                                                )}
                                            </TouchableOpacity>
                                        );
                                    })}
                                </ScrollView>
                            </Animated.View>
                        )}
                    </View>
                )}

                {/* ── Language selector dropdown ── */}
                <View style={styles.dropdownContainer}>
                    <TouchableOpacity
                        style={[styles.langBtn, {
                            backgroundColor: colors.surfaceAlt,
                            borderColor: showLangDropdown ? colors.primary : colors.borderLight,
                            paddingHorizontal: isMobile ? 8 : 12,
                        }]}
                        onPress={toggleLang}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.langBtnText, {
                            color: colors.textPrimary,
                            fontSize: isMobile ? 12 : 13,
                        }]}>
                            {currentLang.short}
                        </Text>
                        <Text style={[styles.chevron, { color: colors.textMuted }]}>
                            {showLangDropdown ? '▴' : '▾'}
                        </Text>
                    </TouchableOpacity>

                    {showLangDropdown && (
                        <Animated.View style={[styles.dropdownMenu, {
                            backgroundColor: colors.surface,
                            borderColor: colors.borderMedium,
                            shadowColor: colors.shadowLg,
                            opacity: langAnim,
                            transform: [{
                                translateY: langAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [-10, 0]
                                })
                            }, {
                                scale: langAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.95, 1]
                                })
                            }]
                        }]}>
                            {LANGUAGES.map((lang, index) => {
                                const isSelected = selectedLanguageItem.id === lang.id;
                                return (
                                    <TouchableOpacity
                                        key={lang.id}
                                        style={[styles.dropdownItem, {
                                            borderBottomWidth: index < LANGUAGES.length - 1 ? 1 : 0,
                                            borderBottomColor: colors.borderLight,
                                            backgroundColor: isSelected ? colors.surfaceAlt : 'transparent',
                                        }]}
                                        onPress={() => {
                                            setSelectedLanguageItem(lang);
                                            setShowLangDropdown(false);
                                        }}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.dropdownItemLeft}>
                                            <View>
                                                <Text style={[styles.dropdownItemName, {
                                                    color: isSelected ? colors.primary : colors.textPrimary,
                                                    fontWeight: isSelected ? '700' : '500',
                                                }]}>
                                                    {lang.short}
                                                </Text>
                                                <Text style={[styles.dropdownItemVersion, { color: colors.textMuted }]}>
                                                    {lang.name}
                                                </Text>
                                            </View>
                                        </View>
                                        {isSelected && (
                                            <Text style={{ color: colors.primary, fontSize: 13 }}>✓</Text>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </Animated.View>
                    )}
                </View>

                {isMobile && (
                    <TouchableOpacity
                        style={[styles.runBtnMobile, { backgroundColor: colors.success + '15', borderColor: colors.success }]}
                        onPress={onRun}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.runBtnTextMobile, { color: colors.success }]}>▶ Run</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Right: Actions & Profile */}
            <View style={[styles.rightActions, { gap: isMobile ? 8 : 12 }]}>
                <TouchableOpacity
                    style={[styles.themeToggle, { borderColor: colors.borderLight }]}
                    onPress={toggleTheme}
                    activeOpacity={0.7}
                >
                    <Text style={styles.themeEmoji}>{isDark ? '☀️' : '🌙'}</Text>
                </TouchableOpacity>

                {!isMobile && (
                    <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.borderLight }]}
                        onPress={onRun}
                    >
                        <Text style={[styles.actionBtnText, { color: colors.textPrimary }]}>Run</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={[styles.actionBtn, {
                        backgroundColor: colors.primary,
                        paddingHorizontal: isMobile ? 12 : 16,
                    }]}
                    onPress={onSubmit}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.actionBtnText, {
                        color: '#FFFFFF',
                        fontSize: isMobile ? 12 : 13,
                    }]}>
                        {isMobile ? 'Submit' : 'Submit Solution'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        zIndex: 1000,
    },
    leftActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    logoBadge: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoIcon: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '900',
    },
    logoTextContainer: {
        gap: 2,
    },
    logoText: {
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '500',
    },
    divider: {
        width: 1,
        height: 24,
        marginHorizontal: 8,
    },
    navBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    navBtnText: {
        fontSize: 13,
        fontWeight: '600',
    },

    /* Center area */
    centerArea: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
    },
    langBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 7,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
    },
    langBtnText: {
        fontSize: 13,
        fontWeight: '600',
    },
    chevron: {
        fontSize: 12,
    },
    dropdownMenu: {
        position: 'absolute',
        top: 44,
        left: '50%',
        marginLeft: -100,
        width: 200,
        borderWidth: 1,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 10,
        zIndex: 2000,
    },
    // Wider menu for problem list
    problemMenu: {
        width: 260,
        marginLeft: -130,
    },
    // Difficulty colour dot inside buttons & list rows
    diffDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        flexShrink: 0,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    dropdownItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    dropdownItemName: {
        fontSize: 14,
    },
    dropdownItemVersion: {
        fontSize: 11,
        marginTop: 2,
    },

    /* Right actions */
    rightActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    themeToggle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    themeEmoji: {
        fontSize: 16,
    },
    actionBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionBtnText: {
        fontSize: 13,
        fontWeight: '700',
    },
    runBtnMobile: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 7,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
    },
    runBtnTextMobile: {
        fontSize: 12,
        fontWeight: '800',
    },
});
