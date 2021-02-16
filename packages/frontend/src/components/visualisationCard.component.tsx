import { Card, CardContent, Link, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

interface VisualisationCardProps {
    runId: string;
    visualisationName: string;
    displayName: string;
}

const VisualisationCard = (props: VisualisationCardProps): React.ReactElement => {
    const classes = useStyles();

    const { runId, visualisationName, displayName } = props;

    return (
        <Card className={classes.root}>
            <CardContent>
                <Link component={RouterLink} to={`/runs/${runId}/visualisations/${visualisationName}/data`}>
                    <Typography variant="h5" component="h2">
                        {displayName}
                    </Typography>
                </Link>
            </CardContent>
        </Card>
    );
};

export default VisualisationCard;
