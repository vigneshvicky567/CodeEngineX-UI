import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Platform, ActivityIndicator, Text, Animated } from 'react-native';
import { WebView } from 'react-native-webview';

const HTML_CONTENT = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <style>
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background-color: #0f172a; }
        #monaco-editor { width: 100%; height: 100%; }
        /* Light mode overrides */
        body.light-mode { background-color: #ffffff; }
    </style>
    <!-- Use specific version 0.38.0 which is stable and widely supported -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js"></script>
    <script>
        require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.38.0/min/vs' }});
        require(['vs/editor/editor.main'], function() {
            monaco.editor.defineTheme('custom-dark', {
                base: 'vs-dark',
                inherit: true,
                rules: [
                    { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
                    { token: 'keyword', foreground: '38bdf8' },
                    { token: 'string', foreground: 'a3e635' },
                    { token: 'number', foreground: 'f472b6' },
                    { token: 'type', foreground: 'facc15' },
                ],
                colors: {
                    'editor.background': '#0f172a',
                    'editor.foreground': '#f8fafc',
                    'editorLineNumber.foreground': '#475569',
                    'editorCursor.foreground': '#38bdf8',
                    'editor.selectionBackground': '#38bdf830',
                    'editor.lineHighlightBackground': '#1e293b30',
                    'editorIndentGuide.background': '#1e293b',
                    'editorIndentGuide.activeBackground': '#334155',
                    'scrollbarSlider.background': '#334155',
                    'scrollbarSlider.hoverBackground': '#475569',
                }
            });

            monaco.editor.defineTheme('custom-light', {
                base: 'vs',
                inherit: true,
                rules: [
                    { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
                    { token: 'keyword', foreground: 'AF00DB' },
                    { token: 'string', foreground: 'A31515' },
                    { token: 'number', foreground: '098658' },
                    { token: 'type', foreground: '267F99' },
                ],
                colors: {
                    'editor.background': '#FFFFFF',
                    'editor.foreground': '#1e293b',
                    'editorLineNumber.foreground': '#cbd5e1',
                    'editorCursor.foreground': '#3c2cda',
                    'editor.selectionBackground': '#3c2cda20',
                    'editor.lineHighlightBackground': '#f8fafc',
                    'editorIndentGuide.background': '#f1f5f9',
                    'editorIndentGuide.activeBackground': '#cbd5e1',
                }
            });

            var editor = monaco.editor.create(document.getElementById('monaco-editor'), {
                value: '',
                language: 'javascript',
                theme: 'custom-light',
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
                fontLigatures: true,
                lineNumbers: 'on',
                minimap: { enabled: false },
                automaticLayout: true,
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                tabSize: 4,
                autoIndent: 'full',
                matchBrackets: 'always',
                autoClosingBrackets: 'always',
                autoClosingQuotes: 'always',
                quickSuggestions: true,
                suggestOnTriggerCharacters: true,
                contextmenu: false,
                renderLineHighlight: 'line',
                fixedOverflowWidgets: true,
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                smoothScrolling: true,
                padding: { top: 12, bottom: 12 },
                lineDecorationsWidth: 12,
                renderWhitespace: 'none',
                guides: {
                    indentation: true,
                    bracketPairs: true,
                },
                bracketPairColorization: { enabled: true },
                scrollbar: {
                    vertical: 'auto',
                    horizontal: 'auto',
                    verticalScrollbarSize: 8,
                    horizontalScrollbarSize: 8,
                }
            });

            var isExternalUpdate = false;
            editor.onDidChangeModelContent(function (e) {
                if (!isExternalUpdate) {
                    var val = editor.getValue();
                    var msg = JSON.stringify({ type: 'CODE_CHANGE', value: val });
                    if (window.ReactNativeWebView) {
                        window.ReactNativeWebView.postMessage(msg);
                    } else {
                        window.parent.postMessage(msg, '*');
                    }
                }
            });

            window.addEventListener('message', function (event) {
                try {
                    var data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

                    if (data.type === 'CODE') {
                        if (editor.getValue() !== data.value) {
                            isExternalUpdate = true;
                            editor.setValue(data.value);
                            isExternalUpdate = false;
                        }
                    }

                    if (data.type === 'LANGUAGE') {
                        var langMap = { 71: 'python', 50: 'c', 54: 'cpp', 62: 'java', 63: 'javascript' };
                        monaco.editor.setModelLanguage(editor.getModel(), langMap[data.value] || 'javascript');
                    }

                    if (data.type === 'THEME') {
                        monaco.editor.setTheme(data.value);
                        if (data.value === 'custom-light') {
                            document.body.classList.add('light-mode');
                        } else {
                            document.body.classList.remove('light-mode');
                        }
                    }
                } catch (e) {}
            });

            var initMsg = JSON.stringify({ type: 'MOUNTED' });
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(initMsg);
            } else {
                window.parent.postMessage(initMsg, '*');
            }
        });
    </script>
</head>
<body>
    <div id="monaco-editor"></div>
</body>
</html>
`;

export const CodeEditor = ({ code, setCode, languageId = 63, isDark = false }: { code: string, setCode: (c: string) => void, languageId?: number, isDark?: boolean }) => {
    const webviewRef = useRef<any>(null);
    const iframeRef = useRef<any>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [isMounted, setIsMounted] = useState(false);

    // Dynamic states
    const themeName = isDark ? 'custom-dark' : 'custom-light';
    const editorBg = isDark ? '#0f172a' : '#FFFFFF';

    // Refs for message closure
    const codeRef = useRef(code);
    codeRef.current = code;
    const langRef = useRef(languageId);
    langRef.current = languageId;
    const themeRef = useRef(themeName);
    themeRef.current = themeName;

    const sendMessage = (msg: string) => {
        if (Platform.OS === 'web') {
            iframeRef.current?.contentWindow?.postMessage(msg, '*');
        } else {
            webviewRef.current?.postMessage(msg);
        }
    };

    const handleWebMessageData = (dataString: string) => {
        try {
            const data = JSON.parse(dataString);
            if (data.type === 'MOUNTED') {
                setIsMounted(true);
                sendMessage(JSON.stringify({ type: 'CODE', value: codeRef.current }));
                sendMessage(JSON.stringify({ type: 'LANGUAGE', value: langRef.current }));
                sendMessage(JSON.stringify({ type: 'THEME', value: themeRef.current }));
            } else if (data.type === 'CODE_CHANGE') {
                setCode(data.value);
            }
        } catch (e) { }
    };

    useEffect(() => {
        if (Platform.OS === 'web') {
            const listener = (event: any) => {
                if (typeof event.data === 'string') {
                    handleWebMessageData(event.data);
                }
            };
            window.addEventListener('message', listener);
            return () => window.removeEventListener('message', listener);
        }
    }, []);

    useEffect(() => {
        if (!isMounted) return;
        sendMessage(JSON.stringify({ type: 'LANGUAGE', value: languageId }));
    }, [languageId, isMounted]);

    useEffect(() => {
        if (!isMounted) return;
        sendMessage(JSON.stringify({ type: 'CODE', value: code }));
    }, [code, isMounted]);

    useEffect(() => {
        if (!isMounted) return;
        sendMessage(JSON.stringify({ type: 'THEME', value: themeName }));
    }, [isDark, isMounted]);

    useEffect(() => {
        if (isMounted) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }).start();
        }
    }, [isMounted]);

    if (Platform.OS === 'web') {
        return (
            <Animated.View style={[styles.container, { backgroundColor: editorBg, opacity: fadeAnim }]}>
                {!isMounted && (
                    <View style={[styles.loaderContainer, { backgroundColor: editorBg }]}>
                        <ActivityIndicator size="large" color="#1eb1f6" />
                        <Text style={[styles.loaderText, { color: '#64748b' }]}>Loading editor...</Text>
                    </View>
                )}
                {/* @ts-ignore */}
                <iframe
                    ref={iframeRef}
                    srcDoc={HTML_CONTENT}
                    style={{
                        flex: 1,
                        border: 'none',
                        backgroundColor: 'transparent',
                        width: '100%',
                        height: '100%',
                    }}
                />
            </Animated.View>
        );
    }

    return (
        <Animated.View style={[styles.container, { backgroundColor: editorBg, opacity: fadeAnim }]}>
            {!isMounted && (
                <View style={[styles.loaderContainer, { backgroundColor: editorBg }]}>
                    <ActivityIndicator size="large" color="#1eb1f6" />
                    <Text style={[styles.loaderText, { color: '#64748b' }]}>Loading editor...</Text>
                </View>
            )}
            <WebView
                ref={webviewRef}
                originWhitelist={['*']}
                source={{ html: HTML_CONTENT }}
                onMessage={(e: any) => handleWebMessageData(e.nativeEvent.data)}
                style={styles.webview}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={false}
                scrollEnabled={false}
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    webview: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    loaderContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        gap: 10,
    },
    loaderText: {
        fontSize: 12,
        fontWeight: '500',
    },
});
