import { Card, CardContent, Link, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            minWidth: 275,
            padding: theme.spacing(2),
            textAlign: 'left',
        },
    }),
);

interface InfoCardProps {
    id: string;
    title: string;
    problem: string;
    created: string;
    currentGeneration: number;
    totalGenerations: number;
    graphs: string[];
}

const RunCard = (props: InfoCardProps): React.ReactElement => {
    const classes = useStyles();

    const { id, title, problem, created, currentGeneration, totalGenerations, graphs } = props;

    return (
        <Card className={classes.root}>
            <CardContent>
                <Link component={RouterLink} to={`/runs/${id}/visualisations`}>
                    <Typography variant="h5" component="h2">
                        {title}
                    </Typography>
                </Link>

                <div>
                    <p>
                        <strong>Problem:</strong> {problem}
                    </p>
                    <p>
                        <strong>Current Generation:</strong> {currentGeneration}
                    </p>
                    <p>
                        <strong>Total Generations:</strong> {totalGenerations}
                    </p>
                    <p>
                        <strong>Created:</strong> {new Date(created).toLocaleString()}
                    </p>
                    <p>
                        <strong>Graphs:</strong> {graphs.join(', ')}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default RunCard;
