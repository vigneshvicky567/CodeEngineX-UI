import React from 'react';
import { StyleSheet, View, Text, ScrollView, useWindowDimensions, Platform } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { QuestionPanelSkeleton } from './SkeletonLoader';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const DIFF_COLORS = {
    easy:   { bg: 'tagEasyBg',   text: 'tagEasyText'   },
    medium: { bg: 'tagMediumBg', text: 'tagMediumText' },
    hard:   { bg: 'tagHardBg',   text: 'tagHardText'   },
};

function diffStyle(difficulty, colors) {
    const key = (difficulty || 'easy').toLowerCase();
    const d = DIFF_COLORS[key] || DIFF_COLORS.easy;
    return { bg: colors[d.bg], text: colors[d.text] };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export const QuestionPanel = ({ problem, isLoading }) => {
    const { colors } = useTheme();
    const { width } = useWindowDimensions();
    const isMobile = width < 600;

    // ── Skeleton while loading ───────────────────────────────────────────────
    if (isLoading || !problem) {
        return <QuestionPanelSkeleton />;
    }

    // ── Parse JSON fields ────────────────────────────────────────────────────
    let examples = [];
    let constraints = [];
    try { examples    = JSON.parse(problem.examples_json    || '[]'); } catch (_) {}
    try { constraints = JSON.parse(problem.constraints_json || '[]'); } catch (_) {}

    const diff = diffStyle(problem.difficulty, colors);

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.surface }]}
            contentContainerStyle={{ padding: isMobile ? 16 : 24 }}
            showsVerticalScrollIndicator={false}
        >
            {/* Header / Problem Meta */}
            <View style={styles.headerRow}>
                <Text style={[styles.questionNumber, { color: colors.textMuted }]}>Problem #{problem.id}</Text>
                <View style={[styles.difficultyBadge, { backgroundColor: diff.bg }]}>
                    <Text style={[styles.difficultyText, { color: diff.text }]}>
                        {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                    </Text>
                </View>
            </View>

            <Text style={[styles.title, {
                color: colors.textPrimary,
                fontSize: isMobile ? 22 : 28,
            }]}>
                {problem.title}
            </Text>

            {/* Description Section */}
            <View style={styles.contentSection}>
                <Text style={[styles.description, {
                    color: colors.textSecondary,
                    fontSize: isMobile ? 14 : 16,
                    lineHeight: isMobile ? 22 : 26,
                }]}>
                    {problem.description}
                </Text>
            </View>

            {/* Examples Section */}
            {examples.length > 0 && (
                <>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Examples</Text>
                        <View style={[styles.sectionDivider, { backgroundColor: colors.borderLight }]} />
                    </View>

                    {examples.map((ex, idx) => (
                        <View key={idx} style={styles.exampleContainer}>
                            <Text style={[styles.exampleHeading, { color: colors.textPrimary }]}>Example {idx + 1}</Text>
                            <View style={[styles.exampleCard, {
                                backgroundColor: colors.surfaceAlt,
                                borderColor: colors.borderLight,
                                ...Platform.select({ web: { boxShadow: colors.shadowSm } })
                            }]}>
                                {ex.input !== undefined && (
                                    <View style={styles.exampleRow}>
                                        <Text style={[styles.exampleLabel, { color: colors.textMuted }]}>Input:</Text>
                                        <Text style={[styles.exampleValue, { color: colors.textPrimary }]}>{ex.input}</Text>
                                    </View>
                                )}
                                {ex.output !== undefined && (
                                    <View style={styles.exampleRow}>
                                        <Text style={[styles.exampleLabel, { color: colors.textMuted }]}>Output:</Text>
                                        <Text style={[styles.exampleValue, { color: colors.success, fontWeight: '700' }]}>{ex.output}</Text>
                                    </View>
                                )}
                                {ex.explanation && (
                                    <View style={[styles.explanationLine, { borderLeftColor: colors.primary }]}>
                                        <Text style={[styles.explanationText, { color: colors.textSecondary }]}>
                                            {ex.explanation}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    ))}
                </>
            )}

            {/* Constraints Section */}
            {constraints.length > 0 && (
                <>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Constraints</Text>
                        <View style={[styles.sectionDivider, { backgroundColor: colors.borderLight }]} />
                    </View>

                    <View style={styles.constraintsWrapper}>
                        {constraints.map((c, i) => (
                            <View key={i} style={styles.constraintItem}>
                                <View style={[styles.constraintDot, { backgroundColor: colors.borderMedium }]} />
                                <Text style={[styles.constraintText, { color: colors.textSecondary }]}>{c}</Text>
                            </View>
                        ))}
                    </View>
                </>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    questionNumber: {
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    difficultyBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    difficultyText: {
        fontSize: 11,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    title: {
        fontWeight: '900',
        letterSpacing: -0.5,
        marginBottom: 20,
    },
    contentSection: {
        marginBottom: 32,
    },
    description: {
        fontWeight: '400',
    },

    /* Section Headers */
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
    },
    sectionDivider: {
        flex: 1,
        height: 1,
    },

    /* Examples */
    exampleContainer: {
        marginBottom: 20,
    },
    exampleHeading: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 10,
    },
    exampleCard: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        gap: 8,
    },
    exampleRow: {
        flexDirection: 'row',
        gap: 12,
    },
    exampleLabel: {
        fontSize: 13,
        fontWeight: '600',
        width: 50,
    },
    exampleValue: {
        fontSize: 14,
        fontFamily: 'monospace',
        flex: 1,
    },
    explanationLine: {
        marginTop: 8,
        paddingLeft: 12,
        borderLeftWidth: 2,
    },
    explanationText: {
        fontSize: 13,
        fontStyle: 'italic',
        lineHeight: 20,
    },

    /* Constraints */
    constraintsWrapper: {
        gap: 12,
        marginBottom: 40,
    },
    constraintItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    constraintDot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
    },
    constraintText: {
        fontSize: 14,
        fontFamily: 'monospace',
    },
});
