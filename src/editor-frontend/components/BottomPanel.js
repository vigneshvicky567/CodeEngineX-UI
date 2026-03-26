import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, useWindowDimensions, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { OutputConsole } from './OutputConsole';

export const BottomPanel = ({
    output,
    error,
    isRunning,
    customInput,
    setCustomInput,
    submissionResult,
    activeTab,
    setActiveTab,
    history,
    currentProblem,
}) => {
    const { isDark, colors } = useTheme();
    const { width } = useWindowDimensions();
    const isMobile = width < 600;

    const tabs = [
        { key: 'Testcases', icon: '🧪' },
        { key: 'Output', icon: '📟' },
        { key: 'Result', icon: '📊' },
        { key: 'History', icon: '📜' },
    ];

    return (
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
            {/* Tabs Header */}
            <View style={[styles.tabHeader, { borderBottomColor: colors.borderLight }]}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
                    {tabs.map(tab => {
                        const isActive = activeTab === tab.key;
                        return (
                            <TouchableOpacity
                                key={tab.key}
                                style={[
                                    styles.tabBtn,
                                    {
                                        paddingHorizontal: isMobile ? 14 : 20,
                                        borderBottomColor: isActive ? colors.primary : 'transparent',
                                    }
                                ]}
                                onPress={() => setActiveTab(tab.key)}
                                activeOpacity={0.7}
                            >
                                <Text style={[
                                    styles.tabText,
                                    {
                                        color: isActive ? colors.primary : colors.textMuted,
                                        fontSize: isMobile ? 13 : 14,
                                        fontWeight: isActive ? '700' : '600',
                                    }
                                ]}>
                                    {tab.key}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Tab Content */}
            <View style={styles.tabContentContainer}>
                {activeTab === 'Testcases' && (
                    <ScrollView
                        style={styles.tabContent}
                        contentContainerStyle={{ padding: isMobile ? 12 : 16 }}
                    >
                        <Text style={[styles.sectionLabel, { color: colors.textPrimary, fontSize: isMobile ? 12 : 13 }]}>
                            Custom Input
                        </Text>
                        <TextInput
                            style={[styles.inputArea, {
                                backgroundColor: colors.surfaceAlt,
                                borderColor: colors.borderLight,
                                color: colors.textPrimary,
                                minHeight: isMobile ? 60 : 80,
                                fontSize: isMobile ? 12 : 13,
                            }]}
                            multiline
                            value={customInput}
                            onChangeText={setCustomInput}
                            placeholder="Type your test input here..."
                            placeholderTextColor={colors.textMuted}
                        />

                        {/* Dynamic Visible Testcases */}
                        {(() => {
                            const visibleCases = (currentProblem?.testcases || []).filter(
                                tc => !tc.is_hidden && tc.input_text
                            );
                            if (visibleCases.length === 0) return null;
                            return (
                                <>
                                    <Text style={[styles.sectionLabel, { color: colors.textPrimary, fontSize: isMobile ? 12 : 13, marginTop: 14 }]}>
                                        Sample Testcases
                                        <Text style={{ color: colors.textMuted, fontWeight: '400' }}> (tap to use as input)</Text>
                                    </Text>
                                    {visibleCases.map((tc, idx) => (
                                        <TouchableOpacity
                                            key={tc.id}
                                            style={[styles.testcaseCard, {
                                                backgroundColor: colors.surfaceAlt,
                                                borderColor: colors.borderLight,
                                            }]}
                                            onPress={() => setCustomInput(tc.input_text)}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={[styles.testcaseLabel, { color: colors.textMuted, marginBottom: 4, fontSize: isMobile ? 11 : 12 }]}>
                                                Case {idx + 1}
                                            </Text>
                                            <Text style={[styles.testcaseValue, { color: colors.textPrimary, fontFamily: 'monospace', fontSize: isMobile ? 12 : 13 }]}>
                                                {tc.input_text}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </>
                            );
                        })()}
                    </ScrollView>
                )}

                {activeTab === 'Output' && (
                    <OutputConsole output={output} error={error} isRunning={isRunning} />
                )}

                {activeTab === 'Result' && (
                    <ScrollView
                        style={styles.tabContent}
                        contentContainerStyle={{ padding: isMobile ? 16 : 24 }}
                    >
                        {isRunning ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="small" color={colors.primary} />
                                <Text style={[styles.loadingText, { color: colors.textMuted }]}>
                                    Evaluating solution...
                                </Text>
                            </View>
                        ) : submissionResult ? (
                            <View>
                                {/* Results Overview */}
                                <View style={[styles.submissionBanner, {
                                    backgroundColor: colors.surfaceAlt,
                                    borderColor: submissionResult.success ? colors.success : colors.error,
                                }]}>
                                    <View style={[styles.statusIndicator, { backgroundColor: submissionResult.success ? colors.success : colors.error }]}>
                                        <Text style={styles.statusIcon}>{submissionResult.success ? '✓' : '✗'}</Text>
                                    </View>
                                    <View style={styles.statusContent}>
                                        <Text style={[styles.statusLabel, { color: colors.textMuted }]}>Verdict</Text>
                                        <Text style={[styles.statusValue, { color: submissionResult.success ? colors.success : colors.error }]}>
                                            {submissionResult.status}
                                        </Text>
                                    </View>
                                </View>

                                {/* Metrics Cards */}
                                <View style={styles.metricsGrid}>
                                    <View style={[styles.metricTile, { backgroundColor: colors.surfaceAlt, borderColor: colors.borderLight }]}>
                                        <Text style={[styles.metricTileLabel, { color: colors.textMuted }]}>Runtime</Text>
                                        <View style={styles.metricTileValueRow}>
                                            <Text style={[styles.metricTileValue, { color: colors.textPrimary }]}>{submissionResult.time_ms ?? 0}</Text>
                                            <Text style={[styles.metricTileUnit, { color: colors.textMuted }]}>ms</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.metricTile, { backgroundColor: colors.surfaceAlt, borderColor: colors.borderLight }]}>
                                        <Text style={[styles.metricTileLabel, { color: colors.textMuted }]}>Memory</Text>
                                        <View style={styles.metricTileValueRow}>
                                            <Text style={[styles.metricTileValue, { color: colors.textPrimary }]}>{submissionResult.memory_kb ? (submissionResult.memory_kb / 1024).toFixed(1) : '0.0'}</Text>
                                            <Text style={[styles.metricTileUnit, { color: colors.textMuted }]}>MB</Text>
                                        </View>
                                    </View>
                                </View>

                                {submissionResult.message && (
                                    <View style={[styles.messageCard, { backgroundColor: colors.surfaceAlt, borderColor: colors.borderLight }]}>
                                        <Text style={[styles.messageHeader, { color: colors.textMuted }]}>Evaluation Detail</Text>
                                        <Text style={[styles.messageText, { color: colors.textSecondary }]}>{submissionResult.message}</Text>
                                    </View>
                                )}
                            </View>
                        ) : (
                            <View style={styles.emptyResults}>
                                <Text style={styles.emptyResultsIcon}>📊</Text>
                                <Text style={[styles.emptyResultsText, { color: colors.textMuted }]}>Run a test to see results</Text>
                            </View>
                        )}
                    </ScrollView>
                )}

                {activeTab === 'History' && (
                    <ScrollView
                        style={styles.tabContent}
                        contentContainerStyle={{ padding: isMobile ? 12 : 16 }}
                    >
                        {history.length > 0 ? (
                            history.map((h, i) => (
                                <View key={i} style={[styles.historyItem, {
                                    backgroundColor: colors.surface,
                                    borderBottomColor: colors.borderLight,
                                }]}>
                                    <View style={[styles.historyStatusDot, { backgroundColor: h.success ? colors.success : colors.error }]} />
                                    <View style={styles.historyMain}>
                                        <Text style={[styles.historyVerdict, { color: colors.textPrimary }]}>{h.status}</Text>
                                        <Text style={[styles.historyDetails, { color: colors.textMuted }]}>
                                            {h.language} • {h.time_ms ?? 0}ms
                                        </Text>
                                    </View>
                                    <Text style={[styles.historyTime, { color: colors.textMuted }]}>{h.date}</Text>
                                </View>
                            ))
                        ) : (
                            <View style={styles.emptyHistory}>
                                <Text style={[styles.emptyHistoryText, { color: colors.textMuted }]}>No submission history found</Text>
                            </View>
                        )}
                    </ScrollView>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabHeader: {
        borderBottomWidth: 1,
        paddingHorizontal: 12,
    },
    tabScroll: {
        flexDirection: 'row',
    },
    tabBtn: {
        paddingVertical: 14,
        marginHorizontal: 8,
        borderBottomWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabText: {
        letterSpacing: 0.3,
    },
    tabContentContainer: {
        flex: 1,
    },
    tabContent: {
        flex: 1,
    },

    /* Section Label & Inputs */
    sectionLabel: {
        fontSize: 12,
        fontWeight: '800',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    inputArea: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        fontFamily: 'monospace',
        textAlignVertical: 'top',
    },

    /* Testcase cards */
    testcaseCard: {
        borderWidth: 1,
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 4,
    },
    testcaseRow: {
        flexDirection: 'row',
        padding: 14,
        alignItems: 'center',
    },
    testcaseLabel: {
        width: 80,
        fontSize: 13,
        fontWeight: '700',
    },
    testcaseValue: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'monospace',
    },
    testcaseDivider: {
        height: 1,
    },

    /* Submission Result Styling */
    submissionBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        gap: 16,
    },
    statusIndicator: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusIcon: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '900',
    },
    statusContent: {
        gap: 4,
    },
    statusLabel: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    statusValue: {
        fontSize: 20,
        fontWeight: '900',
    },

    /* Metrics Grid */
    metricsGrid: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 20,
    },
    metricTile: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        gap: 8,
    },
    metricTileLabel: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    metricTileValueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    metricTileValue: {
        fontSize: 24,
        fontWeight: '900',
    },
    metricTileUnit: {
        fontSize: 13,
        fontWeight: '600',
    },

    /* Message Cards */
    messageCard: {
        borderWidth: 1,
        borderRadius: 16,
        padding: 16,
        gap: 8,
    },
    messageHeader: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    messageText: {
        fontSize: 14,
        fontFamily: 'monospace',
        lineHeight: 22,
    },

    /* Empty States */
    emptyResults: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        gap: 12,
    },
    emptyResultsIcon: {
        fontSize: 40,
    },
    emptyResultsText: {
        fontSize: 14,
        fontWeight: '600',
    },

    /* History Styling */
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        gap: 16,
    },
    historyStatusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    historyMain: {
        flex: 1,
        gap: 4,
    },
    historyVerdict: {
        fontSize: 15,
        fontWeight: '700',
    },
    historyDetails: {
        fontSize: 12,
    },
    historyTime: {
        fontSize: 11,
        fontWeight: '500',
    },
    emptyHistory: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    emptyHistoryText: {
        fontSize: 13,
        fontStyle: 'italic',
    },
});
