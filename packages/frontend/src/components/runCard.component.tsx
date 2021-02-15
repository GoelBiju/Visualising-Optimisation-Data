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

interface InfoCardProps {
    id: string;
    title: string;
    problem: string;
    created: string;
    generations: number;
    graphs: string[];
}

const RunCard = (props: InfoCardProps): React.ReactElement => {
    const classes = useStyles();

    const { id, title, problem, created, generations, graphs } = props;

    return (
        <Card className={classes.root}>
            <CardContent>
                <Link component={RouterLink} to={`/runs/${id}/visualisations`}>
                    <Typography variant="h5" component="h2">
                        {title}
                    </Typography>
                </Link>

                <div>Problem: {problem}</div>
                <div>Generations: {generations}</div>
                <div>Created: {new Date(created).toLocaleString()}</div>
                <div>Graphs: {graphs.join(',')}</div>
            </CardContent>
        </Card>
    );
};

export default RunCard;
