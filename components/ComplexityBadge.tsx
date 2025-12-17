import React from 'react';
import { Chip, Tooltip } from '@mui/material';
import { ComplexityMetrics } from '@/types';

interface ComplexityBadgeProps {
    complexity: number;
}

const getComplexityMetrics = (score: number): ComplexityMetrics => {
    if (score <= 5) {
        return {
            score,
            level: 'low',
            description: 'Simple and easy to maintain',
        };
    } else if (score <= 10) {
        return {
            score,
            level: 'medium',
            description: 'Moderate complexity, maintainable',
        };
    } else {
        return {
            score,
            level: 'high',
            description: 'High complexity, consider refactoring',
        };
    }
};

const ComplexityBadge: React.FC<ComplexityBadgeProps> = ({ complexity }) => {
    const metrics = getComplexityMetrics(complexity);

    const getColor = () => {
        switch (metrics.level) {
            case 'low':
                return 'success';
            case 'medium':
                return 'warning';
            case 'high':
                return 'error';
            default:
                return 'default';
        }
    };

    return (
        <Tooltip
            title={`Cyclomatic Complexity: ${metrics.score} - ${metrics.description}`}
            arrow
        >
            <Chip
                label={`Complexity: ${metrics.score}`}
                color={getColor()}
                size="small"
                sx={{
                    fontWeight: 600,
                    fontSize: '0.75rem',
                }}
            />
        </Tooltip>
    );
};

export default ComplexityBadge;
