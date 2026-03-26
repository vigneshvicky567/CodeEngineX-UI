import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, Text, useWindowDimensions, LayoutAnimation, Platform, UIManager } from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}
import { TopBar } from './../components/TopBar';
import { QuestionPanel } from './../components/QuestionPanel';
import { CodeEditor } from './../components/CodeEditor';
import { BottomPanel } from './../components/BottomPanel';
import { MobileBottomBar } from './../components/MobileBottomBar';
import { QuestionPanelSkeleton } from './../components/SkeletonLoader';
import { useTheme } from '../theme/ThemeContext';
import { executeCode, submitSolution, fetchProblems, fetchProblem } from '../services/judge0';

// Language catalogue — only ids/names here; code templates come from the backend
const LANGUAGES = [
    { id: 71, name: 'Python 3.8.1', short: 'Python', icon: '🐍', langKey: 'python' },
    { id: 50, name: 'C (GCC 9.2.0)',  short: 'C',      icon: '🔧', langKey: 'c'      },
    { id: 54, name: 'C++ (GCC 9.2.0)',short: 'C++',    icon: '⚙️', langKey: 'cpp'    },
    { id: 62, name: 'Java (OpenJDK 13)', short: 'Java', icon: '☕', langKey: 'java'  },
];

const FALLBACK_CODE = '// Select a language to load the code template.\n';

export const CodeEditorScreen = () => {
    const { colors, isDark, toggleTheme } = useTheme();
    const { width, height } = useWindowDimensions();

    const isMobile = width < 600;
    const isTablet = width >= 600 && width < 1024;
    const isLandscape = width > height;

    // ── Dynamic problem state ────────────────────────────────────────────────
    const [problemList, setProblemList]       = useState([]);   // [{id, slug, title, difficulty}]
    const [currentProblem, setCurrentProblem] = useState(null); // full ProblemOut object
    const [problemLoading, setProblemLoading] = useState(true);
    const [problemError, setProblemError]     = useState(null);

    // ── Editor state ─────────────────────────────────────────────────────────
    const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
    const selectedLanguageRef = useRef(LANGUAGES[0]); // always current, never causes re-render
    const [code, setCode]                         = useState(FALLBACK_CODE);
    const [isQuestionVisible, setIsQuestionVisible] = useState(!isMobile);

    const [output, setOutput]               = useState('');
    const [error, setError]                 = useState(null);
    const [isRunning, setIsRunning]         = useState(false);
    const [customInput, setCustomInput]     = useState('');
    const [submissionResult, setSubmissionResult] = useState(null);
    const [history, setHistory]             = useState([]);
    const [activeTab, setActiveTab]         = useState('Testcases');
    const [pendingSheet, setPendingSheet]   = useState(null);

    // ── Helpers ──────────────────────────────────────────────────────────────
    /** Pull the code template for the current language from the loaded problem. */
    const getTemplateForLang = useCallback((problem, langKey) => {
        if (!problem) return FALLBACK_CODE;
        try {
            const templates = JSON.parse(problem.code_templates_json || '{}');
            return templates[langKey] || FALLBACK_CODE;
        } catch {
            return FALLBACK_CODE;
        }
    }, []);

    /** Get the first visible testcase's stdin as the default custom-input value. */
    const getDefaultInput = useCallback((problem) => {
        if (!problem) return '';
        // Use the first non-hidden testcase's input_text (actual stdin format)
        const visibleTc = (problem.testcases || []).find(tc => !tc.is_hidden && tc.input_text);
        if (visibleTc) return visibleTc.input_text;
        // Fallback: nothing — leave blank so user knows to type their own
        return '';
    }, []);

    // ── Load a single full problem ────────────────────────────────────────────
    const loadProblem = useCallback(async (problemId) => {
        setProblemLoading(true);
        setProblemError(null);
        setOutput('');
        setError(null);
        setSubmissionResult(null);
        try {
            const full = await fetchProblem(problemId);
            setCurrentProblem(full);
            const template = getTemplateForLang(full, selectedLanguageRef.current.langKey);
            setCode(template);
            setCustomInput(getDefaultInput(full));
        } catch (e) {
            setProblemError(e.message);
        } finally {
            setProblemLoading(false);
        }
    }, [getTemplateForLang, getDefaultInput]);

    // ── Load problem list on mount ────────────────────────────────────────────
    useEffect(() => {
        fetchProblems()
            .then(list => {
                setProblemList(list);
                // auto-load the first problem
                if (list.length > 0) return loadProblem(list[0].id);
            })
            .catch(e => {
                setProblemError(e.message);
                setProblemLoading(false);
            });
    }, [loadProblem]);

    // ── Language change ──────────────────────────────────────────────────────
    const handleLanguageChange = useCallback((selectedLang) => {
        const fullLang = LANGUAGES.find(l => l.id === selectedLang.id) || LANGUAGES[0];
        selectedLanguageRef.current = fullLang;   // keep ref in sync
        setSelectedLanguage(fullLang);
        setCode(getTemplateForLang(currentProblem, fullLang.langKey));
        setOutput('');
        setError(null);
        setSubmissionResult(null);
    }, [currentProblem, getTemplateForLang]);

    // ── Problem selector change ──────────────────────────────────────────────
    const handleProblemChange = useCallback((problemId) => {
        loadProblem(problemId);
    }, [loadProblem]);

    const handleRun = async () => {
        if (!isMobile) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setActiveTab('Output');
        }
        setIsRunning(true);
        setError(null);
        setOutput('');

        try {
            const result = await executeCode(code, selectedLanguage.id, customInput);
            if (result.compile_output) {
                setError(result.compile_output);
            } else if (result.stderr) {
                setError(result.stderr);
            } else if (result.status.id === 5) {
                setError('Error: Time Limit Exceeded');
            } else {
                setOutput(result.stdout || 'Program exited with no output.');
            }
        } catch (e) {
            setError(e.message || 'Failed to connect to execution server.');
        } finally {
            setIsRunning(false);
            if (isMobile) setPendingSheet('output');
        }
    };

    const handleSubmit = async () => {
        if (!currentProblem) return;
        if (!isMobile) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setActiveTab('Result');
        }
        setIsRunning(true);
        setSubmissionResult(null);

        try {
            const result = await submitSolution(code, selectedLanguage.id, currentProblem.id);
            if (!isMobile) LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setSubmissionResult(result);

            setHistory(prev => [{
                status: result.status,
                success: result.success,
                time_ms: result.time_ms,
                language: selectedLanguage.name,
                date: new Date().toLocaleTimeString()
            }, ...prev]);

        } catch (e) {
            setSubmissionResult({
                success: false,
                status: 'Internal Error',
                time_ms: 0,
                memory_kb: 0,
                message: e.message || 'Failed to connect to evaluation server.',
            });
        } finally {
            setIsRunning(false);
            if (isMobile) setPendingSheet('result');
        }
    };

    const toggleQuestion = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsQuestionVisible(!isQuestionVisible);
    };

    const animateTabs = (tab) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setActiveTab(tab);
    };

    // ── Skeleton loading — full app shell with shimmer in place of the question panel ──
    if (problemLoading && !currentProblem) {
        const isVerticalLayout = isTablet && !isLandscape;
        const questionFlex = isTablet ? 0.8 : 1;
        const workAreaFlex = isTablet ? 1.2 : 1.5;

        if (isMobile) {
            return (
                <View style={[styles.container, { backgroundColor: colors.background }]}>
                    {/* Mobile top bar skeleton */}
                    <View style={[styles.mobileTopBar, { backgroundColor: colors.topBarBg, borderBottomColor: colors.topBarBorder }]}>
                        <View style={styles.mobileLeftSection}>
                            <View style={[styles.mobileLogoBadge, { backgroundColor: colors.primary }]}>
                                <Text style={styles.mobileLogoIcon}>⟨/⟩</Text>
                            </View>
                            <View style={styles.mobileTitleContainer}>
                                <Text style={[styles.mobileTopBarTitle, { color: colors.textPrimary }]}>CodeLab</Text>
                                <Text style={[styles.mobileTopBarSubtitle, { color: colors.textMuted }]}>Loading…</Text>
                            </View>
                        </View>
                    </View>
                    {/* Editor area — empty */}
                    <View style={{ flex: 1, backgroundColor: colors.editorBg }} />
                    {/* Bottom bar placeholder */}
                    <View style={{ height: 56, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.borderLight }} />
                </View>
            );
        }

        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                {/* TopBar skeleton — full bar with logo & disabled controls */}
                <View style={[{
                    height: 60,
                    backgroundColor: colors.topBarBg,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.topBarBorder,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    gap: 12,
                }]}>
                    <View style={[styles.mobileLogoBadge, { backgroundColor: colors.primary }]}>
                        <Text style={styles.mobileLogoIcon}>⟨/⟩</Text>
                    </View>
                    <Text style={[{ fontSize: 16, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 }]}>CodeLab</Text>
                    <Text style={[{ fontSize: 12, color: colors.textMuted }]}>  —  Loading problems…</Text>
                </View>

                <View style={[styles.mainContent, { flexDirection: isVerticalLayout ? 'column' : 'row' }]}>
                    {/* Question panel area → full skeleton */}
                    <View style={[{
                        flex: isVerticalLayout ? 0.8 : questionFlex,
                        borderRightWidth: isVerticalLayout ? 0 : 1,
                        borderBottomWidth: isVerticalLayout ? 1 : 0,
                        borderRightColor: colors.borderLight,
                        borderBottomColor: colors.borderLight,
                    }]}>
                        <QuestionPanelSkeleton />
                    </View>

                    {/* Editor + bottom panel area */}
                    <View style={{ flex: isVerticalLayout ? 1 : workAreaFlex, flexDirection: 'column' }}>
                        <View style={{ flex: 2, backgroundColor: colors.editorBg }} />
                        <View style={{ flex: 1, borderTopWidth: 1, borderTopColor: colors.borderDark, backgroundColor: colors.surface }} />
                    </View>
                </View>
            </View>
        );
    }

    if (problemError && !currentProblem) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: 32 }]}>
                <Text style={{ color: colors.error || '#EF4444', fontSize: 16, fontWeight: '700', marginBottom: 8 }}>⚠️ Could not load problems</Text>
                <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>{problemError}</Text>
                <Text style={{ color: colors.textMuted, marginTop: 12, fontSize: 12 }}>Make sure the backend is running at http://localhost:8000</Text>
            </View>
        );
    }

    // ── MOBILE layout ─────────────────────────────────────────────────────────
    if (isMobile) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                {/* Enhanced mobile top bar */}
                <View style={[styles.mobileTopBar, {
                    backgroundColor: colors.topBarBg,
                    borderBottomColor: colors.topBarBorder,
                    ...Platform.select({
                        ios: {
                            shadowColor: colors.shadowMd,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                        },
                        android: {
                            elevation: 4,
                        },
                    })
                }]}>
                    <View style={styles.mobileLeftSection}>
                        <View style={[styles.mobileLogoBadge, { backgroundColor: colors.primary }]}>
                            <Text style={styles.mobileLogoIcon}>⟨/⟩</Text>
                        </View>
                        <View style={styles.mobileTitleContainer}>
                            <Text style={[styles.mobileTopBarTitle, { color: colors.textPrimary }]}>
                                CodeLab
                            </Text>
                            <Text style={[styles.mobileTopBarSubtitle, { color: colors.textMuted }]}>
                                Problem Solving
                            </Text>
                        </View>
                    </View>
                    <View style={styles.mobileRightSection}>
                        <View style={[styles.mobileFileBadge, { backgroundColor: colors.surfaceAlt }]}>
                            <Text style={[styles.mobileFileIcon, { color: colors.textMuted }]}>
                                {selectedLanguage.icon}
                            </Text>
                            <Text style={[styles.mobileFileName, { color: colors.textPrimary }]}>
                                solution.{selectedLanguage.short === 'Python' ? 'py' : selectedLanguage.short === 'Java' ? 'java' : selectedLanguage.short === 'C++' ? 'cpp' : 'c'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Full-screen Monaco Editor */}
                <View style={{ flex: 1 }}>
                    <CodeEditor code={code} setCode={setCode} languageId={selectedLanguage.id} />
                </View>

                {/* Mobile bottom toolbar + slide-up sheets */}
                <MobileBottomBar
                    output={output}
                    error={error}
                    isRunning={isRunning}
                    customInput={customInput}
                    setCustomInput={setCustomInput}
                    submissionResult={submissionResult}
                    history={history}
                    selectedLanguage={selectedLanguage}
                    languages={LANGUAGES}
                    onLanguageChange={handleLanguageChange}
                    isQuestionVisible={isQuestionVisible}
                    onToggleQuestion={toggleQuestion}
                    onRun={handleRun}
                    onSubmit={handleSubmit}
                    toggleTheme={toggleTheme}
                    isDark={isDark}
                    autoOpenSheet={pendingSheet}
                    onSheetOpened={() => setPendingSheet(null)}
                    currentProblem={currentProblem}
                    problemList={problemList}
                    onProblemChange={handleProblemChange}
                />
            </View>
        );
    }

    // ── TABLET / DESKTOP layout ───────────────────────────────────────────────
    const isVerticalLayout = isTablet && !isLandscape;
    const questionFlex = isTablet ? 0.8 : 1;
    const workAreaFlex = isTablet ? 1.2 : 1.5;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <TopBar
                selectedLanguageItem={selectedLanguage}
                setSelectedLanguageItem={handleLanguageChange}
                onRun={handleRun}
                onSubmit={handleSubmit}
                onToggleQuestion={toggleQuestion}
                isQuestionVisible={isQuestionVisible}
                problemList={problemList}
                currentProblem={currentProblem}
                onProblemChange={handleProblemChange}
            />

            <View style={[styles.mainContent, {
                flexDirection: isVerticalLayout ? 'column' : 'row',
            }]}>
                {isQuestionVisible && (
                    <View style={[{
                        flex: isVerticalLayout ? 0.8 : questionFlex,
                        borderRightWidth: isVerticalLayout ? 0 : 1,
                        borderBottomWidth: isVerticalLayout ? 1 : 0,
                        borderRightColor: colors.borderLight,
                        borderBottomColor: colors.borderLight,
                    }]}>
                        <QuestionPanel problem={currentProblem} isLoading={problemLoading} />
                    </View>
                )}

                <View style={{ flex: isVerticalLayout ? 1 : workAreaFlex, flexDirection: 'column' }}>
                    <View style={{ flex: 2 }}>
                        <CodeEditor code={code} setCode={setCode} languageId={selectedLanguage.id} />
                    </View>
                    <View style={{ flex: 1, borderTopWidth: 1, borderTopColor: colors.borderDark }}>
                        <BottomPanel
                            output={output}
                            error={error}
                            isRunning={isRunning}
                            customInput={customInput}
                            setCustomInput={setCustomInput}
                            submissionResult={submissionResult}
                            activeTab={activeTab}
                            setActiveTab={animateTabs}
                            history={history}
                            currentProblem={currentProblem}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainContent: {
        flex: 1,
    },
    // Mobile top bar
    mobileTopBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    mobileLeftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    mobileLogoBadge: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        })
    },
    mobileLogoIcon: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '900',
    },
    mobileTitleContainer: {
        gap: 2,
    },
    mobileTopBarTitle: {
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: -0.4,
    },
    mobileTopBarSubtitle: {
        fontSize: 11,
        fontWeight: '500',
        letterSpacing: 0.3,
    },
    mobileRightSection: {
        alignItems: 'center',
    },
    mobileFileBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        gap: 6,
    },
    mobileFileIcon: {
        fontSize: 14,
    },
    mobileFileName: {
        fontSize: 12,
        fontFamily: 'monospace',
        fontWeight: '600',
    },
});
