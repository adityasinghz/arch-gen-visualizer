'use client';

import React, { useEffect, useState, useRef } from 'react';
import mermaid from 'mermaid';
import { Box, Button, Paper, CircularProgress, Typography, ToggleButtonGroup, ToggleButton, Stack, Alert } from '@mui/material';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import DownloadIcon from '@mui/icons-material/Download';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import ComplexityBadge from './ComplexityBadge';
import type { DiagramType, VisualizeResponse } from '@/types';

// Initialize Mermaid
mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    themeVariables: {
        primaryColor: '#06B6D4', // neon-cyan
        primaryTextColor: '#F8FAFC',
        primaryBorderColor: 'rgba(255,255,255,0.2)',
        lineColor: '#06B6D4',
        secondaryColor: '#EC4899', // neon-pink
        tertiaryColor: '#4F46E5', // neon-blue
        background: 'transparent',
        mainBkg: 'transparent',
        secondBkg: 'transparent',
        textColor: '#F8FAFC',
        fontSize: '16px',
    },
});

interface VisualizerProps {
    codeSnippet: string;
}

const Visualizer: React.FC<VisualizerProps> = ({ codeSnippet }) => {
    const [graphDefinition, setGraphDefinition] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [diagramType, setDiagramType] = useState<DiagramType>('flowchart');
    const [complexity, setComplexity] = useState<number | null>(null);
    const [renderKey, setRenderKey] = useState(0);
    const mermaidRef = useRef<HTMLDivElement>(null);

    const generateDiagram = async () => {
        if (!codeSnippet || codeSnippet.trim().length === 0) {
            setError('Please enter some code to visualize');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/visualize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: codeSnippet,
                    language: 'auto-detect', // AI will detect
                    diagramType: diagramType.toLowerCase(),
                }),
            });

            const data: VisualizeResponse = await response.json();

            if (data.error) {
                setError(data.error);
            }

            if (data.result) {
                setGraphDefinition(data.result);
                setComplexity(data.complexity || null);
                setRenderKey(prev => prev + 1); // Force re-render
            }
        } catch (err) {
            console.error('Generation failed', err);
            setError('Failed to connect to the API. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    // Render Mermaid diagram when definition changes
    useEffect(() => {
        const renderDiagram = async () => {
            if (graphDefinition && mermaidRef.current) {
                try {
                    mermaidRef.current.innerHTML = '';
                    const { svg } = await mermaid.render(`mermaid-${renderKey}`, graphDefinition);
                    mermaidRef.current.innerHTML = svg;

                    // Ensure SVG scales properly
                    const svgElement = mermaidRef.current.querySelector('svg');
                    if (svgElement) {
                        svgElement.style.maxWidth = '100%';
                        svgElement.style.height = 'auto';
                        // Remove fixed width/height attributes to allow responsive scaling
                        svgElement.removeAttribute('width');
                        svgElement.removeAttribute('height');
                    }
                } catch (err) {
                    console.error('Mermaid rendering error:', err);
                    setError('Failed to render diagram. The generated Mermaid syntax may be invalid.');
                }
            }
        };

        renderDiagram();
    }, [graphDefinition, renderKey]);

    const handleDiagramTypeChange = (_event: React.MouseEvent<HTMLElement>, newType: DiagramType | null) => {
        if (newType !== null) {
            setDiagramType(newType);
        }
    };

    const exportToSVG = () => {
        if (!mermaidRef.current) return;

        const svgElement = mermaidRef.current.querySelector('svg');
        if (!svgElement) return;

        const svgData = new XMLSerializer().serializeToString(svgElement);
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `arch-gen-diagram-${Date.now()}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <Paper
            elevation={3}
            sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: 'transparent !important', // Let glass-card handle it
                border: 'none'
            }}
            className="glass-card"
        >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={2}>
                <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Logic Flow Visualizer
                    </Typography>
                    {complexity !== null && <ComplexityBadge complexity={complexity} />}
                </Box>

                <Stack direction="row" spacing={1} alignItems="center">
                    <ToggleButtonGroup
                        value={diagramType}
                        exclusive
                        onChange={handleDiagramTypeChange}
                        size="small"
                        sx={{ mr: 1 }}
                    >
                        <ToggleButton value="flowchart">
                            Flowchart
                        </ToggleButton>
                        <ToggleButton value="class">
                            Class Diagram
                        </ToggleButton>
                    </ToggleButtonGroup>

                    <Button
                        variant="contained"
                        startIcon={<AutoGraphIcon />}
                        onClick={generateDiagram}
                        disabled={loading || !codeSnippet}
                        sx={{
                            background: 'linear-gradient(135deg, #00D9FF 0%, #00A8CC 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #5DFDFF 0%, #00D9FF 100%)',
                            },
                        }}
                    >
                        {loading ? 'Analyzing...' : 'Visualize'}
                    </Button>

                    {graphDefinition && (
                        <Button
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            onClick={exportToSVG}
                            size="small"
                        >
                            Export SVG
                        </Button>
                    )}
                </Stack>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {loading && (
                <Box display="flex" justifyContent="center" alignItems="center" flex={1}>
                    <CircularProgress size={60} />
                </Box>
            )}

            {!loading && graphDefinition && (
                <Box
                    flex={1}
                    sx={{
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 2,
                        overflow: 'hidden', // Clip content to container
                        position: 'relative',
                        minHeight: '500px', // Ensure minimum height
                    }}
                >
                    <TransformWrapper
                        initialScale={0.5}
                        minScale={0.1}
                        maxScale={3}
                        centerOnInit={true}
                        limitToBounds={false}
                    >
                        {({ zoomIn, zoomOut, resetTransform }) => (
                            <>
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 10,
                                        right: 10,
                                        zIndex: 10,
                                        display: 'flex',
                                        gap: 1,
                                    }}
                                >
                                    <Button
                                        size="small"
                                        variant="contained"
                                        onClick={() => zoomIn()}
                                        sx={{ minWidth: 40 }}
                                    >
                                        <ZoomInIcon />
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        onClick={() => zoomOut()}
                                        sx={{ minWidth: 40 }}
                                    >
                                        <ZoomOutIcon />
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        onClick={() => resetTransform()}
                                        sx={{ minWidth: 40 }}
                                        title="Reset View (50% zoom)"
                                    >
                                        <RestartAltIcon />
                                    </Button>
                                </Box>

                                <TransformComponent
                                    wrapperStyle={{
                                        width: '100%',
                                        height: '100%',
                                        overflow: 'hidden',
                                        minHeight: '500px',
                                    }}
                                    contentStyle={{
                                        width: '100%',
                                        minHeight: '500px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'flex-start',
                                        padding: '40px',
                                    }}
                                >
                                    <div
                                        ref={mermaidRef}
                                        style={{
                                            minWidth: '100%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                        }}
                                    />
                                </TransformComponent>
                            </>
                        )}
                    </TransformWrapper>
                </Box>
            )}

            {!loading && !graphDefinition && !error && (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flex={1}
                    sx={{
                        border: '2px dashed rgba(255, 255, 255, 0.2)',
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="body1" color="text.secondary">
                        Enter code and click "Visualize" to generate a diagram
                    </Typography>
                </Box>
            )}
        </Paper>
    );
};

export default Visualizer;
