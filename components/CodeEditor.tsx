'use client';

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Menu,
    MenuItem as MenuItemComponent
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { codeExamples } from '@/lib/examples';
import type { Language } from '@/types';

interface CodeEditorProps {
    value: string;
    onChange: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange }) => {
    // const [language, setLanguage] = useState<Language>('python'); // Hoisted
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleExampleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleExampleClose = () => {
        setAnchorEl(null);
    };

    const loadExample = (exampleName: string) => {
        const example = codeExamples.find(ex => ex.name === exampleName);
        if (example) {
            onChange(example.code);
        }
        handleExampleClose();
    };

    return (
        <Paper
            elevation={3}
            sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: 'transparent !important',
                border: 'none'
            }}
            className="glass-card"
        >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CodeIcon /> Code Editor
                </Typography>

                <Box display="flex" gap={2} alignItems="center">
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<PlaylistAddIcon />}
                        onClick={handleExampleClick}
                    >
                        Load Example
                    </Button>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleExampleClose}
                    >
                        {codeExamples.map((example) => (
                            <MenuItemComponent
                                key={example.name}
                                onClick={() => loadExample(example.name)}
                            >
                                <Box>
                                    <Typography variant="body2" fontWeight={600}>
                                        {example.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {example.description}
                                    </Typography>
                                </Box>
                            </MenuItemComponent>
                        ))}
                    </Menu>
                </Box>
            </Box>

            <Box
                flex={1}
                sx={{
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                    overflow: 'hidden',
                }}
            >
                <Editor
                    height="100%"
                    defaultLanguage="python"
                    value={value}
                    onChange={(newValue) => onChange(newValue || '')}
                    theme="vs-dark"
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        roundedSelection: true,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 2,
                        wordWrap: 'on',
                        padding: { top: 16, bottom: 16 },
                    }}
                />
            </Box>
        </Paper>
    );
};

export default CodeEditor;
