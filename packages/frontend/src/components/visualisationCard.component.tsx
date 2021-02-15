import { Card } from '@material-ui/core';
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

const VisualisationCard = (): React.ReactElement => {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            {/* <CardContent>
                <Link component={RouterLink} to={`/runs/${runId}/visualisations`}>
                    <Typography variant="h5" component="h2">
                        {displayName}
                    </Typography>
                </Link>

                <div>Problem: {problem}</div>
                <div>Generations: {generations}</div>
                <div>Created: {new Date(created).toLocaleString()}</div>
                <div>Graphs: {graphs.join(',')}</div>
            </CardContent> */}
        </Card>
    );
};

export default VisualisationCard;
