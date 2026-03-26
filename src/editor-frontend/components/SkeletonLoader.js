/**
 * SkeletonLoader — LeetCode-style shimmer placeholders.
 *
 * Usage:
 *   <SkeletonBlock width="60%" height={16} />
 *   <SkeletonBlock width="100%" height={80} radius={8} />
 *
 * The shimmer animation slides a bright gradient across the block,
 * matching the current theme (light = light grey sweep, dark = slate sweep).
 */
import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

// ---------------------------------------------------------------------------
// Single animated shimmer block
// ---------------------------------------------------------------------------
export const SkeletonBlock = ({ width = '100%', height = 16, radius = 6, style }) => {
    const { colors, isDark } = useTheme();
    const shimmer = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(shimmer, {
                    toValue: 1,
                    duration: 1100,
                    useNativeDriver: false,  // must be false for backgroundColor interpolation
                }),
                Animated.timing(shimmer, {
                    toValue: 0,
                    duration: 1100,
                    useNativeDriver: false,
                }),
            ])
        );
        loop.start();
        return () => loop.stop();
    }, [shimmer]);

    // Two-tone shimmer: base → highlight → base
    const base      = isDark ? '#1E293B' : '#E5E7EB';
    const highlight = isDark ? '#334155' : '#F3F4F6';

    const animatedBg = shimmer.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [base, highlight, base],
    });

    return (
        <Animated.View
            style={[
                {
                    width,
                    height,
                    borderRadius: radius,
                    backgroundColor: animatedBg,
                    overflow: 'hidden',
                },
                style,
            ]}
        />
    );
};

// ---------------------------------------------------------------------------
// Full QuestionPanel skeleton — mirrors the real panel layout exactly
// ---------------------------------------------------------------------------
export const QuestionPanelSkeleton = () => {
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
            {/* Header row: "Problem N"  + difficulty badge */}
            <View style={styles.headerRow}>
                <SkeletonBlock width={80} height={13} radius={4} />
                <SkeletonBlock width={48} height={22} radius={6} />
            </View>

            {/* Title */}
            <SkeletonBlock width="55%" height={28} radius={6} style={{ marginBottom: 6 }} />

            {/* Sub-title line (shorter) */}
            <SkeletonBlock width="35%" height={18} radius={5} style={{ marginBottom: 28 }} />

            {/* Description paragraph — 4 lines */}
            <SkeletonBlock width="100%" height={15} radius={4} style={{ marginBottom: 10 }} />
            <SkeletonBlock width="96%"  height={15} radius={4} style={{ marginBottom: 10 }} />
            <SkeletonBlock width="100%" height={15} radius={4} style={{ marginBottom: 10 }} />
            <SkeletonBlock width="72%"  height={15} radius={4} style={{ marginBottom: 32 }} />

            {/* "Examples" section heading */}
            <View style={styles.sectionHeader}>
                <SkeletonBlock width={90} height={18} radius={5} />
                <View style={{ flex: 1, height: 1, backgroundColor: colors.borderLight, marginLeft: 12 }} />
            </View>

            {/* Example card 1 */}
            <View style={[styles.exampleCard, { backgroundColor: colors.surfaceAlt, borderColor: colors.borderLight }]}>
                <SkeletonBlock width="80%" height={13} radius={4} style={{ marginBottom: 8 }} />
                <SkeletonBlock width="55%" height={13} radius={4} style={{ marginBottom: 8 }} />
                <SkeletonBlock width="90%" height={13} radius={4} />
            </View>

            {/* Example card 2 */}
            <View style={[styles.exampleCard, { backgroundColor: colors.surfaceAlt, borderColor: colors.borderLight }]}>
                <SkeletonBlock width="70%" height={13} radius={4} style={{ marginBottom: 8 }} />
                <SkeletonBlock width="45%" height={13} radius={4} />
            </View>

            {/* "Constraints" section heading */}
            <View style={styles.sectionHeader}>
                <SkeletonBlock width={110} height={18} radius={5} />
                <View style={{ flex: 1, height: 1, backgroundColor: colors.borderLight, marginLeft: 12 }} />
            </View>

            {/* Constraint lines */}
            {[72, 88, 80, 60].map((w, i) => (
                <View key={i} style={styles.constraintRow}>
                    <View style={[styles.dot, { backgroundColor: colors.borderMedium }]} />
                    <SkeletonBlock width={`${w}%`} height={13} radius={4} />
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 8,
    },
    exampleCard: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    constraintRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
    },
    dot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
    },
});
