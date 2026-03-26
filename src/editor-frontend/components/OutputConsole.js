import React from 'react';
import { StyleSheet, View, Text, ScrollView, useWindowDimensions } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export const OutputConsole = ({ output, error, isRunning }) => {
    const { colors } = useTheme();
    const { width } = useWindowDimensions();
    const isMobile = width < 600;

    return (
        <View style={[styles.container, { backgroundColor: colors.consoleBg }]}>
            {/* Terminal header bar */}
            <View style={[styles.terminalHeader, { backgroundColor: colors.terminalHeader, borderBottomColor: colors.borderLight }]}>
                <View style={styles.terminalDots}>
                    <View style={[styles.dot, { backgroundColor: colors.error }]} />
                    <View style={[styles.dot, { backgroundColor: colors.warning }]} />
                    <View style={[styles.dot, { backgroundColor: colors.success }]} />
                </View>
                <Text style={[styles.terminalTitle, { color: colors.textMuted }]}>
                    {isRunning ? '⟳ Running...' : error ? '✕ Error' : output ? '✓ Output' : 'Terminal'}
                </Text>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={{ padding: isMobile ? 10 : 14 }}
            >
                {isRunning ? (
                    <View style={styles.runningContainer}>
                        <Text style={[styles.runningDot, { color: colors.primaryCTA }]}>●</Text>
                        <Text style={[styles.runningText, { color: colors.primaryCTA }]}>
                            Executing code...
                        </Text>
                    </View>
                ) : error ? (
                    <View>
                        <Text style={[styles.errorLabel, { color: colors.error }]}>ERROR</Text>
                        <Text style={[styles.outputText, { color: colors.error, fontSize: isMobile ? 12 : 13 }]}>{error}</Text>
                    </View>
                ) : output ? (
                    <View>
                        <Text style={[styles.promptSymbol, { color: colors.success }]}>{'> '}<Text style={[styles.outputText, { color: colors.consoleText }]}>{output}</Text></Text>
                    </View>
                ) : (
                    <Text style={[styles.placeholderText, { color: colors.textMuted }]}>
                        Click "▶ Run" to execute your code...
                    </Text>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    terminalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        gap: 10,
    },
    terminalDots: {
        flexDirection: 'row',
        gap: 5,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    terminalTitle: {
        fontSize: 11,
        fontWeight: '600',
        fontFamily: 'monospace',
        letterSpacing: 0.5,
    },
    content: {
        flex: 1,
    },
    runningContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    runningDot: {
        fontSize: 10,
    },
    runningText: {
        fontFamily: 'monospace',
        fontSize: 13,
        fontWeight: '500',
    },
    errorLabel: {
        fontFamily: 'monospace',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
        marginBottom: 6,
        textTransform: 'uppercase',
    },
    outputText: {
        fontFamily: 'monospace',
        fontSize: 13,
        lineHeight: 20,
    },
    promptSymbol: {
        fontFamily: 'monospace',
        fontSize: 13,
        fontWeight: '700',
    },
    placeholderText: {
        fontFamily: 'monospace',
        fontSize: 12,
        fontStyle: 'italic',
    },
});
