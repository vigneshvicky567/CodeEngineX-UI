import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet,
    Modal, ScrollView, TextInput, useWindowDimensions,
    Animated, ActivityIndicator, Platform,
    PanResponder, Vibration, Pressable
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { QuestionPanelSkeleton } from './SkeletonLoader';

/**
 * MobileBottomBar — compact action toolbar for mobile (like the reference image).
 *
 * Icons row + a prominent Run button.
 * Tapping icons shows a slide-up sheet for Question / Testcases / Output / Result / History.
 */
export const MobileBottomBar = ({
    // state props
    output, error, isRunning, customInput, setCustomInput,
    submissionResult, history,
    selectedLanguage, languages, onLanguageChange,
    isQuestionVisible, onToggleQuestion,
    onRun, onSubmit,
    toggleTheme, isDark,
    // auto-open control: parent sets this after run/submit, then clears it
    autoOpenSheet, onSheetOpened,
    // dynamic problem data
    currentProblem, problemList, onProblemChange,
}) => {
    const { colors } = useTheme();
    const { height } = useWindowDimensions();
    const [activeSheet, setActiveSheet] = useState(null); // null | 'question' | 'testcases' | 'output' | 'result' | 'history' | 'lang'
    const slideAnim = useRef(new Animated.Value(0)).current;

    // Gesture-based sheet configuration
    const SHEET_HEIGHT = height * 0.75; // Taller sheet for better content visibility
    const SNAP_POINTS = [0, 0.5, 1]; // 0: closed, 0.5: half-open, 1: full-open
    const [currentSnap, setCurrentSnap] = useState(0);

    // Haptic feedback helper
    const triggerHaptic = useCallback((pattern = 1) => {
        if (Platform.OS === 'ios') {
            Vibration.vibrate(20);
        } else {
            Vibration.vibrate([0, 10, 20]);
        }
    }, []);

    // Pan responder for gesture handling
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) =>
                Math.abs(gestureState.dy) > 5, // Detect significant vertical movement
            onPanResponderGrant: () => {
                // Start of gesture
                slideAnim.extractOffset();
            },
            onPanResponderMove: (_, gestureState) => {
                // Calculate progress based on gesture movement
                let progress = Math.max(0, Math.min(1, -gestureState.dy / SHEET_HEIGHT));
                slideAnim.setValue(progress);
            },
            onPanResponderRelease: (_, gestureState) => {
                slideAnim.flattenOffset();
                let velocity = gestureState.vy;
                let currentValue = slideAnim._value; // Current progress

                // Determine snap point based on velocity and position
                let targetSnap = 1;
                if (velocity > 0.5 || currentValue < 0.3) {
                    targetSnap = 0; // Close
                    triggerHaptic();
                } else if (velocity < -0.5 || currentValue > 0.7) {
                    targetSnap = 1; // Full open
                } else {
                    targetSnap = 0.5; // Half open
                }

                // Animate to target snap point
                Animated.spring(slideAnim, {
                    toValue: targetSnap,
                    velocity: velocity / SHEET_HEIGHT,
                    tension: 50,
                    friction: 8,
                    useNativeDriver: true,
                }).start(() => {
                    setCurrentSnap(targetSnap);
                    if (targetSnap === 0) {
                        setActiveSheet(null);
                    }
                });
            },
        })
    ).current;

    const openSheet = (name) => {
        setActiveSheet(name);
        triggerHaptic();
        Animated.spring(slideAnim, {
            toValue: 1,
            tension: 60,
            friction: 9,
            useNativeDriver: true,
        }).start(() => setCurrentSnap(1));
    };

    const closeSheet = () => {
        triggerHaptic();
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 220,
            useNativeDriver: true,
        }).start(() => {
            setActiveSheet(null);
            setCurrentSnap(0);
        });
    };

    const translateY = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [SHEET_HEIGHT, 0],
    });

    // Overlay opacity based on sheet position
    const overlayOpacity = slideAnim.interpolate({
        inputRange: [0, 0.3],
        outputRange: [0, 0.5],
        extrapolate: 'clamp',
    });

    // Auto-open sheet when parent signals (after Run → 'output', after Submit → 'result')
    useEffect(() => {
        if (autoOpenSheet) {
            openSheet(autoOpenSheet);
            if (onSheetOpened) onSheetOpened();
        }
    }, [autoOpenSheet]);

    const icons = [
        { key: 'question', icon: '📋', label: 'Problem' },
        { key: 'testcases', icon: '🧪', label: 'Input' },
        { key: 'output', icon: '📟', label: 'Output' },
        { key: 'result', icon: '📊', label: 'Result' },
        { key: 'history', icon: '📜', label: 'History' },
        { key: 'lang', icon: '🌐', label: selectedLanguage?.short ?? 'Lang' },
        { key: 'theme', icon: isDark ? '☀️' : '🌙', label: 'Theme', action: true },
    ];

    const handleIconPress = (icon) => {
        triggerHaptic();
        if (icon.key === 'theme') {
            toggleTheme();
            return;
        }
        if (activeSheet === icon.key) {
            closeSheet();
        } else {
            openSheet(icon.key);
        }
    };

    return (
        <>
            {/* Slide-up Sheet */}
            {activeSheet && (
                <Modal
                    transparent
                    animationType="none"
                    visible={!!activeSheet}
                    onRequestClose={closeSheet}
                >
                    <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
                        <TouchableOpacity
                            style={StyleSheet.absoluteFill}
                            activeOpacity={1}
                            onPress={closeSheet}
                        />
                    </Animated.View>
                    <Animated.View
                        {...panResponder.panHandlers}
                        style={[
                            styles.sheet,
                            {
                                backgroundColor: colors.surface,
                                borderTopColor: colors.borderLight,
                                height: SHEET_HEIGHT,
                                transform: [{ translateY }],
                                ...Platform.select({
                                    ios: {
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: -4 },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 16,
                                    },
                                    android: {
                                        elevation: 16,
                                    },
                                })
                            }
                        ]}
                    >
                        {/* Sheet handle */}
                        <View style={[styles.sheetHandle, { backgroundColor: colors.surface }]}>
                            <View style={[
                                styles.handle,
                                {
                                    backgroundColor: colors.borderDark,
                                    width: 48,
                                    height: 4,
                                    borderRadius: 2,
                                    ...Platform.select({
                                        ios: {
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.1,
                                            shadowRadius: 2,
                                        },
                                    })
                                }
                            ]} />
                        </View>

                        <SheetContent
                            sheet={activeSheet}
                            colors={colors}
                            output={output}
                            error={error}
                            isRunning={isRunning}
                            customInput={customInput}
                            setCustomInput={setCustomInput}
                            submissionResult={submissionResult}
                            history={history}
                            languages={languages}
                            selectedLanguage={selectedLanguage}
                            onLanguageChange={(l) => { onLanguageChange(l); closeSheet(); }}
                        />
                    </Animated.View>
                </Modal>
            )}

            {/* Bottom Toolbar */}
            <View style={[styles.toolbar, {
                backgroundColor: colors.surface,
                borderTopColor: colors.borderLight,
            }]}>
                {/* Icon row */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.iconRow}
                >
                    {icons.map(icon => {
                        const isActive = activeSheet === icon.key;
                        return (
                            <Pressable
                                key={icon.key}
                                style={({ pressed }) => [
                                    styles.iconBtn,
                                    isActive && {
                                        backgroundColor: colors.primary + '25',
                                        borderColor: colors.primary + '50',
                                        borderWidth: 1,
                                    },
                                    pressed && {
                                        transform: [{ scale: 0.95 }],
                                        backgroundColor: colors.surfaceHover,
                                    },
                                ]}
                                onPress={() => handleIconPress(icon)}
                                onPressIn={() => triggerHaptic()}
                            >
                                <Text style={[
                                    styles.iconEmoji,
                                    { transform: isActive ? [{ scale: 1.1 }] : [] }
                                ]}>
                                    {icon.icon}
                                </Text>
                                <Text style={[
                                    styles.iconLabel,
                                    {
                                        color: isActive ? colors.primary : colors.textMuted,
                                        fontSize: isActive ? 11 : 10,
                                        fontWeight: isActive ? '700' : '600',
                                    }
                                ]}>
                                    {icon.label}
                                </Text>
                                {isActive && (
                                    <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />
                                )}
                            </Pressable>
                        );
                    })}
                </ScrollView>

                {/* Run button */}
                <View style={styles.actionBtns}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.runBtn,
                            {
                                backgroundColor: colors.surfaceAlt,
                                borderColor: colors.success,
                                transform: pressed ? [{ scale: 0.95 }] : [],
                            }
                        ]}
                        onPress={onRun}
                        onPressIn={() => triggerHaptic()}
                        disabled={isRunning}
                    >
                        {isRunning ? (
                            <ActivityIndicator size="small" color={colors.success} />
                        ) : (
                            <Text style={[styles.runBtnText, { color: colors.success }]}>▶ Run</Text>
                        )}
                    </Pressable>
                    <Pressable
                        style={({ pressed }) => [
                            styles.submitBtn,
                            {
                                backgroundColor: colors.primary,
                                transform: pressed ? [{ scale: 0.95 }] : [],
                            }
                        ]}
                        onPress={onSubmit}
                        onPressIn={() => triggerHaptic()}
                        disabled={isRunning}
                    >
                        <Text style={styles.submitBtnText}>Submit</Text>
                    </Pressable>
                </View>
            </View>
        </>
    );
};

// ---------------------------------------------------------------------------
// Sheet content switcher
// ---------------------------------------------------------------------------

function SheetContent({ sheet, colors, output, error, isRunning, customInput, setCustomInput, submissionResult, history, languages, selectedLanguage, onLanguageChange }) {
    const titles = {
        question: '📋 Problem',
        testcases: '🧪 Custom Input',
        output: '📟 Output',
        result: '📊 Result',
        history: '📜 History',
        lang: '🌐 Language',
    };

    return (
        <View style={{ flex: 1 }}>
            <Text style={[styles.sheetTitle, { color: colors.textPrimary, borderBottomColor: colors.borderLight }]}>
                {titles[sheet] ?? sheet}
            </Text>

            {sheet === 'testcases' && (
                <ScrollView contentContainerStyle={styles.sheetBody}>
                    <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>STDIN</Text>
                    <TextInput
                        style={[styles.inputArea, {
                            backgroundColor: colors.surfaceAlt,
                            borderColor: colors.borderLight,
                            color: colors.textPrimary,
                        }]}
                        multiline
                        value={customInput}
                        onChangeText={setCustomInput}
                        placeholder="Enter test input..."
                        placeholderTextColor={colors.textMuted}
                    />
                    {(() => {
                        const visibleCases = (currentProblem?.testcases || []).filter(
                            tc => !tc.is_hidden && tc.input_text
                        );
                        if (visibleCases.length === 0) return null;
                        return (
                            <>
                                <Text style={[styles.fieldLabel, { color: colors.textMuted, marginTop: 16 }]}>
                                    SAMPLE TESTCASES  <Text style={{ fontWeight: '400', textTransform: 'none' }}>(tap to use)</Text>
                                </Text>
                                {visibleCases.map((tc, idx) => (
                                    <TouchableOpacity
                                        key={tc.id}
                                        style={[styles.sampleCard, {
                                            backgroundColor: colors.surfaceAlt,
                                            borderColor: colors.borderLight,
                                        }]}
                                        onPress={() => setCustomInput(tc.input_text)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={[styles.sampleCardLabel, { color: colors.textMuted }]}>Case {idx + 1}</Text>
                                        <Text style={[styles.sampleCardValue, { color: colors.textPrimary }]}>{tc.input_text}</Text>
                                    </TouchableOpacity>
                                ))}
                            </>
                        );
                    })()}
                </ScrollView>
            )}

            {sheet === 'output' && (
                <ScrollView contentContainerStyle={styles.sheetBody}>
                    {isRunning ? (
                        <View style={styles.centeredRow}>
                            <ActivityIndicator color={colors.primary} />
                            <Text style={[styles.runningText, { color: colors.primary }]}>Executing...</Text>
                        </View>
                    ) : error ? (
                        <>
                            <Text style={[styles.errLabel, { color: colors.error }]}>ERROR</Text>
                            <Text style={[styles.monoText, { color: colors.error }]}>{error}</Text>
                        </>
                    ) : output ? (
                        <Text style={[styles.monoText, { color: colors.consoleText }]}>{output}</Text>
                    ) : (
                        <Text style={[styles.placeholderText, { color: colors.textMuted }]}>Click ▶ Run to see output here.</Text>
                    )}
                </ScrollView>
            )}

            {sheet === 'result' && (
                <ScrollView contentContainerStyle={styles.sheetBody}>
                    {isRunning ? (
                        <View style={styles.centeredRow}>
                            <ActivityIndicator color={colors.primary} />
                            <Text style={[styles.runningText, { color: colors.primary }]}>Evaluating...</Text>
                        </View>
                    ) : submissionResult ? (
                        <>
                            <View style={[styles.verdictBanner, {
                                backgroundColor: colors.surfaceAlt,
                                borderColor: submissionResult.success ? colors.success : colors.error,
                            }]}>
                                <View style={[styles.verdictDot, { backgroundColor: submissionResult.success ? colors.success : colors.error }]}>
                                    <Text style={styles.verdictIcon}>{submissionResult.success ? '✓' : '✗'}</Text>
                                </View>
                                <Text style={[styles.verdictText, { color: submissionResult.success ? colors.success : colors.error }]}>
                                    {submissionResult.status}
                                </Text>
                            </View>
                            <View style={styles.metricsRow}>
                                <MetricCard label="Runtime" value={`${submissionResult.time_ms ?? 0} ms`} colors={colors} />
                                <MetricCard label="Memory" value={`${submissionResult.memory_kb ? (submissionResult.memory_kb / 1024).toFixed(1) : '0.0'} MB`} colors={colors} />
                            </View>
                            {submissionResult.message ? (
                                <Text style={[styles.monoText, { color: colors.textSecondary, marginTop: 8 }]}>{submissionResult.message}</Text>
                            ) : null}
                        </>
                    ) : (
                        <Text style={[styles.placeholderText, { color: colors.textMuted }]}>Submit your code to see the verdict.</Text>
                    )}
                </ScrollView>
            )}

            {sheet === 'history' && (
                <ScrollView contentContainerStyle={styles.sheetBody}>
                    {history.length > 0 ? history.map((h, i) => (
                        <View key={i} style={[styles.historyRow, { borderBottomColor: colors.borderLight }]}>
                            <View style={[styles.histDot, { backgroundColor: h.success ? colors.success : colors.error }]} />
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.histVerdict, { color: colors.textPrimary }]}>{h.status}</Text>
                                <Text style={[styles.histMeta, { color: colors.textMuted }]}>{h.language} · {h.time_ms ?? 0}ms</Text>
                            </View>
                            <Text style={[styles.histTime, { color: colors.textMuted }]}>{h.date}</Text>
                        </View>
                    )) : (
                        <Text style={[styles.placeholderText, { color: colors.textMuted }]}>No submissions yet.</Text>
                    )}
                </ScrollView>
            )}

            {sheet === 'lang' && (
                <ScrollView contentContainerStyle={styles.sheetBody}>
                    {languages.map(lang => {
                        const isSel = lang.id === selectedLanguage?.id;
                        return (
                            <TouchableOpacity
                                key={lang.id}
                                style={[styles.langRow, {
                                    backgroundColor: isSel ? colors.primary + '18' : 'transparent',
                                    borderBottomColor: colors.borderLight,
                                }]}
                                onPress={() => onLanguageChange(lang)}
                            >
                                <Text style={[styles.langName, { color: isSel ? colors.primary : colors.textPrimary, fontWeight: isSel ? '800' : '500' }]}>
                                    {lang.icon}  {lang.short}
                                </Text>
                                <Text style={[styles.langFull, { color: colors.textMuted }]}>{lang.name}</Text>
                                {isSel && <Text style={{ color: colors.primary }}>✓</Text>}
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            )}

            {sheet === 'question' && (
                <>
                    {/* Problem selector strip */}
                    {problemList && problemList.length > 0 && (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ maxHeight: 46, borderBottomWidth: 1, borderBottomColor: colors.borderLight }}
                            contentContainerStyle={{ paddingHorizontal: 12, gap: 8, alignItems: 'center', paddingVertical: 8 }}
                        >
                            {problemList.map(p => {
                                const isActive = currentProblem && currentProblem.id === p.id;
                                return (
                                    <TouchableOpacity
                                        key={p.id}
                                        onPress={() => onProblemChange && onProblemChange(p.id)}
                                        style={[styles.problemChip, {
                                            backgroundColor: isActive ? colors.primary : colors.surfaceAlt,
                                            borderColor: isActive ? colors.primary : colors.borderLight,
                                        }]}
                                    >
                                        <Text style={[styles.problemChipText, { color: isActive ? '#fff' : colors.textSecondary }]}>
                                            #{p.id} {p.title}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    )}

                    {/* Problem content or skeleton */}
                    {!currentProblem ? (
                        <QuestionPanelSkeleton />
                    ) : (
                        <ScrollView contentContainerStyle={styles.sheetBody}>
                            {/* Title + difficulty */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                <Text style={[styles.qTitle, { color: colors.textPrimary, marginBottom: 0, flex: 1 }]}>
                                    {currentProblem.title}
                                </Text>
                                <View style={[styles.diffBadge, {
                                    backgroundColor:
                                        currentProblem.difficulty === 'hard' ? colors.tagHardBg :
                                        currentProblem.difficulty === 'medium' ? colors.tagMediumBg :
                                        colors.tagEasyBg
                                }]}>
                                    <Text style={[styles.diffBadgeText, {
                                        color:
                                            currentProblem.difficulty === 'hard' ? colors.tagHardText :
                                            currentProblem.difficulty === 'medium' ? colors.tagMediumText :
                                            colors.tagEasyText
                                    }]}>
                                        {currentProblem.difficulty.charAt(0).toUpperCase() + currentProblem.difficulty.slice(1)}
                                    </Text>
                                </View>
                            </View>

                            {/* Description */}
                            <Text style={[styles.qBody, { color: colors.textSecondary }]}>
                                {currentProblem.description}
                            </Text>

                            {/* Examples */}
                            {(() => {
                                let examples = [];
                                try { examples = JSON.parse(currentProblem.examples_json || '[]'); } catch (_) {}
                                return examples.map((ex, idx) => (
                                    <View key={idx}>
                                        <Text style={[styles.fieldLabel, { color: colors.textMuted, marginTop: 16 }]}>
                                            EXAMPLE {idx + 1}
                                        </Text>
                                        <View style={[styles.exampleBox, { backgroundColor: colors.surfaceAlt, borderColor: colors.borderLight }]}>
                                            {ex.input  !== undefined && <Text style={[styles.monoText, { color: colors.textPrimary }]}>Input:  {ex.input}</Text>}
                                            {ex.output !== undefined && <Text style={[styles.monoText, { color: colors.success }]}>Output: {ex.output}</Text>}
                                            {ex.explanation && <Text style={[styles.monoText, { color: colors.textMuted, marginTop: 4 }]}>{ex.explanation}</Text>}
                                        </View>
                                    </View>
                                ));
                            })()}

                            {/* Constraints */}
                            {(() => {
                                let constraints = [];
                                try { constraints = JSON.parse(currentProblem.constraints_json || '[]'); } catch (_) {}
                                if (!constraints.length) return null;
                                return (
                                    <>
                                        <Text style={[styles.fieldLabel, { color: colors.textMuted, marginTop: 16 }]}>CONSTRAINTS</Text>
                                        {constraints.map((c, i) => (
                                            <Text key={i} style={[styles.monoText, { color: colors.textSecondary, marginTop: 4 }]}>• {c}</Text>
                                        ))}
                                    </>
                                );
                            })()}
                        </ScrollView>
                    )}
                </>
            )}
        </View>
    );
}

function MetricCard({ label, value, colors }) {
    return (
        <View style={[styles.metricCard, { backgroundColor: colors.surfaceAlt, borderColor: colors.borderLight }]}>
            <Text style={[styles.metricLabel, { color: colors.textMuted }]}>{label}</Text>
            <Text style={[styles.metricValue, { color: colors.textPrimary }]}>{value}</Text>
        </View>
    );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    sheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopWidth: 1,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
    },
    sheetHandle: {
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    handle: {
        width: 48,
        height: 4,
        borderRadius: 2,
    },
    sheetTitle: {
        fontSize: 14,
        fontWeight: '800',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    sheetBody: {
        padding: 20,
        paddingBottom: 60,
    },

    // Toolbar
    toolbar: {
        borderTopWidth: 1,
        paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 6,
    },
    iconBtn: {
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        marginHorizontal: 2,
        minWidth: 48,
        position: 'relative',
        transition: 'all 0.2s',
    },
    iconEmoji: {
        fontSize: 18,
        transition: 'transform 0.2s',
    },
    iconLabel: {
        fontSize: 10,
        fontWeight: '600',
        marginTop: 2,
        transition: 'all 0.2s',
    },
    activeIndicator: {
        position: 'absolute',
        top: 2,
        right: 4,
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    actionBtns: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingTop: 2,
        paddingBottom: 6,
        gap: 10,
    },
    runBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.15s',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        })
    },
    runBtnText: {
        fontSize: 14,
        fontWeight: '800',
    },
    submitBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.15s',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        })
    },
    submitBtnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '800',
    },

    // Sheet internals
    centeredRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 20,
    },
    runningText: {
        fontFamily: 'monospace',
        fontSize: 13,
    },
    monoText: {
        fontFamily: 'monospace',
        fontSize: 13,
        lineHeight: 21,
    },
    errLabel: {
        fontFamily: 'monospace',
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 1.5,
        marginBottom: 6,
    },
    placeholderText: {
        fontFamily: 'monospace',
        fontSize: 12,
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 20,
    },
    fieldLabel: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.2,
        marginBottom: 8,
    },
    inputArea: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        fontFamily: 'monospace',
        fontSize: 13,
        minHeight: 80,
        textAlignVertical: 'top',
    },
    sampleCard: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
    },
    sampleCardLabel: {
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 0.8,
        marginBottom: 4,
    },
    sampleCardValue: {
        fontFamily: 'monospace',
        fontSize: 13,
    },
    // Result
    verdictBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        borderWidth: 1.5,
        borderRadius: 14,
        padding: 16,
        marginBottom: 16,
    },
    verdictDot: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
    },
    verdictIcon: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '900',
    },
    verdictText: {
        fontSize: 22,
        fontWeight: '900',
    },
    metricsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    metricCard: {
        flex: 1,
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        gap: 6,
    },
    metricLabel: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    metricValue: {
        fontSize: 18,
        fontWeight: '900',
    },
    // History
    historyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        gap: 12,
    },
    histDot: {
        width: 9,
        height: 9,
        borderRadius: 4.5,
    },
    histVerdict: {
        fontSize: 14,
        fontWeight: '700',
    },
    histMeta: {
        fontSize: 11,
        marginTop: 2,
    },
    histTime: {
        fontSize: 11,
    },
    // Language
    langRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        gap: 12,
    },
    langName: {
        fontSize: 15,
        flex: 1,
    },
    langFull: {
        fontSize: 11,
    },
    // Question
    qTitle: {
        fontSize: 22,
        fontWeight: '900',
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    qBody: {
        fontSize: 14,
        lineHeight: 22,
    },
    exampleBox: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        gap: 4,
    },
    // Problem chips (horizontal scroll strip)
    problemChip: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        borderWidth: 1,
    },
    problemChipText: {
        fontSize: 11,
        fontWeight: '600',
    },
    // Difficulty badge inside sheet
    diffBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    diffBadgeText: {
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
});
