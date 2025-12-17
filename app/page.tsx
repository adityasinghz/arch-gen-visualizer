'use client';

import React, { useState } from 'react';
import { Box, Container, Typography, Paper, Chip } from '@mui/material';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import CodeEditor from '@/components/CodeEditor';
import Visualizer from '@/components/Visualizer';
import AuroraBackground from '@/components/AuroraBackground';
import { codeExamples } from '@/lib/examples';

const Home = () => {
  const [code, setCode] = useState(codeExamples[0].code);

  return (
    <Box sx={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <AuroraBackground />

      <Container
        maxWidth={false}
        sx={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          p: 3
        }}
      >
        {/* Holographic Header */}
        <Box
          component={Paper}
          className="glass-card"
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(20, 27, 61, 0.25) !important'
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <AutoGraphIcon sx={{ fontSize: 32, color: 'var(--neon-cyan)', filter: 'drop-shadow(0 0 8px var(--neon-cyan))' }} />
            <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '1px' }}>
              ARCH-GEN <span style={{ color: 'var(--neon-cyan)', fontSize: '0.8em' }}>// VISUALIZER</span>
            </Typography>
          </Box>

          <Chip
            label="SYSTEM ONLINE"
            size="small"
            sx={{
              border: '1px solid var(--neon-cyan)',
              background: 'rgba(6, 182, 212, 0.1)',
              color: 'var(--neon-cyan)',
              fontWeight: 600,
              boxShadow: '0 0 10px rgba(6, 182, 212, 0.2)'
            }}
          />
        </Box>

        {/* Main Content Area */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            gap: 3,
            minHeight: 0, // Critical for flex scrolling
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <CodeEditor
              value={code}
              onChange={setCode}
            />
          </Box>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Visualizer
              codeSnippet={code}
            />
          </Box>
        </Box>

        {/* Footer info (minimal) */}
        <Typography
          variant="caption"
          sx={{
            textAlign: 'center',
            mt: 1,
            color: 'var(--text-secondary)',
            opacity: 0.6
          }}
        >
          DESIGNED BY ADITYA SINGH :: v2.0-HOLO
        </Typography>
      </Container>
    </Box>
  );
};
export default Home;
