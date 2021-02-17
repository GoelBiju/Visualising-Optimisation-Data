import { Card, CardContent, Link, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

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

    // TODO: Use a standard link instead of a react-router link: https://material-ui.com/components/links/
    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography variant="h5" component="h2">
                    <Link href={`/runs/${runId}/visualisations/${visualisationName}/data`}>{displayName}</Link>
                </Typography>
            </CardContent>
        </Card>
    );
};

export default VisualisationCard;
